---
layout: post
title: "Bernoulli vs Multinoulli (Categorical) vs Binomial vs Multinomial / Gaussian / Poisson Distributions"
description: ""
category: Math
tags: [Math-Statistics]
---
{% include JB/setup %}

参考：

- [Section 06 - Common distributions, Statistical Inference@Coursera](https://class.coursera.org/statinference-005/lecture/165)  
- [The Poisson Distribution](http://www.umass.edu/wsp/resources/poisson)
- [伯努利分布、二项分布、多项分布、Beta分布、Dirichlet分布](https://blog.csdn.net/Michael_R_Chang/article/details/39188321)
- [The Multinomial Model](http://www.utstat.toronto.edu/~brunner/oldclass/312f12/lectures/312f12MultinomialHandout.pdf)

-----

## 0. The "Choose" notation

- $n!$ reads "n factorial"
- ${n \choose x} = \frac{n!}{x!(n-x)!}$ reads "n choose x"

$n \choose x$ counts the number of ways of selecting $x$ objects out of $n$ without replacement disregarding the order of the items, i.e. $C_n^x$. 

Specially, 

$$
{n \choose 0} = {n \choose n} = 1
$$

其实可以扩展一下：假设有 $n$ 个 objects，分成 $c$ 类，我们抽取：

- $n_1$ 个 ojects of type $1$
- $n_2$ 个 ojects of type $2$
- $\dots$
- $n_c$ 个 ojects of type $c$
- $\sum_{i=1}^{c} n_i = n$

那么抽取的方式可以有 ${n \choose {n_1, \dots, n_c}} = \frac{n!}{n_{1}! \cdots n_{c}!}$ 种

## 1. Bernoulli vs Multinoulli (Categorical) vs Binomial vs Multinomial

简单说就是：

- $\operatorname{Bernoulli}(\pi_1)$ (伯努利分布)：抛硬币 **1次** 
- $\operatorname{Multinoulli}(\boldsymbol{\pi})$ (多努利分布): 投骰子 **$1$次**; a.k.a Categorical (范畴分布)
- $\operatorname{Binomial}(n, \pi_1)$ (二项分布)：抛硬币 **$n$次**
- $\operatorname{Multinomial}(n, \boldsymbol{\pi})$ (多项分布)：投骰子 **$n$次**
	
注意：

- **严格来说，这应该是 4 个 RVs，而不是 4 个 distributions**，但是这方面的混乱不是一天两天了
	- 更进一步来说，这是 4 个 **discrete** RVs
- 单独一个 $\pi_1$ 表示 "每一次 toss，得到 binary outcome $1$ 的概率"
	- 因为是 binary，所以 $\pi_0 = 1 - \pi_1$ 就省略了
- $\boldsymbol{\pi}$ 其实是一个 distribution：
	- $\boldsymbol{\pi} = \lbrace \pi_1, \dots, \pi_c \rbrace$ ($c$ 应该是一个 countable)
	- $\pi_i$ 表示 "每一次 toss，得到 categorical outcome $i$ 的概率"
	- $\sum_{i} \pi_i = 1$

这 4 者的关系是：

- $\operatorname{Multinoulli}(\lbrace \pi_1, 1-\pi_1 \rbrace) \sim \operatorname{Bernoulli}(\pi_1)$
- $\operatorname{Binomial}(1, \pi_1) \sim \operatorname{Bernoulli}(\pi_1)$
- $\operatorname{Multinomial}(1, \boldsymbol{\pi}) \sim \operatorname{Multinoulli}(\boldsymbol{\pi})$

If $X \sim \operatorname{Bernoulli}(\pi_1)$:

- $X$ is binary 
	- $\mathbb{P}(X=1) = \pi_1$
	- $\mathbb{P}(X=0) = 1-\pi_1$
- PMF $p_X(x) = \pi_1^x (1-\pi_1)^{1-x}$
- $\mathbb{E}[X] = \pi_1$ 
- $\operatorname{Var}(X) = \pi_1(1-\pi_1)$

If $X \sim \operatorname{Multinoulli}(\boldsymbol{\pi})$:

- $X$ is categorical
	- $\mathbb{P}(X=1) = \pi_1$
	- $\cdots$
	- $\mathbb{P}(X=c) = \pi_c$
- PMF $p_X(x) = \prod_{i=1}^c \pi_i^{I(x=i)}$

If $\mathbf{X} \sim \operatorname{Binomial}(n, \pi_1)$:

- $X = (n_1, n_0)$
	- $n_1$ 表示 "出现 outcome $1$ 的个数"
	- $n_0$ 表示 "出现 outcome $0$ 的个数"
	- $n_1 + n_0 = n$ (因为 toss 了 $n$ 次)
- $\mathbb{P}_X(n_1, n_0) = {n \choose {n_1, n_0}} \pi_1^{n_1} \, (1-\pi_1)^{n_0}$
- 但有时候为了省事，我们又可以令 $X = n_1 \times 1 + n_0 \times 0 = n_1$，所以有：
	- PMF $p_{X}(x) = {n \choose x} \pi_1^x(1-\pi_1)^{n-x}$, where $x = 0,\ldots,n$
	- 我不喜欢这种省事

If $\mathbf{X} \sim \operatorname{Multinomial}(n, \boldsymbol{\pi})$:

- $X = (n_1, n_2, \dots, n_c)$
	- $n_1$ 表示 "出现 outcome $1$ 的个数"
	- $\cdots$
	- $n_c$ 表示 "出现 outcome $c$ 的个数"
	- $\sum_{i=1}^c n_i = n$ (因为 toss 了 $n$ 次)
- $\mathbb{P}_X(n_1, \dots, n_c) = {n \choose {n_1, \dots, n_c}} \pi_1^{n_1} \dots \pi_c^{n_c}$

注意 Multinomial 和 Multivariate 的区别：

- Multivariate 一般指 compound RV，比如 $X = X_1,X_2$，然后 $X_1$ 和 $X_2$ 各有一个 distribution，合起来 $X$ 有一个 multivariate distribution
- Multinomial 有很强的 categorical/count 的性质

Exercise:

- Suppose a friend has 8 children, 7 of which are girls and none are twins
- If each gender has an independent 50% probability for each birth, what's the probability of getting 7 or more girls out of 8 births?

$$
{8 \choose 7} .5^{7}(1-.5)^{1} + {8 \choose 8} .5^{8}(1-.5)^{0} \approx 0.04
$$

```r
choose(8, 7) * .5 ^ 8 + choose(8, 8) * .5 ^ 8 
## [1] 0.03516

pbinom(6, size = 8, prob = .5, lower.tail = FALSE) ## if lower.tail=TRUE (default), return P(X ≤ x), otherwise, return P(X > x). 所以这里是 return P(X > 6)
## [1] 0.03516
```

## 2. Normal (Gaussian) Distribution

### 2.1 Definition

If $X \sim \mathcal{N}(\mu, \sigma^2)$, we call RV $X$ following a **normal** or **Gaussian** distribution with mean $\mu$ and variance $\sigma^2$:

- PMF $f(x) = \frac{1}{\sqrt{2 \pi \sigma^2} } e^{ - \frac{(x-\mu)^2}{2 \sigma^2}}$
- $E[X] = \mu$ and $Var(X) = \sigma^2$

The distribution of $\mathcal{N}(0, 1)$ is called **the standard normal distribution**:

- PMF $\phi(x) = \frac{1}{\sqrt{2 \pi} } e^{ - \frac{x^2}{2} }$

Standard normal RVs are often labeled $Z$:

- If $X \sim \mbox{N}(\mu,\sigma^2)$, then $Z = \frac{X - \mu}{\sigma} \sim \mbox{N}(0,1)$ i.e. $Z$ is standard normal
- If $Z$ is standard normal, then $X = \mu + \sigma Z \sim \mbox{N}(\mu, \sigma^2)$
- The non-standard normal density is $\frac{\phi(\frac{x - \mu}{\sigma})}{\sigma}$

Percentiles:

1. Approximately **68%**, **95%** and **99%** of the normal density lies within **1**, **2** and **3** standard deviations from the mean, respectively
2. **-1.28**, **-1.645**, **-1.96** and **-2.33** are the $10^{\text{th}}$, $5^{\text{th}}$, $2.5^{\text{th}}$ and $10^{\text{st}}$ percentiles of the standard normal distribution respectively
3. By symmetry, **1.28**, **1.645**, **1.96** and **2.33** are the $90^{\text{th}}$, $95^{\text{th}}$, $97.5^{\text{th}}$ and $99^{\text{th}}$ percentiles of the standard normal distribution respectively

Other properties:

- The normal distribution is symmetric and peaked about its mean, therefore the mean, median and mode are all equal
- A constant times a normally distributed random variable is also normally distributed
- Sums of normally distributed random variables are again normally distributed even if the variables are dependent
- Sample means of normally distributed random variables are again normally distributed
- The square of a **standard** normal random variable follows what is called the **chi-squared** distribution 
- The exponent of a normally distributed random variables follows what is called the **log-normal** distribution 

### 2.2 Exercise

#### 2.2.1 What is the $95^{\text{th}}$ percentile of a $N(\mu, \sigma^2)$ distribution? 

- Quick answer in R `qnorm(.95, mean = mu, sd = sd)`
- We want the point $x_0$ so that $ P(X \leq x_0) = .95 $

$$
\begin{eqnarray*}
	P(X \leq x_0) 
		& = P \left ( \frac{X - \mu}{\sigma} \leq \frac{x_0 - \mu}{\sigma} \right ) \newline
		& = P \left ( Z \leq \frac{x_0 - \mu}{\sigma} \right ) = 0.95
\end{eqnarray*}
$$

- Therefore $\frac{x_0 - \mu}{\sigma} = 1.645$ or $x_0 = \mu + 1.645\sigma$
- In general $x_0 = \mu + z_0 \sigma$ where $z_0$ is the appropriate standard normal quantile

#### 2.2.2 What is the probability that a $\mbox{N}(\mu,\sigma^2)$ RV is 2 standard deviations above the mean?

I.e. we want to know

$$
\begin{eqnarray*}
	P(X > \mu + 2\sigma) 
		& = P \left ( \frac{X -\mu}{\sigma} > \frac{\mu + 2\sigma - \mu}{\sigma} \right ) \newline
		& = P(Z \geq 2 ) \newline 
		& \approx 2.5\%
\end{eqnarray*}
$$

#### 2.2.3 Clicks Problem I

Assume that the number of daily ad clicks for a company is approximately normal distributed with a mean of 1020 and a stadard deviation of 50. What is the probablity of getting more than 1160 clicks in a day?

* First thought: it is not very likely, 1160 is 2.8 standard deviations from the mean

```r
pnorm(1160, mean = 1020, sd = 50, lower.tail = FALSE)
## [1] 0.002555

pnorm(2.8, lower.tail = FALSE)
## [1] 0.002555
```

#### 2.2.4 Clicks Problem II

What number of daily ad clicks would represent the one where 75% of days have fewer clicks?

```r
qnorm(0.75, mean = 1020, sd = 50)
## [1] 1054
```

## 3. Poisson distribution

### 3.1 Definition

* The Poisson mass function is
$$
P(X = x; \lambda) = \frac{\lambda^x e^{-\lambda}}{x!}, \text{ for } x=0,1,\ldots
$$
* The mean of this distribution is $\mu = \lambda$
* The variance of this distribution is $\sigma^2 = \lambda$
* Notice that $x$ ranges $[0,\infty]$

### 3.2 Some uses for the Poisson distribution

The Poisson distribution applies when:

1. the event is something that can be counted in whole numbers; 
1. occurrences are independent, so that one occurrence neither diminishes nor increases the chance of another; 
1. the average frequency of occurrence for the time period in question is known; 
1. and it is possible to count how many events have occurred, 

such as the number of times a firefly lights up in my garden in a given 5 seconds, some evening, but meaningless to ask how many such events have not occurred.

When $n$ is large and $p$ is small:

* Poisson distribution can be used to approximate binomials 

### 3.3 Rates and Poisson random variables

* Poisson random variables are used to model rates
* If $X \sim Poisson(\lambda)$ on 1 unit interval, then $Y \sim Poisson(k\lambda)$ on $k$ unit intervals.
  * $\lambda = E[\frac{Y}{k}]$ is the expected count per time unit (i.e. rate)
  * $k$ means the total monitoring process takes $k$ time units
  
### 3.4 Exercise: Rate

The number of people that show up at a bus stop is Poisson with a mean of **2.5** per hour. If watching the bus stop for **4** hours, what is the probability that **3** or fewer people show up for the whole time?

```r
ppois(3, lambda = 2.5 * 4)
## [1] 0.01034
```

### 3.5 Poisson approximation to the binomial

* When $n$ is large and $p$ is small, the Poisson distribution is an accurate approximation to the binomial distribution
* Notation
  * <!-- -->$X \sim \mbox{Binomial}(n, p)$
  * $\lambda = n p$ and
	  * $n$ gets large 
	  * $p$ gets small
	  * $\lambda$ stays constant

### 3.6 Exercise: Poisson approximation to the binomial

We flip a coin with success probablity **0.01** five hundred times. What's the probability of 2 or fewer successes?

```r
pbinom(2, size = 500, prob = .01)
## [1] 0.1234

ppois(2, lambda=500 * .01)
## [1] 0.1247
```
