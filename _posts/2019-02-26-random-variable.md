---
layout: post
title: "Terminology Recap: Random Variable / Distribution"
description: ""
category: Math
tags: []
---
{% include JB/setup %}

主要参考：

- [NOTES ON PROBABILITY - Greg Lawler](https://www.math.uchicago.edu/~lawler/probnotes.pdf)
- [Measure theory and probability - Alexander Grigoryan](https://www.math.uni-bielefeld.de/~grigor/mwlect.pdf)

## 预备知识 (一) $\sigma$-algebra 

非常蛋疼的一个事实：$\sigma$-algebra 并不是一个严格意义上的 algebra……

**Definition:** In mathematical analysis and in probability theory, a $\sigma$-algebra on a set $S$ is a subset $\Sigma \subset 2^S$ that includes $S$ itself. It is closed under complement and countable unions.

- 因为 $S \in \Sigma$ 同时它是 closed under complement，所以 $\varnothing \in \Sigma$
- $\sigma$-algebra, $\sigma$-ring 和 $\sigma$-field 都是有关系的，但这里不表

## 预备知识 (二) Borel Set / Borel $\sigma$-algebra

> In mathematics, a Borel set is any set in a topological space that can be formed from open sets (or, equivalently, from closed sets) through the operations of countable union, countable intersection, and relative complement.

- relative complement of $A$ in $B$ 就是 $A - B$
- relative complement of $B$ in $A$ 就是 $B - A$

> For a topological space $X$, the collection of all Borel sets on $X$ forms a $\sigma$-algebra $\mathcal{B}$, known as the Borel algebra or Borel $\sigma$-algebra. The Borel $\sigma$-algebra on $X$ is the smallest $\sigma$-algebra containing all open sets (or, equivalently, all closed sets).

## 预备知识 (三) Measurable Function / Measurable Space

**Definition:** A **measurable space** is a tuple of $(S, \Sigma)$ where $S$ is a set and $\Sigma$ is a $\sigma$-algebra over $S$.

- measurable space 又称 Borel space

**Definition:** Let $(X, \Sigma_X)$ and $(Y, \Sigma_Y)$ be measurable spaces. Function $f:X \to Y$ is called a **measurable function** if $\forall E_Y \in \Sigma_Y, f^{-1}(E_Y) \in \Sigma_X$ 

- $f^{-1}$ 是 inverse function
- 扩展一下 $f^{-1}$ 的定义：$f^{-1}(E_Y) := \lbrace x \in X \vert f(x) \in E_Y \rbrace$
- 这个定义相当于：$\forall E_Y \in \Sigma_Y, \exists E_X \in \Sigma_X$ 使得 $f(E_X) = E_Y$
    - 这个 $E_X$ 即 $f^{-1}(E_Y)$
- 为了强调 $f$ 是一个 measurable function，我们也可以把它写作 $f: (X, \Sigma_X) \to (Y, \Sigma_Y)$

## 预备知识 (四) Measure / Mesure Space

**Definition:** Let $(S, \Sigma)$ be a measurable space. Function $\mu: \Sigma \to \mathbb{R} \cup \lbrace -\infty, \infty \rbrace$ is called a **measure** if it satisfies the following properties:

1. **Non-negativity:** $\forall E \in \Sigma, \mu(E) \geq 0$
    - 注：存在 signed measure 可以不满足这个条件
2. **Null empty set:** $\mu(\varnothing) = 0$
3. **Countable additivity (or $\sigma$-additivity):** $\forall \text{ countable collection } \lbrace E_i \rbrace^{\infty}_{i=1}$ where $E_i \in \Sigma, \forall i$ and $E_i \cap E_j = \varnothing, \forall i, j$:

$$
\mu \left( \bigcup _ { k = 1 } ^ { \infty } E _ { k } \right) = \sum _ { k = 1 } ^ { \infty } \mu \left( E _ { k } \right)
$$

**Definition:** A **measure space** is such a triple of $(S, \Sigma, \mu)$

## 预备知识 (五) Probability Measure / Probability Space

**Definition:** Measure $\mu$ is probability measure if $\mu(S) = 1$.

- $S$ 指全集

**Definition:** A **probability space** is a measure space with a probability measure, denoted by $(\Omega, \mathcal{F}, \mathbb{P})$ where:

- $\omega \in \Omega$ is called an **outcome**
- $E \in \mathcal{F}$ is called an **event**
- $\mathbb{P}: \mathcal{F} \to [0,1]$ is a probability measure
    - $\mathbb{P}(E)$ is the probability of $E$

## 预备知识 (三)(四)(五) 总结

- measurable function $f$ 定义在 measurable space $(S, \Sigma)$ 上
- measurable function $f$ 有潜力构成一个 measure $\mu$
- measure $\mu$ + measurable space $(S, \Sigma)$ = measure space $(S, \Sigma, \mu)$
    - probability measure $\mathbb{P}$ 是特殊的 measure
    - 装备 probability measure 的 measure space 是 probability space $(\Omega, \mathcal{F}, \mathbb{P})$

我们可以把 measurable function $f$ $\overset{\text{进化}}{\Rightarrow}$ measure $\mu$，但注意这里涉及一个定义域转化的问题：

- $f: S \to \mathbb{R}$
- $\mu: \Sigma \to \mathbb{R}$
- 比如我们可以定义 $\mu(\lbrace x \rbrace) = f(x)$ 然后根据 $\sigma$-additivity 有

$$
\mu(E) = \sum_{x \in E} \mu({\lbrace x \rbrace}) = \sum_{x \in E} f(x)
$$

- 注意我这里的意思是：**我们可以这样做，但没有规定说一定要这样做；$\mu$ 也不一定要通过 $f$ 定义，$f$ 也不一定满足进化成 $\mu$ 的要求**

## 1. Random Variable

**Definition:** A random variable $X$ is a measurable function $X: (\Omega, \mathcal{F}) \to (\mathbb{R}, \mathcal{B})$ such that $\forall$ Borel set $B\in \mathcal{B}$

$$
X^{-1}(B) \overset{\text{informal}}{=} \lbrace X \in B \rbrace = \lbrace \omega \in \Omega \vert X(\omega) \in B \rbrace \in \mathcal{F}
$$

- 准确来说应该是 $\mathbb{R} \cup \lbrace -\infty, \infty \rbrace$ 而不仅仅是 $\mathbb{R}$
- $\mathcal{B}$ 是 $\mathbb{R}$ 上的 Borel $\sigma$-algebra

那假定 $(\Omega, \mathcal{F})$ 有 probability measure $\mathbb{P}$，那么：

- 首先注意定义域：
    - $X: \Omega \to \mathbb{R}$ (**random variable 接收 outcome**)
    - $\mathbb{P}: \mathcal{F} \to [0, 1]$ (**probability measure 接收 event**)
- $X$ 是 measurable function，$\mathbb{P}$ 是 probability measure，我们可以像上面 $f$ $\overset{\text{进化}}{\Rightarrow}$ $\mu$ 一样定义一个 $X$ 使它可以 $X$ $\overset{\text{进化}}{\Rightarrow}$ $\mathbb{P}$，**但是！没有必要**。后面 distribution 的部分会阐述。

以投骰子为例 (一个骰子，仅投一次)：

- $\Omega = \lbrace 1,2,3,4,5,6 \rbrace$
- $\mathcal{F}$ 包括但不限于 $\Omega$、$\lbrace 1 \rbrace$、$\lbrace 2 \rbrace$、$\lbrace 3 \rbrace$、$\lbrace 4 \rbrace$、$\lbrace 5 \rbrace$、$\lbrace 6 \rbrace$
- 假设有 $\mathbb{P}(\lbrace 1 \rbrace) = \mathbb{P}(\lbrace 2 \rbrace) = \mathbb{P}(\lbrace 3 \rbrace) = \mathbb{P}(\lbrace 4 \rbrace) = \mathbb{P}(\lbrace 5 \rbrace) = \mathbb{P}(\lbrace 6 \rbrace) = \frac{1}{6}$
    - **注意 event $\lbrace 1,3 \rbrace$ 表示 "roll 出 1 或者 3"，而不是 "roll 两次，一次是 1 一次是 3"**
        - "roll 两次，一次是 1 一次是 3" 的 event 应该是 $\big \lbrace \lbrace 1,3 \rbrace \big \rbrace$
    - 所以 $\mathbb{P}(\lbrace 1,3 \rbrace) = \mathbb{P}(\lbrace 1 \rbrace) + \mathbb{P}(\lbrace 3 \rbrace) = \frac{1}{3}$，同理有 $\mathbb{P}(\Omega) = 1$
    - "roll 出 1 且 3" 是不可能事件，即 $\varnothing$，由 measure 的定义得到 $\mathbb{P}(\varnothing) = 0$

## 2. Distribution of a random variable

感谢 [PhoemueX: On clarifying the relationship between distribution functions in measure theory and probability theory](https://math.stackexchange.com/a/976852)

假定有 probability space $(\Omega, \mathcal{F}, \mathbb{P})$，其上有一个 arbitrary 的 random variable $X$.

**Definition:** The **push-forward measure** of $\mathbb{P}$ by $X$ is a function $\mathbb{P}_{X}: \mathcal{B} \to \mathbb{R}$ such that $\forall B \in \mathcal{B}$,

$$
\mathbb{P}_{X}(B) = \big (\mathbb{P} \circ X^{-1} \big )(B) = \mathbb{P}(X^{-1}(B)) \overset{\text{informal}}{=} \mathbb{P}(\lbrace X \in B \rbrace) = \mathbb{P}(\lbrace \omega \in \Omega \vert X(\omega) \in B \rbrace)
$$

- 注意根据 random variable 的定义，$\forall B \in \mathcal{B}, X^{-1}(B) \in \mathcal{F}$，所以 $X^{-1}(B)$ 在 $\mathbb{P}$ 的定义域内
- $\mathbb{P}\_{X}$ 一定是一个 probability measure，使得 $(\mathbb{R}, \mathcal{B}, \mathbb{P}\_{X})$ 构成一个 probability space
- **若 $X = I$，即 $X(\omega) = \omega$，可得 $\mathbb{P}_{X} = \mathbb{P}$**

**我们称 $\mathbb{P}_{X}$ 为 distribution of random variable $X$**.

我们这里重点考察一下 $\mathbb{P}_{X}$ 和 $\mathbb{P}$ 的关系，并引申出 $X$ 在其中的作用：

- $\mathbb{P}: \mathcal{F} \to [0, 1]$
- $X: (\Omega, \mathcal{F}) \to (\mathbb{R}, \mathcal{B})$
- 按理来说，$X^{-1}$ 应该是 $X^{-1}: \mathbb{R} \to \Omega$，但是我们通过 $X^{-1}(B)$ 的定义把它扩展成了 $X^{-1}: \mathcal{B} \to \mathcal{F}$
- 于是 $\mathbb{P}_{X} = \mathbb{P} \circ X^{-1}$ 就成了一个 $\mathcal{B} \to \mathcal{F} \to [0, 1]$ 的函数
- 所以 $X: \mathcal{F} \to \mathcal{B}$ 就可以看作一个 "**event encoder**"，**它把每一个 event $E \in \mathcal{F}$ 映射到一个 Borel set $B \in \mathcal{B}$**
- 同理$X^{-1}: \mathcal{B} \to \mathcal{F}$ 就可以看成一个 "**event decoder**"，**它把每一个 Borel set $B \in \mathcal{B}$ 又映射回原来的 event $E \in \mathcal{F}$**
- **Event encoding 的作用在于：可以把各种不同的、具体的 $(\Omega, \mathcal{F})$ 转化为统一的、抽象的 $(\mathbb{R}, \mathcal{B})$**
    - 比如 "投骰子" 和 "黑盒子里 6 个不同颜色的球，抓一个出来" 这两个实验，它们的 event 是不一样的，但我们明显可以看出它们的本质是一样的，这个本质体现在它们通过 $X$ encoding 以后，得到的 Borel set 是一样的 (或者说得到的 $\mathbb{P}_X$ 函数是一样的)
- Event decoding 的作用在于计算，因为 $\mathbb{P}_X$ 需要借助 $\mathbb{P}$ 才能算出具体的值
- **我们平时根本就没有注意到这个 event encoding/decoding 的过程是因为：它太顺理成章了**。比如上面 "投骰子" 的例子，我们直接就写出了 $\Omega = \lbrace 1,2,3,4,5,6 \rbrace$，所以可以有 $E = B$，亦即 $X = I$，等于没有做 event encoding/decoding，于是我们也没有区分 $\mathbb{P}\_{X}$ 和 $\mathbb{P}$，因为 $\mathbb{P}\_{X} = \mathbb{P}$
- 但是我也可以定义说 $\Omega = \lbrace \text{I}, \text{II}, \text{III}, \text{IV}, \text{V}, \text{VI}\rbrace$，那你可能需要 encode 一下，得到:
    - $X(\text{I}) = 1$
    - $\dots$
    - $X(\text{VI}) = 6$
    - 所以 $\mathbb{P}_{X}(\lbrace 3 \rbrace) = \mathbb{P}(X^{-1}(\lbrace 3 \rbrace)) = \mathbb{P}(\lbrace \text{III} \rbrace)$
    - 当然，你的 $X$ 的定义可以不用与 event 的语义对应，比如我定义 $X(\text{I}) = 100, \dots, X(\text{VI}) = 600$，也是可以的

题外话：$\mathbb{P}(X = 3)$ 这种写法如何解释？

- 先说结论：这是个有点过分的简写
- 首先 $\mathbb{P}(X = 3)$ 应该是 $\mathbb{P}(\lbrace X = 3 \rbrace)$ ($\mathbb{P}$ 接收 event)
- 二来 $X = 3$ 应该理解为 $X \in \lbrace 3 \rbrace$
- 这么一来，令 $B = \lbrace 3 \rbrace$，套公式可得：

$$
\mathbb{P}(X = 3) \overset{\text{informal}}{=} \mathbb{P}(\lbrace X = 3 \rbrace) \overset{\text{informal}}{=} \mathbb{P}(\lbrace X \in \lbrace 3 \rbrace \rbrace) = \mathbb{P}_X(\lbrace 3 \rbrace)
$$ 

- 所以 $X = 3$ 整体是一个 event $E \in \mathcal{F}$ (informal)；而 $\lbrace 3 \rbrace$ 是一个 Borel set $B \in \mathcal{B}$
- 若 $X = I$，则 $E = B$, $\mathbb{P}_{X} = \mathbb{P}$，从而 $\mathbb{P}(X = 3) \overset{\text{informal}}{=} \mathbb{P}_X(\lbrace 3 \rbrace) = \mathbb{P}(\lbrace 3 \rbrace)$

$\mathbb{P}_{X}$ 的性质还有：

- If $\mathbb{P}_{X}$ gives measure one to a countable set of reals, then $X$ is called a **discrete random variable**. 
- If $\mathbb{P}_{X}$ gives zero measure to every singleton set, and hence to every countable set, $X$ is called a **continuous random variable**. 
    - Every random variable can be written as a sum of a discrete random variable and a continuous random variable. 
    - All random variables defined on a discrete probability space are discrete

**Definition:** 对任意的 ([locally finite](https://en.wikipedia.org/wiki/Locally_finite_measure)) measure $\mu$ on $\mathbb{R}$，我们定义 **distribution function** of $\mu$ as

$$
F_{\mu}(x) = \mu \big ( (-\infty, x] \big)
$$

那既然 $\mathbb{P}\_{X}$ 是一个 probability measure (probability measure 一定是 locally finite)，我们可以定义：

$$
F_{\mathbb{P}_{X}}(a) = \mathbb{P}_{X} \big ( (-\infty, a] \big) = \mathbb{P} \Big ( X^{-1}\big ( (-\infty, a] \big) \Big) \overset{\text{informal}}{=} \mathbb{P}\big ( \lbrace X \in (-\infty, a] \rbrace \big ) \overset{\text{informal}}{=} \mathbb{P}(X \leq a)
$$

严格来说，$F\_{\mathbb{P}\_{X}}$ 应该叫做 **distribution function of the distribution of random variable $X$**，但是非常不幸的是，它也被简称为 **distribution of random variable $X$**，并且简化符号为 $F\_X = F\_{\mathbb{P}\_{X}}$

## 3. Tilde $\sim$

<!--
https://stats.stackexchange.com/questions/348881/why-does-unbiasedness-not-imply-consistency

https://math.stackexchange.com/questions/173337/difference-between-population-sample-and-sample-value

https://stats.stackexchange.com/questions/269/what-is-the-difference-between-a-population-and-a-sample

https://dsp.stackexchange.com/questions/17390/sample-vs-sample-values

https://www.quora.com/Most-ML-models-assume-an-underlying-data-distribution-for-them-to-function-well-Where-can-I-learn-about-the-probability-distributions-that-each-ML-model-assumes

https://math.stackexchange.com/questions/2745776/why-is-the-expected-value-of-a-data-point-equal-to-population-mean

https://math.stackexchange.com/questions/1760048/what-is-a-sample-of-a-random-variable

https://stats.stackexchange.com/questions/239500/what-is-the-difference-between-random-variable-and-random-sample

https://math.stackexchange.com/questions/240673/what-exactly-is-a-random-variable

https://stats.stackexchange.com/questions/41306/why-are-probability-distributions-denoted-with-a-tilde

http://statweb.stanford.edu/~susan/courses/s116/node96.html

http://mathworld.wolfram.com/Tilde.html

https://reference.wolfram.com/language/guide/ParametricStatisticalDistributions.html
-->