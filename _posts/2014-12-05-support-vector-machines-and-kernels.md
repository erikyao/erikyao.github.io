---
category: Machine-Learning
description: ''
tags:
- SVM
- Paper
title: Support Vector Machines and Kernels
---

之前一直没搞清楚，这里理一理思路。

总结自 [Support Vector Machines and Kernels for Computational Biology](http://www.ploscompbiol.org/article/info:doi/10.1371/journal.pcbi.1000173)、[CS229 Lecture note 3](http://cs229.stanford.edu/notes/cs229-notes3.pdf) 和 ESL。

-----

## 1. Intro

To start with, we will be considering a linear classifier for a binary classification problem with labels $ y \in {-1,1} $ and features $ x $. We will use parameters $ w $, $ b $ instead of $ \theta $, and write our classifier as 

$$
\begin{align}
	h(x) = g(w^T x + b)
	\tag{1}
	\label{eq1}
\end{align}
$$

Here, $ g(z) = 1 $ if $ z \geq 0 $, and $ g(z) = −1 $ otherwise.

我们称

$$
\begin{align}
	f(x) = w^T x + b
	\tag{2}
	\label{eq2}
\end{align}
$$

为 **discriminant function**。

$ f(x) = 0 $ 就构成了我们的 hyperplane，intuition 什么的我就不说了。

考虑到 margin 时，我们要注意一个问题，那就是 margin 的度量。按 [CS229 Lecture note 3](http://cs229.stanford.edu/notes/cs229-notes3.pdf) 的说法，实际我们有：

$$
\begin{align}
	\text{functional margin} = \text{geometric margin} \times \left  \vert  w \right  \vert 
	\tag{3}
	\label{eq3}
\end{align}
$$

这样其实有点不好记。另一种表达方式是：如果 $ x^{\ast} $ 是 support vector 的话，那么 $ f(x^{\ast}) = w^T x^{\ast} + b = \pm1 $（这个其实是 functional margin），此时 (geometric) margin 等于 $ \frac{1}{\lvert w \rvert} $。

顺便说一下记号：

$$
\begin{align}
	w^T x = \left \langle w,x \right \rangle = \left \vert w \right \vert^2
\end{align}
$$

* $ w^T x = \left \langle w,x \right \rangle $ 叫 inner product (内积) 或者 dot product
* $ \left  \vert  w \right  \vert  $ 称为 vector 的 norm (模)
* $ \frac{w}{\left  \vert  w \right  \vert } $ 称为 unit-length vector (单位向量，模为 1)

## 2. The Non-Linear Case

There is a straightforward way of turning a linear classifier non-linear, or making it applicable to non-vectorial data. It consists of mapping our data to some vector space, which we will refer to as the feature space, using a function $ \phi $. The discriminant function then is

$$
\begin{align}
	f(x) = w^T \phi(x) + b 
	\tag{4}
	\label{eq4}
\end{align}
$$

Note that $ f(x) $ is linear in the **feature space** defined by the mapping $ \phi $; but when viewed in the original **input space** then it is a nonlinear function of $ x $ if $ \phi(x) $ is a nonlinear function.

这个 mapping $ \phi $ 可能会很复杂（比如 $ X = [x_1, x_2, x_3] $, $ \phi(X) = [x_1^2, \cdots, x_3^2] $），这样计算 $ f(x) $ 就很不方便。

而 Kernel 号称： 

> Kernel methods avoid this complexity by avoiding the step of explicitly mapping the data to a high dimensional feature-space.

接下来我们就来看下 Kernel 是如何做到这一点的。

## 3. Lagrange duality 登场

我们先不考虑 $ \phi $。

我们要求 maximum margin，就是求 $ \max{\frac{1}{\left \vert  w \right \vert }} $，也就是求 $ \min{\left \vert  w \right \vert } $。所以这个问题可以写成：

$$
\begin{align}
	& \underset{w, b}{\text{minimize}}
	& & \frac{1}{2} \left \vert  w \right \vert ^2 \newline
	& \text{subject to}
	& & y^{(i)}(w^T x^{(i)} + b) \geq 1, & i = 1, \cdots, n
	\tag{5}
	\label{eq5}
\end{align}
$$

改写一下：

$$
\begin{align}
	& \underset{w, b}{\text{minimize}}
	& & \frac{1}{2} \left \vert  w \right \vert ^2 \newline
	& \text{subject to}
	& & - y^{(i)}(w^T x^{(i)} + b) + 1 \leq 0, & i = 1, \cdots, n
	\tag{OPT}
	\label{eqopt}
\end{align}
$$

yes! $ (\ref{eqopt}) $ 出来啦！$ g_i(w) = - y^{(i)}(w^T x^{(i)} + b) + 1 $，然后 $ h_i(w) $ 不存在，所以标准的 Lagrangian $ L(x, \alpha, \beta) $ 中，$ x $ 要换成 $ (w,b) $，$ \beta $ 不需要，于是变成了：

$$
\begin{align}
	L(w, b, \alpha) = \frac{1}{2} \left \vert  w \right \vert ^2 - \sum_{i=1}^{m}{\alpha_{i} [y^{(i)}(w^T x^{(i)} + b) - 1]}
	\tag{6}
	\label{eq6}
\end{align}
$$

Let's find the dual form of the problem. To do so, we need to first minimize $ L(w, b, \alpha) $ with respect to $ w $ and $ b $ (for fixed $ \alpha $), to get $ \theta_{D} $, which we'll do by setting the derivatives of $ L $ with respect to $ w $ and $ b $ to zero. We have:

$$
\begin{align}
	\nabla_{w}{L(w, b, \alpha)} &= w - \sum_{i=1}^{m}{\alpha_i y^{(i)} x^{(i)}} = 0 \newline
	w &= \sum_{i=1}^{m}{\alpha_i y^{(i)} x^{(i)}}
\end{align}
$$

剩下的 dual problem，KTT 什么的我就不推了。把上式代入 discriminant function 有：

$$
\begin{align}
	f(x) & = w^T x + b \newline
	& = \left ( \sum_{i=1}^{m}{\alpha_i y^{(i)} x^{(i)}} \right )^T x + b \newline
	& = \sum_{i=1}^{m}{\alpha_i y^{(i)} \left \langle x^{(i)},x \right \rangle } + b
	\tag{7}
	\label{eq7}
\end{align}
$$

Hence, if we've found the $ \alpha_i $'s, in order to make a prediction, we have to calculate a quantity that depends only on the inner product between $ x $ and the points in the training set. Moreover, we saw earlier that the $ \alpha_i $'s will all be 0 except for the support vectors. Thus, many of the terms in the sum above will be 0, and we really need to find only the inner products between $ x $ and the support vectors (of which there is often only a small number) in order calculate $ (\ref{eq7}) $ and make our prediction.

## 4. Kernels

现在我们再来考虑 $ \phi $。类似地，当 $ f(x) = w^T \phi(x) + b $ 时，我们按上面那一套可以得到：

$$
\begin{align}
	f(x) & = w^T \phi(x) + b \newline
	& = \sum_{i=1}^{m}{\alpha_i y^{(i)} \left \langle \phi(x^{(i)}),\phi(x) \right \rangle} + b
	\tag{8}
	\label{eq8}
\end{align}
$$

这样我们就可以定义 kernel function 为：

$$
\begin{align}
	K(x, x') = \left \langle \phi(x),\phi(x') \right \rangle
	\tag{9}
	\label{eq9}
\end{align}
$$

除了上一节末尾说的计算方便之外，kernel 还有一个作用就是：我现在可以不用关心 $ \phi $ 具体是个什么函数，我只要把 $ \left \langle \phi(x^{(i)}),\phi(x) \right \rangle $ 设计出来就可以了。类似于 "屏蔽底层技术细节"。

最后，我觉得 kernel 的命名应该是 "kernel of discriminant function" 的意思。

## 5. Kernel Examples

### 5.1 Popular Kernels

Popular choices for $ K $ in the SVM literature are:

* linear kernel: $ K(x, x') = \left \langle x,x' \right \rangle $
	* 相当于没有用 $ \phi $ 或者 $ \phi(x) = x $
* dth-Degree polynomial kernel:
	* homogeneous: $ K(x, x') = \left \langle x,x' \right \rangle^d $
	* inhomogeneous: $ K(x, x') = (1 + \left \langle x,x' \right \rangle)^d $
* Gaussian kernel: $ K(x, x') = \exp(-\frac{\left \vert  x-x' \right \vert ^2}{2 \sigma^2}) $
* Radial basis kernel: $ K(x, x') = \exp(-\gamma \left \vert  x-x' \right \vert ^2) $
* Neural network kernel: $ K(x, x') = tanh(k_1 \left \langle x,x' \right \rangle + k_2) $
	* tanh is hyperbolic tangent
	* $ sinh(x) = \frac{e^x - e^{-x}}{2} $
	* $ cosh(x) = \frac{e^x + e^{-x}}{2} $
	* $ tanh(x) = \frac{sinh(x)}{cosh(x)} = \frac{e^x - e^{-x}}{e^x + e^{-x}} $
	
### 5.2 Kernels for Sequences

[Support Vector Machines and Kernels for Computational Biology](http://www.ploscompbiol.org/article/info:doi/10.1371/journal.pcbi.1000173) P12 说到了，我就简单写一下。

#### 5.2.1 Kernels Describing $ \ell $-mer Content

我们要做的就是把一个 sequence 映射到 feature space 的一个 vector。我们可以这样设计 feature coding：

* 考虑所有的 dimer，以 ACGT 的顺序，$ x_1 $ 表示 AA 的个数，$ x_2 $ 表示 AC 的个数，……，$ x_{16} $ 表示 TT 的个数
* 如果要区分 intron 和 exon 的话，那么可以设计成：$ x_1 $ 表示 intronic AA 的个数，……，$ x_{16} $ 表示 intronic TT 的个数，$ x_{17} $ 表示 exonic AA 的个数，……，$ x_{32} $ 表示 exonic TT 的个数
* 比如一个 sequence 是 intro ACT，那么就只有 intronic AC 和 intronic CT 上是两个 1，其余全 0。这样的一个 vector 称为 sequence 的 spectrum

我们把 sequence 映射到 $ \ell $-mer spectrum 的函数命名为 $ \Phi_{\ell}^{spectrum}(x) $，于是可以得到一个 spectrum kernel：

$$
\begin{align}
	K_{\ell}^{spectrum}(x, x') = \left \langle \Phi_{\ell}^{spectrum}(x) ,\Phi_{\ell}^{spectrum}(x') \right \rangle
	\tag{10}
	\label{eq10}
\end{align}
$$

Since the spectrum kernel allows no mismatches, when $ \ell $ is sufficiently long the chance of observing common occurrences becomes small and the kernel will no longer perform well. This problem is alleviated if we use the mixed spectrum kernel:

$$
\begin{align}
	K_{\ell}^{mixedspectrum}(x, x') = \sum_{d=1}^{\ell}{\beta_d K_{d}^{spectrum}(x, x')}
	\tag{11}
	\label{eq11}
\end{align}
$$

where $ \beta_d $ is a weighting for the different substring lengths.

#### 5.2.2 Kernels Using Positional Information

Analogous to Position Weight Matrices (PWMs), the idea is to analyze sequences of fixed length $ L $ and consider substrings starting at each position $ l = 1 ,\cdots,L $ separately, as implemented by the so-called weighted degree (WD) kernel:

$$
\begin{align}
	K_{\ell}^{weighteddegree}(x, x') = \sum_{l=1}^{L}{\sum_{d=1}^{\ell}{\beta_d K_{d}^{spectrum}(x_{[l:l+d]}, x'_{[l:l+d]})}}
	\tag{12}
	\label{eq12}
\end{align}
$$

where $ x_{[l:l+d]} $ is the substring of length $ d $ at position $ l $. A suggested setting for $ \beta_d $ is $ \beta_d = \frac{2(\ell-d+1)}{\ell^2 + \ell} $.