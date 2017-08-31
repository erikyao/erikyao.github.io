---
layout: post
title: "Python: Put simply, generators are special coroutines"
description: ""
category: Python
tags: [Python-101]
---
{% include JB/setup %}

## `next(coro) == coro.send(None)`

Last post [Python: Yes, coroutines are complicated, but they can be used as simply as generators](/python/2017/08/29/python-yes-coroutines-are-complicated-but-they-can-be-used-as-simply-as-generators) raised me two interesting questions: why can `next(coro)` and `coro.send(None)` both serve as primers of coroutines? Is there any connection between them?

I checked the CPython code and found that, **generators are special coroutines**! Yes, they actually work the same way!

```c
/* --------------------------------------------------------------------------
See https://github.com/python/cpython/blob/master/Objects/genobject.c
-------------------------------------------------------------------------- */

PyDoc_STRVAR(send_doc,
"send(arg) -> send 'arg' into generator,\n\
return next yielded value or raise StopIteration.");

PyObject *
_PyGen_Send(PyGenObject *gen, PyObject *arg)
{
    return gen_send_ex(gen, arg, 0, 0);
}

static PyObject *
gen_iternext(PyGenObject *gen)
{
    return gen_send_ex(gen, NULL, 0, 0);
}

static PyObject *
gen_send_ex(PyGenObject *gen, PyObject *arg, int exc, int closing)
{
    PyThreadState *tstate = PyThreadState_GET();
    PyFrameObject *f = gen->gi_frame;
    PyObject *result;

    if (gen->gi_running) {
        char *msg = "generator already executing";
        if (PyCoro_CheckExact(gen)) {
            msg = "coroutine already executing";
        }
        else if (PyAsyncGen_CheckExact(gen)) {
            msg = "async generator already executing";
        }
        PyErr_SetString(PyExc_ValueError, msg);
        return NULL;
    }
    if (f == NULL || f->f_stacktop == NULL) {
        if (PyCoro_CheckExact(gen) && !closing) {
            /* `gen` is an exhausted coroutine: raise an error,
               except when called from gen_close(), which should
               always be a silent method. */
            PyErr_SetString(
                PyExc_RuntimeError,
                "cannot reuse already awaited coroutine");
        }
        else if (arg && !exc) {
            /* `gen` is an exhausted generator:
               only set exception if called from send(). */
            if (PyAsyncGen_CheckExact(gen)) {
                PyErr_SetNone(PyExc_StopAsyncIteration);
            }
            else {
                PyErr_SetNone(PyExc_StopIteration);
            }
        }
        return NULL;
    }

    if (f->f_lasti == -1) {  // ANCHOR-1
        if (arg && arg != Py_None) {
            char *msg = "can't send non-None value to a "
                        "just-started generator";
            if (PyCoro_CheckExact(gen)) {
                msg = NON_INIT_CORO_MSG;
            }
            else if (PyAsyncGen_CheckExact(gen)) {
                msg = "can't send non-None value to a "
                      "just-started async generator";
            }
            PyErr_SetString(PyExc_TypeError, msg);
            return NULL;
        }
    } else {
        /* Push arg onto the frame's value stack */
        result = arg ? arg : Py_None;
        Py_INCREF(result);
        *(f->f_stacktop++) = result;  // ANCHOR-2
    }

    /* Generators always return to their most recent caller, not
     * necessarily their creator. */
    Py_XINCREF(tstate->frame);
    assert(f->f_back == NULL);
    f->f_back = tstate->frame;

    gen->gi_running = 1;
    result = PyEval_EvalFrameEx(f, exc);  // ANCHOR-3
    gen->gi_running = 0;

    /* Don't keep the reference to f_back any longer than necessary.  It
     * may keep a chain of frames alive or it could create a reference
     * cycle. */
    assert(f->f_back == tstate->frame);
    Py_CLEAR(f->f_back);

    /* If the generator just returned (as opposed to yielding), signal
     * that the generator is exhausted. */
    if (result && f->f_stacktop == NULL) {
        if (result == Py_None) {
            /* Delay exception instantiation if we can */
            if (PyAsyncGen_CheckExact(gen)) {
                PyErr_SetNone(PyExc_StopAsyncIteration);
            }
            else {
                PyErr_SetNone(PyExc_StopIteration);
            }
        }
        else {
            /* Async generators cannot return anything but None */
            assert(!PyAsyncGen_CheckExact(gen));
            _PyGen_SetStopIterationValue(result);  // ANCHOR-4
        }
        Py_CLEAR(result);
    }
    else if (!result && PyErr_ExceptionMatches(PyExc_StopIteration)) {
        /* Check for __future__ generator_stop and conditionally turn
         * a leaking StopIteration into RuntimeError (with its cause
         * set appropriately). */

        const int check_stop_iter_error_flags = CO_FUTURE_GENERATOR_STOP |
                                                CO_COROUTINE |
                                                CO_ITERABLE_COROUTINE |
                                                CO_ASYNC_GENERATOR;

        if (gen->gi_code != NULL &&
            ((PyCodeObject *)gen->gi_code)->co_flags &
                check_stop_iter_error_flags)
        {
            /* `gen` is either:
                  * a generator with CO_FUTURE_GENERATOR_STOP flag;
                  * a coroutine;
                  * a generator with CO_ITERABLE_COROUTINE flag
                    (decorated with types.coroutine decorator);
                  * an async generator.
            */
            const char *msg = "generator raised StopIteration";
            if (PyCoro_CheckExact(gen)) {
                msg = "coroutine raised StopIteration";
            }
            else if PyAsyncGen_CheckExact(gen) {
                msg = "async generator raised StopIteration";
            }
            _PyErr_FormatFromCause(PyExc_RuntimeError, "%s", msg);
        }
        else {
            /* `gen` is an ordinary generator without
               CO_FUTURE_GENERATOR_STOP flag.
            */

            PyObject *exc, *val, *tb;

            /* Pop the exception before issuing a warning. */
            PyErr_Fetch(&exc, &val, &tb);

            if (PyErr_WarnFormat(PyExc_DeprecationWarning, 1,
                                 "generator '%.50S' raised StopIteration",
                                 gen->gi_qualname)) {
                /* Warning was converted to an error. */
                Py_XDECREF(exc);
                Py_XDECREF(val);
                Py_XDECREF(tb);
            }
            else {
                PyErr_Restore(exc, val, tb);
            }
        }
    }
    else if (PyAsyncGen_CheckExact(gen) && !result &&
             PyErr_ExceptionMatches(PyExc_StopAsyncIteration))
    {
        /* code in `gen` raised a StopAsyncIteration error:
           raise a RuntimeError.
        */
        const char *msg = "async generator raised StopAsyncIteration";
        _PyErr_FormatFromCause(PyExc_RuntimeError, "%s", msg);
    }

    if (!result || f->f_stacktop == NULL) {
        /* generator can't be rerun, so release the frame */
        /* first clean reference cycle through stored exception traceback */
        PyObject *t, *v, *tb;
        t = f->f_exc_type;
        v = f->f_exc_value;
        tb = f->f_exc_traceback;
        f->f_exc_type = NULL;
        f->f_exc_value = NULL;
        f->f_exc_traceback = NULL;
        Py_XDECREF(t);
        Py_XDECREF(v);
        Py_XDECREF(tb);
        gen->gi_frame->f_gen = NULL;
        gen->gi_frame = NULL;
        Py_DECREF(f);
    }

    return result;  // ANCHOR-5
}
```

