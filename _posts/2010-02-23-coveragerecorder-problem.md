---
layout: post
title: "clover 测试 servlet，提示找不到类 com_cenqua_clover/CoverageRecorder 的解决方法"
description: ""
category: Continuous-Integration
tags: [GTR, Clover-Config]
---
{% include JB/setup %}

　　使用 clover-for-eclipse 时，发现测试一个简单的 Dynamic Web Project 时，servlet 总是显示不出来，提示找不到类 com_cenqua_clover/CoverageRecorder。  

　　解决办法一：下载一个 clover-for-ant，把 lib 里的 clover.jar 放到项目的 lib 下即可。  

　　解决方法二：由 [sunnylocus](http://sunnylocus.iteye.com/) 提供：

> 不用这么复杂，Run ->Run Configurations 选择你运行此 servlet 的 web 容器，点选 classpath 选项卡，在 User Entries 加 CLOVER_RUNTIME 环境变量