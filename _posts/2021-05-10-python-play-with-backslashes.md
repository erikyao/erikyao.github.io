---
layout: post
title: "Python: play with backslashes"
description: ""
category: Python
tags: [escape]
---
{% include JB/setup %}

最近研究 regular expression 顺便补了下 escape 的课 (参 [Escape Character / Control Character / Python Raw Strings / Python Bytes Literals](/compiler/2021/05/07/escape-character-control-character-python-raw-strings))，然后我今天就发现了 python 光一个 escape character `\` 就能玩出花儿，实验如下：

因为 python 不可能写出 `"\"` 这个 string (因为第二个引号被 escape 了，它会认为你的 string literal 没写完)，所以我们从 `"\\"` 开始：

实验一：

```python
>>> "\\"             # E.1-1
'\\'
>>> r"\\"            # E.1-2
'\\\\'
>>> str("\\")        # E.1-3
'\\'
>>> repr("\\")       # E.1-4
"'\\\\'"
>>> print("\\")      # E.1-5
\
>>> re.escape("\\")  # E.1-6
'\\\\'
```

然后我们让空格也来搅合一下：

实验二：

```python
>>> "\ "             # E.2-1
'\\ '
>>> r"\ "            # E.2-2
'\\ '
>>> str("\ ")        # E.2-3
'\\ '
>>> repr("\ ")       # E.2-4
"'\\\\ '"
>>> print("\ ")      # E.2-5
\ 
>>> re.escape("\ ")  # E.2-6
'\\\\\\ '
```

## 1. From a plain string literal to a `str` object: autoboxing?

先看 `E.2-1` 和 `E.2-3`。我们用 plain string literal 指代 "不带 prefix 的 string literal"。

首先，我觉得姑且可以认为 python 的 plain string literal 是会被 autobox 成一个 `str` object 的。这个 autoboxing 的过程中，string literal 中的 unrecognized escape sequence 按文档的说法是 "被原样保留" 的。依据 [The Python Language Reference » 2.4.1. String and Bytes literals](https://docs.python.org/3/reference/lexical_analysis.html#string-and-bytes-literals)：

> Unlike Standard C, all unrecognized escape sequences are left in the string unchanged, i.e., **the backslash is left in the result**.

但实验结果明显说明了，**在这个 autoboxing 过程中，unrecognized escape sequence 的 backslash 是被 escaped 的**，处理之后的 `str` (的形式、以及内容) 就脱离了 escape sequence 的结构了。

按 [The Python Standard Library » Built-in Types » Text Sequence Type — `str`](https://docs.python.org/3.8/library/stdtypes.html#text-sequence-type-str) 的说法：

> `class str(object='')`  
> `class str(object=b'', encoding='utf-8', errors='strict')`  
> <br/>
> If neither `encoding` nor `errors` is given, `str(object)` returns `object.__str__()`, which is the **“informal” or nicely printable string representation of object**. For string objects, this is the string itself. If object does not have a `__str__()` method, then `str()` falls back to returning `repr(object)`.

可能 python 认为 `"\ "` 不是一个 printable 的 string (因为 unrecognized)？

## 2. `print()`: `str` object 的形与义

按照前面一节的思路，我还是姑且认为 `print("xx")` 是先把 `"xx"` autobox 成了一个 `str` object，然后再打印出来。

可以看到，一旦涉及到了 escape sequence，`str` object 的 representation (字面表示，"形") 和它的 content (实际意义，"义") 就要分离出来看待。

`print()` 打印出的是 `str` 的义，后面我们也会了解到 `re.compile()` 要的也是 `str` 的义。

## 3. Raw string literals

这个简单，就是把 `\` 都 escape 的 string literal (然后再 autoboxing)。

`E.2-2` 中，escape `\` 得到 `"\\ "`，此时前面的 `"\\"` 已经是一个 recognized escape sequence 了，所以 autoboxing 没有额外的 escape 操作。

## 4. `str()` vs `repr()`

`repr()` 的话我们就可以脱离 `str` 的行为，上升到 `object` 去理解。

按 [Andrew Clark on What is the difference between __str__ and __repr__?](https://stackoverflow.com/a/1436721)

- `__repr__`: representation of python object usually `eval` will convert it back to that object
- `__str__`: is whatever you think is that object in text form

所以注意 `repr("\ ")` 得到的 `"'\\\\ '"` 里面还包了一层单引号，它其实是一个 python 语句被包裹成了一个 string。我们用 `eval()` 复原一下得到：

```python
>>> eval("'\\\\ '")
'\\ '
```

可见是复原成 autoboxed 的 string。

## 5. `re.escape()` 会 explicitly escape 空格

理论上说，空格不需要被 escape，但是 python regex 存在一种 verbose 的写法 (应该不是 python 的 extension，[perl 也有类似的写法](https://docstore.mik.ua/orelly/perl3/cookbook/ch06_05.htm))，搬运个 [Oliver Friedrich on Why re.escape escapes space](https://stackoverflow.com/a/32419915) 举的例子：

```python
r = re.compile(r"""a #match a
b #match b
c #match c
""", flags=re.VERBOSE)
```

> This last one would be compiled with `re.VERBOSE` and is a way to write your regex very fine readable in your sourcecode. **This regex would ignore the spaces completly** and therefore not match your case. With regex, always keep in mind, that everything that is not explicit, will fail some sunday morning at 3am.

相当于是个带 comment 的 pattern。这种写法下的空格 (比如 `a #match` 中的这个) 并不是 pattern 中的一部分。如果在这个写法中你要匹配空格，就要显示地 escape 空格：

```python
>>> r = re.compile(r"""a\ #match a with a space
... b\ #match b with a space
... c #match c
... """, flags=re.VERBOSE)
>>> r.match("a b c")
<re.Match object; span=(0, 5), match='a b c'>
```

- 注意 pattern 是个 raw string literal，所以写 `\ ` 就够了。

`re.escape()` 显然是考虑到了这一点，于是默认会 explicitly escape 空格。

我们回头再看 `E.2-6`：

- 首先是 `"\ "` 被 autobox 成了 `"\\ "`
- 前面的 `"\\"` 被 escape 成了 `"\\\\"`
- 后面的 `" "` 被 escape 成了 `"\\ "`
- 合并起来就是 `"\\\\\\ "`

## 6. 总结

我们用 $\ell$ 表示 plain string literal，用 $\operatorname{raw}(ell)$ 表示 raw string literal:

- $\ell:$ return autoboxed string **representation**
- $\operatorname{raw}(\ell): $ escape `\` in $\ell$, then autobox. return the string **representation**
- $\operatorname{str}(\ell): $ return autoboxed string **representation**
- $\operatorname{repr}(\ell): $ return a plain string literal $\ell'$ where $\operatorname{eval}(\ell') == \operatorname{str}(\ell)$
  - 注意是复原成 autoboxed 的 string **representation**
- $\operatorname{repr}(\ell): $ print out the autoboxed string **content**
- $\operatorname{re.escape}(\ell): $ escape all special characters in $\ell$, return the string **representation**
  - 那至于哪些 character 是 special character，我觉得你要去看源码，[文档](https://docs.python.org/3/library/re.html#re.escape)并没有讲
- $\operatorname{re.compile}(\ell): $ compile the autoboxed string **content**, return a `MatchObject`

这里我们就能看出为啥 `re.compile()` 的 pattern 的 escape 会把人绕晕，因为它要求的 $\ell$ 的义是 escape sequence，所以 $\ell$ 的形就必须是 escaped escape sequence.