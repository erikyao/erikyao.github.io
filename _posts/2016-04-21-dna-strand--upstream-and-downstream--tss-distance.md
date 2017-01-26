---
layout: post
title: "DNA Strand / Upstream and Downstream / TSS Distance"
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
    - UCSC Genome Browser: 0-based
    - HGMD: 1-based
    - Ensembl: 1-based
    - $chromStart_{0} = chromStart_{1} - 1$
    - $chromEnd_{0} = chromEnd_{1}$
- `chromStart` and `chromEnd` are columns from table `snp142` of database `hg19` in UCSC Genome Browser
- `txStart` and `txEnd` are columns from table `ensGene` of database `hg19` in UCSC Genome Browser

Summary:

- __*TSS*__ = Transcription Start Site
- "TSS distance" actually means "distance to TSS".
- Upstream is towards $5'$;
    - downstream is towards $3'$.
- This designation of $+$/$-$ strand is arbitrary.
- Once fixed, the $+$ strand determines the direction of coordinate axis;
    - the $-$ strand goes reversely.
- A gene can be on the $+$ strand or $-$ strand.
    - The strand that the gene, say $g$, is on is called $g$'s __*coding strand*__ (a.k.a. its __*sense strand*__).
    - The other strand is called $g$'s __*template strand*__ (a.k.a. its __*antisense strand*__)
- $g.txStart < g.txEnd$ always holds.
- For genes on $+$ strand, $\operatorname{TSS}(g) = g.txStart$;
    - for genes on $-$ strand, $\operatorname{TSS}(g) = g.txEnd$.
- For genes on $+$ strand, $\operatorname{TSS-dist}(s,g) = s.chromStart - g.txStart$;
    - for genes on $-$ strand, $\operatorname{TSS-dist}(s,g) = g.txEnd - s.chromStart$.
- In other words:
    - Suppose $\operatorname{strand}(g) =\begin{cases}1 & g \text{ is on "+" strand} \newline -1 & \text{otherwise} \end{cases}$.
    - Suppose $\operatorname{TSS}(g) =\begin{cases}g.txStart & g \text{ is on "+" strand} \newline g.txEnd & \text{otherwise} \end{cases}$.
    - $\Rightarrow \operatorname{TSS-dist}(s,g) = (s.chromStart - \operatorname{TSS}(g)) \times \operatorname{strand}(g)$
- If $s$ is in the upstream of $g$, $\operatorname{TSS-dist}(s,g) < 0$, whichever strand $g$ is on;
    - if $s$ is in the downstream of $g$, $\operatorname{TSS-dist}(s,g) > 0$
