---
category: Python
description: ''
tags: []
title: 'Python: <i>and/or</i> Operators on Objects'
---

今天才发现如果是两个 objects 做 `and` 或者 `or` 的时候，返回的不是 boolean 而是 object。

- P.S. 如果你是在 `if` 语句里，那么返回的这个 object 会继续被 evaluate 成 boolean。但你不能因此认为 `and` 或者 `or` 操作是一定返回 boolean 的

所以逻辑上有：

```python
c = a and b

    # IS EQUIVALENT TO

c = b if a else a
```

```python
c = a or b

    # IS EQUIVALENT TO

c = a if a else b
```

这是 high level 的逻辑 (这其实是逻辑电路实现！)，包含了 boolean 的 `and`、`or` 逻辑，你仔细体会一下：

- `c = a and b`
    - 当 `a == True` 时，`c` 的 True/False 取值与 `b` 的 True/False 取值同步，相当于 `c == b`
    - 当 `a == False` 时，由于 Short-Circuit Evaluation，我们以前一直是说直接得到 `c == False`，但其实也可以说是 `c == a`
- `c = a or b`
    - 当 `a == True` 时，由于 Short-Circuit Evaluation，我们以前一直是说直接得到 `c == True`，但其实也可以说是 `c == a`
    - 当 `a == False` 时，`c` 的 True/False 取值与 `b` 的 True/False 取值同步，相当于 `c == b`

那这个逻辑用在 object 赋值上，就相当于是个 `... = ... if ... else ...` 语句语法糖：

```python
list_a = ...
list_b = ...

list_c = list_a and list_b  # 如果 list_a 不空，取 list_b；否则返回空 list (i.e. list_a)

list_c = list_a or list_b  # 如果 list_a 不空，取 list_a；否则取 list_b
```

明显 `or` 要好理解一点，用 `and` 我觉得还不如老实写 `... = ... if ... else ...`