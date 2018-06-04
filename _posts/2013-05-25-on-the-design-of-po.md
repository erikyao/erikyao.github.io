---
layout: post
title: "设计 PO 的一些经验"
description: ""
category: Thought
tags: [Experience]
---
{% include JB/setup %}

### 1. 按 sql schema 设计

目前还没有遇到不按 schema 设计 PO 的情况……而且一个 schema 也没见着可以直接设计出两个 PO……  

缺点：
	
1. 要求尽早做 db 设计，完全自顶向下是不太可能的了；
2. 如果 dba 否决了你的 schema 或是提出新的 schema（比如分片维度不同或者把一个复杂字段拆成多个小字段），需要重新设计 PO。
	
所以最好是 sandwich 开发，一方面自顶向下从 Controller 入手，另一方面尽快启动 schema 的设计
	
### 2. 从页面元素的维度来设计

比如 lp 的 gallery，是个 lp 列表，它虽然是排成了两行，但本质是一维的。  

全 pk，则是一个 `<field, target>` 的矩阵，明显是二维的，你在显示的时候，可能会写成 `Map<field, Map<target, PO(data)>>` 或是 `List<PO(field, target, data)>`。  

简单来说，view 中 model 的结构也会影响你的 PO 设计。从另一个角度来说，schema 设计和 PO 设计应该也是 sandwich 开发，schema 遵循一维逻辑（明显你最多只能 `queryForList`，总不能直接 query 出一个二维 map 吧？），PO 设计要考虑页面元素的维度，必要时设计一个中间 PO 来存 schema 转置或者 row 解析的结果

### 3. 从返回 json 的结构来设计

明显关联的一组 json 字段或是 jsonArray 都是潜在的切入点。`response.write(obj.toJsonObject().toString())` 真是爽快的写法。  

缺点：

1. 前端制定接口规范的时间太靠后；
2. 而且制定出规范后，讨论和修改也很频繁，PO 的修改可能会很频繁

一个过于简单的 `JSONObject`，可以不设计成 PO  

应该给 PO 设计 `toJson()` 方法，而不是写一个 JSON converter 来处理所有 PO  

如果 db 里存的 json 和前端的 json 格式不同（这是常见的事情），PO 里可以分成 `toDbJson()` 和 `toFrontEndJson()` 两种方法  

不可因为 json 而迁就 PO 的设计，宁可多写一点转换逻辑在 `toJson()` 方法里（如：`fontName` vs `fontFamily`，lp 项目）  

### 4. 如果有一个复杂的 Collection

比如 `Map<PO1, Map<PO2, List<PO3>>>` 这种多层的 Collection 嵌套，你需要 get 多次才能拿到 PO3 或者层层 put 才能 put 一个 PO3，此时应果断写一个 PO，作为这个复杂 Collection 的代理，屏蔽多次 get 和层层 put 的恶心逻辑

