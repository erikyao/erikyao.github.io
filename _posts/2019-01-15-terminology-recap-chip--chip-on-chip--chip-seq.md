---
category: Biology
description: ''
tags: []
title: 'Terminology Recap: ChIP / ChIP-on-chip (ChIP-chip) / ChIP-seq'
---

## ChIP

ChIP == Chromatin ImmunoPrecipitation

- precipitation: [prɪˌsɪpɪˈteɪʃn]
    - (meteorology) Any or all of the forms of water particles, whether liquid or solid, that fall from the atmosphere, 降水
    - (countable, chemistry) A reaction that leads to the formation of a heavier solid in a lighter liquid, 沉淀 (物)
- immunoprecipitation: 
    - A technique in which an antigen is precipitated from solution by using an antibody, or a particular use of this technique. 
    - 免疫沉澱法，是一種研究蛋白質間交互作用的生物技術，這種技術是將蛋白質視為抗原，並利用抗體與之進行特異性結合的特性，來進行研究。這項技術可用來將含有上千種不同蛋白質的樣品中，分離和濃縮出特定蛋白質。

那 chromatin immunoprecipitation 这个名字我觉得是蛮莫名其妙的：

1. 它不是用来研究 chromatin 的。它的意图是用 immunoprecipitation 来捕捉 protein $\overset{\text{binding}}{\longleftrightarrow}$ DNA
2. chromatin 只是 protein $\overset{\text{binding}}{\longleftrightarrow}$ DNA 这个 complex 的一个载体
3. 所以为什么不叫 DNA-binding protein immunoprecipitation 呢？

ChIP 的具体定义和过程是 ([source](http://www.bio.brandeis.edu/haberlab/jehsite/chIP.html))：

> Chromatin immunoprecipitation, or ChIP, refers to a procedure used to determine whether a given protein binds to or is localized to a specific DNA sequence in vivo. 

![](https://live.staticflickr.com/4842/46704878472_6261f02bf5_c.jpg)

- in vivo: (of a process) performed or taking place in a living organism. 亦即 ChIP，严格来说只有第一步，需要在活体细胞中执行
- formaldehyde 即甲醛。[Wikipedia](https://zh.wikipedia.org/wiki/%E7%94%B2%E9%86%9B) 曰：
    > 在体内，甲醛可能导致蛋白质不可逆的与 DNA 键结
    - 但是第三步又说 reverse the cross-linking。所以在活体细胞外，甲醛导致的 protein-DNA-binding 应该还是可以分离的
    - cross-link 指 polymer chain $\overset{\text{bond}}{\longleftrightarrow}$ polymer chain 中间的这个化学键 (这两个 polymer chain 通过这个化学键连接形成一个更大的 polymer)
- 最终可以得到这一段与 (某特定) protein 绑定的 DNA 的 seq
    - 它可能是一个 TFBS

## ChIP-on-chip (a.k.a. ChIP-chip)

- 前面的 ChIP 自然是指 Chromatin ImmunoPrecipitation
- 后面的 chip 是借鉴于 DNA chip (参 [Terminology Recap: SNP / SNV / LD / GWAS / eQTL / DNA Microarray (DNA chip)](Terminology Recap: SNP / SNV / LD / GWAS / eQTL / DNA Microarray (DNA chip)))

所以 ChIP-on-chip 的做法就是：

1. 先 ChIP，得到 DNA fragments
2. 再用这些 DNA fragments 做 DNA Microarray

所以 ChIP-on-chip 应该可以量化 "与 (某特定) protein 绑定的 DNA (的 exposure 程度)"

- 这个结果也可能是 "与 (某特定) TF 绑定的 TFBS (的 exposure 程度)"

## ChIP-seq

那顺着 ChIP-on-chip 的思路，ChIP-seq 就好理解了。它的步骤是：

1. 先 ChIP，得到 DNA fragments
2. sequence 这些 DNA fragments，然后 align 这些 sequences 到 genome

所以最后可以得到一个 BED file，记录了所有 "与 (某特定) protein 绑定的位置" 

- 这个结果也可能是 "与 (某特定) TF 绑定的 TFBS 的位置"

具体过程可以看 [YouTube: StatQuest: A gentle introduction to ChIP-Seq](https://www.youtube.com/watch?v=nkWGmaYRues)

另有 ChIP-seq analysis R 语言实际操作：[ChIP-seq analysis basics](https://www.bioconductor.org/help/course-materials/2015/CSAMA2015/lab/Epigenetics_and_Chip_seqLab.pdf)

最后说一句：DNase-Seq + ChIP-seq 是一个挺好的 combo：

- ChIP-seq 寻找 TFBS
- DNase-seq 寻找 DHS
- DHS 可能是 TFBS；TFBS 也可能是 DHS