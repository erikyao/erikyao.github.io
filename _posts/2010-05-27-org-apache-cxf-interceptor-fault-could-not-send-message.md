---
category: CXF
description: ''
tags: []
title: 'org.apache.cxf.interceptor.Fault: Could not send Message'
---

说明与 esb 服务器通讯不正常。  

检查点：

1. 在浏览器中查看 wsdl 是否发布成功
2. 检查 ESB 端口是否打开
3. 检查客户端调用的 endpoint 中 Address 是否有拼写错误

不是什么大问题，但第 3 种情况还真是遇到了，谨记。