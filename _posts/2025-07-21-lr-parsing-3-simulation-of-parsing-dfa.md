---
title: "LR Parsing #3: Simulation of the Parsing DFA (Configuration / Shift-Reduce / Structure of Parsing Table)"
description: ""
category: Compiler
tags: []
toc: true
toc_sticky: true
---

# 1. Knuth's Model of Configuration

A parser's configuration is simply a unified view of (1) the DFA's stack content, and (2) the remaining input string. In Knuth's [On the Translation of Languages from Left to Right](https://www.sciencedirect.com/science/article/pii/S0019995865904262), it's modeled as below:

$$
\mathcal{S_0} X_1 \mathcal{S_1} X_2 \mathcal{S_2} \dots X_n \mathcal{S_n} \mid Y_1 \dots Y_k w
$$

Modern textbooks would prefer representing it as:

$$
\big[ (\_, \mathcal{S_0}), (X_1, \mathcal{S_1}), (X_2, \mathcal{S_2}), \dots,  (X_n, \mathcal{S_n}) \big] \mid Y_1 \dots Y_k w
$$

The portion to the left of the vertical bar represents the stack content, each cell being a pair of (1) the consumed symbol (if _shift_) or LHS symbol (if _reduce_), and (2) the corresponding state of the parsing DFA. The first cell $(\_, \mathcal{S_0})$ is special because it's put into the stack on purpose to initialize. 

I don't quite understand why most textbooks use the EOF symbol in the first cell, like $(\\$, \mathcal{S_0})$, because we REALLY don't have to care what the symbol is in the first cell. Using EOF symbol there would literally cost me some minutes to wonder why. 
{: .notice--warning}

The portion to the right of the vertical bar represents the remaining input string. The $k$ lookaheads are denoted individually.

# 2. Two Actions: Shift/Reduce

The two actions involved in LR parsing, _shift_ and _reduce_, can be explained vividly, with the help of the configuration model.

Consider the following toy grammar:

```ebnf
S -> AB
A -> abc
B -> de
```

Suppose on input $w = abcde$ we have an intermediate configuration:

$$
\big[ (\_, \mathcal{S_0}), (a, \mathcal{S_1}), (b, \mathcal{S_2}) \big] \mid c d e
$$

On reading $c$, the next action should be a _shift_, and the resulting configuration is like:

$$
\big[ (\_, \mathcal{S_0}), (a, \mathcal{S_1}), (b, \mathcal{S_2}), (c, \mathcal{S_3}) \big] \mid d e
$$

**Therefore _shift_ literally means to shift the consumed symbol from the right side of the vertical bar into the stack on the left.**

Further on reading $d$, the next action should be a _reduce_ ($abc \rhd A$), and the resulting configuration is like:

$$
\big[ (\_, \mathcal{S_0}), (A, \mathcal{S_4}) \big] \mid d e
$$

# 3. How to determine the next action/state on reading an input symbol?

Reuse our above examples; suppose we have an intermediate configuration:

$$
\big[ (\_, \mathcal{S_0}), (a, \mathcal{S_1}), (b, \mathcal{S_2}) \big] \mid c d e
$$

On reading $c$, to determine the next action, you can imagine there is a function $\operatorname{ACTION}$ such that $\operatorname{ACTION}(\mathcal{S_2}, c) = \text{shift}$, and the action is called. 

You can also imagine a $\operatorname{GOTO}$ function such that $\operatorname{GOTO}(\mathcal{S_2}, c) = \mathcal{S_3}$. 

