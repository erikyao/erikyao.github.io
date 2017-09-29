---
layout: post
title: "Python: <i>try-except-else-finally</i>"
description: ""
category: Python
tags: [Python-101]
---
{% include JB/setup %}

Python 的 `try-except-finally` 和 Java 的 `try-catch-finally` 其实是一样的，烦就烦在中间那个 `else` 上：

```python
try:
    Try-block
except exception1:
    Exception1-block
except exception2:
    Exception2-block
else:
    Else-block
finally:
    Finally-block
```

`Else-block` 的执行条件是：`Try-block` 正常执行完，没有 raise exception。换言之，如果 `Exception1-block-1` 或者 `Exception1-block-2` 执行了，`Else-block` 就不会执行。

然后 `Else-block` （如果被成功触发的话）会先于 `Finally-block` 执行。

`Finally-block` 是不 care 你有没有 raise exception 的，它永远都会执行。

2017-09-28 补充：注意 `Else-block` 的作用是 helps you minimize the amount of code in `Try-block` and improves readability. 相当于 `Try-block` 只写有可能抛异常的语句，其后的不抛异常的语句（比如 return）可以扔到 `Else-block`。但我觉得这么写其实非常不直观……