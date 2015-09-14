---
layout: post-mathjax
title: "Genome / Gene, Locus, Allele, Genotype &amp; Phenotype / Gene Regulation"
description: ""
category: Biology
tags: [Biology-101]
---
{% include JB/setup %}

参考：

- [Chromatin vs. Chromosome](http://www.diffen.com/difference/Chromatin_vs_Chromosome)
- [Chromosome Banding and Nomenclature](http://www.ncbi.nlm.nih.gov/Class/MLACourse/Original8Hour/Genetics/chrombanding.html)
- [Exons, Introns, Codons, & their equivalents](http://www.mun.ca/biology/scarr/Exons_Introns_Codons.html)
- [Transcription (genetics)](https://en.wikipedia.org/wiki/Transcription_(genetics\))
- [Coding strand](https://en.wikipedia.org/wiki/Coding_strand)
- [Gene expression and regulation](http://www2.le.ac.uk/departments/genetics/vgec/schoolscolleges/topics/geneexpression-regulation)
- [what are genes?](https://www.23andme.com/gen101/genes/)
- [allele](http://www.nature.com/scitable/definition/allele-48)

-----

## Genome

Genome：基因組，包括

- RNA
- DNA

DNA 的宏观物理结构是 Chromosome (染色体)：
			
- Chromosome 物理结构上可以进一步细分为 Chromatin / Chromatid
	- Cell 在不分裂的时候，Chromosome 以 Chromatin (['krəʊmətɪn], 染色质) 的形式存在
		- DNA double helix is packaged by histones to form a complex called _**chromatin**_. 
		- The chromatin undergoes further condensation to form the _**chromosome**_. 
		- So while the chromatin is a lower order of DNA organization; chromosomes are the higher order of DNA organization.
	- 在 [Cell Cycle](/biology/2015/07/29/cell-cycle/) 的 S phase，一条 Chromatin 会分裂成两条 Chromatids (['krəʊmətɪd], 染色单体)
		- Every chromatid has a short _**p-arm**_ ("p" for "petit") and a long _**q-arm**_ ("q" for "queue")
		- Every 2 chromatids are connected by a _**centromere**_.
		- 我们在研究单条 Chromosome 的时候仍然会使用 p-arm、q-arm 和 centromere 来细分单条 Chromosome 的结构
- Chromosome 按功能分类可以分为 Allosome (['ælʊsəʊm], 性染色体) / Autosome (['ɔ:təsəʊm], 常染色体)
	- 人体的 Autosome 是按长度从长到短编号的，最长的是 1 号，最短的是 22 号
	- For a specific chromosome, say _Chromosome 18_, we can specify it by _**maternal**_ chromosome 18 and _**paternal**_ chromosome 18 to indicate from which parent it is inherited.
	- 我自己姑且造一个记号：\\( m\_is \\) 表示 maternal chromosome \\( i \\) 的 single strand，\\( m\_is' \\) 表示 maternal chromosome \\( i \\) 的 complementary strand；同理有 \\( p\_is \\) 和 \\( p\_is' \\)

DNA 的微观物理结构是 Double strands 或者叫 Double helix：
	
- Double strands 物理结构上可以进一步细分为 Nucleotide (['nju:klɪətaɪd], 核苷酸) + Sugar-Phosphate Backbone
	- Adenine (['ædənɪn], 腺嘌吟)
	- Cytosine (['saɪtəʊsi:n], 胞嘧啶) 
	- Guanine (['gwɑ:ni:n], 鸟嘌呤)
	- Thymine (['θaɪmi:n], 胸腺嘧啶) 

Double strands 与 Chromosome 的关系：

- 我们不考虑细胞分裂的情形。此时基本可以认为一条 Chromatin 就是一条 Chromosome。
- 我们称一个连续的 double strands 为一个 "DNA molecule" (我没有找到准确的科学定义，姑且这么认为)
- 那么一个 DNA molecule 就是一条 Chromosome。又因为人体的每一个 cell 都有 23 pairs of Chromosomes，所以没个 cell 就有 46 个 DNA molecules，有 46 个 double strands，有 92 个 single strand

## Gene, Locus, Allele, Genotype & Phenotype

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
		
_**Each person has the same set of genes**_ - about 20,000 in all. The differences between people come from slight variations in these genes. For example, neither a person with red hair has the "red hair gene" nor a person with brown hair has the "brown hair gene." Instead, all people have genes for hair color, and different versions of these genes dictate whether someone will be a redhead or a brunette. 一个 variant form of a gene 我们称为一个 allele。

A _**locus**_ is the specific physical location of a gene or other DNA sequence on a chromosome, like a genetic street address.

从上面两端来看，gene 更像是一个 "表示位置" 的、universal 的概念，类似 locus。比如假定 7 号 chromosome 的 \\( s\_{100-200} \\) 是一个 gene，那么全世界所有人的 7 号 chromosome 的 \\( s\_{100-200} \\) 都是 gene，只是 expression 有差异而已。

如果我们单看一个个体，因为我们的 chromosome 是成对的，所以如果 7 号 chromosome 的 \\( s\_{100-200} \\) 是一个 gene，那么 \\( m\_7s\_{100-200} \\) 和 \\( p\_7s\_{100-200} \\) 都是 gene，这就成了 "2 versions of a gene"，换言之，2 alleles。

Each pair of alleles represents the _**genotype**_ of a specific gene. Genotypes are described 

- as homozygous if there are two identical alleles at a particular locus and 
- as heterozygous if the two alleles differ.

_**Phenotype**_ is the outward appearance of the organism, resulted from the genotype.

- When an organism is heterozygous at a specific locus and carries one _**dominant**_ and one _**recessive**_ allele, the organism will express the dominant phenotype.
			
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
