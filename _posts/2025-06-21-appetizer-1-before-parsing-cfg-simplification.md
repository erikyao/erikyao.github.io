---
title: "Appetizer #1 Before Parsing: CFG Simplification"
description: ""
category: Compiler
tags: []
toc: true
toc_sticky: true
---

# 0. Overview

为什么需要化简？为提高编译器的执行效率。比如提高 "判定 $w \overset{?}{\in} L$" 的效率。因为同一个 language $L$ 可以有多种 grammar $G$，它们是有 "复杂程度"、"冗余度" 上的区分的。比如 $C \rightarrow D, D \rightarrow \varepsilon$ 就是很冗余，你需要额外 lookup & apply 一次 production.
{: .notice--info}

Types of Redundancy：

1. $\varepsilon$-productions，i.e. 形如 $A \rightarrow \varepsilon$ 的产生式
    - 会得到语言 $L− \lbrace \varepsilon \rbrace$
2. unit productions (单元产生式)，i.e. 形如 $A \rightarrow B$ 的产生式
3. useless productions (无用产生式)，i.e. 对文法定义语言没有贡献的产生式，分两类：
    1. non-reachable productions 
        - 比如 $\begin{cases} S \to A \mid B \newline C \to c \end{cases}$，这个 $C \to c$  不可能被 $S$ 触及，属于 non-reachable
    2. non-generating productions
        - 比如 $\begin{cases} S \to A \mid B \newline A \to aA \end{cases}$，这个 $A \to aA$  不可能终结，属于 non-generating

工程中做 simplification 的可靠顺序是：

1. Eliminate $\varepsilon$-productions
2. Eliminate unit productions
3. Eliminate non-generating productions
4. Eliminate non-reachable productions

# 1. Eliminate $\varepsilon$-productions

如果有一个 CFG $G$ 和它的 CFL $L$，消除 $\varepsilon$-productions 之后会得到一个新的 CFG $G'$ 和新的 CFL $L' = L− \lbrace \varepsilon \rbrace$.

你也可以选择在 $L'$ 中保留 $\varepsilon$. 如果你需要这么做，可以在 $G'$ 保留一个 $S \to \varepsilon$.
{: .notice--info}

**Dummy Start Symbol:** 工程中还有一个 preprocessing practice 是给 $G$ 加一个 dummy production $S_0 \to S$，目的是 "确保 start symbol 不会出现在 production 的 body (i.e. RHS) 中"。因为如果你允许 $S \to \varepsilon$ 并同时有 $A \to S$ 时，会 imply $A \to \varepsilon$，工程上处理起来不是很清爽。我个人认为即时你没有允许 $S \to \varepsilon$，这个 preprocessing 也是个 good practice.
{: .notice--info}

**Procedure:**

1. Eliminate all $A \to \varepsilon$ production from $P$ (可以允许 $A = S$，也可以要求 $A \neq S$，看你需求)
2. 如果你消除了一个具体的 $A \to \varepsilon$，然后有 $B \to \beta A \gamma$：
    - 你可能原来是 $A \to \varepsilon \mid \alpha$，你消除了 $A \to \varepsilon$ 但仍然有 $A \to \alpha$，所以你不能直接把 $B \to \beta A \gamma$ 中的 $A$ 直接删掉
    - 如果原来就只有 $A \to \varepsilon$，你是可以直接把 $B \to \beta A \gamma$ 中的 $A$ 直接删掉，但记住我们后面还有 ”消除 non-generating symbols“ 的步骤，所以你保留 $B \to \beta A \gamma$ 中的 $A$ 也是 ok 的
    - 以上两种情况，有一个统一的解决方案就是：把 $B \to \beta A \gamma$ 改写成 $B \to \beta A \gamma \mid \beta\gamma$
    - 归纳一下就是：$\forall$ occurrence of $A$ on the body of a production rule, add a new rule to $P$ with that occurrence of $A$ deleted.
    - 一个更复杂的例子是：$B \to \beta A \gamma A \theta$，它要改写成 $B \to \beta A \gamma A \theta \mid \beta \gamma A \theta \mid \beta A \gamma \theta \mid \beta \gamma \theta$
3. 如果你消除了一个具体的 $A \to \varepsilon$，然后有 $B \to A$，可以改写成 $B \to A \mid \varepsilon$
    - 是的，这里你有引入了一个新的 $B \to \varepsilon$，但我们可以 repeatedly 继续 eliminate
4. Repeat step 1~3 直到所有的 $\varepsilon$-production 都被消除

# 2. Eliminate unit productions

**Procedure:**

1. Eliminate all $A \to B$ production from $P$
2. 如果你消除了一个具体的 $A \to B$，然后有 $B \to \beta$：可以直接添加一条 $A \to \beta$ 到 $P$
3. Repeat step 1~2 直到所有的 unit-production 都被消除

# 3. Eliminate useless productions

**Procedure:** Remove non-generating productions

1. 初始化 $V_1 = \varnothing$ 
2. Repeat until no more variables are added: 
    - $\forall A \in V$ with $A \to x_1 x_2 \cdots x_n$ where $x_i \in (T^* \cup V_1)$, add $A$ to $V_1$
    - $V_1$ becomes the set of generating variables
3. Define $P_1 = \{p \mid p \in P \text{ and } p.rhs \in (T \cup V_1)^* \}$ 
    - $P_1$ is the set of generating productions

$\blacksquare$ 

The grammar $G_1 = (V_1, T, S, P_1)$ is fully generating. 

**Definition:** **VDG (Variable Dependency Graph)**, on a given Grammar $G=(V, T, S, P)$ can be constructed like below:

1. For each variable $A \in V$, draw a vertex
2. For each production $A \to xBy \in P$, draw an edge $A \leadsto B$

$\blacksquare$ 

**Procedure:** Remove non-reachable productions (by VDG):

1. Construct a VDG $\mathcal{G} = (V_1, E_?)$ for the generating grammar $G_1 = (V_1, T, S, P_1)$
2. Find all variable $A \in V_1$ that has no $S \leadsto A$ path
    - DFS or BFS
    - 注意是这里要求的是 directed path
3. Remove such $A$ from $V_1$, get $V_2$
4. Remove production from $P_1$ whose LHS is such an $A$, get $P_2$

$\blacksquare$ 

The grammar $G_2 = (V_2, T, S, P_2)$ has no useless productions. 

此时 $T$ 中可能有 unreachable 的 terminal，可能需要额外扫描一遍 $P_2$ 来确定。
{: .notice--danger}