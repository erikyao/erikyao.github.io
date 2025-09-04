# Chapter 1 - The Python Data Model 

This chapter focus on special methods, i.e. dunder methods.

| code | interpreted as | comment |
| ---- | -------------- | ------- |
| `f = Foo(args)` | `f = Foo.__new__(args).__init__(args)` | |
| `obj[key]` | `obj.__getitem__(key)` | |
| `obj.foo` / `getattr(obj, "foo")` | `obj.__getattribute__("foo")` | |
| `len(obj)` | `obj.__len__(key)` | |
| if `x` in `obj`: | if `obj.__contains__(x)`: | If `__contains__()` is not available, Python will scan with `__getitem__()`. |
| for `x` in `obj`: | `iterator = obj.__iter__()` is implicitly called at the start of loops; `x = iterator.__next__()` is the next value and is implicitly called at each loop increment. | If neither is available, Python will scan with `__getitem__()`. |
| `o1` + `o2` | `o1.__add__(o2)` | |
| `o1` += `o2` | `o1.__iadd__(o2)` | "in-place addition". If `__iadd__()` is not implemented, `+=` falls back to calling `__add__()` |
| `abs(obj)` | `obj.__abs__()` | |
| `obj` * 3 | `obj.__mul__(3)` | |
| if `obj`: | if `obj.__bool__()`: | If `__bool__()` is not implemented, Python tries to invoke `__len__()`, and if $>0$, returns `False`. Otherwise `True`. |
| `repr(obj)` | `obj.__rper__()` | `"%s" % obj` will call `repr(obj)`. |
| `str(obj)` | `obj.__str__()` | `print(obj)`, `"%s" % obj` and `"{}".format(obj)` will call `str(obj)`; if `__str__` is not available, will fall back to `__repr__()`. | |

## `__new__(cls, arg)` / `__init__(self, arg)` 

We often refer to `__init__` as the constructor method, but that’s because we adopted jargon from other languages. The special method that actually constructs an instance is `__new__`: 

- it’s a class method (but gets special treatment, so the `@classmethod` decorator is not used), and 
- it must return an instance

The construction workflow is like:

- If `__new__()` returns an instance of `cls` $\Rightarrow$ 
	- that instance will in turn be passed as the first argument `self` to `__init__` 
	- other arguments as passed as-is to `__init__`
- Otherwise $\Rightarrow$ the new instance’s `__init__()` will not be invoked

```python
# pseudo-code for object construction
def new_object(cls, *args):
	self = cls.__new__(*args)
	if isinstance(self, cls):
		cls.__init__(self, *args)
	return self

# the following statements are roughly equivalent
x = Foo('bar')
x = new_object(Foo, 'bar')
```

`__new__()` is intended mainly to allow subclasses of immutable types (like `int`, `str`, or `tuple`) to customize instance creation. It is also commonly overridden in custom metaclasses in order to customize class creation.
{: .notice--info}

## `__getitem__()` 

We say "`__getitem__` method delegates to `[]` operator". And once the delegation is implemented, slicing, `if-in` boolean operation, `for-in` iteration, and `random.choice()` on the object is automatically supported.

```python
from random import choice


class MyList:
    def __init__(self, *args):
        self.inner_list = list(args)

    def __len__(self):
        print("__len__ is being called...")
        return len(self.inner_list)

    def __getitem__(self, position):
        print("__getitem__ at position {}...".format(position))
        return self.inner_list[position]


if __name__ == '__main__':
    ml = MyList(50, 60, 70, 80)

    print(len(ml))  # 4

    print(ml[0])  # 50
    print(ml[-1])  # 80
    print(ml[0:2])  # [50, 60]

    for i in ml:
        print i

    print(40 in ml)  # False

    print(choice(ml))  # randomly pick an element
```

## `__getattribute__()` / `__getattr__()` / `getattr()` 

- `obj[key] == obj.__getitem__(key)` 
- `obj.foo == obj.__getattribute__("foo")` (Note the quote marks)

`__getattr__()` does not delegates to `.` operator for attribute accessing, but is called when an attribute lookup **FAILS** (What a misleading function name!).

`getattr()` is a built-in function, whose logic is like:

```python
def getattr(obj, name[, default]):
	try:
		return obj.__getattribute__(name)
	except AttributeError as ae:
		if default is passed:
			return default
		else:
			raise ae
```

Of course you can implement a similar mechanism of default values in `__getattr__()`, e.g. for all `obj.xxx` where `xxx` is not an attribute of `obj`, log this call.
{: .notice--info}

Note that attributes can be functions, so it is possible to write `getattr(obj, func_name)(param)`.
{: .notice--info}

You may not want to override `__getattribute__()` yourself but if you somehow got a chance, pay attention to possible infinite loops caused by any form of `self.xxx` inside the implementation of `__getattribute__()`. Instead use base class method with the same name to access `xxx`, for example, `object.__getattribute__(self, "xxx")`. E.g.:

```python
class C(object):
    def __init__(self):
        self.x = 100

    def __getattribute__(self, name):
        # Wrong! AttributeError
        # return self.__dict__[name]

        # OK! Calling base class's __getattribute__()
        return object.__getattribute__(self, name)

        # OK! Calling C's overridden version of __getattribute__() 
        # return super().__getattribute__(name)
```

## `__iter__()` and `__next__()` 

You can treat your own object as an iterator, so `obj.__iter__()` can `return self` and a `__next__()` implementation can be put inside your own object. 

## `__repr__()` vs `__str__()` 

The string returned by `__repr__()` should be unambiguous and, if possible, match the source code necessary to re-create the object being represented. I.e. if possible, we would have

```python
b = eval(repr(a))
assert a == b
```

A recommended way of implementing `__repr__` is to return a string of a constructor call:

```python
class BetterClass(object):
    def __init__(self, x, y):
		...

	def __repr__(self):
        return "BetterClass(%d,	%d)" % (self.x, self.y)
```

`__str__()` should return a string suitable for display to end users.

If you only implement one of these special methods, choose `__repr__()`, because when no custom `__str__()` is available, Python will call `__repr__()` as a fallback.
{: .notice--info}
