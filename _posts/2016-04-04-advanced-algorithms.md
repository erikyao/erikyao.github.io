---
layout: post-mathjax
title: "Advanced Algorithms"
description: ""
category: Algorithm
tags: [Algorithm-101]
---
{% include JB/setup %}

[Set_Cover_and_Hitting_Set]: https://farm2.staticflickr.com/1539/26140812480_d847804b02_o_d.png

## Approximation Algorithms @ [Erickson §31](http://jeffe.cs.illinois.edu/teaching/algorithms/notes/31-approx.pdf)

### 31.1 Load Balancing

$n$ 个 job 交给 $m$ 台 machine 并行处理($m \geq n$ 或是 $m<n$ 都可以)，要求尽早处理完，即尽可能地发挥并行的优势,不要把过多的 workload 压到某一台机器上。

Input:

- $n$ jobs which we want to assign $m$ machines
- a non-negative array $T[1 \dots n]$, where $T[i]$ is the running time of job $i$

Variables:

- Describe an assignment by an arrayt $A[1 \dots n]$, where $A[i] = j$ means that job $i$ is assigned
to machine $j$.
- An array $Total_A[1 \dots m]$, where $Total_A[j] = \sum_{A[i]=j} T[i]$ is the total running time on machine $j$ according to assignment $A$
- The $makespan$ of an assignment is the maximum time that any machine is busy: $\operatorname{makespan}(A)=\max_j Total_A[j]$

Output:

- $\operatorname{argmin}_A \operatorname{makespan}(A)$

It’s not hard to prove that the load balancing problem is NP-hard by reduction from `Partition`.

There is a fairly natural and efficient greedy heuristic for load balancing: consider the jobs one at a time, and assign each job to the machine $j$ with the earliest finishing time $Total[j]$.

<pre class="prettyprint linenums">
GreedyLoadBalance(T, m):
	for j = 1 to m
		Total[j] = 0
	for i = 1 to n
		min_j = min_element_of(Total)
		A[i] = min_j
		Total[min_j] = Total[min_j] + T[i]
	return A
</pre>

_**Theorem 1.**_ The makespan of the assignment computed by `GreedyLoadBalance` is at most twice the makespan of the optimal assignment.

_**Proof:**_ Fix an arbitrary input, and let OPT denote the makespan of its optimal assignment. The approximation bound follows from two trivial observations. 

1. The makespan of any assignment (and therefore of the optimal assignment) is at least the duration of the longest job, i.e. $\geq \text{duration of any job}$. 
1. $\text{the makespan of any assignment} \times m \geq \text{the total duration of all the jobs}$.

I.e.

1. $OPT \geq \max_i{T[i]}$
1. $OPT \geq \frac{1}{m} \sum_{i=1}^{n}{T[i]}$

Now consider the assignment computed by `GreedyLoadBalance`. Suppose machine $j$ has the largest total running time (i.e. the $makespan$), and let $i$ be the last job assigned to machine $j$. We already know that $T[i] \leq OPT$ and $Total[j] \geq OPT$. To finish the proof, we must show that $Total[j]−T[i] \leq OPT$.

Job $i$ was assigned to machine $j$ because it had the smallest finishing time, so $Total[j] − T[i] \leq Total[k]$ for all $k$. Therefore,

$Total[j] − T[i] \leq \frac{1}{m} \sum_{j=1}^{m}Total[j] = \frac{1}{m} \sum_{i=1}^{n}T[i] \leq OPT$

This leads to the conclusion that $Total[j] \leq 2 \cdot OPT$. $\tag*{$\blacksquare$}$

`GreedyLoadBalance` is an _**online**_ algorithm: It assigns jobs to machines in the order that the jobs appear in the input array. Online approximation algorithms are useful in settings where inputs arrive in a stream of unknown length. In this online setting, it may be impossible to compute an optimum solution, even in cases where the _**offline**_ problem (where all inputs are known in advance) can be solved in polynomial time.

In our original offline setting, we can improve the approximation factor by sorting the jobs before piping them through the greedy algorithm.

<pre class="prettyprint linenums">
SortedGreedyLoadBalance(T, m):
	sort T in decreasing order
	return GreedyLoadBalance(T, m)
</pre>

_**Theorem 2.**_ The makespan of the assignment computed by SortedGreedyLoadBalance is at most $\frac{3}{2}$ times the makespan of the optimal assignment.

_**Proof:**_ Let $j$ be the busiest machine in the schedule computed by `SortedGreedyLoadBalance`.

