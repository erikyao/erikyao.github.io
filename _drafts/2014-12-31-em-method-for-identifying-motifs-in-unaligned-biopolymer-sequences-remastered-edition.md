---
layout: post
title: "EM method for identifying motifs in unaligned biopolymer sequences (Remastered Edition)"
description: ""
category: Machine-Learning
tags: [ML-101, BioInformatics-101, Paper]
---
{% include JB/setup %}

总结下 [An expectation maximization (EM) algorithm for the identification and characterization of common sites in unaligned biopolymer sequences](http://www.ncbi.nlm.nih.gov/pubmed/2184437) 中的 EM 方法。

-----

* 注 0：注意标题，_identification_ and _characterization_ of **common** sites in multiple sequences

## 1. INTRODUCTION

Stormo and Hartzell focus exclusively on a mononucleotide/monoresidue model: Each position in the site has residue probabilities independent of any other position.

* 注 1-1：文章说了，这个 model 是有局限性的，我们看下后续是怎样超越这个 model 的。

The method presented here is designed to capture and characterize such structural features by employing a set of models derived from the proposed motifs. These models and the associated statistical test procedures allow for the characterization of the binding motif and improved identification of the binding sites. Additionally, a mechanism for determining the length of the site is presented. To consider these various alternative models, we employ a generalization of the information measure presented by Storma and Hartzell, the log likelihood.

* 注 1-2：方法理解了之后再回头看这段（姑且称 "回看" 为 paragraph replay 好了）

Unaligned sequences contain no explicit information on the location of the sites of interest.

The (EM) applications that are the closest to ours are **latent class models** and estimation in **finite mixture models**. We have found that the formulation of this (motif) problem as a special class of finite mixture models leads to a number of useful statistical and informational insights, to be presented elsewhere.

* 注 1-3：如果还想深入的话可以研究下这两个模型。

We begin with the mononucleotide model and then show how to incorporate specific motif characteristics through the use of models appropriate to each

* 注 1-4：请结合 `注 1-1` replay

## 2. MATERIALS AND METHODS

### 2.1 The Problem

We use cyclic adenosine monophosphate receptor protein (CRP) binding sites as an example. 

What we have from the experiments:

* Figure 2
	* 18 sequences of 105 bases
	* a second row for each sequence, mariking the start of each site with 1; other positions are marked 0 (也就是一个长度为 105 的 0-1 串)
* Figure 1
	* 21 sites, each 22 bases long, extracted from the 18 sequences above
	* 将这个 21 个 sites 排成一个 21×22 的 table，统计出了每个 column 中 ACTG 的数量

Problem:

* Reproduce Figure 1 and second rows of Figure 2, using only the sequence information

<!-- -->

* 注 2-1：表面上看，你把 Figure 2 的 site position mark 出来的话，计算 Figure 1 的统计量还不是分分钟的事情。但我们这应该是个动态的过程，Figure 1 和 Figure 2 的信息相互促进，最终收敛。

Suppose:

* one sequence, one site

Define:

* site length \\( J \\) (22 here)
* sequence length \\( L \\) (105 here)
	* thus \\( L - J \\) (83) bases outside site
* sequence number \\( N \\) (18 here)
* \\( \rho\_{b,j} \\), the probabilities for base \\( b \\) in the position \\( j \\) **within the site** (\\( j=1,2,\ldots,J, \, b=A,C,T,G \\))
* \\( \rho\_{b,O} \\), the probabilities for base \\( b \\) in any position **outside the site**
* \\( S\_i \\), the \\( i\^{th} \\) sequence
	
The start position of site could be in any of \\( \[1, L-J+1 \] \\) ([1,84] here). There are consequently \\( 84\^{18} \\) combinations of segments of 22 bases, from which the correct 18 must be chosen.

* 注 2-2：每一条 sequence 都要从 [1,84] 中选一个 mark 为 1，然后有 18 条，必然是 84^18

If we knew where the sites where, i.e., if complete data were available, then \\( \rho\_{b,j} \\) and \\( \rho\_{b,O} \\) can be estimated from the collection of marked subsequences (just as shown in Figure 1). 

Our problem is that the site location information is missing. We are challenged to find the site locations and the base probabilities, \\( \rho\_{b,j} \\), using only the sequence data \\( S\_1, \ldots S\_N \\).

### 2.1 The Algorithm

Define:

* 

In our case, we are missing (site) positional information. Thus we begin by formulating the problem as if we had the missing positional information. Given the locations of the sites in each sequence, and a model, say, the monoresidue model, the probabilities at each position in the site can be estimated. The following generalization of Stormo's and Hartzell's information measure, the log likelihood, forms the basis for the required maximum likelihood estimates