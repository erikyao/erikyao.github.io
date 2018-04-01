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

- Unit vector in $x$-direction $\hat i = \icol{1 \newline 0}$
- Unit vector in $y$-direction $\hat j = \icol{0 \newline 1}$

Think about each coordinate in $\icol{a \newline b}$ as a scalar. Then $\vec v = \icol{a \newline b} = a \hat i + b \hat j$. In this sense, $\icol{a \newline b}$ describes $\vec v$ as the sum of two scaled vectors. This is a surprisingly importance concept in linear algebra.

- Together, $\hat i$ and $\hat j$ are called the **_basis vectors_** of a $xy$ coordinate system. (坐标系的基向量)
- When you think about coordinates in $\vec v$ as scalars, the basis vectors are what those scalars scale to represent $\vec v$

What if we chose some arbitrary vectors as basis vectors? We could have done so and gotten a completely reasonable, new coordinate system.

- 亦即，如果有 $\vec v = a \vec p + b \vec q$，我们可以想象有一个 "$pq$ coordinate system"，它以 $\vec p$ 和 $\vec q$ 为 basis vectors，那么 $\vec v = a \vec p + b \vec q$ 就相当于是这个 $pq$ coordinate system 的一个 arrow 指向 $(a,b)$ 这个点。

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
- When they line up (共线), their span is just that line.

In 3-D cases:

- Take 2 vectors in 3-D space that point in different directions. Their span is a flat sheet cutting through the origin of the 3-D space.
- Take 3 vectors:
    - If the 3rd vector happens to be sitting on the span of the first two, their span would still be the flat sheet.
        - In other words, adding a scaled 3rd vector to the linear combination doesn't really give you access to any new vectors.
    - Otherwise the span would be the whole of the 3-D space.
        - You can imagine this way: when you scale the 3rd vector, it moves the span of the first 2 vectors along its direction, sweeping the flat sheet through all the 3-D space.

In the case where the 3rd vector was already sitting on the span of the first two, or the case where two vectors happen to line up, at least one of these vectors is redundant, not adding anything to our span. Whenever this happens, you could remove one vector without reducing then span. We say that these vectors are **_linearly dependent_**. 

- Another way of phrasing that would be to say that one of the vectors can be expressed as a linear combinations of the others, since it's already in the span of the others.

$$
\vec u \text{ is linearly dependent to } \vec v, \vec w \iff \exists a, b \text{ such that } \vec u = a \vec v + b \vec w
$$

On the other hand, if each vector really add another dimension to the span, they are said to be **_linearly independent_**.

$$
\vec u \text{ is linearly independent to } \vec v, \vec w \iff \forall a \text{ and } b, \vec u \neq a \vec v + b \vec w
$$

Technical definition of basis:

- The **basis** of a vector space is a set of linearly independent vectors that span this full space.
    - $\hat i$ and $\hat j$ are called the **_basis vectors_**
    - 它们俩合起来称作（被它们 span 构成的）2-D space 的 basis

## Chapter 3 - Linear transformations and matrices

> Unfortunately, no one can be told what The Matrix is. You have to see it for yourself. ―Morpheus

Transformation is essentially a fancy word for "function". 把 $xy$ 坐标画成网格，线性变换会旋转、拉伸、翻转这个网格（比如从正方形的格子变成菱形的）

Visually speaking, a transformation is linear if it has two properties:

1. all lines (平面内的所有 lines，不单单只是网格线) must remain lines, without getting curved; 
1. and the origin must remain fixed in place

(满足 1 但是不满足 2 的我们称为 Affine Transformation，仿射变换)

In general, you should think of linear transformations as **"keeping grid lines parallel and evenly spaced"** (保持网格线平行并等距分布). 

How would you describe one of these numerically? What formula did you give to the comupter so that if you give it the coordinates of a vector, it can give you the coordinates of where that vector lands (in the transformed space)? It turns out that you only need to record where the two basis vectors, $\hat i$ and $\hat j$, each land.

E.g. $\vec v = x \hat i + y \hat j \Rightarrow \text{Transformed } \vec v = x (\text{Transformed } \hat i) + y (\text{Transformed } \hat j)$

$\vec v = \icol{x \newline y} = x \icol{1 \newline 0} + y \icol{0 \newline 1} \Rightarrow \text{Transformed } \vec v = x \icol{i_1 \newline i_2} + y \icol{j_1 \newline j_2} = \icol{i_1x + j_1y \newline i_2x + j_2y}$

