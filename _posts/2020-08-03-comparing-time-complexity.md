---
layout: post
title: "Comparing Time Complexity"
description: ""
category: Algorithm
tags: []
---
{% include JB/setup %}

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
- $5^{\log_3 n} < n^{\log_3 7} < 2^{7n} = 7^{2n}$

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
(\log_2 n + 1)^3 < 1000 (\log_2 n)^3 < n^{\frac{1}{2}} < 2^{\log_2 n} < n \log n < 5^{\log_3 n} < n^{\log_3 7} < 2^{7n} = 7^{2n}
$$