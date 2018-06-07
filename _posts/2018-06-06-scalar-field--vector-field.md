---
layout: post
title: "Scalar Field / Vector Field"
description: ""
category: Math
tags: [Math-Algebra]
---
{% include JB/setup %}

$$
\newcommand{\icol}[1]{
  \bigl[ \begin{smallmatrix} #1 \end{smallmatrix} \bigr]
}
$$

首先我们在 [Is vector space a field? And what are: Groups / Rings / Fields / Vector Spaces?](/math/2018/06/06/is-vector-space-a-field-and-what-are-groups-rings-fields-vector-spaces) 讲的 field 是 algebra 的概念，但是 scalar field 和 vector field 里的 field 是 geometry 的概念，所以 scalar field、vector field 和 "group、ring、field" 里的这个 field 是不搭边的。

然后很多定义里用到的 map 或者 mapping，你可以简单理解为 function。[Is there any difference between mapping and function?](https://math.stackexchange.com/questions/95741/is-there-any-difference-between-mapping-and-function) 提到 function 一般是映射到 $\mathbb{R}$，但是 map 可以映射到 anyting，比如说映射到一个 vector space $V$。

## Vector Field

Quote from [Lecture 19: Vectorfields, Math S21a: Multivariable calculus by Oliver Knill, Harvard Summer School](http://www.math.harvard.edu/~knill/teaching/summer2011/handouts/53-vectorfield.pdf):

A **vector field** in a plane is a map, which assigns each point $(x, y)$ to a vector $\vec F(x, y) = \langle P(x, y), Q(x, y) \rangle$. 

A **vector field** in a 3D space is a map, which assigns each point $(x, y, z)$ to a vector $\vec F(x, y, z) = \langle P(x, y, z), Q(x, y, z), R(x, y, z) \rangle$.

Quote from [Wikipedia: Vector field](https://en.wikipedia.org/wiki/Vector_field):

If each component of $\vec F$ is continuous, then $\vec F$ is a **continuous vector field**, and more generally $\vec F$ is a **$C^k$ vector field** if each component of $\vec F$ is $k$ times continuously differentiable.

我自己做了一个例子：想象 $x^2 + y^2 = 1$ 这个圆在顺时针转动（圆心不动），每个点都沿切线有一个速度，这个切线速度我们用一个单位向量表示（暂不考虑向量长度的物理意义）。考虑圆与 axes 的 4 个焦点：

- $\vec F(1, 0) = \langle 0， -1 \rangle = \icol{0 \newline -1}$
- $\vec F(0, 1) = \langle 1， 0 \rangle = \icol{1 \newline 0}$
- $\vec F(-1, 0) = \langle 0， 1 \rangle = \icol{0 \newline 1}$
- $\vec F(0, -1) = \langle -1， 0 \rangle = \icol{-1 \newline 0}$

**我们把这 4 个向量分别移动到对应的 4 个交点上（起点重合）**，可以得到：

![](https://farm2.staticflickr.com/1755/42631307851_f2d9e223a5_m_d.jpg)

这个 vector field 的定义可以归纳为 $\vec F(x, y) = \langle y, -x \rangle = \icol{y \newline -x}$。如果限定 $\vec F$ 的 domain 为 $\lbrace (x, y) \mid x^2 + y^2 = 1 \rbrace$，那么 $\vec F$ 的 image 就是圆上所有顺时针切线单位向量的集合。

如果不限定 domain，我们用 Wolfram 画一下：

```r
VectorPlot[{y, -x}, {x, -3, 3}, {y, -3, 3}]
```

![](https://farm2.staticflickr.com/1741/41734955725_c6f6c8541e_z_d.jpg)

可见向量的长度其实是有实际意义的。不过很多 vector field 的示意图里，由于 magnitude 的问题，向量经常画成统一的长度，然后用颜色来表示向量的长度级别。

其实这个概念你联系物理应用就很好理解。磁场 (Magnetic Field)、洋流 (Ocean Current)、风向以及其他各种流体力学，比如风洞 (Wind Tunnel) 测试，都可以用 vector field 表示：

![](https://farm2.staticflickr.com/1742/42584095142_346ef6fa9e_z_d.jpg)

![](https://farm2.staticflickr.com/1760/27765941547_59ab885ecc_z_d.jpg)

![](https://farm2.staticflickr.com/1723/27765941507_04df6b9893_z_d.jpg)

![](https://farm2.staticflickr.com/1737/42584095012_4fce9c8369_z_d.jpg)