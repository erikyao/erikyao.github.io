---
category: null
description: ''
tags: []
title: 'Python: synchronization primitives'
---

我本来只是想研究下 `Condition` 怎么用 (因为 java 里没见过)，但既然展开了就写一篇记录一下吧。

-----

所谓 synchronization primitives 即是 `Lock`、`Semaphore` 这类 "控制、协调 synchronization" 的工具。在 [《分布式 Java 应用：基础与实践》第四章总结其二：并发工具类](https://blog.listcomp.com/java/2014/06/03/digest-of-distributed-java-system-ch4-part2) 里其实介绍了一些，在 python 里这些 primitives 的感性认知 (metaphor) 应该是一致的。

注意 `threading` 和 `multiprocessing` modules 都提供了这些 primitives，它们在实现上是高度相近的或者就直接是 alias，参考：

- [threading](https://docs.python.org/3/library/threading.html)
- [multiprocessing: Synchronization primitives](https://docs.python.org/3/library/multiprocessing.html#synchronization-primitives)

那至于这些 primitive 的 class hierarchy，[When to use event/condition/lock/semaphore in python's threading module?](https://stackoverflow.com/questions/31644663/when-to-use-event-condition-lock-semaphore-in-pythons-threading-module) 有讨论。

[dano's comment](https://stackoverflow.com/questions/31644663/when-to-use-event-condition-lock-semaphore-in-pythons-threading-module#comment51235931_31644663):

> `Condition` is built on top of `Lock`, and `Event` and `Semaphore` are built on top of `Condition`

具体可以参考下面 answer 提到的文章：[Python threads synchronization: Locks, RLocks, Semaphores, Conditions and Queues](http://www.laurentluce.com/posts/python-threads-synchronization-locks-rlocks-semaphores-conditions-events-and-queues/)