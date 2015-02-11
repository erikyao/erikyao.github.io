---
layout: post
title: "windows 下查看端口是否被占用的方法"
description: ""
category: Windows
tags: [Config-Windows]
---
{% include JB/setup %}

　　假如我们需要确定谁占用了我们的80端口。  

　　在windows命令行窗口下执行：

<pre class="prettyprint linenums">
C:\>netstat -aon|findstr "80"
TCP     127.0.0.1:80         0.0.0.0:0               LISTENING       2448
</pre>

　　看到了吗，端口被进程号为2448的进程占用，继续执行下面命令：

<pre class="prettyprint linenums">
C:\>tasklist|findstr "2448"
thread.exe                     2016 Console                 0     16,064 K
</pre>

很清楚吧，thread占用了你的端口，Kill it

　　如果第二步查不到，那就开任务管理器，看哪个进程是2448，然后杀之即可。
