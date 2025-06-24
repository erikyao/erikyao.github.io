---
title: "Appetizer #3 Before Parsing: Eliminating Left Recursions"
description: ""
category: Compiler
tags: []
toc: true
toc_sticky: true
---

# Definition

<div class="notice--info" markdown="1">
Why eliminate?

Top-down parsing methods cannot handle left-recursive grammars. It causes endless recursive calls.
</div>

**Definition:** A grammar $G=(V, T, S, P)$ is left-recursive $\iff$ $\exists A \in V$  such that $\exists$  a derivation $A \overset{+}{\Rightarrow} A \alpha$, where $\alpha \in (V \cup T)^*$. $\blacksquare$

# Eliminating Direct Left Recursion

Consider the easiest case:

$$
A \to A \alpha \mid \beta
$$

where $\alpha, \beta \in (V \cup T)^*$ and $\beta$ does not begin with $A$. 

It can be rewritten to:

$$
\begin{align}
A & \to \beta A' \newline
A' & \to \alpha A' \mid \varepsilon
\end{align}
$$

and done! The rewriting simply converts left recursion to right recursion.

<div class="notice--info" markdown="1">
If you don't like introducing a $\varepsilon$-production, rewrite this way:

$$
\begin{align}
A & \to \beta \mid \beta A' \newline
A' & \to \alpha \mid \alpha A'
\end{align}
$$
</div>

If we have more productions like:

$$
A \to A \alpha_1 \mid A \alpha_2 \mid \cdots \mid A \alpha_m \mid \beta_1 \mid \beta_2 \mid \cdots \mid \beta_n
$$

where  $\forall \alpha_i, \forall \beta_j \in (V \cup T)^*$, and $\forall \beta_j$ does not begin with $A$, we can rewrite the same way:

$$
\begin{align}
A & \to \beta_1 A' \mid \beta_2 A' \mid \cdots \mid \beta_n A' \newline
A' & \to \alpha_1 A' \mid \alpha_2 A' \mid \cdots \mid \alpha_m A' \mid \varepsilon
\end{align}
$$

<div class="notice--info" markdown="1">
If you don't like introducing a $\varepsilon$-production, rewrite this way:

$$
\begin{align}
A & \to \beta_1 \mid \beta_2 \mid \cdots \mid \beta_n \mid \beta_1 A' \mid \beta_2 A' \mid \cdots \mid \beta_n A' \newline
A' & \to \alpha_1 \mid \alpha_2 \mid \cdots \mid \alpha_m \mid \alpha_1 A' \mid \alpha_2 A' \mid \cdots \mid \alpha_m A'
\end{align}
$$
</div>

# Eliminating Indirect Left Recursion

Indirect left recursion involves multiple derivation steps, like $\begin{cases} A \to BC \newline B \to AD \end{cases} \,$ which essentially leads to $A \to ADC$.

**Intuition:** If we know there would be an indirect left recursion $A \overset{+}{\Rightarrow} A \alpha$, we can repeatedly substitute the leftmost variable $B$ in production $A \to B\beta$ until it becomes a direct left recursion.

**Problem:** How do we find such variable $A$ that is bound to an indirect left recursion? It' simply not practical to try all variables in $V$.

**Method #1:** VDG (Variable Dependency Graph) on LHS variables and leftmost variables on RHS. E.g. draw an edge $A \to B$ if $\exists (A \to B \beta) \in P$. If vertex $A$ has a loop in VDG, then it has an indirect left recursion.

**Method #2:** Variable Relabeling;

1. Relabel the variables in some order $A_1, A_2, \dots, A_n$. Any order should work, but the naive one (left-to-right in any single production, top-down in the production list) is the most straightforward.
2. If there is an indirect left recursion, it must be like $\begin{cases} A_i \to A_j \alpha \newline A_j \to A_i \beta \end{cases} \;$ (or more productions involved, depending on the length of the $A_i$-loop in VDG described above).
3. Therefore whenever we see a production $A_j \to A_i \beta$ where $j > i$, it is **possible** that $A_i$ has an indirect left recursion.
    - We say "possible" because there might be no $A_i \leadsto A_j$ path in the VDG to begin with.
 
$\blacksquare$

However anyway we can just substitute $A_i$ in such $A_j \to A_i \beta$ productions where $j > i$. It suffices to break any $A_i$-loop (if exists) in the VDG.

In the Dragon Book we have the following algorithm:

![[CFG-Elimiate-Left-Recursion-Alg.png|600]]

Note that it uses subscripts $i,j$ the other way, where $j < i$ is guaranteed in the double for-loops.
{: .notice--info}