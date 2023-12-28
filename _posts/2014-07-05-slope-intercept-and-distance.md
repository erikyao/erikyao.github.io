---
category: Math
description: 斜率、截距以及点到直线的距离
tags:
- Math-Algebra
title: Slope, Intercept and Distance
---

## 斜率（Slope）

In mathematics, the `slope` or `gradient` of a line is a number that describes both the direction and the steepness of the line. Slope is often denoted by the letter $m$. The direction of a line is either increasing, decreasing, horizontal or vertical.  

其实斜率 $m = \tan \alpha$，$\alpha$ 是直线与 $x$ 轴正方向的夹角。

-----

## 直线方程（linear equation）

### 点斜式

已知点 $ (x_0, y_0) $，斜率为 $m$，直线方程为 $ y - y_0 = m(x - x_0) $。

### 两点式

已知相异两点 $ \left (x_1, y_1 \right ) $，$ \left (x_2, y_2 \right ) $: 
	
* 若 $ x_1 = x_2 $，则直线为 $ x = x_1 $
* 若 $ x_1 \neq x_2 $，则斜率 $ m = \frac { y_2 - y_1}{x_2 - x_1} $，直线为 $ y - y_1 = m(x - x_1) $
	
### 斜截式

已知斜率 $m$，$y$ 截距（$y$-intercept）为 $c$（即告诉你直线过 $(0, c)$ 这一点） ，则直线方程问为 $y = mx + c$。 

### 截距式

已知 $x$ 截距（$x$-intercept）为 $a$（即告诉你直线过 $(a, 0)$ 这一点），$y$ 截距为 $b$，且 $ab \neq 0$，则直线方程为 $ \frac x a + \frac y b = 1 $。

-----

## 点到直线的距离（Distance）

若直线定义为 $ax + by + c = 0$，点的座标为 $ (x_0, y_0) $，则它们之间的距离 $d$ 为：

$ d = \frac{\lvert ax_0 + by_0 + c \rvert}{\sqrt{a^{2}+b^{2}}} $