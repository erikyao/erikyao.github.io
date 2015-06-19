---
layout: post-mathjax
title: "McNemar Test"
description: ""
category: Math
tags: [Math-Statistics]
---

{% include JB/setup %}

看 wikipedia 什么的都不好使，还是得看书 *Handbook of Parametric and Nonparametric Statistical Procedures*，写得非常清楚。

- McNemar: [mæk nə mar]

## 1. Overview

The McNemar test can be employed to evaluate:

- a **true experiment** (i.e., an experiment involving a manipulated independent variable)
	- The independent variable is manipulated to achieve a particular effect or tested to determine if it is the cause of the effect.
		- For example, to find out if your `weight` depends on the amount of `calories` you consume, you could lower your caloric intake (then `calories` is the manipulated variable) for a period of time and see how your `weight` changes in response.
	- There are three criteria that must be met in a true experiment:
		- Control group and experimental group
		- Researcher-manipulated variable
		- Random assignment
- or a **before–after design** (pretest vs. posttest)

The 2 × 2 table depicted in Table 20.1 summarizes the McNemar test model.

![](https://bn1304files.storage.live.com/y2pM0hDXp3ub8EZv-jSlxyaCpv5Cc52Yr_QqozI7sHJrsZP7OVlefv_QS6qEJpyMk1mDQU5HzqP8adNYGkxV-ERcHlzCc2gj3UvCutSu0Ar1iDVYQSa-TpprkBbMZQQD8Ss/table-20-01.png.jpg?psid=1)

The McNemar test is based on the following assumptions: 

- a) The sample of n subjects has been randomly selected from the population it represents; 
- b) Each of the n observations in the contingency table is independent of the other observations; 
- c) The scores of subjects are in the form of a dichotomous categorical measure involving two mutually exclusive categories; and
	- dichotomous: [daɪ'kɒtəməs], dividing or branching into two pieces.
- d) Most sources state that the McNemar test should not be employed with extremely small sample sizes.

## 2. Examples

### 2.1 Example of True Experiment

A psychologist wants to compare a drug for treating enuresis (bed-wetting) with a placebo. One hundred enuretic children are administered both the drug (Endurin) and a placebo in a double blind study conducted over a six month period. During the duration of the study, each child has six drug and six placebo treatments, with each treatment lasting one week. To insure that there are no carryover effects from one treatment to another, during the week following each treatment a child is not given either the drug or the placebo. The order of presentation of the 12 treatment periods for each child is randomly determined. The dependent variable in the study is a parent’s judgement with respect to whether or not a child improves under each of the two experimental conditions. _Table 20.2_ summarizes the results of the study. 

Do the data indicate the drug was effective?

- enuresis: [ˌenjʊəˈri:sɪs]
- placebo: [pləˈsi:bəʊ], a dummy medicine containing no active ingredients, 安慰剂, 无效对照剂

