---
layout: post
title: "SICP: Recursion vs Iteration"
description: ""
category: SICP
tags: []
---
{% include JB/setup %}

SICP 的 _Section 1.2.1 Linear Recursion and Iteration_ 着重强调了 "无论是 recursive process 还是 iterative process，写出来都是 recursive procedure"，但其实只需要稍微归纳一下，"procedure vs process" 与 "recursion vs iteration" 这两组的交叉关系就能很明了。我觉得 SICP 没有大胆下结论是因为：

- iteration 这个词的语义也是 overloaded
- 各语言的实现方式不同。同样的逻辑，Lisp 实现出来是 iteration，但 C 语言实现出来可能就是 recursion

我们这里分不同的 context 来讨论 Recursion vs Iteration 这个问题。

## ToC

- [狭义地说，Linear Iteration 是 Linear Recursion 的特殊情况](#狭义地说linear-iteration-是-linear-recursion-的特殊情况)
- [Non-linear 的情况？](#non-linear-的情况)
- [Tail Recursion / Tail Call](#tail-recursion--tail-call)
- [Procedure vs Process](#procedure-vs-process)
- [`for`-loop / 不同语言对 Iteration 的实现 / Tail Call Optimization](#for-loop--不同语言对-iteration-的实现--tail-call-optimization)
- [LeetCode 答题技巧：Recursion](#leetcode-答题技巧recursion)
  - [CASE 1: 如何改写成 tail recursion?](#case-1-如何改写成-tail-recursion)
  - [CASE 2: `while stack:` 模拟 call stack](#case-2-while-stack-模拟-call-stack)
- [LeetCode 答题技巧：Dynamic Programming](#leetcode-答题技巧dynamic-programming)

## 狭义地说，Linear Iteration 是 Linear Recursion 的特殊情况

先看这两个词的 general 的定义：

- recursion: the repeated application of a recursive procedure
- iteration: repetition of a procedure applied to the result of a previous application

这里就隐约能看出 iteration 是一种特殊的 recursion。

那在 SICP 里讨论这个问题的 context 就是：

- 前提：Scheme 这门语言是 applicative-order evaluation
  - 这一点其实直接影响 linear recursion 的展开
- procedure $f(n)$ 必须要 somehow "依赖于" $f(n-1)$
  - 这一点很好理解，比如像 `for i in range(10): print(i)` 这种也叫 iteration，但是 `print(1)` 和 `print(2)` 之间没有啥联系，这样的 procedure 就不找我们讨论的范围内

我们用数学的形式来描述。linear recursion 展开应该是这样的形式：

$$
f(n) = g(f(n-1)) = g \big( g(f(n-2)) \big) = ... = g \big[ g... \big( g(f(1)) \big)\big]
$$

比方说有 $g(x) = 2x$，那么：

$$
\begin{aligned}
f(n) &= 2 \times f(n-1) \newline
     &= 4 \times f(n-2) \newline
     &= \cdots \newline 
     &= 2^{n-1} \times f(1)
\end{aligned}
$$

如果令 $f(1) = 2$，那么 $f(n)$ 就是个求 $2^n$ 的 linearly recursive procedure。

我们说 linear iteration 是 linear recursion 的特殊情况，特殊在：

1. $g = I$ (identity funciton)
2. $f(n)$ 需要扩展成 $f(\alpha^{(1)}, \beta^{(1)}, \dots, n)$ where $\alpha^{(1)}, \beta^{(1)}, \dots$ are **state variables** (or **running results**)

这里需要把 $f(\alpha, \beta, \dots, n)$ 中的 $n$ 类比成 java 的 `CountDownLatch`:

- $(\alpha^{(1)}, \beta^{(1)}, \dots, n=n)$ 是初始状态
- 持续更新：
  - $\alpha^{(i+1)} \gets \operatorname{foo}(\alpha^{(i)})$
  - $\beta^{(i+1)} \gets \operatorname{bar}(\beta^{(i)})$
  - $\dots$
  - $n \gets n-1$
- $n$ 减到 1 的时候停止，得到 ($\alpha^{(n)}, \beta^{(n)}, \dots, n=1)$，最终 $f(n)$ 的值是 state variables 的表达式

比如还是上面 $f(n) = 2^n$ 的逻辑 (严谨一点，令 $n \in \mathbb{Z}_{+}$)，用 linear iteration 写就是：

```python
def f(n):
    def _f(result, n):
        if n == 1:
            return result
        
        return _f(2*result, n-1)

    return _f(2, n)
```

数学展开就是：

$$
\begin{aligned}
\_f(2, n) &= \_f(4, n-1) \newline
          &= \_f(8, n-2) \newline
          &= \cdots \newline 
          &= \_f(2^n, 1)
\end{aligned}
$$

这种 iteration 的写法思路属于 CPS, Continuation-Passing Style, 但 CPS 的标准形式比这个要复杂，可以参考 [Can all iterative algorithms be modelled recursively and vice-versa?](https://www.quora.com/Can-all-iterative-algorithms-be-modelled-recursively-and-vice-versa/answer/Anders-Kaseorg)

## Non-linear 的情况？

我能想到的有两种：logarithmical recursion 与 tree recursion.

logarithmical recursion 比较好理解，类似 $f(n) = g(f(\frac{n}{2}))$ 这样的；这种情况还是能写出对应的 logarithmical iteration 的，比如 $f(\alpha^{(1)}, \cdots, n) = f(\alpha^{(2)}, \cdots, \frac{n}{2})$

tree recursion 的情况比较复杂，会涉及到多个 $g$，得到 $f(n) = g_{1}(f(n_{1})) \circ g_{2}(f(n_{2})) \circ \cdots \circ g_{m}(f(n_{m}))$ 这样的形式，比如 Fibonacci 的这种写法：$f(n) = f(n-1) + f(n-2)$:

```text
                fib(4)
              ____||____
             /          \
        fib(3)          fib(2)
         /  \            /  \     
    fib(2)  fib(1)  fib(1)  fib(0)
     /  \ 
fib(1)  fib(0)
```

它也可以改写成 iteration，但是是 linear iteration:

```scheme
(define (fib n)
    (define (fib-iter a b n) ; suppose f(i+1) = a; f(i) = b
        (if (= n 0)
            b
            (fib-iter (+ a b) a (- n 1))
        )
    )
    (fib-iter 1 0 n)
)
```

- 虽然 LeetCode 中会有 "用 `while stack: # 模拟 call stack 运行`" 来改写 tree recursion 的技术，但那些 tree recursion 的目的在于 function 的 side effect 而不是 return value，故这里先不讨论。

讨论完这两种情况，我们会有一个更深层次的问题，就是：任意的 recursion 都能改写成 iteration 吗？这个问题涉及到 Church–Turing Thesis，我们这里不讨论；但大体可以认为：任意的 recursion 都能改写成 iteration.

## Tail Recursion / Tail Call

Scheme 里 tail recursion 等价于 iteration。tail 的意思是：

- $f(n)$ 的值等于 the last (i.e. tailing) recursive call, e.g. $f(1)$ 的值

linear iteration $f(\alpha^{(1)}, \beta^{(1)}, \dots, n) = \dots = f(\alpha^{(n)}, \beta^{(n)}, \dots, 1)$ 符合 tail recursion，但 tail recursion 不仅限于 linear iteration 这么一种形式。

一般的 linear recursion 最后会得到一个很长的 chain: $g \big[ g... \big( g(f(1)) \big)\big]$，拿到 $f(1)$ 的值之后还需要经过一系列运算才能得到 $f(n)$，这就不算 tail recursion.

那继续上面的大问题：任意的 recursion 都能改写成 tail recursion 么？感觉也是可以的，理论部分这里就不考证了。

## Procedure vs Process

那我们做了上述的结论之后，就可以大胆总结一下：

- Recursive Procedure 产生 Recursive Process
- Iterative Procedure 产生 Iterative Process
- 因为 Iteration 是特殊的 Recursion，所有也可以说 Iterative Procedure 是 Recursive 的

也正因为如此，从编程语言的 syntax 的角度来说，满足 "the procedure definition refers (either directly or indirectly) to the procedure itself" 的 procedure 都叫 recursive，就没有分那么细。

## `for`-loop / 不同语言对 Iteration 的实现 / Tail Call Optimization

SICP 花了很长的一个篇幅来说：

> One reason that the distinction between process and procedure may be confusing is that most implementations of common languages (including Ada, Pascal, and C) are designed in such a way that the interpretation of any recursive procedure consumes an amount of memory that grows with the number of procedure calls, even when the process described is, in principle, iterative. As a consequence, these languages can describe iterative processes only by resorting to special-purpose "looping constructs" such as `do`, `repeat`, `until`, `for`, and `while`. The implementation of Scheme we shall consider in Chapter 5 **does not share this defect**. It will execute an iterative process in constant space, even if the iterative process is described by a recursive procedure.

- 这句 **does not share this defect** 简直就是无情的嘲讽, lol

这段的信息量很大：

- 首先是 `foo`-loop 这些 "looping constructs" 都可以看做是 iteration 的一个 syntactic sugar
- 二来是相当于说：这些 "looping constructs" are basically non-necessary (in Scheme)
- 三来指出了某些语言会把 iterative procedure 执行成一个 recursive process
  - 这可能是引起 procedure vs process 概念上的混乱的原因
  - 于是顺理成章就出现了 Tail Call Optimization 这个编译器的优化技术，确保把 iterative procedure 执行成 iterative process

## LeetCode 答题技巧：Recursion

如何把一个普通的 recursion 改写成 iterative (这里我们讨论 general 的 iteration 的情况，即包括各种 "looping constructs" 的写法)？分两种情况：

1. 可以先改写成 tail recursion 的情况
    - tail recursion 改写成 loop 就是顺理成章的事情
1. 不知道如何改写成 tail recursion 的情况
    - 有的 recursion 的确是很难改，尤其是当你想严格遵守 CPS 的时候

### CASE 1: 如何改写成 tail recursion?

我们前面说到了 $f(\alpha^{(1)}, \beta^{(1)}, \dots, n)$ 这么一种形式，但更 general 一点来说，最后一个参数应该是个 counter，它肯定和 $n$ 相关，但不一定起始就是 $n$。那么改写 tail recursion 的第一步就是要明确：

1. 需要几个 state variables?
2. state variables 的初始值是多少？
3. counter 从几开始？counter 减到几停止？

看个例子，比如要改写这么个函数：

```python
def f(n):
    if n < 3: return n
    else: return f(n-1) + 2 * f(n-2) + 3 * f(n-3)
```

1. 需要几个 state variables?
    - 从目前的经验来看，有几个 recursive calls 就有几个 state variables
    - 所以这里 `f(n-1)`, `f(n-2)`, `f(n-3)` 就应该对应 3 个 state variables
2. state variables 的初始值是多少？
    - 看你的 recursive calls 什么时候才能被触发
    - 这里需要 `n >= 3`，所以 state variables 的初始值就是当 `n == 3` 时, `f(n-1), f(n-2), f(n-3)` 的值，即 `2, 1, 0`
3. counter 从几开始？counter 减到几停止？
    - 还是看你的 recursive calls 什么时候才能被触发；假设触发的值是 $n_0$，那么 counter 的区间就是 $[n_0, n]$
    - 那么在这题，counter 就是在 $[3, n]$ 这个区间内
      - 当然，你用 $[0, n-3]$ 或者 $[1, n-2]$ 这样的都行，只要保证迭代的次数就行

这些都确定了，你需要做的就是迭代更新 state variables:

```python
def f(n):
    def f_iterate(c, b, a, n):
        if n == 2:
            return c
        
        # 迭代更新 f(n), f(n-1), f(n-2) <= f(n-1), f(n-2), f(n-3)
        return f_iterate(c + 2*b + 3*a, c, b, n-1)

    if n < 3: return n
    # 初始 c = f(2) = 2, b = f(1) = 1, c = f(0) = 0 
    else: return f_iterate(2, 1, 0, n)
```

再改写成 loop:

```python
def f(n):
    def f_iterate(c, b, a, n):
        for i in range(3, n+1):
            # 迭代更新 f(n), f(n-1), f(n-2) <= f(n-1), f(n-2), f(n-3)
            c, b, a = c + 2*b + 3*a, c, b
            
        return c

    if n < 3: return n
    # 初始 c = f(2) = 2, b = f(1) = 1, c = f(0) = 0 
    else: return f_iterate(2, 1, 0, n)
```

### CASE 2: `while stack:` 模拟 call stack

这个技术实现起来可能有点麻烦，但思想是简单的。还是以这个函数为例：

```python
def f(n):
    if n < 3: return n
    else: return f(n-1) + 2 * f(n-2) + 3 * f(n-3)
```

改用 stack 模拟的话就是：

```python
def f(n):
    result = 0
    
    # (1, n) <= (multiplier, multiplicand)
    stack = [(1, n)]
    while stack:
        (multiplier, multiplicand) = stack.pop()
        if multiplicand < 3:
            result += multiplier * multiplicand
        else:
            stack.append((multiplier * 1, multiplicand - 1))
            stack.append((multiplier * 2, multiplicand - 2))
            stack.append((multiplier * 3, multiplicand - 3))
            
    return result

f(4)  # Output: 11
```

有点类似 applicative-form evaluation 的展开形式，但每次都是从最右端开始、"每次只前进一步" 式地展开，比如：

$$
\begin{aligned}
f(4) &= f(3) + 2 f(2) + 3 f(1) \newline
     &= f(3) + 2 f(2) + 3 \newline
     &= f(3) + 7 \newline
     &= f(2) + 2 f(1) + 3 f(0) + 7 \newline
     &= f(2) + 2 f(1) + 7 \newline
     &= f(2) + 9 \newline
     &= 11
\end{aligned}
$$

## LeetCode 答题技巧：Dynamic Programming

回到 Fibonacci:

```text
                fib(4)
              ____||____
             /          \
        fib(3)          fib(2)
         /  \            /  \     
    fib(2)  fib(1)  fib(1)  fib(0)
     /  \ 
fib(1)  fib(0)
```

明显 `fib(2)` 重复计算了两次，那 DP 正是来解决这个问题的。

现在我可以这样总结 DP 的作用：用 memorization 来 cache 已经计算出来的值，将 tree recursion 降维成 linear recursion.

- 假设 $f(n)$ 对应一个 level 为 $n$ 的 binary tree recursion，单纯用 recursion 的计算量就是 $O(2^n - 1)$，DP 降维成 linear recursion，计算量就是 $O(n)$
- 有的题目其实是 graph recursion，但 DP 可以降维成一个 $O(mn)$ 的 recursion (matrix 形式的 cache)

从代码风格来说：

- recursion + memorization 即是 DP 的 top-down 式
  - 特点：思路清晰；天生是高维的 recursion，需要被 memorization 化解
- iteration + memorization 即是 DP 的 buttom-up 式
  - 特点：思路可能有点绕；天生是低维的 iteration，可能可以省 cache 的 size
  - 注意：并不是说 iteration 一定要配 memorization。因为有的 recursion 改写成的 iteration 并不需要 cache，这也说明你不用 DP 就能解这道题
    - 一般的 linear iteration 就可以不需要 cache (或者你认为 state variables 就是 cache)
    - 但有些复杂的 iteration 还是需要 cache 的。考虑 graph recursion 会用到的 matrix 形式的 cache，它本质上反应出这种 iteration 其实是有两个 counters 的 iteration，你只用 1-D 的 state variables 就有点复杂，不太好想
- 模拟 call stack 这个技术似乎在 DP 中不怎么用，因为写出来不如直接 recursion + memorization 清晰

具体实现的话：

- recursion + memorization 的固定套路是 (配上一个 helper 函数)：

$$
\begin{aligned}
& \operatorname{cache} = [\text{None}, \dots, \text{None}] \newline
& \text{if } \operatorname{cache}[n] \text{ is None:} \newline
& \;\;\; \operatorname{cache}[n] = g(f(n-1))
\end{aligned}
$$

- iteration + memorization 的固定套路是：

$$
\begin{aligned}
& \operatorname{cache} = [\text{init}, \dots, \text{None}] \newline
& \text{for } i = 1 \dots n \newline
& \;\;\; \operatorname{cache}[i] = g(\operatorname{cache}[i-1])
\end{aligned}
$$

还是以这个函数为例：

```python
def f(n):
    if n < 3: return n
    else: return f(n-1) + 2 * f(n-2) + 3 * f(n-3)
```

改写成 recursion + memorization (DP 的 top-down 式)：

```python
def f(n):
    cache = [None] * (n + 1)

    def f_helper(n):
        if cache[n] is None:
            if n < 3:
                cache[n] = n
            else:
                cache[n] = f_helper(n-1) + 2 * f_helper(n-2) + 3 * f_helper(n-3)
        
        return cache[n]
    
    return f_helper(n)
```

改写成 iteration + memorization (DP 的 buttom-up 式) (虽然没有必要，因为 state variable 就能搞定)：

```python
def f(n):
    if n < 3:
        return n
    
    cache = [0, 1, 2] + [None] * (n - 2)
    for i in range(3, n+1):
        cache[i] = cache[i-1] + 2 * cache[i-2] + 3 * cache[i-3]
    
    return cache[n]
```

套路就这么多，所以我现在觉得 DP 题目的难点在于：如何用 programming language 去 describe/represent 题目 (而且这个步骤往往并不涉及复杂的 data structure，想想 Hanoi Tower……)