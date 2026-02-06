---
category: Math
description: ''
tags:
- Math-Algebra
title: Gradient and Directional Derivative
---

Original post is [The Gradient and Directional Derivative](https://math.oregonstate.edu/home/programs/undergrad/CalculusQuestStudyGuides/vcalc/grad/grad.html) from _Mathematics School, Oregon State University_. Here I thank the author(s) sincerely. 

Some notes and changes of symbols were made by myself.

-----

## Gradient

The gradient of a function $w=f(x,y)$ is the vector function:

$$
\nabla f(x,y) = \langle \frac{\partial f}{\partial x}(x,y), \frac{\partial f}{\partial y}(x,y) \rangle
$$

This definition generalizes in a natural way to functions of more than three variables.

## Gradient Examples

For the function $z=f(x,y)=4x^2+y^2$, the gradient is

$$
\nabla f(x,y) = \langle 8x, 2y \rangle
$$

For the function $w=g(x,y,z)=\exp(xyz)+\sin(xy)$, the gradient is

$$
\nabla g(x, y, z) = \langle yz \exp(xyz) + y \cos(xy), xz \exp{xyz}, xy \exp(xyz) \rangle
$$

## Geometric Description of the Gradient Vector

There is a nice way to describe the gradient geometrically. Consider $z=f(x,y)=4x^2+y^2$. The surface defined by this function is an elliptical paraboloid (椭圆抛物面). This is a bowl-shaped surface. The bottom of the bowl lies at the origin. The figure below shows the **level curves**, defined by $f(x,y)=c$, of the surface. The level curves are the ellipses $4x^2+y^2=c$.

- 注：A **level set** of a real-valued function $f$ of $n$ real variables is defined as $L_c(f) = \left \\{ (x_1, \dots, x_n) \mid f(x_1, \dots, x_n) = c \right \\}$ where $c$ is a constant. 
    - When $n=2$, a level set is generally a curve, called a **level curve**, **contour line** or **isoline**
    - When $n=3$, a level set is called a **level surface**
    - When $n>3$, a level set is called a **level hypersurface**

![](/assets/posts/2018-04-04-gradient-and-directional-derivative/40350203525_548d1e15bc_w.jpg)

The gradient vector $\langle 8x,2y \rangle$ is plotted at the 3 points $(\sqrt{1.25}, 0)$, $(1,1)$, $(0, \sqrt{5})$. As the plot shows, the gradient vector at $(x,y)$ is **normal** to the level curve through $(x,y)$. As we will see below, the gradient vector points in the direction of greatest rate of increase of $f(x,y)$.

- 注：In geometry, a **normal** is an object such as a line or vector that is perpendicular to a given object

In three dimensions the level curves are level surfaces. Again, the gradient vector at $(x,y,z)$ is normal to level surface through $(x,y,z)$.

## Directional Derivative

For a function $z=f(x,y)$, the partial derivative with respect to $x$ gives the rate of change of $f$ in the $x$ direction and the partial derivative with respect to $y$ gives the rate of change of $f$ in the $y$ direction. How do we compute the rate of change of $f$ in an arbitrary direction?

The rate of change of a function of several variables in the direction $u$ is called the **directional derivative** in the direction $u$. Here $u$ is assumed to be a unit vector. Assuming $w=f(x,y,z)$ and $u = \langle u_1,u_2,u_3 \rangle$, we have

$$
D_u f(x,y,z) = \nabla f(x,y,z) \cdot u = \frac{\partial f(x,y,z)}{\partial x} u_1 + \frac{\partial f(x,y,z)}{\partial y} u_2 + \frac{\partial f(x,y,z)}{\partial z} u_3
$$

Hence, the directional derivative is the dot product of the gradient and the vector $u$. Note that if $u$ is a unit vector in the $x$ direction, i.e $u=\langle 1,0,0 \rangle$, then the directional derivative is simply the partial derivative with respect to $x$. For a general direction, the directional derivative is a combination of the all three partial derivatives.

注：更宽泛的一个定义是：不要求 $u$ 是 unit vector，有 $D_u f(x) = \nabla f(x) \cdot \frac{u}{\vert u \vert}$

## Directional Derivative Example

What is the directional derivative in the direction $<1,2>$ of the function $z=f(x,y)=4x^2+y^2$ at the point $(1,1)$? 

The gradient is $\langle 8x,2y \rangle$, which is $\langle 8,2 \rangle$ at the point $(1,1)$. The direction $u$ is $\langle 2,1 \rangle$. Hence,

$$
D_u f(1,1) = \nabla f(1, 1) \cdot \frac{u}{\vert u \vert} = \langle 8, 2 \rangle \cdot \langle \frac{2}{\sqrt{5}}, \frac{1}{\sqrt{5}} \rangle = \frac{18}{\sqrt{5}}
$$