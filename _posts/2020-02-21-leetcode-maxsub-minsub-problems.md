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
- [2. LeetCode #76: The "Minimum Window Substring" Problem](#2-leetcode-76-the-minimum-window-substring-problem)
    - [2.1 问题描述 / 变体](#21-问题描述--变体)
    - [2.2 变体其实是陷阱](#22-变体其实是陷阱)
    - [2.3 我的实现](#23-我的实现)
- [3. LeetCode #3: The "Longest Substring Without Repeating Characters" Problem](#3-leetcode-3-the-longest-substring-without-repeating-characters-problem)
    - [3.1 问题描述](#31-问题描述)
    - [3.2 实现一](#32-实现一)
    - [3.2 实现二](#32-实现二)
- [4. LeetCode #487 & #1004: The "Max Consecutive Ones" Problems](#4-leetcode-487--1004-the-max-consecutive-ones-problems)
    - [4.1 LeetCode #487 实现](#41-leetcode-487-实现)
    - [4.2 LeetCode #1004 实现一](#42-leetcode-1004-实现一)
    - [4.3 LeetCode #1004 实现二](#43-leetcode-1004-实现二)
- [5. LeetCode #209: The "Minimum Size Subarray Sum" Problem](#5-leetcode-209-the-minimum-size-subarray-sum-problem)
- [6. 反面教材 - LeetCode #560: The "Subarray Sum Equals $k$" Problem](#6-反面教材---leetcode-560-the-subarray-sum-equals-k-problem)
    - [6.1 这题不能用 min sub 的套路](#61-这题不能用-min-sub-的套路)
    - [6.2 思路：巧妙利用 cumulative sum 的特性](#62-思路巧妙利用-cumulative-sum-的特性)
    - [6.3 用 `Counter` 改进](#63-用-counter-改进)

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

回想一下 "卖股票" 那个问题：一个交易窗口 (array) 包括多个交易日，我们要找一买一卖能获得的最大利润。它本质上也是个求 max sub 的问题：

- 考虑第 `0` 个交易日卖的最大利润 `max_trading_day_profit[0]`
- 考虑第 `1` 个交易日卖的最大利润 `max_trading_day_profit[1]`
- ……
- 考虑第 `n-1` 个交易日卖的最大利润 `max_trading_day_profit[n-1]`
- 那么这个交易窗口最大的利润必然是 `max(max_trading_day_profit)`

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

## 2. LeetCode #76: The "Minimum Window Substring" Problem

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

### 2.3 我的实现

按求 min sub 的套路来：

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

### 3.1 问题描述

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

### 3.2 实现一

按求 max sub 的套路来：

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

### 3.2 实现二

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

## 4. LeetCode #487 & #1004: The "Max Consecutive Ones" Problems

- Max Consecutive Ones II 是 [Leetcode 487](https://leetcode.com/problems/max-consecutive-ones-ii/)，但是是 locked！
  - 我们参考的是 [Max Consecutive Ones II (leetcode 487)](https://eugenejw.github.io/2017/08/leetcode-487)
- Max Consecutive Ones III 是 [Leetcode 1004, medium](https://leetcode.com/problems/max-consecutive-ones-iii/).

### 4.1 LeetCode #487 实现

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

### 4.2 LeetCode #1004 实现一

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

### 4.3 LeetCode #1004 实现二

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

## 5. LeetCode #209: The "Minimum Size Subarray Sum" Problem

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

## 6. 反面教材 - LeetCode #560: The "Subarray Sum Equals $k$" Problem

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