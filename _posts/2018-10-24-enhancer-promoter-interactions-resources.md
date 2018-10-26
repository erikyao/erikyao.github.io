---
layout: post
title: "Promoter-Enhancer Interactions: Resources"
description: ""
category: Biology
tags: []
---
{% include JB/setup %}

## CAGE & FANTOM

[Wikipedia: CAGE](https://en.wikipedia.org/wiki/Cap_analysis_gene_expression):

> Cap Analysis of Gene Expression (CAGE) is a gene expression technique used in molecular biology to produce a snapshot of the 5′ end of the messenger RNA population in a biological sample. The small fragments (usually 27 nucleotides long) from the very beginnings of mRNAs (5' ends of capped transcripts) are extracted, reverse-transcribed to DNA, PCR amplified and sequenced.  
> <br/>
> The output of CAGE is a set of short nucleotide sequences (often called tags) with their observed counts.  
> <br/>
> Using a reference genome, a researcher can usually determine, with some confidence, the original mRNA (and therefore which gene) the tag was extracted from.  
> <br/>
> Copy numbers of CAGE tags provide an easy way of digital quantification of the RNA transcript abundances in biological samples.

- 5' end 指的是位置，5' cap 指的是端点的那个结构
- 5‘ cap 中有一个 `G`，我们可以把它的 "position 7" (这是化学知识，我不懂) 甲基化 (添加一个 `-CH3`)，从而得到 "7-甲基鸟苷"，简称 `m7G` (甲基的英文是 methyl)
    - 这其实就是给 5' cap 做了个标记，方便你观察、提取

[Wikipedia: FANTOM](https://en.wikipedia.org/wiki/FANTOM):

> FANTOM (Functional Annotation of the Mouse/Mammalian Genome) is an international research consortium first established in 2000 as part of the RIKEN research institute in Japan.

FANTOM-$n$ 后面的 $n$ 指的是这个 consortium 的 $n^{\text{th}}$ meeting，也拿来指 meeting 相关的 publications/data 等：

- FANTOM1: 2000
- FANTOM2: 2002
- FANTOM3: 2004
    - Introduction of CAGE
- FANTOM4: 2006
- FANTOM5: 2011
    - Aimed to provide insight into the regulatory landscape of the transcriptome across as many cell states as possible.
    - Phase 1: Focused on a steady state representation of cell states
        - Taking 'snapshots' of a wide range of steady state cell types using CAGE profiling across 975 human and 399 mouse samples, resulted in 2 Nature papers:
            - [A promoter-level mammalian expression atlas](https://www.nature.com/articles/nature13182)
            - [An atlas of active enhancers across human cell types and tissues](https://www.nature.com/articles/nature12787)
            - Together, they provide an atlas of promoters, enhancers and TSSs across diverse cell types, acting as a 'baseline' for studying the complex landscape of transcription regulation.
        - A new method to identify the CAGE peaks, Decomposition Peak Analysis
            - CAGE tags are clustered by proximity, followed by [ICA (Independent Component Analysis)](http://scikit-learn.org/stable/modules/decomposition.html#ica) to decompose the peaks into non-overlapping regions. 
            - An enrichment step is applied to ensure the peaks correspond to TSSs, and external data of EST (expressed sequence tag), histone H3 lysine 4 trimethylation marks and DNase hypersensitivity sites are used to support that the peaks are genuine TSSs.
        - **A key finding showed that the typical mammalian promoter contains multiple TSSs with differing expression patterns across samples.**
            - **This implied that these TSSs are regulated separately, despite being within close proximity.**
            - **Ubiquitously expressed promoters had the highest conservation in their sequences, while cell-specific promoters were less conserved.**
                - ubiquitous: present, appearing, or found everywhere
    - Phase 2: To explore the dynamic process of transitioning cell states through the use of temporal data
        - CAGE over 19 human and 14 mouse timecourses covering a range of cell types and biological stimuli that represented 408 distinct time points.
            - timecourse: (medicine) the varying activity of a medicine over time following administration; 这里应该是类似的意思
        - Unsupervised clustering was performed to identify a set of distinct response classes, examining patterns in expression fold changes compared to time 0
            - 不同时间点检测到的 tag 可能不同，从中可以推测 regulation 的 activitity
    - Tools:
        - [ZENBU](https://zenbu-wiki.gsc.riken.jp/zenbu/wiki/index.php/Main_Page): 有点像 Genome Browser
        - [SSTAR: Semantic catalog of Samples, Transcription initiation And Regulators](http://fantom.gsc.riken.jp/5/sstar/Main_Page)
- FANTOM6: TBD
    - Aims to systematically characterize the role of lncRNA in the human genome.
    - Tools:
        - [PrESSto: Promoter Enhancer Slider Selector Tool](http://pressto.binf.ku.dk/): 2016；我没有发现有 paper；是下面 SlideBase 的前身
        - [SlideBase](http://slidebase.binf.ku.dk/): 2016；这其实是个综合性的 database，查询 FANTOM5 数据只是它功能的一部分
            - Paper: [On-the-fly selection of cell-specific enhancers, genes, miRNAs and proteins across the human body using SlideBase](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5199134/)

## ENCODE DHS

- ENCODE: Encyclopedia of DNA Elements
- DHS: DNase I Hypersensitive Site
    - 首先 DNase I 应该念 Dnase One (罗马数字)
    - 然后 DNase I 其实是个简称，标准的名字应该是 Deoxyribonuclease I，去氧核糖核酸酶-I；因为它是由 gene `DNASE1` 产生的，所以简称为 DNase I
    - DNase I 是 DNA 酶，从它的全名来看，它的作用是：通过水解，将 DNA 骨架上的磷酸双酯键切断（简单说就是个剪切酶）
    - 那 DHS 又是什么？可以看[这个视频](https://www.youtube.com/watch?v=es-SMWgX84w)，解释得非常好

[![](https://farm2.staticflickr.com/1978/45558420181_11997d493c_z_d.jpg)](https://www.youtube.com/watch?v=es-SMWgX84w)

- 蓝色的球是 histone/chromatin
- 左边的 strand，gene 没有从 histone 中展开，认为是 inactive、或者是没有表达的
- 右边的 strand，gene 从 histone 中挣脱出了，认为是 active、或者是有表达的
- 对左边的 strand 使用 Dnase I，没有作用 (因为 DNA 全部没有展开)
- 对右边的 strand 使用 Dnase I，剪切成两部分
- 同时 remove 掉 histone
- 同时使用 restriction enzyme (精准剪切)
    - 假定 restriction 的部分是 13kb，那么左边就是一条 13kb
    - 假定 DNase I 从 6kb 处切掉，那么右边会有两条，一条 6kb、一条 7kb
- 同时使用 prober，假定：只有附有 prober 的部分才能在 gel 中被读出
- 同时使用 gel
    - 左边读出一条 13kb
    - 右边读出一条 7kb
- 结论：
    - 左边的 strand 没有 DHS
    - 右边的 strand 有 DHS，且 DHS 在 7kb upstream 处 

这么一来 DHS 就好理解了：DHSs are regions of chromatin that are sensitive to cleavage by the DNase I. 

一个新的问题：DHS 到底是 promoter、enhancer、silencer、TSS 或是其他什么成分？这个问题需要后续的研究，DHS 在这里的作用是：充当 marker/anchor

## Roadmap Epigenomics DHS

- Epigenome: 表观基因组
    - The epigenome comprises all of the chemical compounds that have been added to the entirety of one’s DNA (genome) as a way to regulate the activity (expression) of all the genes within the genome. 
    - The chemical compounds of the epigenome are not part of the DNA sequence, but are on or attached to DNA ("epi-" means above in Greek)

ENCODE 和 Roadmap 这两个项目的区别

- Roadmap: research how epigenetics contributes to disease
- ENCODE: Creating comprehensive, high quality catalogs of functional elements
- Roadmap 研究 human primary cells and tissues
- ENCODE 偏 cancer cell lines

## 问题一：如何从 DHS 中划分 Promoter/Enhancer

如果 data source 只提供了 promoter 没有提供 enhancer 的话，那么 enhancer 一般可以这么定：

- 人为确定：比如非常粗暴地把 DHS 除 promoter 之外的部分都算是 enhancer，或是确定一个 window size，promoter 附件的 DHS 算 enhancer 子类的
- 通过 DHS 之外的技术确定，比如通过一个新的 data source 来做 intersection

## 问题二：如何确定 Promoter-Enhancer Interactions

这是个很大的问题，最近很多 paper 也在讨论。

人为的方法就是：用 window，promoter 附近的 enhancer 都是 candidate；或者以 TSS 为中心，window 内的 enhancer 为 candidate