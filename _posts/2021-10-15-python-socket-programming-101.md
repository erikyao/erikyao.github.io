---
category: Network
description: ''
tags:
- socket
title: 'Python: Socket Programming 101'
toc: true
toc_sticky: true
---

参考 [Socket Programming in Python (Guide)](https://realpython.com/python-sockets/) 的前半部分，代码有改动。另外我觉得这个例子用两个 ipython 来玩更方便理解。

更多参考资料：

- [Python Docs: socket - Low-level networking interface](https://docs.python.org/3/library/socket.html)
- [Python HOWTOs: Socket Programming HOWTO](https://docs.python.org/3/howto/sockets.html)

# 0. Echo Server & Client

所谓 echo 就是指：client 发给 server 的 data, server 会原封不动再发回给 client.

server 端代码：

```python
#! echo-server.py

import socket

SERVER_HOST = '127.0.0.1'  # Standard loopback interface address (localhost)
SERVER_PORT = 65432        # Port to listen on

# This is TCP/IP socket
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as listen_socket:  # 1️⃣ 

    listen_socket.bind((SERVER_HOST, SERVER_PORT))  # 2️⃣

    listen_socket.listen()  # 3️⃣

    print(f"Server-side Listening Socket: {listen_socket}")

    # accept() is blocking! blocked until a connection is in
    conn_socket, client_addr = listen_socket.accept()  # 4️⃣
    with conn_socket:
        print(f"Server Connected by: {client_addr}")
        print(f"Server-side Conn Socket: {conn_socket}")

        while True:
            # receive at most 1024 bytes
            data = conn_socket.recv(1024)  # 5️⃣
            if not data:
                break
            conn_socket.sendall(data)  # 6️⃣
```

client 端代码：

```python
#! echo-client.py

import socket

SERVER_HOST = '127.0.0.1'  # The server's hostname or IP address
SERVER_PORT = 65432        # The port used by the server

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as conn_socket:
    conn_socket.connect((SERVER_HOST, SERVER_PORT))

    print(f"Client-side Conn Socket: {conn_socket}")

    conn_socket.sendall(b'Hello, world')
    data = conn_socket.recv(1024)

print('Received', repr(data))
```

执行：

```bash
yaoyao@MBP Socket-exercise % python3 echo-server.py
Server-side Listening Socket: <socket.socket fd=3, family=AddressFamily.AF_INET, type=SocketKind.SOCK_STREAM, proto=0, laddr=('127.0.0.1', 65432)>  # blocked until echo-client.py started
Server Connected by: ('127.0.0.1', 56939)
Server-side Conn Socket: <socket.socket fd=4, family=AddressFamily.AF_INET, type=SocketKind.SOCK_STREAM, proto=0, laddr=('127.0.0.1', 65432), raddr=('127.0.0.1', 56939)>
```

```bash
yaoyao@MBP Socket-exercise % python3 echo-client.py
Client-side Conn Socket: <socket.socket fd=3, family=AddressFamily.AF_INET, type=SocketKind.SOCK_STREAM, proto=0, laddr=('127.0.0.1', 56939), raddr=('127.0.0.1', 65432)>
Received b'Hello, world'
```

## 0.1 Random Port Number in Client-side Connection Socket

从输出我们可以看出 client-side 的 `conn_socket` bind 了一个 port `56939`，这个其实是 OS 自己分配的。当然我们也可以在 client 端调用 `conn_socket.bind()`，是没有问题的。

## 0.2 Connection Socket 的方向性

从输出我们可以看到 server-side 的 `conn_socket` 是：

```python
<socket.socket fd=4, family=AddressFamily.AF_INET, type=SocketKind.SOCK_STREAM, proto=0, laddr=('127.0.0.1', 65432), raddr=('127.0.0.1', 56939)>
```

而 client-side 的 `conn_socket` 是：

```python
<socket.socket fd=3, family=AddressFamily.AF_INET, type=SocketKind.SOCK_STREAM, proto=0, laddr=('127.0.0.1', 56939), raddr=('127.0.0.1', 65432)>
```

它们的 `laddr` (local address) 和 `raddr` (remote address) 刚好是相反的。所以语义上总是有：`recv() from raddr`，以及 `send() to raddr`，不会混。
 
# 1. `socket.socket(family, type)` / Address Family / Socket Type

socket 是通用的，可以表示多种协议，并支持多种 address 的 format，所以初始化一个 socket 首先要确定它的 address format 和 protocal. 参考 [Ian Boyd: What is SOCK_DGRAM and SOCK_STREAM?](https://stackoverflow.com/a/60425748)，有：

```text
╔══════════════════════════╦══════════════════════════╗
║                          ║       Socket Type        ║
║ Address Family           ╟────────────┬─────────────╢
║                          ║ SOCK_DGRAM │ SOCK_STREAM ║ 
╠══════════════════════════╬════════════╪═════════════╣
║ AF_APPLETALK : AppleTalk ║ DDP        │ ADSP        ║
║ AF_BTH       : Bluetooth ║ ?          │ RFCOMM      ║
║ AF_NETBIOS   : NetBIOS   ║ NetBIOS    │ n/a         ║
║ AF_INET      : IPv4      ║ UDP        │ TCP         ║
║ AF_INET6     : IPv6      ║ UDP        │ TCP         ║
║ AF_IPX       : IPX/SPX   ║ SPX        │ IPX         ║
║ AF_IRDA      : IrDA      ║ IrLMP      │ IrTTP       ║
╚══════════════════════════╩════════════╧═════════════╝
```

我们用的 `socket.socket(socket.AF_INET, socket.SOCK_STREAM)` 即是一个 TCP/IPv4 的 socket。

另外，`socket.socket()` creates a socket object that supports the context manager type, thus no need to call `socket.close()`

# 2. `socket.bind(address)`

`bind()` is used to associate the socket with a specific network interface and port number. The format of `address` depends on the address family. 我们用的 IPv4 的格式比较简单，传入一个 `(host, port)` 的 tuple 即可。

A `host` can be a hostname, IP address, or empty string:
        
- host name: will be secretly replaced by the first address returned from the DNS resolution (which may lead to a non-deterministic socket behavior, depending on the DNS resolution)
- IP address: must use the formatted address string specified by Address Family
- empty string: enables the server to accept connections on all available IPv4 interfaces
     
A `port` should be an integer from `1` to `65535` 

- `0` is reserved
- non-privileged ports are > `1023`

# Prerequisite: Blocking / Non-Blocking / Timeout Mode

socket 其实有三种 modes:

- _blocking_: 等价于 infinity timeout
  - `socket.setblocking(True)` $\equiv$ `sock.settimeout(None)`
- _timeout_: 中间状态，等待有限时间后 timeout (抛异常)
- _non-blocking_: 等价于 zero timeout
  - `socket.setblocking(False)` $\equiv$ `sock.settimeout(0.0)`

`socket.socket()` 默认都是 _blocking mode_，但也可以通过 `setdefaulttimeout()` 修改默认 timeout 值来改动默认的 mode。

另外，可以通过设置 `type` 来创建 _non-blocking mode_ 的 socket，比如：

```python
socket.socket(type=socket.SOCK_STREAM | socket.SOCK_NONBLOCK)
```

[但是要注意](https://docs.python.org/3/library/socket.html#socket.socket)：

> Changed in version 3.7: When `SOCK_NONBLOCK` or `SOCK_CLOEXEC` bit flags are applied to _type_, they are cleared (in _type_), and `socket.type` will not reflect them. They are still passed to the underlying system `socket()` call.

下面一般只讨论 _blocking mode_，因为 _blocking mode_ 的行为熟悉之后，_non-blocking_ 的行为就好理解了。

# Prerequisite: Connection Queue / IO Buffer

那既然出现了 _blocking_ vs _non-blocking_, 我们就应该能联想到 Producer-Consumer 问题的中心 – the bounded buffer ("bounded" 表示 limited capacity). socket 的阻塞其实也涉及 bounded buffer，而且有两个:

1. Connection Queue
2. IO Buffer
    - 其实有两个：send buffer + receive buffer
    - 然后既然有 buffer，那一定就会有 "flush" 操作

在 _blocking mode_ 下：

3. Connection Queue
    - server-side 的 `socket.accept()` 是 consumer，会等待这个 queue 非空
    - client-side 的 `socket.connect()` 是 producer，会等待这个 queue 有空位
4. IO Buffer
    - `socket.recv()` 是 consumer，会等待 receive buffer 非空
    - `socket.send()` 是 producer，会等待 send buffer 有空位

如果是 _timeout mode_, 上述几个方法的行为就是 "如果没有资源，等待若干时间后抛出 timeout 异常"。

如果是 _non-blocking mode_, 上述几个方法的行为就是 "如果没有资源，不等待，直接异常"。

# 3. `socket.listen(backlog)`

`listen()` make the socket a listening socket (must be called before `accept()`).

`listen()` has an optional `backlog` parameter. It specifies the number of unaccepted connections that the system will allow before refusing new connections.

- 这个 `backlog` 其实就是设置了 connection queue 的长度
- 如果不设置的话，OS 会指定一个默认值

# 4. `socket.accept()`

In _blocking mode_, `accept()` blocks and waits for an incoming connection. 
    
When a client connects, it returns a new socket object representing the connection and a tuple holding the address of the client. The tuple will contain `(host, port)` for IPv4 connections or `(host, port, flowinfo, scopeid)` for IPv6.

# 5. `socket.recv(bufsize)`

_blocking_ 的行为我们就不讨论了。

这里要注意的是 `bufsize` 其实是单次读操作的 maximum amount of data (in bytes) to be received，然后 `recv()` 的返回值是实际读取的 data, 它的长度可能会小于 `bufsize` (当 receive buffer 的 data 不足时)。

你可以试试把 `echo-server.py` 的 `data = conn_socket.recv(1024)` 改成 `data = conn_socket.recv(1)`，结果是：

- server 一次只 echo 1 byte；在 client `recv()` 之前，server 不一定能把 `b'Hello, world'` 全部 echo 回去
  - "server 能 echo 几个 byte" 完全依赖于 OS 分配给它的 CPU 时间
- 由于 client 只 `recv()` 一次，然后马上就关闭，所以它可能会接收一个残缺的 echo
- 由于 client 关闭，server 端剩下的 byte 会 echo 不出去
  - 具体的异常是 `BrokenPipeError: [Errno 32] Broken pipe`

第二个点是：`recv()` returns an empty string (`b''`) if the peer performed shutdown (disconnect).

- 这也是 `echo-server.py` 的 `if not data: break` 能触发的原因
- 注意不要理解成 ~~"peer shutdown 的时候会发送一个 empty string"~~

注意这个行为在 [Python Docs: socket - Low-level networking interface](https://docs.python.org/3/library/socket.html) 里并没有写，你需要参考 [recv(2) — Linux manual page](https://man7.org/linux/man-pages/man2/recv.2.html#RETURN_VALUE):

> When a stream socket peer has performed an orderly shutdown, the return value will be 0 (the traditional "end-of-file" return).

linux 下返回长度 `0`，转换到 python 里就是返回 `receive_buffer[0:0]`，即是 `b''`。

# 6. `socket.send()` / `socket.sendall()`

`send()` returns the number of bytes sent. If you have large data, you may have to `send()` multiple times.

`sendall()` method continues to send data until either all data has been sent or an error occurs. `None` is returned on success.