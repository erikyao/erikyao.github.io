---
category: Python
description: ''
tags: []
title: 'Python: Bitwise Inverse Operator vs Complements vs Nagatives'
---

参考 [Stack Overflow: How does the bitwise complement operator (~ tilde) work? Answer by Anthony](https://stackoverflow.com/a/791340/11640888)。

这三个概念总是容易搞混，但其实只要记住：

- `~` 用于 `int` 就是 bitwise inverse **操作**，也就 flip **操作**，它的本质是一个 **operator**，完成一个**操作**
- 通过 `~` 操作 (或者在其基础上还有额外的操作) 得到 inversed bit string，我们给它起个**名字**，叫 complement
- 那我们得到这个 complement，它 **represent** 什么？machine 如何把它 **interpret** 成负数？那是解析器/编译器的问题

你把 "操作 => 产物 => 解析" 分开考虑，概念就简单了。

## 1. Bitwise Inverse

假定 `int x` 的 bit string (假定是 4-bit machine) 是 $\langle b_0, b_1, b_2, b_3 \rangle$ (暂不考虑符号 bit 的问题)，那我一定有：

$$
\mathord{\sim} x = \langle \overline{b_0}, \overline{b_1}, \overline{b_2}, \overline{b_3} \rangle
$$

## 2. Complements

我们定义：

1. For any given integer `x`, `~x` is called **One's Complement** of `x`
2. For any given integer `x`, `~x + 1` is called **Two's Complement** of `x`

## 3. Negatives

某些语言中，负数 `-x` 的 bit string 会被直接定义成 `x` 的 one's complement，i.e. $-x := \mathord{\sim} x$。但在 python 中，负数 `-x` 是用 two's complement 定义的，i.e.

$$
-x := \mathord{\sim} x + 1
$$

所以从代码层面，永远有 `~x == -(x+1)`。

这个特性在某些情况下刚好可以用来做 "head、tail 两指针"，比如我要通过 swap 来 reverse 一个 array:

```python
def swap_reverse(array):
    for i in range(len(array) // 2):
        array[i], array[~i] = array[~i], array[i]
```

- when `i == 0`, we have `~i == -1`, and `array[~i]` is the last element
- when `i == 1`, we have `~i == -2`, and `array[~i]` is the second but last element
- 依此类推