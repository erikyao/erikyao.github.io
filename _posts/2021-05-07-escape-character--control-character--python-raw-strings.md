---
layout: post
title: "Escape Character / Control Character / Python Raw Strings / Python String and Bytes Literals"
description: ""
category: Compiler
tags: [escape]
---
{% include JB/setup %}

这么多年了，我终于决定要探一探这个 "escape" 到底是啥意思。看了一圈下来，这些概念虽然说不上是乱成一锅粥，但的确够喝一壶的了。

## Escape / Escape Character

我们先看下 escape 的意思。[Sean on What does backslash “\” escape character really escape?](https://softwareengineering.stackexchange.com/a/112733):

> The backslash is used as a marker character to tell the compiler/interpreter that the next character has some special meaning. What that next character means is up to the implementation. For example C-style languages use `\n` to mean newline and `\t` to mean tab.  
> <br/>
> The use of the word "escape" really means to temporarily escape out of parsing the text and into another mode where the subsequent character is treated differently.

我觉得这段总结得挺好。但看几个例子就会发现这个 "another mode" 的行为并不统一：

- `\'`, `\"`, and `\\`
  - Enter a new mode where `'`, `"`, and `\` are literals
    - 即不会被理解成 `单引号 which ends the string`, `双引号 which ends the stirng`, 以及 `escape character`
  - The new mode quits after receiving one character
- `\n`, `\r`, and `\t`
  - Enter another new mode where `n`, `r`, and `t` are **NOT** literals
  - The new mode also quits after receiving one character
- 或者你可以认为这两个 mode 隶属同一个大的 mode

根据 [Wikipedia: Escape character](https://en.wikipedia.org/wiki/Escape_character)，the functions of escape sequences include:

- To represent characters, referred to as **character quoting**, which cannot be typed in the current context, or would have an undesired interpretation. 
  - In this case, an **escape sequence** is a **digraph** consisting of an **escape character** itself and a **"quoted" character**.
    - A diagraph is a sequences of two characters, that should be treated as if it is a single character, according to a programming language's specification.
- To encode a syntactic entity, which cannot be directly represented by the alphabet.

这个总结和我们的观察是一致的。更简略一点来说，escape 的作用是：

- De-specialize metacharacters into literals
- Encode literals into special characters

这两种行为的矛盾之处可能是造成我没有牢记 escape 作用的原因 (contradicting intuitions)。

舍弃静态上的功能的不同，我觉得动态地记忆 escape 更方便：

- 举个例子，即不要把 `\n` 理解成单个的字符，而是看成 "enter another mode; input `n`" 这个动态的过程
  - 类似于输入 `shift + 5` 得到 `%` 一样
  - 或者类比于 vim 的 `:q` 命令
- 从英语语法的角度来看，"escape a character $c$" 的意思就是 "put $c$ into the new mode"

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

## Raw Strings in Python

你看到 `"\t"` 或者 `"\n"` 这样的字符，你会很敏感，知道它们是 escape sequence。如果我就要输出 literal `\t` 和 `\n`，那就需要 escape `\` 变成 `"\\t"` 和 `"\\n"`。

但你看到 `"\a"` 和 `"\b"` 呢？你不会那么敏感，但其实它们也是 escape sequence (但是 `"\c"` 又不是)：

```python
>>> "\a"
'\x07'
>>> "\b"
'\x08'
>>> "\c"
'\\c'
```

python 的 string literal 在 "输入了 `\` 但无法构成 escape sequence" 的时候会自动 escape `\`，但你不应该依赖这个行为，因为你不知道到底 escape sequence 到底有哪些。

用 raw string 的好处就是：它天生 escape 了 `\`。这是一种 **defensive programming**。raw string 的 prefix 是 `r`，比如：

```python
>>> r"\a"
'\\a'
>>> r"\b"
'\\b'
>>> r"\c"
'\\c'
```

## 题外话：String and Bytes Literals in Python

```ebnf
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

简单说就是：

- `(long|short)stringchar` 的 sequence 构成 `(long|short)stringitem`
- `(long|short)stringitem` 加上引号构成 `(long|short)string`
- `stringliteral` 就是 0 个或者 1 个 `stringprefix` 拼接一个 `(long|short)string`
- `bytesliteral` 的构成类似，但是一定要有 1 个 `bytesprefix`
  