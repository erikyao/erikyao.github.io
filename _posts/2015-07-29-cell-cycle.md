---
layout: post-mathjax
title: "Cell Cycle"
description: ""
category: Biology
tags: [Biology-101]
---
{% include JB/setup %}

[Phases]: https://farm6.staticflickr.com/5754/23292343584_1fbfa3ec11_o_d.png
[Schematic]: https://farm6.staticflickr.com/5748/23894466776_604e7b332e_o_d.png

总结自；

- [Wikipedia - Cell cycle](https://en.wikipedia.org/wiki/Cell_cycle)
- [Wikipedia - 细胞周期](https://zh.wikipedia.org/wiki/%E7%B4%B0%E8%83%9E%E9%80%B1%E6%9C%9F)
- [百度百科 - 细胞周期](http://baike.baidu.com/view/254458.htm)
- [Wikipedia - Mitosis](https://en.wikipedia.org/wiki/Mitosis)
- [Wikipedia - 有丝分裂](https://zh.wikipedia.org/wiki/%E6%9C%89%E7%B5%B2%E5%88%86%E8%A3%82)
- [The Cell: A Molecular Approach. 2nd edition.](http://www.ncbi.nlm.nih.gov/books/NBK9876/)
- [Genetic Home Reference - Handbook](http://ghr.nlm.nih.gov/handbook)

-----

以下这个 Cell Cycle 只针对 somatic cells。somatic cells 都是有丝分裂，而 germ cells 是减数分裂 (Meiosis)，所以不在本文的讨论范围内。

![][Phases]

- **Cell Cycle** (细胞周期)
	- **Interphase** (分裂间期)
		- \\( G\_1 \\) **phase** (Gap 1 | DNA 合成前期)
		- **S phase** (Synthesis | DNA 合成期)
		- \\( G\_2 \\) **phase** (Gap 2 | DNA 合成后期)
	- **Mitosis** (分裂期 | 有丝分裂)
		- **Prophase** (前期)
		- **Prometaphase** (前中期)
		- **Metaphase** (中期)
		- **Anaphase** (后期)
		- **Telophase** (末期)
	- cell cycle 的 4 stages 指 \\( G\_1 \\) => S => \\( G\_2 \\) => Mitosis
- 细胞进入 \\( G\_1 \\) 期可能出现三种情况: 
	- 增殖：细胞能及时从 \\( G\_1 \\) 期进入 S 期，并保持旺盛的分裂能力
		- 如消化道上皮细胞及骨髓细胞
	- 暂不增殖或休止：细胞进入 \\( G\_1 \\) 期后不立即转入 S 期，但在某些刺激下，这些细胞又可以继续增值
		- 如骨髓干细胞和处于不利状态下的癌细胞
		- 这个阶段我们又称为 \\( G\_0 \\) **phase**
	- 永不增殖：细胞进入 \\( G\_1 \\) 期后，失去分裂能力，终身处于 \\( G\_1 \\) 期，直至死亡
		- 如高度分化的神经细胞、肌细胞及成熟的红细胞
- The division of somatic cells and single celled organisms results in the production of two identical **daughter cells**.
- The word "post-mitotic" is sometimes used to refer to both quiescent and senescent cells. 不一定就是指 \\( G\_0 \\)。

->![][Schematic]<-

The cycle has checkpoints (also called restriction points), which allow certain genes to check for mistakes and halt the cycle for repairs if something goes wrong.

If a cell has an error in its DNA that cannot be repaired, it may undergo programmed cell death (apoptosis). Apoptosis is a common process throughout life that helps the body get rid of cells it doesn’t need. Cells that undergo apoptosis break apart and are recycled by a type of white blood cell called a macrophage. Apoptosis protects the body by removing genetically damaged cells that could lead to cancer, and it plays an important role in the development of the embryo and the maintenance of adult tissues.

Cancer results from a disruption of the normal regulation of the cell cycle. When the cycle proceeds without control, cells can divide without order and accumulate genetic defects that can lead to a cancerous tumor.
