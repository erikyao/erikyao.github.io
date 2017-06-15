---
layout: post
title: "Central Dogma of Molecular Biology: Vocabulary"
description: ""
category: 
tags: []
---
{% include JB/setup %}

参考文献：

- [RNA Transcription by RNA Polymerase: Prokaryotes vs Eukaryotes](https://www.nature.com/scitable/topicpage/rna-transcription-by-rna-polymerase-prokaryotes-vs-961)
- [Wikipedia: Promoter (genetics)](https://en.wikipedia.org/wiki/Promoter_(genetics))
- [Wikipedia: Enhancer (genetics)](https://en.wikipedia.org/wiki/Enhancer_(genetics))
- [Wikipedia: Transcription factor](https://en.wikipedia.org/wiki/Transcription_factor)

## 0. The Process

- Transcription: DNA $\rightarrow$ RNA
    - A gene is transcribed into a pre-mRNA
    - After spliced, it turns into a mRNA 
- Translation: RNA $\rightarrow$ Protein

Locations:

- Unlike in eukaryotes, bacterial transcription and translation can occur simultaneously in the cytoplasm (细胞质). 
    - A bacterial cell has no nucleus.
    - The DNA of most bacteria is contained in a single circular molecule, called the bacterial chromosome (still double-helix structure). 所以 RNA polymerase II 来分解、复制的过程仍然是一样的
- In eukaryotes, where transcription occurs in a membrane-bound nucleus while translation occurs outside the nucleus in the cytoplasm (具体一点就是 Ribosome (核糖体)).

RNA polymerase:

- In bacteria, all transcription is performed by a single type of RNA polymerase. 
    - This polymerase contains four catalytic subunits and a single regulatory subunit known as sigma.
    - Several distinct sigma factors have been identified, and each of these oversees transcription of a unique set of genes. 
    - Sigma factors are thus discriminatory, as each binds a distinct set of promoter sequences.
- In eukaryotes, transcription is achieved by three different types of RNA polymerase: RNA pol I, II and III
    - RNA pol I transcribes ribosomal RNAs (rRNAs)
    - RNA pol II transcribes messenger RNAs (mRNAs) and also small regulatory RNAs
    - RNA pol III transcribes small RNAs such as transfer RNAs (tRNAs).
    - 目前在我们这个 transcription 的 context 下，我们只考虑 RNA poly II

## 1. Transcription in detail

### 1.1 Promoters

A promoter is a region of DNA that initiates transcription of a particular gene. Promoters are located near the transcription start sites of genes, on the same strand and upstream on the DNA (towards the 5' region of the sense strand). Promoters can be about 100–1000 base pairs long.

Promoter elements can be categorized as: 

- $\text{core} \in \text{proximal}$ 
- $\text{proximal} \cap \text{distal} = \emptyset$
- $\text{proximal} \cup \text{distal} = \text{promoter}$

<!-- -->

- Proximal promoter elements (proximal means "next to or nearest the point of attachment or origin, a central point, or the point of view")
    - Approximately 250 bp upstream of TSS
    - Contains specific TFBS
    - Includes core promoter elements:
        - TSS (transcription start site)
            - Core promoter elements start approximately 34 bp upstream from the TSS
        - A binding site for RNA poly II
        - General TFBS
            - General transcription factors (GTFs), a.k.a. basal transcriptional factors, aim to activate transcription
            - E.g. `TATA` box
                - For approximately 24% of human genes, a `TATA` box can be found within the core promoter.
                - TATA binding protein (TBP) binds to the `TATA`-box sequence, and then unwinds the DNA and bends it through 80°.
                - The `AT`-rich sequence of the `TATA`-box facilitates easy unwinding, due to weaker base-pairing interactions between `A` and `T` bases, as compared to between `G` and `C`
- Distal promoter elements 
    - Anything further upstream, often with a weaker influence than the proximal promoter (but not an enhancer or other regulatory region whose influence is positional/orientation independent)
    - Contains specific TFBS
        - Either enhancers or silencers.

### 1.2 Enhancer

An enhancer is a short (50-1500 bp) region of DNA that can be bound by activators to increase the likelihood that transcription of a particular gene will occur.

- Enhancers are generally cis-acting (regulate the expression of genes on the same chromosome), but can also be Trans-acting (regulate the expression of genes on another chromosome).
- An enhancer can be located up to 1 Mbp away from the gene.
- An enhancer can be upstream or downstream from TSS
    - Even can be within introns 
- An enhancer can operate either in the forward or backward direction.
    - Thus we call enhancers "orientation independent"

A promoter may contain enhancers. An enhancer is not necessarily part of a promoter.

### 1.3 Silencer

A silencer is a DNA sequence capable of binding repressors.

- When a repressor binds to the silencer of DNA, RNA poly II is prevented from transcribing the DNA sequence into RNA.
- With transcription blocked, the translation of RNA into proteins is impossible. Thus, silencers prevent genes from being expressed as proteins.
- The most common position of a silencer is found upstream of the target gene, with distance varying greatly between approximately -20 bp to -2000 bp
    - Certain silencers can be found downstream of a promoter, located within the intron or exon of the gene itself

### 1.4 Transcription Factor

Essentially a protein, which controls the rate (rate can be repressed to 0) of transcription of genetic information from DNA to mRNA, by binding to a specific DNA sequence.

- A defining feature of TF is that they contain at least one DNA-binding domain (DBD), which attaches to a specific sequence of DNA.
    - Other proteins such as coactivators, chromatin remodelers, histone acetyltransferases, histone deacetylases, kinases, and methylases, while also essential to gene regulation, lack DNA-binding domains, and, therefore, are not TF.  
    - TF are usually classified into different families based on their DBDs.
    - There are approximately 2600 proteins in the human genome that contain DBD, and most of these are presumed to function as TF though other studies indicate it to be a smaller number.
    - Approximately 10% of genes in the genome code for TF, which makes this family the single largest family of human proteins.
- Genes are often flanked by several binding sites for distinct TF, and efficient expression of each of these genes requires the cooperative action of several different TF.
    - E.g [Hepatocyte nuclear factors](https://en.wikipedia.org/wiki/Hepatocyte_nuclear_factors#Function) 

Two types of TF:

- Activator
- Repressor

Regulation Mechanism:

- Stabilize or block the binding of RNA poly II to DNA
- Catalyze the acetylation or deacetylation of histone proteins
    - HAT: histone acetyltransferase
        - HAT acetylates histone proteins, and thus weakens the association of DNA with histones, which makes the DNA more accessible to transcription, thereby up-regulating transcription
    - HDAC: histone deacetylase
        - HDAC deacetylates histone proteins, and thus strengthens the association of DNA with histones, which make the DNA less accessible to transcription, thereby down-regulating transcription
- Recruit other co-activator or co-repressor

General transcription factors (GTF):

- In eukaryotes. 
- Necessary for transcription to occur.
- Some GTF bind to the promoter first, helping the RNA poly II get a foothold on the DNA.
    - Together, the GTF and RNA poly II form a complex called the transcription preinitiation complex (PIC)  
        - Some other GTF do not actually bind DNA, but are part of the PIC (bound to other GTF)
    - PIC positions RNA poly II at TSS, denatures the DNA, and positions the DNA in the RNA poly II active site for transcription.
- The minimal PIC includes RNA poly II and 6 GTF: TFIIA, TFIIB, TFIID (see also [TATA binding protein](https://en.wikipedia.org/wiki/TATA_binding_protein)), TFIIE, TFIIF, and TFIIH.

### 1.5 RNA poly II

待补充 from [Stages of transcription](https://www.khanacademy.org/science/biology/gene-expression-central-dogma/transcription-of-dna-into-rna/a/stages-of-transcription)

### 1.6 Splicing

待补充 from [Eukaryotic pre-mRNA processing](https://www.khanacademy.org/science/biology/gene-expression-central-dogma/transcription-of-dna-into-rna/a/eukaryotic-pre-mrna-processing)

The structure of a typical human protein coding mRNA:

- 5' cap
    - The 5’ cap is added to the first nucleotide in the transcript during transcription. 
    - The cap is a modified guanine (G) nucleotide, and it protects the transcript from being broken down. 
    - It also helps the ribosome attach to the mRNA and start reading it to make a protein.
- 5' UTR: untranslated region
    - While called untranslated, the 5′ UTR or a portion of it is sometimes translated into a protein product. 
        - This product can then regulate the translation of the CDS of the mRNA
    - In many other organisms, however, the 5′ UTR is completely untranslated, instead forming complex secondary structure to regulate translation.
- CDS: coding sequences
    - Intron
    - Exon
- 3' UTR: untranslated region
    - Immediately follows the translation termination codon
- Poly-A tail 
    - When a sequence called a polyadenylation signal shows up in an RNA molecule during transcription, an enzyme chops the RNA in two at that site. 
    - Another enzyme adds about 100100100 - 200200200 adenine (A) nucleotides to the cut end, forming a poly-A tail.
    - The tail makes the transcript more stable and helps it get exported from the nucleus to the cytosol. 

#### 1.6.1 5' UTR

The 5′ UTR begins at the TSS and ends one nucleotide (nt) before the start codon (usually `AUG`). 

- The start codon is the first codon of a mRNA transcript translated by a ribosome. 
- The start codon always codes for methionine (MET) in eukaryotes and a modified Met (fMet) in prokaryotes. 
- The most common start codon is `AUG` in eukaryote.
    - Alternate start codons (non-`AUG`) are very rare in eukaryotic genomes. However, naturally occurring non-AUG start codons have been reported for some cellular mRNAs.
- In prokaryotes:
    - E. coli uses 83% `AUG`, 14% `GUG`, 3% `UUG`
    - Studies showed that 17 or more non-`AUG` start codons may initiate translation in E. coli

5' UTR elements

- The 5’ UTR of prokaryotes consists of the Shine-Dalgarno sequence (`AGGAGGU`). This sequence is found 3-10 base pairs upstream from the initiation codon.
    - Shine-Dalgarno sequence is essentially a ribosome binding site (RBS)
    - Ribosome binds to RBS and initiates translation
- The eukaryotic 5′ UTR contains the Kozak consensus sequence (`ACCAUGG`), which contains the initiation codon    
    - The 5’ UTR of Eukaryotes contains a kozak consensus sequence (`ACCAUGG`). This sequence contains the initiation codon.
- The eukaryotic 5′ UTR also contains cis-acting regulatory elements, including:
    - The secondary structure that is able to inhibit `AUG` initiation codon recognition due to a blockage of the scanning ribosome.
    - Internal ribosome entry sites (IRESs) that stimulate cap-independent translation
        - What differentiates cap-independent translation from cap-dependent translation is that cap-independent translation does not require the 5' cap to initiate scanning from the 5' end of the mRNA until the start codon
    - Protein binding sites that either repress or promote translation in response to relaying molecular signals
    - Non-`AUG` initiation codons
        - E.g. both human and mouse NELF-B proteins are translated from a non-`AUG` codon. See [Translational Initiation at a Non-AUG Start Codon for Human and Mouse Negative Elongation Factor-B](http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0127422)
    - The AUG sequence context that affects efficiency of AUG recognition
    - Upstream AUG codons (uAUGs) associated with upstream open reading frames (uORFs)
        - Translation of the uORF typically inhibits downstream expression of the primary ORF
- Unlike prokaryotes, 5′ UTRs can harbor introns in eukaryotes. In humans, ~35% of all genes harbor introns within the 5′ UTR.
    - 换言之，intron 和 exon 并不只是 CDS 独有，只能说 CDS 能被划分成 intron 和 exon

#### 1.6.2 3' UTR

The 3' UTR often contains regulatory regions that post-transcriptionally influence gene expression.

- Many crucial decisions made during development are regulated by elements that are located in the 3' UTR that control translation.
    - In several organisms, including Drosophila and Caenorhabditis elegans, cascades of translational regulators have central roles in tissue patterning and embryonic axis formation.
- 3' UTR binding factors control translation by regulating such diverse steps as ribosome binding, scanning, initiation and elongation.

#### 1.6.3 Exon

An exon is any part of a gene that will encode a part of the final mature RNA produced by that gene after introns have been removed. 

Exons are coding sections of an RNA transcript, or the DNA encoding it, that are translated into protein. Exons can be separated by intervening sections of DNA that do not code for proteins, known as introns.

In protein-coding genes, the exons include both the protein-coding sequence and the 5′- and 3′-UTR. Often the first exon includes both the 5′-UTR and the first part of the coding sequence, but exons containing only regions of 5′-UTR or (more rarely) 3′-UTR occur in some genes, i.e. the UTRs may contain introns. Some non-coding RNA transcripts also have exons and introns.

#### 1.6.4 Intron

An intron is any nucleotide sequence within a gene that is removed by RNA splicing during maturation of the final RNA product.

Introns are noncoding sections of an RNA transcript, or the DNA encoding it, that are spliced out before the RNA molecule is translated into a protein.

- Introns enable alternative splicing, which enables a single gene to encode multiple proteins that perform different functions under different conditions
- In recent years, we have discovered that RNA molecules (especially small RNAs such as siRNAs and miRNAs) are much more involved in regulating gene expression than previously thought. Often the small regulatory RNAs are derived from spliced introns.

## 2. Translation in detail

Reading Frame:

- In molecular biology, a reading frame is a way of dividing the sequence of nucleotides in a nucleic acid (DNA or RNA) molecule into a set of consecutive, non-overlapping triplets (codons).
- An open reading frame (ORF) is a reading frame that has the potential to be transcribed into RNA and translated into protein. It requires a continuous sequence of DNA from a start codon, through a subsequent region which usually has a length that is a multiple of 3 nucleotides, to a stop codon in the same reading frame.

Each transcript is associated with 3 reading frames:

- `AGG·TGA·CAC·CGC·AAG·CCT·TAT·ATT·AGC`
- `A·GGT·GAC·ACC·GCA·AGC·CTT·ATA·TTA·GC`
- `AG·GTG·ACA·CCG·CAA·GCC·TTA·TAT·TAG·C`

## 3. Genes in Genomes: What's in a genome?

Genome:

- protein-coding genes
- rRNA (ribosomal RNA)
- tRNA (transfer RNA)
- pseudogenes
- short non-coding RNA
    - miRNA (microRNA)
        - MicroRNAs usually induce gene silencing by binding to target sites found within the 3’UTR of the targeted mRNA. This interaction prevents protein production by suppressing protein synthesis and/or by initiating mRNA degradation.
        - MicroRNAs are partially complementary to one or more messenger RNA (mRNA) molecules, and their main function is to downregulate gene expression in a variety of manners, including translational repression, mRNA cleavage, and deadenylation.
    - siRNA (short interfering RNA, double-stranded)
        - may come from outside the cell (e.g. virus); endo-siRNA also discovered, transcribed from cell's own DNA
        - the most commonly used RNA interference (RNAi) tool for inducing short-term silencing of protein coding genes
        - siRNA is a synthetic RNA duplex designed to specifically target a particular mRNA for degradation.
        - http://dharmacon.gelifesciences.com/applications/rna-interference/sirna/?rdr=true&LangType=2052&pageid=2147484497
        - https://www.thebalance.com/the-differences-between-sirna-and-mirna-375536
- lncRNA (long non-coding RNA)
    - >= 2000 nt
    - variety of functions
- transposon (TE - transposoble element)
    - DNA elements that can 'jump' to a new genomic location

1. be aware of these different DNA entities when you encounter them in a genome annotation
1. be aware of the complexity and importance of the many types of elements encoded in DNA
1. genomes are still under exploration; many of the functions and locations of important information encoded in DNA are yet to be discovered

## 4. Genes in Genomes: How is the genome 'packaged'?

Two facts below, both affecting DNA functions

- DNA is 'packaged' into chromatin
- DNA can be 'decorated' by chemical groups

chromatin = DNA + structural proteins (histone)

- Histone acetylation (HAT)
    - uncoiling (coil 指线圈、弹簧这类的卷曲的结构)
    - transcript $\uparrow$
    - euchromatin
- Histone deacetylation (HDAC)
    - condensation (收紧的 DNA + histone 结构我们称为 nucleosomes)
    - transcript $\downarrow$
    - you can image that DNA is 'hibernating'
    - heterochomatin
    - may combined with DNA methylation (gene silencing)
        - addition of a methyl group, which is a $CH_3$ to the cytosine (C) in DNA
        - with the help of methyltransferase
        - typically occurs in cytosine-rich sequences called CpG island (where "p" simply indicates that "C" and "G" are connected by a phosphodiester bond)
        - how does it silence the gene?
            - method 1: physically impede other binding
            - method 2: methylated DNA may be bound by "methyl cpg-binding domain proteins", or MBD for short. MBD proteins can recruit other proteins to the locus, then modifies the histomes, forming condensed inactive heterochromatin

## 5. Gene Interactions: Genetics

How are genes "interacting"?

Human is diploid organism

5' ----------------------- 3' chr1 (mom)
3' ------<<<<<------------ 5'

5' ----------------------- 3' chr1 (dad)
3' ------<<<<<------------ 5' (some mutation here; or different transcript expression)

Assume this pair of genes controls eye color. Different phenotypes.

In "classical genetics" (Gregor Mendel), people call a "genetic interaction" mutations in two different genes (rather than two copies of the same gene), producing surprising phenotype given each mutation's individual effects.

Some concepts from "classical genetics":

- Alleles: different versions of the same gene.
- heterozygous genotype: `Aa`
- homozygous genotype: `AA` or `aa`
- Dominant vs Recessive

Let `B` stand for brown eyes, and `b` blue eyes. `B` is dominant and `b` is recessive

| genotype (Dad-Mom) | phenotype |
|--------------------|-----------|
| `Bb`               | Brown eyes|
| `bB`               | Brown eyes|
| `BB`               | Brown eyes|
| `bb`               | Blue eyes |

We call `BB` homozygous dominant

## 6. Gene Interactions: Networks

A -> B -> C -| D

Interaction type:

- protein-protein
- protein-DNA
- protein-RNA
- RNA-RNA