---
layout: post
title: "R: Quasiquotation"
description: ""
category: R 
tags: []
---
{% include JB/setup %}

## 1. An example of statement evaluation

我们还是按 [R: dive into types](/r/2018/11/30/r-dive-into-types) 里提到的标准：

- An expression contains one or more statements.
- A statement is a syntactically correct collection of tokens.

在 console 里，输入一个 statement 之后，这个 statement 并没有被 evaluate；按下回车之后才会被 evaluate：

```r
> x <- 1
> y <- 2
> x + y  # This is an unevaluated statement
[1] 3    # Above statement is evaluated to a value, 3, after hitting ENTER
```

我们细化上面 evaluate `x + y` 的过程，回忆编译原理的知识，它其实包括这么几步：

1. 构建 AST (Abstract Syntax Tree): $$\langle + \rangle \left\{\begin{matrix} x \\ y \end{matrix}\right.$$
1. 将 symbol 替换 (substitute) 成 value
    - 将 `x` 替换成 `1`，`y` 替换成 `2`
1. 根据 AST 和 value 计算这个 statement 应该 evaluate 成什么值
    - `1 + 2` 得到 `3`

当然，更复杂的 statement 处理起来会有点不一样 (比如递归调用函数)，我们这里就用 `x + y` 举例。查看 AST 可以用下面两种方式：

```r
> pryr::ast(x + y)
\- ()
  \- `+
  \- `x
  \- `y 
> lobstr::ast(x + y)
█─`+` 
├─x 
└─y 
```

## 2. Quasiquotation

Quasiquotation 的意图就是深入这个 evaluation 的过程，让你获得更大的控制权。它包含两大类操作:

- quotation: 获取 unevaluated expression.
- unquotation: selectively evaluate parts of an unevaluated expression.

quasi- 念 [ˈkweɪ.zaɪ]，意思是:

> used to show that something is almost, but not completely, the thing described

翻译成中文大概是类似 quasi conductor "半导体" 的 "半-"、"准-"、"拟-" 这类的前缀。

我不太清楚它为什么要用 "quotation" 这个词，虽然它主要解决的一个大问题就是：有引号和没引号的区别？比如：

- 为何 `library(purrr)` 和 `library("purrr")` 都可以？
- 为何 `plot(x, y)` 它知道 x-label 是 string `"x"`, y-label 是 string `"y"`? (使用的是 `deparse()`，但是我们下面不讲这个)
- 为何 `dplyr:select(df, x)` 的 `x` 不用写引号？ 你这里 `x` 又不是 variable

与之相关的一个概念是 Non-Standard Evalution (NSE)。其实这个词有点 misleading。它的 non-standard 并不是说它 evaluation 的**结果**, 并不是说 standard 是 evaluate 成 5 你 non-standard 就 evaluate 成 6，而是指 evaluation 的**场合**：你自己手动去 evaluate 的，不是 interpreter 自己去 evaluate 的，那就是 non-standard evaluation。

## 3. Base API: `base::quote()` / `base::substitute()` / `base::bquote()`

[R: dive into types](/r/2018/11/30/r-dive-into-types) 里已经表明：`base::quote()` 的作用就是 quotation，获取 statement 并强制不 evaluate。需要注意的是，虽然文档说 `base::quote()` 是 capture expression，但实际上它没有办法处理多个 statements，因为它只能接收一个参数 (如果要 capture 多个 statements，你需要用 `base::expression()`)：

```r
> x <- 1
> y <- 2
> base::quote(x + y)
x + y
> base::quote(x + y, x * y)
Error in quote(x + y, x * y) : 
  2 arguments passed to 'quote' which requires 1
> base::expression(x + y, x * y)
expression(x + y, x * y)
```

`base::substitute()` 的作用就是将 expression AST 里的 symbol 替换成 value，它仍然返回一个 expression，并不会 evaluate 成一个值。`base::substitute(x, env)` 替换的逻辑是：

```r
base::substitute <- function(expr, env) {
    if (env == NULL) {
        env <- the current evaluation environment
    }

    if (env == .GlobalEnv) {
        return(expr)  # Do not substitute; return as is 
    }

    ret_expr <- expr
    foreach (symbol in expr) {
        if (env$symbol != NULL) { # symbol 存在于 env 中；也称 symbol is bound to env 
            update(ret_expr, symbol => env$symbol)  # 将 symbol 替换成 value
        }
    }
    return(ret_expr)
}
```

需要注意的是：`base::substitute()` 仍然只能接收一个 expression 参数：

```r
> x <- 1
> y <- 2
> base::substitute(x + y)  # default to current evaluation environment, which happens to be .GlobalEnv here
x + y
```

```r
> env <- new.env()
> env$x <- 100
> env$y <- 200
> base::substitute(x + y, env)
100 + 200
```

`base::bquote()` is a slightly more flexible form of `base::quote()`: it allows you to optionally quote and unquote (i.e. substitute) some parts of an expression (it’s similar to the **backtick** operator in _Lisp_). Everything is quoted, unless it’s encapsulated in `.()`. 注意 `base::bquote(expr, where = parent.frame())` 默认的 `env` 是 `parent.frame()`，而且它没有 `base::substitute()` 那个 `if (env == .GlobalEnv)` 的逻辑：

```r
> x <- 1
> y <- 2
> base::bquote(x + y)
x + y
> base::bquote(.(x) + y)
1 + y
> base::bquote(.(x) + .(y))
1 + 2
```

```r
> env <- new.env()
> env$x <- 100
> env$y <- 200
> base::bquote(.(x) + .(y), env)
100 + 200
```

## 4. `rlang` API: `rlang::expr()` / `rlang::enexpr()` / `rlang::quo()` / `rlang::enquo()`

`rlang::expr()` 可以看做是 `base::bquote()` 的翻版，只是它不用 `.()` 而是用 `rlang::UQ()`；然而在 `rlang` 0.3.0 之后，`rlang::UQ()` is deprecated，被 `!!` (读作 bang-bang) 取代：

```r
> x <- 1
> y <- 2
> rlang::expr(x + y)
x + y
> rlang::expr(rlang::UQ(x) + y)
1 + y
> rlang::expr(rlang::UQ(x) + rlang::UQ(y))
1 + 2
> rlang::expr(!!x + y)
1 + y
> rlang::expr(!!x + !!y)
1 + 2
```

还有一个 plural 的版本 `rlang::exprs()`：

```r
> rlang::exprs(!!x + !!y, !!x * !!y)
[[1]]
1 + 2

[[2]]
1 * 2
```

`rlang::enexpr(x)` 可以看做是 `rlang::expr(!!x)`，它只能 substitute single symbol，并不能处理 statement：

```r
> rlang::enexpr(x)
[1] 1
> rlang::enexpr(x + y)
Error: `arg` must be a symbol
```

它同样也有一个 plural 的版本：

```r
> rlang::enexprs(x, y)
[[1]]
[1] 1

[[2]]
[1] 2
```

我唯一感到不解的是：`rlang::expr()` 貌似是直接用 `rlang::enexpr()` 实现的，但是 `rlang::expr()` 可以处理 statement 而 `rlang::enexpr()` 就只能处理 symbol：

```r
> rlang::expr
function (expr) 
{
    enexpr(expr)
}
<bytecode: 0x91bfe80>
<environment: namespace:rlang>
> rlang::enexpr
function (arg) 
{
    .Call(rlang_enexpr, substitute(arg), parent.frame())
}
<bytecode: 0x553d938>
<environment: namespace:rlang>
```

实现的细节我不想再深究了，知道它们的用法就好。

`rlang::quo()`/`rlang::enquo()` 相当于是 `rlang::expr()`/`rlang::enexpr()` 的 quosure 版本。所谓 quosure 就是 "quotation closure"，本质上等于 "expression + environment"：

```r
> x <- 1
> y <- 2
> rlang::quo(x + y)
<quosure>
expr: ^x + y
env:  global
> rlang::quo(!!x + y)
<quosure>
expr: ^1 + y
env:  global
> rlang::quo(!!x + !!y)
<quosure>
expr: ^1 + 2
env:  global
> rlang::quos(!!x + !!y, !!x * !!y)
<listof<quosures>>

[[1]]
<quosure>
expr: ^1 + 2
env:  global

[[2]]
<quosure>
expr: ^1 * 2
env:  global
```

```r
> rlang::enquo(x)
<quosure>
expr: ^1
env:  empty
> rlang::enquos(x, y)
<listof<quosures>>

[[1]]
<quosure>
expr: ^1
env:  empty

[[2]]
<quosure>
expr: ^2
env:  empty
```

## 5. `dplyr` API: `dplyr::quo()` / `dplyr::enquo()`

`rlang` 是 `dplyr` 的 backbone，所以：

- `dplyr::quo()` == `rlang::quo()` 
    - `dplyr::quos()` == `rlang::quos()`
- `dplyr::enquo()` == `rlang::enquo()` 

但是不存在 ~~`dplyr::expr()`、`dplyr::enexpr()` 和 `dplyr::enquos()`~~

## 6. Unpacking Named Arguments in `dplyr`

`dplyr::rename(df, new_col = old_col)` 可以更改 colname；`dplyr::select(df, x_prime = x)` 相当于 `select x as x_prime from df`。这种需要 named arguments 的 `dplyr` 函数都可以用类似 python 的 `**` 的 unpack 写法，但是要注意，`!!!named_vector` 或者 `!!!named_list` (bang-bang-bang) 才相当于 `**dict`，而不应该用 `!!named_vector` 或者 `!!named_list` (bang-bang)。

- 注意顺序，LHS 是 new colname，RHS 是 old colname，非常别扭

这是因为，比如用下面这个例子，如果你用 `!!vars` 的话，你的 **`vars` 是被当做单个 statement 处理的**；而且 substitute 之后 name 会消失 (我还不知道这是为何)：

```r
> vars <- c(var1 = "cyl", var2 = "am")
> rlang::expr(dplyr::select(mtcars, !!vars))
dplyr::select(mtcars, c("cyl", "am"))
> dplyr::select(mtcars, c("cyl", "am"))
                    cyl am
Mazda RX4             6  1
Mazda RX4 Wag         6  1
Datsun 710            4  1
...                   .  .
```

用 AST 表示的话，就相当于 $$\text{!!vars} \left\{\begin{matrix} \text{c("cyl", "am")} \end{matrix}\right.$$

```r
> lobstr::ast(select(mtcars, c("cyl", "am")))
█─select 
├─mtcars 
└─█─c 
  ├─"cyl" 
  └─"am" 
```

如果用 `!!!vars` 的话，**`vars` 中的每个元素都会被当做一个 statement**，所以就类似于 $$\text{!!!vars} \left\{\begin{matrix} \text{var1 = "cyl"} \\ \text{var2 = "am"} \end{matrix}\right.$$，然后这颗 AST 会被嫁接到 `select()` 的 AST 的叶子上：

```r
> vars <- c(var1 = "cyl", var2 = "am")
> rlang::expr(dplyr::select(mtcars, !!!vars))
dplyr::select(mtcars, var1 = "cyl", var2 = "am")
> dplyr::select(mtcars, !!!vars)
                    var1 var2
Mazda RX4              6    1
Mazda RX4 Wag          6    1
Datsun 710             4    1
...                    .    .
```

```r
> lobstr::ast(select(mtcars, var1 = "cyl", var2 = "am"))
█─select 
├─mtcars 
├─var1 = "cyl" 
└─var2 = "am"
```

另外还有一点：`dplyr` 里 named argument 是可以不写引号的，也就是说可以用 `var1 = cyl` 而不用 `var1 = "cyl"`。如果想要 substitute 出这种不写引号的效果，可以用 `rlang::sym()` 显式指定 RHS 是 symbol： 

```r
> vars <- c(var1 = rlang::sym("cyl"), var2 = rlang::sym("am"))
> rlang::expr(dplyr::select(mtcars, !!!vars))
dplyr::select(mtcars, var1 = cyl, var2 = am)
> dplyr::select(mtcars, var1 = cyl, var2 = am)
                    var1 var2
Mazda RX4              6    1
Mazda RX4 Wag          6    1
Datsun 710             4    1
...                    .    .
```