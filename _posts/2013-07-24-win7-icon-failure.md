---
layout: post
title: "win7 图标显示不正常如何解决"
description: ""
category: Windows
tags: [Config-Windows]
---
{% include JB/setup %}

　　重建图标缓存不用重启，先打开 WINRAR，然后打开任务管理器，找到 explorer.exe 结束该进程（一定要先结束，否则后续删除  Iconcache.db 也不会起作用）。  
　　然后在 WINRAR 地址栏里输入：%userprofile%\appdata\local\，点击确认，在下面找到 Iconcache.db，将这个文件删除。  
　　然后再在任务管理器里重新打开explorer.exe进程就行了。

