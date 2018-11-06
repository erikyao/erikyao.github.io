---
layout: post
title: "Gene / Gene Regulation"
description: ""
category: Biology
tags: []
---
{% include JB/setup %}

参考：

- [Exons, Introns, Codons, & their equivalents](http://www.mun.ca/biology/scarr/Exons_Introns_Codons.html)
- [Transcription (genetics)](https://en.wikipedia.org/wiki/Transcription_(genetics\))
- [Coding strand](https://en.wikipedia.org/wiki/Coding_strand)
- [Gene expression and regulation](http://www2.le.ac.uk/departments/genetics/vgec/schoolscolleges/topics/geneexpression-regulation)
- [what are genes?](https://www.23andme.com/gen101/genes/)
- [allele](http://www.nature.com/scitable/definition/allele-48)

-----

## Gene

Gene: a length of DNA that codes for a specific protein

- gene 是在单个 strand 上的，并不会跨两个 strands
- DNA 的 double strands，每条都可能有 gene，并且是可能有多个 genes
- 相同的 gene，可能 splicing 会有不同，导致最终的 protein 产物不同
- gene 这一段 DNA 并不是全部都用来 express 的 (i.e. 并不是全部都是 codes for a specific protein)，只有 _**exon**_ 这一部分会最终 express 成 protein，而 _**intron**_ 部分会被 splice 掉 (在 [Transcription](https://en.wikipedia.org/wiki/Transcription_(genetics)\) 阶段)
	- Transcription i.e. 生成 mRNA 的阶段
- Transcription 后的到的 mRNA 上面三个 base 一组的 genetic code 我们称为 _**codon**_。Translation 阶段就是根据 codon 来生成 amino acids 并最终 synthesize 成 protein
	- 严格来说，codon 是 RNA 的概念，intron 和 exon 是 DNA 的概念，但是 codon 也经常用在 DNA 身上。如果一定要表达 "DNA 上面三个 base 一组的 genetic code" 这个概念，你也可以用 _**triplet**_ 这个词
	- When referring to DNA transcription, the _**coding strand**_ (a.k.a _**sense strand**_) is the DNA strand which has the same base sequence as the RNA transcript produced (although with thymine replaced by uracil).
		- 如前一条所述，虽然不是很准确，有时也称 coding strand 包含 codon。同时，我们称 non-coding strand (a.k.a. _**template strand**_ 的) 包含 anti-codons。
		- 但是这里要注意一下逻辑：During transcription, _RNA Pol II_ binds the non-coding strand, reads the anti-codons, and transcribes their sequence to synthesize an RNA transcript with complementary bases (and this is the same sequence with the one on the coding strand ignoring the T-U conversion).
		- exon 和 intron 一定是位于 coding strand 上的

注意 gene 虽然是 codes for a specific protein，但并不意味着有 gene 就会有 protein。protein 的产生还要靠下面的 Gene Regulation 把关。

## Gene Regulation

也称为 Regulation of Gene Expression。但是 "A gene is expressed" 是个有点模糊的概念，它可以指：

- Transcription is present, or
- protein is present.

但有时 transcription is present 并不代表 protein is present。所以更准确一点的说法是 Regulation of Gene Transcription。

Mechanisms of gene regulation include:

- Regulating the rate of transcription. This is the most economical method of regulation.
- Regulating the processing of RNA molecules, including alternative splicing to produce more than one protein product from a single gene.
- Regulating the stability of mRNA molecules.
- Regulating the rate of translation.

Regulation 的执行有多种，其中一种常见的方式是：某个 protein 绑定到 DNA 的某个部位（不一定是在 gene 上面），然后给 polymerases 导航，让 polymerases 来控制 transcription 的进行。这些 protein 我们称为 _**Transcription Factors**_ (TF)，DNA 上 TF 绑定的位置我们称为 _**Gene control regions**_。

Gene control regions 有：

- _**Start site**_: A start site for transcription.
- _**A Promoter**_: A region a few hundred nucleotides 'upstream' of the gene (toward the 5' end). (Therefore it is not transcribed into mRNA.)
	- TFs bind to specific nucleotide sequences in the promoter region and assist in the binding of RNA polymerases.
- _**Enhancers**_: These sites may be thousands of nucleotides from the coding sequences or within an intron.
	- Some TFs (called _**activators**_) bind to enhancers and increase the rate of transcription.  
	- Some enhancers are conditional and only work in the presence of other factors as well as transcription factors.
- _**Silencers**_: There are many positions in which a silencer element can be located in DNA. The most common position is found upstream of the target gene.
	- Some TFs (called _**repressors**_) bind to silencers and depress the rate of transcription.

另外对 Gene control regions 还有一种稍大一点的分类叫 [cis-Regulatory element](https://en.wikipedia.org/wiki/Cis-Regulatory_element): _**cis-regulatory elements**_ (CREs) are regions of non-coding DNA which regulate the transcription of nearby genes. The Latin prefix cis- ([sis]) translates to "on this side".
