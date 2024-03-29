---
category: Biology
description: ''
tags: []
title: Homology, Conserved Sequence and Conservation Scores
---

- homology: [həˈmɒlədʒi]
- homologous: [həˈmɒləgəs]

参考：

- [Wikipedia - Homology (biology)](https://en.wikipedia.org/wiki/Homology_(biology))
- [Wikipedia - 同源](https://zh.wikipedia.org/wiki/%E5%90%8C%E6%BA%90)
- [Wikipedia - Conserved sequence](https://en.wikipedia.org/wiki/Conserved_sequence)
- [PPT: Conservation scores](http://www.vcu.edu/csbc/bnfo602/presentations/BNFO602_2014_Conservation%20Scores_updated.pptx)

## 1. Definition of Homology

1. In the context of biology, homology is the _**existence of shared ancestry**_ between a pair of structures, or genes, in different taxa.
    - A common example of homologous structures in evolutionary biology are the wings of bats and the arms of primates (灵长目).
    - Homologous traits of organisms are therefore explained by descent from a common ancestor
    - Homology is different from analogy (相似), which describes the relation between characters that are apparently similar yet phylogenetically independent.
        - The wings of a maple seed and the wings of an albatross are analogous but not homologous (they both allow the organism to travel on the wind, but they didn't develop from the same structure)
        - Analogy is commonly also referred to as homoplasy, which is further distinguished into parallelism, reversal, and convergence (convergent evolution, 趋同演化).
    - It is important to distinguish between different hierarchical levels of homology in order to make informative biological comparisons. In the above example, the bird and bat wings are analogous as wings, but homologous as forelimbs because the organ served as a forearm (not a wing) in the last common ancestor of tetrapods (['tetrəˌpɒd], 四足类).
1. In the context of sexual differentiation—the process of development of the differences between males and females from an undifferentiated fertilized egg—the male and female organs are _**homologous if they develop from the same embryonic tissue**_.
    - A typical example is the ovaries (卵巢) of female humans and the testicles (睾丸) of male humans.
1. In the context of morphological differentiation (Morphology is the study of the form and structure of organisms and their specific structural features.), _**organs that developed in the same embryological manner from similar origins**_, such as from matching primordia (primordium, [praɪ'mɔ:diəm], an aggregation of cells that is the first stage in the development of an organ, 原基细胞, plural primordia) in successive segments of the same organism, may be said to be homologous.
    - Examples include the legs of a centipede ([ˈsentɪpi:d], 蜈蚣), the maxillary ([mæk'sɪlərɪ], 上颌骨的) palp ([pælp], 触须) and labial ([ˈleɪbiəl], 唇的) palp of an insect, and the spinous (['spaɪnəs], of spine, 脊柱) processes of successive vertebrae in a vertebral column (== spine).
1. In the context of genetics, homology between gene (DNA) and the corresponding protein product is also defined _**in terms of shared ancestry, typically inferred from their sequence similarity.**_

## 2. Sequence Homology

Two segments of DNA can have shared ancestry because of either a speciation event (物种形成)(orthologs, 直系同源体) or a duplication event (paralogs, 旁系同源体).

- 注意这个翻译我觉得是有点蛋疼的，直系其实涉及两个物种，而旁系（一般）是发生在一个物种内部的，并没有“直系亲属”这方面的意思
    - 也有翻译成：orthology => 种间同源， paralogy => 种内同源 的，感觉要好点
- 你注意到直系的英文是 ortho- 的话，就比较好理解为这里涉及两个物种，因为必须要有两个对象才能形成垂直
- 同理，para- 这个前缀也能帮助你理解

Alignments of multiple sequences are used to indicate which regions of each sequence are homologous.

- 注意我们在描述 sequence similarity 时常用 percent identity 或者 percent similarity 这样的术语
- 但是 percent homology 这个词是不准确的，因为 homology is the conclusion, since sequences are either homologous or not

High sequence similarity might occur because of convergent evolution, or, as with shorter sequences, by chance. Such sequences are similar but might not be homologous.

- 简单说，同源必定相似，相似不一定同源

### Conserved sequence

Sequence regions that are homologous are also called _**conserved**_. 

- 注意 conservation in amino acid sequences 的意思是 amino acid at a specific position has been substituted with a different one with functionally equivalent physicochemical properties，不要混淆

In biology, conserved sequences are similar or identical sequences that occur within nucleic acid sequences (such as RNA and DNA sequences), protein sequences, protein structures or polymeric carbohydrates across species (orthologous sequences) or within different molecules produced by the same organism (paralogous sequences).

- In the case of cross species conservation, this indicates that a particular sequence may have been maintained by evolution despite speciation. 
- The further back up the phylogenetic tree a particular conserved sequence may occur, the more highly conserved it is said to be. 
- Since sequence information is normally transmitted from parents to progeny by genes, a conserved sequence implies that there is a _**conserved gene**_.

It is widely believed that mutation in a "highly conserved" region leads to a non-viable (not able to develop or grow) life form, or a form that is eliminated through natural selection. What determines conserved and non-conserved is the environment. If for example, a microorganism with antibiotic resistance genes is in the presence of antibiotic, the antibiotic resistance genes will be highly conserved. If not in the presence of antibiotics, the genes will become non-conserved.

Highly conserved DNA sequences are thought to have functional value. The role for many of these highly conserved non-coding DNA sequences is not understood. Many regions of the DNA, including highly conserved DNA sequences, consist of repeated sequence elements. One possible explanation of the null hypothesis above is that removal of only one or a subset of a repeated sequence could theoretically preserve phenotypic functioning on the assumption that one such sequence is sufficient and the repetitions are superfluous ([sʊˈpɜrfluəs], unnecessary, especially through being more than enough) to essential life processes.

### Orthology

Homologous sequences are _**orthologous**_ if they are inferred to be descended from the same ancestral sequence separated by a speciation event: when a species diverges into two separate species, the copies of a single gene in the two resulting species are said to be orthologous. Orthologs, or orthologous genes, are genes in different species that originated by vertical descent from a single gene of the last common ancestor.

Given that the exact ancestry of genes in different organisms is difficult to ascertain due to gene duplication and genome rearrangement events, the strongest evidence that two similar genes are orthologous is usually found by carrying out phylogenetic analysis of the gene lineage. Orthologs often, but not always, have the same function.

### Paralogy

Homologous sequences are _**paralogous**_ if they were created by a duplication event within the genome. For gene duplication events, if a gene in an organism is duplicated to occupy two different positions in the same genome, then the two copies are paralogous.

Paralogous genes often belong to the same species, but this is not necessary: for example, the hemoglobin gene of humans and the myoglobin gene of chimpanzees are paralogs.

## 3. Conservation Scores

Facts:

- Core coding regions are usually conserved across hundreds of millions of years (Myr)
- Active sites of enzymes and crucial structural elements of proteins are highly conserved
- Untranslated regions of genes are conserved over tens but not over hundreds of Myr 
- Some regulatory regions evolve ‘quickly’ – over a time scale of tens of Myr
- Many splice sites and splice regulators are conserved between mouse and human
- Most promoters (70%) conserved between mouse and human
- Majority (~70%) of enhancers not conserved, but a significant minority are highly conserved

Approaches to Scoring Conservation:

- Base-wise: PhyloP, GERP
- Small regions: PhastCons
- Small regions, tracking bias: SiPhy
- Regulatory conservation within exons may be detected by any of these methods
- Key regulatory regions are harder to see

### GERP: Genomic Evolutionary Rate Profiling

Proposed by [Sidow Lab](http://mendel.stanford.edu/SidowLab/downloads/gerp/).

GERP measures base conservation:

- Estimates mean number of substitutions in each aligned genome to estimate neutral evolution rate
- Original score is “rejected substitutions”: 
    - #substitutions expected under ‘neutrality’ minus #substitutions observed at each aligned position
- New scores based on ML fit of substitution rate at base
- Positive scores (observed fewer than expected) indicate that a site is under evolutionary constraint.
    - 只没有按照预想的程度 evolve，受到了压制
- Negative scores may be weak evidence of accelerated rates of evolution 

### PhyloP: Phylogenetic p-values

Article: [Detection of nonneutral substitution rates on mammalian phylogenies](http://genome.cshlp.org/content/20/1/110.long)

- Estimates mean number of substitutions in each aligned genome to estimate neutral evolution rate estimated from non-coding data (conservative)
- Compares probability of observed substitutions under hypothesis of neutral evolutionary rate
- Scores reflect either conservation (positive scores) or selection (negative scores)
- Score defined as $-\log_{10}(P)$ where $P$ is p-value for test of number of substitutions following (uniform) neutral rate inferred from all sites in alignment.

### PhastCons: part of the PHAST (PHylogenetic Analysis with Space/Time models) package

Article: [Evolutionarily conserved elements in vertebrate, insect, worm, and yeast genomes](http://genome.cshlp.org/content/15/8/1034.full)

- PhastCons fits a HMM with states $C$ (conserved) and $N$ (not conserved).
- Neutral substitution rates estimated from data as for PhyloP
- Tunable parameter $m$ represents inverse of expected length of conserved regions
- Parameter $n$ sets proportion of conserved regions
- Scaling parameter $\rho \, (0 \leq \rho \leq 1)$ represents the average rate of substitution in conserved regions relative to average rate in non-conserved regions and is estimated from data
- Originally developed to detect moderate-sized sequences such as non-coding RNA
- Can be adapted to shorter sequences but not as powerful
- Not designed for disconnected conserved regions–e.g. binding sites for multi-finger TF

### SiPhy: SIte-specific PHYlogenetic analysis

Article: [Identifying novel constrained elements by exploiting biased substitution patterns](http://bioinformatics.oxfordjournals.org/content/25/12/i54.short)