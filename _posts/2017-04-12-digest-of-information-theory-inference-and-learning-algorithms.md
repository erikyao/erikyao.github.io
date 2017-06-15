---
layout: post
title: "Digest of <i>Information Theory, Inference, and Learning Algorithms</i>"
description: ""
category: Math
tags: [Book]
---
{% include JB/setup %}

## 1. Introduction to Information Theory

### 1.1 How can we achieve perfect communication over an imperfect, noisy communication channel?

In some cases, if we transmit data, e.g., a string of bits, over the channel, there is some probability $f$ that the received message will not be identical to the transmitted message. We would prefer to have a communication channel for which this $f$ was 0 – or so close to 0 that for practical purposes it is indistinguishable from 0.

E.g.

- modem $\rightarrow$ phone line $\rightarrow$ modem
- Galileo $\rightarrow$ radio waves $\rightarrow$ Earth
- parent cell $\rightarrow$ $\begin{cases} \text{daughter cell A} \newline \text{daughter cell B} \end{cases}$
- RAM $\rightarrow$ Hard Drive $\rightarrow$ RAM

N.B. 当然也有主动引入 noise 的情况，比如你把一个 720p 转成 480p

考虑 1-bit data 的情况，send 时的 data 我们用 $x$ 表示，receive 到的 data 我们用 $y$ 表示：

- √：$P(y=0 \mid x=0) = 1-f$
- √：$P(y=1 \mid x=1) = 1-f$
- ×：$P(y=1 \mid x=0) = f$
- ×：$P(y=0 \mid x=1) = f$

N.B. This is a Binary Symmetric Channel, A.k.a BSC. In BSC model, a transmitter wishes to send a bit (a zero or a one), and the receiver receives a bit.

A useful disk drive would flip no bits at all in its entire lifetime. If we expect to read and write a gigabyte per day for ten years, we require a bit error probability of the order of 10 −15 , or smaller. There are two approaches to this goal.

- The physical solution： to improve the physical characteristics of the communication channel to reduce its error probability.
    - 简单说就是提高 channel 的产品工艺
    - 缺点是会提高 channel 的物理成本
- The 'system' solution: we accept the given noisy channel as it is and add communication ***systems*** to it so that we can detect and correct the errors introduced by the channel. 
    - We add an ***encoder*** before the channel and a ***decoder*** after it. 
        - The encoder encodes the source message $s$ into a transmitted message $t$, adding redundancy to $s$ in some way. 
        - The channel adds noise to $t$, yielding a received message $r$. 
        - The decoder uses the known redundancy introduced by the encoder to infer both the original signal $s$ and the added noise.
        - $s \xrightarrow[\text{add redundancy}]{\text{encoder}} t \xrightarrow[\text{may add noise}]{\text{channel}} r \xrightarrow[\text{infer}]{\text{decoder}} \hat{s}$
    - 新添加了 system 的 computational cost

***Information theory*** is concerned with the theoretical limitations and po- tentials of such systems. 'What is the best error-correcting performance we could achieve?' 

***Coding theory*** is concerned with the creation of practical encoding and decoding systems.

### 1.2 Error-correcting codes for BSC

#### Repetition codes

A straightforward idea is to repeat every bit of the message a prearranged number of times – for example, three times:

| $s$ | $t$ |
|:---:|:---:|
|  0  | 000 |
|  1  | 111 |

We call this repetition code $R_3$.

问题来了：如何 decode？$101$ 是 0 还是 1？$010$ 呢？

我们假设 $t=t_1t_2t_3, r=r_1r_2r_3$。 By Bayes' theorem, the ***posterior probability*** of $s$ is $P(s \mid r) = \frac{ P(r \mid s) P(s)}{P(r)}$

We can spell out the posterior probability of the two alternatives thus:

$$
\begin{align}
    P(s=1 \mid r) = \frac{ P(r \mid s = 1) P(s=1)}{P(r)} \newline
    P(s=0 \mid r) = \frac{ P(r \mid s = 0) P(s=0)}{P(r)}
\end{align}
$$

- $P(s)$ is the ***prior probability*** of $s$
- $P(r \mid s)$ is the ***likihood*** of $s$
- We assume that the prior probabilities are equal: $P(s = 0) = P(s = 1) = 0.5$; then maximizing the posterior probability $P(s \mid r)$ is equivalent to maximizing the likelihood $P(r \mid s)$. 
- And we assume that this BSC has noise level $f \le 0.5$,

So the likelihood is

