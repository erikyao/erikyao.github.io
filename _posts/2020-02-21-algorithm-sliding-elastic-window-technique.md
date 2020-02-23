---
layout: post
title: "Algorithm: Sliding Elastic Window Technique"
description: ""
category: Algorithm
tags: []
---
{% include JB/setup %}

## 1. The "Minimum Window Substring" Problem

原题是 [Leetcode 76, Hard](https://leetcode.com/problems/minimum-window-substring/)，_EPI in Python_ 的 12.7 是一个换皮，但稍微好理解一点。

题目是这样的：给定一段 text 和几个 keywords，要求找出 text 中最短的一段 which 包含所有的 keywords。有点类似我们用 highlighter 划课本的意思。

Leetcode 和 EPI 都把这题归到了 Hash Table 的类别，但这题 Hash Table 只是辅助手段，核心是 Sliding Elastic Window 这个小技巧。我以前接触的 sliding window 都是 fixed size，所以这算是知识盲区。

以下面这个输入为例

```python
text = ["apple", "banana", "apple", "apple", "dog", "cat", "apple", "dog", "banana"]

keywords = ["banana", "cat"]
```

sliding elastic window 的做法是：

- 第一步，固定 `i = 0`，往右 expand 先找一个 valid 的 window 出来再说

```python
index = [   0         1        2        3       4      5       6       7        8   ]
text  = ["apple", "banana", "apple", "apple", "dog", "cat", "apple", "dog", "banana"]
                  ========                           =====
            ^                                          ^
            i                                          j
```

- 第二步，固定 `j`，在左边 contract，找到一个 local optimal window，记录下来。如图是 `(1, 5)`

```python
index = [   0         1        2        3       4      5       6       7        8   ]
text  = ["apple", "banana", "apple", "apple", "dog", "cat", "apple", "dog", "banana"]
                  ========                           =====
                      ^                                ^
                      i                                j
```

- 第三步，继续固定 `j`，在左边 contract，这样会破坏 window 的 validity。但是不要紧，我们记录下是哪个 keyword "得而复失"。如图是 "banana"

```python
index = [   0         1        2        3       4      5       6       7        8   ]
text  = ["apple", "banana", "apple", "apple", "dog", "cat", "apple", "dog", "banana"]
                                                     =====
                               ^                       ^
                               i                       j
```

- 第四步，重复第一步的逻辑，固定 `i`，往右 expand，再找一个 valid 的 window

```python
index = [   0         1        2        3       4      5       6       7        8   ]
text  = ["apple", "banana", "apple", "apple", "dog", "cat", "apple", "dog", "banana"]
                                                     =====                  ========
                               ^                                                ^
                               i                                                j
```

- 第五步，重复第二步的逻辑，固定 `j`，在左边 contract，找到一个 local optimal window，记录下来。如图是 `(5, 8)`

```python
index = [   0         1        2        3       4      5       6       7        8   ]
text  = ["apple", "banana", "apple", "apple", "dog", "cat", "apple", "dog", "banana"]
                                                     =====                  ========
                                                       ^                        ^
                                                       i                        j
```

后面的步骤省略。上面的例子你总共能找到两个 local optimal window，比较一下就能知道 best window 是 `(5, 8)`。

hash table 的作用在于 track keywords 的 coverage。如果 keywords 是 distinct 的，那我么用个 hash set 就可以了。但这个题目里，一个关键字可以出现多次，对应地 window 也要 cover 它多次，这时就需要上一个 `Counter`。但这都是小问题，核心是 sliding elastic window

### 1.1 Distinct Keywords

先看简单的情况：keyword 都是 distinct 的。从我个人的水准来看，"描述 window 的行为" 比 "描述 iterate through text 的操作" 要复杂，缺点很多：

- 满屏的 `self` 看起来头疼
- `while` 的终止条件有点繁，还需要 `break`
- 不好 debug

```python
class Window:
    def __init__(self, keywords):
        self.keywords = keywords
        self.targets = keywords.copy()  # 不 copy 的话会指向同一个 set
        self.left = 0
        self.right = 0
        self.best = (0, 0)
        
    def expand(self, text):
        while self.right < len(text):
            if text[self.right] in self.targets:
                self.targets.remove(text[self.right])
                if not self.targets:
                    break
            self.right += 1
        
        if self.best == (0, 0) and self.targets:  # some keyword not covered even when `right` reached the end of text
            raise ValueError("text does not contain all keywords")
            
    def contract(self, text):    
        while self.left < self.right and self.right < len(text):
            if text[self.left] in self.keywords:
                if self.best == (0, 0) or self.best[1] - self.best[0] > self.right - self.left:
                    self.best = (self.left, self.right)

                self.targets.add(text[self.left])
                self.left += 1
                break
            else:
                self.left += 1
        
def find_smallest_window(text, keywords):
    window = Window(set(keywords))
    
    while window.right < len(text):
        window.expand(text)
        window.contract(text)
    
    return window.best

text = ["apple", "banana", "apple", "apple", "dog", "cat", "apple", "dog", "banana"]
keywords = ["banana", "cat"]

find_smallest_window(text, keywords)
# Output: (5, 8)
```

"描述 iterate through text 的操作" 就是另外一种写法了：

```python
class Coverage:
    def __init__(self, keywords):
        self.keywords = set(keywords)
        self.targets = self.keywords.copy()
        self.n_remain = len(self.targets)
        
    def increase(self, word):
        if word in self.targets:
            self.targets.remove(word)
            self.n_remain -= 1
    
    def decrease(self, word):
        if word in self.keywords:
            self.targets.add(word)
            self.n_remain += 1
            
    def is_full(self):
        return self.n_remain == 0
    
def find_smallest_window(text, keywords):
    coverage = Coverage(keywords)
    
    left, window = 0, (-1, -1)
    for right, word in enumerate(text):
        coverage.increase(word)
        
        while coverage.is_full():
            if window == (-1, -1) or window[1] - window[0] > right - left:
                window = (left, right)
                
            coverage.decrease(text[left])
            left += 1
    
    return window

text = ["apple", "banana", "apple", "apple", "dog", "cat", "apple", "dog", "banana"]
keywords = ["banana", "cat"]

find_smallest_window(text, keywords)
# Output: (5, 8)
```

我这里提取了一个 `Coverage` 类，看起来比 _EPI in Python_ 书上的解法要稍微清爽一点

### 1.2 Non-distinct Keywords

我提取这个 `Coverage` 类的目的就是为了可以应付这个情况。这里我们 `find_smallest_window` 可以不动，修改 `Coverage` 就可以了：

```python
from collections import Counter

class Coverage:
    def __init__(self, keywords):
        self.keywords = set(keywords)
        self.targets = Counter(keywords)
        self.n_remain = len(keywords)  # 用 len(self.keyword) 不好处理 counter 出现负数的情况
        
    def increase(self, word):
        if word in self.targets:
            # 可能出现 keywords 只要求 n 次，但 text 出现了 > n 的情况
            # 此时 counter 可能出现负数，表示我们 covered more than required，有余裕
            self.targets[word] -= 1
            if self.targets[word] >= 0:  
                self.n_remain -= 1
    
    def decrease(self, word):
        if word in self.keywords:
            # counter 若出现负数，表示有余裕，可以把多 cover 的部分先霍霍一点
            if self.targets[word] >= 0:
                self.n_remain += 1
            self.targets[word] += 1
            
    def is_full(self):
        return self.n_remain == 0

# find_smallest_window() 函数不变

text = ["apple", "banana", "apple", "apple", "dog", "cat", "apple", "dog", "banana"]
keywords = ["apple", "apple", "dog"]

find_smallest_window(text, keywords)
# Output: (2, 4)
```

## 2. The "Longest Substring Without Repeating Characters" Problem

[Leetcode 3, Medium](https://leetcode.com/problems/longest-substring-without-repeating-characters/). 返回 length 就可以了。

```python
def len_of_longest_distinct_substring(s):
    char_set = set()
    
    left, right, longest = 0, 0, 0
    while right < len(s):
        if s[right] not in char_set:
            char_set.add(s[right])
            right += 1
        else:
            char_set.remove(s[left])
            left += 1
            
        longest = max(longest, right - left)
            
    return longest

for s in ["abcabcbb", "bbbbb", "pwwkew", " ", "au"]:
    print(len_of_longest_distinct_substring(s))

# Output: 3 1 3 1 2
```

注意这题的 `longest` 应该每个 loop 都算一次，而不是放到 `if` 里面，否则对一个 distinct 的 string，`right` 一直往右直到 `while` 退出，longest 也更新不了一次。

## 3. The "Max Consecutive Ones" Problems

Max Consecutive Ones II 是 _Leetcode 487_，竟然是 locked。参考 [Max Consecutive Ones II (leetcode 487)](https://eugenejw.github.io/2017/08/leetcode-487)。

Max Consecutive Ones III 是 [Leetcode 1004, medium](https://leetcode.com/problems/max-consecutive-ones-iii/).

只 flip 一次可以用一个 boolean 标志位：

```python
def find_max_consecutive_ones(nums):
    flipped_once = False
    
    left, right, longest = 0, 0, 0
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
            
        longest = max(longest, right - left)
            
    return longest

find_max_consecutive_ones([1, 0, 1, 1, 0])
# Output: 4
```

允许 flip $k$ 次的话可以用一个计数器：

```python
def find_max_consecutive_ones(nums, k):
    n_flipped_zeros = 0
    
    left, right, longest = 0, 0, 0
    while right < len(nums):
        if nums[right] == 1:
            right += 1
        elif n_flipped_zeros < k:
            n_flipped_zeros += 1
            right += 1
        else:
            if nums[left] == 0:
                n_flipped_zeros -= 1
            left += 1
            
        longest = max(longest, right - left)
            
    return longest

find_max_consecutive_ones([1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2)
# Output: 6
```

你如果硬要按 "Minimum Window Substring" 的那个风格写也可以：

```python
def find_max_consecutive_ones(nums, k):
    n_flipped_zeros = 0
    
    left, longest = 0, 0
    for right, num in enumerate(nums):
        if num == 0:
            n_flipped_zeros += 1
            
        while n_flipped_zeros > k:  # ANCHOR 1
            if nums[left] == 0:
                n_flipped_zeros -= 1
            left += 1
            
        longest = max(longest, right - left + 1)  # ANCHOR 2
            
    return longest

find_max_consecutive_ones([1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2)
# Output: 6
```

需要注意边界的判定和长度的计算稍微有点不同。以这两种风格应该是等价的，看你喜欢哪种。

## 4. The "Subarray Sum Equals $K$" Problem

[Leetcode 560, medium](https://leetcode.com/problems/subarray-sum-equals-k/)，注意它要求返回的是 window 的数量。

这题其实是个反面教材，因为它并不适合用 sliding elastic window 来解。适合用这方法来解的题目都有一个特点：

- 往右边 expand 的时候是一个 sum、count、coverage $\sum_{i+1} \geq \sum_{i}$ 的趋势
- 在左边 contract 的时候是一个 $\sum_{i-1} \leq \sum_{i}$ 的趋势

但这题不是。你往右 expand 做 `sum += nums[right]` 并不能保证 `sum` 会增加，左手 contract 做 `sum -= nums[left]` 也并不能保证 `sum` 会减少。如果我们规定 `nums` array 都是非负数也许还有救。此外还有小细节比如 $k = 0$ 的时候，你 contract 到 `left == right` 的时候并不算一个合法的 subarray。总之写起来很麻烦。

虽然是题外话，这题的解法是一个很巧妙的 hash map 的 trick。参考 [560. Subarray Sum Equals K](https://leetcode.com/articles/subarray-sum-equals-k/)，以下面的输入为例：

- `nums = [3, 4, 7, 2, -3, 1, 4, 2]`
- `k = 7`

只需要用一个指针 `i`，考虑 `i` 之前的 running sum：

- 初始一定会有 `running_sum == 0`
- 比如 `i == 2`、`nums[i] == 7` 时，出现过的 `running_sum` 有 `[0, 3, 7, 14]`
- 如果前后两次 `running_sum` 的差值 `== k`，说明这两个位置之间一定一个 subarray 的 sum 是 `k`
    - 比如上面就有 `7 - 0 == 7` 和 `14 - 7 == 7`，对应两个 subarray
- 然后相同的 `running_sum` 还要考虑次数，比如 `[0, 3, 4, 7]` 的 `running_sum` 就应该是 `[0, 0, 3, 7, 14]`，`0` 出现了两次，对应地 `[0, 3, 4]` 和 `[3, 4]` 都算是 solution
    - 所以用一个 `<running_sum, n_occurrence>` 的 hash map 来做

```python
def num_of_subarrays(nums, k):
    sum_occurrence = dict()  # <running_sum, n_occurrence>
    subarray_cnt = 0
    
    running_sum = 0
    sum_occurrence.update({0:1})
    for num in nums:
        running_sum += num
        
        if running_sum - k in sum_occurrence:
            subarray_cnt += sum_occurrence[running_sum - k]
        
        sum_occurrence.setdefault(running_sum, 0)
        sum_occurrence[running_sum] += 1
            
    return subarray_cnt

num_of_subarrays([-1, -1, 1], 0)
# Output: 1
```

用 `defaultdict(lambda: 0)` 可以省略对 `setdefault()` 的调用

## 5. The "Minimum Size Subarray Sum" Problem

[Leetcode 209, medium](https://leetcode.com/problems/minimum-size-subarray-sum/)，这题就可以用 sliding elastic window 了，因为它限定了 array 都是正整数

```python
def len_of_min_subarray(nums, k):
    left, running_sum = 0, 0
    shortest = len(nums) + 1
    for right, num in enumerate(nums):
        running_sum += num
        
        while running_sum >= k:
            running_sum -= nums[left]
            left += 1
        
            shortest = min(shortest, right - left + 2)
        
    return shortest if shortest <= len(nums) else 0

len_of_min_subarray([1,2,3,4,5], 11)
# Output: 3
```