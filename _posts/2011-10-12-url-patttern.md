---
layout: post
title: "JSP: url-patttern"
description: ""
category: Java
tags: [Servlet]
---
{% include JB/setup %}

## 匹配原则

### 1. 精确路径匹配

例子：

```
servletA -> url-pattern = /test
servletB -> url-pattern = /*
```

这个时候，如果我访问的 url 为 http://localhost/test，这个时候容器就会先进行精确路径匹配，发现 /test 正好被 servletA 精确匹配，那么就去调用 servletA，也不会去理会其他的 servlet 了。

### 2. 最长路径匹配

例子：

```r
servletA -> url-pattern = /test/*
servletB -> url-pattern = /test/a/*
```

此时访问 http://localhost/test/a 时，容器会选择路径最长的 servlet 来匹配，也就是这里的 servletB。

### 3. 扩展匹配

如果url最后一段包含扩展，容器将会根据扩展选择合适的 servlet。例子：`url-pattern = *.action`

### 4. 如果前面三条规则都没有找到一个 servlet

容器会根据 url 选择对应的请求资源。如果应用定义了一个 default servlet，则容器会将请求丢给 default servlet。  

default servlet 的 servlet-name 和 servlet-class 可以自定，但是固定有 `url-pattern = /`

-----

简单总结下：

1. `url-pattern = /[xxx]`（以 / 开头）和 `url-pattern = [xxx]/*`（以 /* 结尾）的是用来做路径映射的。
2. `url-pattern = *.[xxx]`（以 \*. 开头）的是用来做扩展映射的。
3. `url-pattern = /` 是 default servlet 专用。
4. 剩下的都是用来定义详细映射的。比如：`url-pattern = /aa/bb/cc.action`

所以，为什么 `url-pattern = /*.action` 这样一个看起来很正常的匹配会错？因为这个匹配即属于路径映射，也属于扩展映射，导致容器无法判断。