This $\operatorname{GOTO}$ function is exactly the same one we talked about in [LR Parsing #2: Structural Encoding of LR(0) Parsing DFA](/compiler/2025/07/18/lr-parsing-2-structural-encoding-of-lr0-parsing-dfa).
{: .notice--info}

**In reality, we organize all values of these 2 functions into a parsing table.** Note that, no matter whether it's an $LR(0)$, $SLR(1)$, or $LR(1)$ parser, **the structure of their parsing tables is the same; the difference lies in how the tables are constructed.** We will talk about the construction of parsing tables in our next post.

# 4. How to interpret a parsing table? Let's start with Knuth's Parsing Table

Kind of different from the modern parsing table we have in the textbooks, _Table 1_ of Knuth's [On the Translation of Languages from Left to Right](https://www.sciencedirect.com/science/article/pii/S0019995865904262) has 4 interesting column names:

1. If $Y_1$ is ... (followed by a symbol)
2. then ... (followed by an action, either _shift_ or _reduce_)
3. If $X_{n+1}$ is ... (followed by a symbol)
4. then go to ... (followed by a state)

Note that:

1. $Y_1$ is exactly what $Y_1$ is as in a configuration illustrated above.
2. Knuth's _shift_ action does not carry the extra information of a go-to state.
3. $X_{n+1}$ represents the symbol of the new cell to be pushed into the stack
4. Knuth has go-to states even for _shift_ actions.

Reuse our above examples; suppose we have an intermediate configuration:

$$
\big[ (\_, \mathcal{S_0}), (a, \mathcal{S_1}), (b, \mathcal{S_2}) \big] \mid c d e
$$

On reading $c$, we have:

1. our current state is $\mathcal{S_2}$
2. $Y_1 = c$
3. action should be _shift_
4. we prepare a new stack cell under current state $\mathcal{S_2}$; the general form of the new stack cell is $(X_{n+1}, \mathcal{S_{n+1}})$, and in our case
    - $X_{n+1} = c$
    - $\mathcal{S_{n+1}} = ?$
5. $\mathcal{S_{n+1}} = ?$ is literally the go-to state

Also note that **the current state of the parsing DFA is always the state on the stack top.** Therefore we'll have such a row in the parsing table (suppose $\mathcal{S_3}$ is a known state):

|current state on the stack top|If $Y_1$ is|then    |If $X_{n+1}$ is|then go to      |
|------------------------------|-----------|--------|---------------|----------------|
|$\mathcal{S_2}$               | $c$       | _shift_| $c$           | $\mathcal{S_3}$|

Now we have a new configuration:

$$
\big[ (\_, \mathcal{S_0}), (a, \mathcal{S_1}), (b, \mathcal{S_2}), (c, \mathcal{S_3}) \big] \mid d e
$$

Further on reading $d$:

1. our current state is $\mathcal{S_3}$
2. $Y_1 = d$
3. action should be _reduce_ ($abc \rhd A$), and we popp out $a,b,c$ from the stack
4. our current state **HAS CHANGED** and is $\mathcal{S_0}$ now; we prepare a new stack cell under current state $\mathcal{S_0}$; the general form of the new stack cell is $(X_{n+1}, \mathcal{S_{n+1}})$, and in our case
    - $X_{n+1} = A$
    - $\mathcal{S_{n+1}} = ?$
6. $\mathcal{S_{n+1}} = ?$ is literally the go-to state

Therefore we'll have such **TWO** rows in the parsing table (suppose $\mathcal{S_4}$ is a known state):

|current state on the stack top|If $Y_1$ is|then                     |If $X_{n+1}$ is|then go to      |
|------------------------------|-----------|-------------------------|---------------|----------------|
|$\mathcal{S_3}$               | $d$       | _reduce_ ($abc \rhd A$) |               |                |
|$\mathcal{S_0}$               |           |                         | $A$           | $\mathcal{S_4}$|

We end up with the following configuration:

$$
\big[ (\_, \mathcal{S_0}), (A, \mathcal{S_4}) \big] \mid d e
$$

I found Knuth's Parsing Table easier to understand, partly because of its consistency with the $\operatorname{GOTO}$ function we talked about in [LR Parsing #2: Structural Encoding of LR(0) Parsing DFA](/compiler/2025/07/18/lr-parsing-2-structural-encoding-of-lr0-parsing-dfa). Modern parsing tables use a compact notation like _shift3_, meaning a _shift_ action together with a go-to state $3$.
{: .notice--info}

# 5. What does $LR$ mean?

- $L$: the input string is processed $\text{Left}$ to right
- $R$: the whole parsing process is a $\text{Rightmost}$ derivation in reverse

I don't think the $R$ part intuitive enough.
{: .notice--info}

Additionally, you can also consider $LR$ parsing as:

- from a global perspective, always doing <span style="color:magenta">leftmost</span> reduction on the input string
- from a local perspective, always doing <span style="color:LimeGreen">rightmost</span> reduction inside the stack

$$
\Big[ 
    \Big( \begin{array}{ll} \_ \newline \mathcal{S_0} \end{array} \Big)
    \overbrace{
        \underbrace{
            \Big( \begin{array}{ll} \textcolor{magenta}{a} \newline \textcolor{LimeGreen}{\mathcal{S_1}} \end{array} \Big)
            \Big( \begin{array}{ll} \textcolor{magenta}{b} \newline \textcolor{LimeGreen}{\mathcal{S_2}} \end{array} \Big)
            \Big( \begin{array}{ll} \textcolor{magenta}{c} \newline \textcolor{LimeGreen}{\mathcal{S_3}} \end{array} \Big)
        }_{\textcolor{LimeGreen}{\text{rightmost inside stack}}}
    }^{\textcolor{magenta}{\text{leftmost of input}}}
\Big]
\begin{array}{ll} \textcolor{magenta}{d} \newline \text{} \end{array} 
\begin{array}{ll} \textcolor{magenta}{e} \newline \text{} \end{array}
$$

# 6. Pseudo Code

Suppose:

- Every state is represented by a number
    - Initial state is $0$
- Every production is represented by a number
    - Action `reduce k` means reduction using production #️⃣$k$
- Parsing Table is splitted into two sub-tables:
    - `Action` table with "If $Y_1$ is" and "then" columns
    - `GOTO` table with "If $X_{n+1}$ is" and "then go to" columns

Define `StateFrame` class for the cells of the `stack`:

```python
class StateFrame:
    """Represents a compound of symbol and state"""
    def __init__(self, symbol, state):
        self.symbol = symbol
        self.state = state
    
    def __repr__(self):
            return f"({self.symbol}, {self.state})"

stack = [StateFrame(None, 0)]  # Bottom marker with start state 0
```

The parsing process is an infinitely loop:

```python
while True:
    s = stack[-1].state
    y1 = w[0]  # w is the input string

    if Action[s, y1] == "shift":
        stack.append(StateFrame(symbol=y1, 
                                state=GOTO(s, y1)))

        w = w[1:]  # y1 is consumed, therefore is removed from w
    elif Action[s, y1] == "reduce k":
        LHS, RHS = productions[k]

        for _ in len(RHS):
            stack.pop()

        _s = stack[-1].state  # new current state after popping out some `StateFrame`s from stack
        stack.append(StateFrame(symbol=LHS, 
                                state=GOTO(_s, LHS)))

        output_parse_tree(productions[k])

        # y1 is not consumed yet
    elif Action[s, y1] == "accept":
        break  # parsing is done!
    else:
        error_recovery_routine()
```

Modern parsing tables would have action like `shift j`, which works similarly like:

```python
    if Action[s, y1] == "shift j":
        stack.append(StateFrame(symbol=y1, 
                                state=j))
```

The difference between a _shift_ and a _reduce_ action can be summarized as:

|action  |consumes $Y_1$?|extra stack manipulation?|new state to stack|
|--------|---------------|-------------------------|------------------|
|_shift_ | ✅             | ❌                       | $\big( Y_1, \operatorname{GOTO}(s, Y_1) \big)$| 
|_reduce_| ❌             | ✅ (popping out)         | $\big( LHS, \operatorname{GOTO}(s', LHS) \big)$|
