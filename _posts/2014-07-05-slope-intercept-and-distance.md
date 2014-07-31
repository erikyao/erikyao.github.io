---
layout: post-mathjax
title: "Slope, Intercept and Distance"
description: "斜率、截距以及点到直线的距离"
category: Math
tags: [Math-Algebra]
---
{% include JB/setup %}

## 斜率（Slope）

In mathematics, the `slope` or `gradient` of a line is a number that describes both the direction and the steepness of the line. Slope is often denoted by the letter `m`. The direction of a line is either increasing, decreasing, horizontal or vertical.  

其实斜率 `m = tanα`，α 是直线与 x 轴正方向的夹角。

-----

## 直线方程（linear equation）

### 点斜式

已知点 (x0, y0)，斜率为 m，直线方程为 y - y0 = m(x - x0)。

### 两点式

已知相异两点 (x1, y1) (x2, y2): 
	
* 若 x1 = x2，则直线为 x = x1
* 若 x1 != x2，则斜率 m = (y2 - y1) / (x2 - x1)，直线为 y - y1 = m(x - x1)
	
### 斜截式

已知斜率 m ，y 截距（y-intercept）为 c（即告诉你直线过 (0, c) 这一点） ，则直线方程问为 y = mx + c。 

### 截距式

已知 x 截距（x-intercept）为 a（即告诉你直线过 (a, 0) 这一点），y 截距为 b，且 ab ≠ 0，则直线方程为 x/a + y/b = 1。

-----

## 点到直线的距离（Distance）

若直线定义为 ax + by + c = 0，点的座标为（x0, y0），则它们之间的距离 d 为：

\\( d = \left| \frac{ax_0 + by_0 + c}{\sqrt{a^{2}+b^{2}}} \right| \\)