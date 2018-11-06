---
layout: post
title: "Terminology Recap: Gene / Allele & Dominance & Zygosity / Haplotype / Genotype / Phenotype / Trait"
description: ""
category: Biology
tags: []
---
{% include JB/setup %}

## 1. Gene

首先有三个问题容易引起误解：

1. 可以说 "所有人都有相同的 gene" 吗？
1. DNA 是 double-strand 结构，然后 human chromosome 是成 pair 的，那么单个 gene 是会出现在两个 strand 上的吗？
1. 一个人的所有细胞都有相同的 DNA 吗？

### 1.1 问题一

第一个问题有点难解释主要是因为我们对 gene 的定义。我个人比较喜欢的一个 gene 的定义来自 [Neilfws@Biostars: Question: Difference Between Gene Expression And Transcript Expression](https://www.biostars.org/p/91173/#91201):

> In a sense, there is no such thing as a gene. A gene is a concept: **a fuzzy bounded region of a chromosome within which transcription occurs**. So really there is no gene expression, only transcript expression.  
> <br/>  
> I'd even argue that "expression" itself is not a very useful term and we should simply use "transcription".

按这个理解，在理想状态下，即不考虑 mutation 等异常情况的状态下，所有人的 "region of a chromosome within which transcription occurs" 是相同的。比如我们假定 `chr1:0-7` 是一个 gene，它控制头发的颜色，那么所有人的 `chr1:0-7` 应该都是这个控制头发颜色的 gene region。是 gene 的 allele、haplotype、genotype 的不同才导致了人有不同的头发颜色。

所以总结起来就是：可以认为 "所有人都有相同的 gene"，是 genotype 的不同导致了个体差异 (i.e. 不同的 phenotype)。

### 1.2 问题二

第二个问题的困惑来自于我们没有限定 gene 的 strand 和 父系/母系 chromosome。假定我们用 `(p)` 表示父系、用 `(m)` 表示母系，那么人体的 23 对 chromosome 可以表示为：

- `chr1(p)` + `chr1(m)`
- ……
- `chr22(p)` + `chr22(m)`
- 男性：`chrY(p)` + `chrX(m)`；女性：`chrX(p)` + `chrX(m)`

然后 gene 的位置是 strand-specific 的，一个 gene 不可能既在 forward strand 同时又在 reverse strand 上 (可以参考 [DNA Strand / Upstream and Downstream / TSS Distance](/biology/2016/04/21/dna-strand-upstream-and-downstream-tss-distance))。下面我们假定 `chr1:0-7` 就是 forward strand 上的，并用 `(+)` 和 `(-)` 表示 strand。

结合上面三点理解：

1. A gene is a bounded region of a chromosome within which transcription occurs
1. A gene location is strand-specifc
1. "所有人都有相同的 gene" (所以你的父亲和母亲的 gene 也是相同的)

那么我们说 "`chr1:0-7` 是一个 gene"，它在单个人体的 DNA 里面的结构是：

- `chr1(p)(+):0-7` 是一个 gene
- `chr1(m)(+):0-7` 是一个相同的 gene
- 这两个 gene 的 allele 可能是相同的，也可能不同，它们一起构成一个 genotype，最终表达成一个 phenotype

### 1.3 问题三

这个问题有肯定的回答：Yes。细胞的分化来自于它们对 transcription 的选择 (或者理解为对 gene 的激活/表达的选择)，但是每个细胞所携带的 DNA 都是一样的。

## 2. Allele

首先要搞清楚 allele 最开始是和 gene 相关的概念，所以也会被翻译成 "等位基因" (其实这个翻译本身也不咋地)，然后才引申到 SNP level。那 allele 本意是什么呢？

[Wiktionary: allele](https://en.wiktionary.org/wiki/allele):

> Borrowed from German **Allel**, shortened from **Allelomorph**, from English **allelomorph**. Ultimately from the Ancient Greek prefix **ἀλληλ- (allēl-)** from **ἄλλος (állos, "other")**.

你看到 "-morph" 这个 suffix 就应该好理解了：allele 在 gene 层面的意思就是 "**variant form of a gene**"。比如，假定 `chr1:0-7` 是一个 gene (假定 0-based，下同)，那么：

- `chr1:0-7`: `AAGC<C>TA`
- `chr1:0-7`: `AAGC<T>TA`

这就是两个 allele。当然，并没有限定说 gene allele 间只能有 1bp 的不同。

把 allele 扩展到 SNP level 就是 "**variant form of a SNP**"，因为 SNP 只有 1bp，所以 SNP allele 就不同的 1bp，比如：

- `chr1:4-5`: `<C>`
- `chr1:4-5`: `<T>`

## 3. Haplotype / Genotype 

在 human genome 层面，简单说：**haplotype 是一个或多个 gene 的 allele 的集合；两个 haplotypes 构成一个 genotype，或者说 haplotype == haploid genotype**。

- 所以 haplotype 也不要翻译成 "单倍型" 了，就叫 "单倍基因型" 不就好了？

[Scitable: haplotype / haplotypes](https://www.nature.com/scitable/definition/haplotype-haplotypes-142):

> A **haplotype** is a group of genes within an organism that was inherited together from a single parent. The word "**haplotype**" is derived from the word "**haploid**," which describes cells with only one set of chromosomes, and from the word "**genotype**," which refers to the genetic makeup of an organism.

- 中学生物学到的 `AA`、`Aa`、`aa` 中的 `A` 和 `a` 其实是 2 个 allele，但是它假定了一个非常简单的 haplotype：直接由单个 gene 的 allele 构成。所以我们可以简单理解为：
    - `allele A == chr1:0-7 : AAGC<C>TA`
        - `haplotype 1 == {allele A of gene chr1:0-7}`
    - `allele a == chr1:0-7 : AAGC<T>TA`
        - `haplotype 2 == {allele a of gene chr1:0-7}`
- 这两个 haplotype 构成一个 genotype `Aa`
    - 严格来说 geneotype 应该是一个 haplotype tuple：`genotype 1 == (haplotype 1, haplotype 2) == ({allele A of gene chr1:0-7}, {allele a of gene chr1:0-7})`
- 最多可以有 3 个 genotypes `AA`、`Aa`、`aa`

## 4. Phenotype

[Scitable: phenotype / phenotypes](https://www.nature.com/scitable/definition/phenotype-phenotypes-35):

> The term "phenotype" refers to the observable physical properties of an organism; these include the organism's appearance, development, and behavior. An organism's phenotype is determined by its genotype, which is the set of genes the organism carries, as well as by environmental influences upon these genes. Due to the influence of environmental factors, organisms with identical genotypes, such as identical twins, ultimately express nonidentical phenotypes because each organism encounters unique environmental influences as it develops. Examples of phenotypes include height, wing length, and hair color. Phenotypes also include observable characteristics that can be measured in the laboratory, such as levels of hormones or blood cells.

**如果忽略 environmental influences，我们可以认为 genotype 决定 phenotype**。

## 5. Trait

Trait 可以看做 "一类 phenotype 的集合"。比如 `phenotype 1 == black hair`，`phenotype 2 == brown hair`，那么可以有 `trait == hair color == {phenotype 1， phenotype 2}`

## 6. Summary

我们回头看 [问题二](#问题二)，可以画出下面这个图：

![](https://farm2.staticflickr.com/1911/45691479932_b607fc74ed_o_d.png)

总结如下：

### 6.1 gene 是 allele 的集合

假定 gene $g$ 有 $n$ 个 allele，我们可以写成 $g = \lbrace a\_g^1, a\_g^2, \dots, a\_g^n \rbrace$

### 6.2 gene 的 cartesian product 即是 haplotype/genotype 的集合

定义函数: 

1. Haplotype set of gene $g$ 
    - $H(g) = g$
1. Genotype set of gene $g$ 
    - $G(g) = \operatorname{itertools.product}(g, repeat=2)$
    - E.g. $g = \lbrace A, a \rbrace$, $G(g) = \lbrace AA, Aa, aA, aa \rbrace$
1. Product of two sets 
    - $\bigotimes(X\_1, X\_2) = \operatorname{itertools.product}(X\_1, X\_2, repeat=1)$
    - E.g. $g\_1 = \lbrace A, a \rbrace$, $g\_2 = \lbrace B, b \rbrace$, $H(g\_1) \bigotimes H(g\_2) = \lbrace AB, Ab, aB, ab \rbrace$, $\begin{align} G(g\_1) \bigotimes G(g\_2) = \lbrace & AABB, AABb, AAbB, AAbb, \\\\ & AaBB, AaBb, AabB, Aabb, \\\\ & aABB, aABb, aAbB, aAbb, \\\\ & aaBB, aaBb, aabB, aabb\rbrace \end{align}$

- 若 haplotype $\eta$ 由单个 gene $g$ 决定，那么 $\eta \in H(g)$
- 若 haplotype $\eta$ 由多个 genes $\lbrace g\_1, \dots, g\_m \rbrace$ 决定，那么 $\eta \in H(g\_1) \bigotimes \dots \bigotimes H(g\_m)$
- 若 genotype $\gamma$ 由单个 gene $g$ 决定，那么 $\gamma \in G(g)$
- 若 genotype $\gamma$ 由多个 genes $\lbrace g\_1, \dots, g\_m \rbrace$ 决定，那么 $\gamma \in G(g\_1) \bigotimes \dots \bigotimes G(g\_m)$

### 6.3 phenotype 是 genotype 和 environment 的函数

假设 genotype 的集合为 $G$，environmental influences 的集合为 $E$，phenotype 的集合为 $P$，那么 $\exists f: G \times E \to P$ 确定 phenotype。

$f(\gamma, \epsilon) = \rho$ 表示 genotype $\gamma$ 与 environment $\epsilon$ 共同决定 phenotype $\rho$。

不考虑 environmental influences 的话即是由 $f': G \to P$ 确定 phenotype：

- $f'$ 一定是 surjective 
- dominance 决定 $f'$ 是否是 injective
    - 参 [Terms of Functions](/math/2018/10/06/terms-of-functions)

### 6.4 Trait 是 phenotype 的集合

$$
T = \lbrace \rho_1, \dots, \rho_l \rbrace
$$

## 7. Simplified Model: Allele Dominance

genotype 决定 phenotype 的过程中有一种 allele dominance 的现象。[Wikipedia: Dominance (genetics)](https://en.wikipedia.org/wiki/Dominance_(genetics)):

> Dominance in genetics is a relationship between alleles of one gene, in which the effect on phenotype of one allele masks the contribution of a second allele at the same locus. The first allele is **dominant** and the second allele is **recessive**.

- 注意 dominance 是 allele 的概念，然后它没有说对 haplotype 和 genotype 的影响，而是直接说了对 phenotype 的影响，这说明：**它做了很多的假设！**这一点非常重要，因为有很多概念并没有告诉你这些假设，你理解起来就很抓瞎
- 假设 1：你是 alleles of **ONE** gene，然后就直接影响了 haplotype，说明你的 haplotype 直接由这一个 gene 的 allele 决定；进一步有，你的 genotype 是由这一个 gene 的 allele 决定的
- 假设 2：忽略 environmental influences 对 phenotype 的影响

那我一个由多个 gene 的 allele 构成的复杂的 haplotype/genotype，在不考虑 environmental influences 的情况下，如何 determine phenotype？这种复杂的情况比如 ABO blood group system，会有 [Co-dominance](https://en.wikipedia.org/wiki/Dominance_(genetics)#Co-dominance) 来指导 phenotype determination。这时就不能简单地用 dominant/recessive 这么简单的划分去理解了。

## 8. Allele Zygosity

与 allele dominance 相关的还有 zygosity ([zaɪˈgɒsɪti]) 这个概念，它是用来形容 allele 的相同程度的：

- A cell is said to be **homozygous** for a particular gene when identical alleles of the gene are present on both homologous chromosomes (or homologs, i.e. a set of one maternal and one paternal chromosome that pair up).
- .................... **heterozygote** ........................ different alleles ....................
- .................... **hemizygous** .......................... only one allele ....................
- .................... **nullizygous** ......................... none of the alleles ....................