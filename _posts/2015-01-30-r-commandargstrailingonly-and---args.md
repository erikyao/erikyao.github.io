---
layout: post
title: "R: <i>commandArgs(trailingOnly)</i> and <i>&#45;&#45;args</i>"
description: ""
category: R
tags: [R-101]
---
{% include JB/setup %}

R 的文档为什么就这么难看懂呢……

-----

看 _R Cookbook_ 用 `argv <- commandArgs(TRUE)` 来接收 `RScript` 命令的命令行参数，我就 `?commandArgs` 去查一下这个 TRUE 到底是啥意思：

> trailingOnly	logical. Should only arguments after _--args_ be returned?
> <br/>  
> If trailingOnly = TRUE, a character vector of those arguments (if any) supplied after _--args_.

很奇怪，这里的意思是带参数要先写 `--args` 吗？但是书上的例子没写也运行得好好的。我在 console 直接输入 `RScript` 并回车，打出的 usage 也没有 `--args` 这一项：

	$ Rscript
	Usage: /path/to/Rscript [--options] [-e expr [-e expr2 ...] | file] [args]

没办法，只有试验下了，我们写一个 printArgv.R：

<pre class="prettyprint linenums">
argv &lt;- commandArgs(TRUE)
print(argv)

print("-----")

argv &lt;- commandArgs(FALSE)
print(argv)
</pre>

然后运行 `Rscript printArgv.R 2 3`

	$ Rscript printArgv.R 2 3
	[1] "2" "3"
	[1] "-----"
	[1] "e:\\R\\R-3.1.0\\bin\\x64\\Rterm.exe" "--slave"
	[3] "--no-restore"                        "--file=printArgv.R"
	[5] "--args"                              "2"
	[7] "3"
	
可见，`--args` 是 R 自己扩展上去的，我们把参数 `2 3` 写在末尾它会自动被扩展成 `--args 2 3`，然后 `commandArgs(TRUE)` 的逻辑就说得通了。另外，我们自己是不需要输入 `--args` 的，否则会被识别成一个字符串参数，i.e. 变成 `--args --args 2 3` 这样。