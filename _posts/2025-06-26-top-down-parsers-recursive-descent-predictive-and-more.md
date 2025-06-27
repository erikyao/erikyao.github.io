---
title: "Top Down Parsers: Recursive Descent, Predictive, and More"
description: ""
category: Compiler
tags: []
toc: true
toc_sticky: true
---

# 1. "Recursive Descent" and "Predictive" are just 2 implementation mechanisims of top-down parsers

Let:

- $\mathcal{P}$ be the set of all predictive parsers
- $\mathcal{Q}$ be the set of all recursive descent parsers
- $\Delta$ be the set of all top-down parsers

Informally we have the following relationship:

- $\mathcal{P} \subset \Delta$
- $\mathcal{Q} \subset \Delta$
- $\mathcal{P} \cap \mathcal{Q} \neq \varnothing$
- $\mathcal{P} \not \subset \mathcal{Q}$
- $\mathcal{Q} \not \subset \mathcal{P}$

Informally we can define like:

$$
\begin{aligned}
\mathcal{P} &= \lbrace p \in \Delta \mid p \text{ deterministically picks a production for derivation in each step} \rbrace \newline
\mathcal{P}^\complement &= \lbrace p \in \Delta \mid p \text{ undeterministically picks a production, backtracking if failed} \rbrace \newline
\mathcal{Q} &= \lbrace p \in \Delta \mid p \text{ calls procedure } A() \text{, which recusively calls } X_1(), \dots, X_n() \text{, if production } A \to X_1 \dots X_n \text{ is picked} \rbrace \newline
\mathcal{Q}^\complement &= \lbrace p \in \Delta \mid p \text{ maintains
a stack explicitly, rather than implicitly via recursive calls} \rbrace \newline
\end{aligned}
$$

Examples:

- $\mathcal{P} \cap \mathcal{Q}$ : e.g. a vanilla $LL(1)$ parser
- $\mathcal{P} \cap \mathcal{Q}^\complement$ : e.g. an $LL(1)$ parser using a stack
- $\mathcal{P}^\complement \cap \mathcal{Q}$ : e.g. an PEG parser which handles [prioritized choice](/compiler/2025/03/14/peg-parsing-expression-grammars#341-e_1--e_2-%E4%B8%8E-backtracking) $A \to e_1 / e_2 / \dots / e_n$
    - $A()$ calls $e_1()$, if failed, backtracks and calls $e_2()$.
    - Repeat until some $e_i()$ succeeds
- $\mathcal{P}^\complement \cap \mathcal{Q}^\complement$: e.g. a PEG parser like above, but using a stack

# 2. $LL(k) \stackrel{?}{=} \mathcal{P}$

理想情况下你可以认为 $LL(k) = \mathcal{P}$.

现实世界中，你可能会有些 $LL(k)$ variant，比方说：我主体框架是个 $LL(1)$ parser，但其中有一个 production $A \to \alpha \mid \beta$ 是用 special rule 限定的。此时你这个 parser 肯定不是严格意义的 $LL(1)$，但它也能算是 predictive. 此时就是 $LL(k) \subset= \mathcal{P}$.

# 3. $LL(k)$: "Table-Driven" vs "Hardcoded"

对 $LL(0)$ 而言，根本就不需要 PPT (predictive parsing table)，你照着 production 写就完事了。比如：

```g4
S : 'a' X;
X : 'x';
```

```python
def S():
    match('a')
    X()

def X():
    match('x')
```

对于 $LL(1)$ 而言，PPT (predictive parsing table) 中的每一个 cell 至多只有 1 条 production，所以 parser 程序完全没有查表的必要，直接 if-else hardcode 就搞定了。比如：

```g4
S : 'a' X;
  | 'b' Y;
X : 'x' ;
Y : 'y' ;
```

假设 PPT 为 $M$，有 $M[S, a] = (S \to aX)$ and $M[S, b] = (S \to bY)$，但程序可以写成：

```python
def S():
    if lookahead() == 'a':
        match('a')
        X()
    elif lookahead() == 'b':
        match('b')
        Y()
    else:
        raise error()
```

即使上升到 $LL(2)$，你仍然是可以用 if-else 的，但是就不够优雅、高效，此时就可以在程序里上 PPT 了。

注意 $\mathcal{P} \cap \mathcal{Q}^\complement$ 一般会用 PPT 实现，以至于有的地方讲到 "table-driven" 都默认是 stack + table 了，I don't like this.
{: .notice--info}

# 4. PEG: "Parser Combinator"

PEG parser 经常会讲到 "parser combinator" 的概念。这里 combinator 又是 Lambda Calculus 的概念，但我们只用把它简单理解成：**a combinator is a higher-order function that**

1. takes one or more functions as input,
2. combines them using only function application (no free variables or external state),
3. returns a new function as a result

在 PEG parser 中主要体现在某些辅助函数，比如这个 [`parse_one_or_more()`](https://github.com/erikyao/toy_peg_parser/blob/main/src/peg_parser.py#L99C9-L99C26):

```python
def parse_one_or_more(symbol) -> list[dict]:
    first_result = symbol()
    rest_results = parse_zero_or_more(symbol)
    return first_result + rest_results
```

那么 grammar 中的 `<program> ::= <statement>+` 的 parsing 就可以写成：

```python
def statement():
    pass

def program():
    return parse_one_or_more(statement)
```

Unix pipes 也可以理解成为一种 combinator: `new_cmd ::= cmd_1 | cmd_2`
{: .notice--info}

# 5. Hybirds of $LL(k)$ + PEG

我完全可以做出一个 "四不像" 的 parser，比如：

- 它可以用 $LL(0)$ 或者 $LL(1)$ 做底
- 但某些 production 我们用 prioritized choice $S ::= e_1 / e_2 / \dots / e_n$

这么一来，这个 parser 既有 predictive 成分 (来自 $LL(0)$ 或者 $LL(1)$)，又有 backtracking 成分 (来自 PEG 的 prioritized choice). 理论上这个 parser 既 $\not \in \mathcal{P}$ 也 $\not \in \mathcal{P}^\complement$，但它 $\in \Delta$.

我也可以让这个 parser 一半用 recursive calls，一半用 table-driven. 

总之就是说，现实情况可能会很复杂 (各种补丁)，要灵活应对。