---
category: Information-Retrieval
description: ''
tags: []
title: IR 经典模型之向量模型
---

## 1. 向量模型同样将 dj 和 qcc 同级计算，采用的同级方式是扩展 qcc 到 t 维

---

## 2. 相似度计算

* 依旧有 dj = {w1j, w2j, …, wtj}，但这里的 wij 不再是二元值，而是一个加权值；同样定义qcc = {w1, w2, ..., wt}，这里的 wi 也是一个加权值
* sim(dj, qcc) = dj • qcc / (\|dj\| * \|qcc\|)， dj • qcc为向量点乘运算
* 一次检索的过程是根据 qcc 来和所有 dj ∈ D (文档集合)，计算出一组 sim 值，然后依据 sim 值来排序 D，返回前排部分文档 (可自定义阈值，比如返回 sim 值大于 0.5 的或是 D 排序后的前 30% 文档)
* \|dj\|² = ∑i (wij²)；\|qcc\|² = ∑i (wi²)，对于一次检索而言，\|qcc\| 值对排序不会产生任何影响；dj • qcc =  ∑i (wij * wi)
* term freqency (词频)：表示词 ki 在文档 dj 中出现的频率，TFij = Nij / ∑t Ntj，Nij 为词 ki 在文档 dj 中出现的次数，∑t Ntj 为所有词在文档 dj 中出现的次数和，即 dj 包含的总词数。若词 ki 的 TF 值越高，则说明 ki 越能代表文档 dj
* inverse doucument frequency (逆向文档频率)：设 \|Di\| = {d\|d∈D 且 ki∈d}，\|Di\| 值即表示文档集 D 中有这么多篇文档包含了词 ki；IDFi = log(\|D\| / \|Di\|)，\|D\| 为文档集中的文档个数。若 IDFi 值越大，说明 D 中包含 ki 的文档越少，从而 ki 用来区分 D 中不同文档的能力也就越大。
* wij = TFij * IDFi
* wi = (½ + ½ * TFij) * IDFi