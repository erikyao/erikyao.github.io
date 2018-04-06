---
layout: post
title: "Expectation Maximization Algorithm Intuition"
description: ""
category: Machine-Learning
tags: [EM]
---
{% include JB/setup %}

之前写过一篇 [Expectation-Maximization Algorithm](/machine-learning/2014/12/28/expectation-maximization-algorithm)，但是太细碎了，没有抓住核心。

Intuition 难以形成主要是因为 EM 其实是个非常 general 的算法，latent variable 的形式、内部的计算细节等等内容 EM 算法本身都不 care，但是不拿一些具体的例子出来你是很难找到 Intuition 的。

然后另外一点是要搞清楚 EM 是作用在哪个模型的哪个阶段。知道了这一点能帮助记忆算法的思想。

## 1. EM to incomplete training data is MLE to complete training data

EM 算法最后输出的是：model 的参数。所以它理所当然是一个 estimate parameter 的算法。所以它和 [Generative Models](/machine-learning/2018/04/04/generative-models) 里的 MLE 的角色是一样的。同理，按 Generative Models 的 training 框架，在 $X_{train}$ imcomplete 的时候，把 MLE 换成 EM 就可以继续使用这个 training 框架。

## 2. Latent variables vary

还有一个不太直观的点是：latent variable 的形式是不固定的。一般来说，hidden data 或者 latent variable 就只有一个 column，当然你有多个 column 也是可以的，只是更复杂了而已；然后这一个 column 可能是 label、可能是单个 feature、可能是 fully latent (全部 missing)、可能是 partially latent (部分 missing)

- 如果是 latent variable 是 label，然后 fully latent，那这变成了一个 unsupervised learning problem
- 如果是 latent variable 是 label，然后 partially latent，那这变成了一个 semi-supervised learning problem
- 如果是 latent variable 是 feature 的情况更复杂，但是思想还是一样的

下面是一个 latent label + partially latent 的情况：

| $x^{(1)}$ | $x^{(2)}$ | ... | $x^{(n)}$ | $y$   |
|-----------|-----------|-----|-----------|-------|
| √         | √         | ... | √         | √     |
| √         | √         | ... | √         | √     |
| ...       | ...       | ... | ...       | ...   |
| √         | √         | ... | √         | **?** |
| √         | √         | ... | √         | **?** |

## 3. Intuition: EM is like $K$-means

[Expectation Maximization: how it works](https://www.youtube.com/watch?v=iQoXFmbXRJA) 这个视频讲得很好。他用的是一个及其简单的场景，只有一个 feature $\mathcal{x}$，latent label + fully latent，且假设了 $\mathcal{y}$ 的两个 class 分别对应一个 Gaussian Distribution (所以整体是一个 Gaussian Mixture Model)。

这就成了一个 "先有鸡还是先有蛋" 的场景：

1. 我需要 $y_{train}$ 来估计这两个 Gaussian 的两组参数；但是我没有 $y_{train}$
1. 反过来如果我知道这两个 Gaussian 的两组参数，我可以给你生成一组 $y_{train}$；但是我没有参数

这个时候，EM 的作用就是：我随机给你两组参数，你先生成一组 $y_{train}$，回头再按 $X_{train}$ 和 $y_{train}$ 去估新的参数，一次次迭代到收敛。这和 $K$-means 是一样的：我不知道 centroids 在哪里，我就随机一组 centroids，然后再去更新 centroids，收敛之后的就得到最好的 clustering

## 4. latent label + partially latent 如何处理

还是上面视频里的例子。我们记 observed data $\mathcal{D} = \lbrace (\mathbf{x}\_1, y\_1), \dots, (\mathbf{x}\_l, y\_l), \mathbf{x}\_{l+1}, \dots, \mathbf{x}\_{l+u} \rbrace$，hidden data 为 $\mathcal{H}$

- A common choice of $\theta^{(0)}$ is the MLE on the labeled dataset

然后在重新估新的参数的时候，你需要 ”照顾“ 到这些 labeled data，比如你可以令 $p(y=y_i \mid \mathbf{x}_i, \theta^{(t)}) = 1, i \leq l$。总体上你需要取 latent variable 的整个 column 来处理，也就是说 $y\_1, \dots, y\_l$ 虽然是 $\in \mathcal{D}$，但是它们是和 $\mathcal{H}$ 一起被视为 missing $y_{train}$ 的。这个时候，EM 的 intuition 就是：我随机给你 distribution 参数，你先生成一组 $y_{train}$，其中 $y\_1, \dots, y\_l$ 要特殊处理，要对得上。

## 5. 迭代目的：提升 $p(\mathcal{D} \mid \theta)$ 的 lower bound

我们把 observed data 记做 $\mathcal{D}$，hidden data 记做 $\mathcal{H}$。在 complete training data 的情况下，MLE 的做法是求 $\hat \theta = \underset{\theta}{\operatorname{argmax}} p(\mathcal{D} \mid \theta)$；在 imcomplete 的情况下，EM 的做法是逐步更新 $\theta$ 来提升 $E \left [ \log \, p(\mathcal{D},\mathcal{H} \vert \theta) \mid \mathcal{D}, \theta^{(t-1)} \right ]$，从而提升 $p(\mathcal{D} \mid \theta)$ 的 lower bound，而且它只能保证收敛到 local optimum。

- 这里要记住一点是 MLE 和 EM 的目地都是找尽可能大的 $p(\mathcal{D} \mid \theta)$

我们回头整理下 [Expectation-Maximization Algorithm](/machine-learning/2014/12/28/expectation-maximization-algorithm) 里的公式：

- E-step：写出 $Q(\theta,\theta^{(t-1)}) = E \left [ \log \, p(\mathcal{D},\mathcal{H} \vert \theta) \mid \mathcal{D}, \theta^{(i-1)} \right ] = \sum_{\mathcal{H}} p(\mathcal{H} \mid \mathcal{D}, \theta^{t-1}) \log \, p(\mathcal{D}, \mathcal{H} \mid \theta)$。注意这是 general 的写法，具体对 latent label 的情况，有 $Q(\theta,\theta^{(t-1)}) = \sum_{\mathbf{\psi_i} \in \Psi}{p(\mathbf{y} =\psi_i \vert  \mathcal{X}, \theta^{(t-1)}) \log \, p(\mathcal{X},\mathbf{y} = \psi_i \vert \theta)}$
- M-step：求 \theta^{(t)} = \underset{\theta}{\operatorname{argmax}} Q(\theta,\theta^{(t-1)})
- Repeat E- and M-steps until $\theta^{(t)}$ converges