$$
P(r \mid s) = P(r \mid t) = P(r_1r_2r_3 \mid t_1t_2t_3) = \prod_{i=1}^{3} P(r_i \mid t_i)
$$ 

where 

$$
P(r_i \mid t_i) = \begin{cases} 1 - f & \text{ if } r_i = t_i \newline f & \text{ if } r_i \neq t_i \end{cases}
$$

Thus the likelihood ratio for the two hypotheses is

$$
\frac{ P(r \mid s = 1) }{ P(r \mid s = 0) } = \prod_{i=1}^{3} \frac{ P(r_i \mid t_i = 1) }{ P(r_i \mid s_i = 0) }
$$

where each factor $\frac{ P(r_i \mid t_i = 1) }{ P(r_i \mid s_i = 0) }$ equals $\frac{1-f}{f}$ if $r_i = 1$, and $\frac{f}{1-f}$ if $r_i=0$.

We guess $\hat{s} = 1$ if $\frac{ P(r_i \mid t_i = 1) }{ P(r_i \mid s_i = 0) } > 1$ and $\hat{s} = 0$ otherwise.

Let's define $\gamma \equiv \frac{1-f}{f}$. $\gamma \ge 1$ since $f \le 0.5$. 假设 $r_i = 1$ 的个数为 $k$：

$$
\frac{ P(r \mid s = 1) }{ P(r \mid s = 0) } = \gamma^k \frac{1}{\gamma^{3-k}} = \gamma^{2k-3}
$$

所以 decode 的策略就是：数 $r_i = 1$ 的个数，$k \ge 2$ 时判定 $\hat{s} = 1$，否则判定 $\hat{s} = 0$。这个策略可以形象地理解为 majority vote: 每一个 $r_i$ 算一票，多数为 0 就判定为 0，多数为 1 就判定为 1。

而且这个 decode 还可以判断 noise 位置：若 $r_i \neg \hat{s}$，则可以判断第 $i$ 位是 noise。

使用 $R_3$ 依旧有可能传输出错，比如 $s=1 \rightarrow t=111 \rightarrow r=010 \rightarrow \hat{s}=0$

-----

*Exercise 1.2.* Show that the error probability is reduced by the use of $R_3$ by computing the error probability of this code for a BSC with noise level $f$.

Assume the probability of bit error is $p_b$ (注意 $p_b$ 是整个信息传递过程的出错概率，$f$ 仅仅是 channel 的出错概率)

Previous noise level: $p_b = f$

$R_3$ noise level: $p_b = f^3 + 3 f^2 (1-f)$

证明 $f^3 + 3 f^2 (1-f) < f$ 即可

*Exercise 1.3.*

The probability of error for $R_N$ is 

$$
p_b = \sum_{n=\lceil \frac{N}{2} \rceil}^{N} { N \choose n } f^n (1-f)^{N-n}
$$

(待补充)

-----

The repetition code $R_3$ has therefore reduced the probability of error, as desired. Yet we have lost something: our ***rate*** of information transfer (姑且理解为 $\frac{len(s)}{len(r)}$) has fallen to $\frac{1}{3}$.

#### Block codes – the $(7, 4)$ Hamming code

We would like to communicate with tiny probability of error and at a substantial rate. Can we improve on repetition codes? What if we add redundancy to ***blocks of data*** instead of encoding ***one bit*** at a time? We now study a simple ***block code***.

$\vert s \vert = K, \vert t \vert = N$. $N > k$ because we are adding redundancy.

In a ***linear block code***, the extra $N − K$ bits are linear functions of the original $K$ bits; these extra $N − K$ bits are called ***parity-check bits***. An example of a linear block code is the $(7, 4)$ Hamming code, which transmits $N = 7$ bits for every $K = 4$ source bits.

- parity: (of a number) the fact of being even or odd.

Let's define 

$$
\operatorname{parity}(x_1,\dots,x_n) = \left ( \sum_{i=1}^{n}x_i \right ) \bmod 2
$$

N.B. 这个 $\operatorname{parity}()$ 是个 linear function！linear 出来了！

- $t_1 = s_1$
- $t_2 = s_2$
- $t_3 = s_3$
- $t_4 = s_4$
- $t_5 = \operatorname{parity}(s_1, s_2, s_3)$
- $t_6 = \operatorname{parity}(s_2, s_3, s_4)$
- $t_7 = \operatorname{parity}(s_1, s_3, s_4)$

也可以从另一个角度理解 $t_5 t_6 t_7$: 比如对 $t_5$ 而言，$\operatorname{parity}(s_1, s_2, s_3, t_5) = 0$ 一定成立；$t_6$、$t_7$ 类似

