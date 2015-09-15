---
layout: post
title: "The aims of Transcriptome Profiling, ChIP-seq and DNase-seq"
description: ""
category: Biology
tags: [Biology-101]
---
{% include JB/setup %}

## Transcriptome Profiling

其实 Transcriptome Profiling 是个抽象的概念，而且涉及到 profiling (the act or process of learning information about someone based on what is already known)，就可以简单理解为确定某些东西的成分。

[Wiki - Transcription (genetics): Measuring and detecting transcription](https://en.wikipedia.org/wiki/Transcription_(genetics)#Measuring_and_detecting_transcription) 列的这几个技术中，DNA microarrays 和 RNA-Seq 都是隶属 Transcriptome Profiling 的具体的技术。下面我们稍微说一下 RNA-Seq。

RNA-seq (RNA sequencing), also called whole transcriptome shotgun sequencing (WTSS), is a technology that uses the capabilities of next-generation sequencing to reveal a snapshot of RNA presence and quantity from a genome at a given moment in time. 所以明显，RNA-seq 就是给 RNA 测序用的。Transcriptome Profiling 大致也就是这样类似的功能。

## ChIP-seq

ChIP-seq combines **chromatin immunoprecipitation** (ChIP) with massively parallel DNA sequencing to identify the binding sites of DNA-associated proteins. It can be used to map global binding sites precisely for any protein of interest. Previously, ChIP-on-chip (后面一个 chip 指 DNA microarray) was the most common technique utilized to study these protein–DNA relations.

- immunoprecipitation: (immunology) A technique in which an antigen is precipitated from solution by using an antibody, or a particular use of this technique. 免疫沉澱法，是一種研究蛋白質間交互作用的生物技術，這種技術是將蛋白質視為抗原，並利用抗體與之進行特異性結合的特性，來進行研究。這項技術可用來將含有上千種不同蛋白質的樣品中，分離和濃縮出特定蛋白質。
	- precipitation: [prɪˌsɪpɪˈteɪʃn]
		- (meteorology) Any or all of the forms of water particles, whether liquid or solid, that fall from the atmosphere, 降水
		- (countable, chemistry) A reaction that leads to the formation of a heavier solid in a lighter liquid, 沉淀 (物)
		
从 [Genome / Gene, Locus, Allele, Genotype & Phenotype / Gene Regulation](/biology/2015/09/12/genome-gene-locus-allele-genotype-and-phenotype-gene-regulation/) 里可以得知，TF 也是一种 protein，所以我们可以使用 ChIP-seq 来发现 TF，进一步发现 Gene control regions。

## DNAce-seq