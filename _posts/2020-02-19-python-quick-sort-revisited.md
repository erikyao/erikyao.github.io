---
category: Algorithm
description: ''
tags:
- Pivot
title: 'Python: Quick Sort Revisited / Relation To BST / Lomuto Partition Scheme / Hoare Partition Scheme'
toc: true
toc_sticky: true
---

参考 [Quicksort with Python](https://stackoverflow.com/questions/18262306/quicksort-with-python)

## Prerequisite: Pivot

Quick Sort 是一个使用 pivot 的算法，鉴于我对 pivot 实在苦手，这里展开详细说说。

先还是熟悉下这个单词吧：

- 首先这个词念法就有点奇怪：虽然有个 "o" 但读起来是 "pivit"
- 然后这个词的本意应该是杠杆系统里的 "支点"
- 然后在篮球里 pivot 指 "支撑脚"

![](/assets/posts/2020-02-19-python-quick-sort-revisited/pivot.jpg)

那在程序里，有个类似的概念是 binary search 的 `mid = lo + (hi - lo) // 2`，但是：

- `mid` 是 index
    - 而 `pivot` 一般是 value
- binary search 的目的是 **eliminate 区间** (去掉不可能的 candidates)
    - 而 pivot 的作用是 **partition** (fuzzily 给区间排序)，然后 recursively 处理小区间

## General Idea of Quick Sort

1. 选定一个 `pivot` 值
    - <span style="color:red">有不同的选取策略</span>，比如可以直接选 `array[0]`，也有随机选取的
1. "通过某种手段" 把 `< pivot` 的值 partition 到左半边，把 `> pivot` 的值都 partition 到右半边
    - <span style="color:red">有不同的 partition scheme</span>
1. 在这两个小区间里再分别取 `pivot`，递归处理

我这么多年都记不住 pivot 和 quick sort，让我觉得哪里肯定是出了问题：

1. Quick Sort 的 general idea 看起来很简单，但实现可以很复杂
    - "pivot 选取策略" 和 "parition scheme" 需要配合选择才能得到一个正确的实现
    - 可能是我选择的参考实现的细节太难记了，导致了对 general idea 的印象一并模糊了
1. 简单的实现也是有的，但是因为是太简单了所以就没人教了么？
1. **所以为什么一上来就要教 Lomuto Partition Scheme、Hoare Partition Scheme 呢？这尼玛是谁的主意？！**

## Quick Sort 肆意 Pythonic 实现 / 与 BST 的联系

Quick Sort 的一个优点是可以在 `array` 本体上 in-place 操作，不需要额外分配内存。但现在的问题，我 TM 都记不住啊，那还要啥 in-place 操作，先把正确的实现写一个出来吧！先把 general idea 实现出来看看啊！

```python
def quicksort(xs):
    """Given indexable and slicable iterable, return a sorted list"""
    if xs:  # if given list (or tuple) with one ordered item or more: 
        pivot = xs[0]
        
        # below will be less than:
        below = [i for i in xs[1:] if i < pivot] 
        # above will be greater than or equal to:
        above = [i for i in xs[1:] if i >= pivot]
        
        return quicksort(below) + [pivot] + quicksort(above)
    else: 
        return xs # empty list
```

诸君，quick sort 就是这么简单！这个实现的特点：

- pivot 选取策略 => `pivot = xs[0]`
- parition scheme => 用额外的 space 来存 partition + Inorder 递归

这个实现其实也很好地体现了 quick sort 和 binary search tree (BST) 的联系：

- `pivot` 就是个 root
- `< pivot` 的都 partition 到了 left subtree
- `> pivot` 的都 partition 到了 right subtree

所以我们可以这么说：**every run of quicksort corresponds to a building process of a BST**.

## Lomuto Partition Scheme

我今天研究了一下才发现我之前学习的参考实现是一个 Lomuto Partition Scheme + Hoare Partition Scheme 的混合体，心里简直哔了狗。

Lomuto Partition Scheme 的代码如下 (绑定了策略 `pivot = xs[end]`):

```python
def partition(xs, start, end):
    pivot = xs[end]
    
    i = start  # i is the write head
    for j in range(start, end):  # j is the read head
        if xs[j] < pivot:
            xs[i], xs[j] = xs[j], xs[i]  # swap; similar to overwriting xs[i] with xs[j]
            i += 1
    
    xs[i], xs[end] = xs[end], xs[i]  # ANCHOR 1
    return i
    
def quicksort(xs):
    def _quicksort(xs, start, end):
        if start < end:  # ANCHOR 2
            p = partition(xs, start, end)

            _quicksort(xs, start, p-1)  # ANCHOR 3
            _quicksort(xs, p+1, end)    # ANCHOR 3
        
    _quicksort(xs, 0, len(xs) - 1)
    return xs

quicksort([12, 11, 13, 5, 6, 7])
# Output: [5, 6, 7, 11, 12, 13]
```

代码要点：

- Lomuto Partition Scheme 的两指针其实是 **write head + read head** 组合，不像 Hoare Partition Scheme 是 **low + high** 组合
- `# ANCHOR 1` 的这个 swap 看起来匪夷所思，但其实是非常重要的一步。考虑这一步之前的 `xs` 的 partition：
    - `for x in xs[start:i]: x < pivot`
    - `for x in xs[i:end+1]: x >= pivot`
    - 与上面那个实现类似，我们仍然想做成三个区间 
        1. `xs[start:i]`
        2. `xs[i]`
        3. `xs[i+1:end+1]`
    - 但我们此时只知道有 `x[i] >= pivot`，所以我们直接把 `pivot` 换到 `x[i]` 位置上，这样就可以维持 `xs[start:i] < xs[i] == pivot <= xs[i+1:end+1]` 这么一个大小关系
    - 所以说你学会了基础实现，就很快能理解这一步的作用
- 这也解释了为什么 `# ANCHOR 3` 的两个区间跳过了 `xs[p]`
- `# ANCHOR 2` 是为了防止死循环，如果没有这一步的话：
    - `partition(xs, k, k)` 会 return `k`
    - 然后接着递归下一步会调用 `partition(xs, k, k-1)`，仍然是 return `k`
    - 不会停止

Lomuto Partition Scheme 是 in-place 操作。当 `xs` 本身是一个 desc sorted 的 array 时，Lomuto Partition Scheme 的 time compleixity 会 degrade 成 $O(n^2)$.

- 有点像做 decision tree 的时候挑到了一个非常糟糕的 split point

## Hoare Partition Scheme

Hoare Partition Scheme 的代码如下 (pivot 选择策略可以有变化):

```python
def partition(xs, start, end):
    pivot = xs[start]

    lo, hi = start, end
    while True:
        while xs[lo] < pivot: 
            lo += 1
        while xs[hi] > pivot: 
            hi -= 1
            
        if lo >= hi:
            return hi  # ANCHOR 1
        else:
            xs[lo], xs[hi] = xs[hi], xs[lo]
            lo += 1  # ANCHOR 2
            hi -= 1  # ANCHOR 2

def quicksort(xs):
    def _quicksort(xs, start, end):
        if start < end:
            p = partition(xs, start, end)
            
            _quicksort(xs, start, p)
            _quicksort(xs, p + 1, end)

    _quicksort(xs, 0, len(xs)-1)
    return xs

quicksort([12, 11, 13, 5, 6, 7])
# Output: [5, 6, 7, 11, 12, 13]
```

`# ANCHOR 2` 是一个非常隐蔽的 bug 点。因为原算法是用 do while 的 (但 python 没有 do while)：

```java
// Pseudo Code
lo, hi = start - 1, end + 1
while(True) {
    do {
        lo += 1
    } while(xs[lo] < pivot);
    do {
        hi -= 1
    } while(xs[hi] > pivot);

    if(lo >= hi):
        return hi 
    else:
        xs[lo], xs[hi] = xs[hi], xs[lo]
        // ANCHOR 2
};
```

所以你在 `else` 做完 swap 之后，重新进入 `while(True)` 的时候，do while 仍然会至少执行一次 `lo += 1` 和 `hi -= 1`，所以你改写成 while 之后必须要手动加上这么两句，否则的话会死循环。死循环会出现的一个场景比如 `xs[start] == xs[end] == pivot`，如果没有那两句的话，`xs[lo]` 和 `xs[hi]` 会在不停地在原地做 swap.

`# ANCHOR 1` 处可以有变化，但有基本法：

- 如果你是 `pivot = xs[start]`，那必须是 `return hi`，然后 `(start, p)` 和 `(p+1, end)` 递归
    - 防止 `pivot = xs[start]` 是 `max(xs)` 可能引起的死循环
- 如果你是 `pivot = xs[end]`，那必须要 `return lo`，然后 `(start, p-1)` 和 `(p, end)` 递归
    - 防止 `pivot = xs[end]` 是 `min(xs)` 可能引起的死循环
- 这里我就不展开了，太碎了，太繁了，太细节了，这也是我不喜欢 Hoare Partition Scheme 的原因

Hoare Partition Scheme 也是 in-place 操作。当 `xs` 本身是一个 desc sorted 的 array 时，Hoare Partition Scheme 的 time compleixity 会 degrade 成 $O(n^2)$.

## Hoare Partition Scheme Variant (Randomness improves robustness)

前面可以看出，pivot 选择策略是可以直接影响 partition scheme 的实现的，而且影响特别大！那为了屏蔽掉这些细节，消除掉死循环的可能性，我们其实引入一点随机性来提高健壮性。

```python
import random

def partition(xs, start, end):
    """
    random.randint(a, b) return a random integer N such that a <= N <= b. 
    Alias for randrange(a, b+1).
    """
    pivot = xs[random.randint(start, end)]

    lo, hi = start, end
    while lo <= hi:
        while xs[lo] < pivot: lo += 1
        while xs[hi] > pivot: hi -= 1
            
        """
        即使 lo == hi，下面的 lo++ 和 hi-- 也是要执行的
        所以这个 condition 还是把等于的情况包括进去了 
        """
        if lo <= hi:  
            xs[lo], xs[hi] = xs[hi], xs[lo]
            lo += 1
            hi -= 1
    
    return hi

def quicksort(xs):
    def _quicksort(xs, start, end):
        if start < end:  # ANCHOR 2
            p = partition(xs, start, end)

            _quicksort(xs, start, p)
            _quicksort(xs, p+1, end)
        
    _quicksort(xs, 0, len(xs) - 1)
    return xs

# quicksort([12, 11, 13, 5, 6, 7])
quicksort([7, 6, 5, 4, 3, 7])
```