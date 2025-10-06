---
title: "Packrat Parsing: Left Recursion Handling with Seed Parsing"
description: ""
category: Compiler
tags: []
toc: true
toc_sticky: true
---

# 1. Overview

Left recursion has long been the nemesis of top-down parsers. In any recursive-descent parsers, rules like 

```ebnf
<expr> := <expr> '+' <term>
        | <expr> '-' <term> 
        | <term>
<term> := <num>
        | '(' <expr> ')'
```

immediately loop forever: the parser keeps expanding `<expr>` before ever consuming input.

Yet modern packrat parsers do handle left recursion efficiently. Many tutorials credit the 2008 paper by Alessandro Warth et al. (2008), [_Packrat Parsers Can Support Left Recursion_](https://web.cs.ucla.edu/~todd/research/pub.php?id=pepm08), for this breakthrough. Although it did spark the idea, I don’t recommend reading it as your starting point. The paper is more of a research note than a clear exposition: it proposes an approach, but leaves much unsaid about how and why it works.

If you really want to understand how packrat parsers solve left recursion, go instead to:

- Fabio Mascarenhas et al. (2014), [_Left Recursion in Parsing Expression Grammars_](https://www.sciencedirect.com/science/article/pii/S0167642314000288), a concise and elegant formalization.
- Masaki Umeda et al. (2020), [_Packrat Parsers Can Support Multiple Left-recursive Calls at the Same Position_](https://www.semanticscholar.org/paper/Packrat-Parsers-Can-Support-Multiple-Left-recursive-Umeda-Maeda/45942a777483715b483005da1cc254b97fe08446), whose _Section 3.1_ clearly illustrates how the "seed parse" technique works.

# 2. How Seed Parse Works

Consider the following simplified rule in PEG:

```ebnf
E := E '+' 'n' / 'n'
```

and input $w = n + n + n$.

To address the infinitely loop, this rule can be conceptually rewritten as:

$$
\begin{align}
E_0 &:= \texttt{MisMatch} \newline
E_{n} &:= E_{n-1} + n \; / \; n
\end{align}
$$

We **fix the start-parsing position to $0$** (w.r.t. $w$), and how to parse input $w$ using the rewritten rule is illustrated in the table below:

|      Position      | $0$ | $1$ | $2$ | $3$ | $4$ |   $5$   |       Result        |
|:------------------:|:---:|:---:|:---:|:---:|:---:|:-------:|:-------------------:|
| Non-terminal\Input | $n$ | $+$ | $n$ | $+$ | $n$ | $\Finv$ |                     |
|       $E_0$        | ❌  |     |     |     |     |         | $\texttt{MisMatch}$ |
|       $E_1$        | 🔴  |     |     |     |     |         |  $\texttt{Match}$   |
|       $E_2$        | 🔴  | 🟡  | 🟡  |     |     |         |  $\texttt{Match}$   |
|       $E_3$        | 🔴  | 🟡  | 🟡  | 🟢  | 🟢  |         |  $\texttt{Match}$   |
|       $E_4$        | 🔴  |     |     |     |     |         |  $\texttt{Match}$   |

- $E_0$ always fails by definition
- Since $E_0$ always fails, $E_1$ chooses its 2nd alternative, and matches $w[0]$
- $E_2$ chooses its 1st alternative, with $E_1$ matches $w[0]$, and matches up to $w[0:3]$
- $E_3$ chooses its 1st alternative, with $E_2$ matches $w[0:3]$, and matches up to $w[0:5]$
- If $E_4$ chooses its 1st alternative, it has to match $n + n + n + n$ which exceeds $w$. Therefore $E_4$ has to choose its 2nd alternative, and matches $w[0]$

Defining $E_0 := \texttt{MisMatch}$ is an implementation trick. Conceptually you can start from $E_1 := n$ (i.e. forcing $E_1$ to choose the non-recursive alternative directly) in this case.
{: .notice--info}

If we consider the match of $E_{n}$ using $E_{n-1}$ a single parsing step, Masaki summarized:

> ..., the shortest string is matched in the first step and the matched range increases with each subsequent step. When the match is already reached to the longest possible range, the result of the next parsing step returns to the first shortest value. 

We define: 

- **seed**: the result of the first match, $E_1$
- **seed-growing**: the iterative process of matching $E_{n}$ using $E_{n-1}$

Seed-growing should stop when we have reached the longest match.

# 3. Implementation with Packrat Memorization

We can define a memorization map like `memos(non-terminal, pos) = (result, endpos)`. 

To define $E_0 := \texttt{MisMatch}$, we can initialize $\operatorname{memos}(E, 0) = (\texttt{MisMatch}, \_)$.

The seed-growing process is like:

|      Position      | $0$ | $1$ | $2$ | $3$ | $4$ |   $5$   | Old $\operatorname{memos}(E, 0)$ | New $\operatorname{memos}(E, 0)$ |
|:------------------:|:---:|:---:|:---:|:---:|:---:|:-------:|:--------------------------------:| -------------------------------- |
| Non-terminal\Input | $n$ | $+$ | $n$ | $+$ | $n$ | $\Finv$ |                                  |                                  |
|       $E_0$        | ❌  |     |     |     |     |         |    $(\texttt{MisMatch}, \_)$     |                                  |
|       $E_1$        | 🔴  |     |     |     |     |         |    $(\texttt{MisMatch}, \_)$     | $(\texttt{Match}(n), 1)$         |
|       $E_2$        | 🔴  | 🟡  | 🟡  |     |     |         |     $(\texttt{Match}(n), 1)$     | $(\texttt{Match}(n+n), 3)$       |
|       $E_3$        | 🔴  | 🟡  | 🟡  | 🟢  | 🟢  |         |    $(\texttt{Match}(n+n), 3)$    | $(\texttt{Match}(n+n+n), 5)$     |
|       $E_4$        | 🔴  |     |     |     |     |         |   $(\texttt{Match}(n+n+n), 5)$   | $(\texttt{Match}(n), 1)$         |

When matching $E_4$ we find the new `endpos` becomes `1` and is less than the old `endpos` of `5`, we know we have re-entered the "matching loop", and the old $\operatorname{memos}(E, 0) = (\texttt{Match}(n+n+n), 5)$ should be returned as the final parsing result.

# 4. GvR's Understanding of Seed Growing

Warth explained the initial, naive idea inspired seed growing as:

> A simple way to avoid infinite recursion is for $\operatorname{APPLY-RULE}$ to store a result of $\texttt{FAIL}$ in the memo table _before_ it evaluates the body of a rule, as shown in Figure 2. This has the effect of making all left-recursive applications (both direct and indirect) fail.

Guido van Rossum in his [Left-recursive PEG Grammars](https://medium.com/@gvanrossum_83706/left-recursive-peg-grammars-65dab3c580e1) stated his way of thinking:

> The idea is that in the `expr()` function we wish for an “oracle” that will tell us whether to take the first alternative (i.e., calling `expr()` recursively) or the second (i.e., calling `term()`). In the first call to `expr()` the oracle should return `true`; in the second (recursive) call it should also return `true`, but in the third call it should return `false`, so there we can call `term()`.

This is exactly how we conceptually parse input like $w = foo + bar + baz$ in our mind:

$$
\begin{align}
E &:= E + T & (\operatorname{oracle} = \texttt{True}) \newline
  &:= E + T + T & (\operatorname{oracle} = \texttt{True}) \newline
  &:= T + T + T & (\operatorname{oracle} = \texttt{False}) \newline
  &:= foo + bar + baz
\end{align}
$$

And then he came up to this genius idea:

> ... but there is a better way: **let’s reverse the call stack!**
>   
> The idea here is that we start with the call where the oracle returns `false`, and save the result. This gives us `expr() -> term() -> 'foo'`....
> 
> Then we call `expr()` again, and this time the oracle returns `true`, but instead of making a left-recursive call to `expr()` we substitute the saved result from the previous call.
>   
> ... we stop and _keep the longest parse_ (i.e., `(foo + bar) + baz`).

# 5. A Fixed-Point Way to Think About Seed Growing

We can define a function like $f(\text{old\_endpos}) = \text{new\_best\_endpos}$ for the seed growing process. Then the iteration can be expressed as:

$$
\begin{align}
f(0) &= 1\newline
f(1) &= 3 \newline
f(3) &= 5 \newline
f(5) &= 5
\end{align}
$$

Seed growing stops when we reach a fixed point $x$ such that $f(x) = x$.

# 6. Digression: why not just rewrite the rules?

Guido van Rossum in his [Left-recursive PEG Grammars](https://medium.com/@gvanrossum_83706/left-recursive-peg-grammars-65dab3c580e1) introduced two ways to rewrite the following rule:

```ebnf
<expr> := <expr> '+' <term>
        | <term>
```

the first being:

```ebnf
<expr> := <term> '+' <expr>
        | <term>
```

and the second being:

```ebnf
<expr> := <term> ('+' <term>)*
```

While they recognize the same language as the original rule, they have cons respectively.

- The first rewriting ruins precedence (reflected in the shape of the parse tree). 
    - E.g. `1 + 2 + 3` would be parsed as `1 + (2 + 3)`. 
    - It would be a big problem for abstraction expression like `1 - 2 - 3`.
- The second rewriting addresses the above problem, but it loses the convenience to construct parse trees. 
    - E.g. for input `1 + 2 + 3`, you get 
        - `<term:1>` as the 1st part of the result
        - `('+', <term:2>)` as the 2nd
        - `('+', <term:3>)` as the 3rd 
    - You may have to loop over the parsing result again to construct a left-recursive parse tree as needed.

```txt
# The desired parse tree for input "1 + 2 + 3"

    +
   / \
  +   3
 / \
1   2
```