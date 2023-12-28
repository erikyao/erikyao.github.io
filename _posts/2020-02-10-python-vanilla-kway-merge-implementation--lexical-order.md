---
category: Python
description: ''
tags: []
title: 'Python: Vanilla $k$-way Merge Implementation & Lexical Order'
---

## $k$-way Merge ($k$ 路归并)

假设你有 $k$ 个 data source，然后它们自身是 sorted 的，$k$-way merging 就是把这个 $k$ 个 source 合并成一个 overall sorted 的序列。

在 python 中这个 source 可以是 iterable (or generator)，我们用 heap 来做 $k$ 路归并的思路就是：

- 将这 $k$ 个 iterable 直接组成 heap，最开始的大小关系由 iterable 的第一个元素决定
- 与其 `heappop` 掉 root，我们不如先 `yield` root 的 iterable 的当前值，然后在 root 原地 `next(iterable)` 取新值，再做 percolate down
- 如果 root 的 iterable 枯竭了，我们才直接 `heappop` 掉 root
- 知道所有的 iterable 枯竭，heap 为空，merge 完毕

如果是 C/C++，source 可以是 array，然后我们可以用指针来做：

- 将 $k$ 个指针 `p` 组成 heap，按 `*p` 的大小排序
- `yield` 掉 root 的 `*p`，然后 root 的 `p++`，再 percolate down
- 应该需要一个标志位 mark iterable 的尾部，比如 `*p == -1` 时表示 iterable 枯竭

但 `heapq` 没有 explicit 的 percolate down 接口，所以上面说的 "root iterable 原地 `yield` 再 `next` 再 percolate down" 的方案在 `heapq` 下不可行，可以改成 "`yield` 然后 `heappop` 掉 root 然后 `heappush(next(root))`"

## `heapq.merge()`

python 的 `heapq` 自带了一个 $k$-way Merge 的实现：

```python
from heapq import merge

# API: merge(*iterables, key=None, reverse=False)

merged = merge([1, 2, 3, 4, 50], [6, 70, 80, 90, 100])
print(list(merged))

# Output:
# [1, 2, 3, 4, 6, 50, 70, 80, 90, 100]
```

参数 `key` 是一个 key function:

- 它可以是一个 field accessor，比如 `key = lambda obj: obj.attribute`
    - 然后元素就按它们的这个字段的大小来排序
- 也可以有其他的用法，比如 `key = abs` 表示按绝对值大小排序
- 总之，它的意思就是：在比较元素大小时，使用 `key(e)` 的值来比较
- 如果 `key is None`，说明是直接比较元素本身

