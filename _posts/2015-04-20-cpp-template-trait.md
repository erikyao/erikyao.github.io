---
layout: post
title: "C++: Template Trait"
description: ""
category: C++
tags: [template]
---
{% include JB/setup %}

具体见 [Traits: a new and useful template technique](http://www.cantrip.org/traits.html)。这里只说下感想：

- 首先你可以把 trait 理解为是一个 template parameter 的封装。比如你一个 template 有很多个参数，写起来很烦，那我们 java 常见的做法就是把这个多个参数封一个类，然后只传这一个类作为参数就好了。这里 trait 也是一样的作用。
- 紧接着，我们发现可以把 trait 也设计成一个 template，这样就可以做成很多套 trait。如果是 java 来做这个事情，我的想法会是把这个参数类再套一个 enum。
- 进一步，trait 可以封装一些操作。我觉得发展到这个阶段，trait 就有 [Strategy 模式](/java/2014/06/24/digest-of-agile-software-development-ppp#dp_strategy) 的意味了。
