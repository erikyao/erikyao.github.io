---
layout: post-mathjax
title: "The MEME algorithm"
description: ""
category: Machine-Learning
tags: [ML-101, BioInformatics-101, Paper]
---
{% include JB/setup %}

接上一篇 [EM method for identifying motifs in unaligned biopolymer sequences](http://erikyao.github.io/machine-learning/2014/12/29/em-method-for-identifying-motifs-in-unaligned-biopolymer-sequences)，我们接着介绍 [Unsupervised Learning of Multiple Motifs in Biopolymers Using Expectation Maximization](http://link.springer.com/article/10.1007%2FBF00993379) 提出的 MEME 算法。

MEME 的基础是 EM。这一篇可以看做 "扩展原有算法" 的典范，而且后面证明 MEME "robust" 的 measurement 和 experiment 也值得学习。

-----

## 0. Intro

简单说，MEME 解决了 EM 的三个疑难：

1. 如何选择 starting point (i.e. $$ freq^{(q)} $$ 初始值)？
1. 对单个特定的 motif 而言，有个 sequence 可能包含两个 motif instances，有的可能一个 instance 也不包含。强制要求 "one sequence one motif (instance)" 会影响算法 performance
1. 如何检测多个 motif？

## 1. 如何选择 starting point

* EM 的做法是：随机构建 $$ freq $$，然后每一次都跑到 convergence
* MEME 的做法是：选择所有的 $$ k $$-mer ($$ k = LSITE $$)，按规则构建 $$ freq $$，然后每一次只跑 1-2 个 iteration，不用跑到 convergence；然后从结果中挑选 likelihood 最大的作为 starting point 再跑一次，这一次跑到 convergence
	* 理由是：EM 的收敛速度很快，1-2 个 iteration 的结果已经很好了；然后 motif 要么就在 $$ k $$-mer 之中（最强之人已在阵中！），要么就是与某个 $$ k $$-mer 非常接近，所以肯定能逮到一个结果很好的；最后跑一次到 convergence 是为了获取最精确的结果
	* 构建 $$ freq $$ 的规则：
		* 比如 $$ k $$-mer 是 `ACT`，你不能直接构建成 $$ freq_{A,1} = freq_{C,2} = freq_{T,3} = 1, \, \text{其余全 0} $$
		* 应该构建成：
			* <!-- -->$$ freq_{A,1} = 0.50, \, freq_{A,2} = 0.17, \, freq_{A,3} = 0.17 $$
			* <!-- -->$$ freq_{C,1} = 0.17, \, freq_{C,2} = 0.50, \, freq_{C,3} = 0.17 $$
			* <!-- -->$$ freq_{T,1} = 0.17, \, freq_{T,2} = 0.17, \, freq_{T,3} = 0.50 $$
			* <!-- -->$$ freq_{G,1} = 0.17, \, freq_{G,2} = 0.17, \, freq_{G,3} = 0.17 $$
		* 也不是一定要最大的是 0.5，文章说最大的 $$ freq_{l,k} $$ 介于 0.4~0.8 效果都不错
	
## 2. 0 or 2 instances in one sequence

MEME 对 $$ poff $$ 的值做了调整，限定单个 sequence 的 $$ poff $$ 之和 $$ \sum_{j}^{L-LSITE+1}poff_{ij} $$ 可以大于 1，然后所有 sequence 的 $$ poff $$ 之和不能大于 $$ MAXP $$。调整算法在 paper 的最后，Figure 12 和 Figure 13。

$$ MAXP $$ 理论上应该是 expected number of instances，但是文章后面有论述，`4.3 The expected number of motif appearance is not critical`。

这么搞有一个副作用就是：连续的 base 会被识别多次，比如 sequence 是 `AAAA`，$$ LSITE = 3 $$ 的话会被识别成 `AAA-` 和 `-AAA`，所以在调整 $$ poff $$ 时需要考虑相邻两个位置的 $$ poff $$ 不能同时大。

## 3. Multiple Motif

MEME 采取了一种 "erase" 的手段，具体说来就是给每个 $$ poff_{ij} $$ 配了一个 $$ w_{ij} $$，表示 "$$ S_{ij} $$ 不可能作为 motif start 的概率"。

初始 $$ w_{ij} = 1 $$，第一个 motif 跑完之后，算出了 $$ poff $$，然后更新 $$ w_{ij} = 1 - poff_{ij} $$。然后跑第二个 motif 时，最后得出的 $$ poff $$ 要更新为 $$ poff_{ij} := poff_{ij}*w_{ij} $$，这样就削弱了上一个 motif 位置的 $$ poff_{ij} $$。

## 4. Discussion

discussion 也有几个点值得注意，这里记录一下。

* When MEME is used to discover motifs from sequence data alone, it is performing unsupervised learning. Effectively, MEME finds clusters of similar subsequences in a set of sequences.
* When MEME is used with a dataset of sequences each of which is known to contain a motif, such as the promoter dataset, it is performing supervised learning.
	* 注: 可能有点不好理解，因为我们没有用到已知的 $$ Y $$。但我们的确是像 regression 一样获取到了一个 model 以及 model 的参数
* It may be possible to use the multiple models learned by MEME to passes through the dataset as features for another learning algorithm.
* Another promising idea is to use the short motifs learned by MEME to construct starting points for hidden Markov models.
* The idea of using subsequence-derived starting points may be adaptable for use with HMMs.
* The method used by MEME for probabilistically "erasing" sites after each pass would certainly be easy to add to the standard forward/backward HMM learning algorithm.
* It should also be possible to design a HMM which, like MEME, eliminates the assumption of one motif per sequence.
* It may also be possible to adapt MEME's innovations to learning stochastic context free grammars for biopolymer concepts.