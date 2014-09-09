---
layout: post-mathjax
title: "Conditional Probability"
description: ""
category: Math
tags: [Math-Statistics]
---
{% include JB/setup %}

总结自 Coursera lecture [Statistical Inference](https://class.coursera.org/statinference-005/lecture) section [03 Conditional probability](https://class.coursera.org/statinference-005/lecture/157)。

-----

## 1. Definition

Conditional Probability refers to the probablity conditional on some new information.  

The conditional probability of an event _B_ given that _A_ has already occurred is: 

->\\( P(B|A) = \frac{P(B \cap A)}{P(A)} \\)<-

Notice that if _A_ and _B_ are independent, then \\( P(B|A) = \frac{P(B \cap A)}{P(A)} = \frac{P(B)P(A)}{P(A)} = P(B) \\)

## 2. Bayes' rule (a.k.a Bayes' law or Bayes' theorem)

->\\( P(B|A) = \frac{P(A|B)P(B)}{P(A|B)P(B) + P(A|B\^c)P(B\^c)} \\)<-

## 3. Diagnostic tests 

* Let \\( + \\) and \\( - \\) be the events that the result of a diagnostic test is positive or negative respectively.
	* \\( + \\): h(x) = 1
	* \\( - \\): h(x) = 0
* Let \\( D \\) and \\( D\^c \\) be the event that the subject of the test has or does not have the disease in deed respectively.
	* \\( D \\): y = 1
	* \\( D\^c \\): y = 0
* Thus
	* TP: h(x) = 1 and y = 1, \\( + \cap D \\)
	* FP: h(x) = 1 and y = 0, \\( + \cap D\^c \\)
	* TN: h(x) = 0 and y = 0, \\( - \cap D\^c \\)
	* FN: h(x) = 0 and y = 1, \\( - \cap D \\)
	* P = TP + FN, \\( D \\) => object really has disease
	* N = TN + FP, \\( D\^c \\) => object really has no disease
	* TP + FP, \\( + \\) => predicts that object has disease
	* TN + FN, \\( - \\) => predicts that object has no disease
	
<!-- -->
	
* The **Sensitivity**, or **true positive rate (TPR)**, or **Recall** is the probability that the test is positive given that the subject actually has the disease. (Of all the objects that actually have disease, how much did we correctly predict as having disease?)
	* \\( TPR = \frac{TP}{TP + FN} = \frac{TP}{P} = \frac{P(+ \cap D)}{P(D)} = P(+|D) \\)
* The **Specificity (SPC)**, or **true negative rate** is the probability that the test is negative given that the subject does not have the disease.
	* \\( SPC = \frac{TN}{TN + FP} = \frac{TN}{N} = \frac{P(- \cap D\^c)}{P(D\^c)} = P(-|D\^c) \\)
* The **Precision**, or **positive predictive value (PPV)** is the probability that the subject has the disease given that the test is positive. (Of all the objects whom we predict as having disease, how much actually has disease?)
	* \\( PPV = \frac{TP}{TP + FP} = \frac{P(+ \cap D)}{P(+)} = P(D|+) \\)
* The **negative predictive value (NPV)** is the probability that the subject does not have the disease given that the test is negative.
	* \\( NPV = \frac{TN}{TN + FN} = \frac{P(- \cap D\^c)}{P(-)} = P(D\^c|-) \\)
* The **prevalence of the disease** is the marginal probability of disease, \\( P(D) \\)
	* marginal probability 可以这样理解：\\( +, - \\) 和 \\( D, D\^c \\) 构成了一个 2x2 的 table，table 的 cells 填的是对应的 probability，我们给这个 table 加一个 "总计" column 或者 row，这个 "总计" 就是 table 的 margin。\\( P(D) \\) 可以看做是 \\( P(+ \cap D) \\) 和 \\( P(- \cap D) \\) 的总计。
* \\( F_1 \\) score
	* \\( F_1 = \frac{2 \times Precision \times Recall}{Precision + Recall} = \frac{2TP}{2TP + FP + FN} \\)
	
<!-- -->

* **Diagnostic Likelihood Ratio** of a positive test
	* \\( DLR\_{+} = \frac{P(+|D)}{P(+|D\^c)} = \frac{TPR}{1-SPC} \\)
* **Diagnostic Likelihood Ratio** of a negative test
	* \\( DLR\_{-} = \frac{P(-|D)}{P(-|D\^c)} = \frac{1-TPR}{SPC} \\)
* Likelihood Ratios
	* 展开 \\( P(D|+) \\) 和 \\( P(D\^c|+) \\) 会发现它们的分母是一样的，于是 \\( \frac{P(D|+)}{P(D\^c|+)} = \frac{P(+|D)}{P(+|D\^c)} \times \frac{P(D)}{P(D\^c)} \\)
		* \\( \frac{P(D|+)}{P(D\^c|+)} \\) a.k.a Post-Test Odds of D
		* \\( \frac{P(D)}{P(D\^c)} \\) a.k.a Pre-Test Odds of D
		* Therefore \\( \text{Post-Test Odds of D} = DLR\_{+} \times \text{Pre-Test Odds of D} \\)
	* 同理有 \\( \frac{P(D|-)}{P(D\^c|-)} = \frac{P(-|D)}{P(-|D\^c)} \times \frac{P(D)}{P(D\^c)} \\)
	* 这个 likelihood 应该这样理解：
		* 假如 prevalence of the disease \\( P(D) = 1\% \\)，\\( DLR\_{+} > 1 \\)，那么 Pre-Test Odds of D 肯定是大于 1/99 的，进而肯定有 \\( P(D|+) > 1\% \\)。这也就意味着，如果对你做了 positive 的预测，你真实患病的概率比一般的患病率（1%）是要大的，more likely to have the disease.
		* 同理，如果 \\( DLR\_{-} < 1 \\)，说明如果对你做了 negative 的预测，你真的不患病的概率（\\( P(D\^c|-) \\)）会大于 99%，more likely to have no disease.
		* More generally, 
			* DLR > 1 indicates that the test result is associated with the presence of the disease.
			* DLR <0.1 indicates that the test result is associated with the absence of the disease.
		
## 4. Exercise

A [web site for home pregnancy tests](http://www.medicine.ox.ac.uk/bandolier/band64/b64-7.html) cites the following: "When the subjects using the test were women who collected and tested their own samples, the overall sensitivity was 75%. Specificity was also low, in the range 52% to 75%." Assume the lower value for the specificity. Suppose 30% of women taking pregnancy tests are actually pregnant. What number is closest to the probability of pregnancy given the positive test?

已知 \\( TPR = 75\%, SPC = 52\%, P(D) = 30\% \\)，求 \\( P(D|+) \\)。  

\\( P(D|+) = \frac{P(+|D)P(D)}{P(+|D)P(D) + P(+|D\^c)P(D\^c)} = \frac{TPR * P(D)}{TPR * P(D) + (1-SPC)*(1-P(D))} = \frac{0.75 * 0.3}{0.75 * 0.3 + 0.48 * 0.7} = 40\% \\)
