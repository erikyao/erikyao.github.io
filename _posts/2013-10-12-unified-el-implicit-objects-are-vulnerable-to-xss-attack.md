---
layout: post
title: "Unified EL implicit objects are vulnerable to XSS attack"
description: ""
category: JSP
tags: [JSP-101, Network-101]
---
{% include JB/setup %}

　　XSS，Cross-site scripting，类型有：

1. 存储型（stored），又称持久型（persistent）

	> it occurs when the data provided by the attacker is saved by the server, and then permanently displayed on "normal" pages returned to other users in the course of regular browsing, without proper HTML escaping.  
	> <br/>
	> A classic example of this is with online message boards where users are allowed to post HTML formatted messages for other users to read

2. 反射型（reflected），又称非持久型（non-persistent）。
	
	> ... show up when the data provided by a web client, most commonly in HTTP query parameters or in HTML form submissions, is used immediately by server-side scripts ..., without properly sanitizing the request

　　jsp 中的防范策略：web 接口的参数进行约束验证，尽量使用 jstl 方式（比如最基本的 &lt;c:out&gt; 都有特殊符号转码的功能）而不是 EL 隐式对象（比如 ${param.uid} 这种）输出页面内容，参见 [Unified EL](https://www.owasp.org/index.php/JSP_JSTL#Unified_EL)

　　更多 XSS 内容有：[XSS Filter Evasion Cheat Sheet](https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet)、[Spring MVC防御CSRF、XSS和SQL注入攻击](http://www.cnblogs.com/Mainz/archive/2012/11/01/2749874.html)


