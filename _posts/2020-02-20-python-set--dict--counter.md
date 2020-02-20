---
layout: post
title: "Python: set / dict / Counter"
description: ""
category: Python
tags: []
---
{% include JB/setup %}

<!-- TOC -->

Table of Contents:

- [1. `set` Operations](#1-set-operations)
    - [1.1 测试集合间的关系](#11-测试集合间的关系)
    - [1.2 多个集合做运算](#12-多个集合做运算)
    - [1.3 用其他的集合更新自己](#13-用其他的集合更新自己)
    - [1.4 操作自己的元素](#14-操作自己的元素)
- [2. `dict` Operations](#2-dict-operations)
    - [2.1 primitive 操作](#21-primitive-操作)
    - [2.2 获取 key/value 集合的操作](#22-获取-keyvalue-集合的操作)
    - [2.3 默认值的操作](#23-默认值的操作)
    - [2.4 其余](#24-其余)
- [3. `collections.Counter` Operations](#3-collectionscounter-operations)
    - [3.1 初始化](#31-初始化)
    - [3.2 与 `dict` 不同的实现](#32-与-dict-不同的实现)
    - [3.3 `dict` 没有的新接口](#33-dict-没有的新接口)
    - [3.4 Mathematical Operators (binary)](#34-mathematical-operators-binary)
    - [3.5 Mathematical Operators (unary)](#35-mathematical-operators-unary)

<!-- /TOC -->

## 1. `set` Operations

### 1.1 测试集合间的关系

- `s.issubset(other)`
    - 等价于 `s <= other`
        - `s < other`：等价于 `s <= other and s != other`
- `s.issuperset(other)`
    - 等价于 `s >= other`
        - `s > other`：等价于 `s >= other and s != other`
- `s.isdisjoint(other)`: return True if 交集为空

### 1.2 多个集合做运算

- `s.intersection(*others)`
    - 等价于 `s & other & ...`
- `s.union(*others)`
    - 等价于 `s | other | ...`
- `s.difference(*others)`
    - 等价于 `s - other - ...`
- `s.symmetric_difference(other)`
    - 等价于 `s ^ other`
    
### 1.3 用其他的集合更新自己

- `s.update(*others)`
    - 等价于 `s |= other | ...`
- `s.intersection_update(*others)`
    - 等价于 `s &= other & ...`
- `s.difference_update(*others)`
    - 等价于 `s -= other | ...`
- `s.symmetric_difference_update(other)`
    - 等价于 `s ^= other`
    
### 1.4 操作自己的元素

- `s.add(e)`
- `s.remove(e)`: raises `KeyError` if `e` not absent
- `s.discard(e)`: remove if absent; raise NO error even if `e` not absent
- `e = s.pop()`: remove and return an arbitary element; `KeyError` empty set
- `s.clear()`: remove all elements

## 2. `dict` Operations

### 2.1 primitive 操作

- `del d[key]`：删除 key
- `iter(d)`: 其实等价于 `iter(d.keys())`，并不会 access 到 `d.values()`

### 2.2 获取 key/value 集合的操作

- `d.keys()`
- `d.values()`
- `d.items()`: 返回 `(key, value)` 的集合
- 注意这三个方法返回的对象是 "view object"

> ... view objects. They provide a dynamic view on the dictionary’s entries, which means that when the dictionary changes, the view reflects these changes.

### 2.3 默认值的操作

- `d.get(key, [default])`
    - If `default` is not given, it defaults to `None`
- `d.setdefault(key, [default])`
    - 这个函数的逻辑有点怪。按理来说，setter 不需要返回值，但它实际会返回
        - 如果有 `d[key]`，就直接返回 `d[key]`
        - 如果没有，把 `d[key]` 初始化成 `default`，然后返回 `d[key]`
    - 我觉得它的命名肯定是有问题的，还不如在 `d.get()` 里加一个参数 `set=True/False` 表示是否要 insert `<key, default>` 到 dict if `key` absent
- `d.pop(key, [default])`
    - 如果有 `d[key]`，把它 pop 并返回出来
    - 如果没有，返回 `default`
        - 如果没有指定 `default`，抛 `KeyError`

```python
def d.get(key, default):
    return d[key] if key in d else default

def d.setdefault(key, default):
    if key not in d:
        d[key] = default
    return d[key]
    
def d.pop(key, default):
    if key in d:
        ret = d[key]
        del d[key]
        return ret
    else:
        if default is given:
            return default
        else:
            raise KeyError()
```

`setdefault()` 最佳的使用场景是给 dict 中 (我以为不存在的) `key` 做初始化，比如下面这个不怎么优雅的写法：

```python
# NOT COOL; anti-pattern
dictionary = {}

if "list" not in dictionary:
    dictionary["list"] = []

dictionary["list"].append("list_item")
```

就可以改写成：

```python
# ELEGANT!
dictionary = {}

dictionary.setdefault("list", []).append("list_item")
```

### 2.4 其余

- `d.update(other)`：更新一对或多对 `<key, value>`。这个 other 的形式可以有多种：
    - `other` 可以是一个 dict
    - `other` 可以是 iterable of `<key, value>` pairs (as tuples or other iterables of length two)
    - `other` 也可以是 keyword augments，比如 `d.update(red=1, blue=2)`
- `d.popitem()`: remove and return an arbitrary `(key, value)` pair

## 3. `collections.Counter` Operations

`Counter` 是 `dict` 的 subclass! 所以你把它想成是一个 `<key, count>` 的 dict 就可以了

### 3.1 初始化

```python
c = Counter()                           # a new, empty counter
c = Counter('gallahad')                 # a new counter from an iterable
c = Counter({'red': 4, 'blue': 2})      # a new counter from a mapping
c = Counter(cats=4, dogs=8)             # a new counter from keyword args
```

### 3.2 与 `dict` 不同的实现

- `c.update([iterable-or-mapping])`
    - 如果是 iterable，会 count 元素的个数，然后加入到 counter 中
    - 如果是 mapping，会直接合并 `<key, count>`

```python
from collections import Counter

c = Counter('aaabbb')  # Counter({'a': 3, 'b': 3})

# update with iterable
c.update("bbb")  # Counter({'a': 3, 'b': 6})

# update with mapping
c.update(Counter("aaa"))  # Counter({'a': 6, 'b': 6})
c.update(c=3)  # Counter({'a': 6, 'b': 6, 'c': 3})
c.update(dict(d=3))  # Counter({'a': 6, 'b': 6, 'd': 3, 'c': 3})
```

### 3.3 `dict` 没有的新接口

- `c.elements()`: 对每一对 `<key, count>`，把 `key` repeat `count` 次；把最终结果归到一个 generator 里
    - 注意 `itertools.repeat()` 不能处理 negative 的次数，所以 `count` 为负的 `key` 会被忽略
- `c.most_common([n])`：其实是用了一个 max heap 去做了 `<count, key>` 的 `nlargest()`。注意返回的类型是一个 `[(key, count)]`
    - 如果不指定 `n` 的话，返回按 `count` 排序的所有的 `<key, count>`
    - `c.most_common(3)` 和 `c.most_common()[:3]` 从效果上说是一样的
    - `c.most_common()[:-n-1:-1]` 获取 `n` least common elements
- `c.substract([iterable-or-mapping])`：与 `c.update([iterable-or-mapping])` 的逻辑相似，但是是减去 count
    - 结果中的 count 可以为负，这一点与 `c.__sub__(other)` 的逻辑不同，which 会忽略掉 `<= 0` 的 count

```python
# 源代码
def c.elements():
    return _chain.from_iterable(_starmap(_repeat, c.iteritems()))

# 写简单一点
from itertools import repeat, chain

def c.elements():
    element_list = [repeat(key, count) for key, count in c.items()]
    return chain.from_iterable(element_list)

c = Counter('aaabbb')
print(list(c.elements()))
# Output: ['a', 'a', 'a', 'b', 'b', 'b']
```

```python
def c.most_common(n=None):  
    if n is None:
        return sorted(c.iteritems(), key=_itemgetter(1), reverse=True)
    return _heapq.nlargest(n, c.iteritems(), key=_itemgetter(1))

c = Counter('aaabbb')
print(list(c.most_common()))
# Output: [('a', 3), ('b', 3)]
```

### 3.4 Mathematical Operators (binary)

- 注意这四个操作都是返回一个新的 `Counter`，不会复用参与运算的对象
- 这四个操作最后都会忽略掉 (经过计算后得到的) `count <= 0` 的 `<key, count>`，具体说来就是这样的 entry 不会被添加到 return 的这个新 `Counter` 里
- `c.__add__(other)`
    - `key` 做 union
    - `count` 相加
    - 如果 `key` 只在一个 operand 中出现，会得到一个 `<key, 0 + count>` 或者 `<key, count + 0>` 的 entry (如果 `0 + count <= 0` 或者 `count + 0 <= 0`，会被忽略)
- `c.__sub__(other)`：
    - `key` 做 union
    - `count` 相减
    - 如果 `key` 只在一个 operand 中出现，会得到一个 `<key, 0 - count>` 或者 `<key, count - 0>` 的 entry (同上，会被审查是否 `<= 0`)
- `c.__and__(other)`：
    - `key` 做 intersect
    - `count` 取 min
- `c.__or__(other)`
    - `key` 做 union
    - `count` 取 max
    - 如果 `key` 只在一个 operand 中出现，会得到一个 `<key, max(0, count)>` 或者 `<key, max(count, 0)>` 的 entry (同上，会被审查是否 `<= 0`)

```python
c = Counter(a=3, b=1)
d = Counter(a=1, b=2)

c + d == Counter({'a': 4, 'b': 3})
c - d == Counter({'a': 2})
c & d == Counter({'a': 1, 'b': 1})
c | d == Counter({'a': 3, 'b': 2})
```

### 3.5 Mathematical Operators (unary)

- 这两个操作符我是第一次见。所以 `+c` 是调用了 `c.__pos__()`，`-c` 是调用了 `c.__neg__()`
- `c.__pos__()`：可以理解成有一个 `count` 全为 0 的 Counter `z`，然后做了 `z + c`
- `c.__neg__()`：可以理解成有一个 `count` 全为 0 的 Counter `z`，然后做了 `z - c`

```python
def __pos__(self):
    'Adds an empty counter, effectively stripping negative and zero counts'
    result = Counter()
    for elem, count in self.items():
        if count > 0:
            result[elem] = count
    return result

def __neg__(self):
    '''Subtracts from an empty counter.  Strips positive and zero counts,
    and flips the sign on negative counts.
    '''
    result = Counter()
    for elem, count in self.items():
        if count < 0:
            result[elem] = 0 - count
    return result
```

```python
c = Counter(a=2, b=-4)
+c == Counter({'a': 2})
-c == Counter({'b': 4})

z = Counter()
z + c == Counter({'a': 2})
z - c == Counter({'b': 4})
```

我觉得 `Counter` 的实现是有点撕裂的。按常理来说肯定要 `count > 0` 才是有意义的，但它又允许 `count <= 0` 的 entry 存在，所以在实现接口的时候添加了很多 implicit 的操作