---
layout: post
title: "LeetCode: Min Sub and Max Sub Problems"
description: ""
category: LeetCode
tags: []
---
{% include JB/setup %}

Table of Contents:

<!-- TOC -->

- [1. 求 min/max sub-array 或 sub-string 问题的套路](#1-求-minmax-sub-array-或-sub-string-问题的套路)
    - [1.1 思路套路](#11-思路套路)
    - [1.2 求 min sub 问题的代码套路](#12-求-min-sub-问题的代码套路)
    - [1.3 求 max sub 问题的代码套路](#13-求-max-sub-问题的代码套路)
    - [1.4 min/max sub 与 DP (buttom-up) 与 MI 的关系](#14-minmax-sub-与-dp-buttom-up-与-mi-的关系)
        - [1.4.1 举例：LeetCode #121: Stock I](#141-举例leetcode-121-stock-i)
        - [1.4.2 举例：LeetCode #53: Max-sum Subarray](#142-举例leetcode-53-max-sum-subarray)
            - [1.4.2.1 这题在 EPI 书上错得离谱](#1421-这题在-epi-书上错得离谱)
            - [1.4.2.2 MI 思路](#1422-mi-思路)
- [2. LeetCode #76: Minimum Window Substring](#2-leetcode-76-minimum-window-substring)
    - [2.1 问题描述 / 变体](#21-问题描述--变体)
    - [2.2 变体其实是陷阱](#22-变体其实是陷阱)
    - [2.3 min sub 套路实现](#23-min-sub-套路实现)
- [3. LeetCode #3: The "Longest Substring Without Repeating Characters" Problem](#3-leetcode-3-the-longest-substring-without-repeating-characters-problem)
    - [3.1 max sub 套路实现](#31-max-sub-套路实现)
    - [3.2 min sub 套路实现](#32-min-sub-套路实现)
- [4. LeetCode #487 & #1004: Max Consecutive Ones](#4-leetcode-487--1004-max-consecutive-ones)
    - [4.1 LeetCode #487 的 max sub 套路实现](#41-leetcode-487-的-max-sub-套路实现)
    - [4.2 LeetCode #1004 的 max sub 套路实现](#42-leetcode-1004-的-max-sub-套路实现)
    - [4.3 LeetCode #1004 的 min sub 套路实现](#43-leetcode-1004-的-min-sub-套路实现)
- [5. LeetCode #209: Minimum Size Subarray Sum](#5-leetcode-209-minimum-size-subarray-sum)
- [6. 反面教材 - LeetCode #560: Subarray Sum Equals $k$](#6-反面教材---leetcode-560-subarray-sum-equals-k)
    - [6.1 这题不能用 min sub 的套路](#61-这题不能用-min-sub-的套路)
    - [6.2 思路：巧妙利用 cumulative sum 的特性](#62-思路巧妙利用-cumulative-sum-的特性)
    - [6.3 用 `Counter` 改进](#63-用-counter-改进)
- [7. LeetCode #55: Jump Game](#7-leetcode-55-jump-game)
    - [7.1 首先这题其实可以用 DP (top-down)](#71-首先这题其实可以用-dp-top-down)
    - [7.2 但这题也能转化成一个 max sub 的问题](#72-但这题也能转化成一个-max-sub-的问题)
    - [7.3 小改进：Early Termination](#73-小改进early-termination)

<!-- /TOC -->

## 1. 求 min/max sub-array 或 sub-string 问题的套路

### 1.1 思路套路

我们先直接说结论，再看为什么会有这样的结论。

首先求 min sub-array/sub-string (以下简称为 "求 min sub 问题") 的思路套路是：

- 考虑<span style="color:tomato">起</span>点是 `array[0]` 的最<span style="color:tomato">小</span>合法 sub-array `subs[0]`，假设得到范围 $[0, e_0]$ 
- 考虑<span style="color:tomato">起</span>点是 `array[1]` 的最<span style="color:tomato">小</span>合法 sub-array `subs[1]`，假设得到范围 $[1, e_1]$ 
- ……
- 考虑<span style="color:tomato">起</span>点是 `array[m]` 的最<span style="color:tomato">小</span>合法 sub-array `subs[m]`，假设得到范围 $[m, e_m]$ 
- ……
- 那么整个 `array` 上的最小合法 sub-array 就是 `min(subs)`

然后求 max sub-array/sub-string (以下简称为 "求 max sub 问题") 的套路非常类似：

- 考虑<span style="color:tomato">终</span>点是 `array[0]` 的最<span style="color:tomato">大</span>合法 sub-array `subs[0]`，假设得到范围 $[s_0, 0]$ 
- 考虑<span style="color:tomato">终</span>点是 `array[1]` 的最<span style="color:tomato">大</span>合法 sub-array `subs[1]`，假设得到范围 $[s_1, 1]$ 
- ……
- 考虑<span style="color:tomato">终</span>点是 `array[m]` 的最<span style="color:tomato">大</span>合法 sub-array `subs[m]`，假设得到范围 $[s_m, m]$ 
- ……
- 那么整个 `array` 上的最大合法 sub-array 就是 `max(subs)`

那为什么是这样的规律？这要配合我们解这类题常用的两指针说起。

考虑求 min sub 的场景：

```python
    i = 0 1     m m+1   e e+1
array = x x ... x x ... x x ...
                ^       ^
              left    right
```

- 假设你要算 `subs[m]`，你固定 `left` 指针在 $m$ 位置，然后往右 slide `right` 指针。当 slide 到 $e$ 位置时发现了第一个合法的 sub-array，那它肯定是最小的，因为再往右 slide 到 $e+1$ 肯定会得到一个更长的 sub-array。所以我们我们可以下定论 `subs[m]` 就在 $[m, e]$
- 此时我们要接着算 `subs[m+1]`。非常顺理成章地，我们把 `left` 右移一位到新起点 $m+1$，然后继续右移 `right` 就能接着计算了

考虑求 max sub 的场景：

```python
    i = 0 1     s s+1   m m+1
array = x x ... x x ... x x ...
                ^       ^
              left    right
```

- 假设你要算 `subs[m]`，你固定 `right` 指针在 $m$ 位置，然后往右 slide `left` 指针。当 slide 到 $s$ 位置时发现了第一个合法的 sub-array，那它肯定是最大的，因为再往右 slide 到 $s+1$ 肯定会得到一个更短的 sub-array。所以我们我们可以下定论 `subs[m]` 就在 $[s, m]$
- 此时我们要接着算 `subs[m+1]`。非常顺理成章地，我们把 `right` 右移一位到新终点，然后继续右移 `left` 就能接着计算了
  - 这里可能存在一个疑问：我们在考虑 `subs[m+1]` 的时候，不用再考虑 `left` 左边的元素了么？
  - 这的确是个需要考虑的问题，但很多题目的性质可以让你忽略这个问题。比如 "寻找由重复元素构成的 max substring" (比如 `Foooobaar` 中的 `oooo` 和 `aa`)，如果你的 `subs[m]` 是 $[s_m, m]$，那说明 $[s_m, m]$ 上都是同一个元素 $d$， $i < s_m$ 的位置上肯定是一个 $\neq d$ 的元素，你在算 `subs[m+1]` 的时候就不用考虑前面的元素的 (Instead，这个场合下你其实只需要考虑 `subs[m+1] ?= d`)
    - 换言之，在这个问题里，`subs[m+1]` 要么是 `subs[m]` 的 super-array，要么不存在

### 1.2 求 min sub 问题的代码套路

我们先看代码套路：

```python
def find_min_sub(array):
    min_sub = (float("-inf"), float("inf"))
    left = right = 0  # sub 的左边界与右边界

    for right in range(len(array)):  # 这个 for-loop 控制做加法 (右边界 `right++`)
        cur_sub = (left, right)

        # 如果当前 sub 不合法，就 continue for-loop 继续做加法
        # 如果当前 sub 合法，就进入这个 while-loop 尝试做减法
        while cur_sub.is_valid():
            # which means we have found `subs[left]`
            if cur_sub < min_sub:
                min_sub = cur_sub

            # now we are going to investigate `subs[left+1]`
            left += 1
            cur_sub = (left, right)  # 做完减法后更新当前区间

    return min_sub
```

- 我们并没有显式地保存 `subs[0:n]` 这么一个数组，我们只是每次都算出一个 `subs[left]`，然后看它是否比当前的 min sub 更小，如果是，就更新
  - 注意这里 `left` 相当于是 $m$ 的角色
- 这个 `cur_sub.is_valid()` 即是判定 sub 是否合法的函数
- 如果 `for` loop 一直跑，没有掉到 `while` loop 里，那说明我们在试图确定 `subs[left]`
- 一旦掉入了 `while` loop 里，就说明我们已经确定了 `subs[left]`，现在要开始探索 `subs[left+1]` 了 

我们用一个简单的例子来试试水：求 string 内 "包含 3 个相同元素" 的最小 sub-array。以 `BKKBBCCC` 为例：

```python
i     = 0 1 2 3 4 5 6 7
array = B K K B B C C C
        ========= =====
        >                # left = 0, right = 0，还无法构成 subs[0]
        >>>              # left = 0, right = 1，还无法构成 subs[0]
        >>>>>            # left = 0, right = 2，还无法构成 subs[0]
        >>>>>>>          # left = 0, right = 3，还无法构成 subs[0]
        >>>>>>>>>        # subs[0] = [0, 4]
          >>>>>>>>>>>>>  # subs[1] = [1, 7]
            >>>>>>>>>>>  # subs[2] = [2, 7]
              >>>>>>>>>  # subs[3] = [3, 7]
                >>>>>>>  # subs[4] = [4, 7]
                  >>>>>  # subs[5] = [5, 7] ⭐
                    >>>  # left = 6, right = 7，还无法构成 subs[6]，但因为 right 已经触底，所以 subs[6] 不存在
                      >  # left = 7, right = 7，同理 subs[7] 不存在
                         # 返回最短的 subs[5]
```

- 我们这个由 `(left, right)` 确定的 window，它在往右 slide 的同时，它的 size 也在发生变化，所以我们称它为 sliding elastic window (SEW)

### 1.3 求 max sub 问题的代码套路

因为求 max sub 的问题一般问的是 max sub 的长度，一般不要求返回 max sub 的具体位置，所以我们给一个专门针对求 max sub 长度的套路：

```python
def find_max_sub_len(array):
    max_sub_len = 1  # 一般这类的问题，单独一个字符往往是最小的合法的 sub
    left = right = 0  # sub 的左边界与右边界

    while right < len(array):
        cur_sub = (left, right)

        if cur_sub.is_valid():
            right += 1
        else:
            left += 1

        max_sub_len = max(max_sub_len, right - left)

    return max_sub_len
```

- 你可能会有一个疑问：为何我们没有检查 `if left < right`？这是因为一般这样的题目里，你不断 `left += 1` 最终是 guarantee 能得到一个合法的 sub 的，比如上面注释有写说 "单独一个字符往往是最小的合法的 sub"，所以你 `left += 1` 到 `left == right - 1` 的时候，一定能得到一个合法的 sub，这时又能去执行 `right += 1` 了
- 你可能还有新的疑问：区间 $[\text{left}, \text{right}]$ 的长度其实是 `right - left + 1`，为什么上面是 `right - left`？以及，更新 `max_sub_len` 为什么不放到 `if` 里执行？
  - 按理说更新 `max_sub_len` 的确应该是放到 `if` 里执行的，而且因为先执行了 `right += 1`，所以在这句之后实际有 `len(cur_sub) == right - left`
  - 那现在更新 `max_sub_len` 是放到 `while` 最后一句，如果前面执行的是 `if`，没有问题，如果执行的是 `else` 呢？
    - 那我假设第 $i$ 次 `while` loop 我们的 `(left, right)` 是合法的 sub，那第 $i+1$ 次 `while` loop 我们走 `else` 的话会得到 `(left+1, right+1)`，这个 sub (不论它是否合法) 的长度和 `(left, right)` 的长度一致，所以两次 `max()` 的结果是一样的 (要么都能更新 `max_sub_len`，要么都不更新)
  - 这个更新 `max_sub_len` 的操作放到 `while` 最后一句，我觉得主要是为了美观……(虽然非常的 confusing)
- 注意这里 `right` 是 $m$ 的角色
  - 若执行了 `right += 1`，表示我们已经确定了 `subs[right]`，接下来要探索 `subs[right+1]`
  - 若执行了 `left += 1`，表示我们还在探索 `subs[right]`

我们用 [Leetcode 3, Medium](https://leetcode.com/problems/longest-substring-without-repeating-characters/) 试试水。题目是：Given a string, find the length of the longest substring without repeating characters.

```python
i =  0 1 2 3 4 5
s = "p w w k e w" 
         =====
           =====
     >            # subs[0] = [0, 0], 更新后 left = 0, right = 1
     >>>          # subs[1] = [0, 1], 更新后 left = 0, right = 2
     >>>>>        # 无法构成 subs[2], 更新后 left = 1, right = 2
       >>>        # 无法构成 subs[2], 更新后 left = 2, right = 2
         >        # subs[2] = [2, 2], 更新后 left = 2, right = 3
         >>>      # subs[3] = [2, 3], 更新后 left = 2, right = 4
         >>>>>    # subs[4] = [2, 4], 更新后 left = 2, right = 5 ⭐
         >>>>>>>  # 无法构成 subs[5], 更新后 left = 3, right = 5
           >>>>>  # subs[5] = [3, 5], 更新后 left = 3, right = 6 ⭐
                  # right > len(s), 结束
                  # 返回长度 3 (subs[4] 和 subs[5] 都满足)
```

### 1.4 min/max sub 与 DP (buttom-up) 与 MI 的关系

先说与 DP 的关系。先说结论：min/max sub 就是个稍微有点特殊的 DP (buttom-up)。因为一般的 DP (buttom-up) 只需要保存 $O(1)$ 的 cache，而这个 $O(1)$ 一般是 individual 的 scalar(s)，而 min/max sub 的 $O(1)$ 是一个 `(left, right)` 的 tuple。

但话又说回来，有些问题看起来是 DP (buttom-up)，但其实可以转换成 min/max sub，因为有时候你的 individual 的 scalar(s) 是可以由你的 `(left, right)` tuple 算出来的。

另外还要一个问题，虽然你理解题目经常用 `subs`，但写代码的时候经常不需要显式地 new 这个数组出来，因为你最终的目的是求 `min(subs)` 或 `max(subs)`，所以经常是在 iterate 的过程中滚动地保持一个 min/max value。也正是这个原因，有时候 `subs` 可以有不同的解读。下面 "卖股票" 的问题里我们就可以举个例子。

然后说说与 MI (Mathematical Induction, 数学归纳法) 的关系。虽然 DP (buttom-up) 和 MI 看上去有天然的对应关系，但做题的思路里往往没有考虑 MI (可能是因为不太好描述)，但如果有好描述的 min/max sub 问题能用 MI 解释的话，凑齐 "min/max sub $\rightarrow$ DP (buttom-up) $\rightarrow$ MI" 的推理链也是一个 wow moment。下面 XXX 的的问题里我们可以看一个具体的 MI 的例子

#### 1.4.1 举例：LeetCode #121: Stock I

原题是 [LeetCode #121, Easy](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/)：一个交易窗口 (array) 包括多个交易日，我们要找一买一卖能获得的最大利润。

我们先直接上代码：

```python
def max_profit(prices):
    max_profit = 0
    min_buy_price = prices[0]
    
    for today_price in prices[1:]:
        # What if we sell at today's price? 
        today_profit = today_price - min_buy_price
        
        # Is today's profit big enough?
        max_profit = max(max_profit, today_profit)
        
        # Is today's price a good one for buying?
        min_buy_price = min(min_buy_price, today_price)
        
    return max_profit

max_profit([310, 315, 275, 295, 260, 270, 290, 230, 255, 250])
# Output: 30  
    # buy at 260; sell at 290 
```

这个问题是个典型的 DP (buttom-up)，虽然它的问题描述非常像一个求 max sub 的问题，但代码又不是很像，不过仔细观察就能发现一些对应：

- `left` 指针相当于是 `min_buy_price`
- `right` 指针相当于是 `today_price`

对 `subs` 可以有两种解读：

- 如果认为 `subs` 是 `today_profit`，那么：
  - `subs[i]` 表示 "如果**一定要**我在第 `i` 天 sell，我能获得的最大利润"
- 如果认为 `subs` 是 (滚动更新的) `max_profit`，那么： 
  - `subs[i]` 表示 "如果**允许**我在第 `i` 天 sell，我能获得的最大利润"
  - 换言之，`subs[i]` 即是交易窗口 $[0, i]$ 内的最大利润

#### 1.4.2 举例：LeetCode #53: Max-sum Subarray

原题是 [LeetCode #53, Easy](https://leetcode.com/problems/maximum-subarray/)：在一个 array `A` 中找 sub array，要求 `sum(sub_array)` 最大；返回这个最大的 sum 即可。

##### 1.4.2.1 这题在 EPI 书上错得离谱

这题在 _EPI in Python_ 16 章作为 DP 的一个例子引入，但错得离谱。

书上的思路是：定义 $S(n) = \sum_{i=0}^{n-1} A[i]$，所以任意一个 sub-array 的和 `sum(A[i:j])` 都可以定义为 $S(j) - S(i)$，所以问题可以转化成求 $\max S(j) - S(i), \text{where }j \geq i$

```python
# CAUTION: WRONG IDEA & WRONG CODE!

from itertools import accumulate

def find_max_subarray_sum(A):
    min_acc = max_sum = 0
    
    for running_acc in accumulate(A):
        min_acc = min(min_acc, running_acc)
        max_sum = max(max_sum, running_acc - min_acc)
        
    return max_sum

find_max_subarray_sum([1, 3, 5, -11, 9, 7])
# Output: 16
```

首先这个思路的问题在于：

- 你的 $S(i)$，起始点是 $i=1$ 而不是 $i=0$，换言之你能探索的最长的 sub-array 只能是 `A[1:]`，那我如果 max sum 包含 `A[0]` 呢？
- 你可能想说为了修补这个问题，我自己定一个 $S(0) == 0$ 可以吗？不行，因为这题可以负数。你会发现，你这个 $S(0)$ 根本没法弄

代码层面的错误：

1. 你的返回值 `max_sum` 初始是 0，然后后面是用 `max()` 更新，那我整个 array 都是负数咋办？
1. 如果我的 `len(array) == 1`，那么必然有 `running_acc == min_acc`，接着必然有 `max_sum = max(max_sum, 0) == max(0, 0) == 0`
    - 你说我可以把初始化 `max_sum = A[0]`，那如果我 `A[0] < 0` 呢？你还是会得到 `max_sum == 0`，还是不对

##### 1.4.2.2 MI 思路

考虑 `subs[i]`: **一定**以 `A[i]` 结尾的 max-sum sub-array (的 sum)

1. `subs[0] == A[0]`
2. 假定你已经有了 `subs[i]`，现在考虑 `subs[i+1]`，只可能有两种情况：
    1. `subs[i] >= 0`，表示我们可以 append `A[i+1]` 来造一个更大的 sub-array
        - 此时有 `subs[i+1] = subs[i] + A[i+1]`
    2. `subs[i] < 0`，表示前面以 `A[i]` 结尾的 sub-array 其实是累赘，不如从 `A[i+1]` 另起一个 sub-array
        - 此时有 `subs[i+1] = A[i+1]`
    3. 你 `subs[i+1]` 取这两者的 `max` 就可以了
3. 最终的解是 `max(subs)`

```python
def find_max_subarray_sum(A):
    max_running_sum = max_global_sum = A[0]
    
    for num in A[1:]:
        max_running_sum = max(num, num + max_running_sum)
        max_global_sum = max(max_global_sum, max_running_sum)
        
    return max_global_sum

find_max_subarray_sum([-2,1,-3,4,-1,2,1,-5,4])
# Output: 6
```

上面的实现虽然看起来没有 max sub 的套路，但可以理解成：

- 隐藏了 `left` 指针 (被 `max` 操作取代了)
- `right` 指针相当于就是 `num`

## 2. LeetCode #76: Minimum Window Substring

### 2.1 问题描述 / 变体

原题是 [Leetcode 76, Hard](https://leetcode.com/problems/minimum-window-substring/)，_EPI in Python_ 的 12.6 是一个换皮。

题目是这样的：给定一个长 string `text` 和一个关键字列表 `keywords`，要求找出 `text` 中包含所有关键字的最短的 substring (关键字出现的顺序不限)。

那根据 `keywords` 是否是 distinct，你在别的地方可能会发现这题的变体：

- 变体一：参数 `keywords` 是 distinct 的，我们的 substring 中每个关键字只需要出现一次即可
- 变体二：参数 `keywords` 这个关键字列表中，单个关键字可以出现 $n > 1$ 次，且相应地要求 substring 中这个关键字也要出现 $n > 1$ 次

举例 (非关键字我们并不关心，统一用 `x` 表示)：

```python
# 变体一
keywords = [A B]
text = [x A x x x B x x A]
          ~~~~~~~~~        # 这段 substring 包含 A、B 但是不是最短
                  -------  # 正解！

# 变体二
keywords = [A A B]
text = [x x A x A B x x A x x]
            =======        # 正解！ 
                =========  # 太长
```

### 2.2 变体其实是陷阱

但要小心的是：**这是陷阱！因为这两种变体本质上是一样的！** 先说结论：这两种情况都应该用 `Counter` 去实现 `cur_sub.is_valid()` 的逻辑：

- 上来先 `Counter(keywords)` 计数，表示 "需要匹配的关键字的数目"。在 iterate `text` 的过程中：
  - 在执行 `right++` 的时候，遇到关键字就 `cnt--`，表示 "匹配成功，目标关键字减少"
  - 在执行 `left++` 的时候，遇到关键字就 `cnt++`，表示 "之前匹配的关键字现在不匹配了，目标关键字增加"
- 用 `Counter` 的一个好处就是：它可以处理 "遇到冗余的关键字" 的情况，因为：
  - `cnt == 0` 表示 "要求匹配 $k$ 次且我已经匹配了 exactly $k$ 次"
  - `cnt < 0` 表示 "要求匹配 $k$ 次但我已经匹配了 $k' > k$ 次" (有余粮可以给 `left` 挥霍)
- 当所有关键字都有 `cnt <= 0` 的时候，这个 substring 便是合法的

```python
keywords = [A B]  # 初始 Counter == {A:1, B:1}
text = [A A A B]
        >         # Counter == {A:0, B:1}，无法构成 subs[0]
        >>>       # Counter == {A:-1, B:0}，无法构成 subs[0]
        >>>>>     # Counter == {A:-2, B:0}，无法构成 subs[0]
        >>>>>>>   # Counter == {A:-2, B:0}, subs[0] = [0, 3]
          >>>>>   # Counter == {A:-1, B:0}, subs[1] = [1, 3]
            >>>   # Counter == {A:0, B:0}, subs[2] = [2, 3] ⭐
              >   # Counter == {A:1, B:0}，subs[3] 不存在
```

我为什么要是说这个题目的变体其实是陷阱？因为 变体二 用 `Counter` 似乎是个很直接的选择，但是 变体一 你可能觉得用 `set` 就可以搞定，但是 `set` 处理不了上面那个情况：

```python
keywords = [A B]  # 初始 set == {A，B}
text = [A A A B]
        >         # set == {B}，无法构成 subs[0]
        >>>       # set == {B}，无法构成 subs[0]
        >>>>>     # set == {B}，无法构成 subs[0]
        >>>>>>>   # set == {}, subs[0] = [0, 3]
          >>>>>   # 现在怎么办？！这个 `A` 要遣返回 set 吗？你会发现，遣返也不是，不遣返也不是
```

### 2.3 min sub 套路实现

```python
from collections import Counter

class KeywordStat:
    def __init__(self, keywords):
        self.target_set = set(keywords)
        self.target_cnt = Counter(keywords)
        self.n_targets = len(self.target_set)  # number of unique keywords
        
    def take_in(self, word):
        if word in self.target_set:
            self.target_cnt[word] -= 1
            
            if self.target_cnt[word] == 0:
                # when the counter of one keyword is reduced to 0, we covered as many as required
                self.n_targets -= 1
    
    def give_out(self, word):
        if word in self.target_set:
            self.target_cnt[word] += 1

            if self.target_cnt[word] == 1:
                # when the counter of one keyword is above 0 again, we need to cover it again in later windows
                self.n_targets += 1
              
    def is_fully_covered(self):
        return self.n_targets == 0
    
def find_minimum_window(text, keywords):
    stat = KeywordStat(keywords)
    
    left, window = 0, None
    for right, right_word in enumerate(text):
        stat.take_in(right_word)
        
        while stat.is_fully_covered():
            if not window or window[1] - window[0] > right - left:
                window = (left, right)
            
            left_word = text[left]
            stat.give_out(left_word)

            left += 1
    
    return window
```

```python
# (变体一示例)
text = ["A", "A", "A", "B"]
keywords = ["A", "B"]

find_minimum_window(text, keywords)
# Output: (2， 3)
```

```python
# (变体二示例)
text = ["A", "x", "A", "A", "B", "x", "A", "B", "x"]
keywords = ["A", "A", "B"]

find_minimum_window(text, keywords)
# Output: (2, 4)
```

## 3. LeetCode #3: The "Longest Substring Without Repeating Characters" Problem

原题是 [Leetcode 3, Medium](https://leetcode.com/problems/longest-substring-without-repeating-characters/)：Given a string, find the length of the longest substring without repeating characters.

```python
s = "abcabcbb"  # 有很多可能，但最长都只有 3
     ===
      ===
       ===  

s = "bbbbb"  # 返回 1

s = "pwwkew"  # 返回 3
       ===
        ===  
```

思路已经在 [1.3 求 max sub 问题的代码套路](#13-求-max-sub-问题的代码套路) 里说过了。

### 3.1 max sub 套路实现

```python
def len_of_longest_distinct_substring(s):
    if not s: 
        return 0
    if len(s) == 1: 
        return 1

    seen_chars = set()
    left, right, max_length = 0, 0, 1

    while right < len(s):
        if s[right] not in seen_chars:
            seen_chars.add(s[right])
            right += 1
        else:
            seen_chars.remove(s[left])
            left += 1
            
        max_length = max(max_length, right - left)
            
    return max_length

[len_of_longest_distinct_substring(s) for s in ["abcabcbb", "bbbbb", "pwwkew", " ", "au"]]
# Output: 3 1 3 1 2
```

### 3.2 min sub 套路实现

这题很有意思地也可以用类似 min sub 的套路来实现，但我觉得写起来稍微有点复杂，不如用 max sub 的套路直接：

```python
def len_of_longest_distinct_substring(s):
    if not s: 
        return 0
    if len(s) == 1: 
        return 1

    seen_chars = set()
    left, max_length = 0, 1

    for right_char in s:  # `right` index is useless here, so we do not use `enumerate(s)`
        if right_char not in seen_chars:
            seen_chars.add(right_char)
        else:
            while s[left] != right_char:
                seen_chars.remove(s[left])
                left += 1
            
            # now s[left] == right_char, must skip s[left] to get a valid substring
            # this is essentially a do-while-loop 
            left += 1

        max_length = max(max_length, len(seen_chars))

    return max_length

[len_of_longest_distinct_substring(s) for s in ["abcabcbb", "bbbbb", "pwwkew", " ", "au"]]
# Output: 3 1 3 1 2
```

## 4. LeetCode #487 & #1004: Max Consecutive Ones

- Max Consecutive Ones II 是 [Leetcode 487](https://leetcode.com/problems/max-consecutive-ones-ii/)，但是是 locked！
  - 我们参考的是 [Max Consecutive Ones II (leetcode 487)](https://eugenejw.github.io/2017/08/leetcode-487)
- Max Consecutive Ones III 是 [Leetcode 1004, medium](https://leetcode.com/problems/max-consecutive-ones-iii/).

### 4.1 LeetCode #487 的 max sub 套路实现

题目是：Given a binary array, find the maximum number of consecutive 1s in this array if you can flip at most one 0.

按 max sub 的套路。只 flip 一次可以用一个 boolean 标志位：

```python
def find_max_consecutive_ones(nums):
    flipped_once = False
    
    left, right, max_length = 0, 0, 0
    while right < len(nums):
        if nums[right] == 1:
            right += 1
        elif not flipped_once:
            flipped_once = True
            right += 1
        else:
            if nums[left] == 0:
                flipped_once = False
            left += 1
            
        max_length = max(max_length, right - left)
            
    return max_length

find_max_consecutive_ones([1, 0, 1, 1, 0])
# Output: 4
```

### 4.2 LeetCode #1004 的 max sub 套路实现

在 LeetCode #487 的基础上，允许你 flip $k$ 次

还是按 max sub 的套路，只是这次我们把 boolean 标志位换成一个 `cnt`：

```python
def find_max_consecutive_ones(nums, k):
    flip_cnt = 0
    
    left, right, max_length = 0, 0, 0
    while right < len(nums):
        if nums[right] == 1:
            right += 1
        elif flip_cnt < k:
            flip_cnt += 1
            right += 1
        else:
            if nums[left] == 0:
                flip_cnt -= 1
            left += 1
            
        max_length = max(max_length, right - left)
            
    return max_length

find_max_consecutive_ones([1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2)
# Output: 6
```

### 4.3 LeetCode #1004 的 min sub 套路实现

这题也可以用类似 min sub 的套路：

```python
def find_max_consecutive_ones(nums, k):
    flip_cnt = 0
    
    left, max_length = 0, 0
    for right, num in enumerate(nums):
        if num == 0:
            flip_cnt += 1
            
        while flip_cnt > k:  # ANCHOR 1
            if nums[left] == 0:
                flip_cnt -= 1
            left += 1
            
        max_length = max(max_length, right - left + 1)  # ANCHOR 2
            
    return max_length

find_max_consecutive_ones([1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2)
# Output: 6
```

- 需要注意边界的判定 (`# ANCHOR 1`) 和长度的计算 (`# ANCHOR 2`) 稍微有点不同

## 5. LeetCode #209: Minimum Size Subarray Sum

[Leetcode 209, medium](https://leetcode.com/problems/minimum-size-subarray-sum/)，题目是：给定一个正整数 array 和一个正整数 `s`，求一个 shortest sub 满足 `sum(sub) >= s`。返回 shortest length 即可，不用返回 sub。

还是按 min sub 的套路：

```python
def len_of_min_subarray(nums, k):
    left, running_sum = 0, 0
    min_len = float("inf")
    
    for right, num in enumerate(nums):
        running_sum += num
        
        while running_sum >= k:
            min_len = min(min_len, right - left + 1)
            
            running_sum -= nums[left]
            left += 1
        
    return min_len if min_len <= len(nums) else 0

len_of_min_subarray([1,2,3,4,5], 11)
# Output: 3
```

## 6. 反面教材 - LeetCode #560: Subarray Sum Equals $k$

### 6.1 这题不能用 min sub 的套路

[Leetcode 560, medium](https://leetcode.com/problems/subarray-sum-equals-k/)，题目是：给定一个整数 array `nums` 和一个整数 $k$，求满足 `sum(sub) == k` 的 sub 的数量。

这题其实是个反面教材，它虽然长得很像 [5. LeetCode #209: The "Minimum Size Subarray Sum" Problem](#5-leetcode-209-the-minimum-size-subarray-sum-problem)，但它并不能用 min sub (也不适合用 max sub) 的思路来做。

适合 min sub 套路来解的题目都有一个特点：

- `right += 1` 时候是一个 $\sum_{i+1} \geq \sum_{i}$ 的趋势 
  - 这个 $\sum$ 可以指 sum、count、coverage 等
- `left += 1` 的时候是一个 $\sum_{i-1} \leq \sum_{i}$ 的趋势

但这题的情况是：

- `sum += nums[right]` 并不能保证 `sum` 会增加
- `sum -= nums[left]` 也并不能保证 `sum` 会减少
  - 如果我们规定 `nums` 都是非负数也许还有救
- 此外还有小细节比如 $k = 0$ 的时候，你 `left -= 1` 到 `left == right` 的时候并不算一个合法的 sub

总之这题就是不适合用 min sub 的套路。

### 6.2 思路：巧妙利用 cumulative sum 的特性

- 注意用词：
  - 一般都只说 "cumulative sum"，极少用 "accumulative sum"
  - 但是操作一般都用 "accumulate"，比如 `itertools.accumulate()`

参考 [560. Subarray Sum Equals $k$](https://leetcode.com/articles/subarray-sum-equals-k/)，这题的解法很巧妙地利用了 cumulative sum 的一个特性：

假设有 array $a_1, a_2, \dots, a_n$，计算它们的 cumulative sums:

$$
\begin{aligned}
S_0 &= 0  \newline
S_1 &= a_1  \newline
S_2 &= a_1 + a_2  \newline
    &\dots  \newline
S_n &= \sum_{1}^{n} a_i
\end{aligned}
$$

**如果存在 $S_j - S_i = k$，那说明 $a_{i+1}, \dots, a_{j}$ 是一个合法的 sub**

### 6.3 用 `Counter` 改进

上面那个思路的方向是没问题的，就是我们在搜索 $S_j - S_i = k$ 的时候会用到一个二重循环，使得 time $O(n^2)$。如何改进这个过程？

- 我们并不是一定要一口气把所有的 cumulative sums 都算出来，我们也可以一个一个地算
- 我们可以用一个 `set` 来存 $S_0, \dots, S_{j-1}$，但我们求出 $S_j$ 之后，我们并不是去找 "有没有 $S_j - S_{i} = k$"，而是直接问 "$S_j - k$ 在不在 `set` 里面" (你他娘的还真是个天才！)
- 但用 `set` 有一个微妙的问题没法处理：如果存在 $a_i = 0$，那么 $S_i = S_{i-1}$，万一又 $S_j - S_i = k$，此时应该有两个 sub ($[i, j]$ 和 $[i+1, j]$) 都满足条件，但根据 `set` 你只能发现一个
  - **所以我们可以上 `Counter`!**

```python
def num_of_subarrays(nums, k):
    result = 0
    
    running_sum = 0
    # Another way to initialize:
    #   cumulative_sum_cnt = Counter()
    #   cumulative_sum_cnt[0] = 1
    cumulative_sum_cnt = Counter([0])  # there is always a S_0 = 0
    
    for num in nums:
        running_sum += num
        
        if running_sum - k in cumulative_sum_cnt:
            result += cumulative_sum_cnt[running_sum - k]
            
        cumulative_sum_cnt[running_sum] += 1
        
    return result

num_of_subarrays([3, 4, 7, 2, -3, 1, 4, 2], 7)
# Output: 4
```

- 注意 `Counter` 的初始化写法
- `Counter` 的 `__missing__(key)` 是会返回 0 的，所以不用担心 `KeyError`
- 这个写法可以把 time 降到 $O(n)$

## 7. LeetCode #55: Jump Game

_EPI in Python_ 5.4 叫这个问题是 "Advance Through An Array"，不知所谓。

题目是：考虑一种 board game：`array[i] == k` 表示从 `array[i]` 起最远可以跳到 `array[i+k]` (跳到中间的任意位置也是可以的，但最远就 `array[i+k]`)。给定一个 array，判断能否从 `array[0]` 一路跳到 `array[-1]` (超过 `array[-1]` 自然也是算成功的)。

比如 `array = [3, 3, 1, 0, 2, 0, 1]`，可以走 `[0] -> [1] -> [4] -> [6]` 这个路线：

```python
    i = 0  1  2  3  4  5  6
array = 3  3  1  0  2  0  1
        |->|------->|---->|
```

### 7.1 首先这题其实可以用 DP (top-down)

考虑 `array[0]`:

- 如果 `array[0] == 0`，第一步都迈不出去，False
- 如果 `array[0] >= len(array) - 1`，可以一步走到末端，True
- 如果 `array[0]` 可以 reach 到 `array[1:k+1]`，那么只要 `array[1:k+1]` 中有一个能 reach 到末端，那 `array[0]` 也一定能 reach 到末端

```python
def can_reach_end(array):
    reachable = [None] * len(array)
    reachable[-1] = True
    
    def reach_helper(i):
        if reachable[i] is None:
            if array[i] == 0:
                reachable[i] = False
            elif array[i] >= len(array) - i - 1:
                reachable[i] = True
            else:
                reachable[i] = any(reach_helper(j) for j in range(i+1, i+array[i]+1))
        
        return reachable[i]
    
    return reach_helper(0)

print(can_reach_end([3, 3, 1, 0, 2, 0, 1]))
# Output: True
```

Complexity:

- time: $O(n)$
- space: $O(n)$

### 7.2 但这题也能转化成一个 max sub 的问题

即：求一个从 `array[0]` 开始的 longest reachable 的位置。求出来再看这个位置是否能达到 `array[-1]` 即可。

上 max sub 的套路：

- 我们用 `subs[i]` 表示 `array[0]` "如果有 `array[i]` 做跳板" 能 reach 的最远的 index
- 由于我们的 `left` 固定在了 `array[0]`，所以这个 max sub 问题只需要一个 `right` 指针即可

```python
def can_reach_end(array):
    furthest_index = 0
    last_index = len(array) - 1
    
    for i in range(len(array)):
        if i <= furthest_index:
            furthest_index = max(furthest_index, i + array[i])
    
    return furthest_index >= last_index

print(can_reach_end([3, 3, 1, 0, 2, 0, 1]))
# Output: True
```

我们用一个具体的例子来看下这个 `subs[i]` 到底是啥意思：

```python
       i = 0 1 2 3 4 5 6
   array = 3 3 1 0 2 0 1
furthest = 3 4 4 4 6 6 7
```

- `subs[0]`：只有 `array[0]` 自己是自己的跳板
  - 所以 `furthest_index` 即是 `array[0]` 能到达的最远的 index
- `subs[1]`：相当于在问："现在有 `array[1]` 可以做跳板，要不要考虑一下？"
  - 我们发现从 `array[1]` 跳一下的确能跑远一点，于是更新了 `furthest_index`
- `subs[2]`：相当于又有一个新跳板 `array[2]`，但可跳可不跳，所以 `furthest_index` 没有更新
- `subs[3]`：新跳板 `array[3]` 完全没用，所以 `furthest_index` 没有更新
- `subs[4]`：新跳板 `array[4]` 有用，更新 `furthest_index`
- 依此类推

代码里有一个条件 `if i <= furthest_index:`，它非常关键。我们想一下 `i > furthest_index` 代表啥意思？

- 你有了一个新跳板 `array[i]`
- 但是你从 `array[0]` 开始根本就不可能跳到 `array[i]`

比如下面这个例子，你根本就不可能跳到 `array[4]`：

```python
       i = 0 1 2 3 4 5 6
   array = 0 0 0 0 2 0 1
furthest = 0 0 0 0 0 0 0
```

Complexity:

- time: $O(n)$
- space: $O(1)$

### 7.3 小改进：Early Termination

上面的 max sub 实现可以加两个 early termination 的条件：

```python
def can_reach_end(array):
    furthest_index = 0
    last_index = len(array) - 1
    
    for i in range(len(array)):
        if i <= furthest_index:
            furthest_index = max(furthest_index, i + array[i])
        else: 
            # Early Termination Case 1: 已经不可能 reach 到 array[i] 了，后面 array[i:] 的部分更不可能 reach 到
            return False
        
        if furthest_index >= last_index:
            # Early Termination Case 2: 已经可以 reach 到 array[-1] 了，没有必要把 i 遍历完
            return True
    
    return furthest_index >= last_index
```