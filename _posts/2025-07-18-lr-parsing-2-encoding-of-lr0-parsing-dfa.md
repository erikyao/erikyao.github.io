---
title: "LR Parsing #2: Encoding of LR(0) Parsing DFA"
description: ""
category: Compiler
tags: []
toc: true
toc_sticky: true
---

# 0. Overview

Following [LR Parsing #1: Intuition](/compiler/2025/07/17/lr-parsing-1-intuition), our next mission is to build a DFA for LR parsing. Here we start with $LR(0)$. 

We will encounter a somewhat abstract terminology of $LR(0)$ parsing, and their nature is explained below.

|LR Term                               |Data Structure         |Remark                                      |DFA Term                  |
|--------------------------------------|-----------------------|--------------------------------------------|--------------------------|
|$LR(0)$ Item                          | `Item`                | Parsing Checkpoint                         |                          |
|Closure                               | `Set[Item]`         | Parser's State                             | $q$                      |
|$\operatorname{GOTO}$                 | $f: (I\text{: Closure}, X\text{: Symbol}) \mapsto J\text{:Closure}$| State Transition Function                  | $\delta$                 |
|Canonical Collection of Sets of Items | `Set[Closure]`      | State Space                                | $Q$                      |


# 1. Items $\Rightarrow$ Parsing Checkpoint

**Definition:** Let $G=(V,\Sigma,P,S)$ be a grammar. A **position** of $G$ is a dotted rule of the form $A\to X \cdot Y$, where $A \to X Y \in P$ and the dot is a symbol $\not\in V$. $\blacksquare$

**Definition:** A pair of the form $[A\to X \cdot Y, w]$ is a **$LR(k)$-item** (or $k$-item for short) for some $k\geq0$, if:

1. $A \to X \cdot Y$ is a position
2. $w \in \Sigma^{\ast}$ and $\vert w \vert = k$

$\blacksquare$

$0$-items, i.e., items of the form $[A\to X \cdot Y,\varepsilon]$, are often abbreviated to $[A\to X \cdot Y]$.

Intuitively, a $0$-item indicates how much of a production we have seen at a given point in the parsing process. E.g.: 

|$0$-item|it means we have...|and we expect ...|
|--------|-------------------|-----------------|
|$[A\to \cdot XY]$| just begun        | to see a string derivable from $XY$ from the input|
|$[A\to X \cdot Y]$| seen a string derived from $X$| to see a string derivable from $Y$ from the input|
|$[A\to XY \cdot]$| seen a string derived from $XY$| it may be the right time to reduce $XY \rhd A$?|

# 2. Closure of Item Set $\Rightarrow$ Parser's State $q$

We can think this way: all the items under a closure is closed under the relation of "immediate derivability", i.e. if we have an item where the dot precedes a non-terminal, we must include all items representing the possible ways that non-terminal can be derived. (See [Closures of Relations](/math/2024/06/12/closure-math-closures-of-relations#closures-of-relations).)

The algorithm to compute closures is also a fixed-point approach:

$$
\begin{align}
&\text{// compute the closure } I' \text{ of item set } I \qquad \newline 
&\textbf{procedure } \mathrm{CLOSURE}(I:\text{Set[Item]}) \text{ -> Set[Item]:} \qquad \newline 
& \qquad I' = I\qquad \newline 
& \qquad \text{repeat until } I' \text{ is not changed} \text{: }\qquad \newline 
& \qquad\qquad\text{for each item } [A \rightarrow \alpha \cdot B \beta] \in I' \text{: } \qquad \newline  
& \qquad\qquad\qquad \text{if } \exists (B \rightarrow \gamma) \in P \text{: } \qquad \newline 
& \qquad\qquad\qquad\qquad I'\text{.add(} [B \rightarrow \cdot \gamma] \text{)} \qquad \newline 
& \qquad \text{return } I'
\end{align}
$$

We often initialize $I = \lbrace \text{kernel\_item} \rbrace$, and all the other items added to $I$'s closure are often called non-kernel items. The closure represents all possible parsing checkpoints that could occur when we're at the beginning position of the kernel item.

# 3. $\operatorname{GOTO} \Rightarrow$ State Transition Function $\delta$

$\operatorname{GOTO}(I,X)$ is defined to be the closure of the set of all items like $[A \rightarrow \alpha B \cdot \beta]$ such that $[A \rightarrow \alpha \cdot B \beta]$ is in $I$. Intuitively, the $\operatorname{GOTO}$ function is used to define the transitions in the $LR(0)$ automaton for a grammar.

$$
\begin{align}
&\text{// compute the GOTO item set } J \text{ of item set } I \text{ on symbol } X \qquad \newline 
&\textbf{procedure } \mathrm{GOTO}(I:\text{Set[Item]}, X \in V \cup \Sigma) \text{ -> Set[Item]:} \nonumber \qquad \newline 
& \qquad J = \lbrace \rbrace \qquad \newline
& \qquad \text{// dot must preceed } X \text{ and } X \text{ must exist in position}\qquad \newline 
& \qquad \text{for each item } [A \rightarrow \alpha \cdot X \beta] \in I' \text{: } \qquad \newline 
& \qquad\qquad J\text{. add(} [A \rightarrow \alpha X \cdot \beta] \text{)} \qquad \newline 
& \qquad \text{return } \operatorname{CLOSURE}(J)
\end{align}
$$

# 4. Canonical Collection of Set of Items $\Rightarrow$ State Space $Q$

**Definition:** Let $G=(V,\Sigma,P,S)$ be a grammar. **Augmented grammar** $G' = (V \cup \lbrace S' \rbrace, \Sigma, P \cup \lbrace S' \to S \rbrace, S')$. I.e. we add a dummy start symbol $S'$ and a dummy production $S' \to S$ to the original $G$. $\blacksquare$

$$
\begin{align}
&\text{// compute the canonical collection of item sets for grammar } G' \qquad \newline 
&\textbf{procedure } \mathrm{CC}(G') \text{ -> Set[Set[Item]]:} \nonumber \qquad \newline
& \qquad i = [S' \to \cdot S] \quad \text{// initial kernel item from the dummy production } \qquad \newline
& \qquad I = \operatorname{CLOSURE}(\lbrace i \rbrace) \quad \text{// initial item set} \qquad \newline
& \qquad C = \lbrace I \rbrace \quad \text{// initial canonical collection} \qquad \newline
& \qquad \newline
& \qquad \text{repeat until } C \text{ is not changed} \text{: }\qquad \newline 
& \qquad\qquad \text{for each item set } I \in C \text{: } \qquad \newline  
& \qquad\qquad\qquad \text{for each symbol } X \text{: } \qquad \newline
& \qquad\qquad\qquad\qquad J = \operatorname{GOTO}(I, X) \qquad \newline
& \qquad\qquad\qquad\qquad \text{if } J \neq \varnothing \text{: } \qquad \newline 
& \qquad\qquad\qquad\qquad\qquad C\text{. add(} J \text{)} \qquad \newline 
& \qquad \text{return } C
\end{align}
$$

Note the difference between "canonical" and "normal" in English.
{: .notice--info}

|Term|Meaning in Formal Contexts|Translation|
|---|---|---|
|**Canonical**|A **standardized, unique, and complete** form chosen among many possible representations|规范的 / 标准的|
|**Normal**|A **typical or usual** form, possibly one of many|正常的 / 常规的|

Technically, the DFA constructed above misses a dead state for "empty set of items". i.e. there should have existed $\varnothing \in C$. 
{: .notice--warning}