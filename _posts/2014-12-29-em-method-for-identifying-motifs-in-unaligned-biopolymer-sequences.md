---
layout: post-mathjax
title: "EM method for identifying motifs in unaligned biopolymer sequences"
description: ""
category: Machine-Learning
tags: [ML-101, BioInformatics-101, Paper]
---
{% include JB/setup %}

总结下 [Unsupervised Learning of Multiple Motifs in Biopolymers Using Expectation Maximization](http://link.springer.com/article/10.1007%2FBF00993379) 中的 EM 方法。

我自己写的注释里，"motif" 和 "site" 这两个概念是混用的，可以等同视之。

-----

In this report we are concerned only with _**contiguous**_ [kənˈtɪgjuəs] motifs. That is, appearances of a motif may differ in point mutations, but insertions or deletions are not allowed. 

Problem:

* Simple version
	* Given a dataset of biopolymer sequence believed to contain **a single shared motif**, to locate the starting position in each sequence of the motif and to describe the motif
	* 本篇处理的是 Simple version
* General version
	* Finding and describing **multiple, distinct shared motifs** in a set of biopolymer sequences.

Given:

* $ N $, the number of sequences
* $ LSITE $, the length of the motif
* $ L $, the length of each sequence (assume all are of the same length)
	* 注意这 $ N $ 个 sequences 是 unaligned（如果已经 aligned 那 motif 也基本就出来了），然后这就构成了一个 $ N \times L $ 的 table，文中说的 "column" 就是指这个 table 的 column
* $ \mathcal{L} $, the alphabet of the sequences

Define:

* $ poff_{ij} $, offset probability, the probability that the site (motif) begins at position $ j $ in sequence $ i $
	* 可以把 $ poff $ 看做一个 $ N \times L $ 的 probability matrix
	* 最简单的理解就是 $ poff = P_{Y} $
* $ freq_{lk} $, (in-motif) letter frequency, the probability that letter $ l $ appearing in position $ k $ of the motif
	* 可以把 $ freq $ 看做一个 $ \lVert \mathcal{L} \rVert \times LSITE $ 的 probability matrix
* $ S_i $, the $ i^{th} $ sequence in the dataset
* $ S_{ij} $, the letter appearing in position $ j $ of $ S_i $
* $ Y $, the indicator variable (label)
	* $ Y_{ij} = 1 $ if the site (motif) starts at position $ j $ of $ S_i $
	* $ Y_{ij} = 0 $ otherwise
	
In the probabilistic model we use, we ignore the probability of the letters outside of the motif, and only consider the probability of the letters inside the motif. Both standard and modified EM must calculate the probability of sequence $ S_i $ given the motif start and the model. This can be written as:

$$
\begin{align}
	P(S_i \vert Y_{ij}=1,freq^{(q)}) = \prod_{k=1}^{LSITE}{freq_{l_k,k}} 
\end{align}
$$

This forms the basis of calculating $ poff^{(q)} $

* 注 1：原文是 $ P(S_i \vert Y_{ij}=1,poff^{(q)}) = \cdots $，我觉得是错的，应该是 $ P(S_i \vert Y_{ij}=1,freq^{(q)}) = \cdots $，原因是：
	* 文章说了：The standard EM algorithm use Bayes' rule to estimate $ poff^{(q)} $ from $ P(S_i \vert Y_{ij}=1,poff^{(q)}) $（这里也写错了），这明显是不合理的，你已知了 $ poff^{(q)} $ 求了个概率，然后还要反过来 estimate $ poff^{(q)} $，逻辑上不对。
	* 后面 $ poff^{(q)} $ 展开后，$ P(S_i \vert Y_{ij}=1,poff^{(q)}) $ 对计算毫无帮助，只可能是 $ P(S_i \vert Y_{ij}=1,freq^{(q)}) $ 才能带进去计算
	* 原文还写了：…… calculate the probability of sequence $ S_i $ given the motif and the model. This can be written as……然后接了这个式子。这里的 "and the model" 应该是指 the motif model，结合 `注 7` 也应该是 $ P(S_i \vert Y_{ij}=1,freq^{(q)}) $
* 注 2：$ l_k $ 表示 motif 第 $ k $ position 上的 letter。又因为 motif 从 $ S_{ij} $ 开始（因为 $ Y_{ij} = 1 $），所以有：
	* <!-- -->$ k = 1, \, l_1 = S_{ij} $
	* <!-- -->$ k = 2, \, l_2 = S_{i,(j+1)} $
	* ......
	* <!-- -->$ k = k, \, l_k = S_{i,(j+k-1)} $
* 注 3：这段话让人困惑的地方在于 <font color="red">the probability of sequence</font> $ S_i $，有的文章里的写法是 the probability of observing sequence $ S_i $。我一开始没搞明白的是这到底是怎样的一个随机试验，怎么样才算时抽到了 $ S_i $。其实正确的思路是：
	* 比如考虑 $ alphabet = \{ A,C,T,G \} $，观测到 $ S_{i} = AAA $ 的概率是 $ (\frac{1}{4})^3 = \frac{1}{64} $。其实这里也是一样的。而且文章还说了 "ignore the probability of the letters outside of the motif"，所以只考虑 motif 那几个 letter 的概率就可以了
	* $ S_i $ 的 $ i $ 并没有参与这个随机试验，这也是个比较迷惑的地方。
	* 以后有类似的第一眼看不明白的概率，把试验对象拆成小分子考虑，转成排列组合问题应该会更好理解一些。
		* 或者换个角度考虑，比如 $ P(A \vert B) $ 对你而言无法 make sense，但是 $ P(B \vert A) $ make sense 的话，你就把 $ P(A \vert B) $ 当做计算 $ P(B \vert A) $ 用的因子好了，不要在 $ P(A \vert B) $ 的意义上纠缠太多的时间
	
Define:

* Event $ A $: $ Y_{ij} = 1 $
* Event $ B $: $ S_i \vert freq^{(q)} $ (given $ freq^{(q)} $ and we observed $ S_i $)

Bayes' rule states that $ P(A \vert B) = \frac{P(B \vert A)P(A)}{P(B)} $, so 

$$
\begin{align}
	poff_{ij}^{(q)} = P(Y_{ij}=1  \vert  freq^{(q)},S_i) = \frac{P(S_i \vert Y_{ij}=1,freq^{(q)})P^0(Y_{ij}=1)}{\sum_{k=1}^{L-LSITE+1}{P(S_i \vert Y_{ik}=1,freq^{(q)})P^0(Y_{ik}=1)}}
\end{align}
$$

* 注 4：分母里 $ k $ 只递增到 $ L-LSITE+1 $ 的原因是：$ k $ 再往后排的话，sequence 末尾就不够 motif 的长度了，必然是 $ P^0(Y_{ik}=1) = 0 $，所以这里就干脆不写了。

$ P^0 $, the prior probability, is not estimated and is assumed to be uniform,

$$
\begin{align}
	& P^0(Y_{ik}=1) = \frac{1}{L-LSITE+1},& k = 1,2,\ldots,(L-LSITE+1)
\end{align}
$$

so the above simplifies to 

$$
\begin{align}
	poff_{ij}^{(q)} = P(Y_{ij}=1  \vert  freq^{(q)},S_i) = \frac{P(S_i \vert Y_{ij}=1,freq^{(q)})}{\sum_{k=1}^{L-LSITE+1}{P(S_i \vert Y_{ik}=1,freq^{(q)}))}}