**So a two dimensional linear transformation is completely described by just 4 numbers: $\icol{i_1 \newline i_2}$ and $\icol{j_1 \newline j_2}$. It's common to package them into a $2\times2$ grid, $\icol{i_1 & j_1 \newline j_1 & j_2}$, called a $2\times2$ matrix, where you can interpret the columns as the two special vectors where $\hat i$ and $\hat j$ each land**.

这也解释了矩阵乘法的规律：$\icol{i_1 & j_1 \newline j_1 & j_2} \icol{x \newline y} = x \icol{i_1 \newline i_2} + y \icol{j_1 \newline j_2} = \icol{i_1x + j_1y \newline i_2x + j_2y}$.

Matrix-vector multiplication is just a way to compute what the linear transformation does to a given vector. 矩阵向量乘法就是计算线性变换作用于给定向量的一种途径。

If $\text{Transformed } \hat i$ and $\text{Transformed } \hat j$ are linear dependent, it means the linear transformation squishes all of 2-D space on the line where those two vectors sit, also known as the 1-D span of those two linearly dependent vectors.

## Chapter 4 - Matrix multiplication as composition (of linear transformations)

**To describe the effects of applying one linear transformation and then another**.

$$
M_2 (M_1 \vec v) = (M_2 M_1) \vec v
$$

注意这里是先做 $M_1$ 变换再做 $M_2$ 变换，它等价于直接做 $M_2 M_1$ 变换。

计算方法同上。其实 $M_1$ 的每一列都是经历了一次变换的 basis vector，$M_2 M_1$ 相当于对这些一次变换的 basis vector 做二次变换。

## Chapter 5 - The determinant (行列式)

> The purpose of computation is insight, not numbers. ―Richard Hamming

Among those linear transformations, some of them seemed to stretch space out, while others squish it in. One thing that turns out to be pretty useful for understanding one of these transformations is to measure exactly how much it stretches or squishes things. More specificantly, to measure the factor by which the area of a given region increases or decreases.

比如 $\icol{3 & 0 \newline 0 & 2}$ 就是把 $\hat i$ 拉伸 3 倍、$\hat j$ 拉伸 2 倍，这样每个网格的面积就变成了原来的 6 倍。(这个面积的计算依赖于我们的前提："keeping grid lines parallel and evenly spaced"，你试想一下如果变换后变曲线了，面积就不好算了)

**This very special scaling factor is called the determinant of that transformation**.

If the determinant of a 2-D transformation is 0, it squishes all of space onto a line, or even a single point. Since then, the area of any region would become 0.

However, in fact, a determinant can be negative. How could you scale an area by a negative amount? This has to do with the idea of orientation. Any transformation that turn over the area (想象把一张纸从正面翻到背面) is said to **invert the orientation of space**. 

Another way to think about it is to consider $\hat i$ and $\hat j$. Notice that in their starting positions, $\hat j$ is to the left of $\hat i$ ($\hat j$ 在沿 $\hat i$ 剪开的左半边). If after transformation, $\hat j$ is on the right of $\hat i$, the orientation of space has been inverted.

**Whenever the orientation of space is inverted, the determinant will be negative**, but its absolute value still tells you the factor by which the area have been scaled.

If the determinant of a matrix is 0, the basis vectors inside this matrix are linearly depenedent.

![determinant](https://farm1.staticflickr.com/807/40256097215_9f32e14a05_z_d.jpg)

$$
\operatorname{det}(M_2M_1) = \operatorname{det}(M_2) \operatorname{det}(M_1)
$$

## Chapter 6 - Inverse matrices, column space, rank and null space

> To ask the right question is harder than to answer it. ―Georg Cantor

The main reasons that linear algebra is more broadly applicable and required for just about any technical discipline is that it let us solve certain **systems of equations**. By "systems of equations", I mean you have a list of variables and a list of equations relating them.

线性方程组即是 linear system of equations.

To solve $A \vec x = \vec v$ is equivalent to, given linear transformation $A$, look for a vector $\vec x$, which lands on $\vec v$ after applying the transformation.

Let's start with $\operatorname{det}(A) \neq 0$.

Applying the transformation on $\vec x$ in reverse is equivalent to applying the **inverse** of $A$ onto $\vec v$.

$$
\vec x = A^{-1} \vec v
$$

$$
A^{-1}A = I
$$

But when $\operatorname{det}(A) = 0$, there is no inverse of $A$ (i.e. $A^{-1}$ does not exist). You cannot "unsquish" a line into a plane. At least that's not something a function can do because that would require transforming each individual vector on the line into a bunch of vectors on that plane but a function can only take a single input to a single output.

However, solution can still exist when $\operatorname{det}(A) = 0$. E.g. if your transformation $A$ squishes the space into a line and you're lucky that $\vec v$ lives on that line.