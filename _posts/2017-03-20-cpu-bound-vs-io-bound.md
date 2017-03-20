---
layout: post
title: "CPU bound vs IO bound"
description: ""
category: OS
tags: [CPU, IO]
---
{% include JB/setup %}

From [stackoverflow: What do the terms “CPU bound” and “I/O bound” mean?](http://stackoverflow.com/questions/868568/what-do-the-terms-cpu-bound-and-i-o-bound-mean):

- **CPU Bound** means the rate at which process progresses is limited by the speed of the CPU. 
    - A task that performs calculations on a small set of numbers, for example multiplying small matrices, is likely to be CPU bound.
    - A program is CPU bound if it would go faster if the CPU were faster.
- **I/O Bound** means the rate at which a process progresses is limited by the speed of the I/O subsystem. 
    - A task that processes data from disk, for example, counting the number of lines in a file is likely to be I/O bound.
    - A program is I/O bound if it would go faster if the I/O subsystem was faster.