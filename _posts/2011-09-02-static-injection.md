---
layout: post
title: "static 属性的注入必须使用非 static 的 setter"
description: ""
category: Spring
tags: []
---
{% include JB/setup %}

有一些 util 类或是 config 类会用到 static 属性，这些 util 类或是 config 类也可以通过 Spring 来初始化，和初始化一个 POJO 没什么区别，虽然实际应用中不太可能去创建一个 util 对象或是 config 对象，一般都是使用 static getter 而已。  

但如果要使用 Spring 来初始化，那么这些 static 属性不能用 static 的 setter 来注入，否则 `NotWritablePropertyException`。
