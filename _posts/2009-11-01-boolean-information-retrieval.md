---
layout: post
title: "IR 经典模型之布尔模型"
description: ""
category: Information-Retrieval
tags: []
---
{% include JB/setup %}

## 1. 经典模型的前提概念

* 以 ki 表示 indexing item，K = {k1, k2, …, kt} 为整个系统的 indexing item 集，即整个系统只有 t 个 indexing item  
* 针对文档 dj，wij 为 ki 在 dj 中的权值，若 ki 没有在 dj 中出现，则 wij = 0  
* dj 可以表示为 dj = {w1j, w2j, …, wtj}
* gi(dj) = wij

## 2. 布尔模型中的查询 q

* q 由若干 ki、连接词 AND、OR、NOT 构成，比如 q = ka AND (kb OR (NOT kc))  
* q 可以写成一个析取范式 qdnf = (1, 1, 1)∨(1, 1, 0)∨(1, 0, 0)，三元组 (1, 1, 1) 称为 qdnf 的一个合取分量 qcc  

## 3. 布尔模型中的相似度

```
if 存在 qcc ∈ qdnf 满足对任意 ki，gi(dj) = wij = gi(qcc) 
	则 sim(dj, q) = 1，即文档 dj 与查询 q 相关  
else 
	sim(dj, q) = 0，即文档 dj 与查询 q 无关 
```

## 4. 对 gi(qcc) 的理解

　　考虑到 dj 是个 t 元组，形如 dj = {1, 0, 1, 1, ..., 0, 0}，“对任意ki，gi(dj) = wij = gi(qcc)” 从实质上就是 dj = qcc。但是，qcc 中并不会包含所有 t 个 indexing item，设 \|qcc\| = n，一般情况下 t != n，所以可以从以下两个方面理解：

1. 扩展qcc到t元  
2. 截取(或者叫投影)dj到n元  

举例：dj = (w1j = 0, w2j = 1, w3j = 1)，qcc = (w2 = 1, w3 = 1)。扩展dj (投影 dj 到 (w2, w3))，dj' = (w2j = 1, w3j = 1) = qcc；扩展 qcc，qcc' = (w1 = 0, w2 = 1, w3 = 1) = dj
