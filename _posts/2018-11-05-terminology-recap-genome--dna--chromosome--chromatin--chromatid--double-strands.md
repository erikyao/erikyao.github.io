---
layout: post
title: "Terminology Recap: Genome / Chromosome / Nucleosome / Chromatin / Chromatid / DNA / Double Strands"
description: ""
category: Biology
tags: []
---
{% include JB/setup %}

## Genome 

Genome is the genetic material of an organism. It consists of DNA, or RNA in RNA viruses. 具体说来，下列元素都属于 genome：

- DNA
    - protein-coding genes
    - pseudogenes
    - transposon (TE - transposoble element)
    - DNA elements that can 'jump' to a new genomic location
- RNA
    - rRNA (ribosomal RNA)
    - tRNA (transfer RNA)
    - short non-coding RNA
        - miRNA (microRNA)
            - MicroRNAs usually induce gene silencing by binding to target sites found within the 3’UTR of the targeted mRNA. This interaction prevents protein production by suppressing protein synthesis and/or by initiating mRNA degradation.
            - MicroRNAs are partially complementary to one or more messenger RNA (mRNA) molecules, and their main function is to downregulate gene expression in a variety of manners, including translational repression, mRNA cleavage, and deadenylation.
        - siRNA (short interfering RNA, double-stranded)
            - may come from outside the cell (e.g. virus); endo-siRNA also discovered, transcribed from cell's own DNA
            - the most commonly used RNA interference (RNAi) tool for inducing short-term silencing of protein coding genes
            - siRNA is a synthetic RNA duplex designed to specifically target a particular mRNA for degradation.
        - 参考：
            - [siRNA Applications](http://dharmacon.gelifesciences.com/applications/rna-interference/sirna/?rdr=true&LangType=2052&pageid=2147484497)
            - [Learn the Distinction Between siRNA and miRNA](https://www.thebalance.com/the-differences-between-sirna-and-mirna-375536)
    - lncRNA (long non-coding RNA)
        - $\ge$ 2000 nt
        - variety of functions

DNA/RNA 其实是 molecule 的名称，所以 genome 和 DNA/RNA 的关系大致相当于 "一坨炭" 和 "碳分子" 的关系

## Chromosome / Chromatin / Nucleosome / Chromatid / DNA / Double Strands

DNA 是大分子名，Double Strand 是它的物理结构，所以大致上可以认为 DNA == Double Strand

- Nucleotide ([‘nju:klɪətaɪd], 核苷酸)，包括：
    - Adenine ([‘ædənɪn], 腺嘌吟)
    - Cytosine ([‘saɪtəʊsi:n], 胞嘧啶)
    - Guanine ([‘gwɑ:ni:n], 鸟嘌呤)
    - Thymine ([‘θaɪmi:n], 胸腺嘧啶)
- `Nucleotide + Sugar-Phosphate Backbone == 1 DNA Double Strand` (or Double Helix)
- `1 DNA Double Strand + Histones == 1 Chromatin`
    - DNA-histone complex 整体叫做 **chromotin**
    - The basic repeating structural (and functional) unit of chromatin is the **nucleosome**, which contains 8 histone proteins and about 146 bp of DNA
    - 参 [DNA Packaging: Nucleosomes and Chromatin](https://www.nature.com/scitable/topicpage/dna-packaging-nucleosomes-and-chromatin-310)
- cell 在不分裂的情况下：further condensed `1 Chromatin == 1 Chromosome`
    - chromosome 按功能分类可以分为 allosome ([‘ælʊsəʊm], 性染色体) / autosome ([‘ɔ:təsəʊm], 常染色体)
    - 人体的 autosome 是按长度从长到短编号的，最长的是 1 号，最短的是 22 号
    - 类似 _chr18_ 这样的都是 1 条 chromosome 的名字，我们说人体每个细胞都有 a pair of _chr18_'s
        - pair up 的两条 chromosomes 称为 homologous chromosomes (或 homologs for short), 原义是指 identical to one another in shape and size，但明显 `XY` 不能算
        - "identical in shape and size" 明显不意味着 "identical in sequence"
        - We can specify **maternal** _chr18_ and **paternal** _chr18_ to indicate from which parent it is inherited.
- cell 在分裂的情况下 (具体在 [Cell Cycle](/biology/2015/07/29/cell-cycle) 的 S phase)：一条 chromatin 会分裂成两条 chromatids
    - Every chromatid has a short **p-arm** ("p" for "petit") and a long **q-arm** ("q" for "queue")
    - Every 2 chromatids are connected by a **centromere**.
    - 我们在研究单条 chromosome 的时候仍然会使用 p-arm、q-arm 和 centromere 来细分单条 chromosome 的结构
    - **注意：** 我们经常看到的 chromosome 的图片都是一个 _X-shaped with 4 arms_ 的结构，这其实是分裂中的两条 chromatids，**注意这并不是 chromosome 的正常形态，人体内并不是有 23 对这样的 X-shaped chromosomes** (我 TM 被这个图片骗惨了！)
        - 更多讨论见 [Quora: Why a chromosome is represented as X shaped with four chromatids while by definition it has two chromatids?](https://www.quora.com/Why-a-chromosome-is-represented-as-X-shaped-with-four-chromatids-while-by-definition-it-has-two-chromatids)

数量关系：

- Every human cell has `23 pairs == 46 chromosomes`
- `1 chromosome == 2 strands`
- So every human cell has 92 strands 