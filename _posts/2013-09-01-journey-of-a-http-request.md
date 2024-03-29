---
category: Network
description: ''
tags: []
title: 一个 http 请求的详细过程
---

ZT. 转载茫茫多，原文地址不可考。

-----

我们来看当我们在浏览器输入 `http://www.mycompany.com:8080/mydir/index.html` 时幕后所发生的一切。

首先 http 是一个应用层的协议（http 使用的 TCP 协议），在这个层的协议，只是一种通讯规范，也就是因为双方要进行通讯，大家要事先约定一个规范。

##### 1. DNS 解析

把 `www.mycompany.com` 变成 ip，如果 url 里不包含端口号，则会使用该协议的默认端口号。

具体过程是这样的：首先我们知道我们本地的机器上在配置网络时都会填写 DNS，这样本机就会把这个 url 发给这个配置的 DNS 服务器，如果能够找到相应的 url 则返回其 ip，否则该 DNS 将继续将该解析请求发送给上级 DNS。整个 DNS 可以看做是一个树状结构，该请求将一直发送到根直到得到结果。

##### 2. Socket 连接

socket 是通过 ip 和端口建立的。DNS 解析后，我们已经拥有了目标 ip 和端口号，这样我们就可以打开 socket 连接了
 
##### 3. 请求

Socket 连接成功建立后，开始向 web 服务器发送请求，这个请求一般是 GET 或 POST 命令（POST 用于 FORM 参数的传递）。

GET 命令的格式为：`GET 路径/文件名 HTTP/1.0`，文件名指出所访问的文件，`HTTP/1.0` 指出 Web 浏览器使用的 HTTP 版本。

现在可以发送GET命令：`GET /mydir/index.html HTTP/1.0`

##### 4. 应答 

web 服务器收到这个请求，进行处理。从它的文档空间中搜索子目录 mydir 的文件 index.html。如果找到该文件，Web 服务器把该文件内容传送给相应的 Web 浏览器。

为了告知浏览器，Web 服务器首先传送一些 HTTP 头信息，然后传送具体内容（即 HTTP 体信息），HTTP 头信息和 HTTP 体信息之间用一个空行分开。

常用的 HTTP 头信息有：

1. `HTTP 1.0 200 OK`: 这是Web服务器应答的第一行，列出服务器正在运行的HTTP版本号和应答代码。代码"200 OK"表示请求完成。
1. `MIME_Version:1.0`: 它指示MIME类型的版本。
1. `content_type`: 类型 这个头信息非常重要，它指示HTTP体信息的MIME类型。如：content_type:text/html指示传送的数据是HTML文档。
1. `content_length`: 长度值 它指示HTTP体信息的长度（字节）。

##### 5. 关闭连接

当应答结束后，Web 浏览器与 Web 服务器必须断开，以保证其它 Web 浏览器能够与 Web 服务器建立连接。

-----

下面我们具体分析其中的数据包在网络中漫游的经历：

在网络分层结构中，各层之间是严格单向依赖的。“服务”是描述各层之间关系的抽象概念，即网络中各层向紧邻上层提供的一组操作。下层是服务提供者，上层是请求服务的用户。服务的表现形式是原语（primitive），如系统调用或库函数。系统调用是操作系统内核向网络应用程序或高层协议提供的服务原语。网络中的 n 层总要向 n+1 层提供比 n-1 层更完备的服务，否则 n 层就没有存在的价值。

传输层实现的是“端到端”通信，引进网间进程通信概念，同时也要解决差错控制，流量控制，数据排序（报文排序），连接管理等问题，为此提供不同的服务方式。通常传输层的服务通过系统调用的方式提供，以 socket 的方式。对于客户端，要想建立一个 socket 连接，需要调用这样一些函数 `socket()`, `bind()`, `connect()`，然后就可以通过 `send()` 进行数据发送。

现在看数据包在网络中的穿行过程：

##### 应用层

首先我们可以看到在应用层，根据当前的需求和动作，结合应用层的协议，有我们确定发送的数据内容，我们把这些数据放到一个缓冲区内，然后形成了应用层的报文 data。

##### 传输层

这些数据通过传输层发送，比如 tcp 协议。所以它们会被送到传输层处理，在这里报文打上了传输头的包头，主要包含端口号，以及 tcp 的各种制信息，这些信息是直接得到的，因为接口中需要指定端口。这样就组成了 tcp 的数据传送单位 segment。tcp 是一种端到端的协议，利用这些信息，比如 tcp 首部中的序号确认序号，根据这些数字，发送的一方不断的进行发送等待确认，发送一个数据段后，会开启一个计数器，只有当收到确认后才会发送下一个，如果超过计数时间仍未收到确认则进行重发，在接受端如果收到错误数据，则将其丢弃，这将导致发送端超时重发。通过 tcp 协议，控制了数据包的发送序列的产生，不断的调整发送序列，实现流控和数据完整。

##### 网络层

