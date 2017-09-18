---
layout: post
title: "SemiBoost"
description: ""
category: Machine-Learning
tags: []
---
{% include JB/setup %}

The inconsistency among the unlabeled examples:

$$
\begin{align*}
F_u(\mathbf y^u, S)          =  & \sum_{i,j=1}^{n_u} S_{i,j}^{uu} \exp(y_i^u - y_j^u) \newline
\overset{\text{by symmetry}}{=} & \frac{1}{2}\sum_{i,j=1}^{n_u} S_{j,i}^{uu} \exp(y_j^u - y_i^u) + \frac{1}{2}\sum_{i,j=1}^{n_u} S_{i,j}^{uu} \exp(y_i^u - y_j^u)
\end{align*}
$$

The inconsistency between labeled and unlabeled examples:

$$
F_l(\mathbf y, S) = \sum_{i=1}^{n_l} \sum_{j=1}^{n_u} S_{i,j}^{lu} \exp(-2 y_i^l y_j^u)
$$

Objective function:

$$
F(\mathbf y, S) = F_l(\mathbf y, S) + C F_u(\mathbf y^u, S)
\tag{1}
\label{eq1}
$$

The optimal pseudo labels $\mathbf y^u$ can be found by minimizing $F$, formally

$$
\min_{\mathbf y^u} F(\mathbf y, S) 
\tag{2}
\label{prob1}
$$

This is a convex optimaiztion problem and can be solved effectively by numerical methods, which have nothing to do with your learning algorithm $\mathcal A$.

Now we do want to involve our learning algorithm $\mathcal A$ and use the same idea of problem $\eqref{prob1}$ to improve $\mathcal A$. On the other hand, we want to put problem $\eqref{prob1}$ into a machine learning scenario and still find optimal ${\mathbf y^u}$.

Suppose you are going to solve problem $\eqref{prob1}$ with gradient. Therefore during every step of your iteration, you update $\mathbf y^u$ to get a smaller $F$. In the machine learning scenario, what you update is a classifier $H$ which would predict and pseudo-label $\mathbf y^u$ to get a smaller $F$.

That is to say, we are going to substitute $\mathbf y = \left [\mathbf y^l; \mathbf y^u \right ]$ to $\mathbf y = \left [\mathbf y^l; H(\mathbf x^u) \right ]$ or even $\mathbf y = H(\mathbf x) \text{ s.t. } H(\mathbf x^l) = \mathbf y^l$.

We further expand our machine learning scenario to involve an ensemble of classifiers:

$$
H^{(T)}(\mathbf x) = \sum_{t=1}^{T} \alpha_{t} h^{(t)}(\mathbf x)
$$

At the $(T+1)^{\text{th}}$ iteration, our goal is to find:

$$
\begin{align*}
h^{(T+1)}(\mathbf x), \alpha_{T+1} = & \underset{h^{(T+1)}(\mathbf x), \alpha_{T+1}}{\arg \min} F(H^{(T+1)}(\mathbf x), S) \newline
                                     & \text{s.t. } h^{(T+1)}(\mathbf x_i) = y_{i}^{l}, i = 1,\dots, n_l 
\tag{3}
\label{prob2}
\end{align*}
$$

To simplify the notation, define $H^{(T)}(\mathbf x_j) \equiv H_{j}$, $h^{(T+1)}(\mathbf x_j) \equiv h_j$ and $\alpha_{T+1} \equiv \alpha$. 

Thus 

$$
H^{(T+1)}(\mathbf x_i) = H_i + \alpha h_i 
$$

Expand $F(\mathbf y, S)$ by substituding $\mathbf y^u$ with $H(\mathbf x^u)$:

