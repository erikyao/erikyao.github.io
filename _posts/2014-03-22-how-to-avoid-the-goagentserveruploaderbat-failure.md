---
category: Windows
description: ''
tags: []
title: goagent/server/uploader.bat 失败的解决办法
---

失败的情形有 403 和 EOF 什么什么的，此时可以这么搞：

1. 保证新版本的 goagent/local/goagent.exe 正在运行，否则会提示连接 `127.0.0.1 timeout`
2. 还不行的话可以加一个 host `74.125.229.174	appengine.google.com`