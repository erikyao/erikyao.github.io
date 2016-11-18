---
layout: post
title: "Digest of Essence of Linear Algebra"
description: ""
category: Math
tags: [Math-Algebra]
---
{% include JB/setup %}

$$
\newcommand{\icol}[1]{
  \bigl[ \begin{smallmatrix} #1 \end{smallmatrix} \bigr]
}

\newcommand{\irow}[1]{
  \begin{smallmatrix}(#1)\end{smallmatrix}
}
$$

## Chapter 1 - Vectors, what even are they?

> The introduction of numbers as coordinates (by reference to the the particular division scheme of the open one-dimensional continuum) is an act of violence. ―Hermann Weyl

Mathematicians' perspective:

- A vector can be anything where there's a sensible notion of adding two vectors and multiplying a vector by a number.
    - I.e. 只要实现了 “可以两两相加” 和 “可以与一个数相乘” 的都可以叫 vector
    - Linear algebra revolves around vector addition and scalar multiplication. 线性代数是紧紧围绕着这两个基本概念的。

如果要从 geometrics 的角度来理解的话，我们最好把每个 vector 都理解为：

- An arrow inside a coordinate system, with it's tail sitting at the origin (原点) (Sorry, Hermann Weyl)
    - 虽然理论上，vectors can freely sit anywhere in the space. 
- A vector $\vec v = \icol{a \newline b}$ gives instructions for how to get from its tail to its tip.
    - First walk along 1st axis for $a$ units;
    - then walk along 2nd axis for $b$ units.

### 1.1 Adding two vectors

假设有 $\vec v = \icol{a \newline b}$ 和 $\vec w = \icol{c \newline d}$，那么 vector 加法 $ \vec v + \vec w$ 可以理解为：

- First walk along 1st axis for $a$ units;
- then walk along 2nd axis for $b$ units;
- then walk along 1st axis for $c$ units;
- then walk along 2nd axis for $d$ units.
- 或者
    - First walk along 1st axis for $a+c$ units;
    - then walk along 2nd axis for $b+d$ units.
- 简单的实数加法也可以这么理解，比如 $2+5$：
    - First walk (along the only axis) for $2$ units;
    - then walk for $5$ units;
    - you would walk $7$ units in total.

### 1.2 Multiplying a vector by a number

- $2 \cdot \vec v$ means you stretch out $\vec v$ so that it's $2$ times as long as before.
    - First walk along 1st axis for $2a$ units;
    - then walk along 2nd axis for $2b$ units.
- $-2 \cdot \vec v$ means first flip $\vec v$ then stretch it out by factor of $2$.
- $\frac{1}{3} \cdot \vec v$ means you squish it down so that it's $\frac{1}{3}$ of the original length.

This process of 1) stretching or 2) squishing or 3) sometimes reversing the direction of a vector is called **_scaling_**. The number you used to scale the vector is called a **_scalar_**. (翻译为 “标量”. Never mind.) In fact, throughout linear algebra, one of main things that numbers do is to scale vectors.

## Chapter 2 - Linear combinations, span, and basis vectors

> Mathematics requires a small dose, not of genius, but of imaginative freedom which, in a larger dose, would be insanity. ―Angus K. Rodgers

**_Unit vector_**: a vector that has a magnitude of one.

- Unit vector in x-direction $\hat i = \icol{1 \newline 0}$
- Unit vector in y-direction $\hat j = \icol{0 \newline 1}$

Think about each coordinate in $\icol{a \newline b}$ as a scalar. Then $\vec v = \icol{a \newline b} = a \hat i + b \hat j$. In this sense, $\icol{a \newline b}$ describes $\vec v$ as the sum of two scaled vectors. This is a surprisingly importance concept in linear algebra.

- Together, $\hat i$ and $\hat j$ are called the **_basis vectors_** of a xy coordinate system. (坐标系的基向量)
    - 注意，unit vector 可以有无数个，但是 basis vector 只有 axis 的个数那么多个
- When you think about coordinates in $\vec v$ as scalars, the basis vectors are what those scalars scale to represent $\vec v$

What if we chose some arbitrary vectors as basis vectors? We could have done so and gotten a completely reasonable, new coordinate system.

- 亦即，如果有 $\vec v = a \vec p + b \vec q$，我们可以想象有一个 "pq coordinate system"，它以 $\vec p$ 和 $\vec q$ 为 basis vectors，那么 $\vec v = a \vec p + b \vec q$ 就相当于是这个 pq coordinate system 的一个 arrow 指向 $(a,b)$ 这个点。

Suppose $\vec p$ and $\vec q$ are 2-D vectors. Choose any possible $a$ and $b$ for $\vec v = a \vec p + b \vec q$. How many $\vec v$ can you get? The answer is that you can get every possible 2-D vectors. This means that a pair of 2-D basis vectors gives us a valid way to go back and forth between pairs of numbers and 2-D vectors.

- Rule of thumb: any time we describe vectors numerically, it depends on an implicit choice of what basis vectors we're using.

Any time you scale two vectors and adding them like this, it's called a **_linear combination_** of those two vectors.

- You can see "linear" this way: if you fix one scalar and let the other one change its value freely, the tips of the resulting vectors would draw a straight line.
- When your original vectors happen to line up (共线)，the tip of the resulting vector is limited to exactly the same line.
- If both vectors are zero, you'd just be stuck at the origin.

The **_span_** of $\vec p$ and $\vec q$ is the set of all possible vectors you can reach with a linear combination of them, or put simply is the set of all their linear combinations. So restating what we just discussed,

- The span of most 2-D vectors is all vectors in this 2-D space.
- When they line up, their span is all vectors whose tips sit on that line.
- The span of two vectors is basically a way of asking what are all the possible vector you can reach using only the 2 fundamental operations of vectors--vector addition and scalar multiplication.

### 2.1 Vectors vs Points

In general, if you're thinking about a vector on its own, think of it as an arrow. And if you're dealing with a collections of vectors, it's convenient to think of them all as points.

- The span of most 2-D vectors ends up being the entire infinite sheet of the 2-D space.
- When they line up, their span is just that line.

In 3-D cases:

- Take 2 vectors in 3-D space that point in different directions. Their span is a flat sheet cutting through the origin of the 3-D space.
- Take 3 vectors:
    - If the 3rd vector happens to be sitting on the span of the first two, their span would still be the flat sheet.
        - In other words, adding a scaled 3rd vector to the linear combination doesn't really give you access to any new vectors.
    - Otherwise the span would be the whole of the 3-D space.
        - You can imagine this way: when you scale the 3rd vector, it moves the span of the first 2 vectors along its direction, sweeping the flat sheet through all the 3-D space.

In the case where the 3rd vector was already sitting on the span of the first two, or the case where two vectors happen to line up, at least one of these vectors is redundant, not adding anything to our span. Whenever this happens, you could remove one vector without reducing then span. We say that these vectors are **_linearly dependent_**. 

- Another way of phrasing that would be to say that one of the vectors can be expressed as a linear combinations of the others, since it's already in the span of the others.

On the other hand, if each vector really add another dimension to the span, they are said to be **_linearly independent_**.

Technical definition of basis:

- The bases of a vector space is a set of linearly independent vectors that span this full space.