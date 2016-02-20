---
layout: post
title: "private、package 权限字段不可继承 + 向上转型的新理解"
description: ""
category: Java
tags: [Java-101]
---
{% include JB/setup %}

　　base class 的 private member 是不可继承的(详细请参见 [关于class和class member的访问权限](/java/2009/03/19/accessibility-of-class-and-class-member))，所以在 ext class 中也不会有这些 member。

　　可以这样理解：ext class 隐式包含一个 base class，base class 根据 member 的访问权限决定是否将 member 暴露给 ext class。

　　不过 ext class 可以通过 base class 的非 private getter 来 access 这些 private member。

　　package 权限字段不可继承的理由同。

　　按这种理解，我们可以画这么一幅图（不一定是真实的情况，只是反映我的理解）：

![](https://farm2.staticflickr.com/1454/23293777983_35772057d0_o_d.png)

　　另外还有：如果 Base 类对象引用 baseRef 指向一个 Ext 类对象，那么 `baseRef instanceof Ext == true`，因为 baseRef 的确指向了一个 Ext 对象；但 baseRef 并不能访问 Ext 对象中新字段和新方法，相当于 baseRef 只能访问这个 Ext 对象中内嵌的 Base 对象。
