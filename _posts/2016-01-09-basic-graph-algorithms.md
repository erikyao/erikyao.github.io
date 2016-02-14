---
layout: post-mathjax
title: "Basic Graph Algorithms"
description: ""
category: Algorithm
tags: [Algorithm-101]
---
{% include JB/setup %}

[edge_types]: https://farm2.staticflickr.com/1521/24260605262_83a3b5a6b7_o_d.png
[Prim]: https://farm2.staticflickr.com/1676/24313784510_251a0a69f3_o_d.png
[Kruskal]: https://farm2.staticflickr.com/1549/24314202720_46d5257df4_o_d.png
[Alternating_Path]: https://farm2.staticflickr.com/1698/24582419389_f2308538e0_o_d.png

参考：

- [Lecture 18: Basic Graph Algorithms](http://jeffe.cs.illinois.edu/teaching/algorithms/notes/19-dfs.pdf)
- [Lecture 19: Depth-First Search](http://jeffe.cs.illinois.edu/teaching/algorithms/notes/19-dfs.pdf)
- [Wikipedia: Glossary of graph theory](https://en.wikipedia.org/wiki/Glossary_of_graph_theory)
- [CS 137 - Graph Theory - Lecture 2](http://www.cs.toronto.edu/~stacho/cs137/cs137-lec2.pdf)
- [COMPSCI 330: Design and Analysis of Algorithms - Lecture #5](https://www.cs.duke.edu/courses/fall14/cps130/notes/scribe5.pdf)
- [DFS Edge Classification](http://courses.csail.mit.edu/6.006/spring11/rec/rec13.pdf)
- [Lecture 8: DFS and Topological Sort](http://home.cse.ust.hk/faculty/golin/COMP271Sp03/Notes/MyL08.pdf)
- [Lecture 21: Shortest Paths](http://jeffe.cs.illinois.edu/teaching/algorithms/notes/21-sssp.pdf)
- [Lecture 20: Minimum Spanning Trees](http://jeffe.cs.illinois.edu/teaching/algorithms/notes/20-mst.pdf)
- [Math 575 - Problem Set 9](http://people.math.sc.edu/sumner/math575spring2009/problemsets/Math575ProblemSet9.pdf)

-----

ToC:

- [1. Definition](#1-definition)
- [2. Traversing Connected Graphs](#2-traversing-connected-graphs)
- [3. More on DFS](#3-more-on-dfs)
- [4. Preorder and Postorder Labeling](#4-preorder-and-postorder-labeling)
- [5. Acyclicity in Directed Graphs](#5-acyclicity-in-directed-graphs)
- [6. Topological Sort](#6-topological-sort)
- [7. Strongly Connected Components (SCC)](#7-scc)
- [8. Shortest Paths / Single Source Shortest Paths (SSSP)](#8-shortest-paths)
	- [8.1 The Only SSSP Algorithm](#8-1-the-only-sssp-alg)
	- [8.2 Dijkstra’s Algorithm](#8-2-dijkstra-alg)
	- [8.3 Shimbel’s Algorithm](#8-3-shimbel-alg)
- [9. All-Pairs Shortest Paths (APSP)](#9-all-pairs-shortest-paths)
- [10. Minimum Spanning Trees (MST)](#10-minimum-spanning-trees)
	- [10.1 The Only MST Algorithm](#10-1-the-only-mst-alg)
	- [10.2 Borvka’s Algorithm](#10-2-borvka-alg)
	- [10.3 Prim's Algorithm](#10-3-prim-alg)
	- [10.4 Kruskal’s Algorithm](#10-4-kruskal-alg)
- [11. Matroids](#11-matroids)
- [12. Matching](#12-matching)

-----

## <a name="1-definition"></a>1. Definition

_**Simple Graph:**_

- Graphs without loops and parallel edges are often called simple graphs; 
	- loop: an edge from a vertex to itself
	- parallel edges: multiple edges with the same endpoints 
		- 注意 endpoint 表示的是**端点**，可以是起点也可以是终点，并不一定是终点 (ending point)
		- parallel edges 简单说就是你有两条 `{u, v}` 或 `u → v`
- non-simple graphs are sometimes called multigraphs. 
- Despite the formal definitional gap, most algorithms for simple graphs extend to non-simple graphs with little or no modification.

The definition of a graph as a pair of sets, \\( (V, E) \\) forbids graphs with loops and/or parallel edges. 也就是说，用 \\( (V, E) \\) 表示的图都**默认**是 simple graph。

We also use \\( V \\) to denote the number of vertices in a graph, and \\( E \\) to denote the number of edges. Thus, in any undirected graph we have \\( 0 \le E \le {V \choose 2} \\) and in any directed graph we have \\( 0 \le E \le V(V − 1) \\).

_**Neighbor**_ and _**Degree**_:

- For an undirected graph: 
	- If there is an edge `{u, v}`, then `u` and `v` are neighbors mutually.
	- `degree(u)` == # of `u`'s neighbors
- For a directed graph:
	- If there is an edge `u → v`, then 
		- `u` is a _**predecessor**_ of `v`, and (注意 predecessor 这个词并没有对应的动词)
		- `v` is a _**successor**_ of `u`.
	- `in-degree(u)` == # of `u`'s predecessors
	- `out-degree(u)` == # of `u`'s successors

_**Subgraph:**_

- A graph \\( G' = (V', E') \\) is a subgraph of \\( G = (V, E) \\) if \\( V' \subseteq V \\) and \\( E' \subseteq E \\).

_**Walk**_, _**Path**_, _**Cycle**_ and _**Connectivity**_:

- A walk is a sequence of vertices, \\( v\_1, v\_2, \dots, v\_k \\), s.t. \\( \forall 1 \le i \le k \\), \\( \left \\{ v\_i, v\_{i+1} \right \\} \in E \\).
	- \\( v\_1 \\) and \\( v\_k \\) are the _**endpoints**_ of the walk; while
	- \\( v\_2, v\_3, \dots, v\_{k-1} \\) are _**internal vertices**_.
- A walk is _**closed**_ if \\( v\_k == v\_1 \\), and _**open**_ if \\( v\_k \neq v\_1 \\).
- The length of a walk is the number of edges, thus \\( k-1 \\).
- _**Note:**_ a walk can consist of only a single node, with length 0.

<!-- -->

- A path is a walk that does not repeat vertices.
	- So by definition, a path must be an open walk.
- A cycle is a closed walk that does not repeat vertices except the endpoints.
	- A cycle has at least 1 edge; it is not allowed to have a length of 0.
- Cycles of \\( n \\) vertices are often denoted by \\( C\_n \\). (你把 \\( C\_n \\) 的 \\( n \\) 理解为有 \\( n \\) 条 edge 或是 length 为 \\( n \\) 也是可以的) Thus,
	- \\( C\_1 \\) is a loop, 
	- \\( C\_2 \\) is a digon (a pair of parallel undirected edges in a multigraph, or a pair of antiparallel edges in a directed graph), and 
	- \\( C\_3 \\) is a triangle.
	
<!-- -->

- A graph \\( G \\) is _**connected**_ if \\( \forall \\) 2 verices of \\( G \\), \\( \exists \\) a path between them. (其实你定义为 \\( \exists \\) a walk 也是可以的，因为 \\( \forall \\) 2 verices 一定是不同的两点，所以 walk 会升级为 path，不影响大局)
- Otherwise, \\( G \\) is disconnected and it decomposes into connected _**components**_.
	- \\( G \\)'s components are its maximal connected subgraphs.
		- By "maximal", it means you cannot add any element to \\( (V', E') \\) of the subgraph \\( G' \\) while keeping it connected.
	- So the term "connected components" is actually redundant; components are connected by definition.
	- Two vertices are in the same component \\( \iff \\) there is a path between them.
- A directed graph is _**strongly connected**_ if \\( \forall \\) 2 verices of \\( G \\), \\( \exists \\) a directed path between them.
	- Practically, the definition of component is only suitable for undirected graphs.

<!-- -->

- An undirected graph is _**acyclic**_ if it contains no cycles, i.e. no subgraph is a cycle.
	- Undirected acyclic graphs are also called _**forests**_.
		- 注意 forest 不一定就是 disconnected 的，有可能 disconnected 有可能 connected
	- A _**tree**_ is a undirected, connected acyclic graph, or equivalently, one component of a forest. 
	- A _**spanning tree**_ of a graph \\( G \\) is a subgraph that is a tree and contains every vertex of \\( G \\). 
		- A graph has a spanning tree \\( \iff \\) it is connected. 
	- A _**spanning forest**_ of \\( G \\) is a collection of spanning trees, one for each a connected component of \\( G \\).
- A directed graph is _**acyclic**_ if it does not contain a directed cycle. 
	- Directed acyclic graphs are often called _**DAG**_s.
	
<!-- -->
	
Any vertex in a DAG that has no incoming vertices is called a _**source**_; any vertex with no outgoing edges is called a _**sink**_. Every DAG has at least one source and one sink, but may have more than one of each. For example, in the graph with `n` vertices but no edges, every vertex is a source and every vertex is a sink.
	
## <a name="2-traversing-connected-graphs"></a>2. Traversing Connected Graphs

To keep things simple, we'll consider only undirected graphs here, although the algorithms also work for directed graphs with minimal changes.

The simplest graph-traversal algorithm is _**DFS**_, depth-first search. This algorithm can be written either recursively or iteratively. It’s exactly the same algorithm either way; the only difference is that we can actually see the “recursion” stack in the non-recursive version.

<pre class="prettyprint linenums">
// v: a source vertex
RecursiveDFS(v):
	if v is unmarked
		mark v
		for each edge vw
			RecursiveDFS(w)
</pre>

<pre class="prettyprint linenums">
// s: a source vertex
IterativeDFS(s):
	PUSH(s)
	while the stack is not empty
		v &lt;- POP
		if v is unmarked
			mark v
			for each edge vw
				PUSH(w)
</pre>

_**N.B.**_ `IterativeDFS` 最后一个 `for` 可以稍微改良一下：

<pre class="prettyprint linenums">
// s: a source vertex
IterativeDFS(s):
	PUSH(s)
	while the stack is not empty
		v &lt;- POP
		if v is unmarked
			mark v
			for each edge vw
				if w is not visited
					PUSH(w)
</pre>

The generic graph traversal algorithm stores a set of candidate edges in some data structure that I’ll call a "bag". The only important properties of a bag are that we can put stuff into it and then later take stuff back out. A stack is a particular type of bag, but certainly not the only one.

_**N.B.**_ If you replace the stack above with a queue, you will get _**BFS**_, breadth-first search. And the breadth-first spanning tree formed by the parent edges contains shortest paths from the start vertex `s` to every other vertex in its connected component.

另外一个需要注意的是，还有一种改良方法是：stack 存储 `(v, parent(v))`。这么做并不是为了提升效率，而是为了方便遍历后迅速定位 path。

<pre class="prettyprint linenums">
// s: a source vertex
Traverse(s):
	put (Φ,s) in bag // source vertex 的 parent 是空集
	while the bag is not empty
		take (p,v) from the bag
		if v is unmarked
			mark v
			parent(v) &lt;- p
			for each edge vw
				put (v,w) into the bag
</pre>

For any node `v`, the path of parent edges `(v, parent(v), parent(parent(v)), . . .)` eventually leads back to `s`.

题外话：If \\( G \\) is not connected, then `Traverse(s)` only visits the nodes in the connected component of the start vertex `s`. If we want to visit all the nodes in every component, run `Traverse` on every node. (Let's call it `TraverseAll`.) Since `Traverse` computes a spanning tree of one component, `TraverseAll` computes a spanning forest of \\( G \\).

## <a name="3-more-on-dfs"></a>3. More on DFS

首先补充两个概念。Graph 里我们说 predecessor 和 successor，Tree 里面我们用 ancestor 和 descendant；不仅如此，我们还有 proper ancestor 和 proper descendant:

Suppose \\( T \\) is a rooted tree with root `r`; `a` and `b` are 2 nodes of \\( T \\).

- `a` is an _**ancestor**_ of `b` if `a` is in the path `b → r`.
	- `b` could be the ancestor of `b` itself.
	- `a` is a _**proper ancestor**_ of `b` if `a` is an ancestor of `b` and `a` is not `b` itself.
- `b` is an _**descendant**_ of `a` if `a` is in the path `b → r`.
	- `a` could be the descendant of `a` itself.
	- `b` is a _**proper descendant**_ of `a` if `b` is an descendant of `a` and `b` is not `a` itself.

Suppose \\( G \\) is a connected undirected graph, \\( T \\) is a depth-first spanning tree computed by calling `DFS(s)`.

_**Lemma 1.**_ For any node `v`, the vertices that are marked during the execution of `DFS(v)` are the proper descendants of `v` in \\( T \\).

_**Lemma 2.**_ For every edge `vw` in \\( G \\), either `v` is an ancestor of `w` in \\( T \\), or `v` is a descendant of `w` in \\( T \\).

_**Proof:**_ Assume without loss of generality that `v` is marked before `w`. Then `w` is unmarked when `DFS(v)` is invoked, but marked when `DFS(v)` returns, so the previous lemma implies that `w` is a proper descendant of `v` in \\( T \\).

## <a name="4-preorder-and-postorder-labeling"></a>4. Preorder and Postorder Labeling

<pre class="prettyprint linenums">
PrePostLabel(G):
	for all vertices v
		unmark v
	
	clock &lt;- 0
	
	for all vertices v
		if v is unmarked
			clock &lt;- LabelComponent(v, clock)
			
LabelComponent(v, clock):
	mark v
	
	prev(v) &lt;- clock
	clock &lt;- clock + 1
	
	for each edge vw
		if w is unmarked
			clock &lt;- LabelComponent(w, clock)
	
	post(v) &lt;- clock
	clock &lt;- clock + 1
	
	return clock
</pre>

举个例子，假设有个 triangle `abc`，按 `a → b → c` 执行的情况应该是这样的：

<pre class="prettyprint linenums">
mark a √
prev(a) = 0;
	mark b √
	prev(b) = 1;
		mark c √
		prev(c) = 2;
		post(c) = 3;
	post(b) = 4;
post(a) = 5;

return 6;
</pre>

|      | a | b | c |
|------|---|---|---|
| prev | 0 | 1 | 2 |
| post | 5 | 4 | 3 |

_**N.B.**_ 其实这里我觉得把 `prev(a)` 看做 "start time of accessing a" 或者 "time before accessing a"、把 `post(a)` 看做 "finish time of accessing a" 或者 "time after accessing a" 更好理解一点。

Consider `a` and `b`, where `b` is marked after `a`. Then we must have `prev(a) < prev(b)`. Moreover, _**Lemma 1**_ implies that if `b` is a descendant of `a`, then `post(a) > post(b)`, and otherwise ("otherwise" 并不是是指 "`b` is an ancestor of `a`"，而是指 "`b` is not a descendant of `a`"，再结合 "`b` is marked after `a`" 这个事实，只有一种可能是 "`a` 和 `b` 属于不同的 components"), `prev(b) > post(a)` (此时 `a` component 遍历完了才轮到 `b`，`prev(b)` 的赋值必定在 `post(a)` 之后)。

Thus, for any two vertices `a` and `b`, the intervals `[prev(a), post(a)]` and `[prev(b), post(b)]` are either disjoint or nested; in particular, if `ab` is an edge, _**Lemma 2**_ implies that the intervals must be nested.

## <a name="5-acyclicity-in-directed-graphs"></a>5. Acyclicity in Directed Graphs

Lemma 2 implies that any depth-first spanning tree \\( T \\) divides the edges of \\( G \\) into two classes: _**tree edges**_, which appear in \\( T \\), and _**back(ward) edges**_, which connect some node in \\( T \\) to one of its ancestors.

其实这里可以进一步细分。考虑到 \\( T \subseteq G \\) (\\( T \\) 是 \\( G \\) 的 subgraph)，这样至少有两个部分：\\( T \\) 和 \\( G \backslash T \\)。

We call an edge `a → b` in \\( G \\) (注意范围，是 \\( G \\) 中的 edge，并不限定在 \\( T \\) 中)

- a _**tree edge**_ if `a → b` is an edge in \\( T \\)
	- 意思即是 \\( T \\) 中所有的 edge 都叫 \\( G \\) 的 tree edge
- if `a → b` is an edge in \\( G \backslash T \\)):
	- a _**forward edge**_ if `a` is an ancestor of `b` in \\( T \\)
		- 注意 ancestor 是在 \\( T \\) 中判断的，所以简单说就是在 \\( G \backslash T \\) 是 `a → b` 且在 \\( T \\) 中有 `a → ... → b`
	- a _**back(ward) edge**_ if `a` is an descendant of `b` in \\( T \\)
		- 注意 descendant 是在 \\( T \\) 中判断的，所以简单说就是在 \\( G \backslash T \\) 是 `a → b` 但在 \\( T \\) 中是 `b → ... → a`
		- 这样就发现了一个 cycle
	- a _**cross edge**_ otherwise
		- 简单说就是在 \\( G \backslash T \\) 是 `a → b` 但在 \\( T \\) 中 `a` 既不是 `b` 的 ancestor 也不是 descendant
		
我觉得还是举个例子说明下比较好：

![][edge_types]

- 右图的实线是 \\( T \\)，所以实线的 edge 都是 tree edge
- 存在 `s → c` 属于 \\( G \\) 但不属于 \\( T \\)，且在 \\( T \\) 中 `s` 是 `c` 的 ancestor，所以 `s → c` 是 forward edge
- 存在 `b → s` 属于 \\( G \\) 但不属于 \\( T \\)，且在 \\( T \\) 中 `b` 是 `s` 的 descendant，所以 `b → s` 是 backward edge
- 存在 `d → c` 属于 \\( G \\) 但不属于 \\( T \\)，且在 \\( T \\) 中 `d` 既不是 `c` 的 ancestor 也不是 descendant，所以 `d → c` 是 cross edge

| edge type of `a → b` in \\( G \\) | relationship of `a` and `b` in \\( T \\)         | prev / post order                                      |
|-----------------------------------|--------------------------------------------------|---------------------------------------------------------|
| tree / forward                    | `a` is an ancestor of `b`                        | prev(a) < prev(b) < post(b) < post(a)                   |
| back(ward)                        | `a` is an descendant of `b`                      | prev(b) < prev(a) < post(a) < post(b)                   |
| cross                             | `a` is neither an ancestor nor descendant of `b` | prev(a) < post(a) < prev(b) < post(b), 假设 `a` 先访问到 |

_**obs:**_ There is a backward edge in \\( G \backslash T \\) \\( \iff \\) \\( \exists \\) a directed cycle in \\( G \\).

## <a name="6-topological-sort"></a>6. Topological Sort

A topological ordering of a directed graph \\( G \\) is a total order \\( \prec \\) on the vertices such that \\( a \prec b \\) for every edge `a → b`. Less formally, a topological ordering arranges the vertices along a horizontal line so that all edges point from left to right. 

A topological ordering is clearly impossible if the graph \\( G \\) has a directed cycle—the rightmost vertex of the cycle would have an edge pointing to the left! On the other hand, every DAG has a topological order.

_**Idea:**_ Run `DFS` on every vertex \\( x\_i \\) of \\( x\_1,\dots,x\_V \\) and sort the verices by \\( post(x\_i) \\) in reverse order.

_**Correctness of the Idea:**_ By _**Lemma 2**_, for every edge `a → b` in a DAG, the finishing time of is `a` greater than that of `b`, as there are NO back edges (because DAG has no cycle) and the remaining three classes of edges have this property.

_**Improvement:**_ However actually you don't need to sort. 我们看下 `DFSAll` 的写法：

<pre class="prettyprint linenums">
DFS(v)
	mark v
	
	prev(v) &lt;- clock++
	
	for each edge v → w
		if w is unmarked
			parent(w) &lt;- v
			DFS(w)
	
	post(v) &lt;- clock++

DFSAll(G)
	clock &lt;- 0
	
	for each vertex v
		if v is not marked
			DFS(v)
</pre>

从最后的结果来看，finishing time, i.e. \\( post(x\_i) \\) 的顺序并不会因为 `for each vertex v` 的遍历顺序而改变。考虑个简单的图 `a → b → c`：

- 假设 `DFSAll(G)` 的顺序是 `c`、`b`、`a`，得到的结果是 `post(c)=1`、`post(b)=3`、`post(a)=5`
- 假设 `DFSAll(G)` 的顺序是 `b` (所以包括了 `c`)、`a`，得到的结果是 `post(c)=2`、`post(b)=3`、`post(a)=5`
- 假设 `DFSAll(G)` 的顺序是 `a` (所以包括了 `b` 和 `c`)，得到的结果是 `post(c)=3`、`post(b)=4`、`post(a)=5`

所以你其实只用记录下 \\( post(x\_i) \\)，然后根据它逆序排列 \\( x\_i \\) 就可以了。

_**RT:**_ 所以 Topological Sort 的时间复杂度和 `DFSAll` 是一样的，都是 \\( O(V+E) \\)

## <a name="7-scc"></a>7. Strongly Connected Components (SCC)

In a directed graph \\( G = (V,E) \\), vertex `a` is _**connected**_ to vertex `b` if there exists a path `a → b`.

In a directed graph \\( G = (V,E) \\), vertex `a` is _**strongly connected**_ to `b` if there exists a path `a → b`, and also a path `b → a`.

If `a` is strongly connected to `b`, we write `a ~ b`.

Strong connectivity of vertices in a directed graph can be thought of as an equivalence relation of `~`.

- Reflexivity: `a ~ a`, i.e. `a` is strongly conneted to itself.
- Transitivity: if `a ~ b` and `b ~ c`, then `a ~ c`.
- Symmetry: if `a ~ b`, then `b ~ a`.

In a directed graph \\( G = (V,E) \\), a Strongly Connected Component (SCC) is a maximal subgraph
\\( S = (V\_s, E\_s) \\) s.t. \\( \forall \\) two vertices \\( a, b \in V_s \\), \\( a \sim b \\).

_**N.B.**_ 注意这里 maximal 并不是 SCC 的特殊要求，而是因为 component 本身就是 maximal subgraph。

We can see SCCs as equivalence classes of `~`.

For any directed graph \\( G \\), the strong component graph \\( scc(G) \\) is another directed graph obtained by contracting each strong component of \\( G \\) to a single (meta-)vertex and collapsing parallel edges.

Let \\( C \\) be any strong component of \\( G \\) that is a sink in \\( scc(G) \\); we call \\( C \\) a _**sink component**_. Every vertex in \\( C \\) can reach every other vertex in \\( C \\), so a depth-first search from any vertex in \\( C \\) visits every vertex in \\( C \\). On the other hand, because \\( C \\) is a sink component, there is no edge from \\( C \\) to any other strong component, so a depth-first search starting in \\( C \\) visits only vertices in \\( C \\).

So we can come up with an idea to find all SCC in \\( G \\): 

- find a sink SCC, \\( C\_{s1} \\) of \\( G \\), and remove it from \\( G \\);
- find a sink SCC, \\( C\_{s2} \\) of \\( (G - C\_{s1}) \\), and remove it;
- ...
- till \\( G \\) is empty.

所以问题转换为 to find a sink SCC。又因为，只要找到了一个 sink SCC 的 vertex，就能 `DFS` 得到 sink SCC，所以问题进一步转换为 to find a vertex in a sink SCC。

_**Lemma 4.**_ The vertex with largest finishing time (i.e. `post(x)`) lies in a source SCC of G.

_**Lemma 5.**_ For any edge `a → b` in \\( G \\), if `post(a) < post(b)`, then `a` and `b` are strongly connected in \\( G \\). (hint: backward edges)

It is easy to check that any directed \\( G \\) has exactly the same strong components as its reversal \\( rev(G) \\); in fact, we have \\( rev(scc(G)) = scc(rev(G)) \\). Thus, the vertex with the largest finishing time in \\( rev(G) \\) lies in a source SCC of \\( rev(G) \\), and therefore, lies in a sink SCC of \\( G \\).

Actually you even don't have to repeat the "find-remove" procedure. The Kosaraju algorithm could find all SCCs this way: 

- Step 1: `DFSAll(rev(G))`; output vertices in the reverse (descendant) order of finishing time
	- source → sink order in \\( rev(G) \\)
	- sink → source order in \\( G \\)
- Step 2: `DFSAll(G)` in the order above
	- each call to `DFS` in the loop of `DFSAll(G)` visits exactly one strong component of \\( G \\)
	
## <a name="8-shortest-paths"></a>8. Shortest Paths

Given a weighted directed graph \\( G = (V,E,w) \\), a source vertex `s` and a target vertex `t`, find the shortest `s → t` regarding `w`.

A more general problem is called _**single source shortest path**_ or _**SSSP**_: find the shortest path from `s` to every other vertex in \\( G \\).

_**N.B.**_ Throughout this post, we will explicitly consider only directed graphs. All of the algorithms described in this lecture also work for undirected graphs with some minor modifications, but only if negative edges are prohibited. On the other hand, it's OK for directed graphs to have negative edges in this problem. However, negative cycles, which make this problem meaningless, are prohibited.

### <a name="8-1-the-only-sssp-alg"></a>8.1 The Only SSSP Algorithm

Let's define:

- `dist(b)` is the length of _tentative_ shortest \\( s \rightsquigarrow b \\) path, or \\( \infty \\) if there is no such path.
	- _tentative:_ [ˈten(t)ətiv], not certain or fixed
- `pred(b)` is the predecessor of `b` in the tentative shortest \\( s \rightsquigarrow b \\) path, or NULL if there is no such vertex.

<pre class="prettyprint linenums">
is_tense(a → b)
	return dist(a) + w(a → b) &lt; dist(b)
	
// `is_tense` means dist(b) better go through a → b because it's shorter

relax(a → b)
	dist(b) &lt;- dist(a) + w(a → b)
	pred(b) &lt;- a

// `relax` means "yes! now I go through a → b"
</pre>

If no edge in \\( G \\) is tense, then for every vertex `x`, `dist(x)` is the length of the predecessor path `s → ... → pred(pred(x)) → pred(x) → x`, which is, at the same time, the shortest \\( s \rightsquigarrow x \\) path.

<pre class="prettyprint linenums">
InitSSSP(s):
	dist(s) <- 0
	pred(s) <- NULL
	for all vertices v != s
		dist(v) <- ∞
		pred(v) <- NULL

GenericSSSP(s):
	InitSSSP(s)
	put s in the bag

	while the bag is not empty
		take u from the bag
		for all edges u → v
			if u → v is tense
				Relax(u → v)
				put v in the bag
</pre>

Just as with graph traversal, different “bag” data structures for the give us different algorithms. There are three obvious choices to try: a stack, a queue, and a priority queue. Unfortunately, if we use a stack, the resulting algorithm performs \\( O(2\^V) \\) relaxation steps in the worst case!  The other two possibilities are much more efficient.

### <a name="8-2-dijkstra-alg"></a>8.2 Dijkstra’s Algorithm

If we implement the bag using a priority queue, where the priority of a vertex `v` is its tentative distance `dist(v)`, we obtain Dijkstra’s Algorithm

- A priority queue is different from a "normal" queue, because instead of being a "first-in-first-out" data structure, values come out in order by priority.
- This means every time we "take `u` from the bag", we take the one with minimal `dist(x)`.
	- 其实可以看做是一种 greedy algorithm

Dijkstra’s algorithm is particularly well-behaved if the graph has _**NO negative-weight edges**_. In this case, it’s not hard to show (by induction, of course) that the vertices are scanned in increasing order of their shortest-path distance from `s`. It follows that each vertex is scanned at most once, and thus that each edge is relaxed at most once.

Since the priority of each vertex in the priority queue is its tentative distance from `s`, the algorithm performs a `decreasePriority` operation every time an edge is relaxed. Thus, the algorithm performs at most \\( E \\) `decreasePriority`. Similarly, there are at most \\( V \\) `enqueue` and `getMinPriority` operations. Thus, if we implement the priority queue with a Fibonacci heap, the total running time of Dijkstra’s algorithm is \\( O(E + V \log V) \\); if we use a regular binary heap, the running time is \\( O(E \log V) \\).

### <a name="8-3-shimbel-alg"></a>8.3 Shimbel’s Algorithm

If we replace the heap in Dijkstra’s algorithm with a FIFO queue, we obtain Shimbel’s Algorithm. Shimbel’s algorithm is efficient even if there are negative edges, and it can be used to quickly detect the presence of negative cycles. If there are no negative edges, however, Dijkstra’s algorithm is faster.

<pre class="prettyprint linenums">
ShimbelSSSP(s):
	InitSSSP(s)
	repeat V times: // 其实 repeat (V-1) 次就够了
		for every edge u → v
			if u → v is tense
				Relax(u → v)
</pre>

A simple inductive argument implies the following invariant for every repeat index `i` and vertex `v`: After `i` phases of the algorithm, `dist(v)` is at most the length of the shortest walk from `s` to `v` consisting of at most `i` edges.

Repeat \\( V-1 \\) 次的考虑是，从 `s` 到某个 `t` 的路径最多有 \\( V \\) 个 vertex，thus \\( V-1 \\) 条 edge，所以至多可能需要 `relax` \\( V-1 \\) 次。不 repeat \\( E \\) 次的原因是，不是那么 sparse 的图，一般都是 \\( E > V \\)，你从 `s` 到某个 `t` 的路径一般不会把 \\( E \\) 条 edge 全占了。

更多的解释见：[Bellman-Ford algorithm - Why can edges be updated out of order?](http://cs.stackexchange.com/a/6914)。

In each phase, we scan each vertex at most once, so we relax each edge at most once, so the running time of a single phase is \\( O(E) \\). Thus, the overall running time of Shimbel’s algorithm is \\( O(VE) \\).

## <a name="9-all-pairs-shortest-paths"></a>9. All-Pairs Shortest Paths (APSP)

- `dist(u, v)` is the length of the shortest \\( s \rightsquigarrow b \\) path.
- `pred(u, v)` is the second-to-last vertex on the shortest \\( s \rightsquigarrow b \\) path, i.e. the vertex before `v` on the path.

The output of our shortest path algorithms will be a pair of \\( V \times V \\) arrays encoding all \\( V\^2 \\) distances and predecessors.

### 9.1 Intuition 1: Run SSSP for every vertex

- Shimbel’s: \\( V \cdot \Theta(VE) = \Theta(V\^2E) = O(V\^4) \\) 
- Dijkstra’s: \\( V \cdot \Theta(E + V \log V) = \Theta(VE + V\^2 \log V) = O(V\^3) \\) 

For graphs with negative edge weights, Dijkstra’s algorithm can take exponential time, so we can’t get this improvement directly.

### 9.2 Johnson’s Algorithm

Johnson's 的出发点很简单：How to get rid of negative edges while keeping the SP? 解决了这个问题，就可以 run Dijkstra’s for every vertex 了。

这里我们做一个 reweighting：\\( w'(u \rightarrow v) = c(u) + w(u \rightarrow v) − c(v) \\). 所以:

$$
\begin{align}
	w'(a \rightsquigarrow z) &= c(a) + w(a \rightarrow b) − c(b) \\\\
						&+ c(b) + w(b \rightarrow c) - c(c) \\\\
						&+ \dots \\\\
						&+ c(y) + w(y \rightarrow z) - c(z) \\\\
						&= c(a) + w(a \rightsquigarrow z) - c(z)
\end{align}
$$

所以这么 rewighting 并不会影响我们找最小的 \\( w(a \rightsquigarrow z) \\)。现在问题转化为：如何确保 \\( w'(u \rightarrow v) \\) 为 non-negative？

你有没有觉得 \\( w'(u \rightarrow v) \\) 这个形式很像我们之前的 [`is_tense(a → b)`](#8-1-the-only-sssp-alg)? 所以我们跑一遍 Shimbel，让 \\( c(u) = dist(u) \\)，确保每条边都有被 relax 到，这样就能确保 \\( w'(u \rightarrow v) \\) 为 non-negative。

至于为什么是 Shimbel 而不是 Dijkstra？Because Shimbel doesn’t care if the edge weights are negative.

<pre class="prettyprint linenums">
JohnsonAPSP(G=(V,E), w):
	// Step 1: O(V)
	add a source s, connect it to all v ∈ V, with edge length 0
	
	// Step 2: O(EV)
	c[] <- Shimbel(G+s)
	
	// Step 3: O(E). Reweighting
	for all u → v ∈ E:
		w(u → v) = c(u) + w(u → v) − c(v)
		
	// Step 4: O(VE + V^2 log V). Dijkstra for every vertex
	for all v ∈ V:
		Dijkstra(v)
	
	// Step 5: O(E). Recover from reweighting
	for all u → v ∈ E:
		dist(u,v) = dist(u,v) + c(v) − c(u)
</pre>

_**RT:**_ \\( V \cdot \Theta(E + V \log V) = \Theta(VE + V\^2 \log V) \\)

### 9.3 Intuition 2: Dynamic Programming

$$
\begin{equation}
    dist(u,v) =
    \begin{cases}
        0 & \text{if } u = v \\\\
        \underset{x \rightarrow v}{\operatorname{min}} (dist(u,x) + w(x \rightarrow v)) & \text{otherwise}
    \end{cases}
\end{equation}
$$

Unfortunately, this recurrence doesn’t work! To compute `dist(u,v)`, we may need to compute `dist(u,x)` for every other vertex `x`. But to compute `dist(u,x)`, we may need to compute `dist(u,v)`. We’re stuck in an infinite loop.

To avoid this circular dependency, __*we need an additional parameter that decreases at each recursion*__, eventually reaching zero at the base case. One possibility is to include the number of edges in the shortest path as this third magic parameter, just as we did in the dynamic programming formulation of Shimbel’s algorithm. Let `dist(u,v,k)` denote the length of the shortest path from `u` to `v` that uses at most `k` edges. Since we know that the shortest path between any two vertices has at most `V−1` vertices, `dist(u,v,V−1)` is the actual shortest-path distance. As in the single-source setting, we have the following recurrence:

$$
\begin{equation}
    dist(u,v,k) =
    \begin{cases}
        0 & \text{if } u = v \\\\
        \infty & \text{if } k = 0 \text{ if } u \neq v \\\\
		\underset{x \rightarrow v}{\operatorname{min}} (dist(u,x,k-1) + w(x \rightarrow v)) & \text{otherwise}
    \end{cases}
\end{equation}
$$

<pre class="prettyprint linenums">
DP_APSP(V, E, w):
	for all u ∈ V:
		for all v ∈ V:
			if u = v
				dist[u,v,0] = 0
			else 
				dist[u,v,0] = ∞
	
	for k = 1 to V-1
		for all v ∈ V:
			dist[u,u,k] = 0
			for all u ∈ V and u ≠ v
				dist[u,u,k] = ∞
				// for all x → v ∈ E: 
					// ...
				// Equivalently
				for all x ∈ V: 
					if x → v ∈ E:
						if dist[u,v,k] > dist[u,x,k−1] + w(x → v)
							dist[u,v,k] = dist[u,x,k−1] + w(x → v)
</pre>

_**RT:**_ \\( O(V\^4) \\)

_**Improvement: Shimbel APSP**_

Just as in the dynamic programming development of Shimbel’s single-source algorithm, we don’t actually need the inner loop over vertices `v`, and we only need a two-dimensional table. After the `k`\^th iteration of the main loop in the following algorithm, `dist[u,v]` lies between the true shortest path distance from `u` to `v` and the value `dist[u,v,k]` computed in the previous algorithm.

<pre class="prettyprint linenums">
Shimbel_APSP(V, E, w):
	for all u ∈ V:
		for all v ∈ V:
			if u = v
				dist[u,v] = 0
			else 
				dist[u,v] = ∞
	
	for k = 1 to V-1
		for all v ∈ V:
			// for all x → v ∈ E: 
				// ...
			// Equivalently
			for all x ∈ V: 
				if x → v ∈ E:
					if dist[u,v] > dist[u,x] + w(x → v):
						dist[u,v] = dist[u,x] + w(x → v)
</pre>

_**RT:**_ \\( O(V\^2 E) \\)

### 9.4 Intuition 3: DP + Divide and Conquer

$$
\begin{equation}
    dist(u,v,k) =
    \begin{cases}
        0 & \text{if } u = v \\\\
        \infty & \text{if } k = 0 \text{ if } u \neq v \\\\
		\underset{x \rightarrow v}{\operatorname{min}} (dist(u,x,\frac{k}{2}) + (dist(x,v,\frac{k}{2})) & \text{otherwise}
    \end{cases}
\end{equation}
$$

<pre class="prettyprint linenums">
DC_DP_APSP(V, E, w):
	for all u ∈ V:
		for all v ∈ V:
			dist[u,v,0] = w(u → v)
	
	for k = 1 to (log V)
		for all v ∈ V:
			for all u ∈ V:
				dist[u,u,k] = ∞
				for all x ∈ V: 
					if dist[u,v,k] > dist[u,x,k−1] + dist[x,v,k−1]:
						dist[u,v,k] = dist[u,x,k−1] + dist[x,v,k−1]
</pre>

_**RT:**_ \\( O(V\^3 \log V) \\)

_**Improvement: Shimbel Version reduces the size of DP table**_

<pre class="prettyprint linenums">
DC_Shimbel_APSP(V, E, w):
	for all u ∈ V:
		for all v ∈ V:
			dist[u,v] = w(u → v)
	
	for k = 1 to (log V)
		for all v ∈ V:
			for all u ∈ V:
				for all x ∈ V: 
					if dist[u,v] > dist[u,x] + dist[x,v]:
						dist[u,v] = dist[u,x] + dist[x,v]
</pre>

_**RT:**_ \\( O(V\^3 \log V) \\)

### 9.5 Floyd-Warshall: an \\( O(V\^3) \\) DP Alg

待续

### 9.6 APSP in unweighted undirected graphs: Seidel's Alg

待续

## <a name="10-minimum-spanning-trees"></a>10. Minimum Spanning Trees

和 Shortest Path 一样，MST 的 minimum 指的也是 tree 的各个 edges 的 weight 之和，\\( w(T)=\sum\_{e \in T}{w(e)} \\)最小。所以也可以理解为 lightest spanning tree。

_**P.S.**_ 注意用词：

- minimum 是可以用作形容词的，which is a quantitative representation of the smallest amount needed
- minimal is a qualitative characteristic. 虽然有的时候也用来表示定量。

To keep things simple, I’ll assume that all the edge weights are distinct: \\( w(e) \neq w(e') \\) for any pair of edges \\( e \\) and \\( e' \\). Distinct weights guarantee that the minimum spanning tree of the graph is unique. For example, if all the edges have weight 1, then every spanning tree is a minimum spanning tree with weight \\( V − 1 \\).

### <a name="10-1-the-only-mst-alg"></a>10.1 The Only MST Algorithm

The generic minimum spanning tree algorithm MAINTAINS an acyclic subgraph \\( F \\) of the input graph \\( G=(V,E) \\), which we will call an _intermediate spanning forest_. \\( F \\) is a subgraph of the minimum spanning tree of \\( G \\), and every component of \\( F \\) is a minimum spanning tree of its vertices. Initially, \\( F \\) consists of \\( n \\) one-node trees. The generic algorithm merges trees together by adding certain edges between them. When the algorithm halts, \\( F \\) consists of a single \\( n \\)-node tree, which must be the minimum spanning tree. Obviously, we have to be careful about which edges we add to the evolving forest, since not every edge is in the minimum spanning tree.

The intermediate spanning forest \\( F=(V, E\_F) \\) induces two special types of edges \\( e \in E \backslash E\_F \\)（注意 \\( F \\) 在算法执行的过程中是不断进化的，以下的描述是针对某一个特定阶段的 \\( F \\)；另外 \\( e \in E \backslash E\_F \\) 说明在当前阶段 \\( e \\) 不属于 \\( F \\)，但可能在下一阶段被添加到 \\( F \\)）:

- \\( e \\) is _**USELESS**_ if both its endpoints are in the same component of \\( F \\).
	- 举个简单的例子：\\( F \\) 有一个 component 是一个 triangle `ABC`，但是只走了 `A → B` 和 `B → C` 两条边，那么剩下的 `A → C` 就是条 useless edge。
- For each component of \\( F \\), we associate a _**SAFE**_ edge—the minimum-weight edge with exactly one endpoint in that component.
	- Different components might or might not have different safe edges.
	- 算法的执行过程就是不断地给 \\( F \\) 添加 safe edges，使其从 forest 变成 tree。
-  Some edges are neither safe nor useless—we call these edges _undecided_.

_**Lemma 1.**_ MST contains every safe edge.

注意 safe edges 是 \\( F \\) 演化过程中的产物，如果 \\( F \\) 已经是 MST 了，\\( E \backslash E\_F \\) 中应该不会再有 safe edge 了。所以这里的 safe edges 说的是演化过程中的 safe edge。

_**Proof:**_ In fact we prove the following stronger statement: For any subset \\( S \subset V \\), the minimum-weight edge with exactly one endpoint in \\( S \\) is in the MST. We prove this claim using a greedy exchange argument.

Let \\( e\_s \\) be a minimum-weight edge with exactly one endpoint in \\( S \\). Let \\( T \\) be the MST. Suppose \\( e\_s \\) 不在 \\( T \\) 中。

注意不可能有 \\( S = V \\)，否则不可能有 edge with only one endpoint in \\( S \\)。所以 \\( T \\) 至少有一个 vertex 在 \\( S \\) 外部。

而 \\( e\_s \\) 只有一个 endpoint 在 \\( S \\) 里，所以另一个一定在 \\( S \\) 外部且在 \\( T \\) 中。类似于 Lemma 2，\\( T + e\_s \\) 一定有一个 cycle。Let \\( C \\) be this cycle. \\( C \\) must contain an edge other than \\( e\_s \\) that has exactly one endpoint in \\( S \\)（你 cycle 有一条 edge 跳出了 \\( S \\)，必然还会有一条跳回 \\( S \\)）. Let this edge be \\( e \\).

\\( w(e) > w(e\_s) \Longrightarrow w(T + e\_s - e) < w(T) \Longrightarrow (T + e\_s - e) \text{ is lighter than MST. } \\) Contradiction.

_**Lemma 2.**_ MST contains no useless edge.

_**Proof:**_ Adding any useless edge to F would introduce a cycle.

注意 useless edge 的 endpoints 是在一个 component 中的，而 component 又是 connected 的，所以这两个 endpoints 一定是连通的，你再把这两个 endpoints 连接起来，一定会有 cycle。

Our generic minimum spanning tree algorithm repeatedly adds one or more safe edges to the evolving forest \\( F \\). Whenever we add new edges to \\( F \\), some undecided edges become safe, and others become useless. To specify a particular algorithm, we must decide which safe edges to add, and we must describe how to identify new safe and new useless edges, at each iteration of our generic template.

### <a name="10-2-borvka-alg"></a>10.2 Borvka’s Algorithm

The Borvka algorithm can be summarized in one line:

> Borvka: Add ALL the safe edges and recurse.

We can find all the safe edge in the graph in \\( O(E) \\) time as follows. First, we count the components of \\( F \\) using whatever-first search, using the standard wrapper function (See [4. Preorder and Postorder Labeling](#4-preorder-and-postorder-labeling)). As we count, we label every vertex with its component number; that is, every vertex in the first traversed component gets label 1, every vertex in the second component gets label 2, and so on.

<pre class="prettyprint linenums">
Borvka(G):
	F = (V, Ef)
	Ef &lt;- Φ // 空集
	
	while F is not connected
		S &lt;- all safe edges
		Ef &lt;- Ef + S
			
	return F
</pre>

_**RT:**_

- To find all safe edges, just examine every edge (check with \\( F \\)). \\( \Longrightarrow O(E) \\)
- To test whether \\( F \\) is connected, actually you can just count the # of edges, using the [conclusion](http://mathworld.wolfram.com/Forest.html):
	- A forest with \\( k \\) components and \\( n \\) nodes has \\( n-k \\) graph edges.
		- I proved a related observation in homework 1--If a connected graph with \\( n \\) vertices has \\( n-1 \\) edges, it’s a tree.
	- \\( \Longrightarrow O(1) \\)
- \# of iterations of the while-loop?
	- Each iteration reduces the number of components of \\( F \\) by at least a factor of two—the worst case occurs when the components coalesce in pairs. 
		- _coalesce:_ [ˌkoʊəˈles], (of separate elements) To join into a single mass or whole.
		- 最差的情况是 component 两两合并，比如 `A` 合并 `B`、`C` 合并 `D`...
		- 最好的情况应该是类似一个链式反应，比如 `A` 合并 `B`、然后接着合并 `C`、接着合并 `D`...
	- Since \\( F \\) initially has \\( V \\) components, the while loop iterates at most \\( O(\log V) \\) times.
- In total, \\( O(E \log V) \\).

In short, if you ever need to implement a minimum-spanning-tree algorithm, use Borvka. On the other hand, if you want to _**prove things**_ about minimum spanning trees effectively, you really need to know the next two algorithms as well.

### <a name="10-3-prim-alg"></a>10.3 Prim's Algorithm

Initially, \\( T \\) consists of an arbitrary vertex of the graph. The algorithm repeats the following step until \\( T \\) spans the whole graph:

> Jarník: Repeatedly add T’s safe edge to T.

<pre class="prettyprint linenums">
Prim(G):
	T &lt;- {v} // 任意的 vertex
	
	while |T| &lt; |V|
		e &lt;- a safe edge with one endpoint in T
		T &lt;- T + e
			
	return T
</pre>

![][Prim]

To implement Jarník’s algorithm, we keep all the edges adjacent to \\( T \\) in a priority queue. When we pull the minimum-weight edge out of the priority queue, we first check whether both of its endpoints are in \\( T \\). If not, we add the edge to \\( T \\) and then add the new neighboring edges to the priority queue. In other words, Jarník’s algorithm is another instance of the generic graph traversal algorithm we saw last time, using a priority queue as the “bag”! If we implement the algorithm this way, the algorithm runs in \\( O(E \log E) = O(E \log V) \\) time (because \\( E = V\^2 \\) at most).

Similar to Dijkstra’s algorithm, if we implement the priority queue with a Fibonacci heap, the total running time would be \\( O(E + V \log V) \\).

### <a name="10-4-kruskal-alg"></a>10.4 Kruskal’s Algorithm

> Kruskal: Scan all edges in increasing weight order; if an edge is safe, add it to F.

<pre class="prettyprint linenums">
Kruskal(G):
	sort E w.r.t w
	
	F = (V, Ef)
	Ef &lt;- Φ // 空集
	
	for i &lt;- 1 to E
		if E[i] is not useless
			Ef &lt;- Ef + E[i]
			
	return F
</pre>

![][Kruskal]

_**RT:**_ \\( O(E \log E) = O(E \log V) \\), dominated by the sorting.

## <a name="11-matroids"></a>11. Matroids (待续)

### 11.1 Definitions (待续)

A matroid \\( M \\) is a finite collection of finite sets that satisfies three axioms:

- **Non-emptiness:** The empty set \\( \emptyset \\) is in \\( M \\). (Thus, \\( M \\) is not itself empty.)
- **Heredity:** If a set \\( X \\) is an element of \\( M \\), then any subset of \\( X \\) is also in \\( M \\).
- **Exchange:** (a.k.a **Augmentation**) If \\( X \\) and \\( Y \\) are two sets in \\( M \\) where \\( |X| > |Y| \\), then there \\( \exists \\) an element \\( x \in X \setminus Y \\) such that \\( Y \cup \\{x\\} \\) is in \\( M \\).

<!-- -->

- The sets in \\( M \\) are typically called _**independent sets**_. 
	- Therefore, the three axioms can also be stated as:
		- **Non-emptiness**: The empty set \\( \emptyset \\) is independent.
		- **Heredity**: If a set \\( X \\) is independent, then any subset of \\( X \\) is also independent.
		- **Exchange** (a.k.a **Augmentation**): If \\( X \\) and \\( Y \\) are two independent sets where \\( |X| > |Y| \\), then there \\( \exists \\) an element \\( x \in X \setminus Y \\) such that \\( Y \cup \\{x\\} \\) is also independent.
- The union of all sets in \\( M \\) is called the _**ground set**_.
	- In set theory, a collection, \\( F \\), of subsets of a given set \\( S \\) is called a _**family**_ of subsets of \\( S \\).
	- Therefore, a matroid is a family of subsets of its ground set.
	
<!-- -->

- A maximal independent set is called a _**basis**_.
	- "Maximal" means it is not a proper subset of any other independent set. E.g.
		- Ground set \\( U = \\{ 1,2,3 \\} \\)
		- \\( M = \\{ \text{subsets of } U \text{ of size at most 2} \\} = \\{ \emptyset, \\{ 1 \\}, \\{ 2 \\}, \\{ 3 \\}, \\{ 1,2 \\}, \\{ 1,3 \\}, \\{ 2,3 \\} \\} \\)
		- \\( \\{ 1,2 \\} \\), \\( \\{ 1,3 \\} \\) and \\( \\{ 2,3 \\} \\) are all bases.
	- The exchange property implies that every basis of a matroid has the same cardinality (i.e. size).
	- The _**rank**_ of a matroid is the size of its bases.
- A subset of the ground set that is not in \\( M \\) is a _**dependent set**_.
	- E.g. ground set \\( U = \\{ 1,2,3 \\} \\) itself is a dependent set above.
- A dependent set is called a _**circuit**_ if any of its proper subset is independent.
	- E.g. ground set \\( U = \\{ 1,2,3 \\} \\) itself is a circuit above.
	
Here are several other examples of matroids; some of these we will see again later.

- **Linear matroid:** Let \\( A \\) be any \\( n \times m \\) matrix. A subset \\( I \subseteq \\{ 1, 2, \dots, n \\} \\) is independent if and only if the corresponding subset of columns of \\( A \\) is linearly independent.
- **Uniform matroid \\( U\_{k,n} \\):** A subset \\( X \subseteq \\{ 1, 2, \dots, n \\} \\) is independent if and only if \\( |X| \leq k \\). Any subset of \\( \\{ 1, 2, \dots, n \\} \\) of size \\( k \\) is a basis; any subset of size \\( k + 1 \\) is a circuit.
- **Matching matroid:** Let \\( G = (V, E) \\) be an arbitrary undirected graph. A subset \\( I \subseteq V \\) is independent if there is a matching in \\( G \\) that covers \\( I \\).

_**TODO:**_ Lecture note 和笔记本上还有些例子待补充。

### 11.2 Matroid Optimization Problem (待续)

Now suppose each element of the ground set of a matroid \\( M \\) is given an arbitrary non-negative weight， i.e. \\( w: U \rightarrow R\^{+} \\). The matroid optimization problem is to compute a basis with maximum total weight. For example, if \\( M \\) is the cycle matroid for a graph \\( G \\), the matroid optimization problem asks us to find the maximum spanning tree of \\( G \\).

There goes a greedy alg:

<pre class="prettyprint linenums">
// Given ground set U and matroid I
GreedyMatroidOPT(U, I, w):
	B = Φ // 空集
	
	// O(n log n)
	sort U w.r.t w in decreasing order
	
	// O(n)
	for each u ∈ U:
		// F(n)
		if B + {u} ∈ I: // i.e. B + {u} is independent
			B = B + {u}
			
	return B
</pre>

有没有觉得很像 [Kruskal’s Algorithm](#10-4-kruskal-alg)？

_**RT:**_ \\( O(n \log n) + n F(n) \\). \\( F(n) \\) 应该是 depends on 具体的应用。

_**TODO:**_ 补充 proof

## <a name="12-matching"></a>12. Matching (待续)

### 12.1 The Maximum Matching Problem

Let \\( G = (V, E) \\) be an undirected graph. A set \\( M \subseteq E \\) is a _**matching**_ if no pair of edges in \\( M \\) have a common vertex. 

A vertex \\( v \\) is _**matched**_ if it is contained in an edge of \\( M \\), and _**unmatched**_ (or _**free**_) otherwise. 

In the maximum matching problem we are asked to find a matching \\( M \\) of maximum size.

### 12.2 Alternating and Augmenting Paths (待续)

Let \\( G = (V, E) \\) be a graph and let \\( M \\) be a matching in \\( G \\). A path \\( P \\) is said to be an _**alternating path**_ with respect to \\( M \\) if and only if among every two consecutive edges along the path, exactly one belongs to \\( M \\). 我们也可以简称 P is \\( M \\)-alternating.

E.g.

\\( \in M \\)	\\( \notin M \\)	\\( \in M \\)
 
|=======|--------|========|

If A and B are sets, we let \\( A \oplus B = (A − B) \cup (B − A) \\) be their _**symmetric difference**_. 其实就是异或（XOR）。

An _**augmenting path**_ \\( P \\) with respect to a matching \\( M \\) is an alternating path that starts and ends in unmatched vertices, i.e. \\( P \\)'s endpoints are distinct free vertices. 我们也可以简称 P is \\( M \\)-augmenting.

_**Lemma 2.3**_ If \\( M \\) is a matching and \\( P \\) is an alternating path with respect to \\( M \\), where each endpoint of \\( P \\) is either unmatched by \\( M \\) or not, then \\( M \oplus P \\) is also a matching.

这里你要把 \\( P \\) 看做 edge 的集合，因为 path 用到了所有的边，所以 \\( P = E \\)。而 matching 不可能用到所有的边，所以 \\( M \subset E \\)，也就是 \\( |M| < |E| \\)。所以 \\( M \oplus P = M \oplus E = E \setminus M \\)。

下面有三条 alternating paths，粗线条的是 matching：

![][Alternating_Path]

- **CASE 1:** If \\( P \\) starts and ends in vertices unmatched by M (i.e. P is \\( M \\)-augmenting) (e.g., the top path in figure), then \\( |M \oplus P| = |M| + 1 \\), i.e., \\( M \oplus P \\) is a larger matching. 
- **CASE 2:** If \\( P \\) starts with an edge that does not belong to \\( M \\) and ends with an edge of \\( M \\) (e.g., the middle path in figure), then \\( |M \oplus P| = |M| \\). 
- **CASE 3:** If \\( P \\) starts and ends with edges of \\( M \\) (see the bottom path in figure 2), then \\( |M \oplus P| = |M| − 1 \\).

_**TODO:**_ proof of CASE 1

_**Lemma 2.5**_ (待续)

_**Lemma 2.6**_ (待续)

_**Theorem 2.7**_ Let \\( G = (V, E) \\) be an undirected graph and let \\( M \\) be a matching in \\( G \\). Then, \\( M \\) is a maximum matching in \\( G \\) if and only if there is no \\( M \\)-augmenting paths in G.

_**TODO:**_ proof

Theorem 2.7 suggests the following simple algorithm for finding a maximum matching:

<pre class="prettyprint linenums">
MaxMatching(G):
	M = Φ // 空集
	
	while exists an M-aug path P:
		M = M &#8853; P
			
	return M
</pre>

- The `while` loop would take \\( \frac{V}{2} \\) iteration.
- For bipartite graphs, `AltBFS` alg takes \\( O(E) \\) time to find an M-aug path.

_**TODO:**_ bipartite graphs & `AltBFS` alg