然后待发送的数据段送到网络层，在网络层被打包，这样封装上了网络层的包头，包头内部含有源及目的的 ip 地址，该层数据发送单位被称为 packet。网络层开始负责将这样的数据包在网络上传输，如何穿过路由器，最终到达目的地址。在这里，根据目的 ip 地址，就需要查找下一跳路由的地址。首先在本机，要查找本机的路由表，在 windows 上运行 `route print` 就可以看到当前路由表内容，有如下几项：Active Routes, Default Route, Persistent Route.

整个查找过程是这样的:

1. 根据目的地址，得到目的网络号，如果处在同一个内网，则可以直接发送。
1. 如果不是，则查询路由表，找到一个路由。
1. 如果找不到明确的路由，此时在路由表中还会有默认网关，也可称为缺省网关，IP 用缺省的网关地址将一个数据传送给下一个指定的路由器，所以网关也可能是路由器，也可能只是内网向特定路由器传输数据的网关。
1. 路由器收到数据后，它再次为远程主机或网络查询路由，若还未找到路由，该数据包将发送到该路由器的缺省网关地址。而数据包中包含一个最大路由跳数，如果超过这个跳数，就会丢弃数据包，这样可以防止无限传递。路由器收到数据包后，只会查看网络层的包裹数据，目的 ip。所以说它是工作在网络层，传输层的数据对它来说则是透明的。

如果上面这些步骤都没有成功，那么该数据报就不能被传送。如果不能传送的数据报来自本机，那么一般会向生成数据报的应用程序返回一个“主机不可达”或“网络不可达”的错误。

以 windows 下主机的路由表为例，看路由的查找过程：

Active Routes:

| Network Destination | Netmask         | Gateway       | Interface     | Metric |
|---------------------|-----------------|---------------|---------------|--------|
| 0.0.0.0             | 0.0.0.0         | 192.168.1.2   | 192.168.1.101 | 10     |
| 127.0.0.0           | 255.0.0.0       | 127.0.0.1     | 127.0.0.1     | 1      |
| 192.168.1.0         | 255.255.255.0   | 192.168.1.101 | 192.168.1.101 | 10     |
| 192.168.1.101       | 255.255.255.255 | 127.0.0.1     | 127.0.0.1     | 10     |
| 192.168.1.255       | 255.255.255.255 | 192.168.1.101 | 192.168.1.101 | 10     |
| 224.0.0.0           | 240.0.0.0       | 192.168.1.101 | 192.168.1.101 | 10     |
| 255.255.255.255     | 255.255.255.255 | 192.168.1.101 | 192.168.1.101 | 1      |

Default Gateway: 192.168.1.2

* Network Destination: 目的网段 
* Netmask: 子网掩码 
* Gateway: 下一跳路由器入口的 ip，路由器通过 interface 和 gateway 定义调到下一个路由器的链路，通常情况下，interface 和 gateway 是同一网段的。
* Interface: 到达该目的地的本路由器的出口 ip（对于我们的个人 pc 来说，通常由机算机 A 的网卡，用该网卡的 IP 地址标识，当然一个 pc 也可以有多个网卡）。

网关这个概念，主要用于不同子网间的交互，当两个子网内主机 A, B 要进行通讯时，首先 A 要将数据发送到它的本地网关，然后网关再将数据发送给 B 所在的网关，然后网关再发送给 B。

默认网关，当一个数据包的目的网段不在你的路由记录中，那么，你的路由器该把那个数据包发送到哪里！缺省路由的网关是由你的连接上的 default gateway 决定的，也就是我们通常在网络连接里配置的那个值。

通常 interface 和 gateway 处在一个子网内，对于路由器来说，因为可能具有不同的 interface，当数据包到达时，根据 Network Destination 寻找匹配的条目，如果找到，interface 则指明了应当从该路由器的那个接口出去，gateway 则代表了那个子网的网关地址。

第一条 `0.0.0.0 / 0.0.0.0 / 192.168.1.2 / 192.168.1.101 / 10`：

`0.0.0.0` 代表了缺省路由。该路由记录的意思是：当我接收到一个数据包的目的网段不在我的路由记录中，我会将该数据包通过 `192.168.1.101` 这个接口发送到 `192.168.1.2` 这个地址，这个地址是下一个路由器的一个接口，这样这个数据包就可以交付给下一个路由器处理，与我无关。该路由记录的线路质量 10。当有多个条目匹配时，会选择具有较小 Metric 值的那个。

第三条 `192.168.1.0 / 255.255.255.0 / 192.168.1.101 / 192.168.1.101 / 10`：

直联网段的路由记录：当路由器收到发往直联网段的数据包时该如何处理，这种情况，路由记录的 interface 和 gateway 是同一个。当我接收到一个数据包的目的网段是 `192.168.1.0` 时，我会将该数据包通过 `192.168.1.101` 这个接口直接发送出去，因为这个端口直接连接着 `192.168.1.0` 这个网段，该路由记录的线路质量 10 （因 interface 和 gateway 是同一个，表示数据包直接传送给目的地址，不需要再转给路由器）。

