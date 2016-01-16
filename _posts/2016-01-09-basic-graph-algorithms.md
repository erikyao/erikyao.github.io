---
layout: post-mathjax
title: "Basic Graph Algorithms"
description: ""
category: Algorithm
tags: [Algorithm-101]
---
{% include JB/setup %}

[edge_types]: https://farm2.staticflickr.com/1521/24260605262_83a3b5a6b7_o_d.png

参考：

- [Lecture 18: Basic Graph Algorithms](http://jeffe.cs.illinois.edu/teaching/algorithms/notes/19-dfs.pdf)
- [Lecture 19: Depth-First Search](http://jeffe.cs.illinois.edu/teaching/algorithms/notes/19-dfs.pdf)
- [Wikipedia: Glossary of graph theory](https://en.wikipedia.org/wiki/Glossary_of_graph_theory)
- [CS 137 - Graph Theory - Lecture 2](http://www.cs.toronto.edu/~stacho/cs137/cs137-lec2.pdf)
- [COMPSCI 330: Design and Analysis of Algorithms - Lecture #5](https://www.cs.duke.edu/courses/fall14/cps130/notes/scribe5.pdf)
- [DFS Edge Classification](http://courses.csail.mit.edu/6.006/spring11/rec/rec13.pdf)
- [Lecture 8: DFS and Topological Sort](http://home.cse.ust.hk/faculty/golin/COMP271Sp03/Notes/MyL08.pdf)

-----

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
	
<!-- -->
	
Any vertex in a DAG that has no incoming vertices is called a _**source**_; any vertex with no outgoing edges is called a _**sink**_. Every DAG has at least one source and one sink, but may have more than one of each. For example, in the graph with `n` vertices but no edges, every vertex is a source and every vertex is a sink.
	
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
| post | 5 | 4 | 3 |

_**N.B.**_ 其实这里我觉得把 `prev(a)` 看做 "start time of accessing a" 或者 "time before accessing a"、把 `post(a)` 看做 "finish time of accessing a" 或者 "time after accessing a" 更好理解一点。

Consider `a` and `b`, where `b` is marked after `a`. Then we must have `prev(a) < prev(b)`. Moreover, _**Lemma 1**_ implies that if `b` is a descendant of `a`, then `post(a) > post(b)`, and otherwise ("otherwise" 并不是是指 "`b` is an ancestor of `a`"，而是指 "`b` is not a descendant of `a`"，再结合 "`b` is marked after `a`" 这个事实，只有一种可能是 "`a` 和 `b` 属于不同的 components"), `prev(b) > post(a)` (此时 `a` component 遍历完了才轮到 `b`，`prev(b)` 的赋值必定在 `post(a)` 之后)。

Thus, for any two vertices `a` and `b`, the intervals `[pre(a), post(b)]` and `[pre(b), post(b)]` are either disjoint or nested; in particular, if `ab` is an edge, _**Lemma 2**_ implies that the intervals must be nested.

## 5. Acyclicity in Directed Graphs

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

## 6. Topological Sort

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

## 7. Strongly Connected Components (SCC)

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
	
## 8. Shortest Paths

Given a weighted directed graph \\( G = (V,E,w) \\), a source vertex `s` and a target vertex `t`, find the shortest `s → t` regarding `w`.

A more general problem is called _\\( single source shortest path \\)_ or _**SSSP**_: find the shortest path from `s` to every other vertex in \\( G \\).

_**N.B.**_ Throughout this post, we will explicitly consider only directed graphs. All of the algorithms described in this lecture also work for undirected graphs with some minor modifications, but only if negative edges are prohibited. On the other hand, it's OK for directed graphs to have negative edges in this problem. However, negative cycles, which make this problem meaningless, are prohibited.

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

### To Be Continued...