---
layout: post-mathjax
title: "Digest of <i>The use of gene ontology evidence codes in preventing classifier assessment bias</i>"
description: ""
category: Machine-Learning
tags: [ML-101, BioInformatics-101, Paper]
---
{% include JB/setup %}

原文 [The use of gene ontology evidence codes in preventing classifier assessment bias](http://bioinformatics.oxfordjournals.org/cgi/content/short/25/9/1173)

-----

## 0. ABSTRACT

没有 intuition 真是不好理解啊，先记下 Conclusion 回头再看：

> In conclusion, taking into account GO evidence codes is required for reporting accuracy statistics that do not overestimate a model's performance, and is of particular importance for a fair comparison of classifiers that rely on different information sources.

## 1. INTRODUCTION

> The Gene Ontology (GO) was developed as a comprehensive taxonomy for describing gene product characteristics (Ashburner et al., 2001). The ontology is comprised of three hierarchical namespaces that contain 22 000 terms for describing a gene product's different functional aspects.

所以这里要先科普下啥是 GO。按 [wiki](http://en.wikipedia.org/wiki/Gene_ontology) 的说法：

Gene ontology, or GO, is a major bioinformatics initiative to unify the representation of gene and gene product attributes across all species. More specifically, the project aims to:
  
1. Maintain and develop its controlled vocabulary of gene and gene product attributes;  
2. Annotate genes and gene products, and assimilate and disseminate annotation data;  
3. Provide tools for easy access to all aspects of the data provided by the project, and to enable functional interpretation of experimental data using the GO, for example via enrichment analysis.  

From a practical view, an ontology is a representation of something we know about. “Ontologies" consist of a representation of things that are detectable or directly observable, and the relationships between those things. There is no universal standard terminology in biology and related domains, and term usages may be specific to a species, research area or even a particular research group. This makes communication and sharing of data more difficult. The Gene Ontology project provides an ontology of defined terms representing gene product properties. The ontology covers three domains (a.k.a **namespace**):  

* **cellular component**, the parts of a cell or its extracellular environment;  
* **molecular function**, the elemental activities of a gene product at the molecular level, such as binding or catalysis;  
* **biological process**, operations or sets of molecular events with a defined beginning and end, pertinent to the functioning of integrated living units: cells, tissues, organs, and organisms.

没错，我第一反应是 "这就是 BioInformatics 界的 UML 啊"。我们具体看下 GO 长啥样子：

In addition to the gene product identifier and the relevant GO term, GO annotations have the following data:

* The **reference** used to make the annotation (e.g. a journal article)
* An **evidence code** denoting the type of evidence upon which the annotation is based
* The date and the creator of the annotation

E.g. 

```
Gene product:    Actin, alpha cardiac muscle 1, UniProtKB:P68032
GO term:         heart contraction ; GO:0060047
Evidence code:   Inferred from Mutant Phenotype (IMP)
Reference:       PMID 17611253
Assigned by:     UniProtKB, June 6, 2008
```

GO term 是可以展开的，内容大概是这个样子的：

```
Accession	GO:0060047
Name		heart contraction
Ontology	biological_process
Synonyms	heart beating
			cardiac contraction
			hemolymph circulation
Definition	The multicellular organismal process in which the heart decreases in volume in a characteristic way to propel blood through the body. Source: GOC:dph
……
```
	
接着看文章。

> The most accurate annotations are derived from laboratory experiments, which are often time-consuming and expensive...  
>   
> Computational methods provide a way to annotate novel proteins efficiently...

Computational methods 的缺点：

* may introduce errors into protein databases. The sources of error in homology-based methods (应该可以理解为 methods based on similarity) are
	* transfer of annotations associated with one domain when sequence similarity is based on other domains. 因为在 D1 方面相似而把 D2 方面的 GO 给标记了。
	* another is that the level of sequence similarity required to make confident predictions varies
* and those errors may propagate when annotations are transferred between similar proteins
* different annotation methods may assign different, possibly conflicting annotations to the same gene

考虑 assessing the performance of a protein function predictor 的情况

* 我们是用 sequence similarity 来 predict GO annotations
* 如果这个 annotation （比如 training example 的 annotation）本身也是用 sequence similarity 来测定的，那么就会导致 over-optimistic performance estimates

> In this article, we demonstrate the impact of using annotations that may have been derived computationally, leading to significantly higher accuracy than is obtained when using only experimentally determined annotations.

所以这篇文章的本质是通过试验发出一个 alert。

## 2 METHODS

Table 1 给出的意思是：

* Wet-lab assay 得来的 code 表示 non-biasing
* sequence similarity 得来的 code 是 biasing 的
* IGC (Inferred from genomic context) is non-biasing
* IC (Inferred by curator) is inferred from other annotations, and therefore inherit (or depends on) the classification of their reference annotations.

目前 code 好像是有 21 个，table 里的个数明显不够，是因为 Some evidence codes are associated with annotations whose original source is ambiguous, so those were excluded from our analysis.

我们的试验：

* feature: protein sequence
	* measured by PSI-BLAST scores
* outcome: whether a protein should be annotated with a
given GO term (0-1 classification)
	* for each GO term \\( t \\), design 2 classifier: one using non-biasing data and the other using biasing data.
		* 注意这里 biasing data 指的是 GO term \\( t \\) with a biasing evidence code
		* non-biasing data 指的是 GO term \\( t \\) with a non-biasing evidence code
		* 这里的数据划分其实是这样的：
			* GO term \\( t \\)
				* GO term \\( t \\) with a biasing evidence code
					* positive examples
					* negative examples
					* classifier \\( C_1 \\)
				* GO term \\( t \\) with a non-biasing evidence code
					* positive examples
					* negative examples
					* classifier \\( C_2 \\)
		* 把 evidence code 看做 GO term 的一个 tag，用来区分 GO term
		* evidence code 本身既不是 feature 也不是 outcome
	* then compare each classifier's balanced accuracy
* method: kNN classifier (k=1); Leave-One-Species-Out

### 2.1 Experimental setup

主要是数据准备上的一些考量：

* Removed annotations on the GO hierarchy path
* Since a classifier’s performance is likely to improve as the amount of training data increases, we ensured that both the non-biasing and biasing classifiers for a GO term used the same number of training and test examples.
* To eliminate potential bias from proportion differences, we used the training species’ non-biasing annotations to establish a baseline distribution of GO terms. We then ensured that the negative training and test populations for both non-biasing and biasing experiments followed this distribution.

### 2.2 Classifier

具体的 classifier 设计。

### 2.3 Data

也没啥好说的。

## 3. RESULTS

数据解读。

## 4. DISCUSSION

展开回答 introduction 引入的一系列问题。

## 5. CONCLUSION

总结全文。

-----

## 学习与思考

学习：试验设计思路，取舍与考量。

思考：试验是否有不合理之处？是否有更好的试验设计？用 SVM 可不可以？