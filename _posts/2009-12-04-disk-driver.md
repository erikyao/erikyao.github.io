---
category: Hardware
description: ''
tags: []
title: Disk Drive（磁盘驱动器）
---

继续补课。来自wikipedia。

---

一个 disk drive 包括两个移动部件：disk assembly (磁盘组合) 和 head assembly (磁头组合)。disk assembly 是盘片 (platter) 的集合，一个盘片有2个盘面 (side)。head assembly 是磁头 (head) 的集合，一个盘面一个磁头。

![](https://live.staticflickr.com/5785/23293777963_54d4f15f65_n.jpg)

## (1) Tracks (磁道)

The tracks are the thin concentric circular strips on a floppy medium or platter surface which actually contain the magnetic regions of data written to a disk drive.  

磁道是单个盘片上的同心圆环。

## (2) Sectors (扇区)

一个磁道可以分成多个扇区。如果把磁道比作单个盘片上的同心圆环的话，那么扇区就是这个圆环上的一个扇面。  

扇区之间通过间隔 (gap) 隔开，gap 不能用来记录数据。gap 大概占整个 track 的 10%.

可以简单地认为扇区的分布是均匀的，如下图所示，这时每个磁道的扇区数相等。不过这么一来不同磁道上的扇区面积不等，若要求每个扇区保存的数据容量相同的话，那么不同磁道上扇区的数据密度就会相差非常大。所以一般的做法是内圈 (比如内1/3) 磁道的扇区数最少，中圈 (比如中1/3) 的稍多，外圈 (比如外1/3) 的磁道数最多。

[](https://live.staticflickr.com/5811/23920547675_df5560f48a_n.jpg)

## (3) Cylinder (柱面)

Cylinders are vertically formed by tracks. In other words, track 12 on platter 0 plus track 12 on platter 1 etc. is cylinder 12. The number of cylinders of a disk drive exactly equals the number of tracks on a single surface in the drive. 

柱面这个概念的提出可能是因为磁头组合的运动是 “同手同脚”，$n$ 个磁头是共同进退。要将磁头 $h$ 定位到盘片 $s$ 上的磁道 $t$ 中的扇区 $c$，首先是磁头组合运动到柱面 $t$ (柱面 $t$ 即是所有盘片的磁道 $t$ 的集合)，然后选择盘片 $s$ 的磁头 $h$，转动盘片 $s$ 使磁头 $h$ 到达扇区 $c$ 上方，然后磁头 $h$ 开始读写扇区 $c$。

`(柱面#, 盘片#, 扇区#)` 唯一确定一块扇区，相当于 `(盘片#, 磁道#, 扇区#)` 唯一确定一块扇区，因为 `柱面# == 磁道#`。