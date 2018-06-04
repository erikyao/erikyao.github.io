---
layout: post
title: "R Debugging"
description: ""
category: R
tags: []
---
{% include JB/setup %}

## 1. log

* message(): 单纯打 log
* warning(): 单纯打 log
* stop(): 打 log 并终止运行，表示错误级别是 error
	* 或者说是 "终止程序并显示错误信息"
	* 比如我定义一个 `divide <- function(a, b)`，里面写了句 `if (b = 0) stop("cannot divide by 0")`，然后调用 `divide(5, 0)`，会出一句：`Error in divide(5, 0) : cannot divide by 0`

## 2. invisible()

这个不算是 debug 的功能，但是可以减少 return 的输出。`return(invisible(x))` 的作用就是避免出现 `return(x)` 时把 x 打出来的效果，按文档的说法是：

> Return a (temporarily) invisible copy of an object.

或者：

> Change the Print Mode to Invisible.

尤其是在已经有调用 `print()` 或者 `message()` 的函数里比较使用。

## 3. suppressWarnings: 去掉 warning

注意用法：比如你调用 `x <- foo(bar)` 时 foo 产生了 warning，想去掉 warning 就可以把 `foo(bar)` 整个放到 suppressWarnings 里，变成这样：`x <- suppressWarnings(foo(bar))`，有点像 `system.time()` 的用法。

## 4. traceback(): prints out the function call stack after an error occurs; does nothing if there’s no error

比如你定义了：

```r
foo <- function() {
	stop("this function is evil")
}

bar <- function() {
	foo()
}

main <- function() {
	bar()
}
```

调用后并 traceback 的效果是：

```r
> main()
 Show Traceback
 
 Rerun with Debug
 Error in foo() : this function is evil 

> traceback()
4: stop("this function is evil") at #2
3: foo() at #2
2: bar() at #2
1: main()
```

注意这个有时效性，有点像一个 error stack，永远只能看最近发生的一个 error，如果调用 `foo` 之后还有其他的 error 发生，这个 traceback 就看不到 `foo` 的 error 了

## 5. debug()

`debug(函数名)` 表示 "我要对这个函数 debug"，然后你调用这个函数时就进入 debug 模式了，出现 browser prompt

## 6. Browser Prompt Command

browser 可以理解成 debug 的环境，browser prompt 就是 browser 的命令行，具体的命令有：

* help: print this list of commands
* where: print a stack trace of all active function calls
* c/cont: exit the browser and continue execution at the next statement
* Q: exit the browser and the current evaluation and return to the top-level prompt.
* f: finish execution of the current loop or function
* n: evaluate the next statement, stepping over function calls
* s: evaluate the next statement, stepping into function calls

## 7. recover 模式

设置成 recover 模式后，error 时系统会自动提示修改方案，比如：

```r
> options(error = recover)
> read.csv("nosuchfile")
Error in file(file, "rt") : cannot open the connection
In addition: Warning message:
In file(file, "rt") :
  cannot open file ’nosuchfile’: No such file or directory

Enter a frame number, or 0 to exit

1: read.csv("nosuchfile")
2: read.table(file = file, header = header, sep = sep, quote = quote, dec =
3: file(file, "rt")

Selection:
```
