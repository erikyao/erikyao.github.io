---
layout: post
title: "Terminology Recap: Preemptive / Cooperative / Multitasking / Multithreading / Race Condition"
description: ""
category: OS
tags: []
---
{% include JB/setup %}

## Preemptive / Cooperative / Multitasking

根据 [MIT 1.124 Lecture 15](http://web.mit.edu/1.124/LectureNotes/Multithreading.htm): **Multitasking** is the ability of a computer's operating system to run several programs (or **processes**) concurrently **on a single CPU**.

- This is done by switching from one program to another fast enough to create the appearance that all programs are executing simultaneously.

Preemptive 和 Cooperative 指的其实是 scheduling 的形式，可以看做 Multitasking 的两种 type. 根据 [Davide Spataro](https://stackoverflow.com/a/55703529): 

- Preemptive
    - It means that threads are not in control on when and/or for how long they are going to use the CPU and run. It is the **scheduler** (a component of the OS) that decides at any moment which thread can run and which has to sleep. You have no strong guarantees on what will be the next time a thread will run, and for how long. It is completely up to the scheduler.
- Cooperative
    - In cooperative multitasking, what happens is that the scheduler has no say in when a thread can run. **Each thread decides for how long it keeps the CPU**. If it decided not to share the CPU with any other thread, then no other threads will run causing what is known as **starvation**.

注意：

- 虽然这里说的是 thread，但应该是指 process
- 另外要注意语法:
  - A process can be preemptable
  - A process is preempted by a scheduler
  - Processes can be coopeartive (to each other)
- 切换 process 的时候，context switch 是额外的 resource overhead. In certain real-time low latency application (like high frequency trading), this can be quite unacceptable.

## Multithreading

根据 [MIT 1.124 Lecture 15](http://web.mit.edu/1.124/LectureNotes/Multithreading.htm): **Multithreading** extends the concept of multitasking by allowing individual programs to perform several tasks concurrently. Each task is referred to as a **thread** and it represents a separate flow of control.  

- What then is the difference then between a process and a thread? The answer is that each process has its own set of variables, whereas threads share the same data and system resources.

上面这些都没啥好讲的。

和 Multitasking 一样，Multithreading 也能分成 Preemptive 和 Cooperative:

- 一般的 multi-thread lib 应该有自己的 scheduler 吧？就算没有，也应该能托管给 OS 来做。所以如果我只是创建了一群 threads 让它们自由地跑，应该是 Preemptive 的情况
- 如果我自己要精细控制，我可以搞 synchronized、wait、yield、join 这些操作，那就是稍微添加了点 Cooperative 的意味
  - 要不要做成完全的 Cooperative 形式，要看你自己 application 的需求

## Race Condition

根据 [MIT 6.031 Reading 19: Concurrency](http://web.mit.edu/6.031/www/fa17/classes/19-concurrency/#race_condition): A **race condition** means that the correctness of the program (the satisfaction of postconditions and invariants) depends on the relative timing of events in concurrent computations `A` and `B`. When this happens, we say "`A` is in a race with `B`."

按这个说法，race condition 不是 multithreading 独有的，广义上的 multitasking 也可以有 race condition (比如两个 git processes 同时 commit 相同的一个 resource)。但一般来说，race condition 还是在 multithreading 的语境下出现得比较多，毕竟我们很少去操控 multitasking.

给 resource 加锁是最常见的避免 race condition 的手段。