So basically, `next(gen_or_coro)` is identical to `gen_or_coro.send(None)` except that you cannot send a non-`None` value to a just-started generator or coroutine (shown at `// ANCHOR-1`). That is to say, 

- You can use `.send()` on generators
- You can use `next()` on coroutines, sending `None` values to them underneath.

Every generator or coroutine maintains a **frame**, something similar to a _stack frame_ or _activity record_ mentioned in [Linking, Loading and Library](/os/2016/06/29/linking-loading-and-library). 

- `PyGenObject` is defined in [`cpython/Include/genobject.h`](https://github.com/python/cpython/blob/master/Include/genobject.h)
- `PyFrameObject` is defined in [`cpython/Include/frameobject.h`](https://github.com/python/cpython/blob/master/Include/frameobject.h)

Every time you call `gen_or_coro.send(x)`, `x` is pushed the stack in the frame of `gen_or_coro` (shown at `// ANCHOR-2`). Then python would "evaluate this frame" (shown at `// ANCHOR-3`), i.e. continue running `gen_or_coro` to its next `yield`. 

```c
/* --------------------------------------------------------------------------
See https://github.com/python/cpython/blob/master/Python/ceval.c
-------------------------------------------------------------------------- */

PyObject *
PyEval_EvalFrameEx(PyFrameObject *f, int throwflag)
{
    PyThreadState *tstate = PyThreadState_GET();
    return tstate->interp->eval_frame(f, throwflag);
}

PyObject* _Py_HOT_FUNCTION
_PyEval_EvalFrameDefault(PyFrameObject *f, int throwflag)
{
    // This is a function over 3000 lines...
}

/* --------------------------------------------------------------------------
See https://github.com/python/cpython/blob/master/Python/pystate.c
-------------------------------------------------------------------------- */

PyInterpreterState *
PyInterpreterState_New(void)
{
    PyInterpreterState *interp = (PyInterpreterState *)
                                 PyMem_RawMalloc(sizeof(PyInterpreterState));

    if (interp != NULL) {
        HEAD_INIT();
#ifdef WITH_THREAD
        if (head_mutex == NULL)
            Py_FatalError("Can't initialize threads for interpreter");
#endif
        interp->modules = NULL;
        interp->modules_by_index = NULL;
        interp->sysdict = NULL;
        interp->builtins = NULL;
        interp->builtins_copy = NULL;
        interp->tstate_head = NULL;
        interp->codec_search_path = NULL;
        interp->codec_search_cache = NULL;
        interp->codec_error_registry = NULL;
        interp->codecs_initialized = 0;
        interp->fscodec_initialized = 0;
        interp->importlib = NULL;
        interp->import_func = NULL;
        interp->eval_frame = _PyEval_EvalFrameDefault;
        interp->co_extra_user_count = 0;
#ifdef HAVE_DLOPEN
#if HAVE_DECL_RTLD_NOW
        interp->dlopenflags = RTLD_NOW;
#else
        interp->dlopenflags = RTLD_LAZY;
#endif
#endif
#ifdef HAVE_FORK
        interp->before_forkers = NULL;
        interp->after_forkers_parent = NULL;
        interp->after_forkers_child = NULL;
#endif

        HEAD_LOCK();
        interp->next = interp_head;
        if (interp_main == NULL) {
            interp_main = interp;
        }
        interp_head = interp;
        if (_next_interp_id < 0) {
            /* overflow or Py_Initialize() not called! */
            PyErr_SetString(PyExc_RuntimeError,
                            "failed to get an interpreter ID");
            interp = NULL;
        } else {
            interp->id = _next_interp_id;
            _next_interp_id += 1;
        }
        HEAD_UNLOCK();
    }

    return interp;
}
```

I can't dive into `_PyEval_EvalFrameDefault` to see how it works but experiments told me that `result = PyEval_EvalFrameEx(f, exc);` (at `// ANCHOR-3`) is finally returned at `// ANCHOR-5` to `gen_or_coro.send(x)`, and this is the exactly the valued `yield`ed by `gen_or_coro`.

_**From the second call**_ of `next()` or `send()` on, the value stored in the top of the frame stack is assigned to some variable `y` if there is a statement `y = yield [whatever]` in `gen_or_coro`, or is discarded at statement `yield [whatever]` if `gen_or_coro` is a plain generator (because you are not going to assign this `x` to any variable). 

- I guess, for `y = yield [whatever]`, 
    - the first `PyEval_EvalFrameEx` call handles only the `yield` part;
    - the second `PyEval_EvalFrameEx` call handles the assignment `y = ???` and then go to next `yield`
        - `???` comes from the stack top
        - Experiments told me that the assignment of `y = x` happens before `send(x)` returns.
- The execution order inside `send(x)` is always
    1. Push `x` to stack top
    1. Evaluate to next `yield` (may or may not include an `??? = x` assignment operation)
    1. Return the `yield`ed value to the caller of `send()`
- Recall that `next(gen_or_coro)` is identical to `gen_or_coro.send(None)`, so every time you call `next()` on a plain generator, the `None` value you send underneath is discarded.

Therefore, you can see that `yield [whatever]` statement in plain generators and `y = yield [whatever]` statement in coroutines worked the same way.

```python
def plain_generator():
    yield  # If there is no argument after `yield`, yield `None`
    yield
    yield

def simple_coroutine():
    x = yield  # If there is no argument after `yield`, yield `None`
    y = yield
    z = yield

    print("[simple_coroutine] after 3 yields, x = {}, y = {}, z = {}".format(x, y, z))

def client_1():
    my_gen = plain_generator()
    my_coro = simple_coroutine()

    # `list()` will call `next(gen_or_coro)` until StopIteration
    print(list(yield_from(my_gen)))
    print("------------------")
    print(list(yield_from(my_coro)))

def client_2():
    my_gen = plain_generator()
    my_coro = simple_coroutine()

    # Call `send` on a generator; call `next` on a coroutine.
    print(next(my_gen))
    print(my_gen.send('foo'))
    print("------------------")
    print(my_coro.send(None))
    print(next(my_coro))
    print(next(my_coro))

client_1()

# Output:
"""
[None, None, None]
------------------
[simple_coroutine] after 3 yields, x = None, y = None, z = None
[None, None, None]
"""

client_2()

# Output:
"""
None
None
------------------
None
None
None
[simple_coroutine] after 3 yields, x = None, y = None, z = 5
---------------------------------------------------------------------------
StopIteration                             Traceback (most recent call last)
<ipython-input-83-8abb26b63318> in <module>()
     34 
     35 client_1()
---> 36 client_2()

<ipython-input-83-8abb26b63318> in client_2()
     31     print(next(my_coro))
     32     print(next(my_coro))
---> 33     print(my_coro.send(5))
     34 
     35 client_1()

StopIteration: 
"""
```

In summary, in the following code, 

```python
foo, bar, baz, qux, alpha, beta = "foo", "bar", "baz", "qux", "alpha", "beta"

def plain_generator():
    yield foo
    yield bar

def simple_coroutine():
    y = yield baz
    print("y =", y)
    z = yield qux
    print("z =", z)

def client():
    my_gen = plain_generator()
    my_coro = simple_coroutine()

    ret_1 = next(my_gen)
    ret_2 = my_gen.send(alpha)

    ret_3 = next(my_coro)
    ret_4 = my_coro.send(beta)
    
    print(ret_1, ret_2, ret_3, ret_4)
    
client()

# Output:
"""
y = beta
foo bar baz qux
"""
```

- `next(my_gen)`:
    1. Push `None` to the stack top
    1. Make no assignment
    1. Evaluate `yield foo`; `foo` is returned to this `next` call. 
        - Therefore `ret_1 == foo`
- `my_gen.send(alpha)`:
    1. Push `alpha` to the stack top
    1. Make no assignment
    1. Evaluate `yield bar`; `bar` is returned to this `send` call. 
        - Therefore `ret_2 == bar`
- `next(my_coro)`:
    1. Push `None` to the stack top
    1. Make no assignment
    1. Evaluate `yield baz`; `baz` is returned to this `send` call. 
        - Therefore `ret_3 == baz`
- `my_coro.send(beta)`：
    1. Push `beta` to the stack top
    1. Make an assignment `y = beta`
    1. Evaluate `yield qux`; `qux` is returned to this `send` call. 
        - Therefore `ret_4 == qux`
- P.S. Assignment of `z` does not happen yet

## Let's move to `yield from`