---
title: "Lark's implementation of computing FIRST and FOLLOW sets"
description: ""
category: Compiler
tags: []
toc: true
toc_sticky: true
---

# Overview

[Lark](https://github.com/lark-parser/lark) is a parsing toolkit for Python and it has a straightforward implementation of computing $\operatorname{FIRST}$ and $\operatorname{FOLLOW}$ sets. 

# `Symbol` Classes

Suppose we have a grammar $G = (V, \Sigma, S, P)$. 

Lark uses the following [3 classes for symbols](https://github.com/lark-parser/lark/blob/master/lark/grammar.py):

- `Symbol` $:V \cup \Sigma$
- `Terminal(Symbol)` $:\Sigma$
- `NonTerminal(Symbol)` $:V$

```python
class Symbol(Serialize):
    name: str
    is_term: ClassVar[bool] = NotImplemented

    def __init__(self, name: str) -> None:
        self.name = name


class Terminal(Symbol):
    is_term: ClassVar[bool] = True

    # filter_out: boolean flag of whether this terminal should be excluded from the parse tree
    #
    # When filter_out=True:
    #   - The terminal is matched during parsing but removed from the final parse tree
    #   - Useful for structural punctuation like parentheses, commas, semicolons, braces
    #   - Keeps parse trees clean by removing syntactic noise while preserving semantic content
    #   - Example: In "func(a, b)", the parentheses and comma would be filtered out
    def __init__(self, name: str, filter_out: bool = False) -> None:
        self.name = name
        self.filter_out = filter_out


class NonTerminal(Symbol):
    is_term: ClassVar[bool] = False
```

# `Rule` Class

Lark uses class `Rule` to represent productions of $P$. It's main attributes are:

```python
class Rule:
    origin: Symbol           # Left-hand side (non-terminal), e.g. A
    expansion: List[Symbol]  # Right-hand side, e.g. [B, C, D]
    alias: Optional[str]     # Optional label for the rule in the parse tree
    order: int               # Priority for disambiguation
```

Note that `alias` is for readability in parse trees. 

Lark support the following grammar format:

```ebnf
(* 
    Question mark (?) at the beginning indicates that this rule will be inlined 
    if they have a single child, after filtering. 
*)
?expr: term "+" term -> add
     | term
```

where `-> add` indicate the `alias` for this production. Therefore we can construct the following `Rule` object:

```python
Rule(origin=NonTerminal('expr'), 
     expansion=[NonTerminal('term'), Terminal('+'), NonTerminal('term')], 
     alias='add')
```

And the application of this rule in a parse tree can be represented as:

```txt
    ___'add'___
   /     |     \
'term'  '+'  'term'
```

where the name of the root of this sub tree is no longer `'expr'`

# Implementation

```python
def update_set(set1, set2):
    if not set2 or set1 > set2:
        return False

    copy = set(set1)
    set1 |= set2
    return set1 != copy

def calculate_sets(rules):
    """Calculate FOLLOW sets.

    Adapted from: http://lara.epfl.ch/w/cc09:algorithm_for_first_and_follow_sets"""
    symbols = {sym for rule in rules for sym in rule.expansion} | {rule.origin for rule in rules}

    # foreach grammar rule X ::= Y(1) ... Y(k)
    # if k=0 or {Y(1),...,Y(k)} subset of NULLABLE then
    #   NULLABLE = NULLABLE union {X}
    # for i = 1 to k
    #   if i=1 or {Y(1),...,Y(i-1)} subset of NULLABLE then
    #     FIRST(X) = FIRST(X) union FIRST(Y(i))
    #   for j = i+1 to k
    #     if i=k or {Y(i+1),...Y(k)} subset of NULLABLE then
    #       FOLLOW(Y(i)) = FOLLOW(Y(i)) union FOLLOW(X)
    #     if i+1=j or {Y(i+1),...,Y(j-1)} subset of NULLABLE then
    #       FOLLOW(Y(i)) = FOLLOW(Y(i)) union FIRST(Y(j))
    # until none of NULLABLE,FIRST,FOLLOW changed in last iteration

    NULLABLE = set()
    FIRST = {}
    FOLLOW = {}
    for sym in symbols:
        FIRST[sym]={sym} if sym.is_term else set()  # 📌 Key Step 1
        FOLLOW[sym]=set()

    # Calculate NULLABLE and FIRST
    changed = True
    while changed:
        changed = False

        for rule in rules:
            if set(rule.expansion) <= NULLABLE:  # 📌 Key Step 2
                if update_set(NULLABLE, {rule.origin}):
                    changed = True

            for i, sym in enumerate(rule.expansion):  # 📌 Key Step 3
                if set(rule.expansion[:i]) <= NULLABLE:
                    if update_set(FIRST[rule.origin], FIRST[sym]):
                        changed = True
                else:
                    break

    # Calculate FOLLOW
    changed = True
    while changed:
        changed = False

        for rule in rules:
            for i, sym in enumerate(rule.expansion):
                if i==len(rule.expansion)-1 or set(rule.expansion[i+1:]) <= NULLABLE:  # 📌 Key Step 4
                    if update_set(FOLLOW[sym], FOLLOW[rule.origin]):
                        changed = True

                for j in range(i+1, len(rule.expansion)):  # 📌 Key Step 5
                    if set(rule.expansion[i+1:j]) <= NULLABLE:
                        if update_set(FOLLOW[sym], FIRST[rule.expansion[j]]):
                            changed = True

    return FIRST, FOLLOW, NULLABLE
```

`update_set(set1, set2)` function updates `set1` with `set2`. If `set1` does not increase after the update, it's a `False` update; otherwise it's a `True` update.

Unlike we have discussed in [LL(1) Parsing](/compiler/2025/06/30/ll1-parsing), Lark excludes $\varepsilon$ from $\operatorname{FIRST}$ sets. Instead, Lark makes a new set $\operatorname{NULLABLE}$ for nullable variables. 

Here we use the following notations for the simplicity of our discussion:

- $\Phi \equiv \operatorname{FIRST}$
- $\Lambda \equiv \operatorname{FOLLOW}$
- $\mathrm{N} \equiv \operatorname{NULLABLE}$
- $A \uplus B \equiv (A \leftarrow A \cup B)$ (union and assignment)

Also note that Python supports the following set operators:

- `s1 < s2` $\Rightarrow$ test if $s_1 \subset s_2$
- `s1 <= s2` $\Rightarrow$ test if $s_1 \subseteq s_2$
- `s1 == s2` $\Rightarrow$ test if $s_1 = s_2$
- `s1 > s2` $\Rightarrow$ test if $s_1 \supset s_2$
- `s1 >= s2` $\Rightarrow$ test if $s_1 \supseteq s_2$
- `s1 | s2` $\Rightarrow$ union $s_1 \cup s_2$
- `s1 & s2` $\Rightarrow$ intersection $s_1 \cap s_2$
- `s1 - s2` $\Rightarrow$ difference $s_1 \setminus s_2$
- `s1 ^ s2` $\Rightarrow$ symmetric difference $s_1 \ominus s_2$

Explanation on 📌 key steps:

1. Init $\Phi[a] = \lbrace a \rbrace, \forall a \in \Sigma$
2. Given a production like $X \to Y_1 Y_2 \dots Y_k$, if $\forall Y_i$ is nullable, then $X$ is also nullable
3. Given the same production $X \to Y_1 Y_2 \dots Y_k$:
    - when `i == 0`, condition always holds since `rule.expansion[:0]` is empty; therefore always perform $\Phi[X] \uplus \Phi[Y_1]$
    - when `i == 1`, if $Y_1$ is nullable, perform $\Phi[X] \uplus \Phi[Y_2]$
    - when `i == 2`, if $Y_1Y_2$ is nullable, perform $\Phi[X] \uplus \Phi[Y_3]$
    - ……
    - when `i == k-1`, if $Y_1Y_2 \dots Y_{k-1}$ is nullable, perform $\Phi[X] \uplus \Phi[Y_k]$
4. Given a production like $Y \to X_1 X_2 \dots X_k$:
    - when `i == 0`, if $X_2 \dots X_k$ is nullable, perform $\Lambda[X_1] \uplus \Lambda[Y]$
    - when `i == 1`, if $X_3 \dots X_k$ is nullable, perform $\Lambda[X_2] \uplus \Lambda[Y]$
    - when `i == 2`, if $X_4 \dots X_k$ is nullable, perform $\Lambda[X_3] \uplus \Lambda[Y]$
    - ……
    - when `i == k-1`, always perform $\Lambda[X_k] \uplus \Lambda[Y]$
5. Given the same production $Y \to X_1 X_2 \dots X_k$:
    - when `i == 0`, `1 <= j <= k-1`
        - when `j == 1`, condition always holds since `rule.expansion[1:1]` is empty; therefore always perform $\Lambda[X_1] \uplus \Phi[X_2]$
        - when `j == 2`, if $X_2$ is nullable, perform $\Lambda[X_1] \uplus \Phi[X_3]$
        - when `j == 3`, if $X_2X_3$ is nullable, perform $\Lambda[X_1] \uplus \Phi[X_4]$
        - ……
        - when `j == k-1`, if $X_2 \dots X_{k-1}$ is nullable, perform $\Lambda[X_1] \uplus \Phi[X_k]$
    - when `i == 1`, `2 <= j <= k-1`
        - when `j == 2`, condition always holds since `rule.expansion[2:2]` is empty; therefore always perform $\Lambda[X_2] \uplus \Phi[X_3]$
        - when `j == 3`, if $X_3$ is nullable, perform $\Lambda[X_2] \uplus \Phi[X_4]$
        - when `j == 4`, if $X_3X_4$ is nullable, perform $\Lambda[X_2] \uplus \Phi[X_5]$
        - ……
        - when `j == k-1`, if $X_3 \dots X_{k-1}$ is nullable, perform $\Lambda[X_2] \uplus \Phi[X_k]$
    - ……
    - when `i == k-2`, `k-1 <= j <= k-1`
        - when `j == k-1`, condition always holds since `rule.expansion[(k-1):(k-1)]` is empty; therefore always perform $\Lambda[X_{k-1}] \uplus \Phi[X_k]$
    - when `i == k-1`, `j`'s range is empty