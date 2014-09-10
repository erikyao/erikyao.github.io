---
layout: post-mathjax
title: "Common Distributions"
description: ""
category: Math
tags: [Math-Statistics]
---
{% include JB/setup %}

总结自 Coursera lecture [Statistical Inference](https://class.coursera.org/statinference-005/lecture) section [06 Common distributions](https://class.coursera.org/statinference-005/lecture/165)。  

部分参考 [The Poisson Distribution](http://www.umass.edu/wsp/resources/poisson/)

-----

## 1. The Bernoulli [bə:ˈnu:li] distribution

### 1.1 Definition

- Bernoulli random variables take a binary outcome, i.e. the value 1 or 0, with probabilities of _**p**_ and _**1-p**_ respectively
- The PMF for a Bernoulli random variable _X_ is \\( P(X=x) = p\^x (1-p)\^{1-x} \\)
- The mean of a Bernoulli random variable is \\( \mu = p \\) and the variance is \\( \sigma\^2 = p(1-p) \\)
- If we let _X_ be a Bernoulli random variable, it is typical to call _**X=1**_ as a "success" and _**X=0**_ as a "failure"

### 1.2 Binomial trials

iid is short for Independent and Identical Distributed

* Independent: statistically unrelated from one and another
* Identically Distributed: all having been drawn from the same population distribution

Binomial random variables:

- The **binomial random variables** are obtained as the sum of iid Bernoulli trials
- In specific, let \\( X_1,\ldots,X_n\\) be iid \\( Bernoulli(p) \\); then \\( X = \sum\_{i=1}\^n X_i \\) is a binomial random variable
- The binomial mass function is

	$$P(X=x) = 
	\left(
	\begin{array}{c}
	  n \\\\ x
	\end{array}
	\right)
	p\^x(1 - p)\^{n-x}
	$$
	for \\( x=0,\ldots,n \\)

### 1.3 The "Choose" notation

Recall that the notation 
  $$\left(
    \begin{array}{c}
      n \\\\ x
    \end{array}
  \right) = \frac{n!}{x!(n-x)!}
  $$ (read "n choose x") (BTW, n! reads "n factorial") counts the number of ways of selecting _**x**_ items out of _**n**_ without replacement disregarding the order of the items, i.e. \\( C\_n\^x \\). Specially, 

  $$\left(
    \begin{array}{c}
      n \\\\ 0
    \end{array}
  \right) =
  \left(
    \begin{array}{c}
      n \\\\ n
    \end{array}
  \right) =  1
  $$ 

### 1.4 Exercise

- Suppose a friend has 8 children, 7 of which are girls and none are twins
- If each gender has an independent 50% probability for each birth, what's the probability of getting 7 or more girls out of 8 births?

$$\left(
\begin{array}{c}
  8 \\\\ 7
\end{array}
\right) .5^{7}(1-.5)^{1}
+
\left(
\begin{array}{c}
  8 \\\\ 8
\end{array}
\right) .5^{8}(1-.5)^{0} \approx 0.04
$$

<pre class="prettyprint linenums">
choose(8, 7) * .5 ^ 8 + choose(8, 8) * .5 ^ 8 
## [1] 0.03516

pbinom(6, size = 8, prob = .5, lower.tail = FALSE) ## if lower.tail=TRUE (default), return P(X ≤ x), otherwise, return P(X > x). 所以这里是 return P(X > 6)
## [1] 0.03516
</pre>

## 2. The normal distribution

### 2.1 

- A random variable is said to follow a **normal** or **Gaussian** distribution with mean \\( \mu \\) and variance \\( \sigma\^2 \\) if the associated density is
  $$
  (2\pi \sigma\^2)\^{-1/2}e\^{-(x - \mu)\^2/2\sigma\^2}
  $$
  If _X_ is an RV (random variable) with this density, then \\( E[X] = \mu \\) and \\( Var(X) = \sigma\^2 \\)
- We write \\( X\sim \mbox{N}(\mu, \sigma\^2) \\)
- When \\( \mu = 0 \\) and \\( \sigma = 1 \\), the resulting distribution is called **the standard normal distribution**
- The standard normal density function is labeled \\( \phi(x) = (2\pi)\^{-1/2}e\^{-x\^2/2} \\)
- Standard normal RVs are often labeled **Z**

### 2.2 Facts about the normal density

- If \\( X \sim \mbox{N}(\mu,\sigma\^2) \\), then $$ Z = \frac{X - \mu}{\sigma} \sim \mbox{N}(0,1) $$ i.e. **Z** is standard normal
- If **Z** is standard normal, then $$X = \mu + \sigma Z \sim \mbox{N}(\mu, \sigma\^2)$$
- The non-standard normal density is $$\frac{\phi\(\frac{x - \mu}{\sigma})}{\sigma}$$

<!-- -->

1. Approximately **68%**, **95%** and **99%** of the normal density lies within **1**, **2** and **3** standard deviations from the mean, respectively
2. **-1.28**, **-1.645**, **-1.96** and **-2.33** are the **10^th**, **5^th**, **2.5th** and **1^st** percentiles of the standard normal distribution respectively
3. By symmetry, **1.28**, **1.645**, **1.96** and **2.33** are the **90^th**, **95^th**, **97.5^th** and **99^th** percentiles of the standard normal distribution respectively

### 2.3 Other properties

- The normal distribution is symmetric and peaked about its mean, therefore the mean, median and mode are all equal
- A constant times a normally distributed random variable is also normally distributed
- Sums of normally distributed random variables are again normally distributed even if the variables are dependent
- Sample means of normally distributed random variables are again normally distributed
- The square of a **standard** normal random variable follows what is called the **chi-squared** distribution 
- The exponent of a normally distributed random variables follows what is called the **log-normal** distribution 

### 2.4 Exercise

#### 2.4.1 What is the 95^th percentile of a \\( N(\mu, \sigma\^2) \\) distribution? 

- Quick answer in R `qnorm(.95, mean = mu, sd = sd)`
- We want the point \\( x_0 \\) so that \\( P(X \leq x_0) = .95 \\)
$$
  \begin{eqnarray\*}
    P(X \leq x_0) & = & P\left(\frac{X - \mu}{\sigma} \leq \frac{x_0 - \mu}{\sigma}\right) \\\\ \\\\
                  & = & P\left(Z \leq \frac{x_0 - \mu}{\sigma}\right) = 0.95
  \end{eqnarray\*}
$$
- Therefore
  $$\frac{x_0 - \mu}{\sigma} = 1.645$$
  or \\( x_0 = \mu + 1.645\sigma  \\)
- In general \\( x_0 = \mu + z\_0\sigma \\) where \\( z_0 \\) is the appropriate standard normal quantile

#### 2.4.2 What is the probability that a \\( \mbox{N}(\mu,\sigma\^2) \\) RV is 2 standard deviations above the mean?

- We want to know
$$
  \begin{eqnarray\*}
  P(X > \mu + 2\sigma) & = & 
P\left(\frac{X -\mu}{\sigma} > \frac{\mu + 2\sigma - \mu}{\sigma}\right)    \\\\ \\\\
& = & P(Z \geq 2 ) \\ \\ 
& \approx & 2.5\%
  \end{eqnarray\*}
$$

#### 2.4.3 Clicks Problem I

Assume that the number of daily ad clicks for a company is approximately normal distributed with a mean of 1020 and a stadard deviation of 50. What is the probablity of getting more than 1160 clicks in a day?

* First thought: it is not very likely, 1160 is 2.8 standard deviations from the mean

<pre class="prettyprint linenums">
pnorm(1160, mean = 1020, sd = 50, lower.tail = FALSE)
## [1] 0.002555

pnorm(2.8, lower.tail = FALSE)
## [1] 0.002555
</pre>

#### 2.4.4 Clicks Problem II

What number of daily ad clicks would represent the one where 75% of days have fewer clicks?

<pre class="prettyprint linenums">
qnorm(0.75, mean = 1020, sd = 50)
## [1] 1054
</pre>

## 3. The Poisson distribution

### 3.1 Definition

* The Poisson mass function is
$$
P(X = x; \lambda) = \frac{\lambda\^x e\^(-\lambda)}{x!}
$$
for \\( x=0,1,\ldots \\)
* The mean of this distribution is \\( \mu = \lambda \\)
* The variance of this distribution is \\( \sigma\^2 = \lambda \\)
* Notice that _**x**_ ranges \\( [0,\infty] \\)

### 3.2 Some uses for the Poisson distribution

The Poisson distribution applies when:

1. the event is something that can be counted in whole numbers; 
1. occurrences are independent, so that one occurrence neither diminishes nor increases the chance of another; 
1. the average frequency of occurrence for the time period in question is known; 
1. and it is possible to count how many events have occurred, 

such as the number of times a firefly lights up in my garden in a given 5 seconds, some evening, but meaningless to ask how many such events have not occurred.

When _**n**_ is large and _**p**_ is small:

* Poisson distribution can be used to approximate binomials 

### 3.3 Rates and Poisson random variables

* Poisson random variables are used to model rates
* If \\( X \sim Poisson(\lambda) \\) on 1 unit interval, then \\( Y \sim Poisson(k\lambda) \\) on _**k**_ unit intervals.
  * \\( \lambda = E[\frac{Y}{k}] \\) is the expected count per time unit (i.e. rate)
  * _**k**_ means the total monitoring process takes _**k**_ time units
  
### 3.4 Exercise: Rate

The number of people that show up at a bus stop is Poisson with a mean of **2.5** per hour. If watching the bus stop for **4** hours, what is the probability that **3** or fewer people show up for the whole time?

<pre class="prettyprint linenums">
ppois(3, lambda = 2.5 * 4)
## [1] 0.01034
</pre>

### 3.5 Poisson approximation to the binomial

* When _**n**_ is large and _**p**_ is small, the Poisson distribution is an accurate approximation to the binomial distribution
* Notation
  * \\( X \sim \mbox{Binomial}(n, p) \\)
  * \\( \lambda = n p \\) and
	  * _**n**_ gets large 
	  * _**p**_ gets small
	  * \\( \lambda \\) stays constant


### 3.6 Exercise: Poisson approximation to the binomial

We flip a coin with success probablity **0.01** five hundred times. What's the probability of 2 or fewer successes?

<pre class="prettyprint linenums">
pbinom(2, size = 500, prob = .01)
## [1] 0.1234

ppois(2, lambda=500 * .01)
## [1] 0.1247
</pre>
