---
layout: post
title: "What does context-free mean in CFLs?"
description: ""
category: Compiler
tags: [context-free,Chomsky]
---
{% include JB/setup %}

这真的是困扰了我很多年的问题，而且我发现这还不是中文教材的锅，老外的很多教材也是上来就 CFL，也不告诉你这个 context 到底是啥 context，这个 free 是怎么个 free 法。我就纳闷了，多讲这么几句怎么就这么难呢……

这个问题，还是得看 Stack Overflow，金牌答案是：[Doval on What does "context-free" mean in the term "context-free grammar"?](https://softwareengineering.stackexchange.com/a/253459)简单说就是：

> It means all of its production rules have a single non-terminal on their left hand side.

比如一个极端的例子：

$$
S \rightarrow aa | bb
$$

与 CFL 对应的是 context-sensitive language (CSL)，它可能存在这样的 production rules：

$$
\begin{aligned}
aS & \rightarrow aa \newline
bS & \rightarrow bb
\end{aligned}
$$

non-terminal $S$ 可能 derive 出 $a$ 或者 $b$，但是 $S$ 的 derivation 具体要看 $S$ 前面是 terminal $a$ 还是 terminal $b$。这个 $S$ 前面的 terminal 就是 $S$ 的 context。或者我觉得叫 "conditional derivation" 也是好理解的。

P.S. 我就没遇到一本教材有提 CSL 的，这对比一下不是很利于理解么……怎么就这么难呢！

问题下面还有一位 [Basile Starynkevitch 的 comment](https://softwareengineering.stackexchange.com/questions/253454/what-does-context-free-mean-in-the-term-context-free-grammar#comment509884_253454)，提到了 [Chomsky hierarchy](https://en.wikipedia.org/wiki/Chomsky_hierarchy)，哪天需要重学 Languages vs Automation 的时候可以参考下。这张表和这个图在教材里竟然看不到我也是不理解……

![](https://live.staticflickr.com/65535/51425997109_d3ea5fb038_k_d.jpg)