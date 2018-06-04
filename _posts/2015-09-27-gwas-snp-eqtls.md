---
layout: post
title: "GWAS / SNP / eQTLs"
description: ""
category: Biology
tags: []
---
{% include JB/setup %}

[figure-1]: https://farm2.staticflickr.com/1525/23812247122_9a9482886a_o_d.png
[figure-2]: https://farm6.staticflickr.com/5788/23812247112_aea92c4e5c_o_d.png

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
	
![][figure-1]

![][figure-2]

## SNP 与 eQTLs 的关系

An eQTL is a possibly very large region of DNA where you think there might be some nucleotide sequence difference (possibly with a SNP) that explains some difference in phenotype that you're observing.

It is not necessary that eQTL is associated with a SNP (also an insertion and deletion in a certain region of the genome can lead to a change of gene expression level).

## rSNP vs eSNP

rSNP: regulatory SNP, i.e. variations which affect the ability of a transcription factor (TF) to bind to DNA.

eSNP: expression SNP, i.e. variations which affect the gene expression, by means of affecting gene splicing, transcription factor binding, messenger RNA degradation, or the sequence of non-coding RNA.

把 rSNP 和 eSNP 看做两个集合，它们有交集，但不存在包含关系：

- $ rSNP \cap eSNP $: variations which affect the ability of a TF to bind to DNA thus affecting gene expression.
- $ rSNP - eSNP $: variations which affect the ability of a TF to bind to DNA, but not affect gene expression.
	- 影响了 TF binding 并不代表一定会有 expression 的变化
- $ eSNP - rSNP $: variations which affect the gene expression, but not by affecting TF binding.
	- eSNP 的定义说了，影响 expression 不一定只有影响 TF binding 这么一种方式
	
-----

## Points of view in thread [NEWBIE: What is relation between SNP calling, INDEL calling and Genotype calling?](http://seqanswers.com/forums/showthread.php?t=34144)

Not sure whether they are correct or accurate, but a good start for further understanding.

### SNP and Zygosity

[Zygosity](https://en.wikipedia.org/wiki/Zygosity) ([zaɪˈgɒsɪti]) is the degree of similarity of the alleles for a trait in an organism.

Most eukaryotes have two matching sets of chromosomes; that is, they are _**diploid**_. Diploid organisms have the same loci on each of their two sets of homologous chromosomes, except that the sequences at these loci may differ between the two chromosomes in a matching pair and that a few chromosomes may be mismatched as part of a chromosomal sex-determination system.

- If both alleles of a diploid organism are the same, the organism is _**homozygous**_ ([ˌhoʊməˈzaɪgəs]) at that locus. 
	- An individual that is _**homozygous-dominant**_ for a particular trait carries two copies of the allele that codes for the dominant trait. This allele, often called the "dominant allele", is normally represented by a capital letter, e.g. `A`. Then the genetype can be represented by `AA`.
	- An individual that is _**homozygous-recessive**_ for a particular trait carries two copies of the allele that codes for the recessive trait. This allele, often called the "recessive allele", is usually represented by the lowercase form of the letter, e.g. `a`. Then the genetype can be represented by `aa`.
- If they are different, the organism is _**heterozygous**_ ([ˌhɛtərəˈzaɪgəs]) at that locus. 
- If one allele is missing, it is _**hemizygous**_ ([ˌhɛmɪˈzaɪgəs]).
	- hemizygote: [ˌhɛmɪˈzaɪgoʊt], a hemizygous individual
- If both alleles are missing, it is _**nullizygous**_.

A diploid organism contains two copies of each chromosome. If there is a SNP at a particular position then there are 3 possibilties:

- both chromosomes contain the SNP (homozygous for the SNP) 
- one chromosome contains the SNP and the other the WT sequence (heterozygous)
	- WT = _**Wild Type**_
	- Wild type refers to the phenotype of the typical form of a species as it occurs in nature.
	- Originally, the wild type was conceptualized as a product of the standard "normal" allele at a locus, in contrast to that produced by a non-standard, "mutant" allele.
		- SNP 也是 mutation，而 mutation 毕竟是少数
- neither contain the SNP (homozygous for the WT)

### Haplotype and Linkage Disequilibrium

The SNP's on one chromosome are described as a _**haplotype**_ ([ˈhæpləˌtaɪp]). Put two chromosomes together and you have a genotype. If you sequence multiple individuals, then you can also work out the genotype frequency, such as how many people are heterozygous for a SNP, or the _**MAF**_ (_**minor allele frequency**_, what % of people carry the SNP).

- A haplotype is, in the simplest terms, a specific group of genes or alleles that progeny ([ˈprɒdʒəni], a descendant or offspring) inherited from one parent. There are, however, several specific definitions of the term being used in the field of genetics. 
	- First, it is a portmanteau ([pɔrtˈmæntoʊ]) word (A word which combines the meaning of two words) for haploid genotype, which is a collection of specific alleles (that is, specific DNA sequences) in a cluster of tightly-linked genes on a chromosome that are likely to be inherited together—that is, they are likely to be conserved as a sequence that survives the descent of many generations of reproduction.
		- 产生 haplotype 的现象我们又称为 _**[Linkage Disequilibrium](http://bio.classes.ucsc.edu/bio107/Class%20pdfs/W05_lecture15.pdf)**_
			- Linkage equilibrium occurs when the genotype present at one locus is _**independent**_ of the genotype at a second locus.
			- Linkage disequilibrium occurs when genotypes at the two loci are _**not independent**_ of another.
		- Suppose 2 loci are in LD and there are 4 haplotypes $A_1B_1, A_1B_2, A_2B_1, A_2B_2$ from 4 alleles $A_1, A_2, B_1, B_2$.
			- We can calculate coefficient of LD, $D$, using the frequencies of haplotypes and alleles (有点类似方差的概念. See the link above).
			- In linkage equilibrium, $D \rightarrow 0$ (可以理解为：方差很小，意味着 frequencies 的差别很小，进一步意味着 alleles 是 randomly inherited)
	- A second specific meaning of the term haplotype: a set of SNPs on one chromosome that tend to always occur together, i.e., that are associated statistically.
	- Another specific definition of haplotype: Many human genetic testing companies use the term 'haplotype' to refer to an individual collection of specific mutations within a given genetic segment. 
		- The term 'haplogroup' refers to the SNP/unique-event polymorphism (UEP) mutations that represent the clade to which a collection of particular human haplotypes belong. (Clade here refers to a set of people sharing a common ancestor.)

### Genotyping 

Genotyping is the process of determining differences in the genetic make-up (genotype) of an individual. (E.g. by sequencing DNA)

### SNP vs SNV

It's probably better to get in the habit of calling them SNVs, small nucleotide variants. "Single" is obviously kind of limiting and "polymorphism" suggests that the variant is common in a population, which not all variants are.