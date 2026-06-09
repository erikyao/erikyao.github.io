---
category: Biology
description: ''
tags: []
title: Proliferation / Differentiation / Cell Cycle
---

[Phases]: /assets/posts/2015-07-29-cell-cycle/Phases.jpg
[Schematic]: /assets/posts/2015-07-29-cell-cycle/Schematic.jpg

总结自；

- [Wikipedia - Cell cycle](https://en.wikipedia.org/wiki/Cell_cycle)
- [Wikipedia - 细胞周期](https://zh.wikipedia.org/wiki/%E7%B4%B0%E8%83%9E%E9%80%B1%E6%9C%9F)
- [百度百科 - 细胞周期](http://baike.baidu.com/view/254458.htm)
- [Wikipedia - Mitosis](https://en.wikipedia.org/wiki/Mitosis)
- [Wikipedia - 有丝分裂](https://zh.wikipedia.org/wiki/%E6%9C%89%E7%B5%B2%E5%88%86%E8%A3%82)
- [The Cell: A Molecular Approach. 2nd edition.](http://www.ncbi.nlm.nih.gov/books/NBK9876/)
- [Genetic Home Reference - Handbook](http://ghr.nlm.nih.gov/handbook)

-----

# Proliferation (增殖) 与 Cell Cycle 的关系

cell cycle 是增殖的 mechanism，或者说；细胞增殖 $\iff$ cell is running cell cycle repeatedly ($G_1 \Rightarrow S \Rightarrow G_2 \Rightarrow M$).

# Differentiation (分化) 与 Cell Cycle 的关系

对分化，我们要区分 "分化的 mechanism" 和 "分化的 process". 

这里我们先讨论 "分化的 process". 我们考虑一个简单的情况：假设我们从 cell type $T_1$ 一路分化到了 $T_n$。那么这整个分化的过程就可以视为一个 chain $T_1 \rightarrow T_2 \rightarrow \cdots \rightarrow T_n$. 扩展一下有：

- 如果我们考虑从受精卵 (zygote, 唯一真正的 totipotent cell, 即全能 stem cell) 到所有人体的 cell types，这整个分化过程应该是一个类似 tree 的 graph
  - root 是 zygote $Z$
  - 每个 leaf 都是 terminally differentiated cell type $T \in \mathbf{T}_{\text{TD}}$
    - 所谓 terminally differentiated 就是指无法再分化的 cell
- 但如果我们只想研究某单个 $c_k$ 的分化路径 (也不一定要从 zygote 开始)，那么这个局部的 path $c_i \rightarrow \dots \rightarrow c_k$ 我们也称为一个 (局部的) 分化过程
- reversible differentiation 即是允许在 differentiation 的 graph 或者 path 中存在 cycle
- termimal differentiation 即是 destination 为 $T \in \mathbf{T}_{\text{TD}}$ 的 differentiation

"分化的 process" 与 cell cycle 不是一个抽象层次的东西，所以我们不会放到一起讨论。

"分化的 mechanism" 与 cell cycle 的 phases 有关系，但严格来说，"分化的 mechanism" 与 cell cycle 整体并没有关系，因为分化是 cell 退出 cell cycle 之后进行的。

与 "分化的 mechanism" 密切相关的是 $G_1$，它其实是一个决策点，cell 在此时会根据各种条件选择：

1. 不分化 (维持当前 cell type $T_i$)，只增殖 (进入 $S$)
2. 不分化，不增殖 (退出 cell cycle，进入 $G_0$)
   - 某些细胞也可能从 $G_0$ 启动分化
3. 只分化 (沿 edge $T_i \rightarrow T_j$ 进行)，不增殖 (一般情况下，分化进行的时候无法增殖)
   - 注意 cell 在 $G_1$ 会决断这是不是一个 termimal differentiation，导致 "分化的 mechanism" 略有不同 (主要体现在 chromatin locking)

# Overview of Cell Cycle

以下这个 Cell Cycle 只针对 somatic cells. somatic cells 都是有丝分裂 (Mitosis)，而 germ cells 是减数分裂 (Meiosis)，不在本文的讨论范围内。

![][Schematic]

![][Phases]

**Cell Cycle** (细胞周期)

- **Interphase** (分裂间期)
  - $G_1$ **phase** (Gap 1 \| DNA 合成前期)
  - $S$ **phase** (Synthesis \| DNA 合成期)
  - $G_2$ **phase** (Gap 2 \| DNA 合成后期)
- **Mitosis** $M$ (分裂期 \| 有丝分裂)
  - **Prophase** (前期)
  - **Prometaphase** (前中期)
  - **Metaphase** (中期)
  - **Anaphase** (后期)
  - **Telophase** (末期)
  
一个完整的 cell cycle 指 $G_1 \Rightarrow S \Rightarrow G_2 \Rightarrow M$ 这 4 stages.

> [!info]
> 
> The word _post-mitotic_ is sometimes used to refer to both quiescent and senescent cells. 不一定就是指 $G_0$。

# $G_1$ phase

$G_1$ is defined as the phase from the end of previous $M$ until the beginning of $S$.

> In this phase, the cell increases its supply of proteins, increases the number of organelles (such as mitochondria, ribosomes), and grows in size.

# $S$ phase

会进行如下工作：

1. chromosome 开始复制
2. 复制完成后，两条新生的 chromatids 通过 centromere 连接在一起，此时称为 sister chromatids

因为 every chromatid has a short **p-arm** ("p" for "petit") and a long **q-arm** ("q" for "queue")，所以这时染色体在显微镜下看起来像 "X" 形:

```txt
*****
*   *
* p * 
* | *
* | *
* | *  <= chr18^p before S phase
* | * 
* | *
* q * 
*   *
*****
```

```txt
******************
*                *
* p       p_copy *
* \       /      *
*  ==[x]==       *
* /       \      *  <= chr18^p after S phase
* |       |      *
* |       |      *
* q       q_copy *
*                *
******************
```

# $G_2$ phase

> $G_2$ phase occurs after DNA replication and is a period of protein synthesis and rapid cell growth to prepare the cell for mitosis. During this phase microtubules begin to reorganize to form a spindle (preprophase). Before proceeding to $M$, cells must be checked at the $G_2$ checkpoint for any DNA damage within the chromosomes. The $G_2$ checkpoint is mainly regulated by the tumor protein `p53`. If the DNA is damaged, `p53` will either repair the DNA or trigger the apoptosis of the cell. If `p53` is dysfunctional or mutated, cells with damaged DNA may continue through the cell cycle, leading to the development of cancer.

> [!info] apoptosis
>
> apoptosis 指细胞 breaks apart and gets recycled by the white blood cell "macrophage" 的过程

> [!info] cancer
> 
> Cancer results from a disruption of the normal regulation of the cell cycle. When the cycle proceeds without control, cells can divide without order and accumulate genetic defects that can lead to a cancerous tumor.

# $M$ in general

1. 所有的 X-shaped chromosomes 排列在细胞中央的赤道板上
2. 纺锤体 (spindle) 伸出纺锤丝，attach 到 centromere
3. centromere 分裂，sister chromatids 被纺锤丝拉向细胞两极
4. 生成新的细胞膜、细胞质一分为二，形成两个细胞

The division of somatic cells and single celled organisms results in the production of two identical **daughter cells**.








