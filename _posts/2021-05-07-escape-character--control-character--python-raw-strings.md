---
category: Compiler
description: ''
tags:
- escape
title: Escape Character / Control Character / Python Raw Strings / Python Bytes Literals
---

这么多年了，我终于决定要探一探这个 "escape" 到底是啥意思。看了一圈下来，这些概念虽然说不上是乱成一锅粥，但的确够喝一壶的了。

## Escape / Escape Character

我们先看下 escape 的意思。根据 [两仪识：为啥叫 escape character 呢？这里的 escape 如何理解比较好？](https://www.zhihu.com/question/41364226/answer/90676139):

> 你看键盘上的 Esc 键也是 Escape  
> <br/>
> 这个键是 1960 年 IBM 码农 Bob Bemer 设计出来的，目的是在不同机器码之间切换  
> 后来逐渐变成了跳出当前环境（比如录入数据）开始输入控制命令的开关  
> 所以这些控制命令被称为 escape sequence  
> <br/>
> 再后来控制命令越来越多，不一定是 Esc 键开始了，用 `\` 之类的  
> 于是用来表示 escape sequence 开始的那个字符就叫做 escape character  
> 而现在使用的转义字符也都是从当年特定的控制操作来的，所以名称一直沿用  

用 vim 举例子最好不过。参照 [Vim Editor Modes Explained](https://www.freecodecamp.org/news/vim-editor-modes-explained/):

- 启动 vim 默认是 normal mode
  - 此时按 `h`, `j`, `k`, `l` 可以移动 cursor，另有其他的一些定位的功能
- 在 normal mode 下按 `i` 进入 insert mode
  - 此外按 `a` 是 append mode
- 在 insert mode 下按 `Esc` 退出 insert mode，返回 normal mode
- 在 normal mode 下按 `:` 进入 command mode

那这里 "按 `Esc`" 就是 escape from the current mode 的意思。

因为 vim 只接收字符，我们可以把 vim 想象成一个 tokenizer，比如 vim 可能接收一串 `iHello,world!<Esc>:wq`，它能很清楚地解析出中间那串 `Hello,world!`:

| normal mode | insert mode     | normal mode | command mode |
|-------------|-----------------|-------------|--------------|
| `i`         | `Hello, world!` | `<Esc>`     | `:wq`        |

这个过程和 python string 的 tokenize 的过程是类似的。严谨一点，我们上 python string literal 的 lexical definitions:

```php
stringliteral   ::=  [stringprefix](shortstring | longstring)
stringprefix    ::=  "r" | "u" | "R" | "U" | "f" | "F"
                     | "fr" | "Fr" | "fR" | "FR" | "rf" | "rF" | "Rf" | "RF"
shortstring     ::=  "'" shortstringitem* "'" | '"' shortstringitem* '"'
longstring      ::=  "'''" longstringitem* "'''" | '"""' longstringitem* '"""'
shortstringitem ::=  shortstringchar | stringescapeseq
longstringitem  ::=  longstringchar | stringescapeseq
shortstringchar ::=  <any source character except "\" or newline or the quote>
longstringchar  ::=  <any source character except "\">
stringescapeseq ::=  "\" <any source character>
```

- The **source character** set is defined by the encoding declaration; it is `UTF-8` if no encoding declaration is given in the source file.

为了方便描述，我们简化一下局面：

```php
stringliteral ::=  shortstring
shortstring   ::=  '"' shortstringitem* '"'
```

- 即只考虑无前缀的 `shortstring` 
- 限定只能使用 `"`

然后我们加上 `leftquote` 和 `rightquote` 这两种 term：

```php
leftquote     ::=  '"'
rightquote    ::=  '"'  # when leftquote is present
shortstring   ::=  leftquote shortstringitem* rightquote
stringliteral ::=  shortstring
```

这么一来 `"` 就有可能被识别成：

- `leftquote`, or
- `rightquote`, or
- `shortstringchar` (因为 `"` 也隶属于 source character)

看个例子。假设有一个 string `"Hi!"`，解析起来就是：

| leftquote | shortstringchar* | rightquote |
|-----------|------------------|------------|
| `"`       | `Hi!`            | `"`        |

得到的是这么一个格式：

$$
\begin{aligned}
\operatorname{stringliteral} &= \operatorname{shortstring} \newline
                             &= \operatorname{leftquote} + \operatorname{shortstringitem*} + \operatorname{rightquote}  \newline
                             &= \operatorname{leftquote} + \operatorname{shortstringchar*} + \operatorname{rightquote}  
\end{aligned}
$$

那如果我们需要在 stirng 内部显示一个 quote，就要避免它被识别成 `leftquote` 或者 `rightquote`，换言之，我们要 **make this quote escape from `leftquote` or `rightquote` term**。

我们可以通过在 string 内部给这个 quote 加上 escape character 来实现这个目的。比如 `"Say \"Hi\""`: 

| leftquote | shortstringchar* | stringescapeseq | shortstringchar* | stringescapeseq | rightquote |
|-----------|------------------|-----------------|------------------|-----------------|------------|
| `"`       | `Say `           | `\"`            | `Hi!`            | `\"`            | `"`        |

得到的是这么一个格式：

$$
\begin{aligned}
\operatorname{stringliteral} &= \operatorname{shortstring} \newline
                             &= \operatorname{leftquote} + \operatorname{shortstringitem*} + \operatorname{rightquote}  \newline
                             &= \operatorname{leftquote} + \operatorname{shortstringchar*} + \operatorname{stringescapeseq} + \operatorname{shortstringchar*} + \operatorname{stringescapeseq} +\operatorname{rightquote}  
\end{aligned}
$$

同理，如果我们定义：

```php
escapecharacter ::= '\'
```

那么 `\\` 就是 **make `\` escape from `escapecharacter` term**.

还有一类 escape sequence 是要 **esacape from `shortstringchar` term**，比如 `\n`, `\r`, `\t`.

这些行为联合起来，escape character `\` 的作用会被统一解释成：invokes an alternative interpretation on the following characters，但从 compiler 的角度来看，应该解释成：make the following character escape from being recognized as certain term:

- `\'`, `\"`: escape from being recognized as starting/ending quotes of strings
- `\\`: escape from being recognized as the escape character (有点绕 :joy:)
- `\n`, `\r`, `\t`: escape from being recognized as source characters

最后说下 "escape the character $c$" 这种句式。老实说，我觉得这句话语法上是讲不通的，因为 escape 这个词没有这种用法。我只能理解成老外把它引申成了：

- to put an escape character before $c$
- thus making $c$ escape from being recognized as...

## Control Character

Control character 是一个相关的概念。根据 [Wikipedia: Control character](https://en.wikipedia.org/wiki/Control_character):

> In computing and telecommunication, a **control character** or **non-printing character (NPC)** is a code point (a number) in a character set, that does not represent a written symbol. They are used as [in-band signaling](https://en.wikipedia.org/wiki/In-band_signaling) to cause effects other than the addition of a symbol to the text. All other characters are mainly printing, printable, or [graphic characters](https://en.wikipedia.org/wiki/Graphic_character), except perhaps for the "space" character (see [ASCII printable characters](https://en.wikipedia.org/wiki/ASCII_printable_characters)).

那我最熟悉的就是 C 里的 `\0` 了。注意这里 `\0` 本质是一个 octal escape sequence，表示八进制的 `0`。

[Wikipedia: Escape character](https://en.wikipedia.org/wiki/Escape_character) 又说：

> Generally, an escape character is not a particular case of (device) control characters, **nor** vice versa.  
> ...  
> In many programming languages, an escape character also forms some escape sequences which are referred to as control characters. For example, line break has an escape sequence of `\n`.

总结一下：

- escape character 和 control character 最大的区别是：前者是 printable，后者是 non-printable
- 但是 escape sequence 可以是 non-printable 的，比如 `\n`
- 某些 escape sequence 可以看做是一个 control character，比如 `\n`

## Raw Strings in Python

python 的 interpreter 有足够聪明，如果它遇到一个 `stringescapeseq`，它会判断说这个到底是不是一个合法的 escape sequence，如果不是的话，它会自动 escape `\`，比如下面的 `\c`：

```python
>>> "\a"
'\x07'
>>> "\b"
'\x08'
>>> "\c"
'\\c'
```

- 是不是很惊喜 `\a` 和 `\b` 都是 escape sequence？
    - 假如有个 Windows 的 path `C:\Program Files\apps`，你得写成 `"C:\Program Files\\apps"` (已知 `\P` 不是 escape sequence)
    - 或者秉持 **defensive programming** 的原则，我们应该写成 `"C:\\Program Files\\apps"`
- 至于哪些 `stringescapeseq` 是 escape sequence，这是 programming language 自己决定的，你也可以认为是 compiler/interpreter-specific 的

用 raw string 的好处就是：它天生 escape 了 `\`。raw string 的 prefix 是 `r`，所以 `r` 后面接的 `shortstring|longstring` 有一种 "所见即所想" 的效果，比如：

```python
>>> r"\a"
'\\a'
>>> r"\b"
'\\b'
>>> r"\c"
'\\c'
>>> r"C:\Program Files\apps"
'C:\\Program Files\\apps'
```

主要还是用起来方便，免得你自己动手去 escape.

## 题外话：Bytes Literals in Python

```php
bytesliteral   ::=  bytesprefix(shortbytes | longbytes)
bytesprefix    ::=  "b" | "B" | "br" | "Br" | "bR" | "BR" | "rb" | "rB" | "Rb" | "RB"
shortbytes     ::=  "'" shortbytesitem* "'" | '"' shortbytesitem* '"'
longbytes      ::=  "'''" longbytesitem* "'''" | '"""' longbytesitem* '"""'
shortbytesitem ::=  shortbyteschar | bytesescapeseq
longbytesitem  ::=  longbyteschar | bytesescapeseq
shortbyteschar ::=  <any ASCII character except "\" or newline or the quote>
longbyteschar  ::=  <any ASCII character except "\">
bytesescapeseq ::=  "\" <any ASCII character>
```

- `bytesliteral` 的构成和 `stringliteral` 类似，但是一定要有 1 个 `bytesprefix`