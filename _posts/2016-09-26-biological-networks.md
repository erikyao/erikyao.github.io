---
layout: post
title: "Biological Networks"
description: ""
category: Biology
tags: [Biology-101]
---
{% include JB/setup %}

## 1. Biochemical Networks

Biochemical networks represent the molecular-level patterns of interactions and mechanisms of control in the biological cell. The principle types of biochemical networks are 

- Metabolic networks: usually directed bipartite networks, `(substrate)` => `[reaction]` => `(product)`; tripartite if `{enzyme}` is undirectedly connected to `[reaction]`.
    - Pathway: a set of successive chemical reactions that convert initial input into useful end product by a series of steps.
    - Metabolite: [məˈtabəˌlīt], a chemical produced or consumed in metabolism; usually a small molecule and does not include proteins
        - Substrate (底物): a chemical that is consumed
        - Product: a chemical that is produced
    - Radioisotope: radioactive isotope, [ˈaɪsəˌtoʊp], 同位素; usually injected with a substrate to a cell to probe the pathways
- PPI: protein-protein interaction networks; PPI can be physical (protein-complexes), `(protein)` <> `(protein)`.
    - Immunoprecipitation (IP): involves attaching an antibody to a solid surface, such as the surface of a glass bead (玻璃珠), then passing a solution containing the target protein (as well as others, in most cases) over the surface. The antibody and the target protein bind together and the rest of the solution is then washed away, leaving the target protein to be recovered from the surface. A good way to probe PPI.
    - Yeast Two-hybrid Screen (Y2HS): a high-throughput method to probe PPI.
        - Y2HS relies on a special protein known as a _transcription factor_, which, if present in a cell, turns on the production of another protein, referred to as a _reporter_.
        - Transcription factors are typically composed of two distinct parts, a so-called _binding domain_ and an _activation domain_.
        - A yeast cell is persuaded, by introducing plasmids into the cell, to produce two proteins of interest, each with one of the domains of the transcription factor attached to it.
            - These two proteins of interest are called _bait_ and _prey_.
            - One can apply a large _library_ of prey and hence test for PPI with many proteins in a single experiment. 
        - If the two proteins of interest interact and form a complex, the transcription factor will be produced and activate the production of the reporter.
    - Affinity Purification: similar to immunoprecipitation, more accurate, high-throughput.
- GRN: genetic regulatory networks, `(protein-A)` or `(gene coding protein-A)` => `[expression-of-B]`
    - Transcription factors regulate transcription by binding to a recognized sub-sequence in the DNA, called a _promoter region_, which is adjacent to the beginning of the gene.
    - 待续

## 2. Mathematics of Networks

### 2.1 Network Representation

- _vertices_ vs _edges_, in mathematics
- _nodes_ vs _links_, in computer science
- _sites_ vs _bonds_, in physics
- _actors_ vs _ties_, in sociology

$\vert V \vert = n, \vert E \vert = m$.

In simple networks, _simple_ means "no loop (an edge from a vertex to itself)" and "no parallel edges (multiple edges with the same endpoints)"

### 2.2 Adjacency Matrix

Parallel edges between $(i,j)$ are represented by setting $A_{ij} = A_{ji} = p$ where $p$ is the multiplicity of these edges. (你有两条并行就设置为 2，三条并行就设置为 3，etc.)

An $(i,i)$ loop is represented by setting $A_{ii} = 2$, rather than $1$. (正向算一次，反向再算一次)

### 2.3 Weighted Networks

如果要用 $A_{ij}$ 来表示 weight 的话，那我们只能是 simple network，否则例如 $A_{ij} = 2$ 的表述会有歧义。（但其实如果 weight 都是整数的话，parallel edges 的条数也可以用来表示 weight）

### 2.4 Directed Networks

_Digraph_ for short. $A$ is no longer guaranteed to be symmetric.

#### 2.4.1 Cocitation and Bibliographic coupling

待续

#### 2.4.2 Directed Acyclic Networks

待续

### 2.5 Trees

If all the parts of network are trees, the complete network is called a _forest_.

There is exactly one path between any pair of vertices in a tree.

A tree with $n$ vertices always has $n-1$ edges. Any connected newwork with $n$ vertices and $n-1$ edges is a tree.