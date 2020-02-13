---
layout: post
title: "Python: Bisection"
description: ""
category: Python
tags: []
---
{% include JB/setup %}

即 "二分查找"：

```python
def bisect_left(a, x, lo=0, hi=None):
    """Return the index where to insert item x in list a, assuming a is sorted.

    The return value i is such that all e in a[:i] have e < x, and all e in
    a[i:] have e >= x.  So if x already appears in the list, a.insert(x) will
    insert just before the leftmost x already there.

    Optional args lo (default 0) and hi (default len(a)) bound the
    slice of a to be searched.
    """

    if lo < 0:
        raise ValueError('lo must be non-negative')
    if hi is None:
        hi = len(a)
    while lo < hi:
        mid = (lo+hi)//2
        if a[mid] < x: 
            lo = mid+1
        else: 
            hi = mid
    return lo

def bisect_right(a, x, lo=0, hi=None):
    """Return the index where to insert item x in list a, assuming a is sorted.

    The return value i is such that all e in a[:i] have e <= x, and all e in
    a[i:] have e > x.  So if x already appears in the list, a.insert(x) will
    insert just after the rightmost x already there.

    Optional args lo (default 0) and hi (default len(a)) bound the
    slice of a to be searched.
    """

    if lo < 0:
        raise ValueError('lo must be non-negative')
    if hi is None:
        hi = len(a)
    while lo < hi:
        mid = (lo+hi)//2
        if x < a[mid]: 
            hi = mid
        else: 
            lo = mid+1
    return lo
```

如果需要在一个 sorted sequence 里查找 index，用二分法会更快：

```python
from bisect import bisect_left

x = list(range(100, 10**5))
a = 298

print(x.index(a))
print(bisect_left(x, a))

%timeit -n100 x.index(a)
%timeit -n100 bisect_left(x, a)

# Output
"""
198
198
100 loops, best of 3: 3.04 µs per loop
100 loops, best of 3: 550 ns per loop
"""
```

一般规律：

- 如果 `a in x` 且 `a` 出现了 n 次，则 `bisect_left(x, a) + n == bisect_right(x, a)`
- 如果 `b not in x`，则 `bisect_left(x, b) == bisect_right(x, b)`

```python
x = list(range(100, 10**5, 2))
a = 298
b = 299

print(bisect_left(x, a))
print(bisect_right(x, a))
print(bisect_left(x, b))
print(bisect_right(x, b))

# Output:
"""
99
100
100
100
"""
```