---
layout: post
title: "Convolution is convolution; it's NOT dot product"
description: ""
category: Math
tags: []
---
{% include JB/setup %}

我真的是出离愤怒。我不知道最开始把 convolution 看做 dot product 的人是怎么想的！有 convolution 的公式不用，非要用这么蹩脚的 intuition？

本文主要参考：

- [Wikipedia: Convolution](https://en.wikipedia.org/wiki/Convolution)
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

## 2-D Convolution for Matrices

**如果我们把 matrix $A$ 看做其自身 indice 的函数** (所以自然是 discrete 的函数) (而不是把 matrix $A$ 看做是关于 vector $\mathbf{x}$ 的函数)，比如：

$$
A(i, j) = A_{i,j} \text{ where } 1 \leq i \leq m, 1 \leq j \leq n
$$

这么一来，两个 matrice 也可以做 convolution，但是要注意下标的计算有点不一样:

$$
(A \ast B)(i, j) = \sum_{i'} \sum_{j'} A(i', j') B(i - i' + 1, j - j' + 1)  
$$

上式是 [matlab 的 `conv2` 的标准实现](https://www.mathworks.com/help/matlab/ref/conv2.html#bvgtfv6)，下标从 `1` 算起 ([参考](http://www.inf.ed.ac.uk/teaching/courses/cfcs1/lectures/cfcs_l15.pdf))。我找了很久，都没有找到这个下标 `+1` 的合理解释。

- 也有把 $B$ 的下标从 `-1` 开始算起的 (而 `A` 的下标从 `0` 开始算起)，比如这篇 [songho.ca: Example of 2D Convolution](http://www.songho.ca/dsp/convolution/convolution2d_example.html)，属于换汤不换药。

但从另外一个角度来看，**这有点像 kernel method**，这个 $(A \ast B)$ 的 interface 固定，具体怎么实现可以看具体的应用。很明显，这个 $(A \ast B)(i, j)$ 的实现对矩阵运算更有意义。

考虑 matrix $(A \ast B)$ 的 size：假设 $A$ 是 $m_A \times n_A$，$B$ 是 $m_B \times n_B$，那么：

$$
\begin{aligned}
1 \leq i' \leq m_A \newline
1 \leq j' \leq n_A \newline
1 \leq i - i' + 1 \leq m_B \newline
1 \leq j - j' + 1 \leq n_B 
\end{aligned}  
$$

进而有：

$$
\begin{aligned}
1 \leq i \leq m_B + m_A - 1 \newline
1 \leq j \leq n_B + n_A - 1
\end{aligned}  
$$

所以 matrix $(A \ast B)$ 最大的 size 只可能是 $(m_B + m_A - 1) \times (n_B + n_A - 1)$

考虑个具体的例子，假设 $A_{2 \times 2}, B_{3 \times 3}$ (考虑到 $A \ast B = B \ast A$，所以谁大谁小没有关系)，则 $C = (A \ast B)$ 有：

$$
\begin{aligned}
C(1,1) &= \sum_{i'} \sum_{j'} A(i', j') B(2 - i', 2 - j') \newline
       &= A(1,1)B(1,1) \newline
C(1,2) &= \sum_{i'} \sum_{j'} A(i', j') B(2 - i', 3 - j') \newline
       &= A(1,1)B(1,2) + A(1,2)B(1,1) \newline
C(2,1) &= \sum_{i'} \sum_{j'} A(i', j') B(3 - i', 2 - j') \newline
       &= A(1,1)B(2,1) + A(2,1)B(1,1) \newline
C(2,2) &= \sum_{i'} \sum_{j'} A(i', j') B(3 - i', 3 - j') \newline
       &= A(1,1)B(2,2) + A(1,2)B(2,1) + A(2,1)B(1,2) + A(2,2)B(1,1)
\end{aligned}
$$

上式是 `shape="valid"` 的算法 (参考 [`conv2(..., shape)`](https://www.mathworks.com/help/matlab/ref/conv2.html#bvgtez6-shape))，即限定不能超出 $A$、$B$ 矩阵的范围。若存在 padding 使得 $B_{3 \times 3}$ 外围一圈都是 0 (使得 $B$ 实际变成 $5 \times 5$，但是我们保证 $B_{3 \times 3}$ 的位置不变，只是让下标 `0` 和 `4` 变成 accessible 的)，那么：

$$
\begin{aligned}
C(1,1) &= \sum_{i'} \sum_{j'} A(i', j') B(2 - i', 2 - j') \newline
       &= A(1,1)B(1,1) + A(1,2)B(1,0) + A(2,1)B(0,1) + A(2,2)B(0,0) \newline
       &= A(1,1)B(1,1) \newline
\text{(依此类推)} & 
\end{aligned}
$$

最后还有一个问题："把 $A$ 看做 sliding window 去 scan $B$" 这个 intuition 基本是对的，唯一的例外是 `dim(A) == dim(B)` 的时候。比如 $A_{2 \times 2}, B_{2 \times 2}$，得到的 $(A \ast B)$ 仍然是一个 $2 \times 2$。