---
layout: post
title: "private、package 权限字段不可继承"
description: ""
category: Java
tags: [Java-101]
---
{% include JB/setup %}

　　base class 的 private member 是不可继承的(详细请参见 [关于class和class member的访问权限](/java/2009/03/19/accessibility-of-class-and-class-member/))，所以在 ext class 中也不会有这些 member。

　　可以这样理解：ext class 隐式包含一个 base class，base class 根据 member 的访问权限决定是否将 member 暴露给 ext class。

　　不过 ext class 可以通过 base class 的非 private getter 来 access 这些 private member。

　　package权限字段不可继承的理由同。