一般就分这两种情况，目的地址与当前路由器接口是否在同一子网。如果是则直接发送，不需再转给路由器，否则还需要转发给下一个路由器继续进行处理。

查找到下一跳 ip 地址后，还需要知道它的 mac 地址，这个地址要作为链路层数据装进链路层头部。这时需要 arp 协议，具体过程是这样的，查找 arp 缓冲，windows 下运行 `arp -a` 可以查看当前 arp 缓冲内容。如果里面含有对应 ip 的 mac 地址，则直接返回。否则需要发生 arp 请求，该请求包含源的 ip 和 mac 地址，还有目的地的 ip 地址，在网内进行广播，所有的主机会检查自己的 ip 与该请求中的目的 ip 是否一样，如果刚好对应则返回自己的 mac 地址，同时将请求者的 ip, mac 保存。这样就得到了目标 ip 的 mac 地址。

##### 链路层

将 mac 地址及链路层控制信息加到数据包里，形成 Frame，Frame 在链路层协议下，完成了相邻的节点间的数据传输，完成连接建立，控制传输速度，数据完整。

##### 物理层

物理线路则只负责该数据以 bit 为单位从主机传输到下一个目的地。

下一个目的地接受到数据后，从物理层得到数据然后经过逐层的解包，到链路层、到网络层，然后开始上述的处理，再经网络层、链路层、物理层将数据封装好继续传往下一个地址。

在上面的过程中，可以看到有一个路由表查询过程，而这个路由表的建立则依赖于路由算法。也就是说路由算法实际上只是用来路由器之间更新维护路由表，真正的数据传输过程并不执行这个算法，只查看路由表。这个概念也很重要，需要理解常用的路由算法。而整个 tcp 协议比较复杂，跟链路层的协议有些相似，其中有很重要的一些机制或者概念需要认真理解，比如编号与确认，流量控制，重发机制，发送接受窗口。

-----

## tcp/ip 基本模型及概念

##### 物理层

设备：中继器（repeater）、集线器（hub）。

对于这一层来说，从一个端口收到数据，会转发到所有端口。

##### 链路层

协议：SDLC（Synchronous Data Link Control）、HDLC（High-level Data Link Control） ppp 协议

独立的链路设备中最常见的当属网卡，网桥也是链路产品。集线器 MODEM 的某些功能有人认为属于链路层，对此还有些争议认为属于物理层设备。除此之外，所有的交换机都需要工作在数据链路层，但仅工作在数据链路层的仅是二层交换机。其他像三层交换机、四层交换机和七层交换机虽然可对应工作在 OSI 的三层、四层和七层，但二层功能仍是它们基本的功能。

因为有了 MAC 地址表，所以才充分避免了冲突，因为交换机通过目的 MAC 地址知道应该把这个数据转发到哪个端口。而不会像 HUB 一样，会转发到所有滴端口。所以，交换机是可以划分冲突域滴。

##### 网络层

四个主要的协议: 
 
* 网际协议 IP：负责在主机和网络之间寻址和路由数据包。    
* 地址解析协议 ARP：获得同一物理网络中的硬件主机地址。    
* 网际控制消息协议 ICMP：发送消息，并报告有关数据包的传送错误。    
* 互联组管理协议 IGMP：被 IP 主机拿来向本地多路广播路由器报告主机组成员。

该层设备有三层交换机、路由器。

##### 传输层

两个重要协议 TCP 和 UDP 。

端口概念：TCP/UDP 使用 IP 地址标识网上主机，使用端口号来标识应用进程，即 TCP/UDP 用主机 IP 地址和为应用进程分配的端口号来标识应用进程。端口号是 16 位的无符号整数， TCP 的端口号和 UDP 的端口号是两个独立的序列。尽管相互独立，如果 TCP 和 UDP 同时提供某种知名服务，两个协议通常选择相同的端口号。这纯粹是为了使用方便，而不是协议本身的要求。利用端口号，一台主机上多个进程可以同时使用 TCP/UDP 提供的传输服务，并且这种通信是端到端的，它的数据由 IP 传递，但与 IP 数据报的传递路径无关。网络通信中用一个三元组可以在全局唯一标志一个应用进程：（协议，本地地址，本地端口号）。

也就是说 tcp 和 udp 可以使用相同的端口。

可以看到通过 `(协议, 源端口, 源ip, 目的端口, 目的ip)` 就可以用来完全标识一组网络连接。

##### 应用层

* 基于 tcp: Telnet、FTP、SMTP、DNS、HTTP
* 基于 udp: RIP、NTP（网落时间协议）、DNS（DNS 也使用 TCP）、SNMP、TFTP

-----

参考文献：

1. [读懂本机路由表](http://hi.baidu.com/thusness/blog/item/9c18e5bf33725f0818d81f52.html)
1. [Internet 传输层协议](http://www.cic.tsinghua.edu.cn/jdx/book6/3.htm)
1. _计算机网络_, 谢希仁.