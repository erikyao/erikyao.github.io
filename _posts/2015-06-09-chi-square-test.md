---
layout: post-mathjax
title: "Chi-Square Test for Independence"
description: "To test whether two categorical variables are independent"
category: Math
tags: [Math-Statistics]
---
{% include JB/setup %}

总结自：

- [Stat Trek: Chi-Square Test for Independence](http://stattrek.com/chi-square-test/independence.aspx)
- [Wikipedia: Chi-squared test](http://en.wikipedia.org/wiki/Chi-squared_test)

<!-- -->

- Chi: [kaɪ]

其实还有 Chi-square test for variance in a normal population 以及 Chi-squared distribution，这里不涉及。

-----

## What is a chi-square test

A chi-square test is also referred to as \\( \chi\^2 \\) test (\\( \chi \\) 这个符号在 latex 里就是 `\chi`).

The test is applied when you have two [categorical variables](http://stattrek.com/statistics/dictionary.aspx?definition=Categorical%20variable) from a single population. It is used to determine whether these two categorical variables are independent.

## Digress: What is a categorical variable?

Variables can be classified as **categorical** (aka, qualitative) or **quantitative** (aka, numerical).

- Categorical variables take on values that are names or labels. E.g. 
	- the color of a ball (red, green, blue, etc.)
	- the breed of a dog (collie, shepherd, terrier, etc.)
- Quantitative variables represent a measurable quantity. E.g.
	- the population of a city
	
## When to Use Chi-Square Test for Independence

The test procedure is appropriate when the following conditions are met:

- The sampling method is [simple random sampling](http://stattrek.com/statistics/dictionary.aspx?definition=Simple%20random%20sampling).
- The variables under study are each categorical.
- If sample data are displayed in a contingency table, the expected frequency count for each cell of the table is at least 5.

## State the Hypotheses

Given variable \\( A \\) (which has \\( r \\) levels), and variable \\( B \\) (which has \\( c \\) levels), 

- \\( H_0 \\): variable \\( A \\) and variable \\( B \\) are independent. 
- \\( H_a \\): variable \\( A \\) and variable \\( B \\) are not independent.

## Analyze Sample Data

- **Degrees of freedom:** \\( DF = (r - 1) * (c - 1) \\)
- **Expected frequencies:** \\( E\_{r,c} = (n\_r * n\_c) / n \\)
	- \\( E\_{r,c} \\) is the expected frequency count for level \\( r \\) of variable \\( A \\) and level \\( c \\) of variable \\( B \\)
	- \\( n\_r \\) is the total number of sample observations at level \\( r \\) of variable \\( A \\)
	- \\( n\_c \\) is the total number of sample observations at level \\( c \\) of variable \\( B \\)
	- \\( n \\) is the total sample size
- **Test statistic:** \\( \chi\^2 = \sum{\left \[ \frac{(O\_{r,c} - E\_{r,c})\^2}{E\_{r,c}} \right \]} \\)
	- \\( O\_{r,c} \\) is the observed frequency count for level \\( r \\) of variable \\( A \\) and level \\( c \\) of variable \\( B \\)
- **p-value:** 计算时需要 \\( DF \\) 和 \\( \chi\^2 \\) 两个值，可以使用 [Chi-Square Calculator: Online Statistical Table](http://stattrek.com/online-calculator/chi-square.aspx)

## Example

![](https://bn1304files.storage.live.com/y2p9hVJduauRqjkTVOhIQiKAgyf8QZcdj1tomlskE4F2ajNvluHeUKiLL1lGd0tCwiEv6HmWwsIbrgriyCaFB1Qlm2gp1Izv1eTBG3hDn-n0KfWhmJtKBOCr7G63mrQyQLj/problem.png.jpg?psid=1)

**Question:** Is there a gender gap? Do the men's voting preferences differ significantly from the women's preferences?

- \\( H_0 \\): "Gender" and "Voting Preference" are independent. 
- \\( H_a \\): "Gender" and "Voting Preference" are not independent.

$$
\begin{align}
	DF &= (r - 1) * (c - 1) = (2 - 1) * (3 - 1) = 2 \\\\
	E\_{1,1} &= (400 * 450) / 1000 = 180000/1000 = 180 \\\\
	E\_{1,2} &= (400 * 450) / 1000 = 180000/1000 = 180 \\\\
	E\_{1,3} &= (400 * 100) / 1000 = 40000/1000 = 40 \\\\
	E\_{2,1} &= (600 * 450) / 1000 = 270000/1000 = 270 \\\\
	E\_{2,2} &= (600 * 450) / 1000 = 270000/1000 = 270 \\\\
	E\_{2,3} &= (600 * 100) / 1000 = 60000/1000 = 60 \\\\
	\chi\^2 &= (200 - 180)\^2/180 + (150 - 180)\^2/180 + (50 - 40)\^2/40 + \\\\
			& \phantom{\{\}=1} (250 - 270)\^2/270 + (300 - 270)\^2/270 + (50 - 60)\^2/60 \\\\
			&= 2.22 + 5.00 + 2.50 + 1.48 + 3.33 + 1.67 = 16.2
\end{align}
$$

查表得 \\( P(DF=3, \chi\^2>16.2) = 0.0003 \\).

Since the p-value (0.0003) is less than the significance level (0.05), we cannot accept the null hypothesis. Thus, we conclude that there is a relationship between gender and voting preference.