---
category: Math
description: ''
tags: []
title: Harmonic Function / Laplace's equation
---

harmonic 这个词的意思太多了，比如在 periodic signals 里翻译成 “[谐波](https://zh.wikipedia.org/wiki/%E8%B0%90%E6%B3%A2)”。而 Harmonic Function 的翻译是 "[调和函数](https://zh.wikipedia.org/wiki/%E8%B0%83%E5%92%8C%E5%87%BD%E6%95%B0)"

本篇 quote from [V7. Laplace’s Equation and Harmonic Functions, M.I.T. 18.02 Notes, Exercises and Solutions by Jeremy Orloff](http://math.mit.edu/~jorloff/suppnotes/suppnotes02/v7.pdf)

## Laplace operator

The two-dimensional **Laplace operator**, or **laplacian** as it is often called, is denoted by $\nabla^2$ or $lap$, and defined by

$$
\nabla^2 = \frac {\partial^{2}}{\partial x^{2}} + \frac {\partial^{2}}{\partial y^{2}}
$$

当然你可以扩展到多维：

$$
\nabla^2 = \frac {\partial^{2}}{\partial x_1^{2}} + \frac {\partial^{2}}{\partial x_2^{2}} + \cdots + \frac {\partial^{2}}{\partial x_n^{2}}
$$

注意 $\nabla^2$ 其实是一个参数为 $f$ 的函数，只是我们不写成 $\nabla^2(f)$ 而是直接用 $\nabla^2 f$ 表示：

$$
\nabla^2 f = \frac {\partial^{2} f}{\partial x^{2}} + \frac {\partial^{2} f}{\partial y^{2}}
$$

where $f(x, y)$ is a twice differentiable functions.

The notation $\nabla^2$ comes from thinking of the operator as a sort of symbolic scalar product:

$$
\nabla^2 = \nabla \cdot \nabla = \left ( \frac{\partial}{\partial x} \mathbf{i} + \frac{\partial}{\partial x} \mathbf{j} \right ) \cdot \left ( \frac{\partial}{\partial x} \mathbf{i} + \frac{\partial}{\partial x} \mathbf{j} \right ) = \frac {\partial^{2}}{\partial x^{2}} + \frac {\partial^{2}}{\partial y^{2}}
$$

Notice that the laplacian is a linear operator, that is it satisfies the two rules

- $\nabla^2 (u + v) = \nabla^2 u + \nabla^2 v$
- $\nabla^2 cu = c(\nabla^2 u)$

for any two twice differentiable functions $u(x, y)$ and $v(x, y)$ and any constant $c$. 

## Laplace equation

I.e.

$$
\nabla^2 f = 0
$$

## Harmonic Function

A function $\phi(x, y)$ which has continuous second partial derivatives and satisfies Laplace’s equation is called a **harmonic function**. I.e.

$$
\phi \text{ is harmonic} \iff \nabla^2 \phi = 0
$$

Considering laplacian is a linear operator, we have:

$$
\phi \text{ and } \psi \text{ harmonic} \Rightarrow (\phi + \psi) \text{ and } c\phi \text{ are harmonic}
$$

## Examples of harmonic functions

仅列举 Harmonic homogeneous polynomials in two variables 的例子。更多请参考教程。

- Degree $0$: all constants $c$ are harmonic.
- Degree $1$: all linear polynomials $ax + by$ are harmonic.
- Degree $2$: the quadratic polynomials $x^2 − y^2$ and $xy$ are harmonic; all other harmonic homogeneous quadratic polynomials are linear combinations of these, e.g.: 

$$
\phi(x, y) = a(x^2 − y^2) + bxy
$$

where $a b$ are constants.

- Degree $n$: the real and imaginary parts of the complex polynomial $(x + \mathrm{i} y)^n$ are harmonic.