---
title: "Appetizer #4 Before Parsing: Left Factoring"
description: ""
category: Compiler
tags: []
toc: false
toc_sticky: false
---

# Why factor?

Left factoring is a way to rewrite a CFG which further enables easier implementation of top-down parsing.

In general, if $A \to \alpha \beta_1 \mid \alpha \beta_2$ are two $A$-productions, and the input begins with $\alpha$, we won't know whether to expand $A$ to $\alpha \beta_1$ or $\alpha \beta_2$ unless we have an $LL(\vert \alpha \vert + 1)$ parser.

Left factoring rewrites the two $A$-productions into:

$$
\begin{align}
A & \to \alpha A' \newline
A' & \to \beta_1 \mid \beta_2
\end{align}
$$

and if we can choose between $\beta_1$ and $\beta_2$ by, say an $LL(1)$ parser, we are on the right track. 

That is to say, left factoring transforms a grammar into one more suitable for $LL(k)$ parsing with smaller $k$.

# Algorithm

For each variable $A$, find the longest prefix $\alpha \neq \varepsilon$ common to two or more of $A$'s alternatives. Replace all of the $A$-productions $A \to \alpha \beta_1 \mid \alpha \beta_2 \mid \cdots \mid \alpha \beta_n \mid \gamma \mid \dots$, by

$$
\begin{align}
A & \to \alpha A' \mid \gamma \mid \cdots\newline
A' & \to \beta_1 \mid \beta_2 \mid \cdots \mid \beta_n 
\end{align}
$$

$\blacksquare$