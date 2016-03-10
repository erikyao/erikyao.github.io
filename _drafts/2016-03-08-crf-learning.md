---
layout: post-mathjax
title: "CRF Learning"
description: ""
category: Math
tags: [CRF, Machine-Learning]
---
{% include JB/setup %}

[4-models-overview]: https://farm2.staticflickr.com/1640/25534972581_6b5d3e2a1f_o_d.png

## Material 1 - [Classical Probabilistic Models and Conditional Random Fields](http://www.scai.fraunhofer.de/fileadmin/images/bio/data_mining/paper/crf_klinger_tomanek.pdf)

### 1. Introduction

Classification is known as the assignment of a class $ y \in \mathcal{Y} $ to an observation $ x \in \mathcal{X} $.

E.g. weather report: 

$$
	\mathcal{Y} = \lbrace \text{good, bad} \rbrace 
$$

$$
	\mathcal{X} = \lbrace \text{Mon, Tue, ..., Sun} \rbrace 
$$ 

$ x $ can be described by a set of features such as $ f_{cloudy}(x) = 1 $, if and only if it is cloudy on day $ x $, $ f_{cloudy}(x) = 0 $ otherwise. Other features might be $ f_{sunny} $ or $ f_{rainy} $.

Modeling all dependencies in a probability distribution is typically very complex due to interdependencies between features.

- The Naive Bayes assumption of all features being conditionally independent is an approach to address this problem.

In the structured learning scenario, we have multiple and typically interdependent 

- class varibles and 
- observation varibles

E.g. a typical task in natural language processing is known as _**text segmentation**_ which means the classification of units of a textual sequence. 

- 比如你的 textual sequence 是一句话
- unit 是每个单词
- class 就是给每个单词标注 "verb" "noun" "adj." 之类的

One approach for modeling linear sequence structures, as can be found in natural language text, are Hidden Markov Models (HMM). For the sake of complexity reduction, strong independence assumptions between the observation variables are made. This impairs the accuracy of the model. Conditional Random Fields (CRF) are developed exactly to fill that gap: While CRFs make similar assumptions on the dependencies among the class variables, no assumptions on the dependencies among observation variables need to be made.

### 2. Probabilistic Models

In this section, some well-known probabilistic models are discussed. CRFs are founded on the underlying ideas and concepts of these approaches.

_**Naive Bayes Model (NB):**_

- An approach to classify single class variables in dependence of several feature values. 
	- The input values are assumed to be conditionally independent. 
- It is a so-called _**generative**_ approach, modeling the joint probability $ p(y, \vec{x}) $ of the input values $ \vec{x} $ and the class variable $ y $.

_**Hidden Markov Model (HMM):**_

- An extension to the NB for sequentially structured data.
- Also representing the dependencies of the variables $ \vec{x} $ and $ \vec{y} $ as a joint probability distribution (i.e. $ p(\vec{y}, \vec{x}) $).

_**Maximum Entropy Model (ME or Maxent):**_

- Modeling joint probabilities (E.g. NB & HMM) has disadvantages due to computational complexity.
- Maximum Entropy Model, in contrast, is based on modeling the conditional probability $ p(y \vert x) $. (So-called _**discriminative**_ model, vs _**generative**_ model)
- Like the NBM, it is an approach to classify a single class variable in dependence of several feature values. (i.e. $ p(y \vert \vec{x}) $)
- 注意 Maximum Entropy Model 和 Maximum Entropy Markov Model (MEMM) 是两种不同的生物
	- Maximum Entropy Model 等价于 Logistic Regression
	- Maximum Entropy Markov Model 是 $ \vec{y} $

_**Conditional Random Fields (CRF):**_

- While a HMM is a sequential extension to the NB, CRF can be understood as a sequential extension to the ME. (i.e. $ p(\vec{y} \vert \vec{x}) $)

![][4-models-overview]

#### 2.1 Naive Bayes Models

_**Input:**_

- A problem instance (i.e. observation) to be classified, $ \vec{x} = (x_1, \dots, x_m) $, where $ x_i (1 \leq i \leq m) $ are features.

_**Output:**_

- $ y $, the class variable to be predicted. 

$$
	p(y \vert x) \propto p(y,\vec{x}) = p(y) \prod_{i=1}^{m}{p(x_i \vert x_{i-1},\dots,x_1,y)}
$$

In practice, it is often assumed, that all input variables $ x_i $ are conditionally independent of each other which is known as the _**Naive Bayes assumption**_. That means that $ p(x_i \vert y, x_j) = p(x_i \vert y) $ holds for all $ i \neq j $.

Based on this simplification, the above formula can be written as

$$
	p(y \vert x) \propto p(y,\vec{x}) = p(y) \prod_{i=1}^{m}{p(x_i \vert y)}
$$

Dependencies between the input variables $ \vec{x} $ are not modeled, probably leading to an imperfect representation of the real world.

#### 2.2 Hidden Markov Models

To predict a sequence of class variables $ \vec{Y} = (y^{(1)}, \dots, y^{(n)}) $ for an observation sequence $ \vec{X} = (\vec{x^{(1)}}, \dots, \vec{x^{(n)}}) $, a Hidden Markov model can be formulated as a product over single Naive Bayes Models. Dependencies between single sequence positions are not taken into account.

