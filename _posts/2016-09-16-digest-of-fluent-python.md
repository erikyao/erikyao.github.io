---
layout: post
title: "Digest of <i>Fluent Python</i>"
description: ""
category: Python
tags: [Book, Python-101]
---
{% include JB/setup %}

[2-1-mutable-seq-class-diagram]: https://farm9.staticflickr.com/8299/29123468724_7b9f9247ae_o_d.png

## Chapter 1 - The Python Data Model

This chapter focus on special methods, i.e. dunder methods。

| code | interpreted as | comment |
| ---- | -------------- | ------- |
| `obj[key]` | `obj.__getitem__(key)` | |
| `len(obj)` | `obj.__len__(key)` | |
| if `x` in `obj`: | if `obj.__contains__(x)`: | If `__contains__` is not available, Python will scan with `__getitem__`. |
| for `x` in `obj`: | `iterator = obj.__iter__()` is implicitly called at the start of loops; `x = iterator.__next__()` is the next value and is implicitly called at each loop increment. | If neither is available, Python will scan with `__getitem__`. |
| `o1` + `o2` | `o1.__add__(o2)` | |
| `abs(obj)` | `obj.__abs__()` | |
| `obj` * 3 | `obj.__mul__(3)` | |
| if `obj`: | if `obj.__bool__()`: | If `__bool__` is not implemented, Python tries to invoke `__len__`, and if $>0$, returns `False`. Otherwise `True`. |
| `repr(obj)` | `obj.__rper__()` | `"%s" % obj` will call `repr(obj)`. |
| `str(obj)` | `obj.__str__()` | `print(obj)`, `"%s" % obj` and `"{}".format(obj)` will call `str(obj)`; if `__str__` is not available, will fall back to `__repr__`. | |

### `__getitem__()`

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

### `__iter__` and `__next__`

You can treat your own object as an iterator, so `obj.__iter__()` can `return self` and a `__next__` implementation can be put inside your own object. 

### `__repr__` vs `__str__`

The string returned by `__repr__` should be unambiguous and, if possible, match the source code necessary to re-create the object being represented. 

`__str__` should return a string suitable for display to end users.

If you only implement one of these special methods, choose `__repr__`, because when no custom `__str__` is available, Python will call `__repr__` as a fallback.

## Chapter 2 - An array of Sequences

### 2.1 Overview of Built-In Sequences

Python inherited from ABC the uniform handling of sequences. Strings, lists, byte sequences, arrays, XML elements, and database results share a rich set of common operations including iteration, slicing, sorting, and concatenation.

Group sequence types by element types:

- Container Sequences:
    - `list`, `tuple`, and `collections.deque` can hold items of different types.
- Flat Sequences:
    - `str`, `bytes`, `bytearray`, `memoryview`, and `array.array` hold items of one type.

Container sequences hold **_references_** to the objects they contain, which may be of any type, while flat sequences physically store the **_value_** of each item within its own memory space, and not as distinct objects. Thus, flat sequences are more compact, but they are limited to holding primitive values like characters, bytes, and numbers.

Group sequence types by mutability:

- Mutable Sequences
    - `list`, `bytearray`, `array.array`, `collections.deque`, and `memoryview`
- Immutable Sequences
    - `tuple`, `str`, and `bytes`

![][2-1-mutable-seq-class-diagram]

### 2.2 _listcomps_ and _genexps_

```python
my_list = [x**2 for x in range(0, 10)]  # list comprehension
my_tuple = tuple(x**2 for x in range(0, 10))  # generator expression

import array
# Both OK; "I" for unsigned int. See https://docs.python.org/3/library/array.html
my_array_1 = array.array("I", (i**2 for i in range(0, 10)))  # generator expression
my_array_2 = array.array("I", [i**2 for i in range(0, 10)])  # list comprehension
```

N.B. `my_tuple` above is not a good example of generator because actually `(x**2 for x in range(0, 10))` is indeed a generator expression and returns a generator. The code of `my_tuple` above is not equal to:

```
my_gen = (x**2 for x in range(0, 10))  # OK. my_gen is a generator object

my_tuple = tuple(my_gen)  # OK, but my_tuple == ()
my_tuple = tuple(*my_gen)  # Syntax Error
```

so `tuple(x**2 for x in range(0, 10))` is actually a special constructor of tuple. You cannot construct a tuple from a generator object manually.

To better understand generators, please read:

- [nvie: Iterables vs. Iterators vs. Generators](http://nvie.com/posts/iterators-vs-generators/)
- [PEP 255 -- Simple Generators](https://www.python.org/dev/peps/pep-0255/)
- [stack overflow: Understanding Generators in Python](http://stackoverflow.com/a/1756156)

### 2.3 Tuples Are Not Just Immutable Lists

#### 2.3.1 Tuples as records

```python
point_a = (-1, 1)
point_b = (2, 3)
```

#### 2.3.2 Tuple Unpacking

```python
point_a = (-1, 1)
x_a, y_a = point_a

print(x_a)  # -1
print(y_a)  # 1
```

An elegant application of tuple unpacking is swapping the values of variables without using a temporary variable:

```python
b, a = a, b
```
