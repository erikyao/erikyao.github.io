---
title: "LR Parsing #6: Upgrade to LR(1)"
description: ""
category: Compiler
tags: []
toc: true
toc_sticky: true
mermaid: true
---

- Reference: [SLR and LR(1) Parsing](https://web.stanford.edu/class/archive/cs/cs143/cs143.1128/handouts/110%20LR%20and%20SLR%20Parsing.pdf)

Note that an $LR(1)$ parser is often called a **canonical LR parser**. (As opposed to approximations like in $SLR$ or $LALR$? Yes. Because of Knuth is "canonical"? Also yes!)
{: .notice--info}

-----

# 1. Structural Encoding

Following [LR Parsing #2: Structural Encoding of LR(0) Parsing DFA](/compiler/2025/07/18/lr-parsing-2-structural-encoding-of-lr0-parsing-dfa).

## 1.1 $LR(1)$-item $\Rightarrow$ Natural Extension of $LR(0)$-item

|$1$-item|it means we have...|and we expect ...|
|--------|-------------------|-----------------|
|$[A\to \cdot XY, a]$| just begun parsing for $XY$    | to see a string derivable from $XY$ from the input|
|$[A\to X \cdot Y, a]$| seen a string derived from $X$| to see a string derivable from $Y$ from the input|
|$[A\to XY \cdot, a]$| seen a string derived from $XY$| to reduce $XY \rhd A$ now, but only if the next input terminal is $a \in \Sigma$|

## 1.2 Closure of Item Set $\Rightarrow$ Significant Changed!

$$
\begin{align}
&\text{// compute the closure } I' \text{ of item set } I \qquad \newline 
&\textbf{procedure } \mathrm{CLOSURE}^{(1)}(I:\text{Set[Item]}) \text{ -> Set[Item]:} \qquad \newline 
& \qquad I' = I\qquad \newline 
& \qquad \text{repeat until } I' \text{ is not changed} \text{: }\qquad \newline 
& \qquad\qquad\text{for each item } [A \rightarrow \underline\alpha \cdot B \underline\beta, a] \in I' \text{: } \qquad \newline  
& \qquad\qquad\qquad \text{if } \exists (B \rightarrow \underline\gamma) \in P \text{: } \qquad \newline 
& \qquad\qquad\qquad\qquad \text{for each terminal } b \in \operatorname{FIRST}(\underline\beta a) \text{:  // a new for-loop!} \qquad \newline 
& \qquad\qquad\qquad\qquad\qquad I'\text{.add(} [B \rightarrow \cdot \underline\gamma, b] \text{)} \qquad \newline 
& \qquad \text{return } I'
\end{align}
$$

Underlines in $\underline\alpha, \underline\beta, \underline\gamma$ are just for readability here.
{: .notice--info}

- In $LR(0)$, we computed the closure by adding all $B$ productions with no indication of what was expected to follow them.
- In $LR(1)$, we are a little more precise — we add each $B$ production but insist that each have a "lookahead of $\underline\beta a$".
    - More specifically, the lookahead will be a terminal $b \in \operatorname{FIRST}(\underline\beta a)$,
    - since $b$ would be what follows $B$ in this $A \to \underline\alpha B \underline\beta$ production

Recall how to compute $\operatorname{FIRST}(\underline\beta a)$: Suppose $\underline\beta = \overline{x_1 x_2 \dots x_n}$. The result includes $\operatorname{FIRST}(x_1)$ to begin with; if $x_1$ is nullable, the result further includes $\operatorname{FIRST}(x_2)$; ...... ; if the whole $\underline\beta$ is nullable, the result includes $\operatorname{FIRST}(a) = \lbrace a \rbrace$ (since $a \in \Sigma$).
{: .notice--info}

## 1.3 $\operatorname{GOTO}^{(1)}$ $\Rightarrow$ Natural Extension of $LR(0)$'s $\operatorname{GOTO}$

$$
\begin{align}
&\text{// compute the GOTO item set } J \text{ of item set } I \text{ on symbol } X \qquad \newline 
&\textbf{procedure } \mathrm{GOTO}^{(1)}(I:\text{Set[Item]}, X \in V \cup \Sigma) \text{ -> Set[Item]:} \nonumber \qquad \newline 
& \qquad J = \lbrace \rbrace \qquad \newline
& \qquad \text{// dot must preceed } X \text{ and } X \text{ must exist in position}\qquad \newline 
& \qquad \text{for each item } [A \rightarrow \underline\alpha \cdot X \underline\beta, a] \in I \text{: } \qquad \newline 
& \qquad\qquad J\text{. add(} [A \rightarrow \underline\alpha X \cdot \underline\beta, a] \text{)} \qquad \newline 
& \qquad \text{return } \operatorname{CLOSURE}(J)
\end{align}
$$

## 1.4 Canonical Collection of Set of Items $\Rightarrow$ Natural Extension of $LR(0)$'s

$$
\begin{align}
&\text{// compute the canonical collection of item sets for grammar } G' \qquad \newline 
&\textbf{procedure } \mathrm{CC}^{(1)}(G') \text{ -> Set[Set[Item]]:} \nonumber \qquad \newline
& \qquad i = [S' \to \cdot S, \Finv] \quad \text{// initial kernel item from the dummy production } \qquad \newline
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

# 2. Runtime Encoding $\Rightarrow$ Natural Extension of $LR(0)$'s

Following [LR Parsing #4: Runtime Encoding of LR(0)/SLR(1) Parsing DFA (How to Construct the Parsing Tables)](/2025/07/22/lr-parsing-4-runtime-encoding-of-lr0slr1-parsing-dfa).

| **Rule** |**Condition**                                               |**Table Construction**                                             |
|---|------------------------------------------------------------|--------------------------------------------------------------------------|
| 1 |if $\exists a \in \Sigma$ such that $\operatorname{GOTO}(I_i, a) = I_j$ | mark $T_{\operatorname{ACTION}}[i, a] = \text{"shift"}$      |
|   |                                                                        | mark $T_{\operatorname{GOTO}}[i, a] = j$                     |
| 2 |if $\exists A \in V$ such that $\operatorname{GOTO}(I_i, A) = I_j$      | mark $T_{\operatorname{GOTO}}[i, A] = j$                     |
| 3 |if $\exists [S' \to S \cdot, \Finv] \in I_i$                            | mark $T_{\operatorname{ACTION}}[i, \Finv] = \text{"accept"}$ |
| 4 |if $\exists [A \to \underline\alpha \cdot, b] \in I_i$, $A \neq S'$, and $A \to \underline\alpha$ is production $k$ | mark $T_{\operatorname{ACTION}}[i, b] = \text{"reduce k"}$|

# 3. Encoding Comparison

|Structure Encoding                  |$LR(0)$            |$SLR(1)$           |$LR(1)$                                   |
|------------------------------------|-------------------|-------------------|------------------------------------------|
|Item                                | $0$-item          | $0$-item          | $1$-item                                 |
|Closure                             | $\mathrm{CLOSURE}$| $\mathrm{CLOSURE}$| $\textcolor{red}{\mathrm{CLOSURE}^{(1)}}$|
|Transition                          | $\mathrm{GOTO}$   | $\mathrm{GOTO}$   | $\mathrm{GOTO}^{(1)}$                    |
|Canonical Collection of Set of Items| $\mathrm{CC}$     | $\mathrm{CC}$     | $\mathrm{CC}^{(1)}$                      |
|Init Item                           | $[S' \to \cdot S]$| $[S' \to \cdot S]$| $[S' \to \cdot S; \Finv]$                |


| **Runtime Encoding Rule** | **Parser**                     | **Condition**                                                                                | **Table Construction**                                       |
|----------|--------------------------------|----------------------------------------------------------------------------------------------|--------------------------------------------------------------|
| 1        | $LR(0) \mid SLR(1) \mid LR(1)$ | if $\exists a \in \Sigma$ such that $\operatorname{GOTO}(I_i, a) = I_j$                      | mark $T_{\operatorname{ACTION}}[i, a] = \text{"shift"}$      |
|          |                                |                                                                                              | mark $T_{\operatorname{GOTO}}[i, a] = j$                     |
| 2        | $LR(0) \mid SLR(1) \mid LR(1)$ | if $\exists a \in v$ such that $\operatorname{GOTO}(I_i, a) = I_j$                           | mark $T_{\operatorname{GOTO}}[i, a] = j$                     |
| 3        | $LR(0) \mid SLR(1)$            | if $\exists [S' \to S \cdot] \in I_i$                                                        | mark $T_{\operatorname{ACTION}}[i, \Finv] = \text{"accept"}$ |
|          | $LR(1)$                        | if $\exists [S' \to S \cdot, \Finv] \in I_i$                                                 | mark $T_{\operatorname{ACTION}}[i, \Finv] = \text{"accept"}$ |
| 4        | $LR(0)$                        | if $\exists [A \to \alpha \cdot] \in I_i$, $A \neq S'$, and $a \to \alpha$ is production $k$ | $\textcolor{red}{\forall e \in \Sigma \cup \lbrace \Finv \rbrace}$<span style="color:red">, mark</span> $\textcolor{red}{T_{\operatorname{ACTION}}[i, e] = \text{"reduce k"}}$ |
|          | $SLR(1)$                       | if $\exists [A \to \alpha \cdot] \in I_i$, $A \neq S'$, and $a \to \alpha$ is production $k$ | $\textcolor{red}{\forall e \in \operatorname{FOLLOW}(A)}$<span style="color:red">, mark</span> $\textcolor{red}{T_{\operatorname{ACTION}}[i, e] = \text{"reduce k"}}$ |
|          | $LR(1)$                        | if $\exists [A \to \underline\alpha \cdot, b] \in I_i$, $A \neq S'$, and $a \to \underline\alpha$ is production $k$ | <span style="color:red">mark</span> $\textcolor{red}{T_{\operatorname{ACTION}}[i, b] = \text{"reduce k"}}$ |

Fonts in red indicate sigificant differences.
{: .notice--info}