\end{align}
$$

The EM algorithm simultaneously discovers **a model of the motif (the sequence of independent multinomial random variables with parameters $ freq $)** and estimates the probability of each possible starting point of examples of the motif in the sequences in the dataset ($ poff $). The likelihood of the model given the training data is just the probability of the data given the model. The logarithm of this quantity is 

$$
\begin{align}
	\log(likelihood) = N \sum_{j=1}^{LSITE}{\sum_{l \in \mathcal{L}}{freq_{lj} \log(freq_{lj})}} + N(L-LSITE) \sum_{l \in \mathcal{L}}{fout_l \log(fout_l)}
\end{align}
$$

where $ fout_l $ is the frequency of the letter $ l $ in all positions of the sequences outside the instance of the shared motif.

* 注 5：请仔细阅读这段话
* 注 6：我们知道 binomial distribution 的情形是：黑球概率 $ p_1 $，白球概率 $ p _2 = 1 - p_1 $，摸 $ n $ 次，黑球 $ k_1 $ 个，白球 $ k_2 = n - k_1 $ 个的概率是 $ C_{k_1 + k_2}^{k_1} p_1^{k_1} p_2^{k_2} $。那么 multinomial 就是扩展到了多种颜色的球：假设球的颜色有 $ m $ 种，颜色为 $ c_i $ 的球概率为 $ p_i $（$ \sum_{i=1}^{m}{p_i} = 1 $），还是摸 $ n $ 次，摸出 $ k_1 $ 个 $ c_1 $，$ k_2 $ 个 $ c_2 $，……，$ k_m $ 个 $ c_m $（$ \sum_{j=1}^{m}{k_j} = n $）的概率是 $ \frac{n!}{k_1! \ldots k_m!}p_1^{k_1} \ldots p_m^{k_m} $ 
* 注 7：这一段说了： motif model 是 multinomial，那么这里 letter 就是球，alphabet 就是球的颜色，$ freq $ 就是 $ p $
* 注 8："The likelihood of the model given the training data is just the probability of the data given the model" 这一句看上去很屌的样子，其实说的就是 $ \mathcal{L}(\Theta \vert \mathcal{X}) = p(\mathcal{X} \vert \Theta) $……
* 注 9：这个式子拿出来得太快了，具体一点的推导可以参见 `[1]`。（本篇讲 EM 是 "太简"，`[1]` 这一篇讲 EM 是 "太散"，不过它的 problem 描述还是很到位的，不明白 problem 的时候可以参考一下），更具体的可能需要参考 `[1]` 引用的 `[2]`
* 注 10：本篇讲的 EM 步骤是：先初始化 $ freq $，然后根据 $ freq $ 计算 $ poff $，接着反过来根据 $ poff $ 重新计算 $ freq $，直到 $ freq $ 收敛。中间的细节还是没说清。下面还是根据 `[1]` 来讲下具体的 EM 步骤（这一篇使用的表示方法不同，不好直接搬运，不过可以依样画葫芦）：
	* 初始化 $ freq^{(q)} $
	* E step:
		* 计算 $ P(S_i \vert Y_{ij}=1,freq^{(q)}) = \prod_{k=1}^{LSITE}{freq_{l_k,k}} $
		* 接着计算 $ poff^{(q)} $
	* M step:
		* 展开 $ E \left [ \log(likelihood) \right ] = \sum_{i,j}{poff_{ij}^{(q)} \log(likelihood)} $
		* 求得 $ freq^{(q+1)} $ 和 $ fout^{(q+1)} $ 使 $ E \left [ \log(likelihood) \right ] $ max
	* 注意我们这明显是 discrete 的情况，所以不要傻乎乎地用 continuous 的积分来做
	* 根据 $ E \left [ \log \, p(\mathcal{X},\mathcal{Y} \vert \Theta) \mid \mathcal{X}, \Theta^{(i-1)} \right ] = \sum_{\mathbf{y} \in \Upsilon}{\log \, p(\mathcal{X},\mathbf{y} \vert \Theta) \, P_{\mathcal{Y}}(\mathbf{y}  \vert  \mathcal{X}, \Theta^{(i-1)})} $，我们可以类比一下：
		* <!-- -->$ \mathcal{X} $ 对应 $ S $，取值 $ S_1,\ldots,S_N $
		* <!-- -->$ \mathcal{Y} $ 对应 $ Y $，取值 $ Y_{ij} = \text{0 or 1} $
		* <!-- -->$ \Theta = \{ freq, fout \} $
		* <!-- -->$ \log \, p(\mathcal{X},\mathbf{y} \vert \Theta) = \log(likelihood) $
		* <!-- -->$ P_{\mathcal{Y}}(\mathbf{y}  \vert  \mathcal{X}, \Theta^{(i-1)}) = poff $
		
-----

## REFERENCES

[1]C. E. Lawrence and A. A. Reilly, “[An expectation maximization (EM) algorithm for the identification and characterization of common sites in unaligned biopolymer sequences](http://www.ncbi.nlm.nih.gov/pubmed/2184437),” Proteins, vol. 7, no. 1, pp. 41–51, 1990.

[2]G. Z. Hertz, G. W. Hartzell, and G. D. Stormo, “[Identification of consensus patterns in unaligned DNA sequences known to be functionally related](http://www.ncbi.nlm.nih.gov/pubmed/2193692),” Comput. Appl. Biosci., vol. 6, no. 2, pp. 81–92, Apr. 1990.

