---
layout: post-mathjax
title: "GWAS / SNP / eQTLs"
description: ""
category: Biology
tags: [Biology-101]
---
{% include JB/setup %}

参考：

- [Wikipedia - Single-nucleotide polymorphism](https://en.wikipedia.org/wiki/Single-nucleotide_polymorphism)
- [Quora: What is eQTL (Expression quantitative trait loci) and why is it important to study them?](https://www.quora.com/What-is-eQTL-Expression-quantitative-trait-loci-and-why-is-it-important-to-study-them)
- [ResearchGate: How are SNPs, eQTLs and genes related?](http://www.researchgate.net/post/How_are_SNPs_eQTLs_and_genes_related)
- Nica, Alexandra C., and Emmanouil T. Dermitzakis. “Expression Quantitative Trait Loci: Present and Future.” Philosophical Transactions of the Royal Society of London B: Biological Sciences 368, no. 1620 (June 19, 2013): 20120362. doi:10.1098/rstb.2012.0362.
- Macintyre, Geoff, James Bailey, Izhak Haviv, and Adam Kowalczyk. “Is-rSNP: A Novel Technique for in Silico Regulatory SNP Detection.” Bioinformatics 26, no. 18 (September 15, 2010): i524–30. doi:10.1093/bioinformatics/btq378.

## Genome-wide association studies (GWAS) 

In genetic epidemiology, a _**genome-wide association study**_ (GWA study, or GWAS), also known as **whole genome association study** (WGA study, or WGAS) or **common-variant association study** (CVAS), is an examination of many common _**genetic variants**_ in different individuals to see if any variant is associated (这里 association 是 statistical 意义上的 association，比如有 correlation) with a _**trait**_. 

- Genetic variation refers to diversity in gene frequencies. 
	- Genetic alterations that occur in more than 1 percent of the population are called _**polymorphisms**_.
- Genetic variant may refer to:
	- A _**single-nucleotide polymorphism**_ (SNP), in case it is a common genetic variant.
	- A mutation, in a case where it is a rare genetic variant.
- trait 指人体的特征，比如眼睛的颜色、与基因相关的疾病等
	- The traits that are expressed make up your phenotype.
	- The allele that is not expressed is the "recessive" allele.

GWASs typically focus on associations between _**single-nucleotide polymorphisms**_ (SNPs) and traits like major diseases.

## SNP
	
A SNP is a DNA sequence variation occurring commonly within a population (e.g. 1%) in which a single nucleotide — A, T, C or G — in the genome (or other shared sequence) differs between members of a biological species or paired chromosomes. 

For example, two sequenced DNA fragments from different individuals, `AAGC_C_TA` to `AAGC_T_TA`, contain a difference in a single nucleotide. In this case we say that there are two _**alleles**_ ([əˈli:l], 等位基因). 

- Almost all common SNPs have only two alleles. 
- If 2 alleles are in LD (linkage disequilibrium), they are very close to each other and most of time in the same chromasome.

The genomic distribution of SNPs is not homogenous; SNPs occur in non-coding regions more frequently than in coding regions or, in general, where natural selection is acting and 'fixing' the allele (eliminating other variants) of the SNP that constitutes the most favorable genetic adaptation.

The terms _**synonymous**_ and _**non-synonymous**_ are used for SNPs that are in predicted protein coding regions (i.e., exons of genes). 
			
- synonymous: [sɪˈnɑ:nɪməs], 同义(词)的
- Synonymous SNPs are those SNPs that have different alleles that encode for the same amino acid. 
- Non-synonymous SNPs are SNPs that have different alleles that encode different amino acids.
	
## Expression quantitative trait loci (eQTLs)
	
However, GWAS faces a fundamental challenge in that it is difficult to identify the regulatory variants (within trait-associated intergenic regions) that are causal for trait variation in the population.

- An intergenic region (IGR) is a stretch of DNA sequences located between genes. 
- Intergenic regions are a subset of non-coding DNA. Occasionally some intergenic DNA acts to control genes nearby, but most of it has no currently known function.
- Intergenic regions are different from intragenic regions (or introns), which are short, non-coding regions that are found within genes, especially within the genes of eukaryotic organisms.

This challenge hinders the extraction of new biological knowledge and specific molecular hypotheses from GWAS. Integrating genomic signals such as expression quantitative trait loci (eQTLs) with variant annotations within a quantitative model will be essential for overcoming these challenges.

- signal: quantitative information
- annotation: generally all kinds of information

<!-- -->

- _**Quantitative traits**_ are phenotypes that can be measured and can be attributed to polygenic effects, i.e., the product of two or more genes, and their environment.
- _**quantitative trait loci**_ (QTL) are loci in the genome that contain genes that code for quantitative traits.
	- QTLs are mapped by identifying which molecular markers (such as SNPs or AFLPs) correlate with an observed trait.
- eQTL analysis means figuring out how a given genotype (the DNA variants) at a particular QTL affects gene expression at that locus.
	- If a given genotype affects (decreases or increases) gene expression at the same locus of the genotype, it's called _**cis eQTL**_;
	- if it affects expression at a different locus, _**trans eQTL**_.
	- Studies so far indicate that most of the regulatory control takes place locally, in the vicinity of genes. Numerous genes were detected to have cis eQTLs.
	- Finding trans eQTLs has been less successful so far, mainly because interrogating the whole-genome for potential regulatory effects is a daunting statistical and computational task.
	
![](https://farm6.staticflickr.com/5636/22027043164_4e29b6f2d8_o.png)

![](https://farm6.staticflickr.com/5760/22649817385_a592231226_o.png)

## SNP 与 eQTLs 的关系

An eQTL is a possibly very large region of DNA where you think there might be some nucleotide sequence difference (possibly with a SNP) that explains some difference in phenotype that you're observing.

It is not necessary that eQTL is associated with a SNP (also an insertion and deletion in a certain region of the genome can lead to a change of gene expression level).

## rSNP vs eSNP

rSNP: regulatory SNP, i.e. variations which affect the ability of a transcription factor (TF) to bind to DNA.

eSNP: expression SNP, i.e. variations which affect the gene expression, by means of affecting gene splicing, transcription factor binding, messenger RNA degradation, or the sequence of non-coding RNA.

把 rSNP 和 eSNP 看做两个集合，它们有交集，但不存在包含关系：

- \\( rSNP \cap eSNP \\): variations which affect the ability of a TF to bind to DNA thus affecting gene expression.
- \\( rSNP - eSNP \\): variations which affect the ability of a TF to bind to DNA, but not affect gene expression.
	- 影响了 TF binding 并不代表一定会有 expression 的变化
- \\( eSNP - rSNP \\): variations which affect the gene expression, but not by affecting TF binding.
	- eSNP 的定义说了，影响 expression 不一定只有影响 TF binding 这么一种方式













