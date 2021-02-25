---
layout: post
title: "Python: asyncio"
description: ""
category: asyncio
tags: []
---
{% include JB/setup %}

## 1. `yield` is a pun

感觉 python 把 `yield` 设计成了双关：

- 于 generator 它表示 "产出 (value)"
- 于 coroutine 它表示 "出让 (execution)"

但是 `yield from` 只于 generator 有 semantic 的意思 ("从 ... 产出 value")，于 coroutine 就显得很无厘头 (所以改成 `await` 了)

## 2. blocking / non-blocking

blocking 的主语是 task/function/subroutine 这些 runnable，被 block 的对象是 process/thread/execution 这些 application。

需要注意的是 block 指整个 main process/thread 被 block，情况有：

1. main process/thread 自身被 block
2. main process/thread 启动的 coroutine 被 block

### 应该尽量避免 main process/thread 被 block

在 asyncio application 中，一般情况下 event loop 在 main process/thread 内被创建。而 event loop 你可以想象成是个发牌机器 (不停地发 `coro.send(value)`)，如果 event loop 所在的 main process/thread 被 block，coroutines 就无法持续被触发，影响效率。

### IO-bound vs CPU-bound tasks wrapped in coroutines

对单个 coroutine 而言：

- `await` 等待 IO-bound operation 那不叫 blocked:
  - 因为此时可以 switch to other coroutine，因为你当前的 coroutine 只需要等待，没有别的 instruction 要跑
    - 比如 "等待 file loading to RAM"、"等待 server response" 这样的场合
- `await` 等待 CPU-bound operation 是 blocked:
  - 因为这种情况下无法 switch，因为你当前 coroutine 还是有任务要跑
    - 比如 "等待大型矩阵运算" 这样的场合

那 best practice 当然是让 coroutine 跑 non-blocking 的任务。如果一定要跑 blocking 的任务，分情况处理：

- 如果 blocking 的任务是第三方的 API 不能改，可以把 blocking 的任务 wrap 到 new thread/sub-process，从而转化成一个 non-blocking 的任务再传递给 coroutine
  - 参考 [Running Blocking Code](https://docs.python.org/3/library/asyncio-dev.html#running-blocking-code)
- 如果条件允许，可以针对这个第三方的 API 开发 non-blocking 的版本，或者替换成已有的 alternative non-blocking 版本
  - 比如 non-blocking 的 file reader [`aiofile`](https://pypi.org/project/aiofile/)、ES driver [`aioes`](https://github.com/aio-libs/aioes)
  - 更多的 alternative async modules 可以参考 [timofurrer/awesome-asyncio](https://github.com/timofurrer/awesome-asyncio)

## 3. Why asyncio is fast?

下面的图示里：

- `a` 和 `b` 都表示 statement / CPU instruction 在执行的状态
- `/` 表示 being blocked 的状态

假设两个任务都是 "执行 -> 等待 IO -> 执行" 的 pattern，如果把它们在**单线程**内 sequentially 执行，会是下面的情形： 

```make
Time Elapsed : |-------------------------------|
Single Thread:  aaaaa/////aaaaa bbbbb/////bbbbb
Subroutine   : | subroutine_A  | subroutine_B  |      
```

如果用 asyncio 执行的话，会是这样的情形 (注意 asyncio 仍然是**单线程**)：

```make
Time Elapsed : |--------------------|
Single Thread:  aaaaabbbbbaaaaabbbbb
coroutine_A  :  aaaaa/////aaaaa 
coroutine_B  :       bbbbb/////bbbbb
```

- main thread 在等待 `coroutine_A` 的 IO 时 switch 到 `coroutine_B` 去跑 statement / CPU instruction
- 然后轮到等待 `coroutine_B` 的 IO 时，又 switch 回 `coroutine_A` 去跑剩下的 statement / CPU instruction
- 相当于 main thread 没有闲下来空等
  - 其实就是小时候学的**统筹方法**：先烧开水，等水烧开的时候洗茶杯、准备茶叶，水烧开就能马上泡茶；不要空等着烧开水

总结一下就是：asyncio is concurrent but not parallel.

- 关于 concurrency vs parallelism 这个经典的问题可以参考 [What is the difference between concurrency and parallelism?](https://stackoverflow.com/questions/1050222/what-is-the-difference-between-concurrency-and-parallelism)
  - 在 asyncio 的 context 里就是说 2 个 coroutines 可以同时存在 (concurrent)，但不能同时运行 (non-parallel)
- 从另一个角度来说，asyncio 是单线程，所以肯定不是 parallel
  - 所以 asyncio 的速度来自于它的 concurrency
    - concurrent 的结果就是：asyncio 的程序的 statements / CPU instructions in total 还是在一个 process/thread 里跑的，它只是把等待 IO 的时间都拿来跑其他 coroutine 的 statements / CPU instructions 了

## 4. Race Conditions?

race condition 在 asyncio application 中是仍然可能存在的 (比如让 coroutines 同时 access global variables?)，但相对 multithreading 肯定是更容易被解决的 (cooperative + non-parallel 总比 preemptive + parallel 要好处理吧？)

## 5. 题外话：`time.sleep()` vs `asyncio.sleep()`

首先 `time.sleep()` 既不是 IO-bound 也不是 CPU-bound，但仍然是 blocking:

- IO-bound task 的特点是：如果换了更快的 IO 设备，这个 task 可以 get faster
- CPU-bound task 的特点是：如果换了更快的 CPU (higher GHz)，这个 task 可以 get faster
- 但无论你是换 IO 设备还是换 CPU，`time.sleep()` 1 秒永远是 1 秒，不会 get faster 也不会 get slower，所以它既不是 IO-bound 也不是 CPU-bound
- 无论是在 main process/thread 还是 coroutine 里调用 `time.sleep()`，都会 block main process/thread

`asyncio.sleep()` 是一个 non-blocking 版本，它只会让 coroutine sleep. 

它的实现如下：

```python
>>> % ipython3
Python 3.8.2 (default, Dec 21 2020, 15:06:04)
Type 'copyright', 'credits' or 'license' for more information
IPython 7.19.0 -- An enhanced Interactive Python. Type '?' for help.

In [1]: import asyncio

In [2]: asyncio.sleep??
Signature: asyncio.sleep(delay, result=None, *, loop=None)
Source:
async def sleep(delay, result=None, *, loop=None):
    """Coroutine that completes after a given time (in seconds)."""
    if delay <= 0:
        await __sleep0()
        return result

    if loop is None:
        loop = events.get_running_loop()
    else:
        warnings.warn("The loop argument is deprecated since Python 3.8, "
                      "and scheduled for removal in Python 3.10.",
                      DeprecationWarning, stacklevel=2)

    future = loop.create_future()
    h = loop.call_later(delay,
                        futures._set_result_unless_cancelled,
                        future, result)
    try:
        return await future
    finally:
        h.cancel()
File:      /Library/Developer/CommandLineTools/Library/Frameworks/Python3.framework/Versions/3.8/lib/python3.8/asyncio/tasks.py
Type:      function
```