---
layout: post-mathjax
title: "Digest of <i>Learning Classifiers from Only Positive and Unlabeled Data<i>"
description: ""
category: Machine-Learning
tags: [ML-101, Paper]
---
{% include JB/setup %}

- Elkan, C. and Noto, K. (2008). Learning classifiers from only positive and unlabeled data. Proceeding of the 14th ACM SIGKDD international conference on Knowledge discovery and data mining - KDD 08.

-----

## Abstract

A global assumption:

- The labeled examples are selected randomly from the positive examples.

## 1. Introduction

Nothing

## 2. Learning a Traditional Classifier from Non-Tranditional Input

### 2.1 Notations

Traditional Classifiers:

- \\( X \\): Input
- \\( Y \\): Output
	- \\( y = 1 \\): positive
	- \\( y = 0 \\): negative
- \\( f(x) = p(y=1|x) \\): A Traditional Classifiers
	- Or \\( f(x) = I(p(y=1|x) > 0.5) \\), whatever

Non-Tranditional Classifiers:

- \\( X \\): Input
- \\( S \\): Output
	- \\( s = 1 \\): labeled
	- \\( s = 0 \\): unlabeled
- \\( g(x) = p(s=1|x) \\): A Non-Traditional Classifiers

The fact is that we only have \\( X \\) and \\( S \\), but we want to predict \\( Y \\), i.e. to train a traditional classifiers. Of course we can just assume \\( y = s \\), but that's too rough and inaccurate.

### 2.2 Assumptions and Proof

Before we investigate deeper, we'd better know some facts (or assumptions) here.

- If an example is labled (\\( s = 1 \\)), it must be positive (\\( y = 1 \\)), i.e. \\( p(y=1|s=1) = 1 \\).
	- Or we can say **only positive examples can be labeled**.
	- Or we can say \\( s=1 \Rightarrow y=1 \\).
- If an example is unlabeled (\\( s = 0 \\)), it might be positive (\\( y = 1 \\)) or negative (\\( y = 0 \\)).
- If an example is positive (\\( y = 1 \\)), it might be labeled (\\( s = 1 \\)) or unlabeled (\\( s = 0 \\)).
- If an example is negative (\\( y = 0 \\)), it must be unlabeled (\\( s = 0 \\)).
	- Or we can say **only negative examples can be unlabeled**.
	- Or we can say \\( y=0 \Rightarrow s=0 \\).

The assumption, ** only positive examples can be labeled**, can also be stated formally by

$$
\begin{equation}
    p(s=1|x,y=0) = 0
    \tag{1}
    \label{eq1}
\end{equation}
$$

The global assumption is that **the labeled (thus positive) examples are selected randomly from the positive examples**, which means:

- If \\( y = 1 \\), the probability that a positive example is lebeled is the same constant regardless of \\( x \\).
- I.e. the selection of \\( s=1 \\) examples from \\( y = 1 \\) examples is not controlled by, or has nothing to do with \\( x \\).

Stated formally, the global assumption is

$$
\begin{equation}
    p(s=1|x,y=1) = p(s=1|y=1)
    \tag{2}
    \label{eq2}
\end{equation}
$$

**Lemma 1:** If assumption \\( (\ref{eq2}) \\) holds, \\( g(x) = f(x) \cdot c\\) where \\( c = p(s=1|y=1) \\).

**Proof:**

$$
\begin{align}
    \because & Event(s=1) \in Event(y=1) \\\\
	\therefore & p(s=1) = p(s=1 \cap y=1)
\end{align}
$$

$$
\begin{align}
	\therefore g(x) &= p(s=1|x) \\\\
					&= p(s=1 \cap y=1|x) \\\\
					&= p(y=1|x) \cdot p(s=1|x,y=1) \\\\
					&= f(x) \cdot p(s=1|y=1) \, \text{(By } (\ref{eq2}) \text{)}
\end{align}
$$

- P.S. By Bayesian, \\( A=Event(s=1), B=Event(y=1), p(AB|x) = p(A|B,x) \cdot p(B|x) \\)

### 2.3 Estimation of \\( c \\)

#### Estimator 1

- \\( V \\): a **validation set**.
	- \\( \left | V \right | = m \\)
- \\( P \\): \\( {x \text{ is labeled (hence positive) } | x \in V} \\)
	- \\( \left | P \right | = n \\)

Formally the estimator is \\( e\_1 = \frac{1}{n} \sum\_{x \in P}{g(x)} \\).

When \\( x \in P \\), actually we have \\( f(x) = p(y=1|x) = 1 \\), so \\( \forall x \in P, g(x) = c \\). Therefore we estimate \\( c \\) as the average of all the \\( n \\) values of \\( g(x) \\).

- Now the only problem is: what is a validation set?

#### Estimator 2
