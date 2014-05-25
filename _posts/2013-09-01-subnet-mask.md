---
layout: post
title: "Subnet Mask"
description: ""
category: Network
tags: [Network-101]
---
{% include JB/setup %}

　　IP 层提供了 IP 地址，IPv4 是 4 byte，`32 bit == 网络号 (#network) + 主机号 (#host)`，所谓 #network 就是区分 A 类、B 类、C 类网的那个。  

* A 类网：#network 占 1 byte
* B 类网：#network 占 2 byte
* C 类网：#network 占 3 byte
 
　　子网掩码：如果是 A 类网的 IP 地址，则子网掩码前 8 bit 为 1（A类网的 #network 占 1 byte），依此类推。子网掩码后面的部分，如果开头是连续的 n 个 1，即是划分 2^n 个子网。  
 
　　例：申请到的 IP 为 210.73.a.b，为 C 类IP地址，要求划分27个子网。  

　　解：C 类网 IP 地址 #network 占3 byte，所以子网掩码前 3 byte 为255.255.255  

　　子网数 27，由于 2^4 < 27 < 2^5，所以子网掩码后 1 byte 为 11111000，即 240。所以整个子网掩码为255.255.255.240
 
　　注意，子网掩码后半部分有 m 个 0，则说明子网内可以有 2^m 台主机
 
　　这样，子网号就可以是 210.73.a.X，整个网络的结构如下：

* 210.73.a.b
	* 210.73.a.00000XXX（子网1）--> 8台主机
	* 210.73.a.00001XXX（子网2）--> 8台主机                   
	* ……
 
　　210.73.a.b 这台机器称为网关，210.73.a.b 这个地址称为公网 IP
