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

一个 array 可以有多种表示，比如二进制、八进制。`memoryview` 就是用来显示这些不同的表示的。如果修改 `memoryview` 自然会修改到底层的 array 的值。这进一步说明：sequence

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

## 7. Function Decorators and Closures

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

