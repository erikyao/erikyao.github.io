---
category: Math
description: ''
tags:
- Math-Statistics
title: Statistical Data Types
---

[1]: https://farm2.staticflickr.com/1633/24254040286_610d54c7f9_o_d.png
[2]: https://farm2.staticflickr.com/1638/23912339669_22690ebc0c_o_d.png

Today I feel it necessary to master some stats terms for better discussions of machine learning problems. 

However, the concepts are not that unified nor intuitive. Here I'd rather list some examples to illustrate.

The following note is summarized from 

- Tip #18 of [Practical Data Cleaning](https://www.linkedin.com/pulse/free-ebook-practical-data-cleaning-lee-baker) by Lee Baker
- [Quantitative and Qualitative Data](http://www.abs.gov.au/websitedbs/a3121120.nsf/home/statistical+language+-+quantitative+and+qualitative+data)
- [Scales of Measurement: Nominal, Ordinal, Interval, Ratio](https://communitymedicine4asses.wordpress.com/2013/01/13/scales-of-measurement-nominal-ordinal-interval-ratio/)
- [What is the difference between ordinal, interval and ratio variables? Why should I care?](http://www.graphpad.com/support/faqid/1089/)

-----

There are two types of data:

- Qualitative (定性的)
	- Data is qualitative when it is observed and placed into _**categories**_, such as gender (male, female), health (healthy, sick), opinion (agree, neutral, disagree).
	- 但是 _**categorical variables**_ 一般等同于 nominal variable.
- Quantitative (定量的)
	- Data is quantitative when it is _**measured**_ with a ruler, jug, weighing scales, stop-watch, thermometer and so on.
	- Quantitative data are data about _**numeric variables**_.
	
Divided further:

- Qualitative (categorized)
	- Ordinal
	- Nominal / Categorical
- Quantitative (measured / numeric)
	- Ratio
	- Interval

## 1. Nominal / Categorical

首先词语解释。

nominal: [ˈnɒmɪnl], of name

- (of a role or status) existing in name only.
- (of a price or amount of money) very small; far below the real value or cost.

所以 mominal / categorical 的特质就是“政治上是平等的”，两个值之间是无法比较的，或者你理解为不能做减法运算，比如：

- Gender := male / female ...
- Animal := pig / sheep / horse ...

你可以用 code 来表示，但是此时 code 的值是没有 order 和计算上的意义的。E.g. `male = 1` and `female = 2`, you tell me what does `1 + 2` mean? 

## 2. Ordinal

E.g. 

- Is your general health := poor / reasonable / good / excellent
- Is your annual salary := low / average / high

特点是：

- 政治上是不平等的，可以看到明显的差距；
- 有差距似乎意味着可以做减法，但是这里做减法是没有意义的。E.g. you tell me how much is `high - low`?

同样你可以用 code 表示，但是 code 同样是不具有计算意义的。

## 3. Interval

我觉得这个是最难辨认的……而且那个 "meaningful zero" 的概念也很难搞清楚……我直接举例子来说。

E.g.

- (discrete) hours := 1am / 2am / ... / 12pm / 1pm / 2pm ...
- (continuous) Celsius (or Fahrenheit) temperature := 10°C / 20°C / 30°C ...

最简单的判断方法：可以做减法（表示物理上的差距，比如 20°C 比 10°C 温度高 10°C），但是除法是没有意义的（20°C 并不表示是 10°C 的两倍那么热；注意 Kalvin temperature 的 20K 确实表示是 10K 的两倍那么热，所以 Kalvin temperature 不是 interval 而是 ratio）。

一个特别容易混淆的例子是年份：

- years in calendar := 1900 A.D. / 2000 A.D. ...
- years elapsed := 1 / 2 / 3 ...

前者是 interval：

- 2000 A.D. 比 1000 A.D. 晚 1000 年
- 2000 A.D. 并不表示 1000 A.D. 的两倍

后者是 ratio：

- 2 years 比 1 year 要长 1 year
- 2 years 的时间的确是 1 year 的两倍

## 4. Ratio

综合前面的说法，Ratio 是：

- 既可以做减法
- 也可以做除法

E.g.

- Kalvin temperature := 10K / 20K / 30K ...
- Weight := 1 lb / 2 lb ...
- Height := 1 inch / 2 inches ...

## 5. Summary

![][1]
![][2]

另可参考 [Parametric vs. non-parametric tests](/math/2015/06/20/parametric-vs-non-parametric-tests).