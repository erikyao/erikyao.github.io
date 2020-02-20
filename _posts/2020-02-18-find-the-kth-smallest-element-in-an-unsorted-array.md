---
layout: post
title: "Find the $k$-th Smallest Element in an Unsorted Array / Heap Select / Quick Select"
description: ""
category: Algorithm
tags: []
---
{% include JB/setup %}

## 解法一：Sort

1. sort => $O(n \log n)$
1. return `sorted_array[k - 1]`

最终 time complexity: $O(n \log n)$

## 解法二：Heap Select

heap select 其实就是 [heap sort](/python/2020/02/18/python-heaps#2-heap-sort) 的思想：

1. `heapify` 一个 min-heap => $O(n)$
1. 连续 pop $k$ 次 => $O(k \log n)$
    - 第 $k$ 次 pop 的就是 $k$-th smallest

最终 time complexity: $O(n + k \log n)$

## 解法三：Max-heap of $k$ Smallest Elements

1. `heapify(array[0:k])` => $O(k)$
1. `for num in array[k:]`，如果 `num` 小于 root，`heapreplace(h, num)` (先 pop 再 push)
    - 这样源源不断地把小元素输入到 max-heap 里，最后 max-heap 就是最小的 $k$ 个元素的集合
    - => $O((n-k) \log k)$
1. return root

最终 time complexity: $O(k + (n-k) \log k)$

## 最优解：Quick Select

heap select 借鉴了 heap sort 的思想，那 quick select 就是借鉴了 [quick sort](/algorithm/2020/02/19/python-quick-sort-revisited) 的思想。

我们在 [quick sort](/algorithm/2020/02/19/python-quick-sort-revisited) 里有讲：pivot 是拿来做 partition 的，那其实 pivot 本身的 index 也能告诉我们一些信息。

考虑 Lomuto Partition Scheme 可以把 array partition 成 `xs[:p] < xs[p] == pivot <= xs[p+1:]` 这样的三部分：

- 如果 `p == k - 1`，返回 `xs[p]` 就可以了
- 如果 `p < k - 1`，去 `xs[p+1:]` 里找
- 如果 `p > k - 1`，去 `xs[:p]` 里找

这个过程有点像 quick sort + binary search 的一个 hybrid

注意事项：

- 你用 Lomuto Partition Scheme 的话，即是你是在 sub-array 里面，你返回的仍然是一个针对 `xs` 的 global 的 index，而不是相对 sub-array 的 local 的 index
    - 比如你在 `xs[p+1:]` 里，pivot 是第一个元素，你返回的 index 会是 `p+1` 而不是 `0`
    - 所以 `k` 的值在整个 recursive 过程中是不变的，不需要考虑说 "我把左半边 3 个元素 discard 掉了，所以在右半边要找 $(k-3)$-th smallest" 这样的逻辑
- EPI 书上的写法太复杂了，我觉得用 Lomuto Partition Scheme 就挺好
- EPI 还假设了说 elements 要 unique，但似乎不需要这么强的假设

```python
def partition(xs, start, end):
    pivot = xs[end]
    
    i = start  # i is the write head
    for j in range(start, end):  # j is the read head
        if xs[j] < pivot:
            xs[i], xs[j] = xs[j], xs[i]  # swap; similar to overwriting xs[i] with xs[j]
            i += 1
    
    xs[i], xs[end] = xs[end], xs[i]
    return i

def find_kth_smallest(xs, k):
    def _find_kth_smallest(xs, start, end, k):
        if k < 1:
            raise ValueError("k must be >=1. Got {}".format(k))

        if start > end:
            raise ValueError("wrong index. start={}, end={}".format(start, end))

        if start > k - 1 or end < k - 1:
            raise ValueError("array shorter than k")

        pivot_index = partition(xs, start, end)

        if pivot_index == k - 1:
            return xs[pivot_index]
        elif pivot_index > k - 1:
            return _find_kth_smallest(xs, start, pivot_index - 1, k)
        else:  # pivot_index < k - 1
            return _find_kth_smallest(xs, pivot_index + 1, end, k)
    
    return _find_kth_smallest(xs, 0, len(xs)-1, k)

find_kth_smallest([5, 2, 3, 3, 3, 6, 1, 4, 9, 8, 7], 4)
# Output: 3
```