Because the Hamming code is a linear code, it can be written compactly in terms of matrices as follows. The transmitted codeword $t$ is obtained from the source sequence $s$ by a linear operation,

$$
t = \textbf{G}^\intercal s,
$$

where $\textbf{G}$ is the ***generator matrix*** of the code,

$$
\textbf{G}^\intercal = \begin{bmatrix}
    1 & 0 & 0 & 0 \newline
    0 & 1 & 0 & 0 \newline
    0 & 0 & 1 & 0 \newline
    0 & 0 & 0 & 1 \newline
    1 & 1 & 1 & 0 \newline
    0 & 1 & 1 & 1 \newline
    1 & 0 & 1 & 1 
\end{bmatrix}
$$

and the encoding operation uses modulo-2 arithmetic ($1 + 1 = 0$, $0 + 1 = 1$, etc.). 

N.B. $t = \textbf{G}^\intercal s$ 的 dimension 是 $(7,1) = (7,4) \cdot (4,1)$

我觉得可以把 $\textbf{G}^\intercal$ 理解为 7 个 functions 的合体：

$$
\textbf{G}^\intercal(x) = \begin{bmatrix}
    \text{lambda } x: x[0] \newline
    \text{lambda } x: x[1] \newline
    \text{lambda } x: x[2] \newline
    \text{lambda } x: x[3] \newline
    \text{lambda } x: x[0] \oplus x[1] \oplus x[2] \newline
    \text{lambda } x: x[1] \oplus x[2] \oplus x[3] \newline
    \text{lambda } x: x[0] \oplus x[2] \oplus x[3] 
\end{bmatrix}
$$

注意有的教材会写成 $t = s \textbf{G}$，明显没有 $t = \textbf{G}^\intercal s$ 好理解（因为 $\textbf{G}$ 写出来是个 $(4,7)$）；这也说明，如果一个 matrix function 你看不懂的话，试试转置说不定会有用。

#### Syndrome decoding for the Hamming code

(待补充)

#### General view of decoding for linear codes: syndrome decoding

(待补充)

#### Summary of the $(7, 4)$ Hamming code's properties

(待补充)

#### Summary of codes' performances

(待补充)

### 1.3 What performance can the best codes achieve?

There seems to be a trade-off between the decoded bit-error probability $p_b$ (which we would like to reduce) and the rate $R$ (which we would like to keep large). How can this trade-off be characterized? What points in the $(R, p_b)$ plane are achievable? 

***Noisy-channel coding theorem***: For any channel, there exist codes that make it possible to communicate with ***arbitrarily small*** probability of error $p_b$ at non-zero rates. 

The maximum rate at which communication is possible with arbitrarily small $p_b$ is called the *capacity* of the channel. The formula for the capacity of a BSC with noise level $f$ is

$$
C(f) = 1 - H_2(f) = 1 - \left [ f \log_2 \frac{1}{f} + (1-f) \log_2 \frac{1}{1-f} \right ]
$$

A channel with noise level $f = 0.1$ has capacity $C \approx 0.53$.


> What performance are you trying to achieve? $10^{−15}$? You don't need sixty disk drives – you can get that performance with just two disk drives (since $1/2$ is less than $0.53$). And if you want $p_b = 10^{−18}$ or $10^{−24}$ or anything, you can get there with two disk drives too!


### 1.4 Summary

(待补充)

## 2. Probability, Entropy, and Inference

This chapter, and its sibling, Chapter 8, devote some time to notation. Just as the _White Knight_ distinguished between 

- the song, 
- the name of the song, and 
- what the name of the song was called (Carroll, 1998), 

we will sometimes need to be careful to distinguish between 

- a random variable, 
- the value of the random variable, and 
- the proposition (命题) that asserts that the random variable has a particular value. 

### 2.1 Probabilities and ensembles

An ***ensemble*** $X$ is a triple $(x, \mathcal{A}\_X, \mathcal{P}\_X)$, where the ***outcome*** $x$ is the value of a random variable, which takes on one of a set of possible values, $\mathcal{A}\_X = \lbrace a_1, a_2, \dots, a_I \rbrace$, having probabilities $\mathcal{P}\_X = \lbrace p_1, p_2, \dots, p_I \rbrace$, with $P(x = a_i ) = p_i$, $pi \geq 0$ and $\sum_{a_i \in \mathcal{A}\_X} P(x = a_i) = 1$.

- $\mathcal{A}$ means 'alphabet'.

