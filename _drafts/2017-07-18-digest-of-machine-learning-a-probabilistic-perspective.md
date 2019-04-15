---
layout: post
title: "Digest of <i>Machine Learning - A Probabilistic Perspective</i>"
description: ""
category: Machine-Learning
tags: []
---
{% include JB/setup %}

## 1. Introduction

### 1.1 Machine learning: what and why?

#### 1.1.1 Types of machine learning

- Predictive / Supervised Learning
    - When $y_i$ is categorical, the problem is known as **classification** or **pattern recognition**
    - When $y_i$ is real-valued, the problem is known as **regression**. 
        - Another variant, known as **ordinal regression**, occurs where label space $\mathcal Y$ has some natural ordering, such as grades A–F.
- Descriptive / Unsupervised Learning / Knowledge Discovery
- Reinforcement Learning
    - Learning how to act or behave when given occasional reward or punishment signals. 

### 1.2 Supervised learning

#### 1.2.1 Classification

One way to formalize classification problem is as **function approximation**. We assume $y = f(\mathbf x)$ for some unknown function $f$, and the goal of learning is to estimate the function $f$ given a labeled training set, and then to make predictions using $\hat y = \hat f(\mathbf x)$. (We use the hat symbol to denote an estimate.) Our main goal is to make predictions on novel inputs, meaning ones that we have not seen before (this is called **generalization**, generalizing beyond the training data), since predicting the response on the training set is easy (we can just look up the answer).

##### 1.2.1.2 The need for probabilistic predictions

Suppose $y \in \lbrace 1, \dots, C \rbrace$. We denote the probability distribution over possible labels, given the input vector $\mathbf x$ and training set $\mathcal D$ by $p(y \mid \mathbf x, \mathcal D)$. In general, this represents a vector of length $C$.

- We are also implicitly conditioning on the form of model that we use to make predictions. When choosing between different models, we will make this assumption explicit by writing $p(y \mid \mathbf x, \mathcal D, M)$, where $M$ denotes the model. However, if the model is clear from context, we will drop $M$ from our notation for brevity.

Given a probabilistic output, we can always compute our “best guess” as to the “true label”using

$$
\hat y = \hat f(\mathbf x) = \underset{c=1, \dots, C}{\arg\max} p(y = c \mid \mathbf x, \mathcal D)
$$

This corresponds to the most probable class label, and is called the **mode** of the distribution $p(y \mid \mathbf x, \mathcal D)$; it is also known as a **MAP estimate** (MAP stands for **maximum a posteriori**).

### 1.3 Unsupervised learning

We can formalize unsupervised learning tasks as **density estimation**, that is, we want to build models of the form $p(\mathbf x_i \mid \theta)$. 

- Compared to supervised learning, we have written $p(\mathbf x_i \mid \theta)$ instead of $p(y_i \mid \mathbf x_i, \theta)$; that is, supervised learning is conditional density estimation, whereas unsupervised learning is unconditional density estimation. 
- Second, $p(\mathbf x_i \mid \theta)$ is a **multivariate** probability model while $p(y_i \mid \mathbf x_i, \theta)$ is usually a **univariant** probability model which significantly simplifies the problem.

### 1.4 Some basic concepts in machine learning

#### 1.4.1 Parametric vs non-parametric models

In this book, we will be focussing on probabilistic models of the form $p(y \mid \mathbf x)$ or $p(\mathbf x)$, depending on whether we are interested in supervised or unsupervised learning respectively. There are many ways to define such models, but the most important distinction is this: 

- Does the model have a fixed number of parameters?
    - $\Rightarrow$ a **parametric model**
- Or does the number of parameters grow with the amount of training data? 
    - $\Rightarrow$ a **non-parametric model** 
- Parametric models have the advantage of often being faster to use, but the disadvantage of making stronger assumptions about the nature of the data distributions. 
- Non-parametric models are more flexible, but often computationally intractable for large datasets.

#### 1.4.2 A simple non-parametric classifier: $K$-nearest neighbors

#### 1.4.3 The curse of dimensionality

#### 1.4.4 Parametric models for classification and regression

The main way to combat the curse of dimensionality is to make some assumptions about the nature of the data distribution (either $p(y \mid \mathbf x)$ for a supervised problem or $p(\mathbf x)$ for an unsupervised problem). These assumptions, known as **inductive bias**, are often embodied in the form of a parametric model.

#### 1.4.5 Linear regression

$$
y(\mathbf x) = \mathbf w^T \mathbf x + \epsilon
$$