- If only one job is assigned to machine $j$, then the greedy schedule is actually optimal, and the
theorem is trivially true. 
- Otherwise, let $i$ be the last job assigned to machine $j$. 此时每一台机器上至少有一个 job。

Since each of the first $m$ jobs is assigned to a unique machine, we must have $i \geq m + 1$. As in the previous proof, we know that $Total[j] − T[i] \leq OPT$. 

In any schedule, at least two of the first $m + 1$ jobs, say jobs $k$ and $l$, must be assigned to the same machine. Thus, $T[k] + T[l] \leq OPT$. Since $\max \lbrace k,l \rbrace \leq m + 1 \leq i$, and the jobs are sorted in decreasing order by duration, we have 

$$
	T[i] \leq T[m+1] \leq T[\max\lbrace k,l \rbrace] = \min \lbrace T[k], T[l] \rbrace \leq \frac{OPT}{2}
$$

We conclude that the makespan $Total[i]$ is at most $\frac{3 \cdot OPT}{2}$, as claimed. $\tag*{$\blacksquare$}$

### 31.2 Generalities

Consider an arbitrary optimization problem. Let $OPT(X)$ denote the value of the optimal solution for a given input $X$, and let $A(X)$ denote the value of the solution computed by algorithm $A$ given the same input $X$. We say that $A$ is an $\alpha(n)$-_**approximation algorithm**_ if and only if 

$$
	\frac{OPT(X)}{A(X)} \leq \alpha(n) \text{ and } \frac{A(X)}{OPT(X)} \leq \alpha(n)
$$ 

for all inputs $X$ of size $n$. The function $\alpha(n)$ is called the _**approximation factor**_ for algorithm $A$. For any given algorithm, only one of these two inequalities will be important. 

- For minimization problems, where $A(X) \geq OPT(X)$, the first inequality is trivial. 
- For maximization problems, where $A(X) \leq OPT(X)$, the second inequality is trivial. 

A 1-approximation algorithm always returns the exact optimal solution.

Especially for problems where exact optimization is NP-hard, we have little hope of completely characterizing the optimal solution. The secret to proving that an algorithm satisfies some approximation ratio is to find a useful function of the input that provides both lower bounds on the cost of the optimal solution and upper bounds on the cost of the approximate solution. For example, if $OPT(X) \geq \frac{f(X)}{2}$ and $f(X) \geq \frac{A(X)}{5}$ for any function $f$, then $A$ is a 10-approximation algorithm.

### 31.3 Greedy Vertex Cover

A vertex-cover of an undirected graph $G=(V, E)$ is a subset $V'$ of $V$ such that $\forall$ edge $(u,v) \in E$, either $u \in V'$ or $v \in V'$ (or both).

Minimum Vertex Cover Problem: find then minimum vertex-cover of $G=(V, E)$, i.e. $V'$ with minimum $\vert V' \vert$.

MVC is NP-hard. There is a natural and efficient greedy heuristic for computing a small vertex cover: mark the vertex with the largest degree, remove all the edges incident to that vertex, and recurse. 

- heuristic: of approaches that employ a practical method not guaranteed to be optimal or perfect, but sufficient for the immediate goals.

<pre class="prettyprint linenums">
GreedyVertexCover(G):
	C = Ø
	while G has at least one edge
		v = vertex in G with maximum degree
		G = G \ {v}
		C = C ∪ {v}
	return C
</pre>

_**Theorem 3.**_ `GreedyVertexCover` is an $O(\log n)$-approximation algorithm.

_**Proof:**_ For all $i$, let $ G_i $ denote the graph $G$ after $i$ iterations of the main loop, and let $d_i$ denote the maximum degree of any node in $G_i$. We can define these variables more directly by adding a few extra lines to our algorithm:

<pre class="prettyprint linenums">
GreedyVertexCover(G):
	C = Ø
	G[0] = G
	i = 0
	while G[i] has at least one edge
		i = i+1
		v[i] = vertex in G[i-1] with maximum degree
		d[i] = degree of v[i] in G[i-1]
		G[i] = G[i-1] \ {v[i]}
		C = C ∪ {v[i]}
	return C
</pre>

Let $\vert G_{i−1} \vert$ denote the number of edges in the graph $ G_{i−1} $. Let $C^{\star}$ denote the optimal vertex cover of $G$, i.e. $OPT = \vert C^{\star} \vert$. Since $C^{\star}$ is also a vertex cover for $ G_{i−1} $, we have

