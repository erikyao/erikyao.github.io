---
layout: post
title: "Convolution is convolution; it's NOT dot product"
description: ""
category: Math
tags: []
---
{% include JB/setup %}

$$
\DeclareMathOperator*{\argmin}{argmin} 

\newcommand{\icol}[1]{
  \bigl[ \begin{smallmatrix} #1 \end{smallmatrix} \bigr]
}

\newcommand{\icolplus}[1]{
  \Bigl[ \begin{smallmatrix} #1 \end{smallmatrix} \Bigr]
}
$$

我真的是出离愤怒。我不知道最开始把 convolution 看做 dot product 的人是怎么想的！有 convolution 的公式不用，非要用这么蹩脚的 intuition？而且明显 convolution 和 [Hadamard product](/math/2018/09/06/hadamard-product-diagonal-matrix-orthogonal-matrix) 的关系更大一点呢，咋没见人提？

本文主要参考：

- [Wikipedia: Convolution](https://en.wikipedia.org/wiki/Convolution)
- [HIPR2: Convolution](https://homepages.inf.ed.ac.uk/rbf/HIPR2/convolve.htm)
- [StackExchange: In a convolutional neural network (CNN), when convolving the image, is the operation used the dot product or the sum of element-wise multiplication?](https://stats.stackexchange.com/questions/335321/in-a-convolutional-neural-network-cnn-when-convolving-the-image-is-the-opera)
- [StackExchange: What is the physical meaning of the convolution of two signals?](https://dsp.stackexchange.com/questions/4723/what-is-the-physical-meaning-of-the-convolution-of-two-signals)

## 1-D Convolution

首先 convolution 不是限定于 matrix 间、也不是限定于 tensor 间的运算，它其实是两个 functions 之间的运算：

$$
(f \ast g)(t) \overset{\Delta}{=} \int_{-\infty}^{\infty} f(\tau) g(t-\tau) \mathrm{d} \tau
$$

在 engineering 领域也有 $f(t) \ast g(t)$ 的写法。

因为 $(f \ast g)(t) = (g \ast f)(t)$，所以也可以有：

$$
(f \ast g)(t) \overset{\Delta}{=} \int_{-\infty}^{\infty} f(t-\tau) g(\tau) \mathrm{d} \tau
$$

物理上的一个 intuition 是：if signal $f(t)$ is applied to an [LTI (linear time-invariant) system](http://en.wikipedia.org/wiki/LTI_system_theory) with [impluse response](http://en.wikipedia.org/wiki/Impulse_response) $g(t)$, the final output is $f(t) \ast g(t)$.

For complex-valued functions $f$, $g$ defined on $\mathbb{Z}$, the _discrete convolution_ of $f$ and $g$ is:

$$
(f \ast g)(n)=\sum_{m} f(m) g(n-m)
$$

## 2-D Convolution

一般有：

$$
(f \ast g)(x, y) = \int_{-\infty}^{\infty} \int_{-\infty}^{\infty} f(\sigma, \tau) g(x - \sigma, y - \tau) \mathrm{d} \sigma \mathrm{d} \tau
$$

如果 $f$, $g$ 是 discrete functions，则有：

$$
(f \ast g)(x, y) = \sum_{\sigma} \sum_{\tau} f(\sigma, \tau) g(x - \sigma, y - \tau)
$$

## Matrix 2-D Convolution for Image Processing / Image & Kernel

**如果我们把 matrix $A$ 看做其自身 indice 的函数** (所以自然是 discrete 的函数) (而不是把 matrix $A$ 看做是关于 vector $\mathbf{x}$ 的函数)，比如最基本的：

$$
A(i, j) = A_{i,j} 
$$

where $0 \leq i < m, 0 \leq j < n$. 那么两个 matrice 也可以做 convolution (以下下标都从 `0` 记起)。

但是要注意在 image processing 领域，这个 matrix 的函数式写法没有这么简单。一般有一个 image matrix $A_{m_A \times n_A}$，一个 kernel matrix $K_{m_K \times n_K}$，$m_K < m_A, n_K < n_A$。然后我们有函数：

$$
\begin{aligned}
f_A(i, j) &= A_{m_K + i, n_K + j} \newline
f_K(i, j) &= K^{HV}_{i, j} = K_{m_K - i, n_K - j}
\end{aligned}  
$$

where $K^{HV} = JKJ$ and $J$ is the anti-diagonal "identity" matrix (或者看成是 row-reversed identity matrix) like $\icol{0 & 1 \newline 1 & 0}$.

- $JK$ 的作用是将 $K$ 上下翻转 (horizontally flip)
- $KJ$ 的作用是将 $K$ 左右翻转 (vertically flip)

如果有 matrix $C = f_A \ast f_K$，那么有：

$$
\begin{aligned}
C(i, j) &= \sum_{i'} \sum_{j'} f_K(i', j') f_A(i - i', j - j') \newline
        &= \sum_{i'} \sum_{j'} K_{m_K - i', n_K - j'} A_{m_K - i' + i, n_K - j' + j}
\end{aligned}  
$$

- 注意，如果下标从 `1` 开始计的话，上面的下标都要 `+1`
- 另外，**参考 kernel method 的思想，实际应用中我们并不需要构造 $f_A$ 和 $f_K$，直接写出 $C(i, j) = \sum_{i'} \sum_{j'} K_{?, ?} A_{?, ?}$ 的形式拿来用就好了**

考虑个具体的例子，假设 $K_{2 \times 2}, A_{3 \times 3}$，则 $C = (f_A \ast f_K)$ 有：

$$
\begin{aligned}
C(0,0) &= \sum_{i'} \sum_{j'} K_{2 - i', 2 - j'} A_{2 - i', 2 - j'} \newline
       &= K_{0,0}A_{0,0} + K_{0,1}A_{0,1} + K_{1,0}A_{1,0} + K_{1,1}A_{1,1} \newline
C(0,1) &= \sum_{i'} \sum_{j'} K_{2 - i', 2 - j'} A_{2 - i', 3 - j'} \newline
       &= K_{0,0}A_{0,1} + K_{0,1}A_{0,2} + K_{1,0}A_{1,1} + K_{1,1}A_{1,2} \newline
C(1,0) &= \sum_{i'} \sum_{j'} K_{2 - i', 2 - j'} A_{3 - i', 2 - j'} \newline
       &= K_{0,0}A_{1,0} + K_{0,1}A_{1,1} + K_{1,0}A_{2,0} + K_{1,1}A_{2,1} \newline
C(1,1) &= \sum_{i'} \sum_{j'} K_{2 - i', 2 - j'} A_{3 - i', 3 - j'} \newline
       &= K_{0,0}A_{1,1} + K_{0,1}A_{1,2} + K_{1,0}A_{2,1} + K_{1,1}A_{2,2}
\end{aligned}
$$

这个例子给出了一个很直观的 intuition：

1. 把 kernel $K$ 覆盖在 image $A$ 之上，$K_{0,0}$ 对齐到 $A_{0,0}$ (左上角对齐)
1. 移动 kernel $K$ 使 $K_{0,0}$ 对齐到 $A_{i,j}$，假设覆盖到的 image $A$ 的部分是 $A_{i:i+m_K, j:j+n_K}$
1. 那么 $C(i, j) = \operatorname{sum} \big( K \odot A_{i:i+m_K, j:j+n_K} \big)$ (sum of [Hadamard product](/math/2018/09/06/hadamard-product-diagonal-matrix-orthogonal-matrix))
    - 我再次强调一遍，这不是 dot product！

很明显我们可以把 $C$ 看做一个 matrix $C_{i, j} = C(i, j)$。最后考虑下这个 matrix $C$ 的 size：

$$
\begin{aligned}
0 \leq i' < m_K \newline
0 \leq j' < n_K \newline
0 \leq m_K - i' + i < m_A \newline
0 \leq m_K - i' + i < n_A 
\end{aligned}  
$$

进而有：

$$
\begin{aligned}
0 \leq i < m_A - m_K \newline
0 \leq j < n_A - n_K
\end{aligned}  
$$

所以 matrix $C$ 最大的 size 只可能是 $(m_A - m_K + 1) \times (n_A - n_K + 1)$
