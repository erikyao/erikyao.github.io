---
category: Ant
description: ''
tags: []
title: Ant 中 javac 假死的解决办法
---

当前项目用的是 eclipse 3.5，然后文件编码都是 utf-8。在执行 Ant 脚本时，javac 死活不动，解决方案是：右键 build.xml --> run as --> External Tools Configurations --> Common 选项卡 --> Console Encoding 选择 utf-8。