$$
\begin{align*}
F_l(\mathbf y, S) &= \sum_{i=1}^{n_l} \sum_{j=1}^{n_u} S_{i,j}^{lu} \exp(-2 \cdot y_i^l \cdot (H_j + \alpha h_j) \newline
F_u(\mathbf y^u, S) &= \sum_{i,j=1}^{n_u} S_{i,j}^{uu} \exp(H_i + \alpha h_i - H_j - \alpha h_j) \newline
                    &= \sum_{i,j=1}^{n_u} S_{i,j}^{uu} \exp(H_i - H_j ) \cdot \exp[\alpha (h_i - h_j)]

\end{align*}
$$

Now the problem becomes:

$$
\begin{align*}
\min_{h(\mathbf x), \alpha} & F(\mathbf y, S) = F_l(\mathbf y, S) + C F_u(\mathbf y^u, S) \\
&               =\sum_{i=1}^{n_l} \sum_{j=1}^{n_u} S_{i,j}^{lu} \exp(-2 \cdot y_i^l \cdot (H_j + \alpha h_j) + C \sum_{i,j=1}^{n_u} S_{i,j}^{uu} \exp(H_i - H_j ) \cdot \exp[\alpha (h_i - h_j)] 
                                            \tag{4}
                                            \label{prob3} \\
\text{s.t. } & h_i = y_{i}^{l}, i = 1,\dots, n_l 
\end{align*}
$$

Problem $\eqref{prob3}$ involves products of $\alpha$ and $h_i$, making it nonlinear and, hence, difficult to optimize. We are going to apply Bound-Optimization below to solve this problem.

We first further expand $F_l(\mathbf y, S)$:

$$
\begin{align*}
F_l(\mathbf y, S) &= \sum_{i=1}^{n_l} \sum_{j=1}^{n_u} S_{i,j}^{lu} \exp(-2 \cdot y_i^l \cdot (H_j + \alpha h_j) \newline
                  &= \sum_{i=1}^{n_l} \sum_{j=1}^{n_u} S_{i,j}^{lu} \{ I(y_i^l, 1) \exp [ -2 (H_j + \alpha h_j ) ] + I(y_i^l, -1) \exp [ 2 (H_j + \alpha h_j ) ] \} \newline
                  &= \sum_{j=1}^{n_u} \exp(-2 \alpha h_j) \cdot \sum_{i=1}^{n_l} S_{i,j}^{lu} I(y_i^l, 1) \exp(-2H_j) + \sum_{j=1}^{n_u} \exp(2 \alpha h_j) \cdot \sum_{i=1}^{n_l} S_{i,j}^{lu} I(y_i^l, -1) \exp(2H_j) 
\end{align*}
$$

Then we find an upper bound of $F_u(\mathbf y^u, S)$:

$$
\begin{aligned}
\because \, & \exp[\alpha (h_i - h_j)] \leq \frac{1}{2} \left [ \exp(2 \alpha h_i) + \exp(-2 \alpha h_j) \right ] \newline
\therefore \, & F_u(\mathbf y^u, S) \leq F_u'(\mathbf y^u, S) = \sum_{i,j=1}^{n_u} \frac{1}{2} S_{i,j}^{uu} \exp(H_i - H_j) \cdot \exp(2 \alpha h_i) + \sum_{i,j=1}^{n_u} \frac{1}{2} S_{i,j}^{uu} \exp(H_i - H_j) \cdot \exp(-2 \alpha h_j)
\end{aligned}
$$

Flip $i$ and $j$ of the first term in $F_u'(\mathbf y^u, S)$:

$$
\begin{aligned}
\therefore F_u'(\mathbf y^u, S) = & \sum_{i,j=1}^{n_u} \frac{1}{2} S_{i,j}^{uu} \exp(H_j - H_i) \cdot \exp(2 \alpha h_j) + \sum_{i,j=1}^{n_u} \frac{1}{2} S_{i,j}^{uu} \exp(H_i - H_j) \cdot \exp(-2 \alpha h_j) \newline
                                = & \sum_{j=1}^{n_u} \exp(-2 \alpha h_j) \cdot \sum_{i=1}^{n_u} \frac{1}{2} S_{i,j}^{uu} \exp(H_i - H_j) + \sum_{j=1}^{n_u} \exp(2 \alpha h_j) \cdot \sum_{i=1}^{n_u} \frac{1}{2} S_{i,j}^{uu} \exp(H_j - H_i)
\end{aligned}
$$

$$
\begin{align*}
\therefore \, F(\mathbf y, S) =& F_l(\mathbf y, S) + C F_u(\mathbf y^u, S) \newline
\leq \overline{F}_1(\mathbf y, S) =& F_l(\mathbf y, S) + C F_u'(\mathbf y^u, S) \newline
                      =& \sum_{j=1}^{n_u} \exp(-2 \alpha h_j) \cdot \bigg [ \sum_{i=1}^{n_l} S_{i,j}^{lu} I(y_i^l, 1) \exp(-2H_j) + \sum_{i=1}^{n_u} \frac{C}{2} S_{i,j}^{uu} \exp(H_i - H_j) \bigg ] + \newline
                       & \sum_{j=1}^{n_u} \exp(2 \alpha h_j) \cdot \bigg [\sum_{i=1}^{n_l} S_{i,j}^{lu} I(y_i^l, -1) \exp(2H_j) + \sum_{i=1}^{n_u} \frac{C}{2} S_{i,j}^{uu} \exp(H_j - H_i) \bigg]
\end{align*}
$$

Define:

$$
\begin{align*}
p_j =& \sum_{i=1}^{n_l} S_{i,j}^{lu} I(y_i^l, 1) \exp(-2H_j) + \sum_{i=1}^{n_u} \frac{C}{2} S_{i,j}^{uu} \exp(H_i - H_j) \newline
q_j =& \sum_{i=1}^{n_l} S_{i,j}^{lu} I(y_i^l, -1) \exp(2H_j) + \sum_{i=1}^{n_u} \frac{C}{2} S_{i,j}^{uu} \exp(H_j - H_i)
\end{align*}
$$

Note that when calculating $p_j$ and $q_j$, $j$ is fixed and $p_j$ and $q_j$ are functions of $H_j$.

$p_j$ and $q_j$ can be interpreted as the confidence in classifying the unlabeled example $\mathbf x_i$ into the positive class and the negative class, respectively.

$\text{Claim 1}:$ Problem $\eqref{prob3}$ is equivalent to 

$$
\min_{h(\mathbf x), \alpha} \overline{F}_1(\mathbf y, S) = \sum_{j=1}^{n_u} \exp(-2 \alpha h_j) \cdot p_j + \sum_{j=1}^{n_u} \exp(2 \alpha h_j) \cdot q_j
\tag{5}
\label{prob4}
$$

The expression in $\eqref{prob4}$ is difficult to optimize since the weight $\alpha$ and the classifier $h$ are coupled together. We simplify the problem furhter using the upper bound of $\overline{F}_1$.

$$
\begin{aligned}
\because \, & 1 + x \leq \exp(x) \newline
\therefore \, & \exp(\gamma x) \leq \exp(\gamma) + \exp(-\gamma) -1 + \gamma x, \forall x \in \{ -1, 1 \}\newline
\therefore \, & \exp(-2 \alpha h_j) \leq \exp(-2 \alpha) + \exp(2 \alpha) - 1 - 2 \alpha h_j \newline
              & \exp(2 \alpha h_j) \leq \exp(2 \alpha) + \exp(-2 \alpha) - 1 + 2 \alpha h_j \newline
\therefore \, & \overline{F}_1(\mathbf y, S) \leq \overline{F}_2(\mathbf y, S) = \sum_{j=1}^{n_u}(e^{2 \alpha} + e^{-2 \alpha} - 1)(p_j + q_j) - \sum_{j=1}^{n_u} 2 \alpha h_j (p_j - q_j) 
\end{aligned}
$$

- [Simplest or nicest proof that $1+x \leq e^x$](https://math.stackexchange.com/questions/504663/simplest-or-nicest-proof-that-1x-le-ex)

$\text{Claim 2}:$ Problem $\eqref{prob4}$ is equivalent to 

$$
\min_{h(\mathbf x), \alpha} \overline{F}_2(\mathbf y, S) = \sum_{j=1}^{n_u}(e^{2 \alpha} + e^{-2 \alpha} - 1)(p_j + q_j) - \sum_{j=1}^{n_u} 2 \alpha h_j (p_j - q_j) 
\tag{6}
\label{prob5}
$$