$$
	\sum_{v \in C^{\star}} \operatorname{deg}_{G_{i-1}}(v) \geq \vert G_{i−1} \vert
$$

In other words, the _**average**_ degree per vertex in $G_{i-1}$ is at least $\frac{\vert G_{i−1} \vert}{OPT}$. It follows that $G_{i-1}$ has at least one node with degree at least $\frac{\vert G_{i−1} \vert}{OPT}$. Since $d_i$ is the maximum degree in $G_{i-1}$, we have

$$
	d_i \geq \frac{\vert G_{i−1} \vert}{OPT}
$$

Moreover, for any $j \geq i − 1$, the subgraph $G_j$ has no more edges than $G_{i-1}$, so $d_i \geq \frac{\vert G_j \vert}{OPT}$. This observation implies that

$$
\begin{align}
	& \sum_i^{OPT} d_i \geq \sum_i^{OPT} \frac{\vert G_{i−1} \vert}{OPT} \geq \sum_i^{OPT} \frac{\vert G_{OPT} \vert}{OPT} = \vert G_{OPT} \vert = \vert G \vert - \sum_i^{OPT} d_i \newline
	& \Rightarrow \sum_i^{OPT} d_i \geq \frac{\vert G \vert}{2}
\end{align}
$$

In other words, the first $OPT$ iterations of `GreedyVertexCover` remove at least half the edges of $ G $. Thus, after at most $OPT \cdot \log \vert G \vert \leq 2 \cdot OPT \cdot \log n$ iterations, all the edges of $G$ have been removed, and the algorithm terminates. We conclude that `GreedyVertexCover` computes a vertex cover of size $O(OPT \cdot \log n)$. $\tag*{$\blacksquare$}$

### 31.4 Set Cover and Hitting Set

The greedy algorithm for vertex cover can be applied almost immediately to two more general problems: set cover and hitting set. 

The input for both of these problems is a set system $ (X,\mathcal{F}) $, where 

- $ X $ is a finite ground set, and 
- $ \mathcal{F} $ is a family of subsets of $ X $. 
	- Definition: a collection $ F $ of subsets of a given set $ S $ is called _**a family of subsets**_ of $ S $, or a family of sets over $ S $.

- A set cover of a set system $ (X,\mathcal{F}) $ is a subfamily of sets in $ \mathcal{F} $ whose union is the entire ground set $ X $. 
- A hitting set for $ (X,\mathcal{F}) $ is a subset of the ground set $ X $ that intersects every set in $ \mathcal{F} $.

An undirected graph can be cast as a set system in two different ways. 

- In one formulation, the ground set $ X $ contains the vertices, and each edge defines a set of two vertices in $ \mathcal{F} $. In this formulation, a vertex cover is a hitting set. 
- In the other formulation, the edges are the ground set $ X $, the vertices define the family of subsets $ \mathcal{F} $, and a vertex cover is a set cover. 

Here are the natural greedy algorithms for finding a small set cover and finding a small hitting set. `GreedySetCover` finds a set cover whose size is at most $O(\log \vert \mathcal{F} \vert)$ times the size of smallest set cover. `GreedyHittingSet` finds a hitting set whose size is at most $O(\log \vert X \vert)$ times the size of the smallest hitting set.

![][Set_Cover_and_Hitting_Set]

The similarity between these two algorithms is no coincidence. For any set system $ (X,\mathcal{F}) $, there is a _**dual**_ set system $ (\mathcal{F}, X^{\star}) $ defined as follows. 

For any element $ x \in X $ in the ground set, let $ x^{\star} $ denote the subfamily of sets in $ \mathcal{F} $ that contain $ x $:

$$
	x^{\star} = \lbrace S \vert x \in S, S \in \mathcal{F} \rbrace
$$

注意这里 $ x^{\star} $ 和 $x$ 是一一对应关系，有一个 $x$ 就有一个 $ x^{\star} $。$ x^{\star} $ 本身并不是一个关于 $x$ 的集合。

Finally, let $ X^{\star} $ denote the collection of all subsets of the form $ x^{\star} $:

$$
	X^{\star} = \lbrace x^{\star} \vert x \in X \rbrace
$$

As an example, suppose 

- $ X $ is the set of letters of alphabet
	- $ X = \lbrace a,b,c,\dots,z \rbrace$
- $ \mathcal{F} $ is the set of last names of student taking CS 573 this semester 
	- Assume that there are no duplicated letters in every name and no names longer than 26 letters.
	- E.g. $ \mathcal{F} = \lbrace \lbrace a,m,y \rbrace , \lbrace b,r,a,n,d,y \rbrace , \dots, \lbrace z,a,c,k \rbrace \rbrace$
