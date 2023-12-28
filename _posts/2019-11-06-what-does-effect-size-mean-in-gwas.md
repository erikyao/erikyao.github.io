---
category: Biology
description: ''
tags: []
title: What does effect size mean in GWAS?
---

这 statistics 和 biology 搁一块儿简直就是灾难：各种不讲人话的、侧面描述的、不给数学公式的定义，各种 overloaded terminology。好嘛，这又来一个 effect size。

## It's the Effect Size, Stupid

[It's the Effect Size, Stupid](https://www.leeds.ac.uk/educol/documents/00002182.htm) 是关于 effect size 的经典文章了，你 google 一般都能搜出这一篇文章。

说的是：假设有 population $X$，然后你有一个 experimental group $X_{e}$ 和一个 control group $X_{c}$，那么有 

$$
\operatorname{ES} = \frac{\mu(X_e) - \mu(X_c)}{\operatorname{SD}(X)}
$$

- $\operatorname{ES}$ 即 effect size
- $\operatorname{SD}$ 是 standard deviation
- 我觉得它其实就是用 standard deviation 作为一个 unit 去量化了两组数据的 difference 了（联系 Gaussian 分布和 Z-score）

问题有二：

- 你两个 groups，到底哪个是 experimental 哪个是 control，这是你自己说了算的，所以可以考虑加个 abs value
- $\operatorname{SD}(X)$ 需要 estimate，具体看文章

## It's NOT the Only Effect Size

根据 [StatisticsSolutions: Effect Size](https://www.statisticssolutions.com/statistical-analyses-effect-size/) 的说法，effect size 有很多种！上面的定义是 **Standardized mean difference**，只算其中一种。以下这些都算是 effect size：

- Regression coefficient (e.g. $\beta$ in $X_e = \beta X_c + \epsilon$)
- Pearson correlation coefficient (i.e. Pearson's $r$)
- Odds ratio (参 [Explaining Odds Ratios](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2938757/))
    - Exposure 可以是 Genotype
    - Outcome 可以是 Phenotype
- Cohen's $d$ effect size
- Cohen's $f^2$ effect size
- Glass's $\delta$ effect size
- Hedges' $g$ effect size
- Cramer's $V$ effect size (a.k.a. Cramer's $\varphi$)

## WTF is Effect Size?

那你可能要问了：哪到底 WTF is effect size? 它 measure 的是啥？

根据 [StatisticsSolutions: Effect Size](https://www.statisticssolutions.com/statistical-analyses-effect-size/)：

> Effect size is a statistical concept that measures the strength of the relationship between two variables on a numeric scale.

我觉得这是一句废话。

根据 [Wikipedia: Effect Size](https://en.wikipedia.org/wiki/Effect_size):

> In statistics, an effect size is a quantitative measure of the magnitude of a phenomenon.

然后 phenomenon 的定义是 an observable fact or event，等于没说，但我觉得可以扩展一下：

- 如果你的 phenomenon 是 difference of two groups，那么 **Standardized mean difference** 就是 magnitude of difference
- 如果你的 phenomenon 是 correlation of two groups，那么 **Pearson correlation coefficient** 就是 magnitude of correlation
- 依此类推，只要你的两组数据能构成一个 phenomenon，那么 effect size 它 measure 的就是这个 magnitude of phenomenon

## Effect Size in GWAS

GWAS 中你其实有两个观测对象：genotypes (or SNP alleles) 和 phenotypes，再分一个 experimental 和 control，其实你会有 4 组数据（假设是 bi-allelic；然后 phenotype 只有两种）。参考 [CMU: Genomes and Complex Diseases](http://www.cs.cmu.edu/~sssykim/teaching/f14/slides/gwas.pdf):

![](https://live.staticflickr.com/65535/49026617791_39a39f87fc_w_d.jpg)

那么怎么算 _effect size of an allele on the phenotype_?

- 用 **Standardized mean difference** 明显不对
- 用 **Pearson correlation coefficient** 好像也不对
- 用 **Odds ratio** 貌似是可以的
- ……

但其实我们用的是 Regression coefficient 哒！你会想问：这个 regression 要咋做？参考 [CMU: Genomes and Complex Diseases](http://www.cs.cmu.edu/~sssykim/teaching/f14/slides/gwas.pdf):

![](https://live.staticflickr.com/65535/49026106773_06a7a011b7_z_d.jpg)

- 这里 phenotype 是 continuous 的，但 discrete (categorical) 的情况也是类似的

这里我们忽略 intercept，只拿 slope $\beta$ 就是 GWAS 中最常见的 _effect size of an allele on the phenotype_ 了。

## Related Concepts: Penetrance / Direction of an Allelic Effect

[Penetrance is the probability of developing a particular disease given a particular genotype](https://www.cureffi.org/2016/10/19/estimation-of-penetrance/), i.e. $P(Disease \vert Allele)$. 有时候 penetrance 也被算是一种 effect size，从定义上来看也说得通。

[The direction of an allelic effect is the direction (add or subtract) that an allele has on a phenotype](https://biology.stackexchange.com/a/42272).