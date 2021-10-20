---
layout: post
title: "A socket is like an endpoint... or a line segment"
description: ""
category: Network
tags: [socket]
---
{% include JB/setup %}

## 如何形象理解 socket

首先 socket 这个词实在是太具象了，以至于我上学的时候总以为它是个 physical 的 device，但其实 socket 是一个 pure 的 software 概念，你可以把它理解成是一个 data structure 或者是建立在这个 data struture 之上的一整套 lib。

理解 socket 的第二个难点在于：它是个只完成了 50% 的 metaphor，因为它既可以表示 (网络通信中的) 一个 endpoint，又能代表一个 channel/pipe/connection。用伪代码表示一下，大概是：

```python
endpoint_like_socket = {
    "protocol": ..., 

    "address": {
        "host": ...,
        "port": ...
    }
}

channel_like_socket = {
    "protocol": ..., 

    "local_address": {
        "host": ...,
        "port": ...
    },

    "remote_address": {
        "host": ...,
        "port": ...
    }
}
```

遗憾的是，这两种 objects 都被叫做 socket，which 是增加了理解的难度的。虽然 socket 成为标准也很多年了，但这个 metaphor 明显是有问题的。我们有一个现成的很成功的 metaphor，就是几何学里的 "端点" (endpoint) 和 "线段" (line segment)。而 socket 就相当于用一个词同时指代了 "端点" 和 "线段"，这在学习数学的角度来看非常难理解。当然你可以玩极限，说 "端点就是长度为 0 的线段"，从而可以免掉 "端点" 的定义，但是何必呢？按这个理论，"socket 就是长度可以为 0 的 channel"，有更容易理解吗？

知道 socket 在表意上的 ambiguity 之后，有些 practice 就很好理解了。比如 "为啥 listening socket 在 `accept()` 之后要创建一个新的表示 connection 的 socket，而不是复用 listening socket?"，因为 listening socket 是一个 endpoint-like socket，而 connection socket 是一个 channel-like socket，虽然它们的 `local_address` 是一样的，但是结构上没法复用。