where $\epsilon$ is the the **residual error** between our linear predictions and the true response. We often assume that $\epsilon$ has a Gaussian or normal distribution. We denote this by $\epsilon \sim \mathcal N (\mu, \sigma^2 )$

To make the connection between linear regression and Gaussians more explicit, we can rewrite the model in the following form:

$$
p(y \mid \mathbf x, \mathbf \theta) = \mathcal N (y \mid \mu(\mathbf x), \sigma^2(\mathbf x))
$$

In the simplest case, we assume $\mu$ is a linear function of $\mathbf x$, so $\mu(\mathbf x) = \mathbf w^T \mathbf x$, and that the noise is fixed, $\sigma^2(\mathbf x) = \sigma^2$. In this case, $\mathbf \theta = (\mathbf w, \sigma^2)$ are the parameters of the model.

Linear regression can be made to model non-linear relationships by making $\mu(\mathbf x)$ a non-linear function of the inputs. E.g.

- Suppose $\mathbf x = (1, x_1)$
- $\mu(\mathbf x) = \mathbf w^T \mathbf x = w_0 + w_1 x_1$ is a linear function of $\mathbf x$
- Let $\phi(\mathbf x) = (1, x_1, x_1^2, \dots, x_1^d)$. Then $\mu(\mathbf x) = \mathbf w^T \phi(\mathbf x)$ is a non-linear function of $\mathbf x$.
    - N.B. "non-linear of $\mathbf x$" does not necessarily mean $\mathbf x^n$

Then we get:

$$
p(y \mid \mathbf x, \mathbf \theta) = \mathcal N (y \mid \mathbf w^T \phi(\mathbf x), \sigma^2(\mathbf x))
$$

This is known as **basis function expansion**, and when $\phi(\mathbf x) = (1, x_1, x_1^2, \dots, x_1^d)$, it turns into a **polynomial regression** problem.

#### 1.4.6 Logistic regression

We can generalize linear regression to the (binary) classification setting by making two changes. 

- First we replace the Gaussian distribution for $y$ with a Bernoulli distribution, which is more appropriate for the case when the response is binary, $y \in \lbrace 0, 1\rbrace$. 

That is, we use 

$$
p(y \mid \mathbf x, \mathbf w) = \operatorname{Ber}(y \mid \mu(\mathbf x))
$$ 

where $\mu(\mathbf x) = \mathbb{E}[y \mid \mathbf x] = p(y=1 \mid \mathbf x)$. (老实说我觉得这里有循环定义之嫌……)

- Second, we compute a linear combination of the inputs as before, but then we pass this through a function that ensures $0 \le \mu(\mathbf x) \le 1$ by defining $\mu(\mathbf x) = \operatorname{sigm}(\mathbf w^T \mathbf x)$ where $\operatorname{sigm}(\eta)$ refers to the **sigmoid** function, also known as the **logistic** or **logit** function.

This is defined as

$$
\operatorname{sigm}(\eta) \triangleq \frac{1}{1+\operatorname{exp}(-\eta)} = \frac{e^{\eta}}{e^{\eta} + 1}
$$

The term “sigmoid” means S-shaped. It is also known as a **squashing function**, since it maps the whole real line to $[0, 1]$, which is necessary for the output to be interpreted as a probability.

Putting these two steps together we get

$$
p(y \mid \mathbf x, \mathbf w) = \operatorname{Ber}(y \mid \operatorname{sigm}(\mathbf w^T \mathbf x))
$$ 

This is called logistic regression due to its similarity to linear regression **(although it is a form of classification, not regression!)**.

A simple example of logistic regression is $p(y = 1 \mid \mathbf x, \mathbf w) = \operatorname{sigm}(w_0 + w_1 x_1)$ where $\mathbf x = (1, x_1)$

#### 1.4.7 Overfitting

When we fit highly flexible models, we need to be careful that we do not overfit the data, that is, we should avoid trying to model every minor variation in the input, since this is more likely to be noise than true signal. 

#### 1.4.8 Model selection

#### 1.4.9 No free lunch theorem

> All models are wrong, but some models are useful. — George Box (Box and Draper 1987, p424).12

We can use methods such as cross validation to empirically choose the best method for our particular problem. However, there is no universally best model — this is sometimes called the no free lunch theorem (Wolpert 1996). The reason for this is that a set of assumptions that works well in one domain may work poorly in another.

## 2. Probability

### 2.2 A brief review of probability theory

#### 2.2.4 Independence and conditional independence

