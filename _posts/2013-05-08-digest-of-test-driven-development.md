---
layout: post
title: "Digest of <i>Test Driven Development</i>"
description: ""
category: [Java]
tags: [Book, Java-TDD]
---
{% include JB/setup %}

[这本书](http://book.douban.com/subject/1230036) 的副标题是 "By Example"，所以整书适合一口气读完，也不用每个例子都敲一遍，顺着作者思路走完一遍就可以了。  

以下是一些摘抄和总结：

> 尽快让测试程序可运行是压到一切的中心任务，手段有三：
> 
> * bogus implementation: 伪实现。先不管三七二十一返回常量，然后逐渐用变量代替常量，慢慢把伪实现变成真实现
> * obvious implementation: 明显实现。简单的逻辑就直接写进来好了，不用伪实现
> * triangulation: 三角定位。简单说，如果一个 assert 不能指导你写出正确的逻辑……那我们就写两个 assert…… 同理，当你有两个以上的类时，你才可能做抽象  

<!-- -->
> 不考虑继承、接口这些设计原则，可以先大量 ctrl+c/ctrl+v，然后再收拾烂摊子（重构）

<!-- -->
> 引入新类的时候，起类名可以依据已有的 assert，再加上直觉或者常识来决定

<!-- -->
> 感觉 TDD 适合设计复杂的 PO  
> 然后 Mock 适合用来测试 Collaborator （比如调用 DAO 的 Service）

<!-- -->
> 如果在测试的时候，需要传入两个同类型的参数，那么不要取相同的常量值。相同的常量值可能会掩盖某些问题（比如参数的顺序）

<!-- -->
> Q: 假如你有一个测试 to do list，选择哪一个开始动手的呢？  
> A: 看上去最简单的、你最有信心瞬间解决的那一个。如果每一个你觉得都很难，说明这个 list 还可以细分

<!-- -->
> 正确的 TDD 节奏是：
> 
> * 加测试1/不可运行/可运行
> * 加测试2/不可运行/可运行
> * ...
> * 加测试N/不可运行/可运行
> * 重构/不可运行/可运行
> * 重复上述过程

<!-- -->
> 测试提纲（一种风格，看个人喜好）：
> 
> 	//\* first layer
> 	//\*\* second layer
> 	//\*\*\* third layer step1
> 	//\*\*\* third layer step2
>  
> 在最底层提纲下面写测试代码

<!-- -->
> 递归组合：比如 Folder 可以包含 Folder，TestSuite 可以包含 TestSuite；避免了再抽象出更高层次的集合类

<!-- -->
> 不做设计，而是让好的设计自己浮出水面。