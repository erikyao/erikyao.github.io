---
layout: post
title: "PWM (PSSM) / Sequence Logo"
description: ""
category: Biology
tags: [Biology-101]
---
{% include JB/setup %}

[PFM_seq_logo]: https://farm1.staticflickr.com/760/31894131414_220e9ec2aa_z_d.jpg
[transition_matrix]: https://farm1.staticflickr.com/303/31896244584_c764104066_z_d.jpg

- PWM: Position Weight Matrix
- PSSM: Position-Specific Scoring Matrix

这俩其实是同一个概念，就是 motif 的 probabilistic representation。下面我们先从简单的 PFM 和 PPM 入手。

## 1. Motif Model / PFM: Position Frequency Matrix / PPM: Position Probability Matrix

首先看 [RSA-tools: Introduction to cis-regulation](http://rsa-tools.github.io/course/pdf_files/01.2_regulatory_sequences_intro.pdf) 上的这个例子：

![][PFM_seq_logo]

The TRANSFAC (TRANScription FACtor) database contains 8 binding sites for the yeast transcription factor `Pho4p`

- 5/8 contain the core of high-affinity binding sites (`CACGTG`)
- 3/8 contain the core of medium-affinity binding sites (`CACGTT`)

我们想根据这 8 个 TFBS 来制定它对应的 TFBM (Transcription Factor Binding Motif)。我们首先得到的这个 Count Matrix，其实就是 PFM (Position Frequency Matrix)。我们把每一个 cell 都除以 8，得到的就是 PPM (Position Probability Matrix):

$$
M = {
    \begin{matrix}
        A \newline C \newline G \newline T
    \end{matrix}}
    {\begin{bmatrix}
        0.125 & 0.375 & 0.25 & 0 & 1 & 0 & 0 & 0 & 0 & 0 & 0.125 & 0.25\\
        0.25 & 0.25 & 0.375 & 1 & 0 & 1 & 0 & 0 & 0 & 0.25 & 0 & 0.25\\
        0.125 & 0.25 & 0.375 & 0 & 0 & 0 & 1 & 0 & 0.625 & 0.5 & 0.625 & 0.25\\
        0.5 & 0.125 & 0 & 0 & 0 & 0 & 0 & 1 & 0.375 & 0.25 & 0.25 & 0.25\\
    \end{bmatrix}
}
$$

Both PPMs (and PWMs as well) assume **statistical independence between positions** in the pattern, as the probabilities for each position are calculated independently of other positions. Each column can therefore be regarded as an independent **multinomial distribution** (多项式分布).

我们称这个 $M$ 为 Motif Model。对任意一个长度为 12 的 sequence $x$，我们假定 "$x$ is a motif"，然后我们可以计算 "probability (likelihood) of $x$ given $M$":

$$
p(x|M) = \prod_{i=1}^{12} M_{x[i], i}
$$

E.g. for $x = \text{TGACACGTGGGG}$, 

$$
\begin{aligned}
p(x|M) &= 0.5 \times 0.25 \times 0.25 \times 1 \times 1 \times 1 \times 1 \times 1 \times 0.625 \times 0.5 \times 0.625 \times 0.5 \newline
&= 0.00305175781
\end{aligned}
$$

Pseudocounts (or Laplace estimators) are often applied when calculating PPMs if based on a small dataset, in order to avoid matrix entries having a value of 0.

## 2. Background Model (Genomic Context)

以下内容摘自 [RSA-tools: Sequence models](http://rsa-tools.github.io/course/pdf_files/01.3.sequence_models.pdf)。

Why do we need a background model? Any motif discovery relies on an underlying model to estimate the random expectation. The choice of an inappropriate model can lead to false conclusions. In practice, a sequence model can be used to generate random sequences, which will serve to validate some theoretical assumptions. 

What is the probability for a given sequence segment (oligonucleotide, “word”) to be found at a given position of a DNA sequence? Different models can be chosen. 我们称 background model 为 $B$。

### 2.1 Bernoulli model

- Assumes independence between successive nucleotides.
- The probability of each nucleotide is fixed a priori
    - E.g. $p(A) = p(T) = 0.4$, $p(C) = p(G) = 0.1$
    - 对任意一个 sequence $x$，我们假定 "$x$ is a background sequence"，也就是说我们假定 "$x$ is not a motif"，然后我们可以计算 "probability (likelihood) of $x$ given $B$"
    - $p(x|B) = \prod_{i=1}^{\vert x \vert} p(x[i])$
- Particular case: equiprobable nucleotides
    - I.e. $p(A) = p(T) = p(C) = p(G) = 0.25$
    - Simple, but NOT realistic.
    - $p(x|B) = 0.25^{\vert x \vert}$
  
### 2.2 Markov model

- The probability of each nucleotide depends on the $m$ preceding nucleotides.
- The parameter $m$ is called the order of the Markov model
- N.B. a Markov model of order 0 is a Bernoulli model.

#### 2.2.1 Transition Matrix

- Each row specifies one prefix (the $m$ preceding nucleotides), each column one suffix (the current nucleotide).
- Each value is $p(x[i] \vert x[i-m:i])$

![][transition_matrix]

#### 2.2.2 Model Estimation (Training)

这个 $p(x[i] \vert x[i-m:i])$ 如何 estimate？以 Order 1 的 $p(G \vert T)$ 为例：

$$
p(G \vert T) = \frac{N(TG)}{N(TA) + N(TT) + N(TC) + N(TG)} = \frac{N(TG)}{N(T\ast)}
$$

所以只要统计出 sequence collection 中所有 $2$-mer 的个数即可。

那么在 Markov model 下如何计算 $p(x \vert B)$ 呢？以下参考 [Lecture 3: Probabilistic Sequence Models](http://pages.cs.wisc.edu/~bsettles/ibs08/lectures/03-sequencemodels.pdf):

- 一般来说，$p(x \vert B) = p(x[1] \vert B) \times p(x[2] \vert x[1], B) \times \dots \times p(x[n] \vert x[1:n], B)$，其中 $\vert x \vert = n$
    - E.g. $p(ATCG \vert B) = p(A \vert B) \times p(T \vert A, B) \times p(C \vert AT, B) \times p(G \vert ATC, B)$
- 但是这样计算的工作量太大，我们这里使一个 trick：**Markov Assumption**
    - Assume the probability of a character is only dependent on the previous character, not the entire prefix
    - 这样就有 $p(x \vert B) = p(x[1] \vert B) \times p(x[2] \vert x[1], B) \times \dots \times p(x[n] \vert x[n-1], B)$，其中 $\vert x \vert = n$
        - E.g. $p(ATCG \vert B) = p(A \vert B) \times p(T \vert A, B) \times p(C \vert T, B) \times p(G \vert C, B)$
- A statistical process that uses Markov Assumption is called a **Markov Chain**.
- 这个 Assumption 还可以推广到 Order $m$:
    - $p(x \vert B) = p(x[1:m+1] \vert B) \prod_{i=m+1}^{\vert x \vert} p(x[i] \vert x[i-m:i], B)$

#### 2.2.3 How to choose the sequence collection?

比如我们要 estimate the expected frequencies of length-$k$ yeast non-coding upstream sequences。我们可以选择的 sequence collection 可以有：

- whole yeast genome
    - But this will bias the estimates towards coding frequencies, especially in microbial organisms, where the majority of the genome is coding.
- whole set of yeast intergenic sequences
    - More accurate than whole-genome estimates, but still biased because intergenic sequences include both upstream and downstream sequences
- whole set of length-$k$ yeast upstream sequences
    - Requires a calibration for each sequence size
- whole set of upstream sequences, fixed size (default on the web site)
    - 意思说不管你 $k$ 是多少，我都给你提供一个固定的 length-$l$ 的 collection
    - Reasonably good estimate for microbes, NOT for higher organisms. 

## 3. Sequence Logo