![](https://farm5.staticflickr.com/4295/35221390583_ec4d621f70_o_d.png)

Computing $p(x, y) = p(x)p(y)$, where $X \bot Y$. Here $X$ and $Y$ are discrete random variables; $X$ has 6 possible states (values) and $Y$ has 5 possible states. A general joint distribution on two such variables would require $(6 × 5) − 1 = 29$ parameters to define it (we subtract 1 because of the sum-to-one constraint). By assuming (unconditional) independence, we only need $(6 − 1) + (5 − 1) = 9$ parameters to define $p(x, y)$.

- 注意这里的 parameter 其实是 $p(x_i, y_j)$

### 2.3 Some common discrete distributions

#### 2.3.2 The multinomial and multinoulli distributions

Suppose we toss a $K$-sided die $n$ times. To model the outcomes, we can use the multinomial distribution. Let $\mathbf x = (x_1, \dots, x_K)$, a random vector where $x_j$ is the number of times side $j$ of the die occurs, represent the outcomes of $n$ tosses. Thus, 

$$
\operatorname{sum}(\mathbf x) = \sum_{j=1}^{K}x_j = n
$$

Then $\mathbf x$ has the following pmf:

$$
\operatorname{Mu}(\mathbf x \mid n, \mathbf \theta) \triangleq {n \choose {x_1,\dots,x_K}} \prod_{j=1}^{K}\theta^{x_j}_j
$$

where $\theta_j$ is the probability that side $j$ shows up, and 

$$
{n \choose {x_1,\dots,x_K}} \triangleq \frac{n!}{x_1! \dots x_K!}
$$

is the multinomial coefficient.

| Dist Name  | $n$ | $K$ | $x_j$ | $\mathbf x$ |
| ---------- | --- | --- | ----- | ----------- |
| Bernoulli  | 1 | 2 | $x_j \in \lbrace 0, 1 \rbrace$ | $\mathbf x = (x_1, x_2)$ (not necessary) |
| Multinoulli/ Categorical/ Discrete | 1 | >2 | $x_j \in \lbrace 0, 1 \rbrace$ | $\mathbf x = (x_1, \dots, x_K), \mathbf x \in \lbrace 0, 1 \rbrace^K$; <br/>we call $\mathbf x$ dummy / one-hot / 1-of-$K$ encoding of the categorical random variable $x$ ($1 \leq x \leq K$) |
| Binomial   | >1 | 2 | $x_j \in \lbrace 0, 1, \dots, n \rbrace$ | $\mathbf x = (x_1, x_2)$ |
| Multinomial | >1 | >2 | $x_j \in \lbrace 0, 1, \dots, n \rbrace$ | $\mathbf x = (x_1, \dots, x_K)$, <br/>$\mathbf x \in \lbrace 0, 1, \dots, n \rbrace^K$ |

For categorical distribution, define categorical random variable $x$ ($1 \leq x \leq K$) as the outcome, i.e. $x=j \iff x_j = 1$, meaning side $j$ shows up. Then we can use the following notation: 

$$
\operatorname{Cat}(x \mid \mathbf \theta) \triangleq \operatorname{Mu}(\mathbf x \mid 1, \mathbf \theta) = \prod_{j=1}^K \theta_{j}^{x_j}
$$

In otherword, if $x \sim \operatorname{Cat}(\mathbf \theta)$, then $p(x=j \mid \mathbf \theta) = \theta_j$.

Similarly, for binomial distribution, define $x$ as: $x = t \iff x_1 = t$. Then

$$
\begin{align*}
p(x = t) = \operatorname{Mu}(\mathbf x \mid n, \mathbf \theta) &= {n \choose {x_1,\dots,x_K}} \prod_{j=1}^2 \theta_{j}^{x_j} \newline 
                                                               &= \frac{n!}{t! (n-t)!} \theta_1^{t} \theta_2^{n-t} \newline 
                                                               &= {n \choose t} \theta_1^{t} (1-\theta_1)^{n-t}
\end{align*}
$$

#### 2.3.3 The Poisson distribution

#### 2.3.4 The empirical distribution

### 2.4 Some common continuous distributions

#### 2.4.1 Gaussian (normal) distribution

We will often talk about the **precision** of a Gaussian, by which we mean the **inverse variance**: $\lambda = \frac{1}{\sigma^2}$. A high precision means a narrow distribution (low variance) centered on $\mu$



Table 7.1

- http://web.stanford.edu/~rjohari/teaching/notes/226_lecture16_inference.pdf
- http://web.ics.purdue.edu/~jltobias/BayesClass/lecture_notes/regmodel_student.pdf
- https://fisher.osu.edu/~schroeder.9/AMIS900/ech6.pdf