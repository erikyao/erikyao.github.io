---
layout: post
title: "R Profiling"
description: ""
category: R
tags: [R-101]
---
{% include JB/setup %}

## system.time()

用法是把待测量的代码放到括号里，可以加一对 `{}` 包起来，比如：

<pre class="prettyprint linenums">
system.time(readLines("http://www.jhsph.edu"))

system.time({
    n &lt;- 1000
    r &lt;- numeric(n)
    for (i in 1:n) {
        x &lt;- rnorm(n)
        r[i] &lt;- mean(x)
    }
})
</pre>

Returns an object of class proc_time: 

* user time: total time charged to the CPU(s) for this expression
* elapsed time: wall-clock time

> Wall-clock time, or wall time, is the human perception of the passage of time from the start to the completion of a task.

wall-clock time 就是指人类感知到的时间，实际经过的时间。  
user time 是串行完成所有指令的时间（考虑 DB Isolation 的 Serializable 级别）。  
user time 与 elapsed time 的大小关系与指令数和 CPU 的核数相关：比如一个 function，需要 100 指令完成，不管你是 N 核，user time 永远是 100 单位时间。如果是单核，elapsed time 肯定是 100+ 单位时间；如果是双核，elapsed time 可能是 50+ 时间，因为你 100 指令在 50 单位时间内就并行跑完了（但是你 user time 还是 100 单位时间）。所以多核情况下，勉强有 `user time ≈ N * elapsed time`。

## Rprof()

注意一下用法：

<pre class="prettyprint linenums">
&gt; Rprof()        ## enable profiling
&gt; foo()          ## some code to be profiled
&gt; Rprof(NULL)    ## disable profiling
&gt; summaryRprof() ## show summarized output from Rprof()
</pre>

注意事项：

* DO NOT use system.time() and Rprof() together or you will be sad
* C or Fortran code cannot be profiled

## summaryRprof()

注意有两种统计方法：

* by.total: 计算各级 function 从开始到退出所用的时间在总时间上的占比。这样一来，最外层的 function 永远是 100% 时间
* by.self: 在 by.total 的基础上，减去内部调用的 function 的运行时间。此时，如果最外层的 function 只负责调用，那么它只会占很少的时间。