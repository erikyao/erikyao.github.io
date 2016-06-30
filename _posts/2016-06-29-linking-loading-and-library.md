---
layout: post
title: "Linking, Loading and Library"
description: ""
category: OS
tags: [Book]
---
{% include JB/setup %}

[northbridge_southbridge]: https://farm8.staticflickr.com/7239/27374870374_03bd8a9661_o_d.png
[software_hierarchy]: https://farm8.staticflickr.com/7716/27886596032_ec5a763b1a_o_d.png

## Part 1. 简介

### 1. 温故而知新

注意南桥北桥其实是 chip 而不是 bus，它们是 chipset 的成员，位于 motherboard 上：

![][northbridge_southbridge]

- northbridge: Intel 旧称 Memory Controller Hub (MCH)，现在普遍把 graphics card 也连过来，所以也 a.k.a. Graphics and Memory Controller Hub (GMCH)
    - northbridge 连接高速设备，比如 CPU、Memory、GPU，所以必然用的是高速 bus
    - 随着技术的发展，今天的高速 bus 可能明天就用到 southbridge 上了，会有更高速的 bus 用于 northbridge
- southbridge: Intel 旧称 I/O Controller Hub (ICH)
    - southbridge 连接低速设备，比如 USB, audio, serial, system BIOS, interrupt controller and IDE channels.
    - 相对于 northbridge，southbridge 肯定用的是低速 bus

Multi-core processor 其实是 multi-processors 的变体：

- 一个 multi-core processor 内部其实是多个精简版的 processors（至少是精简掉了 cache；故称为 core）拼在一起，共用一套 cache
- processor 内部的 cache 是非常贵的，multi-core processor 这么设计一来减少成本方便投入民用，二来其实民用也用不上标准的 multi-processors
- 相当于是把 processor 当做组件来设计了一个高级一点的 processor
- Multi-core processor 可以看做是 SMP (Symmetrical Multi-Processing) 的一种实现。symmetrical 指各个 processor 间是平等的关系（i.e. 不存在 master-slave 之类的关系）

软件：

- 系统软件
    - OS kernel, drivers, runtime libraries, other system tools
    - 开发工具（Development Tools）：compiler, debugger, assembler, development libraries
- 应用程序（Application）

![][software_hierarchy]

> Any problem in computer science can be solved by another layer of indirection. (In computer programming, _**indirection**_ is the ability to reference something using a name, reference, or container instead of the value itself.)

- Application 和 Development Tools 使用的都是 OS API
- OS API 的提供者是 runtime libraries
    - 比如 Linux 下的 glibc 提供 POSIX API
    - Win32 提供 32-bit Windows API
- runtime libraries 使用的是 OS 提供的 SCI (system call interface)，而 SCI 的实现方式一般是 software interrupt

硬件抽象：

- Unix 下硬件设备被抽象成文件
- Windows 下：
    - 图形硬件被抽象成 GDI (graphics device interface)
    - 多媒体设备被抽象成 DirectX 对象

Segmentation:

- 简单说就是根据 application 的需要划分 memory 供其使用
- 实际包含了 virtual memory 到 physical memory 的映射步骤
    - virtual memory 的目的主要是为了方便管理
    - 映射往往包含了其他信息，比如实际的 physical memory 的 start 和 offset，跨 segment 的 memory access 很容易被系统 detect 到并 refuse
    - 这个映射由 MMU (memory management unit) 来管理；MMU 一般都集成在 CPU 内部

Paging:

- Paging 给 virtual memory、physical memory 和 disk 提供了一个统一 size (一般是 4KB) 的 unit: page
    - 所以有 VP (virtual page)、PP (physical page) 和 DP (disk page)
- 这样允许只 load 一部分文件到 memory

## Part 2. 静态链接

### 2. 编译和链接

IDE 的 "build" 往往包含了 compile 和 link 这两个步骤。



