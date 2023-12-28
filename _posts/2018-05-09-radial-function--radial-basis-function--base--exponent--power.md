---
category: Math
description: ''
tags: []
title: Radial Function / Radial Basis Function / Base / Exponent / Power
---

## Radial Function

[Wikipedia: Radial function](https://en.wikipedia.org/wiki/Radial_function):

> In mathematics, a radial function is a function defined on a Euclidean space $\mathbf{R}^n$ whose value at each point depends only on the distance between that point and the origin.

"radial" 的意思应该是：”只与 radius (半径长度) 有关“。所以有：$\phi (\mathbf{x} )=\phi (\Vert \mathbf{x} \Vert)$

Radial function 的一个特性是：翻转、旋转这类不改变 $\mathbf{x}$ 向量长度的线性变换不会改变 $\phi (\mathbf{x})$ 的值。

[Wikipedia: Radial basis function](https://en.wikipedia.org/wiki/Radial_basis_function):

> ... or alternatively on the distance from some other point $c$, called a **center**, so that $\phi (\mathbf{x} ,\mathbf{c})=\phi (\Vert \mathbf{x} - \mathbf{c} \Vert)$.

这也就是常见的二元 radial function 的形式：$\phi (\mathbf{x} ,\mathbf{y}) = \varphi(r)$ where $r= \Vert \mathbf{x} - \mathbf{y} \Vert$。

这里 $\Vert \mathbf{x} - \mathbf{y} \Vert$ 可以看做从 $\mathbf{y}$ 指向 $\mathbf{x}$ 的一个 radius。

## Radial Basis Function

Radial basis function 是 radial function 的子类。所谓 Radial basis function 就是它的定义中会涉及到一个 power (幂)，然后 radius ($\Vert \mathbf{x} \Vert$ or $\Vert \mathbf{x} - \mathbf{y} \Vert$) 会是这个幂的 base (基数)。比如：

- Gaussian RBF: ${\phi (\mathbf{x} ,\mathbf{y}) = \varphi(r) = e^{-(\varepsilon r)^{2}}}$
- Multiquadric RBF: $\phi (\mathbf{x} ,\mathbf{y}) = \varphi(r) = {\sqrt {1+(\varepsilon r)^{2}}}$

## Recap: Base / Exponent / Power

对 $a^n$:

- $a$ is the **base**
- $n$ is the **exponent**
- $a^n$ is the power, or precisely **the $n^{\text{th}}$ power of $a$**

我觉得我对 "power" 这个词的不理解，一是源自 "$a$ raised to the $n^{\text{th}}$ power"、"$a$ raised to the power of $n$" 这类的表达方式。其实记住 power 就是 $a^n$ 这个值就可以了。

二是觉得这个概念用 "power" 这个单词表示很奇怪。其实这里涉及到 etymology 的问题。

[Etymology of some common mathematical terms](http://www-history.mcs.st-andrews.ac.uk/Miscellaneous/Mathematical_notation.html): 

> **Power** is first used for the square. Euclid uses the phrase **in power**, for example he says that magnitudes are **commensurable in power** when their squares are commensurable.

然后 [Etymology of “power” (math.)](https://hsm.stackexchange.com/a/3255) 提到原词是希腊文 δυνάμει (dunamis)，表示 potentiality，与 actuality 相对。所以我觉得 _in power_ 就是 _in potentiality_ 亦即 _potentially_。

"magnitudes are _commensurable in power_ when their squares are commensurable" 这句话里的 magnitudes 用 "_incommensurable_" 修饰一下就更好理解了。举个例子：

- $\sqrt 2$ is actually incommensurable.
- $\sqrt 2$'s square, $2$, is commensurable.
- So we say $\sqrt 2$ is protentially commensurable.

[Etymology of “power” (math.)](https://hsm.stackexchange.com/a/3255):

> Thus, from the Greek **dunamis** to the Latin **potentia** and finally to **power**.

至于 exponent，它并不出自 _potentia_，而是源自 [_expōnō_](https://en.wiktionary.org/wiki/expono#Latin)，本意是 expose，我觉得它就是描述 $n$ stands out in the notation of $a^n$ 的意思。