具体实现可以看 [Lib/heapq.py](https://hg.python.org/cpython/file/default/Lib/heapq.py#l314)

`sorted(itertools.chain(*iterables))` 是一个更 general 的归并算法，不要求各个 iterable 本身是 ordered 的。假定 $n$ 表示所有 iterable 所包含的总 element 数量，那么这个解法有：

- space complexity: $O(n)$
- time complexity: $O(n \log n)$

$k$ 路归并利用了 "各个 iterable 本身是 ordered 的" 这个优势：

- space complexity: $O(k)$
- time complexity: $O(n \log k)$

如果 $k \ll n$，那么 $k$ 路归并优势明显

另外要注意：

- `sorted()` 一定返回 list
- 而 `heapq.merge()` 返回的仍然是一个 iterable

## Vanilla Implementation

我们用 `heapq` 的其他接口写一个 `merge` 的简化版本：

```python
import heapq

def merge_sorted_arrays(arrays):
    array_iters = [iter(a) for a in arrays]
    
    heap = []
    for iter_index, _iter in enumerate(array_iters):
        first_element = next(_iter, None)
        if first_element:
            heapq.heappush(heap, (first_element, iter_index))
            
    while heap:
        min_element, iter_index = heapq.heappop(heap)
        yield min_element
        
        next_element = next(array_iters[iter_index], None)
        if next_element:
            heapq.heappush(heap, (next_element, iter_index))

merged = merge_sorted_arrays([[1, 2, 3, 4, 50], [6, 70, 80, 90, 100]])
print(list(merged))

# Output:
# [1, 2, 3, 4, 6, 50, 70, 80, 90, 100]
```

## Why Using Tuples?

在研究这个实现之前，我的想法是用 heap 存 `<value, iterator>` 这个 combo，那为了使它 comparable，我可能会设计一个类似 java 的 `implements Comparable` 的逻辑：

```python
import operator

class CachedIterator:
    def __init__(self, _value, _iter): 
        self._value = _value
        self._iter = _iter
        
    def __lt__(self, obj): 
        return operator.lt(self._value, obj._value)
```

然后让 heap 来存这个 `CachedIterator` 对象。

但是这个参考实现用的是 `(value, iterator_index)` 这个 tuple。根据 [heapq with custom compare predicate](https://stackoverflow.com/a/8875823):

> According to the [heapq documentation](https://docs.python.org/3/library/heapq.html), the way to customize the heap order is to have each element on the heap to be a tuple, with the first tuple element being one that accepts normal Python comparisons.

用 tuple 固然是比自定义 class 要简单的 (你还可以用 `namedtuple`)，但要注意我们的 `heappush` 是不接受 `key` 的，那 tuple 的大小如何比较？

## `x < y` means Lexical Order Test for Tuples

lexicographic order, lexicographical order, lexical order, dictionary order, alphabetical order 这几个词全部都是表示 "字典序"。

alphabet 的字典序我们好理解，那其实放到数字上也是一样的，你把数字看做 character 就可以了。比如：

$$
\begin{aligned}
\text{ab}          & \lt_{l} \text{abc} \newline
\{7, 8\}           & \lt_{l} \{7, 8, 9\} \newline
\{1, 12, 99, 100\} & \lt_{l} \{1, 13\}
\end{aligned}
$$

然后 `<` 作用于两个 tuples 时其实在 **test 它们是否满足 lexical order**。按照 [How does tuple comparison work in Python?](https://stackoverflow.com/a/5292332) 的说法，这里 `<` 应该理解为 "comes before" 而不是 "is less than"

- 另外注意不同 type 的 collection 做比较的话是直接判 False 的 (比如 `(1, 2) == [1, 2]` 是 False)，必须先保证 type 相同才能进行 lexical order test

那这个 lexical order test 的逻辑我觉得可以大概用 `zip_longest` 模拟一下：

```python
from itertools import zip_longest
from operator import ne, lt

def __lt__(self, other):
    # assume self and other are of the same type
    # assume neither of self and other contains None

    # 短的 tuple 会被 pad with None
    pairs = zip_longest(self, other)
    for pair in pairs:
        if pair[0] is None and pair[1] is not None:
            return True
        elif pair[0] is not None and pair[1] is None:
            return False
        elif ne(*pair):
            return lt(*pair)
        else:  # None == None stands if you're curious
            continue
    
    return True
```

这个逻辑相当于：先比较第一对元素，如果不等，直接返回第一对的大小关系；如果相等，就继续比较下一对；然后谁先出现 `None` 说明谁的 string 短，在前面的字符都相同的情况下，短的 string 肯定要先出现在字典中，e.g. $\text{ab} \lt_{l} \text{abc}$。

这么一来，用 `(value, iterator_index)` 就的优势就在于很好地规避了 "两个 tuple 的 `value` 相同" 这个 scenario，因为此时会接着比较两个 `itertor_index`，它的大小关系对 heap 的结构没有影响 (因为你两个 `value` 相等，不管你怎么排列 node，heap 的 property 永远 valid)。但如果是 `(value, iterator)` 的话，你直接比较两个 `iterator` 的话会是 `TypeError`。这里用 `(value, iterator_index)` 这个 tuple 就精妙在此

- 你做一个 `namedtuple("CachedIterator", ("value", "iterator_index"))` 也是可以的，但上面那个实现已经很精炼了，没有必要 elaborate