---
category: Machine-Learning
description: ''
tags:
- SNAP
- node2vec
title: Quick facts on SNAP / Node2vec cannot handle multi-graphs
---

# 1. Quick Facts On SNAP

## 1.1 SNAP C++ Programming Guide

See [SNAP C++ Programming Guide](https://snap.stanford.edu/snap/doc/snapdev-guide/).

Key takeaway:

> Type names start with a capital letter **"T"** and have a capital letter for each new word, with no underscores: `TUNGraph`.

> By convention, class names in SNAP start with letter "T" and their corresponding smart pointer types have "T" replaced with **"P"**.

E.g.:

```cpp
class TUNGraph;

typedef TPt<TUNGraph> PUNGraph;

PUNGraph Graph = TUNGraph::New();
```

## 1.2 SNAP Graphs vs Networks

See [Quick Introduction to SNAP](https://snap.stanford.edu/snap/quick.html).

> _Graphs_ describe topologies. That is nodes with unique integer ids and directed/undirected/multiple edges between the nodes of the graph.

I.e. graphs do not support weights in edges.

> _Networks_ are graphs with data on nodes and/or edges of the network.

Graph types in SNAP:

* `TUNGraph`: undirected graph (single edge between an unordered pair of nodes)
* `TNGraph`: directed graph (single directed edge between an ordered pair of nodes)
* `TNEGraph`: directed multi-graph (multiple directed edges between a pair of nodes)

Network types in SNAP:

* `TNodeNet<TNodeData>`: like `TNGraph`, but with `TNodeData` object for each node
* `TNodeEDatNet<TNodeData, TEdgeData>`: like `TNGraph`, but with `TNodeData` on each node and `TEdgeData` on each edge
* `TNodeEdgeNet<TNodeData, TEdgeData>`: like `TNEGraph`, but with `TNodeData` on each node and `TEdgeData` on each edge
* `TNEANet`: like `TNEGraph`, but with attributes on nodes and edges. The attributes are dynamic in that they can be defined at runtime
* `TBigNet<TNodeData>`: memory efficient implementation of `TNodeNet` that avoids memory fragmentation and handles billions of edges with sufficient RAM being available

## 1.3 Multi-thread Support

See [graphmp.h](https://snap.stanford.edu/snap/doc/snapuser-ref/d9/deb/graphmp_8h.html), [graphmp.cpp](https://snap.stanford.edu/snap/doc/snapuser-ref/d7/dd2/graphmp_8cpp.html), [networkmp.h](https://snap.stanford.edu/snap/doc/snapuser-ref/dc/d36/networkmp_8h.html) and [networkmp.cpp](https://snap.stanford.edu/snap/doc/snapuser-ref/dd/d0a/networkmp_8cpp.html).

Obviously, types supporting multi-threading have names ending with **"MP"**.

Search the following key pieces of code if interested in implementation: `#ifdef GCC_ATOMIC`, `#ifdef USE_OPENMP` and `#include <omp.h>`. (**OpenMP** library is the backbone of multi-threading.)

P.S. Our research doesn't need multi-threading at SNAP level--we can enable it at higher Grid Search phase (probably in python).

# 2. Node2vec Cannot Handle Multi-graphs

## 2.1 What Graph Does The Node2vec Reference Implementation Use?

Disclaimer: I am using Release 4.1, Jul 25, 2018.

`snap/examples/node2vec/node2vec.cpp` uses `PWNet`, which is defined in [biasedrandomwalk.h](https://snap.stanford.edu/snap/doc/snapdev-ref/d5/dc0/biasedrandomwalk_8h.html):

```cpp
typedef TNodeEDatNet<TIntIntVFltVPrH, TFlt> TWNet;
typedef TPt<TWNet> PWNet;
```

Therefore essentially it's a `TNodeEDatNet` and **not a multi-graph**.

If you insisted passing two $v \rightarrow w$ edges with different weights to a `TNodeEDatNet`, it will only keep one such edge and update the weight to the latest input.

[Source code](https://snap.stanford.edu/snap/doc/snapdev-ref/de/d62/classTNodeEDatNet.html#adc9fbdd2464d6077123ba3ff6ccf01e9):

```cpp
template <class TNodeData, class TEdgeData>
int TNodeEDatNet<TNodeData, TEdgeData>::AddEdge(const int& SrcNId, const int& DstNId, const TEdgeData& EdgeDat) {
    IAssertR(IsNode(SrcNId) && IsNode(DstNId), TStr::Fmt("%d or %d not a node.", SrcNId, DstNId).CStr());
    //IAssert(! IsEdge(SrcNId, DstNId));
    if (IsEdge(SrcNId, DstNId)) {
        GetEDat(SrcNId, DstNId) = EdgeDat;
        return -2;
    }
    GetNode(SrcNId).OutNIdV.AddSorted(TPair<TInt, TEdgeData>(DstNId, EdgeDat));
    GetNode(DstNId).InNIdV.AddSorted(SrcNId);
    return -1; // no edge id
}
```

## 2.2. You Just Cannot Use Multi-graphs In Node2vec

From [n2v.h](https://snap.stanford.edu/snap/doc/snapdev-ref/d6/d2e/n2v_8h.html) we can find a `node2vec` function taking a `PNEANet` as input. A `TNEANet` can be a multi-graph but node2vec will eventually transform it into a simple-graph. 

[Source code](https://snap.stanford.edu/snap/doc/snapdev-ref/d0/dcd/n2v_8cpp_source.html#l00081):

```cpp
void node2vec(const PNEANet& InNet, const double& ParamP, const double& ParamQ,
    const int& Dimensions, const int& WalkLen, const int& NumWalks,
    const int& WinSize, const int& Iter, const bool& Verbose,
    const bool& OutputWalks, TVVec<TInt, int64>& WalksVV,
    TIntFltVH& EmbeddingsHV) {
    PWNet NewNet = PWNet::New();
    for (TNEANet::TEdgeI EI = InNet->BegEI(); EI < InNet->EndEI(); EI++) {
        if (!NewNet->IsNode(EI.GetSrcNId())) { NewNet->AddNode(EI.GetSrcNId()); }
        if (!NewNet->IsNode(EI.GetDstNId())) { NewNet->AddNode(EI.GetDstNId()); }
        NewNet->AddEdge(EI.GetSrcNId(), EI.GetDstNId(), InNet->GetFltAttrDatE(EI,"weight"));
    }
    node2vec(NewNet, ParamP, ParamQ, Dimensions, WalkLen, NumWalks, WinSize, Iter, 
        Verbose, OutputWalks, WalksVV, EmbeddingsHV);
}
```