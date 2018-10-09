---
layout: post
title: "Scaling / Normalization / Standardization"
description: ""
category: Math
tags: []
---
{% include JB/setup %}


## 1. Scaling

这个简单，scaling 一般指 $\mathbf{x} \mapsto c \mathbf{x}$ 或者 $\mathbf{x} \mapsto \frac{\mathbf{x}}{c}$ 的变形。

## 2. Standardization

使数据符合 standard normal distribution $X \sim \mathcal{N} (\mu=0, \sigma^{2}=1)$ 的变形，它包含两步：

1. centering: $\mathbf{x} \mapsto \mathbf{x} - \operatorname{mean}(\mathbf{x})$
2. scaling by standard deviation: $\mathbf{x} \mapsto \frac{\mathbf{x}}{\operatorname{std}(\mathbf{x})}$

注意:

- $\mu$ 是 $\operatorname{mean}(\mathbf{x})$
- $\sigma^{2}$ 是 variance $\operatorname{var}(\mathbf{x})$
- $\sigma$ 是 standard deviation (也叫 unit variance) $\operatorname{std}(\mathbf{x})$

所以合起来就是：$\mathbf{x} \mapsto \frac{\mathbf{x} - \operatorname{mean}(\mathbf{x})}{\operatorname{std}(\mathbf{x})}$。

另外，对单个的 scalar $x_i$ 而言，$\frac{x_i - \operatorname{mean}(\mathbf{x})}{\operatorname{std}(\mathbf{x})}$ 称为 $x_i$ 的 **z-score**。

## 3. Normalization

### 3.1 Norm

Quote from [Wikipedia: Norm (mathematics)](https://en.wikipedia.org/wiki/Norm_(mathematics)#Definition):

Given a vector space $V$ over a subfield $F$ of the complex numbers, a norm on $V$ is a nonnegative-valued scalar function $p: V \to [0,+\infty)$ with the following properties:

$\forall c \in F, \mathbf{u}, \mathbf{v} \in V$,

1. $p(\mathbf{u} + \mathbf{v}) ≤ p(\mathbf{u}) + p(\mathbf{v})$
1. $p(c \mathbf{v}) = \vert c \vert p(\mathbf{v})$
1. If $p(\mathbf{v}) = 0$ then $\mathbf{v} = \mathbf{0}$ is the zero vector.

常见的 norm 有：

- $L_1$ norm：$\Vert \mathbf{x} \Vert\_1 = \sum\_{i=1}^{n} \vert x\_i \vert$
- $L_2$ norm：$\Vert \mathbf{x} \Vert\_2 = \sqrt{\sum\_{i=1}^{n} x\_i^2}$
- max norm：$\Vert \mathbf{x} \Vert\_{\infty} = \max(\vert x_1 \vert, \dots, \vert x_n \vert)$

### 3.2 Normalization Scenario 1: Algebra

我们常说 "把一个 vector normalize 成一个 unit vector"，这其实是一个 $\mathbf{v} \mapsto \frac{\mathbf{v}}{\Vert \mathbf{v} \Vert\_{?}}$ 的变形 (即把向量除以它自身的 norm)。

我们可以看到:

- $\Vert \frac{\mathbf{v}}{\Vert \mathbf{v} \Vert\_{1}} \Vert\_1 = 1$
- $\Vert \frac{\mathbf{v}}{\Vert \mathbf{v} \Vert\_{2}} \Vert\_2 = 1$
- $\Vert \frac{\mathbf{v}}{\Vert \mathbf{v} \Vert\_{\infty}} \Vert\_{\infty} = 1$

我们经常可以看到 "normalization 把数据压缩到 $[0, 1]$ 区间内" 或者类似的说法，我觉得这可能来源于 "unit vector 的 norm 为 1" 这件事，但是要注意的是：

- unit vector 的 norm 为 1，只能说明各项 $x_i$ 的绝对值是在 $[0, 1]$ 区间内

### 3.3 Normalization Scenario 2: Statistics

在统计学上说 normalization，那意思就海了去了。从 [Normalization (statistics)](https://en.wikipedia.org/wiki/Normalization_(statistics)) 来看：

- standardization 是一种 normalization
- studentization 是一种 normalization
- min-max scaling 也是一种 normalization (而且它不符合我们的 scaling 定义)

### 3.4 The Problems with Normalization 

**我觉得统计学上 normalization 定义的最大的问题是：我看不到这些变形与 norm 的关系。**

然后随之而来的第二个问题：我怎么知道你说的 normalization 是 algebra 的还是 statistics 的？

比如 `sklearn.preprocessing.normalize`，我一直以为它做的是 standardization，但其实不是！

- sklearn 的 standardization 要用 `sklearn.preprocessing.StandardScaler`

它做的其实是 vector normalization，但是它的 max norm 又不是标准的：

```python
......:
    ......:
        # https://github.com/scikit-learn/scikit-learn/blob/bac89c2/sklearn/preprocessing/data.py#L1564
        if norm == 'l1':
            norms = np.abs(X).sum(axis=1)
        elif norm == 'l2':
            norms = row_norms(X)
        elif norm == 'max':
            norms = np.max(X, axis=1)  # You call this max norm???
        norms = _handle_zeros_in_scale(norms, copy=False)
        X /= norms[:, np.newaxis]
```

对于第二个问题，一个简单点的判别方法是：你看到 $L_1$、$L_2$ 这些字眼时，那必定是 algebra 的 normalization。但是事情发展成这样，才是最值得吐槽的。