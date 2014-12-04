---
layout: post-mathjax
title: "Lagrange duality"
description: ""
category: Machine-Learning
tags: [ML-101]
---
{% include JB/setup %}

总结自 [section note 5: Convex Optimization Overview, Part II](http://cs229.stanford.edu/section/cs229-cvxopt2.pdf)

-----

## 0. Introduction

In the study of convex optimization, the mathematical optimization problems follow the form below:

$$
\begin{aligned}
	& \underset{x \in \mathbb{R}\^{n}}{\text{minimize}}
	& & f(x) \\\\
	& \text{subject to}
	& & x \in C.
	\tag{1}
	\label{eq1}
\end{aligned}
$$

where 

* \\( x \in \mathbb{R}\^{n} \\) is a vector known as the **optimization variable**
* \\( f : \mathbb{R}\^{n} \rightarrow \mathbb{R} \\) is a **convex function** that we want to minimize
* \\( C \subseteq \mathbb{R}\^{n} \\) is a **convex set** describing the set of feasible (capable of being done or carried out) solutions

A necessary and sufficient condition for \\( x\^{\*} \in \mathbb{R}\^{n} \\) to be the globally optimal of problem \\( (\ref{eq1}) \\) is that \\( \nabla\_{x}{f(x\^{\*})} = 0 \\).

In the more general setting of convex optimization problem with constraints, however, this simple optimality condition does not work. One primary goal of duality theory is to characterize the optimal points of convex programs in a mathematically rigorous way.

Here we propose a form of generic differentiable convex optimization problems, as:

$$
\begin{aligned}
	& \underset{x \in \mathbb{R}\^{n}}{\text{minimize}}
	& & f(x) \\\\
	& \text{subject to}
	& & g\_{i}(x) \leq 0, & i=1,\cdots,m \\\\
	& 
	& & h\_{i}(x) = 0, & i=1,\cdots,p
	\tag{OPT}
	\label{eqopt}
\end{aligned}
$$

where

* \\( x \in \mathbb{R}\^{n} \\) is the **optimization variable**
* \\( f : \mathbb{R}\^{n} \rightarrow \mathbb{R} \\) and \\( g\_{i} : \mathbb{R}\^{n} \rightarrow \mathbb{R} \\) are **differentiable convex functions**
* \\( h\_{i} : \mathbb{R}\^{n} \rightarrow \mathbb{R} \\) are **affine functions**
	* An affine function is a function of the form \\( f(x) = a\^{T}x+b \\) for some \\( a \in \mathbb{R}\^{n} \\), \\( b \in \mathbb{R} \\)
* \\( g\_{i} \\) is one of the \\( m \\) convex inequality constraints
* \\( h\_{i} \\) is one of the \\( p \\) affine equality constraints

## 1. The Lagrangian

Given a convex constrained minimization problem
of the form \\( (\ref{eqopt}) \\), the (generalized) Lagrangian is a function \\( L : \mathbb{R}\^{n} \times \mathbb{R}\^{m} \times \mathbb{R}\^{p} \rightarrow \mathbb{R} \\) defined as

$$
\begin{aligned}
	L(x, \alpha, \beta) = f(x) + \sum\_{i=1}\^{m}{\alpha\_{i}g\_{i}(x)} + \sum\_{i=1}\^{p}{\beta\_{i}h\_{i}(x)}
	\tag{2}
	\label{eq2}
\end{aligned}
$$

where

* \\( x \in \mathbb{R}\^{n} \\) is the **primal variables** of the Lagrangian
* \\( \alpha \in \mathbb{R}\^{m} \\) and \\( \beta \in \mathbb{R}\^{p} \\) are the **dual variables** of the Lagrangian, a.k.a **Lagrange multipliers**

Intuitively, the Lagrangian can be thought of as a modified version of the objective function to the original convex optimization problem \\( (\ref{eqopt}) \\) which accounts for each of the constraints. The Lagrange multipliers \\( \alpha\_{i} \\) and \\( \beta\_{i} \\) can be thought of penalties of violating the constraints. The key intuition behind the theory of Lagrange duality is the following:

> For any convex optimization problem, there always exist settings of the dual variables such that the unconstrained minimum of the Lagrangian with respect to the primal variables (keeping the dual variables fixed) coincides with the solution of the original constrained minimization problem.

We formalize this intuition when we describe the KKT conditions in Section 6.

## 2. Primal and dual problems

To show the relationship between the Lagrangian and the original convex optimization problem \\( (\ref{eqopt}) \\), we introduce the notions of the "primal" and "dual problems" associated with a Lagrangian:

### The primal problem

The **primal objective** function \\( \theta\_{P} : \mathbb{R}\^{n} \rightarrow \mathbb{R} \\) is defined as

$$
\begin{aligned}
	\theta\_{P}(x) = \underset{\alpha, \beta : \alpha\_{i} \geq 0, \forall i}{\text{max}}
	& & L(x, \alpha, \beta)
\end{aligned}
$$

Then the unconstrained minimization problem

$$
\begin{aligned}
	\underset{x}{\text{min}}
	& & \theta\_{P}(x)
	\tag{P}
	\label{eqp}
\end{aligned}
$$

is known as the **primal problem**.

* Generally, we say that a point \\( x \in \mathbb{R}\^{n} \\) is **primal feasible** if \\( g\_{i}(x) \leq 0 \\), \\( i = 1, \cdots, m \\) and \\( h\_{i}(x) = 0\\), \\( i = 1, \cdots, p\\) 
* We typically use the vector \\( x\^{\*} \in \mathbb{R}\^{n} \\) to denote the solution of \\( (\ref{eqp}) \\), and we let \\( p\^{\*} = \theta\_{P}(x\^{\*}) \\) denote the optimal value of the primal objective.

## The dual problem

By switching the order of the minimization and maximization above, we obtain an entirely different optimization problem.

The **dual objective** function \\( \theta\_{D} : \mathbb{R}\^{m} \times \mathbb{R}\^{p} \rightarrow \mathbb{R} \\) is defined as

$$
\begin{aligned}
	\theta\_{D}(\alpha, \beta) = \underset{x}{\text{min}}
	& & L(x, \alpha, \beta)
\end{aligned}
$$

Then the constrained maximization problem

$$
\begin{aligned}
	\underset{\alpha, \beta : \alpha\_{i} \geq 0, \forall i}{\text{max}}
	& & \theta\_{D}(\alpha, \beta)
	\tag{D}
	\label{eqd}
\end{aligned}
$$

is known as the **dual problem**.

* Generally, we say that \\( (\alpha, \beta) \\) are **dual feasible** if \\( \alpha\_{i}(x) \geq 0 \\), \\( i = 1, \cdots, m \\) 
* We typically use the vector \\( (\alpha\^{\*}, \beta\^{\*}) \in \mathbb{R}\^{m} \times \mathbb{R}\^{p} \\) to denote the solution of \\( (\ref{eqd}) \\), and we let \\( d\^{\*} = \theta\_{D}(\alpha\^{\*}, \beta\^{\*}) \\) denote the optimal value of the dual objective.

## 3. Interpreting the primal problem

$$
\begin{aligned}
	\theta\_{P}(x) 
	& = \underset{\alpha, \beta : \alpha\_{i} \geq 0, \forall i}{\text{max}} 
	L(x, \alpha, \beta) \\\\
	& = \underset{\alpha, \beta : \alpha\_{i} \geq 0, \forall i}{\text{max}}
	\left \[ f(x) + \sum\_{i=1}\^{m}{\alpha\_{i}g\_{i}(x)} + \sum\_{i=1}\^{p}{\beta\_{i}h\_{i}(x)} \right \] \\\\
	& = f(x) + \underset{\alpha, \beta : \alpha\_{i} \geq 0, \forall i}{\text{max}}
	\left \[ \sum\_{i=1}\^{m}{\alpha\_{i}g\_{i}(x)} + \sum\_{i=1}\^{p}{\beta\_{i}h\_{i}(x)} \right \] 
\end{aligned}
$$

当 \\( x \\) is primal feasible 时，\\( g\_{i}(x) \leq 0 \\), \\( h\_{i}(x) = 0 \\)，又因为 \\( \alpha\_{i} \geq 0 \\)，所以 \\( \alpha\_{i} g\_{i}(x) \\) 最大为 0，\\( \beta\_{i} h\_{i}(x) \\) 恒为 0。 此时 \\( \theta\_{P}(x) = f(x) \\)。

当 \\( x \\) is not primal feasible 时，\\( \alpha\_{i} g\_{i}(x) \\) 和 \\( \beta\_{i} h\_{i}(x) \\) 都可以任意大，取 max 直接可以得到 \\( \infty \\)。此时 \\( \theta\_{P}(x) = f(x) + \infty \\)。

考虑到我们最原始的问题 \\( (\ref{eqopt}) \\) 是求 \\( \min{f(x)} \\)，primal problem \\( (\ref{eqp}) \\)是求 \\( \min{\theta\_{P}(x)} \\)。所以我们可以认为：当 \\( x \\) is primal feasible 时，求 \\( \min{\theta\_{P}(x)} \\) 等价于求 \\( \min{f(x)} \\)。

## 4. Interpreting the dual problem

The dual objective, \\( \theta\_{D}(\alpha, \beta) \\), is a concave function of \\( \alpha \\) and \\( \beta \\). To interpret the dual problem, first we make the following observation: 

**Lemma 1**: If \\( (\alpha, \beta) \\) are dual feasible, then \\( \theta\_{D}(\alpha, \beta) \leq p\^{\*} \\).

_Proof_:

$$
\begin{aligned}
	\theta\_{D}(\alpha, \beta)
	& = \underset{x}{\text{min}} 
	L(x, \alpha, \beta) \\\\
	& \leq L(x\^{\*}, \alpha, \beta) \\\\
	& = f(x\^{\*}) + \sum\_{i=1}\^{m}{\alpha\_{i}g\_{i}(x\^{\*})} + \sum\_{i=1}\^{p}{\beta\_{i}h\_{i}(x\^{\*})} \\\\
	& \leq f(x\^{\*}) = p\^{\*}
\end{aligned}
$$

**Lemma 2** (Weak Duality): For any pair of primal and dual problems, \\( d\^{\*} = \theta\_{D}(\alpha\^{\*}, \beta\^{\*}) \leq p\^{\*} \\). 

This is obvious following Lemma 1.

**Lemma 3** (Strong Duality): For any pair of primal and dual problems which satisfy certain technical conditions called **constraint qualifications**, then \\( d\^{\*} = p\^{\*} \\). 

**Slater’s condition**: a primal/dual problem pair satisfy Slater’s condition if there exists some feasible primal solution \\( x \\) for which all inequality constraints are strictly satisfied (i.e., \\( g\_{i}(x) < 0 \\), \\( i = 1, \cdots, m \\)).

注意 Slater’s condition 并不能实现 Strong Duality，书上只是拿它举个例子说明啥叫 "technical conditions"。要实现 Strong Duality，还得靠下文的 KTT conditions。

注意，Strong Duality 的意义并不是简单地得到 \\( d\^{\*} = p\^{\*} \\)，而是说明了 "只要满足了 constraint qualifications，那么 primal problem 等价于 dual problem"，进一步就有 "求 dual problem 等价于 求 primal problem 等价于 求最原始的问题 \\( (\ref{eqopt}) \\)"。

## 5. Complementary slackness

在我们讲 KTT conditions 之前，我们先来说一下 Complementary slackness。

**Lemma 4** (Complementary Slackness): If strong duality holds, then \\( \alpha\_{i}\^{\*} g\_{i}(x\^{\*}) = 0 \\) for each \\( i = 1,\cdots,m \\).

证明比较简单。之前 Lemma 2 有 \\( d\^{\*} \leq p\^{\*} \\)，现在 strong duality holds 了有 \\( d\^{\*} = p\^{\*} \\)。所以按 Lemma 1 的证明走，所有的 \\( \leq \\) 现在都要取 \\( = \\)，必然要求 \\( \alpha\_{i}\^{\*} g\_{i}(x\^{\*}) = 0 \\)。

又因为 \\( \alpha\_{i}\^{\*} \geq 0 \\)，所以有：

* \\( \alpha\_{i}\^{\*} > 0 \Rightarrow g\_{i}(x\^{\*}) = 0 \\)
* \\( g\_{i}(x\^{\*}) < 0 \Rightarrow \alpha\_{i}\^{\*} = 0 \\)

这个 \\( \alpha\_{i}\^{\*} g\_{i}(x\^{\*}) = 0 \\) 的 constraint 我们又称为 **active constraint**。在 SVM 中，support vector 其实就是以 active constraint 的形式存在的。

## 6. The KKT (Karush-Kuhn-Tucker) conditions

**Theorem 1**: Suppose that \\( x\^{\*} \in \mathbb{R}\^{n} \\), \\( \alpha\^{\*} \in \mathbb{R}\^{m} \\) and \\( \beta\^{\*} \in \mathbb{R}\^{p} \\) satisfy the following conditions:

1. (Primal feasibility) \\( g\_{i}(x\^{\*}) \leq 0 \\), \\( i = 1, \cdots, m \\) and \\( h\_{i}(x\^{\*}) = 0\\), \\( i = 1, \cdots, p\\),
2. (Dual feasibility) \\( \alpha\_{i}\^{\*} \geq 0 \\), \\( i = 1, \cdots, m \\),
3. (Complementary slackness) \\( \alpha\_{i}\^{\*} g\_{i}(x\^{\*}) = 0 \\), \\( i = 1, \cdots, m \\), and
4. (Lagrangian stationarity) \\( \nabla\_{x}{L(x\^{\*}, \alpha\^{\*}, \beta\^{\*})} = 0 \\).

Then \\( x\^{\*} \\) is primal optimal and \\( (\alpha\^{\*}, \beta\^{\*}) \\) are dual optimal. Furthermore, if strong duality holds, then any primal optimal \\( x\^{\*} \\) and dual optimal \\( (\alpha\^{\*}, \beta\^{\*}) \\) must satisfy the conditions 1 through 4.

These conditions are known as the Karush-Kuhn-Tucker (KKT) conditions.