- Then $ X^{\star} $ has 26 elements, each containing the subset of CS 573 students whose last name contains a particular letter of the alphabet. 
	- For example, $ m^{\star} $ is the set of students whose last names contain the letter $m$.
		- $ m^{\star} = \lbrace \lbrace a,m,y \rbrace, \lbrace m,i,k,e \rbrace, \dots \rbrace $
	- $ X^{\star} = \lbrace a^{\star},b^{\star},c^{\star},\dots,z^{\star} \rbrace$
	
A set cover for any set system $ (X,\mathcal{F}) $ is also a hitting set for the dual set system $ (\mathcal{F}, X^{\star}) $, and therefore a hitting set for any set system $ (X,\mathcal{F}) $ is isomorphic to a set cover for the dual set system $ (\mathcal{F}, X^{\star}) $.

### 31.5 Vertex Cover, Again

The greedy approach doesn’t always lead to the best approximation algorithms. Consider the following alternate heuristic for vertex cover:

<pre class="prettyprint linenums">
DumbVertexCover(G):
	C = Ø
	while G has at least one edge
		(u,v) = any edge in G
		G = G \ {u,v}
		C = C ∪ {u,v}
	return C
</pre>

The minimum vertex cover—in fact, every vertex cover—contains at least one of the two vertices u and v chosen inside the while loop. It follows immediately that `DumbVertexCover` is a 2-approximation algorithm!

待续

-----

## DAA - Chapter 1 - An introduction to approximation algorithms

### 1.1 The whats and whys of approximation algorithms

> An old engineering slogan says, “Fast. Cheap. Reliable. Choose two.”

Similarly, if $P \neq NP$, we can’t simultaneously have algorithms that (1) find optimal solutions (2) in polynomial time (3) for any instance.

- One approach relaxes the “for any instance” requirement, and finds polynomial-time algorithms for special cases of the problem at hand. This is useful if the instances one desires to solve fall into one of these special cases.
- A more common approach is to relax the requirement of polynomial-time solvability.
- By far the most common approach, however, is to relax the requirement of finding an optimal solution, and instead settle for a solution that is “good enough,” especially if it can be found in seconds or less.

The approach of this book falls into this third class.

### 1.2 An introduction to the techniques and to linear programming: the set cover problem

### 1.3 A deterministic rounding algorithm

### 1.4 Rounding a dual solution

### 1.5 Constructing a dual solution: the primal-dual method

### 1.6 A greedy algorithm

### 1.7 A randomized rounding algorithm

## DAA - Chapter 2 - Greedy algorithms and local search

local search => locally optimal solution

- A local search algorithm starts with an arbitrary feasible solution to the problem, and then checks if some small, local change to the solution results in an improved objective function. If so, the change is made. When no further change can be made, we have a locally optimal solution, and it is sometimes possible to prove that such locally optimal solutions have value close to that of the optimal solution.

Thus, while both types of algorithm optimize local choices, greedy algorithms are typically _**primal infeasible**_ algorithms: they construct a solution to the problem during the course of the algorithm. Local search algorithms are _**primal feasible**_ algorithms: they always maintain a feasible solution to the problem and modify it during the course of the algorithm.

### 2.1 Scheduling jobs with deadlines on a single machine

General Proof Trick 1: 对求极值的问题，assume $F_{max}(X)$ or $F_{min}(X)$ equals to a certain $x_i$. 然后得到一些性质（比如各种不等式），再根据 $x_i$ 是极值得到其他的 $x_j$ 都要满足某些条件，最终推到需要证明的 $cost_{alg} \leq \alpha \dot OPT$ 公式上。

### 2.2 The $k$-center problem

General Proof Trick 2: 对涉及 partition 的问题，assume optimal solution (不是 optimal cost $OPT$) $S^{\star} = \lbrace j_1,\dots,j_n \rbrace$，greedy solution $S = \lbrace i_1,\dots,i_n \rbrace$. 然后可以从几何意义入手（比如测距离、算 edge 数之类的）

### 2.3 Scheduling jobs on identical parallel machines

### 2.4 The traveling salesman problem

### 2.5 Maximizing float in bank accounts

General Proof Trick 3: 考虑 OPT 分摊到 $n$ 个 $x_i$ 上的平均值，再结合 $x_i$ 的极值得到一些性质

###　2.6 Finding minimum-degree spanning trees

### 2.7 Edge coloring

