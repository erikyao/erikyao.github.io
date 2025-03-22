---
title: "Shunting Yard Algorithm"
description: ""
category: Compiler
tags: []
toc: true
toc_sticky: true
---

# 1. shunting yard 是啥？

**shunt** (_v.t._):  
(1) to move or turn aside or out of the way  
(2) to switch (a railroad car, a train, etc.) from one track to another  
(3) to divert (blood or other bodily fluid) from one part to another by a surgical shunt  
{: .notice--info}

shunting yard 的正确翻译应该是 ["编组场" 或者 "调车场"](https://zh.wikipedia.org/zh-cn/%E7%B7%A8%E7%B5%84%E5%A0%B4)，取它在铁路系统中的意思。但是 Shunting Yard Algorithm 中文常见的翻译却是 "调度场算法"，我非常不喜欢这个叫法，因为 "调度" 很容易让人想到 "scheduler".

![中国上海的南翔编组场](https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/201805_Nanxiang_Station_Yard_III.jpg/640px-201805_Nanxiang_Station_Yard_III.jpg)

([图片来源](https://commons.wikimedia.org/w/index.php?curid=69413348))

Shunting Yard Algorithm 取这个名字是因为它用了 1 queue + 1 stack，机制很像两条铁轨的 shunting.

# 2. Why postfix notation in the first place?

Shunting Yard Algorithm 的作用是把 infix notation 转换成 postfix notation.

prefix/infix/postfix 它们仨的优势分别是：

1. prefix: **最数学**。$\circ \, a \, b$ 和 $f(a, b)$ 一脉相承
2. infix: **最人类**。$a \circ b$ 的形式 (比如 $a+b$) 我们从幼儿园就很熟悉
3. postfix: **最计算机**。$a \, b \, \circ$ 的形式用计算机 evaluate 最方便：
    1. 扫描到 $a$: push $a$ into stack
    2. 扫描到 $b$: push $b$ into stack
    3. 扫描到 $\circ$: 是 operator，触发计算。因为 $\circ$ 的 arity $=2$ (i.e. binary)，所以我们 pop stack 两次获取两个 operands，计算后的结果再 push into stack

从计算机 evaluation 的角度来看，prefix 应该也是可以的，只是有点**反直觉**：它需要用 "第二个 operand" 去触发一个 binary 计算。比如 $\circ \, a \, b$:

1. 扫描到 $\circ$: 是 operator, push $\circ$ into stack, expecting 2 operands
2. 扫描到 $a$: 是第一个 operand, push $a$ into stack
3. 扫描到 $b$: 是第二个 operand，触发计算。pop stack 两次获取第一个 operand 和 operator，计算后的结果再 push into stack

而 infix 有 precedence 的问题，比如 $a + b \times c$ 你处理起来就有点麻烦，但是 prefix 的 $+ \, a \times b \, c$ 和 postfix 的 $a \, b \, c \times +$ 就没有这个问题。

总结：postfix notaiton 有如下几个优点：

1. 可以去掉 infix 中的 parentheses
2. 自带 precedence 
3. 可以方便地使用 stack 来 evaluate

## 关于 Precedence 的严格数学证明的思路

postfix 的 "优点1" 和 "优点2" 本质是同一个，而且从另一个角度来看，我们是在下这么两个结论：

1. 没有 parentheses 的 infix notation 是 ambiguous 的
2. postfix notation 一定是 unambiguous 的

想要从数学角度来证明的话，可以用下面的思路：

**论点 1 的 Proof:** 首先我们可以给 "没有 parentheses 的" infix notation 定义一个 CFG：

```ebnf
<operand>  ::= [a-z]
<operator> ::= '+' | '-' | '*' | '/'
<term>     ::= <operand> | <operand> <operator> <operand>

<expr>     ::= <term> | <term> <operator> <term>
```

我们要证明这个 CFG 是 ambiguous 的，只需要提出一个例子，比如 `a + b * c`，说明它可以有两个 parse trees 即可：

```txt
     _*_
    /   \
  _+_    c
 /   \
a     b

     _+_
    /   \
   a    _*_
       /   \
      b     c
```

$\blacksquare$

**论点 2 的 Proof:** 类似地，我们也可以给 postfix notation 定义一个 CFG，然后我们可以进一步证明它可以被一个 DPDA 接收 (考虑到 postfix 和 stack 的友好程度)，进而可以证明 postfix 是个 DCFG.

而 DCFG 是 always unambiguous 的. $\blacksquare$

## 非 binary 的 operator 如何应对？

[wikipedia: Reverse Polish Notation](https://en.wikipedia.org/wiki/Reverse_Polish_notation) 还提到了一点：

> The notation does not need any parentheses for as long as each operator has a fixed number of operands.

它的意思不是说 "所有 operators 都要有 arity $=k$"，而是说 "$\forall$ operator $\circ$，它的 arity 必须固定"，即你不能一会儿是 unary，一会儿是 binary。不固定的 arity 天然就是 ambiguity.

{% capture notice-text %}
数学上的减号 $-$ 既可以表示 subtraction，也可以表示 negation；programming language 中也没有区分。这是因为我们可以改写 grammar 来消除这个 ambiguity，比如：

- `<expr> ::= <expr> "-" <term>` (for subtraction)
- `<factor> ::= "-" <factor>` (for negation)

这样就能唯一确定一个 parse tree。比如 $a \times - b$ 就是：

```
  _*_
 /   \
a     -
      |
      b
```

基于 parse tree 的 post-order 的 evaluation 规则是：

$$
\operatorname{eval}(T) =
\begin{cases}
T.\text{value}, & \text{if } T \text{ is a leaf (operand)} \\
\text{apply}(T.\text{operator}, \text{evaluate}(T_{\text{left}}), \text{evaluate}(T_{\text{right}})), & \text{if } T \text{ is an operator}
\end{cases}
$$

所以 $-b$ 这个 subtree 就很鸡贼：我只有一个 leaf，所以我是 negation；若我有两个 leaves，那我就是 subtraction.

但是对基于 stack 的 postfix notation 的 evaluation 算法而言，这个 ambiguity 是无法规避的 (比如说我 scan 到了 $-$，我怎么确定是要 pop 出一个还是两个 operand？除非你用 parentheses).

比如还是 $a \times - b$，写成 postfix 是 $a \, b \, - \, \times$，它理论上只可能有一棵 parse tree，但你可能会经历一次构建 parse tree 的 failure:

```
# 把 - 视为 unary 的 negation (构建成功)

  _*_
 /   \
a     -
      |
      b

# 把 - 视为 binary 的 subtraction (构建失败)

     _*_
    /   \
  _-_    ? (missing operand)
 /   \
a     b
```

虽然我们可以 backtrack，但这么一来算法的 cost 就太高了。

虽说 "parse tree 的 post-order traversal 得到的是 postfix notation"，但基于 parse tree 的 evaluation 和基于 stack 的 evaluation 还是有 ambiguity 上的差别。

所以如果我们一定要在 postfix notation 中引入一个 negation operator 的话，我们需要取一个新的符号，比如 $\neg$.
{% endcapture %}

<div class="notice--warning">
  <h4 class="no_toc"></h4>
  {{ notice-text | markdownify }}
</div>

对 infix 而言，unary operator 似乎怎么写都可以，比如我们可以有 $\neg a$ 和 $a^\ast$，postfix 可以写成 $a \neg$ 和 $a^\ast$.

对 infix 而言，arity $>=3$ 的情况就无法表示了，但是 prefix 和 postfix 都 ok，比如 $\operatorname{f} \, a \, b \, c$ 和 $a \, b \, c \, \operatorname{f}$.

## 有必要考虑 Associativity 

我们最常用四则运算来举例，但因为加减乘除都是 left-associative，是最自然的形式，所以我们很容易忘记 associativity 对 postfix 的影响。

**首先我们要明确什么时候会用到 associativity**. 根据 [Java Language Reference - 4.14 Order of Operations](https://web.deu.edu.tr/doc/oreily/java/langref/ch04_14.htm):

> If consecutive operators in an expression have the same precedence, a rule called associativity is used to decide the order in which those operators are evaluated.

这里 "the order in which those operators are evaluated" 本质是 "how operators and their operands are grouped (or associated)"，这样才与 associativity 这个名字契合 (其实我觉得叫 groupability 更合适)。

综上，要用到 associativity 的时候，你一定有这么两个前提：

1. 你有 $>=2$ 个 operands 的 expression, e.g. $a \circ b \bullet c$
2. operands 的 precedence 相同, e.g. $\operatorname{precedence}(\circ) == \operatorname{precedence}(\bullet)$

此时讨论 associativity：

1. 若 $\operatorname{assoc}(\circ) = \operatorname{assoc}(\bullet) = \text{left}$ $\Rightarrow$ $(a \circ b) \bullet c$
2. 若 $\operatorname{assoc}(\circ) = \operatorname{assoc}(\bullet) = \text{right}$ $\Rightarrow$ $a \circ (b \bullet c)$
    - E.g. consecutive assignement `a = b = 5` in some programming language
3. 若 $\operatorname{assoc}(\circ) = \operatorname{assoc}(\bullet) = \text{none}$ $\Rightarrow$ 你这个 $a \circ b \bullet c$ 的 expression 一般是非法的，除非 grammar 特殊规定
    - E.g. $a < b > c$，因为 evaluation 时会产生 ambiguity
4. 若 $\operatorname{assoc}(\circ) \neq \operatorname{assoc}(\bullet)$ $\Rightarrow$ 你这个 $a \circ b \bullet c$ 的 expression 一般是非法的，除非 grammar 特殊规定
    - 理由同上

同一个 operand 连续出现两次时，比如 $a \circ b \circ c$，只需考虑前 3 条规则。

考虑对 postfix 的影响：

- 如果全是 left-associative，那么 $a \circ b \bullet c$ $\Rightarrow$ $a \, b \, \circ \, c \, \bullet$
- 如果全是 right-associative，那么 $a \circ b \bullet c$ $\Rightarrow$ $a \, b \, c \, \bullet \, \circ$

# 3. Shunting Yard Algorithm

根据 [wikipedia: Shunting yard algorithm](https://en.wikipedia.org/wiki/Shunting_yard_algorithm#The_algorithm_in_detail)，算法框架为：

```python
from collections import deque

def sya(input: str):
    output_queue = deque()
    operator_stack = list()

    for token in input:  # main-for-loop
        if token is operand (or number):
            output_queue.append(token)
        elif token is function_name (like "f", "sine", "factorial"):
            operator_stack.append(token)
        elif token == ",":  # as in "f(a,b)"
            """
            E.g. input == "f(a,b)": 扫描到 "," 时, stack = ["f", "("], queue = ["a"], 此时 do nothing
            E.g. input == "f(a+b, c)": 扫描到 "," 时, stack = ["f", "(", "+"], queue = ["a", "b"], 此时把 "+" 从 stack 中弹出，并压入 queue
            """
            while operator_stack and operator_stack[-1] != '(':
                op = operator_stack.pop()
                output_queue.append(op)
        elif token is operator:
            op1 = token
            """
            For input like "a op2 b op1 c"

            Here we only check op1's associativity. I.e. we don't examine corner case like different associativities or non-associativity
            """
            while (operator_stack and operator_stack[-1] := op2 != '(') and (op2.precedence > op1.precedence or (op2.precedence == op1.precedence and op1 is left-associative):
                op2 = operator_stack.pop()
                output_queue.append(op2)
            operator_stack.append(op1)
        elif token == "(":
            operator_stack.append(token)
        elif token == ")":
            while operator_stack and operator_stack[-1] != '(':
                op = operator_stack.pop()
                output_queue.append(op)

            assert(operator_stack is not empty and the top element is "(") # otherwise there are mismatched parentheses.
            l_paren = operator_stack.pop()  # just discard it

            if operator_stack and operator_stack[-1] is function_name:
                f_name = operator_stack.pop()
                output_queue.append(f_name)

    while operator_stack:  # main-while-loop
        assert(operator_stack[-1] != "(":  # otherwise there are mismatched parentheses.
        op = operator_stack.pop()
        output_queue.append(op)

    return "".join(output_queue)
```

普通 operator 的规则：考虑以下几种情况：

1. trivial case: 0 operator, 1 operand, like `a`
    - `#main-for-loop`: `queue = [a]`，结束
    - `#main-while-loop` 不触发，直接结束
    - 输出 `a`
1. trivial case: 1 operator, like `a+b`
    - `#main-for-loop`: 扫描完 `a+b` $\Rightarrow$ `queue = [a, b]; stack = [+]`
    - `#main-while-loop 将 operand 弹出 `stack` 再入 `queue`
    - 输出 `ab+`
1. common case: 2 or more operators, like `a+b*c`
    - `#main-for-loop`:
        - 扫描完 `a+b` $\Rightarrow$ `queue = [a, b]; stack = [+]`
        - 一般由 the second operator (current `token`) 触发 "把 last operator (top of the operator stack) 弹出 stack 再入 queue" 的操作，但要满足一定条件：
            1. 如果 the second operator 的 precedence $>$ last operator 的 precedence，你此时只能继续把 the second operator 入 stack
            2. 如果 the second operator 的 precedence $=$ last operator 的 precedence，但是它们都是 right-associative 的，你此时还是只能继续把 the second operator 入 stack
            3. 如果 the second operator 的 precedence $<$ last operator 的 precedence，触发操作
            4. 如果 the second operator 的 precedence $=$ last operator 的 precedence，但是它们都是 left-associative 的，触发操作
        - 根据上述规则，扫描到 `*` 之后: `queue = [a, b]; stack = [+, *]`
        - 扫描到 `c` 之后: `queue = [a, b, c]; stack = [+, *]`
    - `#main-while-loop: 将 operands 弹出 `stack` 再入 `queue`
    - 输出 `abc*+`

这个 "由 the second operator 触发" 的机制可以用这幅图 ([来源](https://en.wikipedia.org/wiki/File:Shunting_yard.svg)) 表示：

![](https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Shunting_yard.svg/678px-Shunting_yard.svg.png)

parentheses 的规则：

1. `(` 严格来说不算 operator，但我们还是把它放入 `stack`，主要是为了方便与 `)` 配对
2. 算法中有 3 处检查 `while operator_stack and operator_stack[-1] != '('`，其实就是确认 `stack` top 不是 `(`，亦即我们此时在 expect 一个真正的 operator
3. 遇到 `)` 时，相当于此时我们有一个完整的 expression，所以此时我们把 `#main-while-loop` 的逻辑直接执行了一遍
    - 类似于是个递归: `sya("(<expr>)")` $\Rightarrow$ `discard("("); sya("<expr>"); discard(")");`

function name 的规则：因为一定是 `f(<expr>)` 的形式，所以在处理 `)` 时候带一脚即可。
