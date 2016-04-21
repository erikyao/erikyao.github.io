---
layout: post-mathjax
title: "DNA Strand: Positive / Negative / Upstream / Downstream"
description: ""
category: Biology
tags: [Biology-101]
---
{% include JB/setup %}

[upstream-downstream-TSS]: https://farm2.staticflickr.com/1569/26527566606_8d3e8d559b_o_d.png

References:

- [Question: Forward And Reverse Strand Conventions](https://www.biostars.org/p/3423/)
- [Upstream and downstream (DNA)](https://en.wikipedia.org/wiki/Upstream_and_downstream_(DNA))

![][upstream-downstream-TSS]

For the diagram:

- 0-based coordinate system is used (same as UCSC Genome Browser)
    - [Tutorial: Cheat Sheet For One-Based Vs Zero-Based Coordinate Systems](https://www.biostars.org/p/84686/)
- `chromStart` and `chromEnd` are columns from table `snp142` of database `hg19` in UCSC Genome Browser
- `txStart` and `txEnd` are columns from table `ensGene` of database `hg19` in UCSC Genome Browser

Rules of Thumb:

- __*TSS*__ = __*T*__ranscription __*S*__tart __*S*__ite
- "TSS distance" are actually "distance to TSS".
- Upstream is to 5';
    - downstream is to 3'.
- The direction of coordinate axis is fixed.
- The "+" strand goes along coordinate axis;
    - the "-" strand goes reversely.
- $g.txStart < g.txEnd$ always holds.
- For genes on "+" strand, $TSS = txStart$;
    - for genes on "-" strand, $TSS = txEnd$.
- For genes on "+" strand, $TSS-dist = chromStart - txStart$;
    - for genes on "-" strand, $TSS-dist = txEnd - chromStart$.
- In other words, suppose $\operatorname{strand}(g) =\begin{cases}1 & g \text{ is on "+" strand} \newline -1 & otherwise\end{cases}$ and $\operatorname{TSS}(g) =\begin{cases}g.txStart & g \text{ is on "+" strand} \newline g.txEnd & otherwise\end{cases}$, and we can conclude $\operatorname{TSS-dist}(s,g) = (s.chromStart - \operatorname{TSS}(g)) \times \operatorname{strand}(g)$.
- If $s$ is in the upsteam of $g$, $\operatorname{TSS-dist}(s,g) < 0$, no matter which strand $g$ is on;
    - if $s$ is in the downsteam of $g$, $\operatorname{TSS-dist}(s,g) > 0$
