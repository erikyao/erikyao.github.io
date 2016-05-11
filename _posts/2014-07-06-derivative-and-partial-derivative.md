---
layout: post
title: "Derivative and Partial Derivative"
description: "导数与偏导数"
category: Math
tags: [Math-Algebra]
---
{% include JB/setup %}

感谢 [良田围](http://www.baidu.com/p/良田围) 网友在 [偏导数有什么用](http://zhidao.baidu.com/link?url=RuoDXCMzDU5A8p8D4SoIqnefEF0aK4CsVphkspenAGIWCrb8SPv-f4ouJJysB-2-pxxC4jVN7BLguR2Yakuuja) 问题上的精彩回复，以下全文摘抄，仅加音标并稍微排版。

-----

## 一、导数的概念

* 在英国，导数喜欢用 differentiation [ˌdɪfəˌrenʃɪ'eɪʃn]；  
* 在美国，导数喜欢用 derivative [dɪˈrɪvətɪv]。意义上没有差别。  

<!-- -->

* 求导：都是 differentiate [ˌdɪfə'renʃɪeɪt]；  
* 可导、可微：都是 differentiable；  
* 可导性、可微性：都是 differentiability [ˌdɪfəˌrenʃɪə'bɪlɪtɪ]。  

<!-- -->

* 导数 dy/dx，在几何图形上，是斜率的意思，是 y 随着 x 的变化而变化的 “比率”；    
* 导数 dx/dt，在运动学上，是速度的意思，是 x  随着时间 t 的变化而变化的 “比率”。  

dy/dx，读成 d y over d x (都按字母读)；  
国内的普遍嗜好是，将 dy/dx 写成 y'，读成 y prime。  

上面是按符号读音，出题时，不是 find the dy/dx，就是 differentiate with respect to x 
= 对 x 求导，缩写是 differentiate y w.r.t. x. = 求 y 对 x 的导数。  

在中文中，导数有两个含混不清的意思：

1. 函数的导函数，这是一个新的函数；
2. 函数在某点的斜率的值，或导函数在某点的具体值，是一个具体的数字。

## 二、偏导数的概念

前面讲的是一元函数的求导，导数就是函数随着自变量的变化而变化的 “变化率”：

* dy/dx 是 rate of change of y with respect to x；
* dy/dt 是 rate of change of y with respect to t。

通常，我们习惯于将 Rate of change = Related rate of change = 相关变化率，用于对时间 t 求导。  

当一个函数有两个或两个以上的各自独立的自变量时，如 u = f(x, y, z)，x, y, z 各自的变化都会引起 u 的变化。  

∂u/∂x：表示由于 x 的单独变化所引起的 u 变化率 (rate of change)；

* 在空间几何上，表示 u 沿着 x 方向的导数，也就是斜率；也就是在平行于 y-z 的所有平面上看函数 u(x,y,z) 随着x变化的规律。
* 在意义上等同于 dy/dx
* 但由于有多个自变量，为了与一元函数做出区别，把 dy/dx 写成了 ∂u/∂x；
* ∂u/∂x 读成 partial u over partial x，整体意义是 partial differentiation w.r.t. x 
* 对 x 求偏导时，将 y、z 当作常数
* 可以理解成局部变化率，部分变化率，也就是只随着一个变量的变化率。     

∂u/∂y、∂u/∂z：类推。

## 三、全导数的概念

沿着空间任意一个方向 (l 方向) 的导数，称为全导数 = total differentiation。  

它是在 l 方向上由 x、y、z 一起变化，整体 (over all) 引起 z 的变化。  

dz = (∂u/∂x) dx + (∂u/∂y) dy + (∂u/∂z) dz 这就是全微分的标准形式。  

## 四、偏导数的应用

偏导数的应用及其广泛，有了上面的共同语言，下面以理想气体状态方程 (State equation of ideal gas) 为例说明偏导数的运用：  

PV = nRT  

P：压强；V：体积；T：绝对温度；这三个都是状态量 (State Property)。     
n：No of moles = 摩尔数；R ：Gas constant = 气体常数。

∂V/∂P：体积随着压强的变化率。  

(1/V)∂V/∂P：

* > 0 时，是 Expansivity = 体积膨胀率；
* < 0 时，是 Comprssibility = 体积的压缩率。 

∂T/∂P：Joule-Thomson coefficient = 焦耳-汤姆孙温压系数 = 压强增加引起升温的比率、变化率。  

∂H/∂T：Heat capacity at constant pressure = 等压热容量（H = Enthalpy = 焓）。  

∂U/∂T：Heat capacity at constant Volume = 等容热容量（U = Internal Energy = 内能）。  

总而言之：

偏导数是用来计算局部原因变化所引起的函数的变化率：  

* ∂u/∂x 是由 x 的单独变化，引起的 u 的绝对变化率； 
* (1/u)∂u/∂x 是由 x 的单独变化，引起的 u 的相对变化率。
* ∂u/∂y 是由 y 的单独变化，引起的 u 的绝对变化率； 
* (1/u)∂u/∂y 是由 y 的单独变化，引起的 u 的相对变化率。

针对具体的物理过程、化学工程，有具体的名称。  