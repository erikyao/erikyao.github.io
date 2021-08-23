---
layout: post
title: "Algorithm Quizzes"
description: ""
category: Algorithm
tags: []
---
{% include JB/setup %}

## Quiz 1

Question: Sort the following terms from slowest growing to fastest growing.

$$
(\log_2 n + 1)^3 \quad 7^{2n} \quad n^{\frac{1}{2}} \quad n^{\log_3 7} \quad 2^{7n} \quad 1000 (\log_2 n)^3 \quad 2^{\log_2 n} \quad n \log n \quad 5^{\log_3 n}
$$

-----

这题其实非常 tricky。

首先要注意两点：

- $2^{\log_2 n} = n$
- $5^{\log_3 n} = n^{\log_3 5}$

所有我们上来可以排列成 3 组：

- $(\log_2 n + 1)^3 < 1000 (\log_2 n)^3$
- $n^{\frac{1}{2}} < 2^{\log_2 n} < n \log n$
- $5^{\log_3 n} < n^{\log_3 7} < 7^{2n} < 2^{7n}$

我们事后诸葛亮一下：这个问题可以转化为证明下面两个不等式：

- $1000 (\log_2 n)^3 < n^{\frac{1}{2}}$
- $n \log n < 5^{\log_3 n}$

### 1. 不等式一

令 $f(n) = 1000 (\log_2 n)^3 - n^{\frac{1}{2}}$。令 $n = 2^{2k}$，于是得到：$f(n) = 8000k^3 - 2^k$

这个很明显 $\underset{k \to +\infty}{\lim} 8000k^3 - 2^k = -\infty$

所以：$(\log_2 n)^3 < n^{\frac{1}{2}}$

### 2. 不等式二

令 $f(n) = n \log n - 5^{\log_3 n} = n \log n - n^{\log_3 5}$。令 $n=2^k$，于是得到：$f(n) = 2^k k - 2^{k \times \log_3 5} = 2^k (k - 2^{({\log_3 5} - 1) \times k})$

因为 $\log_3 5 - 1 > 0$，所以 $\underset{k \to +\infty}{\lim} k - 2^{({\log_3 5} - 1) \times k} = -\infty$

所以：$n \log n < 5^{\log_3 n} $

### 3. 综上

$$
(\log_2 n + 1)^3 < 1000 (\log_2 n)^3 < n^{\frac{1}{2}} < 2^{\log_2 n} < n \log n < 5^{\log_3 n} < n^{\log_3 7} < 7^{2n} < 2^{7n}
$$

## Quiz 2

求以下两段代码各自的 computational cost：

```java
(1) while (n > 2)
	n = sqrt(n); 
(2) while (n > 2) 
	n = log(n)
```

-----

解：(1) 假设 `while` 运行 $i$ 次时 $n$ 的值为 $n(i)$，有：

- $n(1) = n^{\frac{1}{2}}$
- $n(2) = n^{\frac{1}{4}}$
- ......
- $n(i) = n^{\frac{1}{2^i}}$

假设 $n(k) = p \leq 2$，`while` 结束，有：

- $p = n^{\frac{1}{2^k}}$，两边同时 $2^k$ 次方，得：
- $p^{(2^k)} = n$，两边同时取对数，得：
- $(2^k) \times \log p = \log n$，两边再次取对数，得：
- $\log 2^k + \log \log p = \log \log n$，即：
- $k \times \log 2 + \log \log p = \log \log n$

$\because$ $\log \log p$ 和 $\log 2$ 都是常数，$\therefore k \in O(\log \log n)$ ，即算法复杂度为 $O(\log \log n)$

解：(2) 这题需要一个引入概念，叫 [iterated logarithm](https://en.wikipedia.org/wiki/Iterated_logarithm):

$$
\log^{\ast}n:={\begin{cases} 0 & {\mbox{if }} n \leq 1; \newline 1+\log^{\ast}(\log n) & {\mbox{if }} n>1 \end{cases}}
$$

根据这个定义：$\log^{\ast}_2 2 = 1, \, \log^{\ast}_2 2^2 = 2, \, \log^{\ast}_2 2^{2^2} = 3, \, \dots$


假设 `while` 运行 $i$ 次时 $n$ 的值为 $n(i)$，有 

- $n(1) = \log n$ 
- $n(2) = \log \log n$
- ...... 
- $n(i) = \log \log \cdots \log n$ ($i$ 个 $\log$)

假设 $n(k) = p \leq 2$，`while` 结束，根据 iterated logarithm，有：

$$
\begin{aligned}
\log^{\ast}(n) &= 1 + \log^{\ast}(\log n) \newline
			   &= 2 + \log^{\ast}(\log \log n) \newline
			   &= 3 + \log^{\ast}(\log \log \log n)	\newline
			   &= \dots \newline
               &= k + \log^{\ast}(\log \log \dots \log n) \newline
			   &= k + \log^{\ast}(p) 
\end{aligned}
$$

$\because$ $log^{\ast}(p)$ 为常数，$\therefore k \in O(\log^{\ast} n)$ ，即算法复杂度为 $O(\log^{\ast} n)$

## Quiz 3

如何判断一个正整数是不是 2 的 n 次方？

-----

解：设 $x = 2^n$，$x$ 有 $m$ bits，则 $x$ 的最高位为 1，后 $m-1$ 位为 0

同时 $x-1$ 的最高位为 0，后 $m-1$ 位为 1，所以做 AND 运算有 `x & (x - 1) == 0`