$P(x = a_i)$ may be written as $P(a_i)$ or $P(x)$.

A ***joint ensemble*** $XY$ is an ensemble in which each outcome is an ordered pair $x, y$ (read '$x$ and $y$') with $x \in \mathcal{A}\_X = \lbrace a_1, a_2, \dots, a_I \rbrace$ and $y \in \mathcal{A}\_Y = \lbrace b_1, b_2, \dots, b_J \rbrace$. 

We call $P(x,y)$ the joint probability of $x$ and $y$. Commas are optional when writing ordered pairs, so $xy \iff x, y$.

N.B. In a joint ensemble $XY$ the two variables are not necessarily independent.

We can obtain the ***marginal probability*** $P(x)$ from the joint probability $P(x,y)$ by summation:

$$
P(x = a_i) \equiv \sum_{y \in \mathcal{A}\_Y} P(x = a_i, y)
$$

Similarly, using briefer notation, the marginal probability of $y$ is:

$$
P(y) \equiv \sum_{x \in \mathcal{A}\_X} P(x, y)
$$
 
N.B. 说到 marginal 的时候一定要记得是先有的 joint 才有的 marginal

Consider the set of bigrams $x,y$ in a corpus:

- The probability $P(y \mid x = \text{'q'})$ is the probability distribution of the second letter $y$ given that the first letter $x$ is a $\text{'q'}$.
- The probability $P(x \mid y = \text{'u'})$ is the probability distribution of the first letter $x$ given that the second letter $y$ is a $\text{'u'}$.

N.B. 注意这个描述方式！

***Product rule*** or ***chain rule***:

$$
P(x,y \mid \mathcal{H}) = P(x \mid y, \mathcal{H}) P(y \mid \mathcal{H}) = P(y \mid x, \mathcal{H}) P(x \mid \mathcal{H})
$$

N.B. $P(x \mid y, \mathcal{H})$ 应该理解为 $P(x \mid \left ( y, \mathcal{H} \right ))$ 而不是 $P(\left ( x \mid y \right ), \mathcal{H})$

### 2.2 The meaning of probability

Probabilities can be used in two ways.

- Probabilities can describe ***frequencies of outcomes in random experiments***
    - but giving noncircular definitions of the terms 'frequency' and 'random' is a challenge
- Probabilities can also be used, more generally, to describe ***degrees of belief*** in propositions that do not involve random variables, for example 
    - 'the probability that Mr. S. was the murderer of Mrs. S., given the evidence'
    - 'the probability that Shakespeare’s plays were written by Francis Bacon'

Thus probabilities can be used to describe assumptions, and to describe inferences given those assumptions. This more general use of probability to quantify beliefs is known as the ***Bayesian*** viewpoint. It is also known as the ***subjective*** (主观的；客观是 objective) interpretation of probability, since the probabilities depend on assumptions. Advocates of a Bayesian approach to data modelling and pattern recognition do not view this subjectivity as a defect, since in their view, 

> you cannot do inference without making assumptions.

N.B. Readers should be warned that this is not yet a globally held view. 

In non-Bayesian methods probabilities are allowed to describe ***only*** random variables, while Bayesians also use probabilities to describe ***inferences***.

### 2.3 Forward probabilities and inverse probabilities

我们先研究下 Generative Model 和 Discriminative Model。

#### Digress: Generative Models