![](https://bn1304files.storage.live.com/y2p8cyb_KWiOmxe49R0n_TimiiZGEGUFvKQWM_o8UY3PI7cIuF_qrvwOGPz80lOti2JUwQ1D_FikQi433Bxvz3kkGDsAE4R8jV4rHbF54G71AglCAlHV2MBBR2JE7MhlRsr/table-20-02.png.jpg?psid=1)

### 2.2 Example of Before–after Design

A researcher conducts a study to investigate whether or not a weekly television series that is highly critical of the use of animals as subjects in medical research influences public opinion. One hundred randomly selected subjects are administered a pretest to determine their attitude concerning the use of animals in medical research. Based on their responses, subjects are categorized as pro-animal research or anti-animal research. Following the pretest, all of the subjects are instructed to watch the television series (which last two months). At the conclusion of the series each subject’s attitude toward animal research is reassessed. The results of the study are summarized in _Table 20.3_. 

Do the data indicate that a shift in attitude toward animal research occurred after subjects viewed the television series?

![](https://bn1304files.storage.live.com/y2p--ycDm5je79mhpIWPmtLmvSrf0Mfj12enIv4GwxBkbUBekhp4LXRjU-lTCh9dGQNm8INSyU-LXhPbjGLw2YRSD10rWX4ZZrCnoRYLLCrwLYOgCp6vNd5i4NA59h_4Kn9/table-20-03.png.jpg?psid=1)

## 3. Null versus Alternative Hypotheses

In conducting the McNemar test, the cells of interest are Cells `b` and `c`, since these two cells represent those subjects who respond in different response categories under the two experimental conditions (in the case of a true experiment) or in the pretest versus posttest (in the case of a before–after design).

In Example 20.1, the frequencies recorded in Cells `b` and `c`, respectively, represent subjects who respond

- (`b`) favorably to the placebo / unfavorably to the drug and 
- (`c`) favorably to the drug / unfavorably to the placebo.

If the drug is more effective than the placebo, one would expect the proportion of subjects in Cell `c` to be larger than the proportion of subjects in Cell `b`. 

In Example 20.2, the frequencies recorded in Cells `b` and `c`, respectively, represent subjects who are 

- (`b`) anti-animal research in the pretest / pro-animal research in the posttest and 
- (`c`) pro-animal research in the pretest / anti-animal research in the posttest. 

If there is a shift in attitude from the pretest to the posttest (specifically from pro-animal research to anti-animal research), one would expect the proportion of subjects in Cell `c` to be larger than the proportion of subjects in Cell `b`.

It will be assumed that **in the underlying population**, \\( \pi\_b \\) and \\( \pi\_c \\) represent the following proportions: 

- \\( \pi\_b = \frac{b}{b+c} \\)
- \\( \pi\_c = \frac{c}{b+c} \\)

If there is no difference between the two experimental conditions (in the case of a true experiment) or between the pretest and the posttest (in the case of a before–after design), the following will be true: \\( \pi\_b = \pi\_c = .5 \\). 

With respect to the sample data, the values \\( \pi\_b \\) and \\( \pi\_c \\) are estimated with the values \\( p\_b \\) and \\( p\_c \\), which in the case of Examples 20.1 and 20.2 are \\( p\_b = \frac{13}{13 + 41} = .24 \\) and \\( p\_c = \frac{41}{13 + 41} = .76 \\).

Employing the above information the null and alternative hypotheses for the McNemar test can now be stated:

- Null hypothesis \\( H\_0 \\): \\( \pi\_b = \pi\_c \\)
	- (In the underlying population the sample represents, the proportion of observations in Cell `b` equals the proportion of observations in Cell `c`.)
- Alternative hypothesis \\( H\_a \\): \\( \pi\_b \neq \pi\_c \\)
	- (In the underlying population the sample represents, the proportion of observations in Cell `b` does not equal the proportion of observations in Cell `c`.)
	- This is a **nondirectional alternative hypothesis** and it is evaluated with a **two-tailed test**. 
	- In order to be supported, \\( p\_b \\) can be either significantly larger or significantly smaller than \\( p\_c \\).
- Or alternative hypothesis \\( H\_a \\): \\( \pi\_b > \pi\_c \\)
	- (In the underlying population the sample represents, the proportion of observations in Cell `b` is greater than the proportion of observations in Cell `c`.) 
	- This is a **directional alternative hypothesis** and it is evaluated with a **one-tailed test**. 
	- In order to be supported, \\( p\_b \\) must be significantly larger than \\( p\_c \\).
- Or alternative hypothesis \\( H\_a \\): \\( \pi\_b < \pi\_c \\)
	- 同理
	
## 4. Test Computations

The test statistic for the McNemar test is based on the chi-square distribution:

$$
\begin{align}
	DF &= 1 \\\\
	\chi\^2 &= \frac{(b-c)\^2}{b+c}
\end{align}
$$

根据我们的例子有：

$$
\begin{align}
	\chi\^2 = \frac{(13-41)\^2}{13+41} = 14.52
\end{align}
$$

## 5. Interpretation of the Test Results

查表得，for \\( DF = 1 \\) the tabled critical two-tailed .05 and .01 chi-square values are

- \\( \chi\^2\_{0.05} = 3.84 \\) (which corresponds to the chi-square value at the 95th percentile) and
- \\( \chi\^2\_{0.01} = 6.63 \\) (which corresponds to the chi-square value at the 99th percentile). 

The tabled critical one-tailed .05 and .01 values are 

- \\( \chi\^2\_{0.05} = 2.71 \\) (which corresponds to the chi-square value at the 90th percentile) and 
- \\( \chi\^2\_{0.01} = 5.43 \\) (which corresponds to the chi-square value at the 98th percentile)

We can conclude the following:

- Since the obtained value \\( \chi\^2 = 14.52 \\) is greater than the tabled critical two-tailed values \\( \chi\^2\_{0.05} = 3.84 \\) and \\( \chi\^2\_{0.01} = 6.63 \\), the nondirectional alternative hypothesis \\( \pi\_b \neq \pi\_c \\) is supported at both the .05 and .01 levels. 
- Since the obtained value \\( \chi\^2 = 14.52 \\) is greater than the tabled critical one-tailed values \\( \chi\^2\_{0.05} = 2.71 \\) and \\( \chi\^2\_{0.01} = 5.43 \\), the directional alternative hypothesis \\( \pi\_b < \pi\_c \\) is supported at both the .05 and .01 levels (since \\( p\_b = .24 \\) is less than \\( p\_c = .76 \\)).

A summary of the analysis of Examples 20.1 and 20.2 with the McNemar test follows:

- Example 20.1: It can be concluded that the proportion of subjects who respond favorably to the drug is significantly greater than the proportion of subjects who respond favorably to the placebo.
	- Thus the drug is effective!
- Example 20.2: It can be concluded that following exposure to the television series, there is a significant change in attitude toward the use of animals as subjects in medical research. The direction of the change is from pro-animal research to anti-animal research. 
	- It is important to note, however, that since Example 20.2 is based on a before–after design, the researcher is not justified in concluding that the change in attitude is a direct result of subjects watching the television series. 
	- This is the case because a before–after design is an incomplete experimental design. Specifically, in order to be an adequately controlled experimental design, a before–after design requires the addition of a control group that is administered the identical pretest and posttest at the same time periods as the group described in Example 20.2. The control group, however, would not be exposed to the television series between the pretest and the posttest. Without inclusion of such a control group, it is not possible to determine whether an observed change in attitude from the pretest to the posttest is due to the experimental treatment (i.e., the television series), or is the result of one or more extraneous variables that may also have been present during the intervening time period between the pretest and the posttest.