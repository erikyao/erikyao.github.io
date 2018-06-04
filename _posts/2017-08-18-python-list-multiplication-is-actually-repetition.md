---
layout: post
title: "Python: List multiplication is actually repetition"
description: ""
category: Python
tags: []
---
{% include JB/setup %}

之前遇到过这么一个例子：

```python
>>> bar = [None] * 3
>>> bar
[None, None, None]
>>> bar[0] = 1
>>> bar
[1, None, None]
```

```python
>>> baz = [[None]] * 3
>>> baz
[[None], [None], [None]]
>>> baz[0][0] = 1
>>> baz  # Holy!
[[1], [1], [1]]
```

```python
>>> qux = [[None] for i in range(3)]
>>> qux
[[None], [None], [None]]
>>> qux[0][0] = 1
>>> qux
[[1], [None], [None]]
```

简单说来：list 的 `*` 操作其实是 repetition，并不涉及 copy 操作（shallow 和 deep copy 都没有）。

`bar` 和 `baz` 都是 list repetition，它们的区别在于赋值操作的性质上，而不是因为 repetition 对 "元素是 `None`" 和 "元素是一个 list" 的待遇不同（看它源码就知道它并没有对 list 的元素做类型检查）；`qux` 不是 list repetition 而是 generator 得来的，它有实实在在地在 clone。

我们来看一下源代码：

```c
// https://github.com/python/cpython/blob/master/Include/listobject.h#L23

typedef struct {
    PyObject_VAR_HEAD
    /* Vector of pointers to list elements.  list[0] is ob_item[0], etc. */
    PyObject **ob_item;

    /* ob_item contains space for 'allocated' elements.  The number
     * currently in use is ob_size.
     * Invariants:
     *     0 <= ob_size <= allocated
     *     len(list) == ob_size
     *     ob_item == NULL implies ob_size == allocated == 0
     * list.sort() temporarily sets allocated to -1 to detect mutations.
     *
     * Items must normally not be NULL, except during construction when
     * the list is not yet visible outside the function that builds it.
     */
    Py_ssize_t allocated;
} PyListObject;
```

```c
// https://github.com/wklken/Python-2.7.8/blob/master/Include/object.h#L124

#define Py_SIZE(ob)             (((PyVarObject*)(ob))->ob_size)
```

```c
// http://svn.python.org/projects/stackless/branches/release30-maint/Objects/listobject.c

static PyObject *
list_repeat(PyListObject *a, Py_ssize_t n)
{
	Py_ssize_t i, j;
	Py_ssize_t size;
	PyListObject *np;
	PyObject **p, **items;
	PyObject *elem;
	if (n < 0)
		n = 0;
	size = Py_SIZE(a) * n;
	if (n && size/n != Py_SIZE(a))
		return PyErr_NoMemory();
	if (size == 0)
		return PyList_New(0);
	np = (PyListObject *) PyList_New(size);
	if (np == NULL)
		return NULL;

	items = np->ob_item;
	if (Py_SIZE(a) == 1) {  // `bar` and `baz` go here
		elem = a->ob_item[0];
		for (i = 0; i < n; i++) {
			items[i] = elem;
			Py_INCREF(elem);
		}
		return (PyObject *) np;
	}
	p = np->ob_item;
	items = a->ob_item;
	for (i = 0; i < n; i++) {
		for (j = 0; j < Py_SIZE(a); j++) {
			*p = items[j];
			Py_INCREF(*p);
			p++;
		}
	}
	return (PyObject *) np;
}

int
PyList_SetItem(register PyObject *op, register Py_ssize_t i,
               register PyObject *newitem)
{
	register PyObject *olditem;
	register PyObject **p;
	if (!PyList_Check(op)) {
		Py_XDECREF(newitem);
		PyErr_BadInternalCall();
		return -1;
	}
	if (i < 0 || i >= Py_SIZE(op)) {
		Py_XDECREF(newitem);
		PyErr_SetString(PyExc_IndexError,
				"list assignment index out of range");
		return -1;
	}
	p = ((PyListObject *)op) -> ob_item + i;
	olditem = *p;
	*p = newitem;
	Py_XDECREF(olditem);
	return 0;
}
```

我觉得 `Py_SIZE(bar)` 和 `Py_SIZE(baz)` 应该都是 1，因为 `len([None]) == len([[None]]) == 1`。

上面的例子可以简单理解为：

```c
bar = [
    ob_item    -> p -> None,
    ob_item + 1-> p -> None,
    ob_item + 2-> p -> None,
]

// After bar[0] = 1

bar = [
    ob_item    -> newitem -> 1,  // 修改了指针
    ob_item + 1-> p -> None,
    ob_item + 2-> p -> None,
]
```

```c
baz = [
    ob_item     -> p -> [None],
    ob_item + 1 -> p -> [None],
    ob_item + 2 -> p -> [None],
]

// After baz[0][0] = 1

baz = [
    ob_item     -> p -> [1],  // 修改了指针的内容
    ob_item + 1 -> p -> [1],
    ob_item + 2 -> p -> [1],
]
```

```c
qux = [
    ob_item     -> p -> [None],
    ob_item + 1 -> q -> [None],
    ob_item + 2 -> r -> [None],
]

// After qux[0][0] = 1

qux = [
    ob_item     -> p -> [1],  // 修改了指针的内容
    ob_item + 1 -> q -> [None],
    ob_item + 2 -> r -> [None],
]
```

更多参考阅读：

- [C: Pointer Arithmetic](/c/2015/03/20/c-pointer-arithmetic)
- [PYTHON 源码阅读 - 对象](http://www.wklken.me/posts/2014/08/05/python-source-object.html)