---
category: Python
description: ''
tags: []
title: 'Python: It''s safe to slice a list with index out of range'
---

用单个下标 access 直接返回 list 的单个 element，用 slice (或者严格一点说是用一个 `slice` object 去 access) 返回一个 sub-list，这俩都是很常见的操作。但是：

- 用单个下标 access 可能触发 `IndexError: list index out of range`
- 用 slice 就不会！

看这个例子：

```python
s = [100, 200, 300]

s[2]  # Index within range. OK
# Output: 300

s[3]  # Index out of range. WRONG!
# IndexError: list index out of range
```

```python
s = [100, 200, 300]

s[2:]  # Slice within range. OK
# Output: [300]

s[3:]  # Slice out of range. Still OK!
# Output: []
```

答案在文档里。[Built-in Types >> Sequence Types — list, tuple, range >> Common Sequence Operations](hhttps://docs.python.org/3/library/stdtypes.html#common-sequence-operations) 的 note 4，以 `s[i:j]` 这个 slice 为例：

> The slice of s from `i` to `j` is defined as the sequence of items with index `k` such that `i <= k < j`. If `i` or `j` is greater than `len(s)`, use `len(s)`. If `i` is omitted or None, use `0`. If `j` is omitted or `None`, use `len(s)`. If `i` is greater than or equal to `j`, the slice is empty.

所以上面的 `s[3:]` 等价于 `s[3:3]` 等价于一个 empty slice。那至于 empty slice 为什么不会产生 `IndexError`，可以参见 [Digest of Fluent Python >> 10.2.1 How Slicing Works](/python/2016/09/16/digest-of-fluent-python#10-2-1-How-Slicing-Works)。不严格地说，`s[i:j:k]` 的过程大致如下：

```python
def s[i:j:k]:
    # 首先创建一个 slice object
    slice_obj = slice(i, j, k)

    # 让后通过 slice 和 len(s) 确定具体的 index range
    # 比如：如果 len(s) = 3，那么对 s 而言 slice(0:None:None) 就意味着一个具体的 index range(0, 3, 1)
    # 只是 slice.indices() 方法并不直接产生 range，它只产生 range 的参数
    indices = slice_obj.indices(len(s))
    index_range = range(*indices)

    # 根据 index range 去 listcomp
    return [s[index] for index in index_range]
```

那如果你有一个 empty slice，就会有一个 empty 的 `index_range`，那最后的 listcomp 相当于是一个 empty 的 generator，是不会产生 `IndexError` 的。