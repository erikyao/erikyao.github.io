---
layout: post
title: "Terminology Recap: DNase / DHS / Dnase-seq"
description: ""
category: Biology
tags: []
---
{% include JB/setup %}

## DNase I

- 首先 DNase I 应该念 Dnase One (罗马数字)
- 然后 DNase I 其实是个简称，标准的名字应该是 Deoxyribonuclease I，去氧核糖核酸酶-I；因为它是由 gene `DNASE1` 产生的，所以简称为 DNase I
- DNase I 是 DNA 酶，从它的全名来看，它的作用是：通过水解，将 DNA 骨架上的磷酸双酯键切断（简单说就是个剪切酶）
    - 注意它是斩 DNA 而不是斩 chromatin

## DHS

DHS = DNase I Hypersensitive Site. 

简单来说：DHS 就是 (在 chromatin 存在的大环境下) DNA 中容易被 DNase 斩断的位置

- 也就意味着 DHS 是 "没有被 chromatin 裹挟的" DNA 部分

那我们为什么要研究 DHS？

- chromatin 的介绍在 [Terminology Recap: Genome / Chromosome / Nucleosome / Chromatin / Chromatid / DNA / Double Strands](/biology/2018/11/05/terminology-recap-genome-dna-chromosome-chromatin-chromatid-double-strands)
- [Terminology Recap: Pre-transcriptional Gene Regulation / Transcription / Translation / mRNA / TF / TFBS / Promoter / Enhancer / Silencer / Insulator / Exon / Intron / Codon / Alternative Splicing / Gene Isoform / Protein Isoform / ORF](/biology/2018/11/06/terminology-recap-pre-transcriptional-gene-regulation-transcription-translation) 讲过 chromatin/histone 是会影响 regulation 的，可以想见的途径有：
    - chromatin $\overset{\text{hides/exposes}}{\longrightarrow}$ gene 
    - chromatin $\overset{\text{hides/exposes}}{\longrightarrow}$ promoter/enhancer/silencer $\overset{\text{regulates}}{\longrightarrow}$ gene
- 那么 DHS 可能会是 gene，也可能会是 promoter/enhancer/silencer
- 但 DHS 具体是什么成分，需要后续的研究。对这些研究而言，DHS 的作用是充当 marker/anchor

下面这个视频介绍了如何定位 DHS：

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

## DNase-seq

上面那个视频介绍的方法只能定位 DHS，那具体 DHS 是怎样的一个 sequence，就需要用 DNase-seq 来确定 (那为何不叫 DHS-seq？岂不是更好懂？)