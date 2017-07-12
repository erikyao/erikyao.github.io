---
layout: post
title: "SimpleDateFormat 不是线程安全的"
description: ""
category: Java
tags: [Java-101]
---
{% include JB/setup %}

见 [stackoverflow: Why is Java's SimpleDateFormat not thread-safe?](http://stackoverflow.com/questions/6840803/simpledateformat-thread-safety)

所以 `static SimpleDateFormat` 在并发场景下，`parse(String dateStr)` 会抛异常，即使 `dateStr` 的格式是正确的。