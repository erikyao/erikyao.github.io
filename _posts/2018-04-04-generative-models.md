---
category: Machine-Learning
description: ''
tags:
- generative
title: Generative Models
---

参考自 [Introduction to Semi-Supervised Learning](https://www.morganclaypool.com/doi/abs/10.2200/S00196ED1V01Y200906AIM006)。

-----

```java
public interface MixtureModel {
    public Assumption asm = "If we knew how the instances from each class are distributed, we may decompose the mixture (of instances) into individual classes.";
}

public abstract class GenerativeModel {
    private ConditionalProbability cp;
    private PriorProbability pp;
    private ClassConditionalProbabability cpp;
    
    public ConditionalProbability calculateConditionalProbability() {
        this.cp = Bayes.calculateConditionalProbabilityFrom(this.pp, this.cpp)
    }

    public generateXY() {
        return this.cp.generate()
    }
}

public class GaussianMixtureModel extends GenerativeModel implements MixtureModel {
    private ParameterSet theta;
    
    public GaussianMixtureModel(x, y) {
        this.theta = Algortithm.MLE(x, y);
        
        this.pp = new PriorProbability(new MultivariateGaussianDistribution(theta, x, y));
        this.cpp = new ClassConditionalProbabability(new DiscreteDistribution(theta, y));
    }
}

public class MultinomialMixtureModel extends GenerativeModel implements MixtureModel {
    private ParameterSet theta;
    
    public MultinomialMixtureModel(x, y) {
        this.theta = Algortithm.MLE(x, y);
        
        this.pp = new PriorProbability(new MultinomialDistribution(theta, x, y));
        this.cpp = new ClassConditionalProbabability(new DiscreteDistribution(theta, y));
    }
}

public class HiddenMarkovModel extends GenerativeModel implements MixtureModel {
    // TODO
}
```

假设有一个 test data point $\mathbf{x} \in \mathcal{X}$，我们要 predict its class label $y$，无非就下面两种做法 (假设 label 的值域是 $\Psi$; 最常见的就是 $\Psi = \lbrace True, False \rbrace$)：

1. 算出所有的 $p(y=\psi_1 \mid \mathbf{x}), \dots, p(y=\psi_n \mid \mathbf{x})$，预测 label 为 $\hat y = \underset{\psi}{\operatorname{argmax}} p(y=\psi \mid \mathbf{x})$
2. 不算具体的 $p(y=\psi_1 \mid \mathbf{x}), \dots, p(y=\psi_n \mid \mathbf{x})$ 的值，只求它们之间的大小关系，预测 label 为 $\hat y = \psi_k \iff \forall j \neq k, p(y=\psi_j \mid \mathbf{x}) < (y=\psi_k \mid \mathbf{x})$

思路 1 引申出 generative models；思路 2 引申出 discriminative models。

我们接着看下思路 1 是如何引出 generative models 的。

按 Bayes rule 展开：

$$
p(y \mid \mathbf{x}) = \frac{p(\mathbf{x} \mid y) p(y)}{p(\mathbf{x})} = \frac{p(\mathbf{x} \mid y) p(y)}{\sum_{\psi \in \Psi}p(\mathbf{x} \mid \psi) p(\psi)}
$$

我们称：

- $p(y \mid \mathbf{x})$: conditional probability (distribution)
- $p(\mathbf{x} \mid y)$: class conditional probability (distribution)
- $p(y)$: prior probability (distribution)

Furthermore, one can hypothetically “generate” i.i.d. instance-label pairs $(\mathbf{x}, y)$ from these probability distributions by repeating the following two steps, **hence the name generative model**:

1. Sample $y \sim p(y)$. In the alien example, one can think of $p(y)$ as the probability of heads of a biased coin. Flipping the coin then selects a gender.
1. Sample $x ∼ p(\mathbf{x} \mid y)$. In the alien example, this samples a two-dimensional feature vector to describe an alien of the gender chosen in step 1.
    - 经过这两步 sample 我们最终可以得到 $p(\mathbf{x}, y) = p(\mathbf{x} \mid y) p(y)$，是为 joint distribution of instances and labels

> Alien example: For a specific alien, $\mathbf{x}$ is the `(weight, height)` feature vector, and $p(y \mid \mathbf{x})$ is a probability distribution over two outcomes: `male` or `female`. That is, $p(y = male \mid \mathbf{x}) + p(y = female \mid \mathbf{x}) = 1$. There are infinitely many $p(y \mid \mathbf{x})$ distributions, one for each feature vector $\mathbf{x}$.

我们这里要搞清楚：我们是要解决一个 classification 的问题，然后有了思路 1，接着得到一个 model，恰好这个 model 有 generative 的特性，所以我们叫它 generative model。更重要的是，我们看到 generative model 要立马能回想到思路 1 以及我们要解决的是 classification 问题，它怎么 generate 我觉得并不是最重要的点。

**我们还应该把 generative model 看做是一个 interface**。因为 $p(y)$ 基本是个 discrete distribution，各个 $p(y = \psi_i)$ 的值都是知道的（从 training data 做估计）；但是 $p(\mathbf{x} \mid y)$ 就五花八门了：

- 对 continuous feature vectors $\mathbf{x}$，最常见的 $p(\mathbf{x} \mid y)$ 是 **Multivariate Gaussian Distribution**。此时我们称这个 overall generative model 为 **Gaussian Mixture Model (GMM)**
- 对 count vectors $\mathbf{x}$ (e.g. in text categorization, $\mathbf{x}$ is the vector of word counts in a document)，常用的 $p(\mathbf{x} \mid y)$ 是 **Multinomial Distribution**。此时我们称这个 overall generative model 为 **Multinomial Mixture Model**
- **Hidden Markov Model (HMM)** 也是 generative model 的一种具体实现

这有一点像 Strategy Pattern。

我们最后看一下 **maximum likelihood estimate (MLE)** 的角色。你 assume 了 distribution，没有 parameter 也没戏，MLE 就是用来做参数估计的。

Given training data $\mathcal{D}$, the MLE is

$$
\hat \theta = \underset{\theta}{\operatorname{argmax}} p(\mathcal{D} \mid \theta) = \underset{\theta}{\operatorname{argmax}} \log p(\mathcal{D} \mid \theta)
$$

**That is, the MLE is the parameter under which the data likelihood $p(\mathcal{D} \mid \theta)$ is the largest**. We often work with log likelihood $\log p(\mathcal{D} \mid \theta)$ instead of the straight likelihood $p(\mathcal{D} \mid \theta)$. They yield the same maxima since $\log()$ is monotonic, and log likelihood will be easier to handle.

In supervised learning when $\mathcal{D} = \lbrace (\mathbf{x}\_{i}, y\_{i}) \rbrace_{i=1}^l$, we can rewrite the log likelihood as

$$
\log p(\mathcal{D} \mid \theta) = \log \prod_{i=1}^{l} p(\mathbf{x}_i, y_i \mid \theta) = log \sum_{i=1}^{l} \log p(y_i \mid \theta) p(\mathbf{x}_i \mid y_i, \theta)
$$

where we used the fact that the probability of a set of i.i.d. events is the product of individual probabilities.

所以整个用 generative model 做 training 的过程就是：

1. 根据 $Y_{train}$ 估计 $p(y)$ distribution
1. 选择（i.e. 假定） $p(\mathbf{x} \mid y)$ 的 disribution 类型
1. 根据 $X_{train}$ 和 $Y_{train}$， 用 MLE 估计 $p(\mathbf{x} \mid y)$ 的 disribution 参数
1. 得到 $p(y \mid \mathbf{x})$ distribution
1. 对 test data point $\lbrace \mathbf{x}\_{test}, y\_{test} \rbrace$，predict label 为 $\hat y = \underset{\psi}{\operatorname{argmax}} p(y=\psi \mid \mathbf{\mathbf{x}_{test}})$
1. 根据 $y_{test}$、$\hat y$ 和 $p(y=\hat y \mid \mathbf{\mathbf{x}_{test}})$ 计算 metrics