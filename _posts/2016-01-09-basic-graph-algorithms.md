---
layout: post-mathjax
title: "Basic Graph Algorithms"
description: ""
category: Algorithm
tags: [Algorithm-101]
---
{% include JB/setup %}

[edge_types]: https://farm2.staticflickr.com/1521/24260605262_83a3b5a6b7_o_d.png

## 1. Definition

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
	
## 2. Traversing Connected Graphs

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

## 3. More on DFS

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

## 4. Preorder and Postorder Labeling

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
| post | 6 | 5 | 4 |

_**N.B.**_ 其实这里我觉得把 `prev(a)` 看做 "start time of accessing a" 或者 "time before accessing a"、把 `post(a)` 看做 "finish time of accessing a" 或者 "time after accessing a" 更好理解一点。

Consider `a` and `b`, where `b` is marked after `a`. Then we must have `prev(a) < prev(b)`. Moreover, _**Lemma 1**_ implies that if `b` is a descendant of `a`, then `post(a) > post(b)`, and otherwise ("otherwise" 并不是是指 "`b` is an ancestor of `a`"，而是指 "`b` is not a descendant of `a`"，再结合 "`b` is marked after `a`" 这个事实，只有一种可能是 "`a` 和 `b` 属于不同的 components"), `prev(b) > post(a)` (此时 `a` component 遍历完了才轮到 `b`，`prev(b)` 的赋值必定在 `post(a)` 之后)。

Thus, for any two vertices `a` and `b`, the intervals `[pre(a), post(b)]` and `[pre(b), post(b)]` are either disjoint or nested; in particular, if `ab` is an edge, _**Lemma 2**_ implies that the intervals must be nested.

## 5. Acyclicity in Directed Graphs

Any vertex in a DAG that has no incoming vertices is called a _**source**_; any vertex with no outgoing edges is called a _**sink**_. Every DAG has at least one source and one sink, but may have more than one of each. For example, in the graph with `n` vertices but no edges, every vertex is a source and every vertex is a sink.

以下参考: 

- [COMPSCI 330: Design and Analysis of Algorithms - Lecture #5](https://www.cs.duke.edu/courses/fall14/cps130/notes/scribe5.pdf)
- [DFS Edge Classification](http://courses.csail.mit.edu/6.006/spring11/rec/rec13.pdf)

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

_**obs:**_ There is a backward edge in \\( G \backslash T \\) \\( \iff \\) \\( \exists \\) a directed cycle in \\( G \\).

