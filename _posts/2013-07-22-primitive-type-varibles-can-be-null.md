---
layout: post
title: "primitive type 可以为 null"
description: ""
category: Java
tags: []
---
{% include JB/setup %}

```java
Boolean b = null; 
boolean b2 = b;

System.out.println(b2); // null
```

所以不要以为 `boolean` 是非黑即白；`int`/`Integer` 等 primitive type 同理