_**N.B.**_ 另外我们也可以视为 there is only one feature at each sequence position, namely the identity of the respective observation.

$$
	p(\vec{Y},\vec{X}) = \prod_{i=1}^{n}{p(y^{(i)}) p(\vec{x^{(i)}} \vert y^{(i)})}
$$

Each observation $ \vec{x^{(i)} $ depends only on the class variable $ y^{(i)} $ at the respective sequence position. Due to this independence assumption, transition probabilities from one step to another are not included in this model. In fact, this assumption is hardly ever met in practice resulting in limited performance of such models. Thus, it is reasonable to assume that there are dependencies between the observations at consecutive sequence positions. To model this, state transition probabilities are added.

$$
	p(\vec{Y},\vec{X}) = \prod_{i=1}^{n}{p(y^{(i)}) p(\vec{x^{(i)}} \vert y^{(i)})}
$$

待修订补充

## 4. Conditional Random Fields

-----

- [stackoverflow: Anyone Recommend a Good Tutorial on Conditional Random Fields](http://stackoverflow.com/questions/80089/anyone-recommend-a-good-tutorial-on-conditional-random-fields)
- [PROTEIN SECONDARY STRUCTURE PREDICTION WITH CONDITIONAL RANDOM FIELDS](http://sydney.edu.au/engineering/it/research/tr/tr650.pdf)
- [An Introduction to Conditional Random Fields](http://homepages.inf.ed.ac.uk/csutton/publications/crftut-fnt.pdf)
- [Conditional Random Fields](http://pages.cs.wisc.edu/~jerryzhu/cs769/CRF.pdf)
- [Slides: Hidden Markov Models - Terminology and Basic Algorithms](http://users-cs.au.dk/cstorm/courses/PRiB_f12/slides/hidden-markov-models-1.pdf)
- [Slides: Hidden Markov Models and Kalman Filters](http://classes.engr.oregonstate.edu/eecs/winter2016/cs536/slides/HMM_Slides.pdf)

-----

Digress: CMU ML courses (google: CMU ML 10-601)

- [Index of /~tom/10601_sp09/homework](http://www.cs.cmu.edu/~tom/10601_sp09/homework/)
- [10-601, Fall 2012](http://www.cs.cmu.edu/~tom/10601_fall2012/hws.shtml)
- [10-601, Fall 2011](http://www.cs.cmu.edu/~aarti/Class/10601/hws.shtml)
- [Machine Learning 10-601 in Spring 2016](http://curtis.ml.cmu.edu/w/courses/index.php/Machine_Learning_10-601_in_Spring_2016)

-----

## Lab / Project

### Tools

- [R: crf](http://r-forge.r-project.org/projects/crf/)
- [Python: pgmpy](http://pgmpy.org/index.html)

### Feature / Measurement

chr: Chromosome
majorAllele, minorAllele
DHS_SourceCount: DNase1 Hypersensitive Site Count 
num_tfs: Number of overlapping TF Binding Sites 
phastCons: Phylogenetic Conservation (over 46 placental mammals) sumScore/validCount 
tssDistance: Distance from nearest Transcription Start Site, +/- depending on strand
P_Val: p-value of eQTLs from GTEx
gerp: Gerp feature (Constrained elements in multiple alignments)
DHS_score: DHS score

把每条 chromesome 看做一个 document，SNP 是 sequential 的 words，每个 label 相当于是 word 的 tag，这么一来需要定义两个 SNP 之间的 feature，相当于是定义两个 SNP 之间的差值

### Discussion

#### 1. PGM P182

> We noted before that we can view a binary-valued logistic CPD as a conditional version of a
naive Bayes model. We can generalize this observation to the nonbinary case, and show that
the multinomial logit CPD is also a particular type of pairwise CRF (see exercise 5.16).

#### 2. [Spring 2009: 10-601 Machine Learning: Homework Assignment 3](http://www.cs.cmu.edu/~tom/10601_sp09/homework/hw3/hw3.pdf) => 1.3 Relaxing the Conditional Independence Assumption

> Prove that for this case, that $ P(Y \vert X) $ follows the same form as the logistic regression model supplemented with the extra term that captures the dependency between $ X_1 $ and $ X_2 $ (and hence that the supplemented Logistic Regression model is the discriminative counterpart to this generative classifier).

#### 3. [How to make all interactions in R before using glmnet](http://stackoverflow.com/questions/27580267/how-to-make-all-interactions-in-r-before-using-glmnet)

首先 `glmnet(x, y, family = "binomial", ...)` 的 `family = "binomial"` 即表示 logistic regression

$ \vec{x} $ is one observation, i.e. $(x_1, x_2, \dots, x_200)$
$ y $ is a single label for $ \vec{x} $

$ e^{\vec{x}^T \eta \vec{x}} $ => $ \prod_{\substack{s \sim t}} x_s \eta_{st} x_t = \prod_{\substack{s,t \newline s \neq t}} x_s \eta_{st} x_t $

if $\eta_{st} \neq 0$, feature $x_s$ and $x_t$ are somehow correlated (conditional on ?) and there will be an edge between nodes $x_s$ and $x_t$ in the graph (i.e. make a $x_s$-$x_t$ interaction).

Suppose we have 200 featues. $\eta$ would be a $200 \times 200$ matrix. We have to keep the sparsity of $\eta$ because we might be short of training examples.