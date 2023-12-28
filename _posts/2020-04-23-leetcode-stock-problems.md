---
category: LeetCode
description: ''
tags: []
title: 'LeetCode: Stock Problems'
toc: true
toc_sticky: true
---

## 0. 文字游戏

Stock 系列的问题啊，边界条件是有点烦的。它烦不是因为它复杂，而是它本来很简单，但会让你往复杂的方向去想，所以还是那一条，面试的时候要有 clarify 的能力。

我们来看下 Stock 系列问题玩了哪些文字游戏，有哪些 implication

### 0.1 Stock I 的 "at most 1 transaction"

上来这个 "at most" 就有点 intimidating：啥意思？不做 transaction 的收益肯定为 0；如果一定要做一个 transaction，收益可能为负 (比如大盘一直跌)？难道我要把不做 transaction 当一个特殊情况处理下？

其实没有必要。因为题目**没有说不能做 void transaction (当天买当天卖)**，虽然看上去没有意义，但这个 void transaction 也算是一个 transaction 啊，所以 Stock I 的意思相当于：一定要做一次 transaction (void transaction 也算) 时的最大收益

### 0.2 Stock II 的 "you must sell the stock before you buy again"

这个先后顺序没问题。但关键的细节在于：如果我在某一天 sell 了，我能在同一天再 buy 么？还是要等到第二天才能 buy？

答案是允许在同一天先 sell 再原价 buy。注意这不是 void transaction，这是 void sale

允许 void sale 是 Stock II 能用 Greedy 解的关键

我们再回头看看 "You may not engage in multiple transactions at the same time" 是啥意思：

- 有买有卖才构成一个 transaction
- 两个 transaction 一定是 $buy_1, sell_1, buy_2, sell_2$ 这样的顺序，不能出现 $buy_1, buy_2, \dots$ 这样的
  - void transaction 即是 $buy_i$ 和 $sell_i$ 发生在同一天
  - void sale 即是 $sell_i$ 和 $buy_{i+1}$ 发生在同一天

## 1. LeetCode #121: Stock I

