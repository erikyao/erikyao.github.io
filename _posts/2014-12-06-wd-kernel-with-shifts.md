---
layout: post
title: "WD kernel with shifts"
description: "Digest of <i>RASE: recognition of alternatively spliced exons in C. elegans</i>"
category: Machine-Learning
tags: [Paper, SVM]
---
{% include JB/setup %}

原文 [RASE: recognition of alternatively spliced exons in C.elegans.](http://www.ncbi.nlm.nih.gov/pubmed/15961480)

-----

有必要先科普下啥是 alternative splicing。这里有篇很好的科普文 [Introduction to Split Genes and Splicing](http://www.clarkfrancis.com/docs/Intro_to_Splicing.html)。

简单说就是在 DNA → mRNA 的 transcription 过程中，有个中间产物 pre-mRNA。pre-mRNA 是 exon 和 intron 交替排列的一个结构，比如 [exon1, _intron1_, exon2, _intro2_, exon3] 这样。spliceosome 的 splicing 过程会减掉 intron，把 exon 拼接起来形成最终的 mRNA，比如 [exon1, exon2, exon3] 这样。alternative splicing 的意思就是 "我不一定只有一种拼接方式"，比如我最终的 mRNA 可能只有 [exon1, exon2]。这样的结果就是同一段 DNA，可能 transcribe 成不同的 mRNA，进一步 translate 成不同的 protein。

alternative splicing 也不止 "漏掉 exon" 这么一种形式，具体可以看 [wikipedia](http://en.wikipedia.org/wiki/Alternative_splicing#Modes)。

另外说一下术语：

* donor (splice) site: 5' end of the intron
* branch site: somewhere near the 3' end of the intron
* acceptor (splice) site: 3' end of the intron

为什么命名成 donor 和 acceptor 我一直没查到，应该是类似 "甲基供体" "氢离子受体" 这样的化学概念，由 splicing 化学反应的特点来命名的。

-----

## 1. Introduction

作者先列举了一系列新的 feature 成果，指出：

1. 这些 feature 的确很 discriminative
1. 但是有很多只适用于 conserved 的 sequence
1. human exons are frequently not conserved, making conservational features not available

于是我们提出：要用 always available 的 features 来做 constitutive spliced exon 和 alternative spliced exon 的 classification，注意他说了两个方面的 feature：

* features derived from the exon and intron lengths, and
* features based on the pre-mRNA sequence.

在后面的 combined kernel $ (\ref{eq3}) $ 中你可以看到他真的做到了。

## 2. Methods

### 2.1 A database of alternatively and constitutively spliced exons for Caenorhabditis elegans

收集数据。

注意第二段：

> In the following step we identified pairs of sequences in our set that share the same 3' and 5' boundaries of the upstream and downstream exon, respectively, where one sequence contains an internal exon and the other does not (i.e. shows evidence of alternative exon usage with the same flanking exon boundaries). This way, we identified 487 exons for which ESTs show evidence for alternative splicing.

这里的意思是：我把上下游相同的 sequences 找出来形成一个小集合（原文的 pair of sequences），它们理应是相同的，但是有的 sequence 有 internal exon 有的没有，那就说明这个 exon 有被 alternative spliced。

这 487 个 exon 是 positive training example (alternative spliced)。然后后面 2531 个是 negative training example (constitutively spliced)，鉴定方法是选出 [_intron_, exon, _intron_] 这样的 exon triples，然后：

> ... exon triples that did not show evidence for
alternative splicing. We considered this as sufficiently likely when the internal exon and the flanking introns were confirmed by at least two different EST sequences.

EST 这里就不展开了。

于是总共有 3018 个 training example，training 啊、CV 啊什么的可以就位了。

### 2.2 The weighted degree (WD) kernel

$$
\begin{align}
	K(s_i, s_j) = \sum_{k=1}^{d}{\beta_d \sum_{l=1}^{L-k+1}{I(u_{k,l}(s_i) = u_{k,l}(s_j))}}
	\tag{1}
	\label{eq1}
\end{align}
$$

* $ I(true) = 1 $ and $ I(false) = 0 $
* $ u_{k,l}(s) $ is the oligomer (['ɒlɪgəʊmə], 低聚物) of length $ k $ starting at position $ l $ of the sequence $ s $. 其实就是 $ k $-mer
* $ \beta_d = \frac{2(d-k+1)}{d(d+1)} $

这个 kernel 要求严格对齐，不能处理错位（shift）的情况，于是作者提出了 WD kernel with shifts in order to find sequence motifs which are less precisely localized:

$$
\begin{align}
	K(s_i, s_j) &= \sum_{k=1}^{d}{\beta_d \sum_{l=1}^{L-k+1}{\gamma_l \sum_{s=0; \, s+l \leq L}^{S(l)}{\delta_s \, \mu_{k,l,s,s_i, s_j}}}} \newline
	\mu_{k,l,s,s_i, s_j} &= I(u_{k,l+s}(s_i) = u_{k,l}(s_j)) + I(u_{k,l}(s_i) = u_{k,l+s}(s_j))
	\tag{2}
	\label{eq2}
\end{align}
$$

* $ l $ 是 position cursor，表示当前位置
* $ s $ 是 shift 长度
* $ \mu $ 右半部分的意思是：先把 $ s_i $ shift 几位与 $ s_j $ 比一比，再把 $ s_j $ shift 几位与 $ s_i $ 比一比
* $ \delta_s = \frac{1}{2(s+1)} $ is the weight assigned to shifts (in either direction) of extent $ s $
* $ S(l) $ determines the shift range at position $ l $ 
* $ \gamma_l $ is a weighting over the position in the sequence. `2.3.3 MKL for interpretation` 会 KWSK。

接下来证明这个 kernel 是 valid kernel，结合 Ng 的 Note 看看就好。

然后阐述了下与 oligo kernel 的区别与联系。

### 2.3 Distinguishing alternatively from constitutively spliced exons

#### 2.3.1 Overview

第一段把 introduction 又说了一遍，妹的论文还可以这样写啊……

第二段有：

> We define a 201 nt window of (−100,+100) around the acceptor and donor splice sites, respectively, and extract a pair of subsequences, $ s_{1,i} $ and  $ s_{2,i} $, for each exon $ e_i $, $ i = 1, \cdots, N $.

也就是说，对每一个 exon，我们一头一尾产生两个 sequence。比较两个 exon 时，头与头比较、尾与尾比较。这样就达成了：

> captures positional information relative to the start and the end of the exon (particularly in the intronic regions upstream and downstream and the exonic sequence near the boundaries of the exon)

于是来了个 combined kernel：

$$
\begin{align}
	K(e_i, e_j) = K(s_{1,i}, s_{1,j}) + K(s_{2,i}, s_{2,j}) + \sigma \left \langle f_i,f_j \right \rangle
	\tag{3}
	\label{eq3}
\end{align}
$$

最后那一项是一个 linear kernel，$ \sigma $ is a scaling factor and $ f_i $ is a feature vector consisting of 4 subvectors:

* $ f_{i}^{el} $ characterizing the exon length $ l(e_i) $
* $ f_{i}^{ilu} $ characterizing the upstream intron length of $ e_i $
* $ f_{i}^{ild} $ characterizing the downstream intron length of $ e_i $
* $ f_{i}^{stp} $ characterizing in which of the three frames of the exon stop codons appear

后面就不展开了。

#### 2.3.2 Model selection

开始跑 CV。然后他说的 model selection 好像就是 tune the parameters。

#### 2.3.3 MKL for interpretation

MKL 指 Multiple Kernel Learning，它的思想是这样的：如果我们有一个 linear combined kernel，比如 $ K(x,x') = \beta_1 K_1(x,x') + \cdots + \beta_n K_n(x,x') $，那我们是不是可以把 sub-kernel 看做 feature 来跑 learning？

而且 MKL 还可以这么用：比如我有 $ K_1 $ 和 $ K_2 $，我不知道该用哪个，于是我直接 $ K(x,x') = \beta_1 K_1(x,x') + \beta_2 K_2(x,x') $，如果跑出来 $ \beta_1 = 0 $，说明该用 $ K_2 $；反之同理。如果 $ \beta_1 $ 和 $ \beta_2 $ 都不为 0，那我也可以宣布 "我发明了一个新 kernel 综合了 $ K_1 $ 和 $ K_2 $ 的优点"，尼玛简直稳赚不赔。

我们这里讨论 MKL 是为了计算 $ (\ref{eq2}) $ 的 $ \gamma_l $。这里是把 $ \gamma_l $ 看成 coefficient，把剩余的部分看做了 feature。计算的结果在 `3.1.2`。

### 2.4 Finding skipped exons within introns

看样子就是先自己确定 splicing site，也就是自己定位 exon，再判断是否是 alternative splicing。还是用上面的 kernel，这里就不深入了。

另外从这一大节看出，输入应该都是 exon triple，不然单独输入一个 exon 就不用判断 splicing site 了。

### 2.5 Material and methods for the biological confirmation experiment

偏生物，skip

## 3. Results and Discussion

### 3.1 Recognition of alternatively spliced exons

#### 3.1.1 Simulation experiment

介绍试验数据

#### 3.1.2 Understanding the SVM classifier

前面我们通过 KML 计算出了 $ \gamma_l $。

$ \gamma_l $ 持续走高的区域，说明是 particularly important for discrimination，这个结论引出得很好。

然后针对这几个区域，统计 hexamer 的 frequency，可以得到潜在的 motif。

这一节的思路值得学习。

#### 3.1.3 Biological validation

skip

### 3.2 Finding skipped exons within introns

skip

## 4. Conclusion

skip