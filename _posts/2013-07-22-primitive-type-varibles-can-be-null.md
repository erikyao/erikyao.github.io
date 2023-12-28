---
category: Java
description: ''
tags: []
title: 'Java: primitive type 可以为 null'
---

```java
Boolean b = null; 
boolean b2 = b;

System.out.println(b2); // null
```

所以不要以为 `boolean` 是非黑即白；`int`/`Integer` 等 primitive type 同理