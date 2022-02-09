---
layout: post
title: "MongoDB Aggregation Stages: addFiels (set) / project (unset) / replaceRoot (replaceWith)"
description: ""
category: MongoDB
tags: []
---
{% include JB/setup %}

这一篇是吐槽。

## `$addFields` 与它的 alias `$set`

`$addFields`，顾名思义，是添加 new field 用的，但同时它又能 overwrite existing fields，那你告诉我为什么一开始就不它命名成 `$setField` 之类的？

现在引入了 `$set` 做 alias，说是亡羊补牢吧，但是我现在又要区分 `$set` 是 operator 还是 stage。你从 SEO 的角度来看这么 aliasing 也不方便搜索吧？

## `$project` 与它的 alias `$unset`

`$project` 的作用形象一点说是 "给 document 做瘦身"，它可以标定 included fields，也可以标定 excluded fields。估计是标定 excluded fields 用起来不太方便，所以引入了 `$unset` 做 alias。语法上，下面两种写法是等价的：

```python
{ $project: { "<field1>": 0, "<field2>": 0, ... } }

{ $unset: [ "<field1>", "<field2>", ... ] }
```

但现在你这个 `$unset` 和 `$set` 又不是一个层面上的语义，就很神经病。

## `$replaceRoot` 与它的 alias `$replaceWith`

`$replaceRoot` 这个需要先理解啥是 "root"。这里 "root" 指的是 [`ROOT` 这个专用于 aggregation 的 system variables](https://docs.mongodb.com/manual/reference/aggregation-variables/#mongodb-variable-variable.ROOT)：

> **ROOT** references the root document, i.e. the top-level document, currently being processed in the aggregation pipeline stage.

- 更具体的例子可以看 [What is `$$ROOT` in MongoDB aggregate and how it works?](https://stackoverflow.com/questions/61804268/what-is-root-in-mongodb-aggregate-and-how-it-works)

因为 aggregation 是个 pipeline，所以可以想象成是一个 chain，最原始的输入就是 root document。

`$replaceRoot` 的意图就是 "想要用 pipeline 下游得到的 aggregated document 替换掉 root document"，相当于是把 aggregate 和 replace 两步一起做了：

```r
rootDocument <- aggregate(rootDocument)
```

目前看来，`$replaceRoot` 这个 stage name 设计得还行，但是它的完全体要写成这样：

```python
{ $replaceRoot: { newRoot: <replacementDocument> } }
```

这个 `newRoot` 就不知所谓，引入的 alias `$replaceWith` 有更简单的语法：

```python
{ $replaceWith: <replacementDocument> }
```
