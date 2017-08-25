---
layout: post
title: "Digest of <i>Fluent Python</i>"
description: ""
category: Python
tags: [Book, Python-101]
---
{% include JB/setup %}

[2-1-mutable-seq-class-diagram]:  https://farm9.staticflickr.com/8299/29123468724_a69b68e2cf_z_d.jpg
[3-1-generic-mapping-class-diagram]: https://farm6.staticflickr.com/5532/31713578772_56b2bb734c_z_d.jpg
[3-8-generic-set-class-diagram]: https://farm1.staticflickr.com/605/31059283963_57b19e44a8_z_d.jpg
[3-9-hash-collision]: https://farm1.staticflickr.com/712/31766685701_de0cb54f86_z_d.jpg
[7-1-free-variable]: https://farm5.staticflickr.com/4325/36297071625_b624ab287a_o_d.png
[11-3-collections-abc]: https://farm5.staticflickr.com/4390/36490611835_0c2312925b_z_d.jpg
[13-5-Rich-Comparison-Operators]: https://farm5.staticflickr.com/4340/35696326944_2eea27878a_z_d.jpg
[14-Iterables-vs-Iterators-vs-Generators]: https://farm5.staticflickr.com/4358/36136184210_35769554c8_z_d.jpg

## Chapter 1 - The Python Data Model

This chapter focus on special methods, i.e. dunder methods。

| code | interpreted as | comment |
| ---- | -------------- | ------- |
| `obj[key]` | `obj.__getitem__(key)` | |
| `obj.foo` / `getattr(obj, "foo")` | `obj.__getattribute__(obj, "foo")` | |
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

### `__getattribute__()` / `__getattr__()` / `getattr()`

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

Note that attributes can be functions, so it is possible to write `getattr(obj, func_name)(param)`.

You may not want to override `__getattribute__()` yourself but if you somehow got a chance, pay attention to possible infinite loops caused by any form of `self.xxx` inside the implementation of `__getattribute__()`. Instead use base class method with the same name to access `xxx`, for example, `object.__getattribute__(self, "xxx")`. E.g.

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

### `__iter__()` and `__next__()`

You can treat your own object as an iterator, so `obj.__iter__()` can `return self` and a `__next__()` implementation can be put inside your own object. 

### `__repr__()` vs `__str__()`

The string returned by `__repr__()` should be unambiguous and, if possible, match the source code necessary to re-create the object being represented. 

`__str__()` should return a string suitable for display to end users.

If you only implement one of these special methods, choose `__repr__()`, because when no custom `__str__()` is available, Python will call `__repr__()` as a fallback.

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

**N.B.** `my_tuple` above is not a good example of generator because actually `(x**2 for x in range(0, 10))` is indeed a generator expression and returns a generator. The code of `my_tuple` above is not equal to:

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

#### 2.3.3 Nested Tuple Unpacking

```python
top_left, top_right, bottom_left, bottom_right = (0, 1), (1, 1), (0, 0), (1, 0)
square = (top_left, top_right, bottom_left, bottom_right)
(top_left_x, top_left_y), (top_right_x, top_right_y) = square[0:2]
```

Note that: `square[0:2]` == `((0, 1), (1, 1))` while `square[0]` == `(0, 1)` not `((0, 1))`. In fact, python will evaluate `((0, 1))` as `(0, 1)`.

#### 2.3.4 `namedtuple`

The `collections.namedtuple(typename, field_names)` is a factory function that produces subclasses of `tuple` named `typename` and enhanced with accessibility via `field_names`.

一般的用法是：

```python
import collections

Point = namedtuple('Point', ['x', 'y'])
p_a = Point(0, 1)

print(p_a.x)	# 0
print(p_a[1])	# 1
```

为啥要 `typename = namedtuple(typename, ...)`？这是因为这个 "subclasses of `tuple` named `typename`" 是在它 constructor 内部的一个临时 namespace 创建的 (通过 `exec`)，然后这个 subclass `typename` 的实体会被 constructor 返回，但是它的 name--也就也是 `typename`--并不会随着 return 被带到 constructor 所在的 namespace。我们在外部再赋值一下，主要是为了保持一致，使得这个 subclass 的 name 不管是在它创建的临时 namespace 里还是当前的 namespace 里都叫 `typename`，避免产生不必要的误解。当然，你写成 `Bar = namedtuple('Foo', ...)` 是合法的，是没有问题的。

更多内容可以参见： 

