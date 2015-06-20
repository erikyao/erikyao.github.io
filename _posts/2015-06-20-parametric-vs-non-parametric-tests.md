---
layout: post
title: "Parametric vs. non-parametric tests"
description: ""
category: Math
tags: [Math-Statistics]
---
{% include JB/setup %}

参考资料：

- Handbook of Parametric and Nonparametric Statistical Procedures
- [Wikipedia: Nonparametric statistics](https://en.wikipedia.org/wiki/Nonparametric_statistics)
- [Parametric vs. non-parametric tests](http://changingminds.org/explanations/research/analysis/parametric_non-parametric.htm)
- [Levels of Measurement](http://www.socialresearchmethods.net/kb/measlevl.php)

----- 

我们先看下 Handbook 怎么说：

The inferential statistical procedures discussed in this book have been categorized as being **parametric** versus **nonparametric** tests. Some sources distinguish between parametric and nonparametric tests on the basis that parametric tests make specific **assumptions** with regard to one or more of the **population parameters** that characterize the underlying distribution(s) for which the test is employed. These same sources describe nonparametric tests as making no such assumptions about population parameters. In truth, nonparametric tests are really NOT assumption free, and in view of this some sources (e.g., Marascuilo and McSweeney (1977)) suggest that it might be more appropriate to employ the term "assumption freer" rather than nonparametric in relation to such tests.

The distinction employed in this book for categorizing a procedure as a parametric versus a nonparametric test is primarily based on the level of measurement represented by the data that are being analyzed. As a general rule, 

- inferential statistical tests that evaluate **categorical/nominal** data and **ordinal/rank-order** data are categorized as nonparametric tests, 
	- nominal: [ˈnɒmɪnl], of name
		- (of a role or status) existing in name only.
		- (of a price or amount of money) very small; far below the real value or cost.
	- A categorical variable (sometimes called a nominal variable) is one that has two or more categories, but there is no intrinsic ordering to the categories. 
		- For example, gender is a categorical variable having two categories (male and female) and there is no intrinsic ordering to the categories.
	- In statistics, ordinal data is a statistical data type consisting of numerical scores that exist on an ordinal scale, i.e. an arbitrary numerical scale where the exact numerical quantity of a particular value has no significance beyond its ability to establish a ranking over a set of data points.
		- Examples of ordinal data are often found in questionnaires: for example, the survey question "Is your general health poor, reasonable, good, or excellent?" may have those answers coded respectively as 1, 2, 3, and 4. 
		- Sometimes data on an interval scale or ratio scale are grouped onto an ordinal scale: for example, individuals whose income is known might be grouped into the income categories $0-$19,999, $20,000-$39,999, $40,000-$59,999, ..., which then might be coded as 1, 2, 3, 4, ....
	- Categorical data and ordinal data are **qualitative**.
- while those tests that evaluate **interval** data or **ratio** data are categorized as parametric tests.
	- Interval data is like ordinal except we can say the intervals between each value are equally split. 
		- E.g. the income categories above $0-$19,999, $20,000-$39,999, $40,000-$59,999, ...
	- In a ratio scale, numbers can be compared as multiples of one another. Thus one person can be twice as tall as another person. Important also, the number zero has meaning.
	- Interval and ratio data measure quantities and hence are **quantitative**.
	
![](https://bn1304files.storage.live.com/y2pHrl4VIkr6ip66vI6XRMERWY4Yrfvl6HNyTsb_7SqwhAMtvdPzBVsFISgmzEMtFpo3qmXHWyLk7E1nHoanvcbx2mlspr0AG_pu6-BvxRla5_LEaEXcCjUCrXxwF1Ig_HWqOyHj647jFdHvVqx18cgJg/measlev2.gif?psid=1&width=400&height=268&cropMode=center)

Although the appropriateness of employing level of measurement as a criterion in this context has been debated, its usage provides a reasonably simple and straightforward schema for categorization that facilitates the decision-making process for selecting an appropriate statistical test.

-----

![](https://bn1304files.storage.live.com/y2pKG9ZnrjLGQycgGKW7uUQxDKxHwacHMuEPjAy1Kgax4IBvrbbHnbF1VGYWygzrGUtGkcMAx4KuGsKmjuOJPY0_RUgHDZuokIXMvnwpBUkd0iholv3BHqzAhYSODzRvU2KQih-YbUdXkio_FOFLL51hQ/alternative%20tests.png?psid=1&width=1080&height=337&cropMode=center)
