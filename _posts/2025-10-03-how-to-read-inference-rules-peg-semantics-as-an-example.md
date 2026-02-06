---
title: "How to Read Inference Rules: PEG Semantics as an Example"
description: ""
category: Compiler
tags: []
toc: true
toc_sticky: true
---

# O. Intro

I came across this figure in the paper of [_Medeiros, Mascarenhas, and Ierusalimschy (2014)_](https://www.sciencedirect.com/science/article/pii/S0167642314000288):

![](/assets/posts/2025-10-03-how-to-read-inference-rules-peg-semantics-as-an-example/inference-rules.jpg)

These are **inference rules**, the building blocks of **operational semantics**. They look intimidating at first, but once you know how to read them, they tell you precisely how a language construct behaves.

# 1. Inference Rules

Each **rule** is a formal inference step of the form:

$$
\frac{\text{premises}}{\text{conclusion}} (\textbf{rule name})
$$

which simply means: 

> If $\text{premises}$ hold, then $\text{conclusion}$ holds.

If $\text{premises}$ is empty or null, then $\text{conclusion}$ holds unconditionally.

# 2. Judgments

Each $\overset{\text{PEG}}{\leadsto}$ indicates a **judgment**, which explains, e.g.

$$
G[e] \; x \overset{\text{PEG}}{\leadsto} (x', r)
$$

as:

> Under grammar $G$ and PEG semantics, applying parsing expression $e$ to input string $x$ yields result $r$, leaving $x'$ as the unconsumed suffix of $x$.

# 3. Example: $\textbf{Choice}$

$\textbf{Choice}$ semantics
: $\textbf{ord.1}$: if expression $p_1$ succeeds in parsing input $xy$ (in our cases, into $(y, x')$), then expression $p_1/p_2$ succeeds as $p_1$ does
: $\textbf{ord.2}$: if both $p_1$ and $p_2$ fail at parsing input $xy$, then expression $p_1/p_2$ fails as well
: $\textbf{ord.3}$: if expression $p_1$ fails at parsing input $xy$ but $p_2$ succeeds, then expression $p_1/p_2$ succeeds as $p_2$ does