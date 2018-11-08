---
layout: post
title: "Terminology Recap: Pre-transcriptional Gene Regulation / Transcription / Translation / mRNA / TF / TFBS / Promoter / Enhancer / Silencer / Insulator / Exon / Intron / Codon / Alternative Splicing / Gene Isoform / Protein Isoform / ORF"
description: ""
category: Biology
tags: []
---
{% include JB/setup %}

<!-- TOC -->

- [1. Overview](#1-overview)
- [2. Transcription](#2-transcription)
    - [2.1 Transcription Initiation](#21-transcription-initiation)
        - [2.1.1 预备知识：Histone Acetylation (乙酰化) / Deacetylation (去乙酰化)](#211-预备知识histone-acetylation-乙酰化--deacetylation-去乙酰化)
        - [2.1.2 预备知识：RNA / RNA Polymerase](#212-预备知识rna--rna-polymerase)
        - [2.1.3 预备知识：TF / GTF](#213-预备知识tf--gtf)
        - [2.1.4 PIC](#214-pic)
    - [2.2 Post-transcriptional Modification](#22-post-transcriptional-modification)
        - [2.2.1 5' Capping](#221-5-capping)
        - [2.2.2 Polyadenylation](#222-polyadenylation)
        - [2.2.3 Splicing](#223-splicing)
            - [2.2.3.1 mRNA structure / Exon & Intron](#2231-mrna-structure--exon--intron)
            - [2.2.3.3 Alternative Splicing](#2233-alternative-splicing)
            - [2.2.3.4 Related Topics: Protein Isoform & Gene Isoform](#2234-related-topics-protein-isoform--gene-isoform)
- [3. Translation](#3-translation)
    - [3.1 Codon / Start Codon](#31-codon--start-codon)
    - [3.2 Related Topics: Coding Strand (Sense Strand) / Non-coding Strand (Template Strand)](#32-related-topics-coding-strand-sense-strand--non-coding-strand-template-strand)
    - [3.3 Related Topics: Reading Frame / Open Reading Frame](#33-related-topics-reading-frame--open-reading-frame)
    - [3.4 tRNA 是 amino acid 的搬运工](#34-trna-是-amino-acid-的搬运工)
- [4. Pre-transcriptional Gene Regulation](#4-pre-transcriptional-gene-regulation)
    - [4.1 Regulatory regions in DNA: promoters, enhancers, silencers, and insulators / TFBS](#41-regulatory-regions-in-dna-promoters-enhancers-silencers-and-insulators--tfbs)
        - [4.1.1 Promoter](#411-promoter)
        - [4.1.2 Enhancer](#412-enhancer)
        - [4.1.3 Silencer](#413-silencer)
        - [4.1.4 Insulator](#414-insulator)
    - [4.2 Summary](#42-summary)

<!-- /TOC -->

## 1. Overview

Central dogma of molecular biology, two steps of gene expression:

- **Transcription**: DNA $\rightarrow$ mRNA
    - In eukaryotes: gene $\xrightarrow{\text{transcribed}}$ pre-mRNA (precursor mRNA) $\xrightarrow{\text{post-transcriptional modification}}$ mRNA
    - In bacteria: gene $\xrightarrow{\text{transcribed}}$ mRNA
- **Translation**: mRNA $\rightarrow$ Protein

transcription 和 translation 发生的场所:

- In eukaryotes: 
    - transcription: nucleus  
    - translation: ribosome (核糖体) (核糖体隶属细胞质，所以必然是在细胞核外部)
- In bacteria:  
    - transcription: ribosome
    - translation: ribosome
        - Bacterial cells has no nucleus

gene regulation 其实是指 regulation of gene expression，所以它在 transcription/translation 进行前、进行中、进行后这三个阶段都可以进行，是个非常大的课题。我们这里只研究 pre-transcriptional 的 gene regulation。

## 2. Transcription

如果只考虑 eukaryotes 的话，transcription 可以分为三个阶段：

- Transcription Initiation
    - 前提：Histone Acetylation
    - 过程：GTF + _RNA pol II_ = PIC
- Elongation: 指沿着 DNA 前进逐渐 decode 出 transcript 的过程
- Transcription Termination

此时你得到只是 pre-mRNA，要得到 mRNA 你需要 Post-transcriptional Modification，包括：

- 5' capping (添加 5' cap)
- Polyadenylation (添加 poly-`A` tail)
- splicing

下面我们集中介绍 Transcription Initiation 和 Post-transcriptional Modification 这两步。

### 2.1 Transcription Initiation

#### 2.1.1 预备知识：Histone Acetylation (乙酰化) / Deacetylation (去乙酰化)

- **Histone acetylation**
    - HAT (Histone AcetylTransferase) acetylates histone proteins，弱化 DNA 与 histone 的 association，使 DNA 暴露出来，more accessible to transcription, thereby up-regulating transcription
    - Relaxed, transcriptionally-active DNA is referred to as **euchromatin**
- **Histone deacetylation**
    - HDAC (Histone DeAcetylase) deacetylates histone proteins, 强化化 DNA 与 histone 的 association, 使 DNA 隐藏起来，less accessible to transcription, thereby down-regulating transcription
    - Condensed (tightly packed) DNA is referred to as **heterochromatin**
    - It may combined with DNA methylation (gene silencing)
        - 作用是在 methyltransferase 的作用下添加甲基 $CH_3$ 到 DNA 的 `C`
        - typically occurs in `C`-rich sequences called **CpG island** (where "p" simply indicates that "C" and "G" are connected by a phosphodiester bond)
        - how does it silence the gene?
            - method 1: physically impede other binding
            - method 2: methylated DNA may be bound by "methyl cpg-binding domain proteins", or MBD for short. MBD proteins can recruit other proteins to the locus, then modifies the histomes, forming condensed inactive heterochromatin

#### 2.1.2 预备知识：RNA / RNA Polymerase

Major Types of RNA:

- mRNA (Messenger RNA): 它的 sequence 决定 protein 的 amino acids 序列
- tRNA (Transfer RNA): 每一个 tRNA 都是一个 3nt 的 sequence 并携带一个 amino acid，在 translation 阶段，tRNA 与 mRNA 对接 (每个 tRNA 的 3nt 对应 mRNA 上的一个 codon)，形成 amino acids 链 (多肽)
- rRNA (Ribosomal RNA): rRNA + ribosomal proteins = ribosome
- Small RNA: <200 nt，包括
    - snRNA (Small nuclear RNA, a.k.a U-RNA): ~150nt, mainly functions in RNA splicing 
        - 注意它都说了是 nuclear，所以必然只有 eukaryotes 才有
    - miRNA (microRNA): ~22nt, functions in RNA silencing and post-transcriptional regulation of gene expression

RNA polymerase (RNAP):

- In eukaryotes, transcription 涉及 3 大类 RNAP:
    - $\xrightarrow{\textit{RNA pol I}}$ pre-rRNAs
    - $\xrightarrow{\textit{RNA pol II}}$ mRNAs + most snRNA + most microRNA
    - $\xrightarrow{\textit{RNA pol III}}$ tRNAs + rRNA + other Small RNA (in the nucleus and cytosol)
- In bacteria, transcription 只需要 1 个大类的 RNAP: 
    - bacterial RNAP = 5 catalytic subunits ($\alpha^I, \alpha^{II}, \beta, \beta', \omega$)

因为这里我们主要研究 transcription，所以下面我们只讨论 _RNA pol II_

#### 2.1.3 预备知识：TF / GTF

TF (Transcription Factor):

- 本质是 protein
- 作用是 controls the rate of transcription (可以增强、抑制、甚至完全压制)
- defining feature 是要有一个 DNA-binding domain (DBD)，使得 TF 可以 binding 到 DNA
    - GTF 有些许例外
    - DBD 也常用来作为 TF 分类的标准
    - 以下这些 protein 都参与了 gene regulation，但是因为没有 DBD，所以不认为是 TF
        - coactivators
            - activator 是 TF，coactivators 是 binding 到 activator，形成一个 complex 共同作用
        - chromatin remodelers
            - histone acetyltransferases
            - histone deacetylases
        - kinases
        - methylases
- 分类有点混乱：
    - General TF: ubiquitous to all genes
    - Upstream TF $\approx$ Specific TF: specific to certain genes
        - 严格来说，TF 是可以 binding 到 gene downstream 的，因为有些 enhancer 就在 gene downstream
        - 有些 gene 还可以被 upstream 和 downstream 同时 regulate
        - 进一步按功能细分：
            - activator: 一般是 binding 到 promoter 或者 promoter 附近 (这个 "附近" 可以是 sequence 上接近也可能是空间上接近)，通过 protein-protein interaction 协助 GTF 和 _RNA pol II_ 的 binding (搭把手)
            - repressor: 有两种工作方式：
                - 一是 binding 到 classical silencer (一个可能的例子是 [operator](https://en.wikipedia.org/wiki/Operon#Operator), somewhere between the promoter and its gene)，阻挡 _RNA pol II_ (鸠占鹊巢)
                - 二是 binding 到 non-classical silencer，不直接干扰 _RNA pol II_ 或者 GTF，而是干扰其他 element (比如 activator 的 BS) 间接干扰 transcription (阻止搭把手)
            - 注意：同一个 TF，它可能在某些情况下是 activator，在另外一些情况下是 repressor
- ～10% of human genes 都是 translated into TF

GTF (General TF): 

- 也称 basel TF
- 本质是 protein，主要作用是协助 _RNA pol II_ binding 到 DNA，用来 activate transcription
- bacteria 的 GTF 统称为 $\sigma$ factor
    - 例如 _E. coli_ 的 GTF 就有 $\sigma^{70}, \sigma^{19}$ 等多种
    - 每一种负责 binding 不同的 set of promoters，从而 transcribe 不同的 genes
- eukaryotes 的 GTF 最重要的是构成 PIC 的 6 种：
    - TFIIA
        - 其实是 TF II A 的意思，下同
        - 这个 II 的意思是：这些 TF 是 binding 到 class II gene 的 core promoter
        - 而 class II gene 指 _RNA pol II_ transcribe 的 gene
    - TFIIB
    - TFIID
    - TFIIE
    - TFIIF
    - TFIIH

#### 2.1.4 PIC

[PIC (PreInitiation Complex)](https://en.wikipedia.org/wiki/Transcription_preinitiation_complex) 的作用是：

- 引导 _RNA pol II_ 到 TSS
- denatures the DNA，进一步对接 TSS 和 _RNA pol II_

The minimal PIC = _RNA pol II_ + 6 GTF

- TFIIA
    - 协助 TFIID
    - 自身 binding 到 TBP 而不是 DNA
    - 是某些 activator 的 co-activator
- TFIIB
    - binding 到 TBP
    - 引导 _RNA pol II_
- TFIID
    - 携带 TBP (`TATA` Binding Protein) 和 TAF (TBP-Associated Factors)
    - binding TBP 到 `TATA` box (TFIID 是这个过程中第一个 binding 到 DNA 的 TF)
        - TBP 是 PIC 的组成部分
        - ~24% of human genes 的 core promoter 都有 `TATA` box
        - TBP binding 到 `TATA` box 之后, unwinds the DNA and bends it through 80°.
            - `A-T` 间的键能比 `G-C` 小，所以 `TATA` unwind 起来比较省力
- TFIIE
    - binding 到 TBP
    - 引导 TFIIF
- TFIIF
    - binding 到 _RNA pol II_
    - 避免 _RNA pol II_ 接触 promoter 以外的区域
- TFIIH
    - binding 到 TBP
    - 引导 _RNA pol II_

注意这其实是个非常复杂的过程，具体可以参考 [Transcriptional control and the role of silencers in transcriptional regulation in eukaryotes](https://www.ncbi.nlm.nih.gov/pubmed/9512455) 的 Figure 1：

![](https://farm5.staticflickr.com/4806/43956688730_ef64500cc6_k_d.jpg)

- GAGA factor 的作用是 chromatin priming, which mark genes for future expression
- INR == INitiator Element
    - INR 下面那个箭头是 TSS

### 2.2 Post-transcriptional Modification

#### 2.2.1 5' Capping

- 指添加 5' cap 到 pre-mRNA 的 5' end 的过程
- 5' cap 本质是一个 modified `G`
    - 可以帮助 ribosome 捕捉 mRNA

#### 2.2.2 Polyadenylation

- 指添加 Poly-`A` tail 到 pre-mRNA 的 3' end 的过程
    - pre-mRNA 末尾会出现一段名为 polyadenylation signal 的 sequence
    - 这段 sequence 会被一种 enzyme 切断，然后另外一种 enzyme 会在切断处添加 100100100～200200200 个 `A` (丧心病狂！)，从而形成 poly-`A` tail
- Poly-`A` tail makes the transcript more stable and helps it get exported from the nucleus to the cytosol

#### 2.2.3 Splicing

##### 2.2.3.1 mRNA structure / Exon & Intron

Splicing 就是把 pre-mRNA 的 intron 切掉、把 exon 拼在一起、最终形成 mature 的 mRNA 的过程。

我们先看一下 mature 的 mRNA 的结构：

- 5' cap
- 5' UTR (UnTranslated Region):
    - 指 `[TSS, start codon)` 这个区域
    - 主要作用是 regulate translation，手段有：
        - 构成有 regulate 作用的 complex secondary structure
        - 通过自身的 IRES (Internal Ribosome Entry Site) 可以促进 cap-independent translation
            - cap-independent 指 translation 不需要 5' cap to initiate scanning from the 5' end of the mRNA until the start codon
        - 虽然名叫 UTR, 但某些情况下还是能产生一些 protein 去 regulate translation
- Coding Region (a.k.a CDS, CoDing Sequence): `[start codon, stop codon]`
- 3' UTR (UnTranslated Region):
    - Immediately follows the stop codon
    - Often contains regulatory regions that can influence polyadenylation, translation efficiency, localization, and stability of the mRNA.
- Poly-`A` tail

从结构上看，5' cap 和 Poly-`A` tail 是外来的，那么 **5' UTR、CDS、3' UTR 全部来自 gene 本身**。

- UTR 是 UnTranslated Region，暗含了一个它是来自 transcription 的意思

考虑到 intron 被切掉，若我们称 pre-mRNA 的 5' UTR、CDS、3' UTR 为 "原始 5' UTR"、"原始 CDS"、"原始 3' UTR"，可以得出，从 sequence 的角度看：

- `Gene = 原始 5' UTR + 原始 CDS + 原始 3' UTR`
- `Gene - Introns = 5' UTR + CDS + 3' UTR`

那么什么是 exon 和 intron？

- An exon is any part of a gene that will encode a part of the final mature RNA produced by that gene after introns have been removed. 
- An intron is any part of a gene that is removed by RNA splicing during maturation of the final RNA product.
    - 题外话：In recent years, we have discovered that RNA molecules (especially small RNAs such as siRNAs and miRNAs) are much more involved in regulating gene expression than previously thought. Often the small regulatory RNAs are derived from spliced introns.

从这个定义我们可以看出：

- `Gene = Introns + Exons`
- `Exons = 5' UTR + CDS + 3' UTR`

综合一下有：

- `Gene = Introns + Exons = 原始 5' UTR + 原始 CDS + 原始 3' UTR`
- `Gene - Introns = Exons = 5' UTR + CDS + 3' UTR`
- `Introns = (原始 5' UTR + 原始 CDS + 原始 3' UTR) - (5' UTR + CDS + 3' UTR)`

这里的重点是：

- Exon/Intron 是对 Gene 的划分，5' UTR/CDS/3' UTR` 是对 mRNA 的划分，虽然 Gene 和 mRNA 在 sequence 上有对等关系，但是这两种划分方式是不搭架的
- 这也可以消除一个长久以来的误区：就是以为只有 ~~`原始 CDS = Exons + Introns; CDS = Exons`~~
- 从另一个角度来看，**intron 在 "原始 5' UTR"、"原始 CDS"、"原始 3' UTR" 这三个区域都可能出现**
    - 在 "原始 CDS" 中出现不足为奇，在 "原始 5' UTR" 和 "原始 3' UTR" 中出现相对较 rare
    - 一般情况是：一个大 exon 包含了整个 "原始 5' UTR" 和 "原始 CDS" 的部分，"原始 5' UTR" 在 splicing 中完全没有受影响，直接有 `原始 5' UTR == 5' UTR`
        - "原始 3' UTR" 的情况类似

下图是一般情况，即 "原始 5' UTR" 和 "原始 3' UTR" 不包含 intron 的示意图：

![](https://farm2.staticflickr.com/1943/45046661764_aa41944c4d_z_d.jpg)

下图是 rare 情况，即 "原始 5' UTR" 和 "原始 3' UTR" 包含 intron 的示意图：

![](https://farm5.staticflickr.com/4819/43954115550_24784c09f0_z_d.jpg)

##### 2.2.3.3 Alternative Splicing

注意 splice 的意思：

- splice: join or connect (a rope or ropes) by interweaving the strands

不要误以为是 "slice"。

但 alternative splicing 其实是 slice 和 splice 都可能发生变化。

最简单的例子：Exon skipping：

- 比如 pre-mRNA 是 `[exon1, intron1, exon2, intro2, exon3]` 这样
- 一般的理解就是 spliceosome 减掉 intron，把 exon 拼接起来形成 `[exon1, exon2, exon3]` 这样
- Exon skipping 的话就会产生 `[exon1, exon3]`
    - 这里切法没有变化，是拼接发生了变化

Alternative splicing 的结果就是同一段 DNA，可能 transcribe 成不同的 mRNA，进一步 translate 成不同的 protein。

- 这些不同的 mRNA 可以称为 splice variant

Alternative splicing 也不止 Exon skipping 这么一种形式，具体可以看 [wikipedia: Alternative Splicing Modes](http://en.wikipedia.org/wiki/Alternative_splicing#Modes)。注意蓝色和黄色都是 exon，横线才是 intron。

另外说一下术语：

- donor (splice) site: 5' end of the intron
- branch site: somewhere near the 3' end of the intron
- acceptor (splice) site: 3' end of the intron

为什么命名成 donor 和 acceptor 我一直没查到，应该是类似 "甲基供体" "氢离子受体" 这样的化学概念，由 splicing 化学反应的特点来命名的。

##### 2.2.3.4 Related Topics: Protein Isoform & Gene Isoform

[wikipedia: Protein Isoform](https://en.wikipedia.org/wiki/Protein_isoform#Examples)

> A **protein isoform**, or **protein variant** is a member of a set of highly similar proteins that originate from a single gene or gene family and are the result of genetic differences.

[wikipedia: Gene Isoforms](https://en.wikipedia.org/wiki/Gene_isoform)

> **Gene isoforms** are mRNAs that are produced from the same locus but are different in their TSSs, CDSs and/or UTRs, potentially altering gene function.

- 这个命名也是很迷：protein isoform 本质还是 protein；但 gene isoform 的本质不是 gene 而是 mRNA. Whatever.
- 明显 splice variant 是 gene isoform
- 目前我还不清楚 gene isoform 和 protein isoform 是不是一定有一一对应的关系

## 3. Translation

目前我还不需要深入研究 translation，下面就介绍些小知识点

### 3.1 Codon / Start Codon 

mRNA 上面 3 个 nt 一组的 genetic code 我们称为 _**codon**_。Translation 阶段就是根据 codon 来生成 amino acids 并最终 synthesize 成 protein

- 严格来说，codon 是 RNA 的概念，但是也经常用在 DNA 身上

Start codon: the first codon of a mRNA being translated

- The most common start codon is `AUG` in eukaryote (参 [Kozak consensus sequence](https://en.wikipedia.org/wiki/Kozak_consensus_sequence))
    - non-`AUG` start codons are very rare in eukaryotic genomes.
        - 例子：[Translational Initiation at a Non-AUG Start Codon for Human and Mouse Negative Elongation Factor-B](http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0127422)
- In prokaryotes:
    - E. coli uses 83% `AUG`, 14% `GUG`, 3% `UUG`

### 3.2 Related Topics: Coding Strand (Sense Strand) / Non-coding Strand (Template Strand)

这部分本来应该是 transcription 的内容，但是涉及到 codon，所以我们放到这里讲

DNA 的 **coding strand** (a.k.a **sense strand**) 指与 mRNA sequence 相同的那条 strand (ignoring that `T`s in DNA are replaced by `U` in mRNA).

与之相对的另一条 strand 我们称为 **non-coding strand** (a.k.a. **template strand**)

- 要求不那么严格的话，我们可以说 coding strand 包含 codon
- 同理也称 non-coding strand 包含 anti-codons
- 注意 transcription 的逻辑：
    - _RNA pol II_ 是在 non-coding strand 上工作的, 它根据 anti-codons 来合成 complementary 的 codon
- exon 和 intron 一定是位于 coding strand 上的

### 3.3 Related Topics: Reading Frame / Open Reading Frame

[NCBI Genetics Review: Reading Frames](https://www.ncbi.nlm.nih.gov/Class/MLACourse/Original8Hour/Genetics/readingframe.html):

> A reading frame refers to one of three possible ways of reading a nucleotide sequence.

[wikipedia: Open Reading Frames](https://en.wikipedia.org/wiki/Open_reading_frame):

> An ORF is a continuous stretch of codons that contain a start codon (usually `AUG`) and a stop codon (usually `UAA`, `UAG` or `UGA`).

![](https://farm5.staticflickr.com/4890/31902798608_fd14bd8410_o_d.png)

### 3.4 tRNA 是 amino acid 的搬运工

tRNA (Transfer RNA): 每一个 tRNA 都是一个 3nt 的 sequence 并携带一个 amino acid，在 translation 阶段，tRNA 与 mRNA 对接 (每个 tRNA 的 3nt 对应 mRNA 上的一个 codon)，形成 amino acids 链 (多肽)

一图胜千言：

![](https://upload.wikimedia.org/wikipedia/commons/0/0f/Peptide_syn.png)

## 4. Pre-transcriptional Gene Regulation

回头看 transcription 的 2 个关键步骤：

- 前提：Histone Acetylation
- 过程：GTF + _RNA pol II_ = PIC

所以我们这里说的 pre-transcriptional gene regulation 无论手段如何，最终落脚点都在这 3 个要素上。

当然 transcription 是个复杂系统，肯定存在其他的地方你可以去 regulate，但本文目前不讨论。

### 4.1 Regulatory regions in DNA: promoters, enhancers, silencers, and insulators / TFBS

回顾一下 Specific TF 的分类：

- activator: 一般是 binding 到 promoter 或者 promoter 附近 (这个 "附近" 可以是 sequence 上接近也可能是空间上接近)，通过 protein-protein interaction 协助 GTF 和 _RNA pol II_ 的 binding (搭把手)
- repressor: 有两种工作方式：
    - 一是 binding 到 classical silencer (一个可能的例子是 [operator](https://en.wikipedia.org/wiki/Operon#Operator), somewhere between the promoter and its gene)，阻挡 _RNA pol II_ (鸠占鹊巢)
    - 二是 binding 到 non-classical silencer，不直接干扰 _RNA pol II_ 或者 GTF，而是干扰其他 element (比如 activator 的 BS) 间接干扰 transcription (阻止搭把手)
- 注意：同一个 TF，它可能在某些情况下是 activator，在另外一些情况下是 repressor

promoter / enhancer / silencer / insulators 这四者都可以绑定 TF，所以说它们都包含 TFBS (直接说它们都是 TFBS 不太准确)，但是绑定 TF 的种类不同：

- Promoter:
    - core $\Leftrightarrow$ GTF (因为是 PIC 发生地)
    - proximal $\Leftrightarrow$ Specific TF (activator 或 repressor)
    - distal $\Leftrightarrow$ Specific TF (activator 或 repressor)
- Enhancer $\Leftrightarrow$ Specific TF (activator)
- Silencer $\Leftrightarrow$ Specific TF (repressor)
- Insulator:
    - Enhancer-blocker $\Leftrightarrow$ Specific TF (姑且可以认为是 repressor？)
    - Histone-barrier $\Leftrightarrow$ Specific TF (姑且可以认为是 activator？)

我要强调的几点是：

- 这几个命名一点都不 systematic，比如 promoter 的三个区域，我觉得功能区别很大，捏在一个很不好理解
    - 另外关于 core promoter element：我是把 PIC 看做 transcription 的步骤，所以我觉得 core promoter element 区域不算 regulatory region
        - 同理我也觉得 GTF 不算 regulation 的参与者，它们是 transcription 的参与者
            - **最根本的问题是：我觉得 Transcription Initiation 不算 regulation 的过程**。但是如果你把 Transcription Initiation 当做一个 regulation 的过程，那么 GTF 就是 regulation 参与者，core promoter element 就是 regulation region。我看到的很多文献都是这么认为，但我觉得这样并不帮助你理解这个问题
- **promoter 与 enhancer / silencer / insulators 这三者不是同一个级别的概念**：
    - enhancer 可能出现在 promoter
    - silencer 可能出现在 promoter
    - insulator 与 enhancer 和 silencer 应该可以看做是同一级别
    - 这个问题归根结底我觉得还是 promoter 的定义不够清晰

#### 4.1.1 Promoter

Eukaryotic Promoter Sequence:

- 100~1000 nt
- 在 target gene 的 upstream 区域 (同一 strand)，接近 target gene
- 单个 promoter 按与 TSS (Transcription Start Site) 的距离可以划分为三个区域：
    - **core**: ~34 upstream from TSS，整个区域会 cover 到 TSS
        - PIC 发生地
    - **proximal**: ~250nt upstream from TSS
    - **distal**: even further

![](https://farm5.staticflickr.com/4893/45725146872_20cb4458be_z_d.jpg)

#### 4.1.2 Enhancer

- 50~1500nt
- bound by activators
- Generally cis-acting (regulate the expression of genes on the same chromosome)
    - can also be trans-acting (regulate the expression of genes on another chromosome)
- An enhancer can be located
    - up to 1 Mbp away from the target gene
    - either upstream or downstream from target TSS
    - even within an intron of the target gene
    - or within a promoter (一般在 distal)
        - P.S. An enhancer is not necessarily part of a promoter
- An enhancer can operate either in the forward or backward direction.
    - Thus we call enhancers "orientation independent"

#### 4.1.3 Silencer

- bound by repressors
- 一般出现在 target gene upstream -20nt 到 -2000nt 的位置
    - 也可能出现在 gene 的 intron or exon
    - 也可能出现在 promoter
- 有两种类型：
    - classical silencer: repressor 直接阻挡 RNA pol II
    - non-classical silencer: repressor 干扰其他 positive regulatory elements，间接 negatively regualte

#### 4.1.4 Insulator

- 300~2000nt 
- bound by TF 之后，可以产生两种作用
    - Enhancer-blocker: 
        - 一般发生在 neighboring genes 的区域，比如 `[gene A, enhancer B, insulator C, gene D]` 的情形
            - 假定正常情况下 `B` enhance `A`，但是前面也有说 enhancer 是 orientation independent，所以也可能 `B` 反过来作用于 `D`
            - 这是 enhancer-blocker `D` 和 bound protein 可以阻挡 `B` 的作用，使它掉头回去作用于 `A`
        - 也可以发生在不同 chromosome 上但空间上相近的两个 genes 上 (inter-chromosomal interaction)
    - Histone-barrier: 阻止区域内的 gene 被 histone deacetylation 而卷入 chromatin，从而避免 gene 因此不能被 transcribe
- 单个 insulator 有可能同时发挥上述两个作用

![](https://farm5.staticflickr.com/4876/45775566311_21d9033b39_z_d.jpg)

### 4.2 Summary

- Promoter:
    - core $\Leftrightarrow$ GTF $\xrightarrow{\text{affect}}$ GTF + _RNA pol II_
    - proximal: may harbor enhancers or silencers
    - distal: may harbor enhancers or silencers
- Enhancer $\Leftrightarrow$ Specific TF (activator) $\xrightarrow{\text{affect}}$ GTF + _RNA pol II_
- Silencer
    - classical silencer $\Leftrightarrow$ Specific TF (repressor) $\xrightarrow{\text{affect}}$ _RNA pol II_
    - non-classical silencer $\Leftrightarrow$ Specific TF (repressor) $\xrightarrow{\text{affect}}$ Other positive regulatory elements
- Insulator:
    - Enhancer-blocker $\Leftrightarrow$ Specific TF (姑且可以认为是 repressor？) $\xrightarrow{\text{affect}}$ Enhancer
    - Histone-barrier $\Leftrightarrow$ Specific TF (姑且可以认为是 activator？) $\xrightarrow{\text{affect}}$ Histone Acetylation

这个总结不一定准，总会有新的研究和发现会打破我们现有的认识。

这里我想再次强调本节开头的陈述：无论你 regulation 的手段如何，最终落脚点都在 Histone Acetylation、GTF、_RNA pol II_ 这 3 个要素上。