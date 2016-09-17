---
layout: post
title: "Digest of <i>Fluent Python</i>"
description: ""
category: Python
tags: [Book, Python-101]
---
{% include JB/setup %}

## Chapter 1 - The Python Data Model

This chapter focus on special methods, i.e. dunder methods。

| code | interpreted as | comment |
| ---- | -------------- | ------- |
| `obj[key]` | `obj.__getitem__(key)` | |
| `len(obj)` | `obj.__len__(key)` | |
| if `x` in `obj`: | if `obj.__contains__(x)`: | If `__contains__` is not available, Python will scan with `__getitem__`. |
| for `x` in `obj`: | `iterator = obj.__iter__()` is implicitly called at the start of loops; `x = iterator.next()` is the next value and is implicitly called at each loop increment. | If neither is available, Python will scan with `__getitem__`. |
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

### `__iter__` and `next()`

You can treat your own object as an iterator, so `obj.__iter__()` can `return self` and a `next()` implementation can be put inside your own object. 

### `__repr__` vs `__str__`

The string returned by `__repr__` should be unambiguous and, if possible, match the source code necessary to re-create the object being represented. 

`__str__` should return a string suitable for display to end users.

If you only implement one of these special methods, choose `__repr__`, because when no custom `__str__` is available, Python will call `__repr__` as a fallback.

## Chapter 2 - An array of Sequences