- [How namedtuple works in Python 2.7](http://jameso.be/2013/08/06/namedtuple.html)
- [Breakdown: collections.namedtuple](http://nathschmidt.net/breakdown-collections-namedtuple.html)
- [Be careful with exec and eval in Python](http://lucumr.pocoo.org/2011/2/1/exec-in-python/)
- [Python collections source code](https://svn.python.org/projects/python/trunk/Lib/collections.py)

### 2.4 Slicing

在 2.1 我们讲过，所有的 sequence type 都支持 "iteration, slicing, sorting, and concatenation"。

To evaluate the expression `seq[start:stop:step]`, Python calls  `seq[slice(start, stop, step)]` then `seq.__getitem__(slice(start, stop, step))`. (因为 1. 里有讲 `__getitem__` method delegates to `[]` operator)

`start` 默认是 0；`stop` 默认是 `len(seq)` (exclusively)；`step` 默认是 1，而且它是连冒号也可以省略的。E.g.

- `s = 'bicycle'`
- `s[:2] == s[0:2] == s[:2:] == s[0:2:] == s[:2:1] == s[0:2:1] == 'bi'`
- `s[2:] == ... == 'cycle'`
- `s[::2] == bcce`

Instead of filling your code with hardcoded slices, you can name them. 比如一个固定格式的 invoice 字符串，它的 price、description 什么的都是定长的，我们可以这样：

```python
price = slice(start1, stop1, [step1])
desc = slice(start2, stop2, [step2])

for invoice in invoice_list:
	print(invoice[price], invoice[desc])
```

对于取下来的 sequence slice，我们可以直接用赋值来修改这个 sequence slice 进而直接修改 sequence 的值。这进一步说明：sequence slice 其实是 reference。E.g.

```python
>>> l = list(range(10))
>>> l
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
>>> l[2:5] = [20, 30]
>>> l
[0, 1, 20, 30, 5, 6, 7, 8, 9]
>>> del l[5:7]
>>> l
[0, 1, 20, 30, 5, 8, 9]
>>> l[3::2] = [11, 22]
>>> l
[0, 1, 20, 11, 5, 22, 9]
>>> l[2:5] = 100
Traceback (most recent call last):
File "<stdin>", line 1, in <module>
TypeError: can only assign an iterable
>>> l[2:5] = [100]
>>> l
[0, 1, 100, 22, 9]
```

When the target of the assignment is a slice, the right side must be an iterable object, even if it has just one item.

Digress: The `[]` operator can also take multiple indexes or slices separated by commas. This is used, for instance, in the external `NumPy` package, where items of a two-dimensional `numpy.ndarray` can be fetched using the syntax `a[i, j]` and a two-dimensional slice obtained with an expression like `a[m:n, k:l]`. 实现上，它们的 `__getitem__()` 和 `__setitem__()` 是接收 tuple 的，比如 to evaluate `a[i, j]`, Python calls `a.__getitem__((i, j))`.

Digress: The `Ellipsis` object--written as three full stops (`...`)--is the single instance of the `ellipsis` class. `NumPy` uses `...` as a shortcut when slicing arrays of many dimensions; for example, if `x` is a fourdimensional array, `x[i, ...]` is a shortcut for `x[i, :, :, :,]`.

### 2.5 Using `+` and `*` with Sequences

Beware of expressions like `a * n` when `a` is a sequence containing mutable items. E.g. `my_list = [[]] * 3` will result in a list **with three references to the same inner list**.

创建一个预分配长度为 5 的 list 我们可以用 `lst = [None] * 5`。那么现在我要一个 `[lst, lst, lst]` 的 list of lists 该怎么办？

```python
llst = [[None] * 5 for _ in range(3)]  # Right
lref = [[None] * 5] * 3  # Legal but this is a list of 3 references to one list of 5
```

鉴定是 list of lists 还是 list of references 可以用 `id()` 方法，类似 java 的 hashcode。

```python
In [3]: for lst in llst:
   ...:     print(id(lst))
   ...:
2343147973832
2343148089224
2343148087880

In [5]: for lst in lref:
   ...:     print(id(lst))
   ...:
2343148276680
2343148276680
2343148276680
```

### 2.6 `lst.sort()` vs `sorted(lst)`

- `lst.sort()` sorts in place—that is, without making a copy of `lst`.
	- A drawback: cannot cascade calls to other methods.
- `sorted(lst)` creates a new list and returns it. `lst` does not change.

这两个方法的参数都是一样的：

- `reverse`: boolean
- `key`: the function that will be applied to items to generate the sorting key.
	- 默认是 identity function，相当于是 `key = lambda x:x`，直接比较 item 本身
	- 比如 `key = str.lower` means sorting case-insensitively
	- 比如 `key = len` means sorting by the length of each item
	- 比如 `key = int` means sorting by values of `int(item)`

### 2.7 Managing Ordered Sequences with `bisect` Module

bisection 中文意思就是 "二分法"。

`bisect.bisect(haystack, needle)` does a binary search for `needle` in `haystack`--which must be a sorted sequence--and returns the index where `needle` can be inserted while maintaining `haystack` in ascending order. 

You could use the result of `bisect.bisect(haystack, needle)` as the index argument to `haystack.insert(index, needle)`--however, using `bisect.insort(haystack, needle)` does both steps, and is faster.

### 2.8 When a List Is Not the Answer

#### 2.8.1 `array.array`

If the list will only contain numbers, an `array.array` is more efficient than a list.

When creating an `array.array`, you provide a typecode, a letter to determine the underlying C type used to store each item in the array. 

- For example, `'b'` is the typecode for signed char. If you create an `array('b')`, then each item will be stored in a single byte and interpreted as an integer from –128 to 127. 
- For large sequences of numbers, this saves a lot of memory. 
	- E.g. an `array('f')` does not hold `float` objects but only the bytes representing the values.
- And Python will not let you put any number that does not match the type for the array.

#### 2.8.2 `memoryview(array)`

一个 array 可以有多种表示，比如二进制、八进制。`memoryview` 就是用来显示这些不同的表示的。如果修改 `memoryview` 自然会修改到底层的 array 的值。这进一步说明：sequence 是 mutable 的。

```python
>>> numbers = array.array('h', [-2, -1, 0, 1, 2])  # 'h' for signed short
>>> memv = memoryview(numbers)
>>> memv_oct = memv.cast('B')  # 'B' for unsigned char
>>> memv_oct.tolist()
[254, 255, 255, 255, 0, 0, 1, 0, 2, 0]
```

#### 2.8.3 `collections.deque` and Other Queues

`collections.deque` is a thread-safe double-ended queue designed for fast inserting and removing from both ends.

## Chapter 3 - Dictionaries and Sets

### Digress: What Is Hashable?

An object is hashable if it has a hash value which never changes during its lifetime (it needs a `__hash__()` method), and can be compared to other objects (it needs an `__eq__()` method). Hashable objects which compare equal must have the same hash value.

- The atomic immutable types (str, bytes, numeric types) are all hashable. - A `frozenset` is always hashable, because its elements must be hashable by definition. 
- A `tuple` is hashable only if all its items are hashable.
	- At the time of this writing, the [Python Glossary](https://docs.python.org/3/glossary.html#term-hashable) states: "All of Python’s immutable built-in objects are hashable" but that is inaccurate because a tuple is immutable, yet it may contain references to unhashable objects.
	
```python
>>> tt = (1, 2, (30, 40))
>>> hash(tt)
8027212646858338501
>>> tl = (1, 2, [30, 40])
>>> hash(tl)
Traceback (most recent call last):
File "<stdin>", line 1, in <module>
TypeError: unhashable type: 'list'
>>> tf = (1, 2, frozenset([30, 40]))
>>> hash(tf)
-4118419923444501110
```

User-defined types are hashable by default because their hash value is their `id()` and they all compare not equal.

### 3.1 Generic Mapping Types

![][3-1-generic-mapping-class-diagram]

```python
In [6]: from collections import abc
In [7]: isinstance({}, abc.MutableMapping)
Out[7]: True
```

All mapping types in the standard library use the basic `dict` in their implementation, so they share the limitation that the keys must be hashable.

### 3.2 _dictcomp_

创建 dict 的语法真是多种多样……

```python
>>> a = dict(one=1, two=2, three=3)
>>> b = {'one': 1, 'two': 2, 'three': 3}
>>> c = dict(zip(['one', 'two', 'three'], [1, 2, 3]))
>>> d = dict([('two', 2), ('one', 1), ('three', 3)])
>>> e = dict({'three': 3, 'one': 1, 'two': 2})
>>> a == b == c == d == e
True
```

In addition to the literal syntax and the flexible `dict` constructor, we can use dict comprehensions to build dictionaries.

```python
>>> DIAL_CODES = [
... 	(86, 'China'),
... 	(91, 'India'),
... 	(1, 'United States'),
... 	(62, 'Indonesia'),
... 	(55, 'Brazil'),
... 	(92, 'Pakistan'),
... 	(880, 'Bangladesh'),
... 	(234, 'Nigeria'),
... 	(7, 'Russia'),
... 	(81, 'Japan'),
... ]
>>> country_code = {country: code for code, country in DIAL_CODES}
>>> country_code
{'China': 86, 'India': 91, 'Bangladesh': 880, 'United States': 1,
'Pakistan': 92, 'Japan': 81, 'Russia': 7, 'Brazil': 55, 'Nigeria':
234, 'Indonesia': 62}
>>> {code: country.upper() for country, code in country_code.items() if code < 66}
{1: 'UNITED STATES', 55: 'BRAZIL', 62: 'INDONESIA', 7: 'RUSSIA'}
```

### 3.3 Handling Missing Keys with `dict.setdefault()`

`d.get(k, default)` is an alternative to `d[k]` whenever a default value is more convenient than handling `KeyError`.

`setdefault(key[, default])`:

- If `key` is in `d`, return `d[key]`. 
- If not, insert `d[key] = default` and return `default`. 
- `default` defaults to `None`.

与 list 可以组合成这么一个 combo：

```python
d.setdefault(key, []).append(new_value)
```

- 如果 `d[key]` 存在，就 append
- 如果 `d[key]` 不存在，就创建一个 `[]` 然后 append

### 3.4 Handling Missing Keys with `collections.defaultdict` or `__missing__()`

`defaultdict(default_factory)`:

- `default_factory` is a callable that is used to produce a default value whenever `__getitem__(key)` is called with a nonexistent `key`.
- N.B only for `__getitem__()` calls. Therefore if `dd` is a `defaultdict` and `key` is a missing key:
	- `dd[key]` will return the default value created by `default_factory()`
	- `dd.get(k)` will return `None`
	
Another way to handle missing keys is to extend a `dict` and implement the `__missing__()` method.

- `__missing__()` is just called by `__getitem__()`

### 3.5 Variations of `dict`

- `collections.OrderedDict`: Maintains keys in insertion order.
- `collections.ChainMap(dict1, dict2)`: 
	- 先在 `dict1` 里查，有就 return；没有就继续去 `dict2` 里查。
	- `dict1` 和 `dict2` 可以有相同的 key。
	- 查找的顺序只和构造器的参数顺序有关。
- `collections.Counter`: A mapping that holds an integer count for each key. Updating an existing key adds to its count.

### 3.6 Subclassing `UserDict`

`UserDict` is designed to be subclassed. It’s almost always easier to create a new mapping type by extending `UserDict` rather than `dict`.

Note that `UserDict` does not inherit from `dict`, but has an internal `dict` instance, called `data`, which holds the actual items. 

- 组合优于继承 again!
- 所以 `UserDict` 既不是一个 interface 也不是一个 abstract class，它是一个 Mixin

### 3.7 Immutable Mappings

The mapping types provided by the standard library are _**all mutable**_, but you may need to guarantee that a user cannot change a mapping by mistake.

Since Python 3.3, the `types` module provides a wrapper class called `MappingProxyType`, which, given a mapping, returns a `mappingproxy` instance that is a read-only but dynamic view of the original mapping. This means that updates to the original mapping can be seen in the instance, but changes cannot be made through it.

```python
>>> from types import MappingProxyType
>>> d = {1: 'A'}
>>> d_proxy = MappingProxyType(d)
>>> d_proxy
mappingproxy({1: 'A'})
>>> d_proxy[1]
'A'
>>> d_proxy[2] = 'x'
Traceback (most recent call last):
File "<stdin>", line 1, in <module>
TypeError: 'mappingproxy' object does not support item assignment
>>> d[2] = 'B'
>>> d_proxy
mappingproxy({1: 'A', 2: 'B'})
>>> d_proxy[2]
'B'
```

### 3.8 `set`

- `set` elements must be hashable. `set` itself is not hashable.
- `frozenset` is hashable, so you can have `frozenset` inside a `set`

#### 3.8.1 `set` Literals

```python
s = {1, 2, 3}
```
- To create an empty set, you should use the constructor without an argument: `s = set()`. 
- If you write `s = {}`, you're creating an empty `dict`.

#### 3.8.2 _setcomp_

```python
>>> from unicodedata import name
>>> {chr(i) for i in range(32, 256) if 'SIGN' in name(chr(i), '')}
{'§', '=', '¢', '#', '¤', '<', '¥', 'μ', '×', '$', '¶', '£', '©',
'°', '+', '÷', '±', '>', '¬', '®', '%'}
```

#### 3.8.3 Set Operations

![][3-8-generic-set-class-diagram]

Given two sets `a` and `b` and an element `e`:

- `a & b`: the intersection;
- `a | b`: the union;
- `a - b`: the difference!
- `a < b`: is `a` a proper subset of `b`?
- `a <= b`: is `a` a subset of `b`?
- `a > b`: is `a` a proper superset of `b`?
- `a >= b`: is `a` a superset of `b`?
- `a.discard(e)`: remove `e` from `a` if it is present
- `a.remove(e)`: remove `e` from `a`, raising `KeyError` if `e` not in `a`

### 3.9 `dict` and `set` Under the Hood

A hash table is a sparse array (i.e., an array that always has empty cells). In standard data structure texts, the cells in a hash table are often called "buckets." In a `dict` hash table, there is a bucket for each item, and it contains two fields: a reference to the key and a reference to the value of the item. Because all buckets have the same size, access to an individual bucket is done by offset.

The `hash()` built-in function works directly with built-in types and falls back to calling `__hash__()` for user-defined types. If two objects compare equal, their hash values must also be equal. For example, because `1 == 1.0` is true, `hash(1) == hash(1.0)` must also be true, even though the internal representation of an int and a float are very different.

To fetch the value at `my_dict[search_key]`, Python calls `hash(search_key)` to obtain the hash value of `search_key` and uses the least significant bits of that number as an offset to look up a bucket in the hash table (the number of bits used depends on the current size of the table). If the found bucket is empty, `KeyError` is raised. Otherwise, the found bucket has an item—a `found_key:found_value` pair—and then Python checks whether `search_key == found_key`. If they match, that was the item sought: `found_value` is returned.

However, if `search_key` and `found_key` do not match, this is a _**hash collision**_. In order to resolve the collision, the algorithm then takes different bits in the hash, massages them in a particular way, and uses the result as an offset to look up a different bucket. If that is empty, `KeyError` is raised; if not, either the keys match and the item value is returned, or the collision resolution process is repeated.

![][3-9-hash-collision]

The process to insert or update an item is the same, except that when an empty bucket is located, the new item is put there, and when a bucket with a matching key is found, the value in that bucket is overwritten with the new value.

Additionally, when inserting items, Python may determine that the hash table is too crowded and rebuild it to a new location with more room. As the hash table grows, so does the number of hash bits used as bucket offsets, and this keeps the rate of collisions low.

#### `dict`s have significant memory overhead

Because a `dict` uses a hash table internally, and hash tables must be sparse to work, they are not space efficient. For example, if you are handling a large quantity of records, it makes sense to store them in a list of tuples or named tuples instead.

But remember:

> Optimization is the altar where maintainability is sacrificed.

#### Key search is very fast

The `dict` implementation is an example of trading space for time: dictionaries have significant memory overhead, but they provide fast access regardless of the size of the dictionary--as long as it fits in memory.

#### Adding items to a `dict` may change the order of existing keys

Whenever you add a new item to a `dict`, the Python interpreter may decide that the hash table of that dictionary needs to grow. This entails building a new, bigger hash table, and adding all current items to the new table. During this process, new (but different) hash collisions may happen, with the result that the keys are likely to be ordered differently in the new hash table. All of this is implementation-dependent, so you cannot reliably predict when it will happen. If you are iterating over the dictionary keys and changing them at the same time, your loop may not scan all the items as expected.

This is why modifying the contents of a `dict` while iterating through it is a bad idea. If you need to scan and add items to a dictionary, do it in two steps: read the `dict` from start to finish and collect the needed additions in a second `dict`. Then update the first one with it.

#### How Sets Work

The `set` and `frozenset` types are also implemented with a hash table, except that each bucket holds only a reference to the element.

The underlying hash table determines the behavior of a `dict` applies to a `set`. Without repeating the previous section, we can summarize it for `set`s with just a few words:

- `set` elements must be hashable objects.
- `set`s have a significant memory overhead.
- Membership testing is very efficient.
- Adding elements to a `set` may change the order of other elements.

## Chapter 4 - Text vs Bytes

### 4.1 Character Issues

The Unicode standard explicitly separates the identity of characters from specific byte representations. 我们来学习一下相关的词汇：

- _**code point**_: the identity of a character. 也就是我们所谓的 "Unicode 编码"，比如 "A" 的 code point 就是 "U+0041"
- code points $\rightarrow$ bytes 的过程我们称为 _**encoding**_;
- bytes $\rightarrow$ code points 的过程我们称为 _**decoding**_;
	- encode 可以理解为 "编成机器码"，byte 也是一种码嘛~
- 但同时 encoding 这个词也可以表示这一套编解码的规则：An encoding is an algorithm that converts code points to byte sequences and vice versa.
- _**codec**_ 是 coder-decoder 的简称，co(der)-dec(oder)
	- 我们也可以理解为一套 encoding 规则对应一个 codec
- code page 则是一张 $\operatorname{f}: \text{code point} \rightarrow \text{byte}$ 的 lookup table

```python
>>> s = 'café'
>>> b = s.encode('utf8')  # Encode `str` to `bytes` using UTF-8 encoding.
>>> b
b'caf\xc3\xa9' # `bytes` literals start with a `b` prefix.
>>> b.decode('utf8')  # Decode `bytes` to `str` using UTF-8 encoding.
'café'
```

#### Digress: BOM 

_**BOM**_ stands for byte-order mark. 

The UTF-8 BOM is a sequence of bytes that allows the reader to identify a file as being encoded in UTF-8.

Normally, the BOM is used to signal the endianness of an encoding, but since endianness is irrelevant to UTF-8, the BOM is unnecessary. 

| BOM Bytes     | Encoding Form         |
|---------------|-----------------------|
| "00 00 FE FF" | UTF-32, big-endian    |
| "FF FE 00 00" | UTF-32, little-endian |
| "FE FF"       | UTF-16, big-endian    |
| "FF FE"       | UTF-16, little-endian |
| "EF BB BF"    | UTF-8                 |

### 4.2 Byte Essentials

The new binary sequence types are unlike the Python 2 `str` in many regards. The first thing to know is that there are two basic built-in types for binary sequences: the **immutable** `bytes` type introduced in Python 3 and the **mutable** `bytearray`, added in Python 2.6. (Python 2.6 also introduced `bytes`, but it’s just an alias to the `str` type, and does not behave like the Python 3 `bytes` type.)

Each item in bytes or bytearray is an integer from 0 to 255, and not a one-character string like in the Python 2 `str`.

- `my_bytes[0]` retrieves an int
- `my_bytes[:1]` returns a bytes object of length 1 (i.e. always a sequence)
- however, `my_str[0] == my_str[:1]`

### 4.3 Basic Encoders/Decoders

Each codec has a name, like 'utf_8', and often aliases, such as 'utf8', 'utf-8', and 'U8'. 其他常见的 codec 还有：

- 'latin1' a.k.a. 'iso8859_1'
- 'cp1252'
- 'cp437'
- 'gb2312'
- 'utf-16le'

### 4.4 Understanding Encode/Decode Problems (略)

### 4.5 Handling Text Files

If the encoding argument was omitted when opening the file to write, the locale default encoding would be used. Always pass an explicit `encoding=` argument when opening text files.

- On GNU/Linux and OSX all of these encodings are set to UTF-8 by default, and have been for several years.
- On Windows, not only are different encodings used in the same system, but they are usually codepages like 'cp850' or 'cp1252' that support only ASCII with 127 additional characters that are not the same from one encoding to the other.

### 4.6 Normalizing Unicode for Saner Comparisons (略)

### 4.7 Sorting Unicode Text (略)

### 4.8 The Unicode Database (略)

### 4.9 Dual-Mode `str` and `bytes` APIs (略)

## Chapter 5 - Python Functions are First-Class Objects

Programming language theorists define a "first-class object" as a program entity that can be:

- Created at runtime
- Assigned to a variable or element in a data structure
- Passed as an argument to a function
- Returned as the result of a function 

Integers, strings, and dictionaries are other examples of first-class objects in Python.

### 5.1 Treating a Function Like an Object

```python
>>> def factorial(n):
... '''returns n!'''
... return 1 if n < 2 else n * factorial(n-1)
...
>>> factorial.__doc__
'returns n!'
>>> type(factorial)
<class 'function'>
>>> help(factorial)
Help on function factorial in module __main__:

factorial(n)
    returns n!
>>> fact = factorial
>>> list(map(fact, range(11)))
[1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800]
```

- `map(func, iterable)` returns an generator (an `map` object) where each item is the result of `func(e)` where `e` is an element of `iterable`
- Actually less than a _listcomp_ here:
	- `list(map(fact, range(11))) == [fact(x) for x in range(11)]`
	- `list(map(None, iter_a, iter_b)) == [(a,b) for a in iter_a for b in iter_b]`
	
简单说 `map` 就是：

```python
def map(func, iterable):
    for i in iterable:
        yield func(i)
```

### 5.2 Higher-Order Functions (e.g. `map`, `filter` and `reduce`)

A function that takes a function as argument or returns a function as the result is a _higher-order function_. E.g. `map`, `filter` and `reduce`.

- `apply` was deprecated in Python 2.3 and removed in Python 3. `apply(fn, args, kwargs) == fn(*args, **kwargs)`

简单说 `filter` 就是：

```python
def filter(func, iterable):
	for i in iterable:
		if func(i):
			yield i
```

E.g. `list(filter(lambda x: x % 2, range(11))) == [x for x in range(11) if x % 2] == [1,3,5,7,9]`.

而 `reduce(func, iterable)` 的作用是：apply two-argument function `func` cumulatively to the items of `iterable`, so as to reduce the iterable to a single value.

```python
def reduce(function, iterable, initializer=None):
    it = iter(iterable)
    if initializer is None:
        try:
            initializer = next(it)
        except StopIteration:
            raise TypeError('reduce() of empty sequence with no initial value')
    accum_value = initializer
    for x in it:
        accum_value = function(accum_value, x)
    return accum_value
```

E.g. 

```python
from functools import reduce
from operator import add

reduce(add, [1,2,3,4,5])  # == (((1+2)+3)+4)+5 == 15
```

If `seq=[s1, s2, s3, ... , sn]`, calling `reduce(func, seq)` works like this:

- At first the first two elements of `seq` will be applied to `func`, i.e. `func(s1, s2)`. The list on which `reduce()` works looks now like this: `[func(s1, s2), s3, ..., sn]`
- In the next step `func` will be applied on the previous result and the third element of the list, i.e. `func(func(s1, s2), s3)`. The list looks like this now: `[func(func(s1, s2),s3), s4, ..., sn]`
- Continue like this until just one element is left and return this element as the result of `reduce()`

P.S. Other reducing built-ins are `all` and `any`:

- `all(iterable)`
	- Returns `True` if every element of the `iterable` is truthy; 
	- `all([])` returns `True`.
- `any(iterable)`
	- Returns `True` if any element of the `iterable` is truthy; 
	- `any([])` returns `False`.

### 5.3 Anonymous Functions

The `lambda` keyword creates an anonymous function within a Python expression.

The body of lambda functions must be pure expressions. In other words, the body of a lambda cannot make assignments or use any other Python statement such as `while`, `try`, etc. 

### 5.4 The 7 Flavors of Callable Objects

`()` in `func()` can be called a "call opertor". To determine whether an object is callable, use the `callable()` built-in function.

1. _User-defined functions_. E.g. created with `def` or `lambda`.
1. _User-defined methods_. 
1. _Built-in functions_. Functions implemented in C (for CPython), like `len`.
1. _Built-in methods_. Methods implemented in C (for CPython), like `dict.get`.
1. _Class instructors_. When invoked, a class runs its `__new__` method to create an instance, then `__init__` to initialize it, and finally the instance is returned to the caller. Because there is no `new` operator in Python, calling a class is like calling a function.
1. _Callable class instances_. If a class implements a `__call__` method, then its instances can be invoked as functions.
1. _Generators_. Functions or methods that use `yield`.

### 5.5 User-Defined Callable Types

A class implementing `__call__` is an easy way to create functions that have some internal state that must be kept across invocations. 注意这句其实说的就是：在某些需要 function 的场合，我们可以用 callable class instance 来代替 function，从而可以给这个 "function" 一些 state 来实现更多的功能。原文说的是 "...to create function-like objects that..."，不知道为何要这么拐弯抹角的表示……E.g. **decorators** must be functions, 但比如你要做一个 cache decorator，这时就需要将这个 decorator 用 callable class instance 来实现，把 cache 封装到 class 内部。

A totally different approach to creating functions with internal state is to use **closures**. Closures, as well as decorators, are the subject of Chapter 7.

### 5.6 Function Introspection

General way to introspect an object:

- `dir(obj)`: returns a list of valid attributes for that object
- `obj.__dict__`: stores all the user attributes assigned to that object

Exclusive way to introspect a user-defined function:

- `func.__annotations__`: a dict; the parameter and return annotations
	- 注意 annotation 不同于 docstring (`'''blah blah'''`) which is stored in `func.__doc__`
- `func.__closure__`: a tuple of closure cells; the function closure, i.e. bindings for free variables (one cell for each free variable)
- `func.__code__`: a `code` object; function metadata and function body compiled into bytecode
- `func.__defaults__`: a tuple of default values for the formal parameters
- `func.__kwdefaults__`: a dict of default values for the keyword-only formal parameters

#### Function Annotations

注意 python 的 annotation 不同于的 java 的 annotation；python 的 annotation 是为 documentation 服务的，最详细的说明在 [PEP 3107 -- Function Annotations](https://www.python.org/dev/peps/pep-3107/)。annotation 可以有两种形式：一是 string，二是 type，我们来看下规范：

```python
def foo(a: "annotation for a" [= a_def_val]) -> "annotaton for returned value":
	pass
	
def bar(a: TypeA (= a_def_val)) -> ReturnType:
	pass
```

举个例子：

```python
def foo(a: "this is parameter a") -> "return nothing":
	return None
	
>>> foo.__annotations__
>>> {'a': 'this is parameter a', 'return': 'return nothing'}

class ReturnType: pass
def bar(a: int = 1) -> ReturnType:
	pass
	
>>> bar.__annotations__
>>> {'a': int, 'return': __main__.ReturnType}
```

#### Function Closure

先看例子：

```python
def print_msg(msg):
	'''This is the outer enclosing function'''

    def printer():
		'''This is the nested function'''
        print(msg)

    return printer

print_hello = print_msg("Hello")
print_hello()  # Output: Hello

>>> print_hello.__closure__
>>> (<cell at 0x000001B2408F6C78: str object at 0x000001B240A34110>,)

>>> inspect.getclosurevars(print_hello)
>>> ClosureVars(nonlocals={'msg': 'Hello'}, globals={}, builtins={'print': <built-in function print>}, unbound=set())
```

这里的 `msg = 'Hello'` 是 `print_hello` 的一个 free variable。我们先来看下 free variable 的定义：

- In mathematics, a _**free variable**_ is a variable in an expression where substitution may take place. 也就是说，能做替换操作的 variable 都是 free variable
- In mathematics, a _**bound variable**_ is a variable that was previously free, but has been bound to a specific value or set of values.
	- E.g., the variable $x$ becomes a bound variable when we write: 	
		- $\forall x, (x + 1)^2 = x^2 + 2x + 1$ or 
		- $\exists x \text{ such that } x^2 = 2$
	- Some older books use the terms _**real variable**_ and _**apparent variable**_ for free variable and bound variable.
- In computer programming, the term _**free variable**_ refers to variables used in a function that are neither local variables nor parameters of that function.
- 这个场合下，bound variable 就不好定义了，也没有必要往这个方向去考虑。

所以在 python 这儿，如果 `func.__closure__` 就是 closure 的话，那 closure 相当于被定义成了 free variable 的一个 enviroment 或者 namespace。我觉得这么理解其实挺好记的，非常直观（毕竟你可以直接 print 到 console……）。

我对 closure 一直不理解是因为我看到了各种各样的定义，比如：

- "function + its free variables", or the code snippet of "function + its free variables"
- The function object itself (i.e. `print_hello` here)
- A phenomenon which happens when a function has access to a local variable from an enclosing scope.

这些统统没有 `func.__closure__` 直观，所以暂且按 `func.__closure__` 来记好了。若是以后对 closure 的理解出了偏差，还可以刷锅给 python 说它变量名起得不对 www

#### Default Parameter Values vs Default Keyword-Only Parameter Values

按 [PEP 3102 -- Keyword-Only Arguments](https://www.python.org/dev/peps/pep-3102/) 的说法，kwyword-only argument 是：

> Arguments that can only be supplied by keyword and which will never be automatically filled in by a positional argument.

```python
def func(a, b = 1, *args, kwa, kwb = 2):
	pass
	
>>> func.__defaults__
>>> (1,)

>>> func.__kwdefaults__
>>> {'kwb': 2}
```

从逻辑上，keyword-only parameter 是 parameter 的一种（其实一个就两种，一个 positional 一个 keyword-only），但是上面这个例子里 `__kwdefaults__.values` $\not \subset$ `__defaults__`.

另外一个需要注意的问题是：default parameter value 只在 `def` 的被执行的时候初始化一次，而不是每次调用 function 的时候都初始化一次（有点类似 static； Ruby 也是这样的）。比如下面这个例子：

```python
def func2(b = [], *args, kwb = []):
	b.append('F')
	kwb.append('F')
	
	print("b == {}".format(b))
	print("kwb == {}".format(kwb))

for _ in range(3):
	func2()

// output:
/** 
	b == ['F']
	kwb == ['F']
	b == ['F', 'F']
	kwb == ['F', 'F']
	b == ['F', 'F', 'F']
	kwb == ['F', 'F', 'F']
**/
```

所以如果你要每次调用 function 时都默认参数为 `[]`，正确的写法应该是：

```python
def func3(b = None):
	if b is None
		b = []
	......
```

当然这个特性也可以合理利用，比如你要做一个 cache，你当然不希望每次都初始化为默认的值。

注意这章一开始有说 Python functions are first-class objects，所以 default parameter value 也有点像 object 的 attribute。

### 5.7 Packages for Functional Programming: `operator` and `functools`

#### 5.7.1 `operator`: arithmetic operators / `itemgetter` / `attrgetter` / `methodcaller`

Python does not aim to be a functional programming language, but a functional coding style can be used to good extent, thanks to the support of packages like `operator` and `functools`.

To save you the trouble of writing trivial anonymous functions like `lambda a, b: a*b`, the `operator` module provides function equivalents for dozens of arithmetic operators.

```python
from functools import reduce
from operator import mul

def fact(n):  # lambda version
	return reduce(lambda a, b: a*b, range(1, n+1))

def fact(n):  # operator version
	return reduce(mul, range(1, n+1))
```

Another group of one-trick lambdas that `operator` replaces are functions to pick items from sequences or read attributes from objects: `itemgetter` and `attrgetter` actually build custom functions to do that.

- Essentially, `itemgetter(1)` does the same as `lambda fields: fields[1]`
- If you pass multiple index arguments to `itemgetter()`, the function it builds will return tuples with the extracted values
- `itemgetter()` uses the `[]` operator--it supports not only sequences but also mappings and any class that implements `__getitem__()`.

```python
metro_data = [
	('Tokyo', 'JP', 36.933, (35.689722, 139.691667)),
	('Delhi NCR', 'IN', 21.935, (28.613889, 77.208889)),
	('Mexico City', 'MX', 20.142, (19.433333, -99.133333)),
	('New York-Newark', 'US', 20.104, (40.808611, -74.020386)),
	('Sao Paulo', 'BR', 19.649, (-23.547778, -46.635833)),
]

from operator import itemgetter

for city in sorted(metro_data, key=itemgetter(1)):
	print(city)

# ('Sao Paulo', 'BR', 19.649, (-23.547778, -46.635833))
# ('Delhi NCR', 'IN', 21.935, (28.613889, 77.208889))
# ('Tokyo', 'JP', 36.933, (35.689722, 139.691667))
# ('Mexico City', 'MX', 20.142, (19.433333, -99.133333))
# ('New York-Newark', 'US', 20.104, (40.808611, -74.020386))

cc_name = itemgetter(1, 0)
for city in metro_data:
	# 注意 itemgetter(...) 等价于一个 lambda
	# 所以它本身是一个 function
	# 既然是 function 自然就可以 call 
	# (换言之 itemgetter 是一个 "return function 的 function")
	print(cc_name(city))

# ('JP', 'Tokyo')
# ('IN', 'Delhi NCR')
# ('MX', 'Mexico City')
# ('US', 'New York-Newark')
# ('BR', 'Sao Paulo')
```

A sibling of `itemgetter` is `attrgetter`, which creates functions to extract object attributes by name. 

- E.g. `attrgetter("__class__")("hello")` return `"hello".__class__` (== `<class 'str'>`)
- If you pass attrgetter several attribute names as arguments, it also returns a tuple of values. 
- In addition, if any argument name contains a `.` (dot), attrget ter navigates through nested objects to retrieve the attribute
	- E.g. `attrgetter('__class__.__name__')("hello")` return `"hello".__class__.__name__` (== `'str'`)

At last we cover `methodcaller`--the function it creates calls a method by name on the object given as argument:

```python
from operator import methodcaller

s = 'The time has come'
upcase = methodcaller('upper')
upcase(s)

# 'THE TIME HAS COME'

hiphenate = methodcaller('replace', ' ', '-')
hiphenate(s)

# 'The-time-has-come'
```

总结一下：

```python
def itemgetter(*keys):
    if len(keys) == 1:
        key = keys[0]
        return lambda x: x[key]
    else:
        return lambda x: tuple(x[key] for key in keys)

def attrgetter(*names):
    if any(not isinstance(name, str) for name in names):
        raise TypeError('attribute name must be a string')
    
	if len(names) == 1:
        name = names[0]
        return lambda x: x.__getattribute__(name)
    else:
        return lambda x: tuple(x.__getattribute__(name) for name in names)

def methodcaller(name, *args, **kwargs):
    return lambda x: getattr(x, name)(*args, **kwargs)
```

#### 5.7.2 `functools`: Freezing Arguments with `partial()`

```python
from operator import mul
from functools import partial

triple = partial(mul, 3)
triple(7)

# 21
```

## Chapter 6 - Design Patterns with First-Class Functions

### 6.1 Case Study: Refactoring Strategy

第一个例子，注意两点：

1. package `abc` 名字的意思是 abstract base class……
1. 写 empty function body 的两种方式：
	- `pass`
	- 连 `pass` 都不用写，只留下 docstring 

```python
from abc import ABC, abstractmethod

class Order:
	def __init__(self, customer, cart, promotion=None):
		self.customer = customer
		self.cart = list(cart)
		self.promotion = promotion

	def due(self):
		if self.promotion is None:
			discount = 0
		else:
			discount = self.promotion.discount(self)
		return self.total() - discount

# In Python 3.4, the simplest way to declare an ABC is to subclass `abc.ABC`
class Promotion(ABC): # the Strategy: an abstract base class
	@abstractmethod
	def discount(self, order):
		"""Return discount as a positive dollar amount"""
		# pass

class FidelityPromo(Promotion): # first Concrete Strategy
	"""5% discount for customers with 1000 or more fidelity points"""
	def discount(self, order):
		return order.total() * .05 if order.customer.fidelity >= 1000 else 0

class BulkItemPromo(Promotion): # second Concrete Strategy
	"""10% discount for each LineItem with 20 or more units"""
	def discount(self, order):
		discount = 0
		for item in order.cart:
			if item.quantity >= 20:
				discount += item.total() * .1
		return discount

class LargeOrderPromo(Promotion): # third Concrete Strategy
	"""7% discount for orders with 10 or more distinct items"""
	def discount(self, order):
		distinct_items = {item.product for item in order.cart}
			if len(distinct_items) >= 10:
				return order.total() * .07
		return 0
```

Each concrete strategy above is a class with a single method, `discount`. Furthermore, the strategy instances have no state (no instance attributes). You could say they look a lot like plain functions, and you would be right. We can refactor this example to function-oriented:

```python
class Order:
	def __init__(self, customer, cart, promotion=None):
		self.customer = customer
		self.cart = list(cart)
		self.promotion = promotion

	def due(self):
		if self.promotion is None:
			discount = 0
		else:
			discount = self.promotion(self)  # 精妙之处在此
		return self.total() - discount

def fidelity_promo(order):
	"""5% discount for customers with 1000 or more fidelity points"""
	return order.total() * .05 if order.customer.fidelity >= 1000 else 0

def bulk_item_promo(order):
	"""10% discount for each LineItem with 20 or more units"""
	discount = 0
	for item in order.cart:
		if item.quantity >= 20:
			discount += item.total() * .1
	return discount

def large_order_promo(order):
	"""7% discount for orders with 10 or more distinct items"""
	distinct_items = {item.product for item in order.cart}
	if len(distinct_items) >= 10:
		return order.total() * .07
	return 0
```

#### 6.1.1 Flyweight Pattern

It is interesting to note that in _Design Patterns_ the authors suggest: “Strategy objects often make good flyweights.” A definition of the Flyweight in another part of that work states: 

> A flyweight is a shared object that can be used in multiple contexts simultaneously.

- flyweight 本意是拳击比赛的 “轻量级”。

这个定义并没有很清楚，这篇 [Flyweight](http://gameprogrammingpatterns.com/flyweight.html) 我觉得写得不错。给出的例子是 game programming 中的地图渲染的场景：

- 你有很多很多个 `Tree` object 要渲染
- 但是你可以只存一个 static 或者 singleton 的 `TreeModel` object，记录树的多边形、颜色等等信息（假设你地图上所有的树都长一样）
- 然后你的 `Tree` object 就可以引用或者指向这个 `TreeModel` object，然后再保存 coordinate 这些自身 specific 的信息
- 这样比较省空间的 `Tree` object 我们成为 flyweight object

总结得也不错：

> Flyweight, like its name implies, comes into play when you have objects that need to be more lightweight, generally because you have too many of them.
> The Flyweight pattern is purely about efficiency.

极端一点说，所有带 static 的 object 都可以看做 flyweight object

#### 6.1.2 Choosing the Best Strategy: Simple Approach

炫技一波：

```python
promos = [fidelity_promo, bulk_item_promo, large_order_promo]

def best_promo(order):
	"""Select best discount available"""
	return max(promo(order) for promo in promos)
```

#### 6.1.3 Advanced Approach: Finding Strategies in a Module

```python
"""
globals():
	Return a dictionary representing the current global symbol table. This is always the
	dictionary of the current module (inside a function or method, this is the module
	where it is defined, not the module from which it is called).
"""
promos = [globals()[name] for name in globals() if name.endswith('_promo') and name != 'best_promo']

def best_promo(order):
	"""Select best discount available"""
	return max(promo(order) for promo in promos)
```

Another way of collecting the available promotions would be to create a module, `promotions.py`, and put all the strategy functions there, except for `best_promo`.

```python
promos = [func for name, func in inspect.getmembers(promotions, inspect.isfunction)]
```

### 6.2 Command Pattern

```python
class MacroCommand:
	"""A command that executes a list of commands"""
	
	def __init__(self, commands):
		self.commands = list(commands)

	def __call__(self):
		for command in self.commands:
			command()  ## Need implementation of `__call__` inside each command object
```

## Chapter 7 - Function Decorators and Closures

### 7.1 Decorators 101

A decorator is a callable which can take the decorated function as argument. (另外还有 class decorator)

Assume we have a decorator named `foo`, 

```python
@foo
def baz():
	print('running baz')

# ----- is roughly equivalent to ----- #

def foo(func):
	print('running foo')
	return func

def baz():
	print('running baz')

baz = foo(baz)
```

注意上面的例子中：

- `baz` 定义结束时，`@foo` 会立即执行（相当于替换了 `baz` 的定义）
	- 换言之，当 `baz` 所在的 module 被 load 进来的时候，`@foo` 就会执行
- 调用 `baz()` 时并不会执行 `@foo` 

### 7.2 When Python Executes Decorators

When Python Executes Decorators A key feature of decorators is that they run right after the decorated function is defined. That is usually at _import time_.

- Decorated functions are invoked at _runtime_.

### 7.3 Decorator-Enhanced Strategy Pattern

```python
promos = []  # promotions registry

def promotion(promo_func):
	promos.append(promo_func)  # register this promotion
	return promo_func

@promotion
def fidelity(order):
	"""5% discount for customers with 1000 or more fidelity points"""
	...
	
@promotion
def bulk_item(order):
	"""10% discount for each LineItem with 20 or more units"""
	...

@promotion
def large_order(order):
	"""7% discount for orders with 10 or more distinct items"""
	...

def best_promo(order):
	"""Select best discount available"""
	return max(promo(order) for promo in promos)
```

Pros:

- The promotion strategy functions don't have to use special names.
- The `@promotion` decorator highlights the purpose of the decorated function, and also makes it easy to temporarily disable a promotion
- Promotional discount strategies may be defined in other modules, anywhere in the system, as long as the `@promotion` decorator is applied to them.

### 7.4 Variable Scope Rules

Code that uses inner functions almost always depends on closures to operate correctly. To understand closures, we need to take a step back a have a close look at how variable scopes work in Python.

```python
>>> b = 6
>>> def f2(a):
...		print(a)
...		print(b)
...		b = 9
...
>>> f2(3)
3
Traceback (most recent call last):
File "<stdin>", line 1, in <module>
File "<stdin>", line 3, in f2
UnboundLocalError: local variable 'b' referenced before assignment
```

The fact is, when Python compiles the body of the function, it decides that `b` is a local variable because it is assigned within the function. The generated bytecode reflects this decision and will try to fetch `b` from the local environment. Try the following code to see bytecode:

```python
from dis import dis
dis(f2)
```

This is not a bug, but a design choice: Python does not require you to declare variables, but assumes that a variable assigned in the body of a function is local. 

If we want the interpreter to treat `b` as a global variable in spite of the assignment within the function, we use the `global` declaration:

```python
>>> b = 6
>>> def f2(a):
... 	global b
...		print(a)
...		print(b)
...		b = 9
...
>>> f2(3)
3
6
>>> b
9
```

### 7.5 Closures

A closure is a function with an extended scope that encompasses nonglobal variables referenced in the body of the function but not defined there. It does not matter whether the function is anonymous or not; what matters is that it can access nonglobal variables that are defined outside of its body.

Consider the following example:

![][7-1-free-variable]

```python
>>> avg = make_averager()
>>> avg(10)
10.0
>>> avg(11)
10.5
>>> avg(12)
11.0
```

Within averager, `series` is a free variable. This is a technical term meaning a variable that is not bound in the local scope. 我们也称 The closure for `averager` extends the scope of that function to include the binding for the free variable `series`.

Inspecting the free variable:

```python
>>> avg.__code__.co_varnames
('new_value', 'total')
>>> avg.__code__.co_freevars
('series',)
```

The binding for `series` is kept in the `__closure__` attribute of the returned function `avg`. Each item in `avg.__closure__` corresponds to a name in `avg.__code__.co_freevars`. These items are "cells", and they have an attribute called `cell_contents` where the actual value can be found. 

```python
>>> avg.__code__.co_freevars
('series',)
>>> avg.__closure__
(<cell at 0x107a44f78: list object at 0x107a91a48>,)
>>> avg.__closure__[0].cell_contents
[10, 11, 12]
```

### 7.6 The `nonlocal` Declaration

之前的 `make_averager` 实现不够 efficient，一个新的写法是：

```python
# Wrong!
def make_averager():
	count = 0
	total = 0

	def averager(new_value):
		count += 1
		total += new_value
		return total / count
	
	return averager
```

但是运行时出错：

```python
>>> avg = make_averager()
>>> avg(10)
Traceback (most recent call last):
...
UnboundLocalError: local variable 'count' referenced before assignment
```

原因是：

- 在 closure 范围内，nested function body 内部对 free variable `foo` 的 "rebind" 操作，都会 implicitly create local varible `foo`
	- 之前的 `series.append(new_value)` 操作不会触发 "创建 local varible `series`" 是因为：
		1. `list` 是 mutable 的
		1. `list.append()` 的操作不会创建新的 `list`
	- 而这里 `count += 1` 和 `total += new_value` 的操作会创建两个 local variable `count` 和 `total` 是因为：
		1. number 是 immutable 的
		1. `+=` 操作会创建新的 number
- 隐式创建的 local variable 会干扰你对 free varible 的引用（编译器不知道你要用的具体是哪一个）

解决这个问题的方法是：用 `nonlocal` 声明。It lets you flag a variable as a free variable even when it is assigned a new value within the function.

```python
# OK!
def make_averager():
	count = 0
	total = 0

	def averager(new_value):
		nonlocal count, total  # key statement!
		count += 1
		total += new_value
		return total / count
	
	return averager
```

### 7.7 Decorators in the Standard Library

#### 7.7.1 Memoization with `functools.lru_cache`

注意 decorator 可以多包一层，以达到可以带参初始化的目的。

我们先看原始的写法：

```python
# 原始 decorator
def foo(func):
	print('running foo')
	return func

@foo
def baz():
	print('running baz')
```

相当于 `baz = foo(baz)`。

带参的写法：

```python
# 带参 decorator
def foo(msg):
	def wrapper(func):
		print(msg)
		return func
	return wrapper

@foo('running foo another way')
def baz():
	print('running baz')
```

相当于 `baz = foo(msg)(baz)`。

`functools.lru_cache` 就是一个带参 decorator，它的作用是 to cache recent call results。它内部会维护一个 `dict` 来记录 `<arg_list, result>`，从而达到 cache 的作用。适用的场景比如：

- http request
- 递归

```python
@functools.lru_cache(maxsize=128) 
def fibonacci(n):
	if n < 2:
		return n
	return fibonacci(n-2) + fibonacci(n-1)
```

#### 7.7.2 Generic Functions with Single Dispatch

这个厉害了。书上的例子是 "格式输出 html 代码"，针对不同的类型的变量，有不同的输出策略。不用 OO，用 function 就可以实现 overloading。

```python
from functools import singledispatch
from collections import abc
import numbers
import html

@singledispatch
def htmlize(obj):
	content = html.escape(repr(obj))
	return '<pre>{}</pre>'.format(content)

@htmlize.register(str)
def _(text):
	content = html.escape(text).replace('\n', '<br>\n')
	return '<p>{0}</p>'.format(content)

@htmlize.register(numbers.Integral)
def _(n):
	return '<pre>{0} (0x{0:x})</pre>'.format(n)

@htmlize.register(tuple)
@htmlize.register(abc.MutableSequence)
def _(seq):
	inner = '</li>\n<li>'.join(htmlize(item) for item in seq)
	return '<ul>\n<li>' + inner + '</li>\n</ul>'
```

- 带 `@singledispatch` 标记的 function 我们称为 *generic function*.
	- 默认实现是 `htmlize(obj)`
	- `str` 类型的输入对应的实现是 `_(text)`
	- 依此类推
- The name of the *specialized functions* is irrelevant; `_` is a good choice to make this clear.
- 可以映射多个输入类型到同一个 specialized function

需要注意的是：`@singledispatch` is not designed to bring Java-style method overloading to Python. The advantage of `@sin gledispath` is supporting modular extension: each module can register a specialized function for each type it supports.

### 7.8 Stacked Decorators

```python
@d1
@d2
def foo():
	pass
```

等同于 `foo = d1(d2(foo))`，注意顺序

### Digress: `@functools.wrap`

decorator 有个小弊端是：decorated function 的 name 和 docstring 属性会跑到 wrapper function 那里去，比如：

```python
def foo(func):
    def func_wrapper(*args, **kwds):
        """This is foo.func_wrapper()"""
        return func(*args, **kwds)
    return func_wrapper

@foo
def baz():
    """This is baz()"""
```

```python
>>> baz.__name__
'func_wrapper'
>>> baz.__doc__
'This is foo.func_wrapper()'
```

为了解决这个问题，我们可以用 `@functools.wrap` 来 decorate 这个 wrapper：

```python
from functools import wraps

def foo(func):
    @wraps(func)
    def func_wrapper(*args, **kwds):
        """This is foo.func_wrapper()"""
        return func(*args, **kwds)
    return func_wrapper

@foo
def baz():
    """This is baz()"""
```

```python
>>> baz.__name__
'baz'
>>> baz.__doc__
'This is baz()'
```

它的逻辑是：

- `wrap(func)` 返回一个 `functools.partial(functools.update_wrapper, wrapped=func)`
- `wrap(func)(func_wrapper)` 相当于 `func_wrapper = functools.update_wrapper(wrapper=func_wrapper, wrapped=func)`

## Chapter 8 - Object References, Mutability, and Recycling

We start the chapter by presenting a metaphor for variables in Python: variables are labels, not boxes. 

### 8.1 Variables Are Not Boxes

Better to say: "Variable `s` is assigned to the seesaw," but never "The seesaw is assigned to variable `s`." With reference variables, it makes much more sense to say that the variable is assigned to an object, and not the other way around. After all, the object is created before the assignment.

To understand an assignment in Python, always read the righthand side first: that’s where the object is created or retrieved. Af‐ ter that, the variable on the left is bound to the object, like a label stuck to it. Just forget about the boxes.

### 8.2 Identity, Equality, and Aliases

Every object has 

- an identity, 
	- comparable using `is`
- a type 
- and a value (the data it holds). 
	- comparable using `==` (python 的 `foo == bar` 相当于 java 的 `foo.equals(bar)`)

An object’s identity never changes once it has been created; you may think of it as the object’s address in memory. The is operator compares the identity of two objects; the `id()` function returns an integer representing its identity.

The real meaning of an object’s ID is implementation-dependent. In CPython, `id()` returns the memory address of the object, but it may be something else in another Python interpreter. The key point is that the ID is guaranteed to be a unique numeric label, and it will never change during the life of the object.

In practice, we rarely use the `id()` function while programming. Identity checks are most often done with the `is` operator, and not by comparing IDs.

#### 8.2.1 Choosing Between `==` and `is`

The `==` operator compares the values of objects, while is compares their identities.

However, if you are comparing a variable to a singleton, then it makes sense to use `is`. E.g. `if x is None`.

The is operator `is` faster than `==`, because it cannot be overloaded, so Python does not have to find and invoke special methods to evaluate it, and computing is as simplecomparing two integer IDs. In contrast, `a == b` is syntactic sugar for `a.__eq__(b)`. The `__eq__` method inherited from `object` compares object IDs, so it produces the same result as is. But most built-in types override `__eq__` with more meaningful implementations that actually take into account the values of the object attributes. 

#### 8.2.2 The Relative Immutability of Tuples

注意 immutable 的含义是本身的 value 不可变：

```python
>>> a = (1,2)
>>> a[0] = 11
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: 'tuple' object does not support item assignment

>>> b = "hello"
>>> b[0] = "w"
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: 'str' object does not support item assignment
```

你需要新的值就自己去创建一个新的，不可能把我当前的值修改一下再拿去用。

但是，Tuples, like most Python collections--lists, dicts, sets, etc.--hold references to objects. If the referenced items are mutable, they may change even if the tuple itself does not. 

```python
>>> t1 = (1, 2, [30, 40])
>>> id(t1[-1])
4302515784
>>> t1[-1].append(99)
>>> t1
(1, 2, [30, 40, 99])
>>> id(t1[-1])
4302515784
```

所以我们可以更新下 immutable 的定义：本身的 value 不可变；如果 value 内部包含 reference，这个 reference 不可变，但 reference 对应的 object 可变。

tuple 设计成 immutable 的好处是：

1. python 中必须 immutable 才能 hashable，所以 tuple 可以做 dict 的 key（list 就不可以）
1. function 接收参数 tuple 时不用担心 tuple 被篡改，可以免去 defensive copy 的操作，算得上是一种 optimization

### 8.3 Copies Are Shallow by Default

For mutable sequences, there are 2 ways of copying:

- By constructor: `a = [1,2]; b = list(a)`
- By slicing: `a = [1,2]; b = a[:]`

**N.B.** for a tuple `t`, neither `t[:]` nor `tuple(t)` makes a copy, but returns a reference to the same object. The same behavior can be observed with instances of `str`, `bytes`, and `frozenset`.  

但是！这样的 copy 都是 shallow copy。考虑 list 内还有 list 和 tuple 的场景：

```python
a = [1, [22, 33, 44], (7, 8, 9)]
b = list(a)

a.append(100)    # changes ONLY a
a[1].remove(44)  # changes BOTH a and b

print('a:', a)   # a: [1, [22, 33], (7, 8, 9), 100]
print('b:', b)   # b: [1, [22, 33], (7, 8, 9)]

b[1] += [55, 66] # changes BOTH a and b
b[2] += (10, 11) # changes ONLY b because tuples are immutable

print('a:', a)   # a: [1, [22, 33, 55, 66], (7, 8, 9), 100]
print('b:', b)   # b: [1, [22, 33, 55, 66], (7, 8, 9, 10, 11)]
```

#### 8.3.1 Deep and Shallow Copies of Arbitrary Objects

```python
from copy import copy, deepcopy

a = [1, [22, 33, 44], (7, 8, 9)]

b = copy(a)      # shallow copy
c = deepcopy(a)  # as name sugguests
```

```python
>>> id(a[1])
140001961723656
>>> id(b[1])
140001961723656
>>> id(c[1])
140001961723592
```

Note that making deep copies is not a simple matter in the general case. 

- Objects may have cyclic references that would cause a naive algorithm to enter an infinite loop. 
	- The `deepcopy` function remembers the objects already copied to handle cyclic references gracefully. 
- Also, a deep copy may be too deep in some cases. For example, objects may refer external resources or singletons that should not be copied. 
	- You can control the behavior of both `copy` and `deepcopy` by implementing the `__copy__()` and `__deepcopy__()` special methods

### 8.4 Function Parameters as References

The only mode of parameter passing in Python is **call by sharing**. That is the same mode used in most OO languages, including Ruby, SmallTalk, and Java (this applies to Java reference types; primitive types use **call by value**). Call by sharing means that each formal parameter of the function gets a copy of each reference in the arguments. In other words, the parameters inside the function become aliases of the actual arguments.

The result of this scheme is that a function may change any mutable object passed as a parameter, but it cannot change the identity of those objects.

#### 8.4.1 Mutable Types as Parameter Defaults: Bad Idea

这个现象前所未见！先上例子

```python
class HauntedBus:
	"""A bus model haunted by ghost passengers"""
	def __init__(self, passengers=[]):  # Tricky Here!
		self.passengers = passengers
	
	def pick(self, name):
		self.passengers.append(name)
	
	def drop(self, name):
		self.passengers.remove(name)
```

```python
>>> bus1 = HauntedBus()
>>> bus1.pick('Alice')

>>> bus2 = HauntedBus()
>>> bus2.passengers
['Alice']

>>> bus2.pick('Bob')
>>> bus1.passengers
['Alice', 'Bob']
```

The problem is that each default value is eval‐ uated when the function is defined--i.e., usually when the module is loaded--and the default values become attributes of the function object. So if a default value is a mutable object, and you change it, the change will affect every future call of the function.

所以，默认参数的逻辑相当于：

```python
HauntedBus.__init__.__defaults__ = []

bus1 = HauntedBus(HauntedBus.__init__.__defaults__)
	# bus1.passengers = HauntedBus.__init__.__defaults__ (==[])
bus1.pick('Alice')
	# bus1.passengers.append('Alice')
	# ALSO changes HauntedBus.__init__.__defaults__

bus2 = HauntedBus(HauntedBus.__init__.__defaults__)
	# bus2.passengers = HauntedBus.__init__.__defaults__ (==['Alice'])
```

The issue with mutable defaults explains why `None` is often used as the default value for parameters that may receive mutable values. Best practice:

```python
class Bus:
	def __init__(self, passengers=None): 
		if passengers is None:
			self.passengers = []
		else:
			self.passengers = list(passenger)  # or deep copy if necessary
```

#### 8.4.2 Defensive Programming with Mutable Parameters

When you are coding a function that receives a mutable parameter, you should carefully consider whether the caller expects the argument passed to be changed.

### 8.5 `del` and Garbage Collection

The `del` statement **deletes names, not objects**. An object may be garbage collected as result of a `del` command, but only if the variable deleted holds the last reference to the object, or if the object becomes unreachable. Rebinding a variable may also cause the number of references to an object to reach zero, causing its destruction.

**N.B.** `__del__` is invoked by the Python interpreter when the instance is about to be destroyed to give it a chance to release external resources. You will seldom need to implement `__del__` in your own code. (感觉和 java 里面你不需要去写 `finalize()` 差不多)

- In CPython, the primary algorithm for garbage collection is reference counting. As soon as that _refcount_ reaches 0, the object is immediately destroyed: CPython calls the `__del__` method on the object (if defined) and then frees the memory allocated to the object. 
- In CPython 2.0, a generational garbage collection algorithm was added to detect groups of objects involved in reference cycles--which may be unreachable even with outstand‐ ing references to them, when all the mutual references are contained within the group. 

To demonstrate the end of an object’s life, the following example uses `weakref.finalize` to register a callback function to be called when an object is destroyed.

```python
>>> import weakref
>>> s1 = {1, 2, 3}
>>> s2 = s1
>>> def bye():
...     print('Gone with the wind...')
...
>>> ender = weakref.finalize(s1, bye)
>>> ender.alive
True
>>> del s1
>>> ender.alive
True
>>> s2 = 'spam'
Gone with the wind...
>>> ender.alive
False
```

### 8.6 Weak References

概念可以参考 [Understanding Weak References](/java/2014/06/04/digest-of-effective-java#weakReference).

Weak references to an object do not increase its reference count. The object that is the target of a reference is called the **referent**. Therefore, we say that a weak reference does not prevent the referent from being garbage collected.

#### 8.6.1 The `WeakValueDictionary` Skit

The class `WeakValueDictionary` implements a mutable mapping where the values are weak references to objects. When a referent is garbage collected elsewhere in the program, the corresponding key is automatically removed from `WeakValueDictionary`. This is commonly used for caching.

#### 8.6.2 Limitations of Weak References

Not every Python object may be the referent of a weak reference. 

- Basic list and dict instances may not be referents, but a plain subclass of either can solve this problem easily.
- `int` and tuple instances cannot be referents of weak references, even if subclasses of those types are created.

Most of these limitations are implementation details of CPython that may not applyother Python iterpreters.

### 8.7 Tricks Python Plays with Immutables

The sharing of string literals is an optimization technique called **interning**. CPython uses the same technique with small integers to avoid unnecessary duplication of “popular” numbers like 0, –1, and 42. Note that CPython does not intern all strings or integers, and the criteria it uses to do so is an undocumented implementation detail.

## Chapter 9 - A Pythonic Object

### 9.1 Object Representations

- `__repr__()`: returns a string representing the object as the developer wants to see it.
- `__str__()`: returns a string representing the object as the user wants to see it.
- `__byte__()`: called by `byte()` to get the object represented as a byte sequence
- `__format__()`: called by `foramt()` or `str.format()` to get string displays using special formatting codes

### 9.2 Vector Class Redux

没啥特别的，注意写法：

```python
class Vector2d:
	typecode = 'd'
	
	def __init__(self, x, y):
		self.x = float(x)
		self.y = float(y)
	
	def __iter__(self):
		return (i for i in (self.x, self.y))
	
	def __repr__(self):
		class_name = type(self).__name__  # 考虑到继承；灵活获取 class name 而不是写死
		return '{}({!r}, {!r})'.format(class_name, *self)
	
	def __str__(self):
		return str(tuple(self))
	
	def __bytes__(self):
		return (bytes([ord(self.typecode)]) + bytes(array(self.typecode, self)))

	def __eq__(self, other):
		return tuple(self) == tuple(other)
	
	def __abs__(self):
		return math.hypot(self.x, self.y)
	
	def__bool__(self):
		return bool(abs(self))
```

- `*self` 展开这个写法帅气～
- 注意 `*foo` 要求 `foo` 是个 iterable（上面有 `__iter__()` 所以满足条件）
- `__iter__()` 要求返回一个 iterator，上面例子里返回的是一个 generator (from a generator expression)
	- 注意它不是 tuple-comp，因为 python 不存在 tuple-comp 这种东西
	- 然后根据 [Iterables vs. Iterators vs. Generators](http://nvie.com/posts/iterators-vs-generators/) 我们得知 a generator is always a iterator，所以这个 `__iter__()` 写法成立
	- 还有一种写法也可以：`yield self.x; yield.self.y`

### 8.3 `classmethod` vs `staticmethod`

先上例子：

```python
class Demo:
    @classmethod
    def class_method(*args):
        return args

    @staticmethod
    def static_method(*args):
        return args
```

```python
>>> Demo.class_method()
(<class __main__.Demo at 0x7f206749d6d0>,)
>>> Demo.class_method('Foo')
(<class __main__.Demo at 0x7f206749d6d0>, 'Foo')
>>> Demo.static_method()
()
>>> Demo.static_method('Foo')
('Foo',)
```

- `@staticmethod` 好理解
- `@classmethod` 第一个参数必定是 class 本身
	- 注意这里 "class 本身" 指的是 `Demo` 而不是 `Demo.__class__`
	- 所以类似成员 method 第一个参数默认写 `self` 一样，`@classmethod` 第一个参数默认写 `cls`
		- `def member_method(self, *args)`
		- `def class_method(cls, *args)`
	- 这个 `cls` 可以当 constructor 用

```python
class Demo:
    def __init__(self, value):
        self.value = value 

    @classmethod
    def class_method(cls, value):
        return cls(value)

d = Demo.class_method(2)
print(d.value)  # Output: 2
```

### 8.4 Making It Hashable

To make `Vector2d` hashable, we must

- Implement `__hash__()`
	- `__eq__()` is also required then
- Make it immutable

To make `Vector2d`, we can only expose the getters, like

```python
class Vector2d:
	def __init__(self, x, y):
		self.__x = float(x)
		self.__y = float(y)

	@property
	def x(self):
		return self.__x

	@property
	def y(self):
		return self.__y

v = Vector2d(3, 4)

print(v.x)  # accessible
# v.x = 7   # forbidden!
```

#### 8.4.1 Digress: `@property` / `__getattribute__()` / `__get__()`

要想搞清楚 `@property` 的工作原理，我们需要先搞清楚 `b.x` 这样一个访问 object 字段的表达式是如何被解析的：

- `b.x`
	- $\Rightarrow$ `b.__getattribute__('x')`
		- CASE 1: `b.__dict__['x']` has defined `__get__()` $\Rightarrow$ `b.__dict__['x'].__get__(b, type(b))`
			- 若是访问 static member `B.x` 则会变成 `B.__dict__['x'].__get__(None, B)`
		- CASE 2: `b.__dict__['x']` has not defined `__get__()` $\Rightarrow$ just return `b.__dict__['x']`
			- 若是访问 static member `B.x` 则会变成 `B.__dict__['x']`

如果没有用 `@property`，一般的 `b.x` 都是 CASE 2，因为一般的 int、string 这些基础类型都没有实现 `__get__()`；用了 `@property` 的话，就是强行转成了 CASE 1，因为 `property(x)` 返回的是一个 `property` 对象，它是自带 `__get__` 方法的。

**N.B.** 我们称实现了以下三个方法的类型为 **descriptor**

- `__get__(self, obj, type=None) --> value`
- `__set__(self, obj, value) --> None`
- `__delete__(self, obj) --> None`

`property` 类型是 descriptor

我们来看一下代码分解：

```python
class B:
	@property
	def x(self):
		return self.__x

##### Is Equivalent TO #####

property_x = property(fget=x)
x = __dict__['x'] = property_x
```

然后就有

- `b.x`
	- $\Rightarrow$ `b.__dict__['x'].__get__(b, type(b))`
		- $\Rightarrow$ `property_x.__get__(b, type(b))`
			- $\Rightarrow$ `property_x.fget(b)`
				- $\Rightarrow$ 实际调用原始的 `x(b)` 方法（TMD 又绕回去了）
				- 注意：此时 `b.x()` 方法是调用不到的，因为 `b.x` 被优先解析了；这里 `property_x` 内部还能调用 `x(b)` 是因为它保存了这个原始的 `def x(self)` 方法

这里最 confusing 的地方在于：`b.x` 从一个 method 变成了一个 property 对象，而且屏蔽掉了对 `b.x()` 方法的访问。一个不那么 confusing 的写法是：

```python
class B:
	def get_x(self):
		return self.__x

	x = property(fget=get_x, fset=None, fdel=None, "Docstring here")
```

#### 8.4.2 Digress Further: `x.setter` / `x.deleter`

代码分解：

```python
# python 2 需要继承 `object` 才是 new-style class
# python 3 默认是 new-style class，继不继承 `object` 无所谓
# `x.setter` 和 `x.deleter` 需要在 new-style class 内才能正常工作
class B(object):
    def __init__(self):
        self._x = None

    @property
    def x(self):         # method-1
        """I'm the 'x' property."""
        return self._x

    @x.setter
    def x(self, value):  # method-2
        self._x = value

    @x.deleter
    def x(self):         # method-3
        del self._x

##### Is Equivalent TO #####

x = property(fget=x)  # 屏蔽了对 method-1 的访问
x = x.setter(x)       # 屏蔽了对 method-2 的访问
	# 实际是返回了原来 property 的 copy，并设置了 `fset`
	# x = property(fget=x.fget, fset=x)
x = x.deleter(x)      # 屏蔽了对 method-3 的访问
	# 实际是返回了原来 property 的 copy，并设置了 `fdel`
	# x = property(fget=x.fget, fset=x.fset, fdel=x)
```

不那么 confusing 的写法：

```python
class B(object):  
    def __init__(self):
        self._x = None

    def get_x(self):
        return self._xshiyong

    def set_x(self, value):
        self._x = value

    def del_x(self):
        del self._x

    x = property(fset=get_x, fset=set_x, fdel=del_x, "Docstring here")
```

#### 8.4.3 `__hash__()`

The `__hash__` special method documentation suggests using the bitwise XOR operator (`^`) to mix the hashes of the components.

```python
class Vector2d:
	def __eq__(self, other):
		return tuple(self) == tuple(other)

	def __hash__(self):
		return hash(self.x) ^ hash(self.y)
```

### 8.5 "Private" and "Protected"

Too prevent accidental overwritting of a private attribute of a class, python would store `__bar` attribute of class `Foo` in `Foo.__dict__` as `_Foo__bar`. This language feature is called **name mangling**.

Name mangling is about safety, not security: it’s designed to prevent accidental access and not intentional wrongdoing.

The single underscore prefix, like `_bar`, has no special meaning to the Python interpreter when used in attribute names, but it’s a very strong convention among Python programmers that you should not access such attributes from outside the class.

### 8.6 Saving Space with the `__slots__` Class Attribute

By default, Python stores instance attributes in a per-instance dict named `__dict__`. Dictinaries have a significant memory overhead, especially when you are dealing with millions of instances with few attributes. The `__slots__` class attribute can save a lot of memory, by letting the interpreter store the instance attributes in a tuple instead of a dict.

- A `__slots__` attribute inherited from a superclass has no effect. Python only takes into account __slots__ attributes defined in each class individually.

```python
class Vector2d:
	__slots__ = ('__x', '__y')

	def __init__(self, x, y):
		self.__x = float(x)
		self.__y = float(y)
```

When `__slots__` is specified in a class, its instances will not be allowed to have any other attributes apart from those named in `__slots__`. It’s considered a bad practice to use `__slots__` just to prevent users of your class from creating new attributes. `__slots__` should used for optimization, not for programmer restraint.

It may be possible, however, to “save memory and eat it too”: if you add `__dict__` to the `__slots__` list, your instances will keep attributes named in `__slots__` in the per-instance tuple, but will also support dynamically created attributes, which will be stored in the usual `__dict__`, entirely defeating `__slots__`'s purpose.

There is another special per-instance attribute that you may want to keep: the `__weak ref__` attribute, which exists by default in instances of user-defined classes. However, if the class defines `__slots__`, and you need the instances to be target of weak references, then you need to include `__weakref__` among the attribute named in `__slots__`.

### 8.7 Overriding Class Attributes

比如前面的 `typecode = 'd'` 和 `__slots__` 这样不带 `self` 初始化的都是 class attributes，类似 java 的 static.

If you write to an instance attribute that does not exist, you create a new instance attribute. 假设你有一个 class attribute `Foo.bar` 和 instance `f`，正常情况下 `f.bar` 可以访问到 `Foo.bar`，但你可以重新赋值 `f.bar = 'baz'` 从而覆盖掉原有的 `f.bar` 的值，同时 class attribute `Foo.bar` 不会受影响。这实际上提供了一种新的继承和多态的思路（不用把 `bar` 设计成 `Foo` 的 instance attribute）。

## Chapter 10 - Sequence Hacking, Hashing, and Slicing

In this chapter, we will create a class to represent a multidimensional Vector class--a significant step up from the two-dimensional Vector2d of Chapter 9. 

### 10.1 `Vector` Take #1: `Vector2d` Compatible

先说个题外话，你在 console 里面直接输入 `f` 然后回车，调用的是 `f.__repr__()`，而 `print(f)` 调用的是 `f.__str__()`（如果有定义的话；没有的话还是会 fall back 到 `f.__repr__()`）

```python
>>> class Foo:
...     def __repr__(self):
...             return "Running Foo.__repr__()"
...     def __str__(self):
...             return "Running Foo.__str__()"
... 
>>> f = Foo()
>>> f
Running Foo.__repr__()
>>> print(f)
Running Foo.__str__()
```

这也说明一点：你在 debug 的时候不应该把 `__repr__` 设计得太复杂，想想一下满屏的字符串看起来是有多头痛。

```python
from array import array
import reprlib
import math

class Vector:
	typecode = 'd'
	def __init__(self, components):
		self._components = array(self.typecode, components)
	
	def __iter__(self):
		return iter(self._components)
		
	def __repr__(self):
		components = reprlib.repr(self._components)
		components = components[components.find('['):-1]
		return 'Vector({})'.format(components)
		
	def __str__(self):
		return str(tuple(self))
		
	def __bytes__(self):
		return (bytes([ord(self.typecode)]) + bytes(self._components))

	def __eq__(self, other):
		return tuple(self) == tuple(other)
		
	def __abs__(self):
		return math.sqrt(sum(x * x for x in self))
		
	def __bool__(self):
		return bool(abs(self))
		
	@classmethod
	def frombytes(cls, octets):
		typecode = chr(octets[0])
		memv = memoryview(octets[1:]).cast(typecode)
		return cls(memv)
```

上面这个 `__repr__` 的处理就很值得学习：`reprlib.repr()` 的返回值类似 `array('d', [0.0, 1.0, 2.0, 3.0, 4.0, ...])`，超过 6 个元素就会用省略号表示；然后上面的代码再截取出 `[...]` 的部分然后格式化输出。

### Digress: Protocols and Duck Typing

In the context of object-oriented programming, a protocol is an informal interface, defined only in documentation and not in code. 简单说，只要实现了 protocol 要求的函数，你就是 protocol 的实现，并不用显式声明你要实现这个 protocol（反例就是 java 的 `interface`）

Duck Typing 的源起：

> Don’t check whether it **_is-a_** duck: check whether it **_quacks-like-a_** duck, **_walks-like-a_** duck, etc, etc, depending on exactly what subset of duck-like behavior you need to play your language-games with. ([comp.lang.python](https://groups.google.com/forum/#!forum/comp.lang.python), Jul. 26, 2000)
> — Alex Martelli

简单说就是 python 并不要求显式声明 **_is-a_**（当然你要显式也是可以的--用 ABC，但是需要注意不仅限于 `abc.ABC`，还有 `collections.abc` 等细分的 ABC，比如 `MutableSequence`；参 11.3 章节），**_like-a_** 在 python 里等同于 **_is-a_**。

### 10.2 `Vector` Take #2: A Sliceable Sequence

Basic sequence protocol: `__len__` and `__getitem__`:

```python
class Vector:
	def __len__(self):
		return len(self._components)
	
	def __getitem__(self, index):
		return self._components[index]
```

```python
>>> v1 = Vector([3, 4, 5])
>>> len(v1)
3
>>> v1[0], v1[-1]
(3.0, 5.0)
>>> v7 = Vector(range(7))
>>> v7[1:4]
array('d', [1.0, 2.0, 3.0])  # It would be better if a slice of Vector is also a Vector
```

#### 10.2.1 How Slicing Works

```python
>>> class MySeq:
... 	def __getitem__(self, index):
...		return index 
...
>>> s = MySeq()
>>> s[1] 
1
>>> s[1:4] 
slice(1, 4, None)
>>> s[1:4:2] 
slice(1, 4, 2)
>>> s[1:4:2, 9] 
(slice(1, 4, 2), 9)
>>> s[1:4:2, 7:9] 
(slice(1, 4, 2), slice(7, 9, None))
```

可以看到：

- `s[1]` $\Rightarrow$ `s.__getitem__(1)`
- `s[1:4]` $\Rightarrow$ `s.__getitem__(slice(1, 4, None))`
- `s[1:4:2]` $\Rightarrow$ `s.__getitem__(slice(1, 4, 2))`
- `s[1:4:2, 9]` $\Rightarrow$ `s.__getitem__((slice(1, 4, 2), 9))`
- `s[1:4:2, 7:9]` $\Rightarrow$ `s.__getitem__((slice(1, 4, 2), slice(7, 9, None)))`

`slice` is a built-in type. `slice(1, 4, 2)` means "start at 1, stop at 4, step by 2". `dir(slice)` you'll find 3 attributes, `start`, `stop`, `step` and 1 method, `indices`.

假设有一个 `s = slice(...)`，那么 `s.indices(n)` 的作用就是：当我们用 `s` 去 slice 一个长度为 `n` 的 sequence 时，`s.indices(n)` 会返回一个 tuple `(start, stop, step)` 表示这个 sequence-specific 的 slice 信息。举个例子说：`slice(0, None, None)` 是一个 general 的 slice，但当它作用于一个长度为 5 和一个长度为 7 的 sequence 时，它内部的逻辑是不一样的，一个会变成 `[1:5]` 另一个会变成 `[1:7]`。

```python
>>> s = slice(0, None, None)
>>> s.indices(5)
(0, 5, 1)
>>> s.indices(7)
(0, 7, 1)
```

slice 有很多类似这样的 "智能的" 处理方法，比如 "如果 `step` 比 `n` 还要大的时候该怎么办"；可以参考这篇 [
The Intelligence Behind Python Slices](http://avilpage.com/2015/03/a-slice-of-python-intelligence-behind.html)。

另外需要注意的是，如果你自己去实现一个 sequence from scratch，你可能需要类似 [Extended Slices](https://docs.python.org/2.3/whatsnew/section-slices.html) 上这个例子的实现：

```python
class FakeSeq:
    def calc_item(self, i):
        """Return the i-th element"""

    def __getitem__(self, item):
        if isinstance(item, slice):
            indices = item.indices(len(self))
            return FakeSeq([self.calc_item(i) for i in range(*indices)])
        else:
            return self.calc_item(i)
```

如果你是组合了一个 built-in sequence 来实现自己的 sequence，你就不需要用到 `s.indices(n)` 方法，因为可以直接 delegate 给这个 built-in sequence 去处理，书上的例子就是这样的，见下。


#### 10.2.2 A Slice-Aware `__getitem__`

```python
def __getitem__(self, index):
	cls = type(self)
	
	if isinstance(index, slice):
		return cls(self._components[index])
	elif isinstance(index, numbers.Integral):
		return self._components[index]
	else:
		msg = '{cls.__name__} indices must be integers'
		raise TypeError(msg.format(cls=cls))
```

### 10.3 `Vector` Take #3: Dynamic Attribute Access

我们想保留 "用 `x`, `y`, `z` 和 `t` 来指代一个 vector 的前 4 个维度" 这么一个 convention，换言之我们想要有 `v.x == v[0]` etc.

方案一：用 `@property` 去写 4 个 getter

方案二：用 `__getattr__`。等 `v.x` 这个 attribute lookup fails，然后 fall back 到 `__getattr__` 处理。这个方案更灵活。

```python
shortcut_names = 'xyzt'

def __getattr__(self, name):
	cls = type(self)

	if len(name) == 1:
		pos = cls.shortcut_names.find(name)
		if 0 <= pos < len(self._components):
			return self._components[pos]

	msg = '{.__name__!r} object has no attribute {!r}'
	raise AttributeError(msg.format(cls, name))
```

但是这么一来会引入一个新的问题：你如何处理 `v.x = 10` 这样的赋值？是允许它创建一个新的 attribute `x`？还是去修改 `v[0]` 的值？

如果你允许它创建新的 attribute `x`，那么下次 `v.x` 就不会 fall back 到 `__getattr__` 了。去修改 `v[0]` 我觉得是可信的，但是书上决定把 `v.x` 到 `v.t` 这 4 个 attribute 做成 read-only，同时禁止创建名字为单个小写字母的 attribute。这些逻辑的去处是 `__setattr__`:

```python
def __setattr__(self, name, value):
	cls = type(self)

	if len(name) == 1:
		if name in cls.shortcut_names:
			error = 'readonly attribute {attr_name!r}'
		elif name.islower():
			error = "can't set attributes 'a' to 'z' in {cls_name!r}"
		else:
			error = ''
		
		if error:
			msg = error.format(cls_name=cls.__name__, attr_name=name)
			raise AttributeError(msg)

	super().__setattr__(name, value)  # 正常创建名字合法的 attribute
```

如果你要限定允许的 attribute name，一个可以 work 的方案是用 `__slots__`，但如同前面所说的，这个用途违背了 `__slots__` 的设计初衷，不推荐使用。

### 10.4 `Vector` Take #4: Hashing and a Faster `==`

```python
import functools 
import operator 

class Vector:
	def __eq__(self, other): #
		return tuple(self) == tuple(other)
	
	def __hash__(self):
		# Generator expression! 
		# Lazily compute the hash of each component.
		# 可以省一点空间，相对于 List 而言（只占用一个元素的内存，而不是一整个 list 的） 
		hashes = (hash(x) for x in self._components)  
		return functools.reduce(operator.xor, hashes, 0)
```

When using `reduce`, it’s good practice to provide the third argument, `reduce(function, iterable, initializer)`, to prevent this exception: `TypeError: reduce() of empty sequence with no initial value` (excellent message: explains the problem and how to fix it). The `initializer` is the value returned if the sequence is empty and is used as the first argument in the reducing loop, so it should be the identity value of the operation. As examples, for `+`, `|`, `^` the `initializer` should be 0, but for `*`, `&` it should be 1.

这个 `__hash__` 的实现也是很好的 map-reduce 的例子：apply function to each item to generate a new series (map), then compute aggregate (reduce)。用下面这个写法就更明显了：

```python
def __hash__(self):
	hashes = map(hash, self._components)
	return functools.reduce(operator.xor, hashes, 0)
```

对 high-dimensional 的 vector，我们的 `__eq__` 性能可能会有问题。一个更好的实现是：

```python
def __eq__(self, other):
	if len(self) != len(other): 
		return False
	
	for a, b in zip(self, other): 
		if a != b: 
		return False
	
	return True 

# ----- Even Better ----- #

def __eq__(self, other):
	return len(self) == len(other) and all(a == b for a, b in zip(self, other))
```

### 10.5 `Vector` Take #5: Formatting

略

## Chapter 11 - Interfaces: From Protocols to ABCs

### 11.1 Monkey-Patching to Implement a Protocol at Runtime

Monkey patch refers to dynamic modifications of a class or module at runtime, motivated by the intent to patch existing third-party code as a workaround to a bug or feature which does not act as desired.

比如我们第一章的 `FrenchDeck` 不支持 `shuffle()` 操作，error 告诉我们底层原因是因为没有支持 `__setitem__`:

```python
>>> from random import shuffle
>>> from frenchdeck import FrenchDeck
>>> deck = FrenchDeck()
>>> shuffle(deck)
Traceback (most recent call last):
File "<stdin>", line 1, in <module>
File ".../python3.3/random.py", line 265, in shuffle
x[i], x[j] = x[j], x[i]
TypeError: 'FrenchDeck' object does not support item assignment
```

所以我们可以直接在 runtime 里给 `FrenchDeck` 加一个 `__setitem__` 而不用去修改它的源代码：

```python
>>> def set_card(deck, position, card):
...		deck._cards[position] = card
...
>>> FrenchDeck.__setitem__ = set_card
>>> shuffle(deck)
```

有点像给 JS 元素动态添加 event-listener。

### 11.2 Subclassing an ABC

Python does not check for the implementation of the abstract methods at import time, but only at runtime when we actually try to instantiate the subclass. 

### 11.3 ABCs in the Standard Library

Every ABC depends on `abc.ABC`, but we don’t need to import it ourselves except to create a new ABC.

#### 11.3.1 ABCs in `collections.abc`

![][11-3-collections-abc]

更详细的说明见 [Python documentation - 8.4.1. Collections Abstract Base Classes](https://docs.python.org/3/library/collections.abc.html#collections-abstract-base-classes)

#### 11.3.2 The `numbers` Tower of ABCs

`numbers` package 有如下的的继承关系：

- `Number`
	- $\Uparrow$ `Complex` (A complex number is a number of the form $a + bi$, where $a$ and $b$ are real numbers and $i$ is the imaginary unit.)
		- $\Uparrow$ `Real` (A real number can be seen as a special complex where $b=0$; the real numbers include all the rational numbers and all the irrational numbers.)
			- $\Uparrow$ `Rational` (A Rational Number is a real number that can be written as a simple fraction, i.e. as a ratio. 反例：$\sqrt 2$)
				- $\Uparrow$ `Integral`

另外有：

- `int` 实现了 `numbers.Integral`，然后 `bool` subclasses `int`，所以 `isinstance(x, numbers.Integral)` 对 `int` 和 `bool` 都有效
- `isinstance(x, numbers.Real)` 对 `bool`、`int`、`float`、`fractions.Fraction` 都有效（所以这不是一个很好的 check if `x` is float 的方法）
	- However, `decimal.Decimal` 并没有实现 `numbers.Real`

### 11.4 Defining and Using an ABC

An abstract method can actually have an implementation. Even if it does, subclasses will still be forced to override it, but they will be able to invoke the abstract method with `super()`, adding functionality to it instead of implementing from scratch.

注意版本问题：

```python
import abc

# ----- Python 3.4 or above ----- #
class Foo(abc.ABC):
	pass

# ----- Before Python 3.4 ----- #
class Foo(metaclass=abc.ABCMeta):  # No `abc.ABC` before Python 3.4
	pass

# ----- Holy Python 2 ----- #
class Foo(object):  # No `metaclass` argument in Python 2
	__metaclass__ = abc.ABCMeta
	pass
```

Python 3.4 引入的逻辑其实是 `def abc.ABC(metaclass=abc.ABCMeta)`

另外 `@abc.abstractmethod` 必须是 innermost 的 decorator（i.e. 它与 `def` 之间不能再有别的 decorator）

### 11.5 Virtual Subclasses

我第一个想到的是 [C++: Virtual Inheritance](/c++/2015/04/24/cpp-virtual-inheritance)，但是在 python 这里 virtual subclass 根本不是这个意思。

python 的 virtual subclass 简单说，就是你的 `VirtualExt` 在 `issubclass` 和 `isinstance` 看来都是 `Base` 的子类，但实际上 `VirtualExt` 并不继承 `Base`，即使 `Base` 是 ABC，`VirtualExt` 也不用实现 `Base` 要求的接口。

不过说实话，你 `issubclass` 和 `isinstance` 都已经判断成子类了，我想不出你不用这个多态的理由……

具体写法：

```python
import abc

class Base(abc.ABC):
	def __init__(self):
		self.x = 5
	
	@abc.abstractmethod
	def foo():
		"""Do nothing"""

class TrueBase():
	def __init__(self):
		self.y = 5

@Base.register
class VirtualExt(TrueBase):
	pass
```

```python
>>> issubclass(VirtualExt, Base)
True
>>> issubclass(VirtualExt, TrueBase)
True
>>> ve = VirtualExt()
>>> isinstance(ve, Base)
True
>>> isinstance(ve, TrueBase)
True
>>> ve.x
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
AttributeError: 'VirtualExt' object has no attribute 'x'
>>> ve.foo()
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
AttributeError: 'VirtualExt' object has no attribute 'foo'
>>> ve.y
5
```

说明一下：

- `Base.register()` 其实是继承自 `abc.ABC.register()`，意思是 "把 `VirtualExt` register 成 `Base` 的子类，with no doubt"
	- 进一步说明你只能 virtually 继承一个 ABC
- `issubclass(VirtualExt, Base) == True` 和 `isinstance(ve, Base) == True` 都成立但是 `VirtualExt` 既没有 attribute `x` 也没有实现 `foo`
	- 所以说这是一个 "假" 继承（我觉得叫 Fake Inheritance 更合适……） 
- `class VirtualExt(TrueBase)` 这是一个 真·继承
- 这里也不是多重继承
	- 多重继承你得写成 `class MultiExt(Base, TrueBase)`

Inheritance is guided by a special class attribute named `__mro__`, the **Method Resolution Order**. It basically lists the class and its superclasses in the order Python uses to search for methods. 

```python
>>> VirtualExt.__mro__
(<class '__main__.VirtualExt'>, <class '__main__.TrueBase'>, <class 'object'>)
```

`Base` is not in `VirtualExt.__mro__`. 这进一步验证了我们的结论：`VirtualExt` 并没有实际继承 `Base`。

#### 11.5.1 `issubclass` Alternatives: `__subclasses__` and `_abc_registry`

- `Base.__subclasses__()` (注意这是一个方法) 
	- 返回所有 `Base` 的 immediate 子类（即不会递归去找子类的子类）
		- 没有 import 进来的子类是不可能被找到的
	- 不会列出 virtual 子类
	- 不 care `Base` 是不是 ABC
- `Base._abc_registry` (注意这是一个attribute)
	- 要求 `Base` 是 ABC
	- 返回所有 `Base` 的 virtual 子类
	- 返回值类型其实是一个 `WeakSet`，元素是 weak references to virtual subclasses

#### 11.5.2 `__subclasshook__`

- 必须是一个 `@classmethod`
- 写在 ABC 父类中，如果 `Base.__subclasshook__(Ext) == True`，则 `issubclass(Ext, Base) == True`
	- 注意这是由父类直接控制 `issubclasses` 的逻辑
	- 不需要走 `Base.register()` 

书上的例子是 `collections.abc.Sized`，它的逻辑是：只要是实现了 `__len__` 方法的类都是我 `Sized` 的子类：

```python
class Sized(metaclass=ABCMeta):
	__slots__ = ()
	
	@abstractmethod
	def __len__(self):
		return 0
	
	@classmethod
	def __subclasshook__(cls, C):	
		if cls is Sized:
			if any("__len__" in B.__dict__ for B in C.__mro__):
				return True 
	return NotImplemented  # See https://docs.python.org/3/library/constants.html
```

但是在你自己的 ABC 业务类中并不推荐使用 `__subclasshook__`，因为它太底层了，多用于 lib 设计中。

## Chapter 12 - Inheritance: For Good or For Worse

本章谈两个问题：

- The pitfalls of subclassing from built-in types
- Multiple inheritance and the method resolution order

### 12.1 Subclassing Built-In Types Is Tricky

一个很微妙的问题：你无法确定底层函数的调用逻辑。举个例子，我们之前有说 `getattr(obj, name)` 的逻辑是先去取 `obj.__getattribute__(name)`。所以正常的想法是：我子类如果覆写了 `__getattribute__`，那么 `getattr` 作用在子类上的行为也会相应改变。但是实际情况是：`getattr` 不一定会实际调用 `__getattribute__`（比如说有可能去调用公用的更底层的逻辑）。而且这个行为是 language-implementation-specific 的，所以有可能 _PyPy_ 和 _CPython_ 的逻辑还不一样。

[Differences between PyPy and CPython >> Subclasses of built-in types]():

> Officially, CPython has no rule at all for when exactly overridden method of subclasses of built-in types get implicitly called or not. As an approximation, these methods are never called by other built-in methods of the same object. For example, an overridden `__getitem__()` in a subclass of `dict` will not be called by e.g. the built-in `get()` method.

Subclassing built-in types like `dict` or `list` or `str` directly is error-prone because the built-in methods mostly ignore user-defined overrides. Instead of subclassing the built-ins, derive your classes from the `collections` module using `UserDict`, `UserList`, and `UserString`, which are designed to be easily extended.

### 12.2 Multiple Inheritance and Method Resolution Order

首先 python 没有 [C++: Virtual Inheritance](/c++/2015/04/24/cpp-virtual-inheritance) 里的 dread diamond 问题，子类 `D` 定位到父类 `A` 的方法毫无压力，而且查找顺序是固定的--以 `D.__mro__` 的顺序为准。

另外需要注意的是，等价于 `instance.method()`，`Class.method(instance)` 这种有点像 static 的写法的也是可行的：

```python
>>> class Foo:
...     def bar(self):
...             print("bar")
... 
>>> f = Foo()
>>> f.bar()
bar
>>> Foo.bar(f)
bar
```

所以可以衍生出 `Base.method(ext)` 这种写法，相当于在子类对象 `ext` 上调用父类 `Base` 的方法。当然更好的写法是在 `Ext` 里用 `super().method()`。

从上面这个例子出发，我们还可以引申出另外一个问题：既没有 `self` 参数也没有标注 `@staticmethod` 的方法是怎样的存在？

```python
>>> class Foo:
...     def bar():
...             print("bar")
...     @staticmethod
...     def baz():
...             print("baz")
... 
>>> f = Foo()
>>> f.bar()
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: bar() takes 0 positional arguments but 1 was given
>>> f.baz()
baz
>>> Foo.bar()
bar
>>> Foo.baz()
baz
```

可见：

- 对成员方法 `bar`：`f.bar()` 会无脑转换成 `Foo.bar(f)`
	- 所以如果不给 `bar` 定一个 `self` 参数的话，它就不可能成为一个成员方法，而是成了一个 ”只能通过 `Foo` 访问的" static 方法
- 对 static 方法 `baz`：`f.baz()` 转换成 `Foo.baz()` 这是顺理成章的

### 12.3 Coping with Multiple Inheritance

1. Distinguish Interface Inheritance from Implementation Inheritance
1. Make Interfaces Explicit with ABCs
1. Use Mixins for Code Reuse
	- Conceptually, a mixin does not define a new type; it merely bundles methods for reuse.
	- A mixin should never be instantiated, and concrete classes should not inherit only from a mixin. 
	- Eachs mixin should provide a single specific behavior, implementing few and very closely related methods.
1. Make Mixins Explicit by Naming
1. An ABC May Also Be a Mixin; The Reverse Is Not True
1. Don’t Subclass from More Than One Concrete Class
1. Provide Aggregate Classes to Users
	- If some combination of ABCs or mixins is particularly useful to client code, provide a class that brings them together in a sensible way. Grady Booch calls this an aggregate class.
1. “Favor Object Composition Over Class Inheritance.”
	- Universally true.

## Chapter 13 - Operator Overloading: Doing It Right

### 13.1 Operator Overloading 101

Python limitation on operator overloading:

- We cannot overload operators for the built-in types.
- We cannot create new operators, only overload existing ones.
- A few operators can’t be overloaded: `is`, `and`, `or`, `not` (but the bitwise `&`, `|`, `~`, can).

### 13.2 Unary Operators

- `+` $\Rightarrow$ `__pos__`
- `-` $\Rightarrow$ `__neg__`
- `~` $\Rightarrow$ `__invert__`
	- Bitwise inverse of an integer, defined as `~x == -(x+1)`
- `abs` $\Rightarrow$ `__abs__`

When implementing, always return a new object instead of modifying `self`.

### 13.3 `+` for Vector Addition

```python
import itertools

def __add__(self, other):
	pairs = itertools.zip_longest(self, other, fillvalue=0.0)
	return Vector(a + b for a, b in pairs) 
```

- `zip_longest` 这个是见识到了！这么一来 length 不同的 Vector 也可以相加了
- `other` 没有类型限制，但是要注意这么一来有个加法顺序的问题：
	- `Vector([1, 2]) + (3, 4)` 是 OK 的，等同于 `v.__add__((3, 4))`
	- 反过来 `(3, 4) + Vector([1, 2])` 就不行，因为 tuple 的 `__add__` 处理不了 Vector
		- 而且 tuple 的加法是被设计成 concat 的，`(1, 2) + (3, 4) == (1, 2, 3, 4)`

To support operations involving objects of different types, Python implements a special dispatching mechanism for the infix operator special methods. Given an expression `a + b`, the interpreter will perform these steps: 

1. Call `a.__add__(b)`. 
1. If `a` doesn’t have `__add__`, or calling it returns `NotImplemented`, call `b.__radd__(a)`. 
	- `__radd__` means "reflected", "reversed" or "right" version of `__add__`
	- 同理还有 `__rsub__`
1. If `b` doesn’t have `__radd__`, or calling it returns `NotImplemented`, raise `TypeError` with an `unsupported operand types` message.

所以加一个 `__radd__` 就可以解决 `(3, 4) + Vector([1, 2])` 的问题：

```python
def __radd__(self, other):
	return self + other
```

注意这里的逻辑：`tuple.__add__(vector)` $\Rightarrow$ `vector.__radd__(tuple)` $\Rightarrow$ `vector.__add__(tuple)`。

另外一个需要注意的是：如何规范地 return `NotImplemented`？示范代码：

```python
def __add__(self, other):
	try:
		pairs = itertools.zip_longest(self, other, fillvalue=0.0)
		return Vector(a + b for a, b in pairs) 
	except TypeError:
		return NotImplemented
```

### 13.4 `*` for Scalar Multiplication

这里我们限制一下乘数的类型：

```python
import numbers

def __mul__(self, scalar):
	if isinstance(scalar, numbers.Real): 
		return Vector(n * scalar for n in self)
	else: 
		return NotImplemented

def __rmul__(self, scalar):
	return self * scalar
```

### Digress: `@` for Matrix Multiplication since Python 3.5 

```python
>>> import numpy as np
>>> va = np.array([1, 2, 3])
>>> vb = np.array([5, 6, 7])
>>> va @ vb  # 1*5 + 2*6 + 3*7
38
>>> va.dot(vb)
38
```

### Digress: `__ixxx__` Series In-place Operators

比如 `a += 2` 其实就是 `a.__iadd__(2)`。

另外注意 python 没有 `a++` 和 `++a` 这样的操作

### 13.5 Rich Comparison Operators

![][13-5-Rich-Comparison-Operators]

reverse 的逻辑还是一样的：如果 `a.__eq__(b)` 行不通就调用 `b.__eq__(a)`。需要注意 type checking 的情景，因为有可能存在继承关系：

- 比如 `ext.__eq__(base) == False` 因为 `isinstace(base, Ext) == False`
- 此时反过来跑去调用 `base.__eq__(ext)`，结果 `isintace(ext, Base) == True`，而且后续的比较也都 OK，最后还是返回了 `True`
- 相当于强行要求你考虑 reflexivity 自反性

### 13.6 Augmented Assignment Operators

If a class does not implement the in-place operators, the augmented assignment operators are just syntactic sugar: `a += b` is evaluated exactly as `a = a + b`. That’s the expected behavior for immutable types, and if you have `__add__` then `+=` will work with no additional code.

- The in-place special methods should never be implemented for immutable types like our `Vector` class. 

As the name says, these in-place operators are expected to change the lefthand operand in place, and not create a new object as the result.

## Chapter 14 - Iterables, Iterators, and Generators

一篇很好的 blog 以供参考：[nvie.com: Iterables vs. Iterators vs. Generators](http://nvie.com/posts/iterators-vs-generators/)

![][14-Iterables-vs-Iterators-vs-Generators]

### 14.1 `Sentence` Take #1: A Sequence of Words

```python
import re
import reprlib

RE_WORD = re.compile('\w+')

class Sentence:
	def __init__(self, text):
		self.text = text
		self.words = RE_WORD.findall(text)
	
	def __getitem__(self, index):
		return self.words[index]
	
	def __len__(self):
		return len(self.words)
	
	def __repr__(self):
		return 'Sentence(%s)' % reprlib.repr(self.text)
```

Whenever the interpreter needs to iterate over an object `x`, it automatically calls `iter(x)`. It runs like:

1. Call `x.__iter__()` to obtain an iterator.
1. If `__iter__()` is not implemented in `x`, Python tries to create an iterator that attempts to fetch items in order, using `x.__getitem__()`
1. If that fails too, Python raises `TypeError`, usually saying “`X` object is not iterable”.

所以即使 python sequence 类没有实现 `__iter__`，它们自带的 `__getitem__` 也能保证它们是 iterable 的。

另外，`collections.abc.Iterable` 在它的 `__subclasshook__` 中认定：所有实现了 `__iter__` 的类都是 `collections.abc.Iterable` 的子类

### 14.2 Iterables Versus Iterators

Any object from which the `iter()` built-in function can obtain an **iterator** is an **iterable**. 

The standard interface for an iterator has two methods:

- `__next__`
	- Returns the next available item, raising `StopIteration` when there are no more items.
- `__iter__`
	- Returns `self`; this allows iterators to be used where an iterable is expected, for example, in a for loop.
	- 根据 iterable 的定义，iterator 本身也是 iterable

```python
for i in seq:
	do_something(i)

# ----- Is Equivalent To ----- #

it = iter(seq)

while True:
	try:
		i = next(it)
		do_something(i)
	except StopIteration:
		del it
		break

# Once exhausted, an iterator becomes useless.
# To go over the seq again, a new iterator must be built.
```

### 14.3 `Sentence` Take #2: A Classic Iterator

```python
import re
import reprlib

RE_WORD = re.compile('\w+')

class Sentence:
	def __init__(self, text):
		self.text = text
		self.words = RE_WORD.findall(text)

	def __repr__(self):
		return 'Sentence(%s)' % reprlib.repr(self.text)

	def __iter__(self):
		return SentenceIterator(self.words)

class SentenceIterator:
	def __init__(self, words):
		self.words = words
		self.index = 0
	
	def __next__(self):
		try:
			word = self.words[self.index]
		except IndexError:
			raise StopIteration()
		self.index += 1
		return word
	
	def __iter__(self):
		return self
```

### 14.4 `Sentence` Take #3: A Generator Function

```python
import re
import reprlib

RE_WORD = re.compile('\w+')

class Sentence:
	def __init__(self, text):
		self.text = text
		self.words = RE_WORD.findall(text)
	
	def __repr__(self):
		return 'Sentence(%s)' % reprlib.repr(self.text)
	
	def __iter__(self):
		for word in self.words:
			yield word
		# return  # Not necessary

# done!
```

Any Python function that has the `yield` keyword in its body is a **generator function**: a function which, when called, returns a generator object. In other words, a generator
function is a generator factory.

Suppose generator function `gen()` returns a generator object `g` by `g = gen()`. When we invoke `next(g)`, execution advances to the next `yield` in the `gen()` function body, and the `next(g)` call evaluates to the value yielded when the `gen()` is suspended. Finally, when `gen()` returns, `g` raises `StopIteration`, in accordance with the `Iterator` protocol.

### 14.5 `Sentence` Take #4: A Lazy Implementation

Nowadays, laziness is considered a good trait, at least in programming languages and APIs. A lazy implementation postpones producing values to the last possible moment. This saves memory and may avoid useless processing as well. (与 lazy evaluation 对应的是 eager evaluation)

```python
importimportre
reprlib

RE_WORD = re.compile('\w+')

class Sentence:
	def __init__(self, text):
		self.text = text
	
	def __repr__(self):
		return 'Sentence(%s)' % reprlib.repr(self.text)
	
	def __iter__(self):
		for match in RE_WORD.finditer(self.text):
			yield match.group()
```

**N.B.** Whenever you are using Python 3 and start wondering “Is there a lazy way of doing this?”, often the answer is “Yes.”

### 14.6 `Sentence` Take #5: A Generator Expression

A generator expression can be understood as a lazy version of a `listcomp`.

```python
import re
import reprlib

RE_WORD = re.compile('\w+')

class Sentence:
	def __init__(self, text):
		self.text = text
		
	def __repr__(self):
		return 'Sentence(%s)' % reprlib.repr(self.text)
		
	def __iter__(self):
		return (match.group() for match in RE_WORD.finditer(self.text))
```

Generator expressions are syntactic sugar: they can always be replaced by generator functions, but sometimes are more convenient. 

Syntax Tip: When a generator expression is passed as the single argument to a function or constructor, you don’t need to write its parentheses.

```python
>>> (i * 5 for i in range(1, 5))
<generator object <genexpr> at 0x7f54bf32cdb0>
>>> list(i * 5 for i in range(1, 5))
[5, 10, 15, 20]
>>> list((i * 5 for i in range(1, 5)))
[5, 10, 15, 20]
```

### 14.7 Generator Functions in the Standard Library

参 [Python Documentation: 10.1. itertools — Functions creating iterators for efficient looping](https://docs.python.org/3/library/itertools.html)

#### 14.7.1 Create Generators Yielding Filtered Data

- `itertools.compress(Iterable data, Iterable mask)`: 类似于 numpy 的 `data[mask]`，只是返回结果是一个 generator
	- E.g. `compress([1, 2, 3], [True, False, True])` returns a generator of `yield 1; yield 3`
- `itertools.dropwhile(Function condition, Iterable data)`：drop `x` in `data` while `condition(x) == True`; return a generator from the leftover in `data`
	- E.g. `dropwhile(lambda x: x <= 2, [1, 2, 3, 2, 1])` returns a generator of `yield 3; yield 2; yield 1`
- `itertools.takewhile(Function condition, Iterable data)`: yield `x` in `data` while `condition(x) == True`; stop yielding immediately once `condition(x) == False`
	- E.g. `takewhile(lambda x: x <= 2, [1, 2, 3, 2, 1])` returns a generator of `yield 1; yield 2`
- (built-in) `filter(Function condition, Iterable data)`: yield `x` in `data` if `condition(x) == True`
- `itertools.filterfalse(Function condition, Iterable data)`: yield `x` in `data` if `condition(x) == False`
- `itertools.islice(Iterable data[, start], stop[, step])`: return a generator from `data[start: stop: step]` 

```python
def compress(data, mask):
    # compress('ABCDEF', [1,0,1,0,1,1]) --> A C E F
    return (d for d, m in zip(data, m) if m)

def dropwhile(condition, iterable):
    # dropwhile(lambda x: x<5, [1,4,6,4,1]) --> 6 4 1
    iterable = iter(iterable)
    for x in iterable:
        if not condition(x):
            yield x
            break
    for x in iterable:
        yield x

def takewhile(condition, iterable):
    # takewhile(lambda x: x<5, [1,4,6,4,1]) --> 1 4
    for x in iterable:
        if condition(x):
            yield x
        else:
            break

def filterfalse(condition, iterable):
    # filterfalse(lambda x: x%2, range(10)) --> 0 2 4 6 8
	# 相当于 lambda x: x%2 == 1 == True
    if condition is None:
        condition = bool
    for x in iterable:
        if not condition(x):
            yield x
```

#### 14.7.2 Create Generators Yielding Mapped Data

- `itertools.accumulate(Iterable data, Function f = operator.add`: yield $x_1, \operatorname f(x_2, x_1), \operatorname f(x_3, \operatorname f(x_2, x_1)), \dots$ for $x_i$ in `data`
- (built-in) `enumerate(Iterable data, start=0)`: yield `(i+start, data[i])` for `i` in `range(0, len(data))`
- (built-in) `map(Function f, Iterable data_1, ..., Iterable data_n)`: yield `f(x_1, ..., x_n)` for `(x_1, ..., x_n)` in `zip(data_1, ..., data_n)`
- `itertools.starmap(Function f, Iterable data)`: yield `f(*i)` for `i` in `data`

```python
def accumulate(iterable, func=operator.add):
    'Return running totals'
    # accumulate([1,2,3,4,5]) --> 1 3 6 10 15
    # accumulate([1,2,3,4,5], operator.mul) --> 1 2 6 24 120
    it = iter(iterable)
    try:
        total = next(it)
    except StopIteration:
        return
    yield total
    for element in it:
        total = func(total, element)
        yield total

def starmap(function, iterable):
    # starmap(pow, [(2,5), (3,2), (10,3)]) --> 32 9 1000
    for args in iterable:
        yield function(*args)
```

#### 14.7.3 Create Generators Yielding Merged Data

- `itertools.chain(Iterable A, ..., Iterable Z)`: yield $a_1, \dots, a_{n_A}, b_1, \dots, y_{n_Y}, z_1, \dots, z_{n_Z}$
- `itertools.chain.from_iterable(Iterable data)`: `== itertools.chain(*data)`
- (built-in) `zip(Iterable A, ..., Iterable Z)`: 参 [Python: Zip](/python/2016/09/29/python-zip)
- `itertools.zip_longest(Iterable A, ..., Iterable Z, fillvalue=None)`: 你理解了 `zip` 的话看这个函数名自然就明白它的功能了

```python
def chain(*iterables):
    # chain('ABC', 'DEF') --> A B C D E F
    for it in iterables:
        for element in it:
            yield element

def from_iterable(iterables):
    # chain.from_iterable(['ABC', 'DEF']) --> A B C D E F
    for it in iterables:
        for element in it:
            yield element

class ZipExhausted(Exception):
    pass

def zip_longest(*args, **kwds):
    # zip_longest('ABCD', 'xy', fillvalue='-') --> Ax By C- D-
    fillvalue = kwds.get('fillvalue')
    counter = len(args) - 1
    def sentinel():
        nonlocal counter
        if not counter:
            raise ZipExhausted
        counter -= 1
        yield fillvalue
    fillers = repeat(fillvalue)
    iterators = [chain(it, sentinel(), fillers) for it in args]
    try:
        while iterators:
            yield tuple(map(next, iterators))
    except ZipExhausted:
        pass
```

### 14.7.4 Create Generators Yielding Repetition

- `itertools.count(start=0, step=1)`: yield $\text{start}, \text{start}+\text{step}, \text{start}+2 \cdot \text{step}, \dots$ endlessly
- `itertools.repeat(object x[, ntimes])`: yield `x` endlessly or `ntimes` times
- `itertools.cycle(Iterable data)`: yield $x_1, \dots, x_n, x_1, \dots, x_n, x_1, \dots$ repeatedly and endlessly for $x_i$ in `data`

```python
def count(start=0, step=1):
    # count(10) --> 10 11 12 13 14 ...
    # count(2.5, 0.5) -> 2.5 3.0 3.5 ...
    n = start
    while True:
        yield n
        n += step

def repeat(object, times=None):
    # repeat(10, 3) --> 10 10 10
    if times is None:
        while True:
            yield object
    else:
        for i in range(times):
            yield object

def cycle(iterable):
    # cycle('ABCD') --> A B C D A B C D A B C D ...
    saved = []
    for element in iterable:
        yield element
        saved.append(element)
    while saved:
        for element in saved:
              yield element
```

### 14.7.5 Create Generators Yielding Combinations and Permutations

- `itertools.product(Iterable A, ..., Iterable Z, repeat=1)`: yield all $(a_i, b_j, \dots, z_k)$ where $a_i \in A, b_j \in B, \dots, z_k \in Z$
	- 一共会 yield $(\vert A \vert \cdot \vert B \vert \cdot \ldots \cdot \vert Z \vert)^{\text{repeat}}$ 个 tuple
	- `repeat=2` 的效果是 yield all $(a_{i_1}, b_{j_1}, \dots, z_{k_1}, a_{i_2}, b_{j_2}, \dots, z_{k_2})$，依此类推
	- 还有一种用法是 `product(A, repeat=2)`，等价于 `product(A, A)`
- `itertools.combinations(Iterable X, k)`: yield all $(x_{i_1}, x_{i_2}, \dots, x_{i_k})$ where $x_{i_j} \in X$ and $i_1 < i_2 < \dots < i_k$
- `itertools.combinations_with_replacement(Iterable X, k)`: yield all $(x_{i_1}, x_{i_2}, \dots, x_{i_k})$ where $x_{i_j} \in X$ and $i_1 \leq i_2 \leq \dots \leq i_k$
- `itertools.permutations(Iterable X, k)`: yield all $(x_{i_1}, x_{i_2}, \dots, x_{i_k})$ where $x_{i_j} \in X$ and $i_1 \neq i_2 \neq \dots \neq i_k$

```python
>>> import itertools
>>> list(itertools.combinations([1,2,3], 2))
[(1, 2), (1, 3), (2, 3)]
>>> list(itertools.combinations_with_replacement([1,2,3], 2))
[(1, 1), (1, 2), (1, 3), (2, 2), (2, 3), (3, 3)]
>>> list(itertools.permutations([1,2,3], 2))
[(1, 2), (1, 3), (2, 1), (2, 3), (3, 1), (3, 2)]
>>> list(itertools.product([1,2,3], repeat=2))
[(1, 1), (1, 2), (1, 3), (2, 1), (2, 2), (2, 3), (3, 1), (3, 2), (3, 3)]
```

假设 `len(list(X)) = n`，那么:

- `combinations` 一共会 yield $\operatorname{C}_{n}^{k} = {n \choose k} = \frac{n!}{(n-k)!k!}$ 个 tuple
- `combinations_with_replacement` 一共会 yield $\operatorname{C}_{n+k-1}^{k} = {n+k-1 \choose k} = \frac{(n+k-1)!}{(n-1)!k!}$ 个 tuple
- `permutations` 一共会 yield $\operatorname{A}_{n}^{k} = \frac{n!}{(n-k)!}$ 个 tuple
- 你可能会问 "为啥没有 permutation with replacement 操作？" which yields $n^k$ tuples
	- 因为可以用 `product(X, repeat=k)` 实现

```python
def product(*args, repeat=1):
    # product('ABCD', 'xy') --> Ax Ay Bx By Cx Cy Dx Dy
    # product(range(2), repeat=3) --> 000 001 010 011 100 101 110 111

	# E.g. product('ABCD', 'xy')
	# pools = [('A', 'B', 'C', 'D'), ('x', 'y')]
    pools = [tuple(pool) for pool in args] * repeat
    result = [[]]
    for pool in pools:
		# When pool = ('A', 'B', 'C', 'D')
		# 	result = [['A'], ['B'], ['C'], ['D']]
		# Then pool = ('x', 'y')
		# 	result = [['A', 'x'], ['A', 'y'], ['B', 'x'], ['B', 'y'], ['C', 'x'], ['C', 'y'], ['D', 'x'], ['D', 'y']]
		# `x+[y]` 里 x 是 list of list 的元素； y 被包装成了 list。这里利用了 list extension 来实现了一个类似集合 ∪ 的效果 
        result = [x+[y] for x in result for y in pool]
    for prod in result:
        yield tuple(prod)

def combinations(iterable, r):
    # combinations('ABCD', 2) --> AB AC AD BC BD CD
    # combinations(range(4), 3) --> 012 013 023 123

	# E.g. combinations('ABCD', 2)
	# pool = [('A', 'B', 'C', 'D')]
    pool = tuple(iterable)
    n = len(pool)  # == 4
    if r > n:
        return
    indices = list(range(r))  # == [0, 1]
    yield tuple(pool[i] for i in indices)  # yield pool(0,1)

	while True:
        for i in reversed(range(r)):  # for i in [1, 0]
			# 1st round: i == 1; indices[1] == 1 != 1 + 4 - 2; break
			# 2nd round: i == 1; indices[1] == 2 != 1 + 4 - 2; break
			# 3rd round: i == 1; indices[1] == 3 == 1 + 4 - 2; continue
			# 3rd round: i == 0; indices[0] == 0 != 0 + 4 - 2; break
			# 4th round: i == 1; indices[1] == 2 != 1 + 4 - 2; break
			# 5th round: i == 1; indices[1] == 3 == 1 + 4 - 2; continue
			# 5th round: i == 0; indices[0] == 1 != 0 + 4 - 2; break
			# 6th round: i == 1; indices[1] == 3 == 1 + 4 - 2; continue
			# 6th round: i == 0; indices[0] == 2 == 1 + 4 - 2; continue
            if indices[i] != i + n - r:
                break
		# for-else 你可以理解成 for 执行完接了一个 finally
		# 	然而 java 并没有 for-finally，只有 try-finally (不要 catch)
		# 6th round ended
        else:
            return

		# 1st round: i == 1; indices[1] == 2
		# 2nd round: i == 1; indices[1] == 3
		# 3rd round: i == 0; indices[0] == 1
		# 4th round: i == 1; indices[1] == 3
		# 5th round: i == 0; indices[0] == 2
        indices[i] += 1
		# 1st round: i == 1; for j in []
		# 2nd round: i == 1; for j in []
		# 3rd round: i == 0; for j in [1]
		# 			 indices[1] = indices[0] + 1 == 2
		# 4th round: i == 1; for j in []
		# 5th round: i == 0; for j in [1]
		# 			 indices[1] = indices[0] + 1 == 3
        for j in range(i+1, r):
            indices[j] = indices[j-1] + 1
		# 1st round: i == 1; yield pool(0,2)
		# 2nd round: i == 1; yield pool(0,3)
		# 3rd round: i == 0; yield pool(1,2)
		# 4th round: i == 1; yield pool(1,3)
		# 5th round: i == 0; yield pool(2,3)
        yield tuple(pool[i] for i in indices)

def combinations_with_replacement(iterable, r):
    # combinations_with_replacement('ABC', 2) --> AA AB AC BB BC CC
    pool = tuple(iterable)
    n = len(pool)
    if not n and r:
        return
    indices = [0] * r
    yield tuple(pool[i] for i in indices)
    while True:
        for i in reversed(range(r)):
            if indices[i] != n - 1:
                break
        else:
            return
        indices[i:] = [indices[i] + 1] * (r - i)
        yield tuple(pool[i] for i in indices)

def permutations(iterable, r=None):
    # permutations('ABCD', 2) --> AB AC AD BA BC BD CA CB CD DA DB DC
    # permutations(range(3)) --> 012 021 102 120 201 210
    pool = tuple(iterable)
    n = len(pool)
    r = n if r is None else r
    if r > n:
        return
    indices = list(range(n))
    cycles = list(range(n, n-r, -1))
    yield tuple(pool[i] for i in indices[:r])
    while n:
        for i in reversed(range(r)):
            cycles[i] -= 1
            if cycles[i] == 0:
                indices[i:] = indices[i+1:] + indices[i:i+1]
                cycles[i] = n - i
            else:
                j = cycles[i]
                indices[i], indices[-j] = indices[-j], indices[i]
                yield tuple(pool[i] for i in indices[:r])
                break
        else:
            return
```

如果允许用现有的函数，也可以这样实现：

```python
def combinations(iterable, r):
    pool = tuple(iterable)
    n = len(pool)
    for indices in permutations(range(n), r):
        if sorted(indices) == list(indices):
            yield tuple(pool[i] for i in indices)

def combinations_with_replacement(iterable, r):
    pool = tuple(iterable)
    n = len(pool)
    for indices in product(range(n), repeat=r):
        if sorted(indices) == list(indices):
            yield tuple(pool[i] for i in indices)

def permutations(iterable, r=None):
    pool = tuple(iterable)
    n = len(pool)
    r = n if r is None else r
    for indices in product(range(n), repeat=r):
        if len(set(indices)) == r:
            yield tuple(pool[i] for i in indices)
```

#### 14.7.6 Create Generators Yielding Rearranged Data

- `itertools.groupby(Iterable X, key=None)`
	- If `key` is `None`, set `key = lambda x: x` (identity function)
	- If $\operatorname{key}(x_i) = \operatorname{key}(x_j) = \dots = \operatorname{key}(x_k) = \kappa$, put $x_i, x_j, \dots, x_k$ into a `itertools._grouper` object $\psi$ (which itself is also a generator). Then yield a tuple $(\kappa, \psi(x_i, x_j, \dots, x_k))$
	- Yield all such tuples
- (built-in) `reversed(seq)`: Return a reverse iterator. 
	- `seq` must be an object which has a `__reversed__()` method
		- OR
	- supports the sequence protocol (the `__len__()` method and the `__getitem__()` method with integer arguments starting at 0).
- `itertools.tee(Iterable X, n=2)`: return a tuple of `n` independent `iter(X)`
	- E.g. when `n=3`, return a tuple `(iter(X), iter(X), iter(X))` 

```python
class groupby:
    # [k for k, g in groupby('AAAABBBCCDAABBB')] --> A B C D A B
    # [list(g) for k, g in groupby('AAAABBBCCD')] --> AAAA BBB CC D
    def __init__(self, iterable, key=None):
        if key is None:
            key = lambda x: x
        self.keyfunc = key
        self.it = iter(iterable)
        self.tgtkey = self.currkey = self.currvalue = object()
    
    def __iter__(self):
        return self
    
    def __next__(self):
        while self.currkey == self.tgtkey:
            self.currvalue = next(self.it)    # Exit on StopIteration
            self.currkey = self.keyfunc(self.currvalue)
        self.tgtkey = self.currkey
        return (self.currkey, self._grouper(self.tgtkey))
    
    def _grouper(self, tgtkey):
        while self.currkey == tgtkey:
            yield self.currvalue
            try:
                self.currvalue = next(self.it)
            except StopIteration:
                return
            self.currkey = self.keyfunc(self.currvalue)

def tee(iterable, n=2):
    it = iter(iterable)
    deques = [collections.deque() for i in range(n)]
    
    def gen(mydeque):
        while True:
            if not mydeque:             # when the local deque is empty
                try:
                    newval = next(it)   # fetch a new value and
                except StopIteration:
                    return
                for d in deques:        # load it to all the deques
                    d.append(newval)
            yield mydeque.popleft()

    return tuple(gen(d) for d in deques)
```

注意这个 `tee` 的实现：它并不是简单地返回 `(iter(X), iter(X), ...)`

- 首先要牢记的是，你在接收 `tee` 返回值的时候，**`gen` 是没有执行的**！因为 iteration 还没有开始。当 iteration 开始的时候，`gen` 才开始执行
	- 比如 `a, b, c = tee([1,2,3], 3)` 时，`gen` 没有执行，只是挂到这三个变量上了而已
	- 如果你来一句 `list(a)`，那么 iteration 就开始了，`gen` 也就开始执行了
- `a, b, c = tee([1,2,3], 3)` 时：
	- `a -> deque([])`
	- `b -> deque([])`
	- `c -> deque([])`
- 第一次 `next(a)` 时：
	- `a -> deque([1])`， 然后 yield `1`，最终 `a -> deque([])`
	- `b -> deque([1])`
	- `c -> deque([1])`
- 第二次 `next(a)` 时：
	- `a -> deque([2])`， 然后 yield `2`，最终 `a -> deque([])`
	- `b -> deque([1, 2])`
	- `c -> deque([1, 2])`
- 如果此时 `next(b)`:
	- `a -> deque([3])`
	- `b -> deque([1, 2, 3])`，然后 yield `1`，最终 `b -> deque([2, 3])` 
	- `c -> deque([1, 2, 3])`
- 可见每次某个 deque yield 一个新值，它就给其他所有的 deque 都 append 这么一个新值 

### 14.8 New Syntax in Python 3.3: `yield from`

这里只介绍了最简单最直接的用法：`yield from iterable` 等价于 `for i in iterable: yield i`。所以 `chain` 的实现可以简写一下：

```python
def chain(*iterables):
	for it in iterables:
		for i in it:
			yield i

def chain(*iterables):
	for it in iterables:
		yield from it
```

Besides replacing a loop, `yield from` creates a channel connecting the inner generator directly to the client of the outer generator. This channel becomes really important when generators are used as coroutines and not only produce but also consume values from the client code. 我们 16 章再深入讨论。

### 14.9 Iterable Reducing Functions

- `all(Iterable X)`: 注意 `all([])` 是 `True`
- `any(Iterable X)`: 注意 `any([])` 是 `False`
- `max(Iterable X[, key=,][default=])`: return $x_i$ which maximizes $\operatorname{key}(x_i)$; if `X` is empty, return `default`
	- May also be invoked as `max(x1, x2, ...[, key=?])`
- `min(Iterable X[, key=,][default=])`: return $x_i$ which minimizes $\operatorname{key}(x_i)$; if `X` is empty, return `default`
	- May also be invoked as `min(x1, x2, ...[, key=?])`
- `sum(Iterable X, start=0)`: returns `sum(X) + start`
	- Use `math.fsum()` for better precision when adding floats
- `functools.reduce(Function f, Iterable X[, initial]`
	- If `initial` is not given:
		- $r_1 = \operatorname{f}(x_1, x_2)$
		- $r_2 = \operatorname{f}(r_1, x_3)$
		- $r_3 = \operatorname{f}(r_2, x_4)$
		- 依此类推
		- return $r_{n-1}$ if $\vert X \vert = n$
	- If `initial = a` is given:
		- $r_1 = \operatorname{f}(a, x_1)$
		- $r_2 = \operatorname{f}(r_1, x_2)$
		- $r_3 = \operatorname{f}(r_2, x_3)$
		- 依此类推
		- return $r_{n}$ if $\vert X \vert = n$ 

### 14.10 A Closer Look at the `iter` Function

As we’ve seen, Python calls `iter(x)` when it needs to iterate over an object `x`.

But `iter` has another trick: it can be called with two arguments to create an iterator from a regular function or any callable object. In this usage, the first argument must be a callable to be invoked repeatedly (with no arguments) to yield values, and the second argument is a sentinel: a marker value which, when returned by the callable, causes the iterator to raise `StopIteration` instead of yielding the sentinel. 

The following example shows how to use iter to roll a six-sided die until a 1 is rolled:

```python
>>> def d6():
... 	return randint(1, 6)
...
>>> d6_iter = iter(d6, 1)
>>> d6_iter
<callable_iterator object at 0x00000000029BE6A0>
>>> for roll in d6_iter:
... 	print(roll)
...
4
3
6
3
```

Another useful example to read lines from a file until a blank line is found or the end of file is reached:

```python
with open('mydata.txt') as fp:
	for line in iter(fp.readline, ''):
		process_line(line)
```

### 14.11 Generators as Coroutines

[PEP 342 -- Coroutines via Enhanced Generators](https://www.python.org/dev/peps/pep-0342/) was implemented in Python 2.5. This proposal added extra methods and functionality to generator objects, most notably the `.send()` method.

Like `gtr.__next__()`, `gtr.send()` causes the generator to advance to the next `yield`, but it also allows the client using the generator to send data into it: whatever argument is passed to `.send()` becomes the value of the corresponding `yield` expression inside the generator function body. In other words, `.send()` allows two-way data exchange between the client code and the generator--in contrast with `.__next__()`, which only lets the client receive data from the generator.

看例子

```python
>>> def double_input():
...     while True:
...         x = yield
...         yield x * 2
... 
>>> gen = double_input()
>>> next(gen)
>>> gen.send(10)
20
>>> next(gen)
>>> next(gen)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "<stdin>", line 4, in double_input
TypeError: unsupported operand type(s) for *: 'NoneType' and 'int'
```

```python
>>> def add_inputs():
...     while True:
...         x = yield
...         y = yield
...         yield x + y
... 
>>> gen = add_inputs()
>>> next(gen)
>>> gen.send(10)
>>> gen.send(20)
30
>>> gen = add_inputs()
>>> next(gen)
>>> gen.send(10)
>>> next(gen)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "<stdin>", line 5, in add_inputs
TypeError: unsupported operand type(s) for +: 'int' and 'NoneType'
```

以 `add_input` 为例：

- `next(gen)`，驱动到第一个 `yield`，即执行到 `x = yield`，停住
- `gen.send(10)`，相当于执行了 `x = 10`，然后驱动到下一个 `yield`，即 `y = yield`，停住
- `gen.send(20)`，相当于执行了 `y = 20`，然后驱动到下一个 `yield`，即 `yield x + y`，输出

所以大致的 pattern 是：

- `.__next__()` 和 `.send()` 都会驱动到一下个 `yield`，不管是 left-hand `yield` 还是 right-hand `yield`
- `.send(foo)` 替换当前的 right-hand `yield` 为 `foo`（然后驱动到下一个 yield）
- 驱动到 right-hand `yield` 时直接输出
- 你一个循环里有 $N$ 个 `yield`，就要驱动 $N$ 次，i.e. $N_{\text{next}} + N_{\text{send}} = N_{\text{yield}}$

This is such a major “enhancement” that it actually changes the nature of generators: when used in this way, they become **coroutines**. David Beazley--probably the most prolific writer and speaker about coroutines in the Python community--warned in a famous PyCon US 2009 tutorial:

> - Generators produce data for iteration
> - Coroutines are consumers of data
> - To keep your brain from exploding, you don’t mix the two concepts together
> - Coroutines are not related to iteration
> - Note: There is a use of having yield produce a value in a coroutine, but it’s not tied to iteration.
> <br/>
> <p align="right">-- David Beazley</p>
> <p align="right">“A Curious Course on Coroutines and Concurrency”</p>

### Soapbox

#### Semantics of Generator Versus Iterator

A generator is an iterator; an iterator is not necessarily a generator. 

Proof by code:

```python
>>> from collections import abc
>>> e = enumerate('ABC')
>>> isinstance(e, abc.Iterator)
True
```

```python
>>> import types
>>> e = enumerate('ABC')
>>> isinstance(e, types.GeneratorType)
False
```

### Chapter 15 - Context Managers and else Blocks
