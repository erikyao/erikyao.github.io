---
category: OS
description: ''
tags: []
title: 'OS: <b>SELECT(2)</b>, <b>POLL(2)</b>, and their variants'
toc: true
toc_sticky: true
---

## Appetizer: What do the numbers in a `man` page mean?

根据 [Andy Dalton & Michael Mrozek](https://unix.stackexchange.com/a/3587):

> The `man` page for `man` itself (`man man`) explains it and lists the standard ones.

```txt
MANUAL SECTIONS
       The standard sections of the manual include:

       1      User Commands
       2      System Calls
       3      C Library Functions
       4      Devices and Special Files
       5      File Formats and Conventions
       6      Games et. Al.
       7      Miscellanea
       8      System Administration tools and Deamons

       Distributions customize the manual section to their specifics, which often include additional sections.
```

所以有的文章会用 `SELECT(2)` 和 `POLL(2)` 这样的写法来强调 `select()` 和 `poll()` 是 System Calls。

## `SELECT(2)` 和 `POLL(2)`

`man select`:

> **select()** examines the I/O descriptor sets whose addresses are passed in <ins>readfds</ins>, <ins>writefds</ins>, and <ins>errorfds</ins> to see if some of their descriptors are ready for reading, are ready for writing, or have an exceptional condition pending, respectively.

`man poll`:

> **poll()** examines a set of file descriptors to see if some of them are ready for I/O or if certain events have occurred on them.

- 这个 `man poll` 感觉没有抓住实质，我们暂时忽略它

其实记住最典型的应用场景就可以了：假设我是一个 server，我 accept 了很多的 client sockets (which IS-A type of file descriptor)，我怎么确定哪个 client socket 给我发了 message？我如何挑选出这个 client socket 来 reply 它？

[Select is fundamentally broken](https://idea.popcount.org/2017-01-06-select-is-fundamentally-broken/) 这篇精彩的 blog 就提到了 _The Design and Implementation of the FreeBSD Operating System_ 这本书针对这个应用场景在 OS 级别的处理策略：

> There are four possible alternatives that avoid the blocking problem:  
>   
> 1. Set all the descriptors in nonblocking mode. [...]
> 2. Enable all descriptors of interest to [send] signal when I/O can be done. [...]
> 3. Have the system provide a method for asking which descriptors are capable of performing the I/O [...]
> 4. Have the process register with the [operating] system all the events including I/O on descriptors that it is interested in tracking.

`SELECT(2)` 和 `POLL(2)` 实现的是**策略 (3)**:

- `POLL(2)` 负责收集 descriptors
- `SELECT(2)` 负责 _"asking which descriptors are capable of performing the I/O"_ from the poll

## Variants: `EPOLL(7)` / `devpoll` / `KQUEUE(2)`

`SELECT(2)` 和 `POLL(2)` 源于 Unix，后续的变种有:

- Linux 用的是 `EPOLL(7)`
- Solaris 用的是 `poll(7d)`，由于它的 path 是 `/dev/poll`，所以也被叫做 `devpoll`
- BSD 用的是 `KQUEUE(2)`
  - 严格来说 `KQUEUE(2)` 应该不算 `POLL(2)` 的变种，因为它配合 `SELECT(2)` 实现的是上面的**策略 (4)**
  - 但现阶段你理解成它和 `POLL(2)` 的目的是类似的就可以了

注意：虽然这些变种都仍然使用 `SELECT(2)`，但目前我不知道它们的 `SELECT(2)` 是不是有啥区别……

## `SELECT(2)` + `POLL(2)/EPOLL(7)` 即是 "轮询"

这个 _"asking which descriptors are capable of performing the I/O"_ 并没有多么的 fancy，我甚至觉得它可以简单理解成：

```python
def select(poll, timeout):
    while not timeout:
        for fd in poll:
            if fd is ready:
                return fd
    raise TimeoutError()
```

"轮询" 这个翻译还是 OK 的，poll 做 verb 本身的意思就有：

- _poll sb._ => to record the opinion or vote of sb.
- _poll sth._ => (in Computer Science/Telecommunications) to check the status of sth., especially as part of a repeated cycle.

[Select is fundamentally broken](https://idea.popcount.org/2017-01-06-select-is-fundamentally-broken/) 介绍了 `POLL(2)` 相比 `EPOLL(7)` 的缺点，但它们在 complexity 上并没有本质的区别，你可以理解成 `POLL(2)` 是 $O(42 \times n)$，然后 `EPOLL(7)` 是 $O(7 \times n)$，(从 heavy-weight 变成了 light-weight)，但无法突破 $O(n)$。

关于 `EPOLL(7)` 可以阅读 [Async IO on Linux: select, poll, and epoll](https://jvns.ca/blog/2017/06/03/async-io-on-linux--select--poll--and-epoll/)，这篇也简略 cover 了很多相关的基础概念。

`EPOLL(7)` 也有它自己的问题，可以参见 (还是那个作者的)：

- [Epoll is fundamentally broken 1/2](https://idea.popcount.org/2017-02-20-epoll-is-fundamentally-broken-12/)
- [Epoll is fundamentally broken 2/2](https://idea.popcount.org/2017-03-20-epoll-is-fundamentally-broken-22/)

这两篇非常的细节，但我觉得主要的 takeaway 应该是：**`EPOLL(7)` 的使用有它的 best practice**，当你真正需要**直接**使用 `EPOLL(7)` 的时候，再研究也不迟。

## Python: `select` module

我铺了这么多，就是为了引出 [`select` — Waiting for I/O completion](https://docs.python.org/3/library/select.html) 这个 module，现在看它的代码就能很清楚地理解它们的层级关系了。

## Python: `selectors` module

[`selectors` — High-level I/O multiplexing](https://docs.python.org/3/library/selectors.html) 是建立在 `select` 之上的一个高一级别的 module，无非就是屏蔽了 `select` 过于琐碎的技术细节 (毕竟是 OS-specific 的)。docs 也说了：

> Users are encouraged to use this module instead, unless they want precise control over the OS-level primitives used.