以下搬运自 [LeetCode: Min Sub and Max Sub Problems](http://yaoyao.codes/leetcode/2020/02/21/leetcode-maxsub-minsub-problems#141-举例leetcode-121-stock-i)

### 1.1 at most 1 transaction

原题是 [LeetCode #121, Easy](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/)：一个交易窗口 (array) 包括多个交易日，我们要找一买一卖能获得的最大利润。

### 1.2 解法是 DP / max sub

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

## 2. LeetCode #122: Stock II

### 2.1 as many transactions as you like

原题是 [LeetCode #122](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/)

结合第 0 节的解释，它是既允许 void transaction 又允许 void sale 的

### 2.2 解法是 Greedy

因为允许 void sale，所以 Greedy 是可行的。考虑这么两个情况：

```
         |
      |  |
      |  |
|  |  |  |
-----------> day
0  1  2  3
```

对于这种大盘一直升的情况，因为允许 void sale，所以我们做多个小 transactions ($[0, 2] + [2, 3]$) 和只做一个大 transaction $[0, 3]$ 的效果是一样的。

```
         |
   |     |
   |  |  |
|  |  |  |
-----------> day
0  1  2  3
```

对这种有升有降的，做多个小 transaction 的优势就更明显了，所有的盈利我们都能抓住。

所以这题的思路说起来超级简单 (根本没 DP 什么事儿)：如果有 `price[i] > price[i-1]`，那这个差价就是我们的盈利；把所有的正的差价加起来就是我们的总盈利；总盈利必定最大。

```python
def max_profit(prices):
    max_profit = 0
    
    for i in range(1, len(prices)):
        if prices[i] > prices[i-1]:
            max_profit += prices[i] - prices[i-1]

    return max_profit

max_profit([7, 1, 5, 3, 6, 4])
# Output: 7
```

pythonic 一点的话：

```python
def max_profit(prices):
    return sum(prices[i] - prices[i-1] for i in range(1, len(prices)) if prices[i] > prices[i-1])
```

## 3. LeetCode #123: Stock III

### 3.1 at most 2 transactions

原题是 [LeetCode #123, Hard](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/)

结合第 0 节的解释，你应该能明白这个 "at most 2 transactions" 是啥意思了：

- 允许 void transaction，所以可以出现 $[i, i] + [i, j]$ 这样的两个 transaction，虽然他们实质是一个 transaction
- 允许 void sale，所以可以出现 $[i, j] + [j, k]$ 这样的两个 transaction，虽然他们实质是一个 transaction

这题才是 Stock I 的正统扩展；Stock II 只要你搞清楚了它的文字游戏，那感觉就是来搞笑的

### 3.2 解法是 DP，要点是充分利用 `subs`

我们考虑 Stock I 里 (滚动更新的) `max_profit`，即认为 `subs[i]` 是交易窗口 $[0, i]$ 内的最大收益。现在有两个 transactions，所以需要两个这样的 `subs`：

- `t1_subs[i]`：(第一次交易) 在交易窗口 $[0, i]$ 内的最大收益
- `t2_subs[i]`：(第二次交易) 在交易窗口 $[i, n-1]$ 内的最大收益
- 换言之 `t1_subs[i] + t2_subs[i]` 即是：以第 $i$ 天为切割点时，两次 transaction 的最大收益

我们具体看一下怎么实施：

- 对 `t1_subs`，可以照搬 Stock I 的做法
- 但对 `t2_subs`，需要一点**逆向思维**，即从 $i = n-1$ 开始，逆序 iterate 到 $i = 0$
- 注意这两个 iteration 之间的微妙的不同：
  - `t1_subs` 你顺序从 $i = 0$ iterate 到 $i = n-1$，你 hold 住的是当前的 min buying price，进来的 `prices[i]` 是当天的新的 selling price
  - `t1_subs` 你逆序从 $i = n-1$ iterate 到 $i = 0$，你 hold 住的是当前的 max selling price，进来的 `prices[i]` 是当天的是新的 buying price

下面这个分了三个函数的写法是为了方便你理解，精简一点 (比如不保存全部的 `p2_subs`) 写成到一个函数里也是可以的：

```python
def max_t1_profits(prices):
    max_profit = 0
    min_buy_price = prices[0]  # min buying price
    
    periodic_max_profits = [0] * len(prices)
    
    for i, today_price in enumerate(prices):
        # Caution: price_today is the new selling price
        today_profit = today_price - min_buy_price
        
        max_profit = max(max_profit, today_profit)
        periodic_max_profits[i] = max_profit
        
        min_buy_price = min(min_buy_price, today_price)
        
    return periodic_max_profits

def max_t2_profits(prices):
    max_profit = 0
    max_sell_price = prices[-1]  # max selling price
    
    periodic_max_profits = [0] * len(prices)
    
    for i, today_price in enumerate(reversed(prices)):
        # Caution: price_today is the new buying price
        today_profit = max_sell_price - today_price
        
        max_profit = max(max_profit, today_profit)
        periodic_max_profits[i] = max_profit
        
        max_sell_price = max(max_sell_price, today_price)
        
    return list(reversed(periodic_max_profits))

def max_profit_of_two_txn(prices):
    t1_profits = max_t1_profits(prices)
    t2_profits = max_t2_profits(prices)
    
    two_txn_profits = [sum(profits) for profits in zip(t1_profits, t2_profits)]
    
    print("max t1 profits    = {}".format(t1_profits))
    print("max t2 profits    = {}".format(t2_profits))
    print("max 2-txn profits = {}".format(two_txn_profits))
    
    return max(two_txn_profits)

max_profit_of_two_txn([310, 315, 275, 295, 260, 270, 290, 230, 255, 250])
# Output: 55
# Print: 
    # max t1 profits    = [0, 5, 5, 20, 20, 20, 30, 30, 30, 30]
    # max t2 profits    = [30, 30, 30, 30, 30, 25, 25, 25, 0, 0]
    # max 2-txn profits = [30, 35, 35, 50, 50, 45, 55, 55, 30, 30]
```

## 4. LeetCode #188: Stock IV

### 4.1 at most $k$ transactions

原题是 [LeetCode #188, Hard](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/)

### 4.2 这题需要跳出 max sub 的 1-D DP 的思路，向 2-D DP 迈进

虽然这题当 $k$ 足够大的时候 (具体多大见 4.5 节的讨论) 会退化成 Stock II，但这题的 general 的解法要靠传统的 2-D DP，max sub 的 1-D 思路已经不适合了 

考虑 `memo[i][j]`，表示 "在交易窗口 $[0, i]$ 内做 $j$ 次 transaction 的最大收益":

- 那么最后的返回值即是 `memo[n-1][k]`
- 所有的 `memo[:][0] = 0`，表示不做 transaction 就不会有收益
- 所有的 `memo[0][:] = 0`，表示在交易窗口 $[0, 0]$ 内不可能会有收益

考虑 `memo[i][j]` 的递推关系，它可能的值有：

1. `memo[i][j-1] + prices[i] - prices[i]`，表示做 $\underbrace{[0, i]}\_\text{at most j-1 txns} + \underbrace{[i, i]}\_\text{extra 1 txn}$ 这样的 transaction 组合
2. `memo[i-1][j-1] + prices[i] - prices[i-1]`，表示做 $\underbrace{[0, i-1]}\_\text{at most j-1 txns} + \underbrace{[i-1, i]}\_\text{extra 1 txn}$ 这样的 transaction 组合
3. `memo[i-2][j-1] + prices[i] - prices[i-2]`，表示做 $\underbrace{[0, i-2]}\_\text{at most j-1 txns} + \underbrace{[i-2, i]}\_\text{extra 1 txn}$ 这样的 transaction 组合
4. 依此类推
5. `memo[0][j-1] + prices[i] - prices[0]`，表示做 $\underbrace{[0, 0]}\_\text{at most j-1 txns} + \underbrace{[0, i]}\_\text{extra 1 txn}$ 这样的 transaction 组合
6. 注意还要一个可能的值不要漏掉了，那就是 `memo[i-1][j]`，它其实包括了 `memo[i-d][j] for d in range(i)` 这一系列的值，但明显这个系列最大的就是 `memo[i-1][j]`，它表示做 $\underbrace{[0, i-1]}\_\text{at most j txns} + \underbrace{[i-1, i]}\_\text{do nothing}$ 这样的 transaction 组合

下文为了区分，我们把 `meme[i-d][j-1] + prices[i] - prices[i-d]` 这一组 candidates 称为 extra-txn candidates，而 `memo[i-1][j]` 称为 no-extra candidate

### 4.3 DP (top-down) 以及它的性能问题

```python
def max_profit(prices, k):
    if not prices:
        return 0

    n = len(prices)
    
    # reduce to the Stock II problem
    # See Section 4.5 for discussion
    if k >= n / 2:
        return sum(prices[i] - prices[i-1] for i in range(1, n) if prices[i] > prices[i-1])
    
    # memo[i][j] is the max profit made in trade window [0, i]
    # with at most j transactions
    memo = [[None] * (k+1) for _ in prices]
    
    # no profit can be made with zero transaction
    for i in range(n):
        memo[i][0] = 0
    
    # no profit can be made in trade window [0, 0]
    for j in range(k+1):
        memo[0][j] = 0
        
    def max_profit_helper(i, j):
        if memo[i][j] is None:
            candidates = [max_profit_helper(i-d, j-1) + prices[i] - prices[i-d] for d in range(i+1)]
            candidates += [max_profit_helper(i-1, j)]
            memo[i][j] = max(candidates)
            
        return memo[i][j]

    return max_profit_helper(n-1, k)
```

这个 DP (top-down) 的性能是有缺陷的，LeetCode 上会 TLE (Time Limit Exceeded)。主要问题在这个 `max(candidates)` 的操作上，因为重复计算的部分太多了。考虑 `memo[i][j]` 的两个 candidates：

- `memo[i-1][j-1]`
- `memo[i-2][j-1]`

```python
candidates_of_memo[i-1][j-1] => 
    - memo[i-2][j-2] + prices[i-1] - prices[i-2],
    - memo[i-3][j-2] + prices[i-1] - prices[i-3],  # ⭐
    - ...,                                         # ⭐
    - memo[0][j-2] + prices[i-1] - prices[0]       # ⭐
    - memo[i-2][j-1]

candidates_of_memo[i-2][j-1] => 
    - memo[i-3][j-2] + prices[i-1] - prices[i-3],  # ⭐
    - ...,                                         # ⭐
    - memo[0][j-2] + prices[i-1] - prices[0]       # ⭐
    - memo[i-3][j-1]]
```

打星号的部分，也就是 extra-txn candidates 可以用一个滚动更新保存当前的 max，避免重复计算。所以这题用 DP (buttom-up) 是更好的选择

### 4.4 DP (buttom-up)

但是换到 buttom-up 之后，这个滚动更新并没有看上去那么简单。考虑下面代码里的双层循环：

- 当 `i = 1` 时，`memo[1][j]` 的 extra-txn candidates 是：
  - `memo[0][j-1] + prices[1] - prices[0]`
- 当 `i = 2` 时，`memo[2][j]` 的 extra-txn candidates 是：
  - `memo[0][j-1] + prices[2] - prices[0]`
  - `memo[1][j-1] + prices[2] - prices[1]`

可见你应该滚动更新的是 `max(memo[i-1][j-1] - prices[i-1])`，而 `+ prices[i]` 这个值不应该放到滚动更新 max 之中

另外一个主意的点是：改成 buttom-up 之后，`memo` 没有必要初始化为 `None` 了，`memo[i][0]` 和 `memo[0][j]` 的初始化也可以免了

```python
def max_profit(prices, k):
    if not prices:
        return 0

    n = len(prices)
    
    # reduce to the Stock II problem
    # See Section 4.5 for discussion
    if k >= n / 2:
        return sum(prices[i] - prices[i-1] for i in range(1, n) if prices[i] > prices[i-1])
    
    # memo[i][j] is the max profit made in trade window [0, i]
    # with at most j transactions
    memo = [[0] * (k+1) for _ in prices]
        
    for j in range(1, k+1):
        max_balance_after_extra_purchase = float("-inf")
        for i in range(1, n):
            # extra-txn candidates
            max_balance_after_extra_purchase = max(max_balance_after_extra_purchase, memo[i-1][j-1] - prices[i-1])
            profit_with_extra_txn = max_balance_after_extra_purchase + prices[i]
            
            # no-extra candidate
            profit_wo_extra_txn = memo[i-1][j]
            
            memo[i][j] = max(profit_with_extra_txn, profit_wo_extra_txn)

    return memo[n-1][k]
```

### 4.5 讨论：何时才是 reduce 成 Stock II？

也许你第一反应是 `k >= n - 1` 的时候 Stock IV 会 reduce 成 Stock II，但其实这个条件可以放宽到 `k >= n / 2`

根据 Stock II 的逻辑，如果一个交易窗口 $[0, n-1]$ 大盘一直涨，那么它可以拆成 $n$ 个 $[i, i+1]$ 的小窗口，把这 $n-1$ 段的收益累加起来即可。但要注意，此时并不需要你有 $k \geq n - 1$ 才能这么算，而且这种大盘实际只需要 $k=1$ 就能这么算，因为这种大盘下的 $n-1$ 个 transaction 实质等同于一个大 transaction

如果把相邻的上涨窗口看做一个整体的上涨窗口，那你会发现，$[0, n-1]$ 内**至多**只可能有 $\lceil \frac{n-1}{2} \rceil = \lfloor \frac{n}{2} \rfloor$ 个独立的上涨窗口 (比如一升一降一直循环)，所以只需要有 $k \geq \lfloor \frac{n}{2} \rfloor$ 就能 cover 所有的独立上涨窗口

## 5. LeetCode #309: Stock with Cooldown

### 5.1 as many transactions as you like

原题是 [LeetCode #309, medium](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/)

虽然题目没有说，但从例子来看，**这题是不允许 void sale 的**，换言之，如果你在第 $i$ 天卖出，是不能再同一天买入的，而且第 $i+1$ 天强制 cooldown，必须到第 $i+2$ 天才能买入

### 5.2 受状态机启发的、使用 $O(3n)$ space 的 DP (buttom-up)

注意这题和前面所有的问题都不同的一点在于 "不允许 void sale"，所以**每一天都能赋予一个唯一的状态：BOUGHT、SOLD 或者 CD**

- 如果买入后一直没有卖，这种 "没有卖" 的状态也是 BOUGHT
- 如果卖出后一直没有买，这种 "没有买" 的状态也是 CD

为此我们可以建 3 个 $O(n)$ 的 `memo`：

- $S_{\text{bought}}[i]$: 在交易窗口 $[0, i]$ 内以 BOUGHT 状态结束的最大收益
- $S_{\text{sold}}[i]$: 在交易窗口 $[0, i]$ 内以 SOLD 状态结束的最大收益
- $S_{\text{cd}}[i]$: 在交易窗口 $[0, i]$ 内以 CD 状态结束的最大收益

更新规则：

$$
\begin{aligned}
S_{\text{bought}}[i] &= max \left\{
\begin{array}{ll}
      S_{\text{cd}}[i - 1] - \operatorname{prices}[i] & \text{(purchase on day i)} \newline
      S_{\text{bought}}[i-1] & \text{(do nothing after previous purchase)}
\end{array} 
\right. \newline

S_{\text{sold}}[i] &= S_{\text{bought}}[i-1] + \operatorname{prices}[i] \newline

S_{\text{cd}}[i] &= max \left\{
\begin{array}{ll}
      S_{\text{sold}}[i - 1] & \text{(mandatory CD after the sale)} \newline
      S_{\text{cd}}[i-1] & \text{(do nothing)}
\end{array} 
\right.
\end{aligned}
$$

```python
def max_profit_with_cd(prices):
    if not prices:
        return 0

    n = len(prices)

    bought = [0] * n
    sold = [0] * n
    cd = [0] * n

    bought[0] = - prices[0]
    # sold[0] = 0
    # cd[0] = 0

    for i in range(1, n):
        bought[i] = max(cd[i-1] - prices[i], bought[i-1])
        sold[i] = bought[i-1] + prices[i]
        cd[i] = max(sold[i-1], cd[i-1])

    return max(sold[n-1], cd[n-1])
```

## 6. LeetCode #714: Stock with Transaction Fee

### 6.1 as many transactions as you like

原题是 [LeetCode #714, Medium](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/)

这题看上去又回到了 Stock I、II、III、IV 的节奏，即允许 void transaction 和 void sale

### 6.2 受状态机启发的、使用 $O(2n)$ space 的 DP (buttom-up)

注意这题虽然允许了 void transaction 和 void sale，但明显 void transaction 和 void sale 是不划算的，因为现在有 transaction fee 了。所以这题饶了一圈又回到了 Stock with CD 的情形，即**每一天都能赋予一个唯一的状态**，只是这里只需要两个 states：

- BOUGHT: 如果买入了，包括一直没有卖出的都算是 BOUGHT 状态
- SOLD: 如果卖出了，包括一直没有买入的都算是 SOLD 状态

为此我们可以建 2 个 $O(n)$ 的 `memo`：

- $S_{\text{bought}}[i]$: 在交易窗口 $[0, i]$ 内以 BOUGHT 状态结束的最大收益
- $S_{\text{sold}}[i]$: 在交易窗口 $[0, i]$ 内以 SOLD 状态结束的最大收益

这题有个很有意思的地方在于：**你可以限定是在 BOUGHT 时扣 transaction fee 还是在 SOLD 时扣 transaction fee**

在 BOUGHT 时扣 transaction fee 的更新规则：

$$
\begin{aligned}
S_{\text{bought}}[i] &= max \left\{
\begin{array}{ll}
      S_{\text{sold}}[i - 1] - prices[i] - fee & \text{(purchase on day i)} \newline
      S_{\text{bought}}[i-1] & \text{(do nothing after previous purchase)}
\end{array} 
\right. \newline

S_{\text{sold}}[i] &= max \left\{
\begin{array}{ll}
      S_{\text{bought}}[i - 1] + prices[i] & \text{(sell on day i)} \newline
      S_{\text{sold}}[i-1] & \text{(do nothing after previous sale)}
\end{array} 
\right.
\end{aligned}
$$

在 SOLD 时扣 transaction fee 的更新规则：

$$
\begin{aligned}
S_{\text{bought}}[i] &= max \left\{
\begin{array}{ll}
      S_{\text{sold}}[i - 1] - prices[i] & \text{(purchase on day i)} \newline
      S_{\text{bought}}[i-1] & \text{(do nothing after previous purchase)}
\end{array} 
\right. \newline

S_{\text{sold}}[i] &= max \left\{
\begin{array}{ll}
      S_{\text{bought}}[i - 1] + prices[i] - fee & \text{(sell on day i)} \newline
      S_{\text{sold}}[i-1] & \text{(do nothing after previous sale)}
\end{array} 
\right.
\end{aligned}
$$

对应可以有两种实现：

```python
# 在 BOUGHT 时扣 transaction fee
def max_profit_with_fees(prices, fee):
    if not prices:
        return 0

    n = len(prices)

    bought = [0] * n
    sold = [0] * n

    bought[0] = - prices[0] - fee
    # sold[0] = 0

    for i in range(1, n):
        bought[i] = max(bought[i-1], sold[i-1] - prices[i] - fee)
        sold[i] = max(sold[i-1], bought[i-1] + prices[i])

    return sold[n-1]
```

```python
# 在 SOLD 时扣 transaction fee
def max_profit_with_fees(prices, fee):
    if not prices:
        return 0

    n = len(prices)

    bought = [0] * n
    sold = [0] * n

    bought[0] = - prices[0]
    # sold[0] = 0

    for i in range(1, n):
        bought[i] = max(bought[i-1], sold[i-1] - prices[i])
        sold[i] = max(sold[i-1], bought[i-1] + prices[i] - fee)

    return sold[n-1]
```