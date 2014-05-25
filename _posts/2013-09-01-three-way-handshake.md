---
layout: post
title: "Three-way Handshake"
description: ""
category: Network
tags: [Network-101]
---
{% include JB/setup %}

![](https://ujcyqa.bn1.livefilestore.com/y2pxPVylL25zMMg-GVF2hdawkzAgRVRkypQZpgZbsYoSpJbnqXCpXqjDBJVM7mrpjb3LzjHI-hdC96n93B9QRz81P5Fn4IJZGdhd_D6HdrKj2c/Image.png?psid=1)

　　TCP 协议采用三次握手建立一个连接。  
 
　　第一次握手：客户端发送 syn 包 (syn=j) 到服务器，并进入 SYN_SEND 状态，等待服务器确认；（客户端伸左手）  
 
　　第二次握手：服务器收到 syn 包后必须确认客户的 syn 包，所以需要发送 ack 包 (ack=j+1) ，同时自己也要发送一个 syn 包 (syn=k) ，合称 syn+ack 包，此时服务器进入 SYN_RECV 状态；（服务器伸左手，握手；服务器伸右手）  
 
　　第三次握手：客户端收到服务器的 syn+ack 包，需确认服务器的 syn 包，所以发送 ack 包 (ack=k+1) ，此包发送完毕，客户端和服务器进入 ESTABLISHED 状态，完成三次握手。（客户端伸右手，握手）  
 
　　完成三次握手，客户端与服务器开始传送数据。  

　　在上述过程中，还有一些重要的概念：
 
* 未连接队列：在三次握手协议中，服务器维护一个未连接队列，该队列为每个客户端的 syn 包 (syn=j) 开设一个条目，该条目表明服务器已收到 syn 包，并向客户发出确认，正在等待客户的 ack 包。这些条目所标识的连接在服务器处于 SYN_RECV 状态，当服务器收到客户的确认包时，删除该条目，服务器进入 ESTABLISHED 状态。
* backlog 参数：表示未连接队列的最大容纳数目。
* syn+ack 重传次数：服务器发送完 syn+ack 包，如果未收到客户确认包，服务器进行首次重传，等待一段时间仍未收到客户确认包，进行第二次重传，如果重传次数超过系统规定的最大重传次数，系统将该连接信息从半连接队列中删除。注意，每次重传等待的时间不一定相同。
* 半连接存活时间：是指半连接队列的条目存活的最长时间，也即服务器从收到 syn 包到确认这个报文无效的最长时间，该时间值是所有重传请求包的最长等待时间总和。有时我们也称半连接存活时间为 Timeout 时间、SYN_RECV 存活时间。
