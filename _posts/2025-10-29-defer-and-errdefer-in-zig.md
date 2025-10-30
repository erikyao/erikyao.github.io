---
title: "`defer` and `errdefer` in Zig"
description: ""
category: Zig
tags: []
toc: false
toc_sticky: false
---

这俩 keywords 在 [Zig Language Reference](https://ziglang.org/documentation/master/) 中的解释着实不太好，我这里补充一下。

# 1. 重点在于 **"register"**，而不是 **"execute"**

[Zig Language Reference](https://ziglang.org/documentation/master/) 对 `defer` 的解释是：

> Executes an expression unconditionally at scope exit.

就很生硬。

`defer` 的作用其实是：

> Register an expression to be executed when the scope exits for whatever reason.

同理 `errdefer` 的作用可以解释为：

> Register an expression to be executed when the scope exits due to an error.

你也可以理解成：

- `defer { ... }` == `on_scope_exit { ... }` 
- `errdefer { ... }` == `on_scope_error { ... }`

# 2. `defer` 和 `errdefer` statements 需要被执行到才算 register 成功

如果 `defer` 和 `errdefer` 还没有被执行到，scope 就 exit 了 (比方说在 `defer` 和 `errdefer` 之前就 error 了)，那这个 registration 是不成功的，`defer` 和 `errdefer` 所接的 expression 也不会被执行。

# 3. scope exists 有哪些方式？

- 正常执行完
- `return`
- `break`
- due to an error
