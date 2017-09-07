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

Expand $F(H^{(T+1)}(\mathbf x), S)$ by substituding $\mathbf y^u$ with $H(\mathbf x^u)$:

$$
\begin{align*}
F_l(\mathbf y, S) &= \sum_{i=1}^{n_l} \sum_{j=1}^{n_u} S_{i,j}^{lu} \exp(-2 \cdot y_i^l \cdot H^{(T+1)}(\mathbf x_j)) \newline
                  &= \sum_{i=1}^{n_l} \sum_{j=1}^{n_u} S_{i,j}^{lu} \{ I(y_i^l, 1) \exp [ -2 (H_j + \alpha h_j ) ] + I(y_i^l, -1) \exp [ 2 (H_j + \alpha h_j ) ] \} \newline
                  &= \sum_{j=1}^{n_u} \exp(-2 \alpha h_j) \cdot \sum_{i=1}^{n_l} S_{i,j}^{lu} I(y_i^l, 1) \exp(-2H_j) + \sum_{j=1}^{n_u} \exp(2 \alpha h_j) \cdot \sum_{i=1}^{n_l} S_{i,j}^{lu} I(y_i^l, -1) \exp(2H_j) \newline

F_u(\mathbf y^u, S) &= \sum_{i,j=1}^{n_u} S_{i,j}^{uu} \exp(H_i + \alpha h_i - H_j - \alpha h_j) \newline
                    &= \sum_{i,j=1}^{n_u} S_{i,j}^{uu} \exp(H_i - H_j ) \cdot \exp[\alpha (h_i - h_j)]

\end{align*}
$$

$$
\begin{aligned}
\because \, & \exp[\alpha (h_i - h_j)] \leq \frac{1}{2} \left [ \exp(2 \alpha h_i) + \exp(-2 \alpha h_j) \right ] \newline
\therefore \, & F_u(\mathbf y^u, S) \leq F_u'(\mathbf y^u, S) = \sum_{j=1}^{n_u} \exp(-2 \alpha h_j) \cdot \sum_{i=1}^{n_u} \frac{1}{2} S_{i,j}^{uu} \exp(H_i - H_j) + \sum_{j=1}^{n_u} \exp(2 \alpha h_j) \cdot \sum_{i=1}^{n_u} \frac{1}{2} S_{i,j}^{uu} \exp(H_i - H_j)
\end{aligned}
$$

And $\exp(x)$ is convex; $\exp(-x)$ is convex. Therefore $\exp(x) + \exp(-x)$ is also convex.

$$
\begin{align*}
F(H^{(T+1)}(\mathbf x), S) &= F_l(H^{(T+1)}(\mathbf x), S) + C F_u(H^{(T+1)}(\mathbf x_u), S) \newline
                           &= \sum_{i=1}^{n_l} \sum_{j=1}^{n_u} S_{i,j}^{lu} \exp(-2 y_i^l y_j^u)
\end{align*}
$$
