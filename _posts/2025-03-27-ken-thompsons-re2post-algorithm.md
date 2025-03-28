---
title: "Ken Thompson's `re2post` Algorithm"
description: ""
category: Compiler
tags: []
toc: true
toc_sticky: true
---

# 起源

其实是 [Thompson, Ken. Regular Expression Search Algorithm Communications of the ACM 11(6) (June 1968), pp. 419-422](https://dl.acm.org/doi/10.1145/363347.363387) 的一部分，作用是把 regex 改成 postfix notation.

老爷子直接用 assembly 写的，Russ Cox 用 C 重写了一版。他在 [Regular Expression Matching Can Be Simple And Fast (but is slow in Java, Perl, PHP, Python, Ruby, ...)](https://swtch.com/~rsc/regexp/regexp1.html) 的原话是：

> Thompson introduced the multiple-state simulation approach in his 1968 paper. In his formulation, the states of the NFA were represented by small machine-code sequences, and the list of possible states was just a sequence of function call instructions. In essence, Thompson compiled the regular expression into clever machine code. Forty years later, computers are much faster and the machine code approach is not as necessary. The following sections present an implementation written in portable ANSI C.

我们这里讨论的是 Russ Cox 的版本。原代码可以参考 [rsc-regexp/original
/nfa.c](https://github.com/BurntSushi/rsc-regexp/blob/master/original/nfa.c).

# 翻译：C to Python

## Shunting Yard Algorithm 的外壳

我个人的修为不是很够，这个 C 代码看得我头疼，因为写得很 geeky。

它整体上还是个 [Shunting Yard Algorithm](/compiler/2025/03/20/shunting-yard-algorithm)，大方向上只有一个痛点需要解决：

- input (a regex) 没有 concat operator，所以要在改写成 postfix 的同时确定哪里是 concat operator

我们先把 C 代码中的 variable names 翻译一下：

- `nalt`: "number of alt"
    - alt 即是 alternation
    - 在 regex 语境下，alternation 其实指的是具体的 alternation operator `|`，并不是类似 "repetition", "option" 这类表示 regex construction 的词
    - 所以这个 var 的本质意思是 "number of `|` operators"
- `natom`: "number of atoms"
    - [atom 是 regex 的组成单元](https://en.wikipedia.org/wiki/Regular_expression#Syntax)
    - 但从 code 来看，它 exclusively 指的是 "concat operator 对应的 atoms"
        - i.e. 这个 var 的本质意思是 "number of concat operands"
- `paren[100]`:
    - 这个命名我实在无法理解，它的作用是 "保存 `(nalt, natom)` 这组计数"。我们看个例子：
        - 假设你的 input `re = x(y)z`
        - 你在扫描完 `x` 之后有一个 top-scope 的 `(nalt, natom)`
        - 扫描到 `(` 时，你意识到你要进入 nested-scope，应该有一对新的 `(nalt, natom)` 计数，所以你把 top-scope 的 `(nalt, natom)` 压入 `paren`，然后新开一对 `(nalt, natom)`
        - 扫描到 `)` 时，你意识到你要重新回到 top-scope，于是你就把 top-scope 的 `(nalt, natom)` 从 `paren` 中弹出
    - 所以这个 var 的本质就是 [Shunting Yard Algorithm](/compiler/2025/03/20/shunting-yard-algorithm) 中的 `operator_stack`，只是我们没有存具体的 operator，而是存的 `(nalt, natom)`
- `*p = paren`:
    - 把 `paren` 理解成 stack 之后，`p` 就很好理解了：它就是 stack 的 top
- `buf[8000]`:
    - 顺着 `paren[100]` 的思路，这个 var 的本质就是 [Shunting Yard Algorithm](/compiler/2025/03/20/shunting-yard-algorithm) 中的 `output_queue`
    - 函数最后是 `return buf;` 相当于是 return 了 queue 的 head
- `*dst = buf`:
    - 类似地，`dst` 就是 queue 的 tail

所以这段代码解决痛点的方法是：用 `(nalt, natom)` 计数来确定什么时候要加 concat operator. 理论上 `|` 可以直接进 `operator_stack`，不用 `nalt` 来计数也是可以的。原作者这么处理大概是因为 "都是 binary operators 所以都用计数来处理比较方便"？我觉得怎么说也算是一种 consistency，是 ok 的。

说到 operators，我们会发现这个 `re2post` 相比 [Shunting Yard Algorithm](/compiler/2025/03/20/shunting-yard-algorithm) 明显缺了三个东西：operator 的 arity、precedence、associativity。原代码直接全部 imply 了，也增加了理解难度。其实一共就 5 个 operators (代码用的 `.` 表示 concat)：

| Operator  | Precedence | Associativity | Arity |
|-----------|------------|---------------|-------|
| `*`       | Highest    | Left          | 1     |
| `+`       | High       | Left          | 1     |
| `?`       | High       | Left          | 1     |
| `.`       | Medium     | Left          | 2     |
| `|`       | Lowest     | Right         | 2     |

- `*`、`+`、`?` 这仨的确也不需要进 `operator_stack`，因为 `a*`、`a+`、`a?` 天生就是 postfix。若扫描到这三个 operator，直接输出到 `output_queue` 即可
- 理论上 `|` 的 associativity 是 left 还是 right 其实无所谓，但代码中是按 right-associative 处理的

## 一个额外的翻译难点

原代码有这么两段，区别很微妙：

```c
if(natom > 1){
    --natom;
    *dst++ = '.';
}
```

```c
while(--natom > 0)
	*dst++ = '.';
```

微妙的原因是：无论是哪个 `case` 结束，`natom` 都不会 $> 2$，所以这两个 body 都至多只会执行一次。区别在 side effect 上，具体就是这个 `while(--natom > 0)`:

| `natom` before `while`   | no. execution | `natom` after `while` |
|-----------|------------|---------------|
| $-n$       | $0$    | $-(n+1)$          |
| $0$       | $0$       | $-1$         |
| $1$       | $0$       | $0$          |
| $2$       | $1$     | $0$          |
| $n$       | $n-1$    | $0$          |

| `natom` before `if`   | no. execution | `natom` after `if` |
|-----------|------------|---------------|
| $-n$       | $0$    | $-n$          |
| $0$       | $0$       | $0$         |
| $1$       | $0$       | $1$          |
| $2$       | $1$     | $1$          |
| $n$       | $1$    | $n-1$          |

总结一下就是：

- `if` 至多只输出一个 `.`，且它会保留 `natom >= 1`，暗示了 "后续还有继续 concat 操作的操作"
- `while` 至多也只输出一个 `.`，但它会清空 `natom = 0`，暗示了 "后续应该没有 concat 操作了"
    - 这个暗示在 "遇到 `|` 时" 触发，makes sense

## 成品

- [re2post.py](https://github.com/erikyao/regexp_demo/blob/main/src/re2post.py)
- [test_re2post.py](https://github.com/erikyao/regexp_demo/blob/main/tests/test_re2post.py)

注意目前有一个 bug (根源在原代码)：`a|` 是合法 input，但是 `|a` 和 `(a|)` 是非法的。