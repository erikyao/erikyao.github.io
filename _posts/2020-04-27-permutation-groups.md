---
category: Math
description: ''
tags: []
title: Permutation Groups / Permutation Notations / Order of A Permutation / Transpositions
toc: true
toc_sticky: true
---

参考文献：

- [5. Permutation Groups](http://math.mit.edu/~mckernan/Teaching/12-13/Spring/18.703/l_5.pdf)
- [The Order of a Permutation](http://mathonline.wikidot.com/the-order-of-a-permutation)
- [Class 17: More Permutations ](http://www.math.caltech.edu/~2015-16/1term/ma006a/17.%20More%20permutations.pdf)
- [The Sign of a Permutation by Matt Baker](https://mattbakerblog.files.wordpress.com/2014/11/permutations.pdf)

## 1. Permutation Groups

**Definition 1:** Let $X$ be a set. A **permutation** of $X$ is simply a bijection $f: X \to X$

- 那既然 permutation 是一个双射函数，那 permutation 的 composition $f \circ g$ 也是一个 permutation
- 同时，双射函数的逆函数存在，且也是双射的，所以 $f^{-1}$ 也是 permutation

**Lemma 2:** Let $X$ be a set. The set of all permutations on $X$, under the operation of composition $\circ$, forms a Group $S(X)$.

Group 的概念见 [Is vector space a field? And what are: Groups / Rings / Fields / Vector Spaces?](/math/2018/06/06/is-vector-space-a-field-and-what-are-groups-rings-fields-vector-spaces)。简而言之，我们说 $S(X)$ 是 Group 是因为它满足 Group 的 4 个 axiom：

1. **Closure:** $\forall f, g \in S(X), f \circ g \in S(X)$ 
2. **Associativity:** $\forall f, g, h \in S(X), (f \circ g) \circ h = f \circ (g \circ h)$
3. **Identity element:** $\exists I \in S(X)$ such that $I(X) = X$
4. **Inverse element:** $\forall f \in S(X), \exists f^{-1} \in S(X)$ such that $f \circ f^{-1} = I$

- 注意交换律 Commutativity 不是 Group 的 axiom
  - i.e. $f \circ g \not\equiv g \circ f$

**Lemma 3:** If $\vert X \vert = n$, then $\vert S(X) \vert = n!$

**Definition 4:** The Group $S_n$ is the set of permutation of the first $n$ natural numbers $\lbrace 1, 2, \dots, n \rbrace$

## 2. Permutation Notations / Order of A Permutation

第一种写法是把 permutation $f$ 的 domain $X$ 列在第一行，把 image $f(X)$ 列在第二行，形如：

$$
f = \left(\begin{smallmatrix} 
x_1 & x_2 & \cdots & x_n \\
f(x_1) & f(x_2) & \cdots & f(x_n)
\end{smallmatrix}\right)
$$

以下我们为了方便我们主要研究 $S_n$。第一种写法的举例：

$$
\sigma = \left(\begin{smallmatrix} 
1 & 2 & 3 & 4 \\
2 & 3 & 4 & 1 
\end{smallmatrix}\right) \in S_4
$$

这种写法的问题在于：看不出 $\sigma$ 的 order。那具体啥是 permutation 的 order？

**Definition 5:** Let $\sigma \in S_n$. The **order** of $\sigma$, denoted $\operatorname{order}(\sigma) = m$ is the smallest positive integer $m$ such that $\sigma^{m} = I$ where $I$ is the identity permutation. 

举例：

$$
\begin{aligned}
\sigma &= \left(\begin{smallmatrix} 
1 & 2 & 3 & 4 \\
4 & 3 & 2 & 1 
\end{smallmatrix}\right) \newline
\sigma \circ \sigma &= \left(\begin{smallmatrix} 
1 & 2 & 3 & 4 \\
4 & 3 & 2 & 1 
\end{smallmatrix}\right) \circ \left(\begin{smallmatrix} 
1 & 2 & 3 & 4 \\
4 & 3 & 2 & 1 
\end{smallmatrix}\right) = \left(\begin{smallmatrix} 
1 & 2 & 3 & 4 \\
1 & 2 & 3 & 4 
\end{smallmatrix}\right) = I
\end{aligned}
$$

为此我们需要一种 "表达能力" 更强的 notation，于是我们有了下文的 cycle notation.

**Definition 6:** Let $\sigma \in S_n$. We say that $\sigma$ is a **$k$-cycle** if there are integers $x_1, x_2, \dots, x_k$ such that $\sigma(x_1) = x_2, \sigma(x_2) = x_3, \dots, \sigma(x_k) = x_1$ and $\sigma$ holds for every other integer (i.e. $\sigma(x_j) = x_j, \forall j > k$)

- 注意这里并没有说 $x_1 = 1$，比如你可以有 $\sigma(2) = 3, \sigma(3) = 4, \sigma(4) = 2$，这也算是一个 $3$-cycle

由此我们可以有第二种写法：如果 permutation $\sigma$ 是一个 $k$-cycle，我们可以写成 $\sigma = (x_1, x_2, \dots, x_k)$。举例：

$$
\sigma = \left(\begin{smallmatrix} 
1 & 2 & 3 & 4  \\
2 & 3 & 4 & 1 
\end{smallmatrix}\right) \Rightarrow \sigma = (1,2,3,4)
$$

- 注意这个表达方式不唯一，明显你写成 $\sigma = (x_k, x_1, x_2, \dots, x_{k-1})$ 也是可以的
- 明显，此时我们可以直接得出：$\sigma$ 的 order 是 $k$
  - 好比你一路往右 shift，shift 了一圈 ($k$ 次) 又回到了起点

但并不是每个 permutation 都能写成一个完整的 $k$-cycle，所以我们我们扩展一下第二种写法，称为 cycle decomposition of permutation：

**Definition-Lemma 7:** $\forall \sigma \in S_n, \sigma$ can be expressed as a product of *disjoint* cycles. This decomposition is unique, ignoring 1-cycles, up to order. The **cycle type** of $\sigma$ is the lengths of cycles in the decomposition.

- 注意这里这个 "up to order" 指 "从 order 的角度来看 (是 unique 的)"，这是数学教材里的一个常用的表达式，具体可以参考 [How do I understand the meaning of the phrase “up to~” in mathematics?](https://math.stackexchange.com/questions/430543/how-do-i-understand-the-meaning-of-the-phrase-up-to-in-mathematics)
- 因为 cycle 的写法不唯一，所以这里它这里 "up to order" 的具体含义就是：如果两个 cycle 的 order 是相同的，就认为是 cycle 是相同的，而不算是违反了 unique

举例：

$$
\sigma = \left(\begin{smallmatrix} 
1 & 2 & 3 & 4 & 5 \\
3 & 4 & 1 & 5 & 2
\end{smallmatrix}\right) \Rightarrow \sigma = (1,3)(2,4,5) \Rightarrow \text{ cycle type of } \sigma \text{ is } (2,3)
$$

注意这里应该这么看：$k$-cycle 本身也是 permutation，所以上面其实是说：任意一个 permutation 都能看做是几个 disjoint 的 $k$-cycle-styled 的 permutation 的 **composition**, i.e. $\sigma = c_{k_1} \circ c_{k_2} \circ \dots \circ c_{k_l}$

- 换言之 cycle decomposition 是严格意义上的 function decomposition

**Lemma 8:** Let $\sigma \in S_n$ be a permutation with cycle type $(k_1, k_2, \dots, k_l)$. The **order** of $\sigma$ is the least common multiple of $k_1, k_2, \dots, k_l$

## 3. Transpositions

**Definition:** A transposition is simply a $2$-cycle. 

E.g. $\tau = (1)(3)(5)(2,4) \in S_5$ 就是一个 transposition；一般也简写成 $\tau = (2,4)$

permutation 可以被 cycle decomposition；类似地，cycle 也能被 transposition decomposition，进而也可以认为 permutation 能被 transposition decomposition

- 我们可以特别定义 1-cycle $(x_i)$ 等价于两个 transposition $(x_i,x_j)(x_j,x_i)$ where $x_j$ is a random member in $X$ other than $x_i$，为 transposition decomposition 的合法性铺路

### 3.1 Transposition Decomposition and Commutativity

但在讲 transposition decomposition 之前，我要强调一下 Commutativity 的问题。

前面有讲，$S_n$ 或者 $S(X)$ 作为一个 group 是不保证 Commutativity 的。但要注意，在 cycle decomposition 的定义里，我们有一个很关键的修饰语——**disjoint**。可以证明，**disjoint 的 $k$-cycles 是满足 Commutativity 的**。

但在 transposition decomposition 的时候，我们并没有强调 disjoint，实际情况也不可能要求它 disjoint，所以一般情况下 transposition 是没有 Commutativity 的。举例：对 $X = \lbrace 1,2,3 \rbrace$ 而言：

$$
\begin{aligned}
(1,2) &= \left(\begin{smallmatrix} 
1 & 2 & 3 \\
2 & 1 & 3
\end{smallmatrix}\right) \\
(1,3) \circ (1,2) &= \left(\begin{smallmatrix} 
1 & 2 & 3 \\
2 & 3 & 1
\end{smallmatrix} \right) \\
\Rightarrow (1,3)(1,2) &= (1,2,3)
\end{aligned}
$$

$$
\begin{aligned}
(1,3) &= \left(\begin{smallmatrix} 
1 & 2 & 3 \\
3 & 2 & 1
\end{smallmatrix}\right) \\
(1,2) \circ (1,3) &= \left(\begin{smallmatrix} 
1 & 2 & 3 \\
3 & 1 & 2
\end{smallmatrix}\right) \\
\Rightarrow (1,2)(1,3) &= (1,3,2)
\end{aligned}
$$

### 3.2 How to Decompose a $k$-Cycle into Transpositions: $c_k = \tau_1 \tau_2 \dots \tau_{k-1}$

一个 $k$-cycle $(x_1, x_2, \dots, x_k)$ 可以有两种 decomposition:

1. $(x_1, x_2, \dots, x_k) = (x_1, x_2)(x_2, x_3) \dots (x_{k-1}, x_k)$
2. $(x_1, x_2, \dots, x_k) = (x_1, x_k)(x_1, x_{k-1}) \dots (x_1, x_{2})$

注意根据 function composition 的定义，**是右边的 transposition 先执行**：

第一种分解方式：

$$
\begin{aligned}
\left(\begin{matrix} x_1 & x_2 & \dots & x_{k-3} & x_{k-2} & x_{k-1} & x_{k} \end{matrix}\right) & \Leftarrow \text{ original $X$} \\
\left(\begin{matrix} x_1 & x_2 & \dots & x_{k-3} & x_{k-2} & x_{k} & x_{k-1} \end{matrix}\right) & \Leftarrow (x_{k-1}, x_k) \text{ applied} \\
\left(\begin{matrix} x_1 & x_2 & \dots & x_{k-3} & x_{k-1} & x_{k} & x_{k-2} \end{matrix}\right) & \Leftarrow (x_{k-2}, x_{k-1}) \text{ applied} \\
\left(\begin{matrix} x_1 & x_2 & \dots & x_{k-2} & x_{k-1} & x_{k} & x_{k-3} \end{matrix}\right) & \Leftarrow (x_{k-3}, x_{k-2}) \text{ applied} \\
\dots & \\
\left(\begin{matrix} x_1 & x_3 & \dots & x_{k-2} & x_{k-1} & x_{k} & x_{2} \end{matrix}\right) & \Leftarrow (x_{2}, x_{3}) \text{ applied} \\
\left(\begin{matrix} x_2 & x_3 & \dots & x_{k-2} & x_{k-1} & x_{k} & x_{1} \end{matrix}\right) & \Leftarrow (x_{1}, x_{2}) \text{ applied}
\end{aligned}
$$

第二种分解方式：

$$
\begin{aligned}
\left(\begin{matrix} x_1 & x_2 & x_3 & x_4 & \dots & x_{k-1} & x_{k} \end{matrix}\right) & \Leftarrow \text{ original $X$} \\
\left(\begin{matrix} x_2 & x_1 & x_3 & x_4 & \dots & x_{k-1} & x_{k} \end{matrix}\right) & \Leftarrow (x_1, x_2) \text{ applied} \\
\left(\begin{matrix} x_2 & x_3 & x_1 & x_4 & \dots & x_{k-1} & x_{k} \end{matrix}\right) & \Leftarrow (x_1, x_3) \text{ applied} \\
\left(\begin{matrix} x_2 & x_3 & x_4 & x_1 & \dots & x_{k-1} & x_{k} \end{matrix}\right) & \Leftarrow (x_1, x_4) \text{ applied} \\
\dots & \\
\left(\begin{matrix} x_2 & x_3 & x_4 & x_5 & \dots & x_1 & x_{k} \end{matrix}\right) & \Leftarrow (x_1, x_{k-1}) \text{ applied} \\
\left(\begin{matrix} x_2 & x_3 & x_4 & x_5 & \dots & x_{k} & x_1 \end{matrix}\right) & \Leftarrow (x_1, x_{k}) \text{ applied} \\
\end{aligned}
$$

### 3.3 How to Compose a Permutation with A Transposition: $\sigma \tau = ?, \tau \sigma = ?$

考虑这么一个问题：假设有一个 permutation $\sigma \in S_n$ 有 $n_c$ 个 disjoint cycles，现在有一个 transposition $\tau = (a, b) \in S_n$，问 $\tau \sigma$ 和 $\sigma \tau$ 会有多少个 disjoint cycles?

这个问题要分两种情况考虑：

(1) 假设 $a, b$ 处在 $\sigma$ 的一个 cycle 内，假设这个 cycle 是 $\gamma = (a, x_1, x_2, \dots, x_r, b, y_1, y_2, \dots, y_s)$。为了演示方便，我们不妨假设有一个 $X = \lbrace 1, 2, \dots, n \rbrace$ 的子集刚好就是 $X' = \lbrace a, x_1, x_2, \dots, x_r, b, y_1, y_2, \dots, y_s \rbrace$，那么 $\gamma$ 可以简写成：

$$
\gamma = \left(\begin{smallmatrix} 
a & x_1 & x_2 & \dots & x_r & b & y_1 & y_2 & \dots & y_s \\
x_1 & x_2 & \dots & x_r & b & y_1 & y_2 & \dots & y_s & a
\end{smallmatrix}\right)
$$

那么 $\tau \gamma$ 就相当于把 $\gamma$ permuate 后的结果里的 $a, b$ 再 swap 一次，于是有：

$$
\tau \gamma = \left(\begin{smallmatrix} 
\vert & a & x_1 & x_2 & \dots & x_r & \vert & b & y_1 & y_2 & \dots & y_s & \vert \\
\vert & x_1 & x_2 & \dots & x_r & a & \vert & y_1 & y_2 & \dots & y_s & b & \vert
\end{smallmatrix}\right)
$$

相当于把 $\gamma$ 切成了两个新的 disjoint cyles

同理，$\gamma \tau$ 相当于先把 $X'$ 里的 $a, b$ swap 之后，再按 $\gamma$ permutate，于是有：

$$
\gamma \tau = \left(\begin{smallmatrix} 
a & x_1 & x_2 & \dots & x_r & b & y_1 & y_2 & \dots & y_s \\
x_1 & x_2 & \dots & x_r & b & y_1 & y_2 & \dots & y_s & a
\end{smallmatrix}\right) \circ \left(\begin{smallmatrix} 
a & x_1 & x_2 & \dots & x_r & b & y_1 & y_2 & \dots & y_s \\
b & x_1 & x_2 & \dots & x_r & a & y_1 & y_2 & \dots & y_s
\end{smallmatrix}\right) = \left(\begin{smallmatrix} 
a & \vert & x_1 & x_2 & \dots & x_r & b & \vert & y_1 & y_2 & \dots & y_s \\
y_1 & \vert & x_2 & \dots & x_r & b & x_1 & \vert &  y_2 & \dots & y_s & a
\end{smallmatrix}\right)
$$

同样也是相当于把 $\gamma$ 切成了两个新的 disjoint cyles

因为 $\tau$ 不会影响其他的 cycle，所以 $\tau \sigma$ 和 $\sigma \tau$ 在这中情况下会有 $n_c + 1$ 个 disjoint cycles

(2) 假设 $a, b$ 处在 $\sigma$ 的两个 cycle 内，假设这两个 cycles 分别为 $\gamma_1 = (a, x_1, x_2, \dots, x_r), \gamma_2 = (b, y_1, y_2, \dots, y_s)$

类似地，有：

$$
\tau (\gamma_1 \gamma_2) = \left(\begin{smallmatrix} 
a & x_1 & x_2 & \dots & x_r & b & y_1 & y_2 & \dots & y_s \\
b & x_1 & x_2 & \dots & x_r & a & y_1 & y_2 & \dots & y_s
\end{smallmatrix}\right) \circ \left(\begin{smallmatrix} 
a & x_1 & x_2 & \dots & x_r & \vert & b & y_1 & y_2 & \dots & y_s \\
x_1 & x_2 & \dots & x_r & a & \vert & y_1 & y_2 & \dots & y_s & b
\end{smallmatrix}\right) = \left(\begin{smallmatrix} 
a & x_1 & x_2 & \dots & x_r & b & y_1 & y_2 & \dots & y_s \\
x_1 & x_2 & \dots & x_r & b & y_1 & y_2 & \dots & y_s & a
\end{smallmatrix}\right)
$$

$$
\begin{aligned}
(\gamma_1 \gamma_2) \tau &= \left(\begin{smallmatrix} 
a & x_1 & x_2 & \dots & x_r & \vert & b & y_1 & y_2 & \dots & y_s \\
x_1 & x_2 & \dots & x_r & a & \vert & y_1 & y_2 & \dots & y_s & b
\end{smallmatrix}\right) \circ \left(\begin{smallmatrix} 
a & x_1 & x_2 & \dots & x_r & b & y_1 & y_2 & \dots & y_s \\
b & x_1 & x_2 & \dots & x_r & a & y_1 & y_2 & \dots & y_s
\end{smallmatrix}\right) = \left(\begin{smallmatrix} 
a & x_1 & x_2 & \dots & x_r & b & y_1 & y_2 & \dots & y_s \\
y_1 & x_2 & \dots & x_r & a & x_1 & y_2 & \dots & y_s & b
\end{smallmatrix}\right) \\
& \overset{\text{重排列一下}}{=} \left(\begin{smallmatrix} 
b & x_1 & x_2 & \dots & x_r & a & y_1 & y_2 & \dots & y_s \\
x_1 & x_2 & \dots & x_r & a & y_1 & y_2 & \dots & y_s & b
\end{smallmatrix}\right)
\end{aligned}
$$

相当于把 $\gamma_1$ 和 $\gamma_2$ 合并成了一个新的大 cyle

因为 $\tau$ 不会影响其他的 cycle，所以 $\tau \sigma$ 和 $\sigma \tau$ 在这中情况下会有 $n_c - 1$ 个 disjoint cycles

### 3.4 Inversions / Parity / Sign of A Permutation

**Definition:** Let $\sigma \in S(X)$ be a permutation. An **inversion** of $\sigma$ is an pair $(i, j) \in X^2$ such that $i < j$ while $\sigma(i) > \sigma(j)$

- 按照这个定义，任意一个 transposition 都算是一个 inversion

**Definition:** Permutaion $\sigma$ is **odd** when its number of inversions, $\operatorname{inv}(\sigma)$, is odd; otherwise **even**

**Definition:** The **sign** of permutation $\sigma$ is the parity of its number of inversions, i.e $\operatorname{sgn}(\sigma) = (-1)^{\operatorname{inv}(\sigma)}$

**Lemma:** $\operatorname{inv}(\sigma) = \operatorname{inv}(\sigma^{-1}), \operatorname{sgn}(\sigma) = \operatorname{sgn}(\sigma^{-1})$

**Lemma:** $\operatorname{inv}(\sigma \tau) \equiv \operatorname{inv}(\sigma) + \operatorname{inv}(\tau) \, (mod \, 2)$

- $a \equiv b \, (mod \, p)$ 表示 `(a - b) % p == 0`

**Lemma:** $\operatorname{sgn}(\sigma \tau) = \operatorname{sgn}(\sigma) \times \operatorname{sgn}(\tau)$

**Lemma:** Suppose there are $N_c$ disjoint cycles, including 1-cycles, in permutation $\sigma \in S_n$, then $\operatorname{sgn}(\sigma) = (-1)^{n - N_c}$

Proof: 根据 transposition decomposition，任意一个 $k$-cycle ($k \geq 2$) 都可以分解成 $k-1$ 个 decompositions，相当于贡献了 $k-1$ 个 inversions

特别地，我们认为 1-cycle 贡献了 0 个 inversion

于是 $\operatorname{inv}(\sigma) = \sum_{i=1}^{N_c} k_i - 1 = n - N_c. \blacksquare$