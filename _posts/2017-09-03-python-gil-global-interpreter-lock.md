---
category: Python
description: ''
tags: []
title: 'Python GIL: Global Interpreter Lock'
---

[GIL-vs-Process]: https://live.staticflickr.com/4362/36824252206_bd6fe5a2e6.jpg
[GIL-vs-Thread]: https://live.staticflickr.com/4434/36872027291_1003ba8dc5_c.jpg

[Wiki Python: GlobalInterpreterLock](https://wiki.python.org/moin/GlobalInterpreterLock):

> In CPython, the global interpreter lock, or GIL, is a mutex that protects access to Python objects, preventing multiple threads from executing Python bytecodes at once. This lock is necessary mainly because CPython's memory management is not thread-safe.

- Jython and IronPython have no GIL
- The fastest Python interpreter, Pypy, also has GIL

概念是挺简单的，但是要完全搞清楚的话，你需要复习一下 OS 的相关知识。

## 1. Interpreter、(Python) Process、Thread 三者间的关系是怎样的？

### 1.1 Interpreter 与 Process 一一对应

考虑到 Python 是 interpreted language，它和 complied language 的 loading 有点不一样（看 [Linking, Loading and Library](/os/2016/06/29/linking-loading-and-library) 复习一下）。简单来说，每个 python process（打开你的 task manager，每个 "python" 或者 "python.exe" 都是一个 process）都自带一个 interpreter instance，所以每个 process 都只带有一个 GIL。

#### 子问题一：单个 Python Process 可以带多个 Interpreters 么？

其实是可以的，但是需要魔改。比如 [More than one interpreter per process?](https://bytes.com/topic/python/answers/750015-more-than-one-interpreter-per-process) 提到的 `mod_python` 和 `mod_wsgi`。但目你不需要考虑这个问题。

#### 子问题二：可不可能多个 Python Process 共享一个 Interpreter？

就我目前的认知我觉得不可能。而且如果你是用 `fork` 从当前 process 创建新的 process，则是明确的不可能，因为 `fork` 你可以理解为是一个 deep copy，新创建的 process 内部是一个实打实的 interpreter instance 的 clone。这也从另一个方面说明，multi-processing 比 multi-threading 的 overhead 消耗要大。

更多内容参考 [stack overflow: Does python os.fork uses the same python interpreter?](https://stackoverflow.com/questions/30157895/does-python-os-fork-uses-the-same-python-interpreter)

所以我们 python process 与 GIL 的关系是：每个 process 包含一个独立的 GIL。

![][GIL-vs-Process]

### 1.2 GIL 只能影响自身 Process 内的 Threads

只有同一个 process 内的 threads 才有竞争关系，需要抢夺 GIL 来执行代码；不同 process 下的 threads 属于八竿子打不着的关系，更不要说去竞争 GIL 了。

![][GIL-vs-Thread]

综上：

- 同一个 process 下的 threads 要竞争 GIL（换言之，GIL 只能协调同一个 process 下的 threads）
- 不同 process 下的两个 threads 不存在竞争 GIL 的关系（换言之，GIL 无法协调不同 process 下的 threads）
- Processes 之间不需要竞争 GIL（换言之，process 不受 GIL 协调）

## 2. IO-Bound vs CPU-Bound / Multi-Threading vs Multi-Processing

复习指路：[CPU bound vs IO bound](/os/2017/03/20/cpu-bound-vs-io-bound)。

每次谈 IO-Bound task 的速度的时候，总是没有 CPU cores 那么直观，我们以后就举例子好了，比如 “往磁盘写文件” 这个任务。在 "只有一个磁头、磁盘读写速度一定" 的前提下，你的 “写文件” 操作是没有办法并行的。不管你是 8 个 threads 还是 8 个 processes 去写 8 个文件，都得排队（考虑到创建、切换、销毁 thread 或是 process 的开销，你并行的速度应该反而比单个 process 去写 8 个文件要慢），这和你有多少个 CPU cores 是没有关系的（8-core 并不意味着磁头数量或是磁盘读写速度是 4-core 机器的两倍）。所以以你目前的计算机体系结构来说，pure IO task 是无法并行的（如果是 8 个 cores 带 8 个总线、8 个磁头、8 块硬盘这么骨骼清奇的机器，并行写 8 个文件自然是可行的）。

所以对 IO-Bound task 来说，你的 pure IO 部分理论上不可能从并行中受益，你只能从 CPU 部分动手脚，即在 IO blocking 的时候切换到别的 thread 或是 process 让它们去跑它们自己的 CPU 部分。

| Parallelizability | Multi-threading   | Multi-processing |
|-------------------|-------------------|------------------|
| Pure IO task      | No                | No               |
| Pure CPU task     | No because of GIL | Yes              |

GIL 的存在让人觉得 Python 的 multi-threading 简直毫无用处（因为你 threads 实际上还是要排队，相当于串行），但实际上 Standard Library 在执行 IO blocking 的操作时是会 release GIL 的，所以 `Thread A` 在跑到 IO 部分的时候，可以释放 GIL 给 `Thread B`，`Thread B` 可以开始跑它的 CPU 部分，依此类推。这个执行顺序和 multi-processing 又不一样，因为 multi-processing 是大家同时开跑 CPU 部分。

假定现在有一个 task $T$，它的总运行时间是 $n \mu + n \omega$，其中 $\mu$ 是 CPU 运行时间，$\omega$ 是 IO 运行时间。为方便讨论，我们假定 CPU 部分先执行、IO 部分后执行。

- 当 $\mu \ll \omega$ 时，$T$ 是个 IO-bound task
- 当 $\mu \gg \omega$ 时，$T$ 是个 CPU-bound task

考虑将 $T$ 做并行处理，分配到 $n$ 个 thread 或者 process 上，有如下 4 种情况 (以下 `×` 表示 CPU 运行，`○` 表示 IO 运行)：

- Multi-threading + IO-bound：
  - `t1` 在等待 IO 的时候可以切换到 `t2` 去跑 CPU，但由于 `t1` 的 blocking-IO 时间很长，`t2` 的 CPU 执行完仍然需要等待 `t1` IO，进而切换到 `t3`
  - 理想状态下总运行时间为 $\mu + n \omega$
    - $\text{speedup} = \frac{n \mu + n \omega}{\mu + n \omega}$
    - $\mu \ll \omega \Rightarrow \text{speedup} \to 1$ 

```txt
t1: ××○○○○○○○○○○○○○○○○○○○○○○○○
t2:   ××                      ○○○○○○○○○○○○○○○○○○○○○○○○
t3:     ××                                            ○○○○○○○○○○○○○○○○○○○○○○○○
```

- Multi-threading + CPU-bound：
  - `t1` 在等待 IO 的时候可以切换到 `t2` 去跑 CPU，但由于 `t1` 的 blocking-IO 时间很短，`t2` 的 CPU 执行完后直接转入它自己的 IO，进而切换到 `t3`
  - 理想状态下总运行时间为 $n \mu$
    - $\text{speedup} = \frac{n \mu + n \omega}{n \mu} = 1 + \frac{\omega}{\mu}$
    - $\mu \gg \omega \Rightarrow \text{speedup} \to 1$ 

```txt
t1: ××××××××××××××××××××××××○○
t2:                         ××××××××××××××××××××××××○○
t3:                                                 ××××××××××××××××××××××××○○
```

- Multi-processing：
  - CPU 部分完全并行，只花了 $\mu$ 时间全部跑完；IO 部分仍然不能并行，必须花 $n \omega$
  - 理想状态下总运行时间为 $\mu + n \omega $
    - $\text{speedup} = \frac{n \mu + n \omega}{\mu + n \omega}$
    - $\mu \ll \omega \Rightarrow \text{speedup} \to 1$ 
    - $\mu \gg \omega \Rightarrow \text{speedup} \to n$ 

```txt
// Multi-processing + IO-bound
p1: ××○○○○○○○○○○○○○○○○○○○○○○○○
p2: ××                        ○○○○○○○○○○○○○○○○○○○○○○○○
p3: ××                                                ○○○○○○○○○○○○○○○○○○○○○○○○

// Multi-processing + CPU-bound
p1: ××××××××××××××××××××××××○○
p2: ××××××××××××××××××××××××  ○○
p3: ××××××××××××××××××××××××    ○○
```

总结一下：

| Theoretical Speedup | IO-bound task | CPU-bound task |
|---------------------|---------------|----------------|
| Multi-threading     | A little bit because of GIL-releasing on blocking IO, allowing another thread to run its CPU instructions | Almost none |
| Multi-processing    | A little bit because of $N$-fold speed on total CPU instructions | Almost $N$-fold |

简单来说，python 的 multi-processing 是正常表现；python 的 multi-threading 在 GIL 的约束下，在 CPU-bound task 方面基本可以说是毫无用处，在 IO-bound task 方面还有点用，尤其是考虑到它比 multi-processing 的 overhead 开销要小，可能会快过 multi-processing。

## 2017-10-03 补充

_Effective Python Item 37: Use Threads for Blocking I/O, Avoid for Parallelism_

> The GIL prevents my Python code from running in parallel, but it has no negative effect on system calls. This works because Python threads release the GIL just before they make system calls and reacquire the GIL as soon as the system calls are done.

_Effective Python Item 38: Use Lock to Prevent Data Races in Threads_

> The Python interpreter enforces fairness between all of the threads that are executing to ensure they get a roughly equal amount of processing time. To do this, Python will suspend a thread as it’s running and will resume another thread in turn. The problem is that you don’t know exactly when Python will suspend your threads. A thread can even be paused seemingly halfway through what looks like an atomic operation. 

## 2021-05-03 补充

参考 [Python: asyncio - 6. 题外话：与 GIL 的区别与联系](/asyncio/2021/02/24/python-asyncio#6-%E9%A2%98%E5%A4%96%E8%AF%9D%E4%B8%8E-gil-%E7%9A%84%E5%8C%BA%E5%88%AB%E4%B8%8E%E8%81%94%E7%B3%BB)

## Further Reading

- [Python's Hardest Problem, Revisited](https://jeffknupp.com/blog/2013/06/30/pythons-hardest-problem-revisited/)
- [stack overflow: Multiprocessing vs Threading Python](https://stackoverflow.com/questions/3044580/multiprocessing-vs-threading-python)
- [stack overflow: Does multithreading make sense for IO-bound operations?](https://stackoverflow.com/questions/902425/does-multithreading-make-sense-for-io-bound-operations)
- [David Beazley: Understanding the Python GIL](http://www.dabeaz.com/python/UnderstandingGIL.pdf)
- [David Beazley: Inside the Python GIL](http://www.dabeaz.com/python/GIL.pdf)