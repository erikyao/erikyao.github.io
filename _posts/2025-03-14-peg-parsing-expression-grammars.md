---
title: "PEG (Parsing Expression Grammars)"
description: ""
category: Compiler
tags: []
toc: true
toc_sticky: true
---

# -1: 写在前面

本文是 [Parsing Expression Grammars: A Recognition-Based Syntactic Foundation](https://pdos.csail.mit.edu/~baford/packrat/popl04/) by Bryan Ford@MIT 的读文笔记。这篇论文佶屈聱牙，我这里用人话总结一下。

另外涉及 TS/TDPL and gTS/GTDPL 的部分这里直接略过，我暂时用不上。这几个缩写的混乱程度一看就知不好惹：

- TS: TMG Recognition Scheme
    - TMG: _TransMoGrifier_, a recursive descent compiler-compiler developed by Robert M. McClure
- TPDL: TopDown Parsing Language
- gTS: generalized TS
- GTPDL: Generalized TDPL

PEG parser 代码可以参考我自己的 [toy_peg_parser](https://github.com/erikyao/toy_peg_parser).

Another reference implementation is [MyTeenyTinyCompiler/parse.py](https://github.com/erikyao/MyTeenyTinyCompiler/blob/main/parse.py), which is inspired by [Let's make a Teeny Tiny compiler](https://austinhenley.com/blog/teenytinycompiler1.html) by [Austin Z. Henley](https://austinhenley.com/blog.html).

# 0. Abstract

The main ideas of PEGs:

- **Solving Ambiguity: PEGs inherently prevent ambiguity by design**.
- **Recognition-Based Nature:** While generative grammars define a language by generating its strings, a recognition-based system like PEGs defines a language through rules or predicates that determine whether a given string is part of the language.
- **Linear-Time Parsing:** A linear-time parser can be built for any PEG.
    - This parsing algorithm is [Packrat Parsing](https://bford.info/pub/lang/packrat-icfp02.pdf)
- **Unified Language Definition:** PEGs allow for a unified description of both lexical and hierarchical syntax within a single grammar.
    - This is a fancy way of saying: **PEGs are stylistically similar to CFGs with RE-like features**.
- **Expressiveness:** PEGs can express all deterministic $LR(k)$ languages and many others, including some non-context-free languages.
- **Backtracking:** The parsing mechanism for PEGs involves backtracking.

# 1. The Chomsky Hierarchy is Generative

论文教的这节历史课还是蛮不错的：

> Chomsky’s **generative** system of grammars, from which the ubiquitous context-free grammars (CFGs) and regular expressions (REs) arise, was originally designed as a formal tool for modelling and analyzing natural (human) languages. Due to their elegance and expressive power, computer scientists adopted generative grammars for describing machine-oriented languages as well. 

这个 "generative" 的 nature 挪用到 programming languages 时还是存在水土不服的：

> The ability of a CFG to express ambiguous syntax is an important and powerful tool for natural languages. Unfortunately, this power gets in the way when we use CFGs for machine-oriented languages that are intended to be precise and unambiguous. Ambiguity in CFGs is difficult to avoid even when we want to, and it makes general CFG parsing an inherently super-linear-time problem.

虽然我们有 DCFG 这个武器，但在 programming language **design** 这个领域，ambiguity 还是很容易被引入的。论文给了几个例子 (但要注意它写于 2004，所以不确定现在的解决方案)：

1. `vector<vector<float>> MyMatrix;` 连续两个 `>` 可能会被识别成 input stream 的 `>>` operator (幽默 C++!)
2. the "dangling ELSE" problem
3. C++ 某些 token sequence 可能同时满足 `<definition>` 和 `<statement>`
4. The syntax of lambda abstractions, `let` expressions, and conditionals in Haskell is **unresolvably** ambiguous in the CFG paradigm.

一般的解决方法有两种 (可以参考 [Appetizer #2 Before Parsing: CFG Disambiguation](/compiler/2025/06/22/appetizer-2-before-parsing-cfg-disambiguation))：

1. **rewrite** your CFG and make it unambiguous
2. **meta-rules**, i.e. 使用人为的 rules 去规定 parsing 的行为

使用 meta-rules 一般是出于迫不得已，比如：(1) rewrite 的工作量太大；(2) 存在 rewrite 也无法解决的情况 (比如 inherently ambiguous)。但 meta-rules 有一个后果就是：你这么搞了以后，你的 grammar 理论上就不再是一个合法的 CFG 了。

> Many sensible syntactic constructs are inherently ambiguous when expressed in a CFG, commonly leading language designers to abandon syntactic formality and rely on informal meta-rules to solve these problems.

上面 4 个例子的解决方案是：

1. workaround: 写成 `vector<vector<float> > MyMatrix;`，加一个空格；或者用 PEG 写法
2. rewrite
3. an informal meta-rule that such a sequence is always interpreted as a `<definition>` if possible
4. an informal "_longest-match_" meta-rule

# 2. PEGs are Recognitive (to some extent) and Unambiguous (100%, by design)

## 2.1 Recognitive

论文的用词是 recognition-based, 我就直接用 recognitive 这个词了。

> Simple languages can be expressed easily in either paradigm.

- Generative: $\lbrace w \in a^* \mid w = (aa)^n \rbrace$
- Recognitive: $\left\lbrace w \in a^* \mid \vert w \vert \mod 2 = 0 \right\rbrace$

文中直接把 PEG 称为 recognition-based, 有点不好理解，我的理解是：recognitive grammar 本意就是 "grammar $G$ can recognize sequence $w$", 所以应该要有某种 "predicate" 能直接判断出是否有 $w \in L$。但其实 PEG 只有两个 **syntactic predicates** `&e`、`!e`，其余的 production/rule 也是形如 `Definition <- Identifier LEFTARROW Expression` 这样 generative 的形式。从 grammar definition 的角度，我觉得称 PEG "有 recognitive 的成分" 是更准确的理解

## 2.2 Unambiguous

**PEGs are unambiguous by design.** 它有这么一些结构能解决 ambiguity 的问题：

1. **Prioritized Choice Operator ($/$):** This operator explicitly tests alternative patterns in order and unconditionally uses the first successful match. This deterministic rule inherently prevents the kind of ambiguity seen in CFGs where multiple alternatives might successfully parse the same input, leading to multiple parse trees.
2. **Greedy Repetition Operators ($?, \ast, +$):** Work like "_longest-match_" meta-rule
3. **Syntactic Predicates ($\&e, !e$):** Enable explicit control over parsing behavior.

正式的证明其实隐藏在 Section 3.3 中的一个 theorem：

**Theorem:** : If $(e,x) \Rightarrow (n_1,o_1)$ and $(e,x) \Rightarrow (n_2,o_2)$, then $n_1 = n_2$
and $o_1 = o_2$. That is, the relation $\Rightarrow_{G}$ is a function. $\blacksquare$

我们先不管这些符号是什么意思。这个 theorem 的意思就是：**for any given parsing expression $e$ and input string $x$, there is only one unique outcome**.

This functional property means that a PEG will always yield a single, unique parse result (or failure) for any given input, **making it inherently unambiguous**.

# 3. Formal Definition of PEGs

## 3.1 Grammars

**Definition:** A **parsing expression grammar** (PEG) is a 4-tuple $G = (V_N,V_T,R,e_S)$, where:

- $V_N$ is a finite set of nonterminal symbols
- $V_T$ is a finite set of terminal symbols
    - $V_N \cap V_T = \varnothing$
- $R$ is a finite set of rules
    - Each rule $r \in R$ is like $A \gets e$ where $A \in V_N$ and $e$ is a **parsing expression**. 
- $e_S$ is the start parsing expression 

$\blacksquare$

## 3.2 Parsing Expressions

在 PEG 的 context 下，我们一般也把 parsing expression 简称为 expression. 假设我们把 expression 的集合记做 $E(G)$.

**Definition:** We define **parsing expressions** _inductively_ as follows:

1. $\varepsilon \in E(G)$
2. $\forall a \in V_T, a \in E(G)$ 
3. $\forall A \in V_N, A \in E(G)$
4. If both $e_1, e_2 \in E(G)$, then the sequence $e_1 e_2 \in E(G)$
5. If both $e_1, e_2 \in E(G)$, then the prioritized choice $e_1 / e_2 \in E(G)$
6. If $e \in E(G)$, then the zero-or-more repetition $e^\ast \in P_E$
7. If $e \in E(G)$, then the $\operatorname{not}$-predicate $!e \in P_E$

$\blacksquare$

我觉得 parsing expression 这个概念提出来也是蛮没有必要的，它本质就是 "合法的 RHS"。比如上述第 5 点：如果 $e_1$ 和 $e_2$ 都是 "合法的 RHS"，那么 $e_1 / e_2$ 也是一个 "合法的 RHS"
{: .notice--info}

基于上述定义，我们可以扩展得到：

1. character class (我不明白它为啥不叫 terminal class) $[a_1 a_2 \dots a_n]$, where $\forall a_i \in V_T$, after expanding the range, is equivalent to $a_1 / a_2 / \dots / a_n$
    - $.$ is a character class containing all the terminals in $V_T$
2. option $e?$ is equivalent to $e / \varepsilon$
3. one-or-more repetition $e^+$ is equivalent to $e e^\ast$
4. $\operatorname{and}$-predicate $\&e$ is equivalent to $!(!e)$

**Definition:** Expression set $E(G)$ of PEG $G$ is the set containing:

1. the start expression $e_S$,
2. all expressions used in all rules, and
3. all sub-expressions of those expressions

$\blacksquare$

文中很神奇地没有定义什么叫做 "sub-expression", 只是举了个例子：如果 $e_1 / e_2$ 是 expression，那么 $e_1$ 和 $e_2$ 就是它的 sub-expressions.
{: .notice--info}

## 3.3 Rules

**Axiom:** $\forall A \in V_N$, there is exactly one $e$ such that $A \gets e \in R$. 

**Lemma**: Therefore $R: V_N \to E(G)$ is a function from nonterminals to expressions, and we can write $R(A) = e$ such that $A \gets e \in R$.

## 3.4 Parsing / Reduction / Recognition

文中没有 formally 定义 derivation，而是 formally 定义了 recognition，本质就是 parsing/reduction 的过程。

我觉得它的符号设计有点烂，我这里就不搬运了，可以直接看文章 _3.3 Interpretation of a Grammar_。

这里我就简单说一下 PEG 几个特殊的 reduction 规则。

### 3.4.1 $e_1 / e_2$ 与 backtracking

Prioritized choice $e_1 / e_2 / \dots / e_n$ 的 matching 规则是：

1. 首先 match $e_1$ (即看 $w \in V_T^*$ 能否 reduce 到 $e_1$)，若不能 match，再去 match $e_2$，依此类推
2. 如果某个 $e_i$ match 成功，那么直接 `break`，整个 matching 结束，后续的 $e_{i+1} / \dots / e_n$ 都不会被考虑

这里 "再去 match $e_2$" 就会涉及到 backtracking 操作：

> The choice expression $e_1 / e_2$ first attempts pattern $e_1$, then attempts $e_2$ **from the same starting point** if $e_1$ fails.

这个 "from the same starting point" 要求 parser 需要 **backtrack**，即回退到 parsing 起始的位置，再去 match $e_2$。

我们在 $LL(1)$ parser 中是看不到这种 backtrack 操作的，所以这也解释了某些地方会把 "lookahead $k$" 和 "是否有 backtracking" 作为 parser 的两种特征，比如：

> In addition, many practical top-down parsing libraries and toolkits, including the popular ANTLR and the PARSEC combinator library for Haskell, provide backtracking capabilities that conform to this model in practice, if perhaps unintentionally.

### 3.4.2 $e_1 e_2$ 与 backtracking

Sequence $e_1 e_2 \dots e_n$ 的 matching 规则比较直接：如果 $e_1$ match，那么就继续 match $e_2$，依此类推。

只考虑两个 sub-expressions，即 $e_1 e_2$ 时，match 失败的情况有两种：

1. $e_1$ match 失败
2. $e_1$ match 成功，但 $e_2$ match 失败

这两种情况下，parser 都需要 backtrack 到 parsing $e_1$ 起始的位置。

### 3.4.3 $\&e$、$!e$ 与 backtracking

这俩 predicates 的 backtracking 你可以有两种理解方式：

1. 它们 match 成功后 (或者说 unconditionally，即无论 match 成功、失败) 都要 backtracks to the starting point
2. 或者说：它们只 match 但不 consume token

举几个例子：

- `EndOfFile <- !.` 表示 EOF 不能是任何字符
- `Primary <- Identifier !LEFTARROW` 表示 `Primary` 可以是一个 `Identifier`，但这个 `Identifier` 后面不能接一个 `<`
    - 即排除 `x <- y` 这种类似 assignment 的形式
    - parser match 到 `Identifier` 之后，需要在确定后面没有 `<` 之后，才能做 reduction `Identifier -> Primary`
- `A <- "foo" &("bar")` 表示 `A` 能 match `"foobar"` 中的 `"foo"`

### 3.4.4 Greedy $e?$, $e^\ast$, and $e^+$

> The $?$, $\ast$, and $+$ operators behave as in common regular expression syntax, except that they are "greedy" rather than nondeterministic. The option expression $e?$ unconditionally "consumes" the text matched by $e$ if $e$ succeeds, and the repetition expressions $e^\ast$ and $e^+$ always consume as many successive matches of $e$ as possible. The expression $a^\ast a$ for example can never match any string. Longest-match parsing is almost always the desired behavior where options or repetition occur in practical machine-oriented languages. Many forms of non-greedy behavior are still available in PEGs when desired, however, through the use of predicates.

这个特性就完美替代了 [1. The Chomsky Hierarchy is Generative](#1-the-chomsky-hierarchy-is-generative) 中提到的 "longest match" 的 meta-rule

### 3.4.5 Quirk: Match 和 Fail 的中间态

这一节还是得用文章 _3.3 Interpretation of a Grammar_ 的符号，有点痛苦。

我们规定 $(e, w) \Rightarrow^+ w'$ 的意思是：

- $e$ is a parsing expression (to start with in the parsing/recognition process)
- $w \in V_T^*$ is the input text/string to be parsed/recognized
- $w' \in V_T^*$ is a substring of $w$ that is successfully matched and consumed in the parsing/recognition process
- 合起来的意思就是：我们要 parse $w$，选择的初始 expression 是 $e$，经过一步或多步 (可能还用到了其他的 expression)，最终成功 match 了 $w$ 中的 $w'$ 部分，$w'$ 后面的部分待续

我们规定 $(e, w) \Rightarrow^+ \Finv$ 的意思是：

- $\Finv$ is a special symbol that indicates failure
- 我们要 parse $w \in V_N^*$，选择的初始 expression 是 $e$，但是 matching 失败
- I.e. $\not \exists w'$ such that $(e, w) \Rightarrow^+ w'$

**Definition:** 

- If $\exists w' \in V_T^*$ that $(e, w) \Rightarrow^+ w'$, we say that $e$ **matches** $w$ in $G$
- If $(e, w) \Rightarrow^+ \Finv$, we say that $e$ **fails on** $x$ in $G$
- **Match set** of expression $e$ in $G$ is defined as $M_G(e) = \lbrace w \mid e \text{ matches } w 
\text{ in } G \rbrace$

$\blacksquare$

**Definition:**

- If expression $e$ either matches or fails on a string $w \in V_T^*$, we say $e$ **handles** $w$ 
- If grammar $G$'s start expression $e_S$ handles $w$, we say $G$ **handles** $w$
- $G$ is **complete** if it handles $\forall w \in V_T^*$

$\blacksquare$

这里就有一个疑问：从 "handle" 的定义来看，似乎存在 "neither matches nor fails on $w$" 的情况？的确是有的，但更容易理解的说法是 "matching will never terminate"，本质是因为存在 grammar 有 "无限递归" 的毛病。如 [GRAMMAR::PEG(N) 0.1 "Grammar operations and usage"](https://nnsa.dl.ac.uk/MIDAS/manual/ActiveTcl8.5.7.0.290198-html/tcllib/grammar_peg/peg.html) 所说：

> A grammar is **wellformed** if it is **not left-recursive**. Such grammars are also **complete**, which means that they always succeed or fail on all input sentences. For an **incomplete** grammar on the other hand, input sentences exist for which an attempt to match them against the grammar will not terminate.

可以参考 [Appetizer #3 Before Parsing: Eliminating Left Recursions](/compiler/2025/06/23/appetizer-3-before-parsing-eliminating-left-recursions)
{: .notice--info}

注意前面 [3.4.4 Greedy $e?$, $e^\ast$, and $e^+$](#344-greedy-e-e-and-e) 中的例子：expression $e = a^*a$ 去 match input like $aaa$：由于 greedy 特性，这个 matching 应该判定为 failure 而不是 never terminate
{: .notice--info}

# 4. PELs

证明部分我略过了，需要时直接看原文。

**Definition:** The language of a PEG $G = (V_N,V_T,R,e_S)$ is defined as $L(G) = \lbrace x \in V_T^* \mid e_S \text{ matches } x \rbrace$. $\blacksquare$

Note that:

> ... $e_S$ only needs to succeed on input string $x$ for $x$ to be included in $L(G)$; $e_S$ **need not consume all** of string $x$... This definition contrasts with TS and gTS, in which partially consumed input strings are excluded from the language and classified as _partial-acceptance failures_.

**Definition:** A language $L$ over an alphabet $V_T$ is a parsing expression language (**PEL**) $\iff$ $\exists$ PEG $G$ whose language is $L$. $\blacksquare$

**Theorem:** The class of PELs is closed under union, intersection, and complement. $\blacksquare$

**Theorem:** The class of PELs includes (some) non-context-free languages. $\blacksquare$

{% capture notice-text %}
无法相信作者在文中没有标定是 "includes some" 还是 "includes all"！根据 [Computational Model for Parsing Expression Grammars](https://arxiv.org/abs/2406.14911): 

> From the 60's it is known that PELs contain DCFLs as a subclass and some non-context-free languages like $a^nb^nc^n$ as well.
{% endcapture %}

<div class="notice--danger">
  <h4 class="no_toc"></h4>
  {{ notice-text | markdownify }}
</div>

**Theorem:** Given an arbitrary PEG $G$, it's generally undecidable whether its language $L(G)$ is empty. $\blacksquare$