[wikipedia: Generative model](https://en.wikipedia.org/wiki/Generative_model):

> In probability and statistics, a generative model is a model for randomly generating observable data values, typically given some hidden parameters.

有点难懂，啥叫 "randomly generating"？我们再看 [Quora: What is a generative model? - Jack Rae](https://www.quora.com/What-is-a-generative-model/answer/Jack-Rae?srid=mncz):

> A generative model describes how data is generated, in terms of a probabilistic model.

另外在 ML context 下：

> In the scenario of supervised learning, a generative model estimates the joint probability distribution of data $P(X, Y)$ between the observed data $X$ and corresponding labels $Y$.

这个描述就好懂多了。换言之，generative model 描述生成 examples 的规律，比如 $P(X=x_1) = 0.6$ 就表示 "生成 $x_1$ 的概率是 60%"；又比如 $X \sim \mathcal {N}(\mu ,\sigma ^{2})$ 就表示 "$X$ 的生成遵循高斯分布"。

也正如 [Quora: What is a generative model? - Eren Golge](https://www.quora.com/What-is-a-generative-model/answer/Eren-Golge?srid=mncz) 所说:

> Generative model assumes data is created by a particular distribution which is defined by a couple of parameters (Gaussian Distribution) or non-parametric variants...

常见的 generative models 有：

- Gaussians
- Mixtures of multinomials
- Naive Bayes
- Hidden Markov Models
- Latent Dirichlet Allocation

另外 [Generative vs. Discriminative Models](http://luizcoletta.com/blog/2015/09/07/generative-vs-discriminative-models/) 谈到：

- Pros:
    - We have the knowledge about the data distribution.
- Cons:
    - Very expensive to get (a lot of parameters);
    - Need lots of data.

这里谈到 parameter 又涉及到另外一个问题，如 [Cross Validated: Generative vs. discriminative - raegtin](https://stats.stackexchange.com/a/12456) 所言：

> Another way of thinking about this is that generative algorithms make some kind of structure assumptions on your model, but discriminative algorithms make fewer assumptions.

比如我们说 $X \sim \mathcal {N}(\mu ,\sigma ^{2})$ 是假设了它满足高斯分布的条件；必须先有这些假设，我们才能接着谈 parameter 的问题。

#### Digress: Discriminative Model

Discriminative 向来比 Generative 好理解，还是用 [Generative vs. Discriminative Models](http://luizcoletta.com/blog/2015/09/07/generative-vs-discriminative-models/) 的说法吧：

> Algorithms aim at learning $P(y|x)$ by using probabilistic approaches (e.g., logistic regression), or non-probabilistically by mapping classes from a set of points (e.g., perceptrons and SVMs).

- Pros:
    - Easy to model.
- Cons:
    - To classify, but not to generate the data.

回到正题。Probability calculations often fall into one of two categories: ***forward probability*** and ***inverse probability***. 

- Forward probability problems 
    - Involve a generative model of a process (这里这个 process 的意思就是指生成 examples 的 process)
    - The task is to compute the probability distribution.
        - 提出假设并求 parameter、计算 expectation、variance 等都算 forward problems
- Inverse probability problems 
    - Also involve a generative model of a process
    - Instead, we compute the conditional probability of one or more of the unobserved variables in the process, given the observed variables. 
        - 比如 HMM
    - This invariably requires the use of Bayes’ theorem.

#### Digress: Marginal Probability

大家都知道 $P(a,b)$ 是 joint probability ($P(A,B)$ 是 joint distribution)，$P(a \vert b)$ 是 conditional probability ($P(A \vert B)$ 是 conditional distribution)。那 marginal probability 是啥？其实很简单，marginal 一定是来自 joint 的 (by sum rule)，比如 $P(a) = \sum_{b \in B} P(a, b)$ 就是一个 marginal probability。有时候文章里会简单粗暴地说 "$P(a)$ 是一个 marginal probability；$P(A)$ 是一个 marginal distribution"，你要知道它一定是来自某个 joint，然后是 marginalized over 某个 $B$。

复杂一点的例子：$P(a \vert N) = \sum_{b \in B} P(a, b \vert N)$ 也是一个 marginal probability (of $a$ conditional on $N$).

#### Terminology of inverse probability

If $\theta$ denotes the unknown parameters, $D$ denotes the data, and $\mathcal{H}$ denotes the overall hypothesis space, the general equation:

$$
P(\theta \vert D, \mathcal{H}) = \frac{P(D \vert \theta, \mathcal{H}) P(\theta \vert \mathcal{H})}{P(D \vert \mathcal{H})}
$$

can be written:

$$
\text{posterior} = \frac{\text{likelihood} \times \text{prior}}{\text{evidence}}
$$

For a fixed $\theta_1 \in \theta$ and a fixed $D_1 \in D$:

- The conditional probability $P(\theta_1 \vert D_1, \mathcal{H})$ is called the ***posterior probability*** of $\theta_1$ given $D_1$
- The conditional probability $P(D_1 \vert \theta_1, \mathcal{H})$ is called the ***likelihood*** of parameter $\theta_1$
    - also probability of $D_1$ given $\theta_1$
- The marginal probability $P(\theta_1 \vert \mathcal{H})$ is called the ***prior probability*** of parameter $\theta_1$
- $P(D \vert \mathcal{H})$ is known as the ***evidence*** or ***marginal likelihood***

#### The likelihood principle

**The likelihood principle:** given a generative model for data $d$ given parameters $\theta$, $P(d \vert \theta)$, and having observed a particular outcome $d_1$, all inferences and predictions should depend only on the function $P (d_1 \vert \theta)$.

In spite of the simplicity of this principle, many classical statistical methods violate it.

### 2.4 Definition of entropy and related functions
