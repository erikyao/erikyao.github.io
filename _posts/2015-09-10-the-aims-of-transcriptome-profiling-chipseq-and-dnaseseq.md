---
layout: post
title: "The aims of Transcriptome Profiling, ChIP-seq and DNase-seq"
description: ""
category: Biology
tags: []
---
{% include JB/setup %}

## Transcriptome Profiling

其实 Transcriptome Profiling 是个抽象的概念，而且涉及到 profiling (the act or process of learning information about someone based on what is already known)，就可以简单理解为确定某些东西的成分。

[Wikipedia - Transcription (biology): Measuring and detecting transcription](https://en.wikipedia.org/wiki/Transcription_(biology)#Measuring_and_detecting) 列的这几个技术中，DNA microarrays 和 RNA-Seq 都是隶属 Transcriptome Profiling 的具体的技术。

- RNA-seq (RNA sequencing), a.k.a Whole Transcriptome Shotgun Sequencing (WTSS)
- RNA-seq 就是给 RNA 测序

## ChIP-seq

ChIP-seq combines **chromatin immunoprecipitation** (ChIP) with massively parallel DNA sequencing to identify the binding sites of DNA-associated proteins. It can be used to map global binding sites precisely for any protein of interest. Previously, ChIP-on-chip (后面一个 chip 指 DNA microarray) was the most common technique utilized to study these protein–DNA relations.

- immunoprecipitation: (immunology) A technique in which an antigen is precipitated from solution by using an antibody, or a particular use of this technique. 免疫沉澱法，是一種研究蛋白質間交互作用的生物技術，這種技術是將蛋白質視為抗原，並利用抗體與之進行特異性結合的特性，來進行研究。這項技術可用來將含有上千種不同蛋白質的樣品中，分離和濃縮出特定蛋白質。
	- precipitation: [prɪˌsɪpɪˈteɪʃn]
		- (meteorology) Any or all of the forms of water particles, whether liquid or solid, that fall from the atmosphere, 降水
		- (countable, chemistry) A reaction that leads to the formation of a heavier solid in a lighter liquid, 沉淀 (物)
		
因为 TF 也是一种 protein，所以我们可以使用 ChIP-seq 来发现 TF，进一步发现 Gene control regions。

ChIP-seq analysis R 语言实际操作：[ChIP-seq analysis basics](https://www.bioconductor.org/help/course-materials/2015/CSAMA2015/lab/Epigenetics_and_Chip_seqLab.pdf)

## DNase-Seq

A deoxyribonuclease ([di:'ɒksɪrɑɪbəʊ'nju:klɪeɪs], 脱氧核糖核酸酶, DNAse, for short) is any enzyme that catalyzes the hydrolytic cleavage (cleave, [kli:v], 劈) of phosphodiester linkages in the DNA backbone, thus degrading DNA. Deoxyribonucleases are one type of nuclease, a generic term for enzymes capable of hydrolising phosphodiester bonds that link nucleotides.

DNA double helix is packaged by histones to form chromatin. 而 DNase-Seq 的作用就是 to find open chromatin (where DNA 从 histone 中解放出来，gene control region 得以暴露出来)。

我们研究的最终目的是 to find gene control regions，所以 DNase-Seq + ChIP-seq 是一个挺好的 combo。