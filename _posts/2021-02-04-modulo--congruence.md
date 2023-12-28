---
category: Math
description: ''
tags: []
title: Modulo / Congruence
---

本来挺简单的概念，但是因为英语的用词非常地迷惑，所以搞得有点难懂。

## 基本概念

首先复习一下：

- $a \div b$ 这个操作中，$a$ 是被除数 (**dividend**)，$b$ 是除数 (**divisor**)
- $a \bmod b$ 这个操作中，$a$ 不知道叫啥，$b$ 是 **modulus**
  - modulus 还有个意思是指 complex number 的模 (abs value)

然后学习一下 modulo 这个词：它本身竟然是个介词……

- modulo: _preposition_. (in number theory) with respect to a modulus of 
  - 所以 "modulo $n$" 的意思就是 "w.r.t. modulus $n$"

顺便讲一下 **congruence**。如果 $a \bmod n = b \bmod n$，那么我们称：

- $a$ is congruent to $b$ modulo $n$
  - 你知道 modulo 是个介词之后就不会把这里的 "$b$ modulo $n$" 理解成 "$b \bmod n$" 了
- $a$ and $b$ are congruent (to each other) modulo $n$

写作：

$$
a \equiv b \pmod{n}
$$

- 这里用括号就是为了防止歧义

推论：如果 $a \equiv b \pmod{n}$，那么 $\vert a - b \vert \bmod n = 0$，i.e. $\vert a - b \vert \equiv 0 \pmod{n}$

## 迷惑用词一：Modulo Operation

$a \bmod b$ 这个操作叫 modulo operation，虽然你 modulo 是个介词……我就当你是扩展了语义吧

## 迷惑用词二: $a \operatorname{modulo} b$

有的地方会用 $a \operatorname{modulo} b$ 指代 $a \bmod b$，随你便吧……

## 迷惑用词三：Remainder

这个其实不是 modulo 的锅，要怪就怪某些程序语言重新发明了 remainder 这个词。

$a \div b$ 除法运算得到的余数我们称为 remainder (也有叫 residue 的)，那 $a \bmod b$ 的值我们称为什么？其实也可以叫 remainder。

- 题外话：严格来说，按 [Wikipedia: Modulo Operation](https://en.wikipedia.org/wiki/Modulo_operation#Variants_of_the_definition) 的说法，$a \bmod b$ 的值是被 remainder 代表的一个 equivalence class 

> In mathematics, the result of the modulo operation is an equivalence class, and any member of the class may be chosen as representative; however, the usual representative is the **least positive residue**, the smallest non-negative integer that belongs to that class (i.e., the remainder of the Euclidean division)

- 假设 $a \bmod b = r$，那么这个 equivalence class 相当于 $\lbrace \dots, r - 2b, r-b, r, r+b, r+2b, \dots \rbrace$

**Euclid's Division Lemma:** Given two integers $a$ and b, with $b \neq 0$, there exist unique integers $q$ and $r$ such that $a = bq + r$ and $0 \leq r < \vert b \vert$, where $\vert b \vert$ denotes the absolute value of $b$.

可以看出，**若严格遵守欧拉的定义，remainder 一定是非负的**，这个定义对 $a \div b$ 和 $a \bmod b$ 都成立。

但是，有些程序语言在定义 remainder 的时候并没有严格遵守欧拉的定义，这和它们对整数除法的实现是相关的。整数除法在不能整除的时候，需要做一个抉择就是 truncation。举个例子：

- $7 \div 2 = 3.5$，但是 python 里 `7 // 2 == 3`，我们称 truncate towards $0$ (把 3.5 truncate 到 3) (考虑 x-axis 上的移动方向)
- $7 \div (-2) = -3.5$，但是 python 里 `7 // -2 == -4`，我们称 truncate towards $-\infty$

但是，有些语言在计算 `7 // -2` 时会 truncate 成 `-3`，所以不同的 truncation 会得到不同的 quotient，自然会得到不同的 "remainder"。比如对 $7 \div (-2)$，remainder 的值为 $r = 7 + 2q$:

- 当 $q = -3$ 时，$r = 1$，符合欧拉定义
- 当 $q = -4$ 时，$r = -1$，虽然不符合欧拉定义，但也被叫做 remainder

但如果是 $-7 \div 2$，remainder 的值为 $r = -7 - 2q$:

- 当 $q = -3$ 时，$r = -1$，它又不符合欧拉定义了
- 当 $q = -4$ 时，$r = 1$，这个反而对了

可见必须把 truncate towards $0$ 和 truncate towards $-\infty$ 结合起来用才能得到正确的 remainder.

## 迷惑用词四：Modulus Operator & Remainder Operator

有的语言会把 modulo operation 的操作符叫 modulus operator……你高兴就好。

然后有的程序语言还会单独推出所谓的 remainder operator，执行的是它们自己定义的 remainder 计算方法。这么搞的目的明显是为了区分这两个操作，也是从侧面告诉了用户在这门语言里 remainder 的计算可能和你想得不一样。

但更常见的应该是只有一种操作符。我现在明白，不管程序语言叫它 modulus operator 还是 remainder operator，你都不能 assume 它是严格执行欧拉定义的计算。