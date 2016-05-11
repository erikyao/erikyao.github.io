---
layout: post
title: "Advanced Algorithms"
description: ""
category: Algorithm
tags: [Algorithm-101]
---
{% include JB/setup %}

[Set_Cover_and_Hitting_Set]: https://farm2.staticflickr.com/1539/26140812480_d847804b02_o_d.png
[LP-dual-1]: https://farm8.staticflickr.com/7169/26528138410_82f6dc984f_o_d.png
[LP-dual-2]: https://farm8.staticflickr.com/7653/26528138420_cdd2bd055b_o_d.png

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

```python
GreedyLoadBalance(T, m):
	for j = 1 to m:
		Total[j] = 0
	for i = 1 to n:
		min_j = min_element_of(Total)
		A[i] = min_j
		Total[min_j] = Total[min_j] + T[i]
	return A
```

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

This leads to the conclusion that $Total[j] \leq 2 \cdot OPT$. $\tag*{$\square$}$

`GreedyLoadBalance` is an _**online**_ algorithm: It assigns jobs to machines in the order that the jobs appear in the input array. Online approximation algorithms are useful in settings where inputs arrive in a stream of unknown length. In this online setting, it may be impossible to compute an optimum solution, even in cases where the _**offline**_ problem (where all inputs are known in advance) can be solved in polynomial time.

In our original offline setting, we can improve the approximation factor by sorting the jobs before piping them through the greedy algorithm.

```python
SortedGreedyLoadBalance(T, m):
	sort T in decreasing order
	return GreedyLoadBalance(T, m)
```

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

We conclude that the makespan $Total[i]$ is at most $\frac{3 \cdot OPT}{2}$, as claimed. $\tag*{$\square$}$

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

```python
GreedyVertexCover(G):
	C = Ø
	while G has at least one edge
		v = vertex in G with maximum degree
		G = G \ {v}
		C = C ∪ {v}
	return C
```

_**Theorem 3.**_ `GreedyVertexCover` is an $O(\log n)$-approximation algorithm.

_**Proof:**_ For all $i$, let $ G_i $ denote the graph $G$ after $i$ iterations of the main loop, and let $d_i$ denote the maximum degree of any node in $G_i$. We can define these variables more directly by adding a few extra lines to our algorithm:

```python
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
```

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

In other words, the first $OPT$ iterations of `GreedyVertexCover` remove at least half the edges of $ G $. Thus, after at most $OPT \cdot \log \vert G \vert \leq 2 \cdot OPT \cdot \log n$ iterations, all the edges of $G$ have been removed, and the algorithm terminates. We conclude that `GreedyVertexCover` computes a vertex cover of size $O(OPT \cdot \log n)$. $\tag*{$\square$}$

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

```python
DumbVertexCover(G):
	C = Ø
	while G has at least one edge
		(u,v) = any edge in G
		G = G \ {u,v}
		C = C ∪ {u,v}
	return C
```

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

General Proof Trick 1: 对求极值的问题，assume $F_{max}(X)$ or $F_{min}(X)$ equals to a certain $x_i$. 然后得到一些性质（比如各种不等式），再根据 $x_i$ 是极值得到其他的 $x_j$ 都要满足某些条件，最终推到需要证明的 $cost_{alg} \leq \alpha \cdot OPT$ 公式上。

### 2.2 The $k$-center problem

General Proof Trick 2: 对涉及 partition 的问题，assume optimal solution (不是 optimal cost $OPT$) $S^{\star} = \lbrace j_1,\dots,j_n \rbrace$，greedy solution $S = \lbrace i_1,\dots,i_n \rbrace$. 然后可以从几何意义入手（比如测距离、算 edge 数之类的）

### 2.3 Scheduling jobs on identical parallel machines

### 2.4 The traveling salesman problem

### 2.5 Maximizing float in bank accounts

General Proof Trick 3: 考虑 OPT 分摊到 $n$ 个 $x_i$ 上的平均值，再结合 $x_i$ 的极值得到一些性质

###　2.6 Finding minimum-degree spanning trees

### 2.7 Edge coloring

-----

## Linear Programming @ [Erickson §26](http://jeffe.cs.illinois.edu/teaching/algorithms/notes/26-lp.pdf)

A linear programming problem asks for a vector $x = (x_1,\dots,x_d) \in \mathbb{R}^d$ that maximizes (or equivalently, minimizes) a given linear function, among all vectors $ x $ that satisfy a given set of linear inequalities. The general form of a linear programming problem is the following:

$$
\begin{align}
\text{maximize } 	& \sum_{j=1}^{d} c_j x_j & \newline
\text{subject to } 	& \sum_{j=1}^{d} a_{ij} x_j \leq b_i & \text{ for each } i=1 \dots p \newline
					& \sum_{j=1}^{d} a_{ij} x_j = b_i & \text{ for each } i=p+1 \dots p+1 \newline
					& \sum_{j=1}^{d} a_{ij} x_j \geq b_i & \text{ for each } i=p+q+1 \dots n 
\end{align}
$$

Here, the input consists of a matrix $ A = (a_{ij}) \in \mathbb{R}^{n \times d} $, a column vector $ b = (b_1,\dots,b_n) \in \mathbb{R}^n $, and a row vector $ c = \left( \begin{smallmatrix} c_1 \newline \vdots \newline c_d \end{smallmatrix} \right) \in \mathbb{R}^d $.

A linear programming problem is said to be in _**canonical form**_ if it has the following structure:

$$
\begin{align}
\text{maximize } 	& \sum_{j=1}^{d} c_j x_j & \newline
\text{subject to } 	& \sum_{j=1}^{d} a_{ij} x_j \leq b_i & \text{ for each } i=1 \dots n \newline
					& x_j \geq 0 & \text{ for each } j=1 \dots d
\end{align}
$$

We can express this canonical form more compactly as follows.

$$
\begin{align}
\text{max } 	& c \cdot x \newline
\text{s.t. } 	& A x \leq b \newline
				& x \geq 0
\end{align}
$$

Any linear programming problem can be converted into canonical form as follows: 

- For each variable $ x_j $, add the equality constraint $ x_j = x_j^{+} − x_j^{-} $ and the inequalities $ x_j^{+} \geq 0 $ and $ x_j^{-} \geq 0 $. 
- Replace any equality constraint $ \sum_j a_{ij} x_j = b_i $ with two inequality constraints $ \sum_j a_{ij} x_j \geq b_i $ and $ \sum_j a_{ij} x_j \leq b_i $. 
- Replace any upper bound $ \sum_j a_{ij} x_j \geq b_i $ with the equivalent lower bound $ \sum_j -a_{ij} x_j = -b_i $.

This conversion potentially double the number of variables and the number of constraints; fortunately, it is rarely necessary in practice.

Another useful format for linear programming problems is _**slack form**_.

$$
\begin{align}
\text{max } 	& c \cdot x \newline
\text{s.t. } 	& A x = b \newline
				& x \geq 0
\end{align}
$$

It’s fairly easy to convert any linear programming problem into slack form. Slack form is especially useful in executing the simplex algorithm.

### 26.1 The Geometry of Linear Programming

A point $x \in \mathbb{R}^d$ is _**feasible**_ with respect to some linear programming problem if it satisfies all the linear constraints. The set of all feasible points is called the feasible region for that linear program. The feasible region has a particularly nice geometric structure that lends some useful intuition to the linear programming algorithms we’ll see later.

- Any linear equation in $ d $ variables ($x = (x_1,\dots,x_d)$) defines a _**hyperplane**_ in $ \mathbb{R}^d $; think of a line when $ d = 2 $, or a plane when $ d = 3 $. 
- This hyperplane divides $ \mathbb{R}^d $ into two _**halfspaces**_; each halfspace is the set of points that satisfy some linear inequality. 
- Thus, the set of feasible points is the intersection of several hyperplanes (one for each equality constraint) and halfspaces (one for each inequality constraint) (平面上，hyperplane 就是线，hyperspace 就是面). 
- The intersection of a finite number of hyperplanes and halfspaces is called a _**polyhedron**_. 
	- It’s not hard to verify that any halfspace, and therefore any polyhedron, is _**convex**_—if a polyhedron contains two points $ x $ and $ y $, then it contains the entire line segment $ \overline{xy} $.

By rotating $\mathbb{R}^d$ (or choosing a coordinate frame) so that the objective function points downward, we can express any linear programming problem in the following geometric form: 

$$
\text{Find the lowest point in a given polyhedron.}
$$

With this geometry in hand, we can easily picture two pathological cases where a given linear programming problem has no solution. 

- The first possibility is that there are no feasible points; in this case the problem is called _**infeasible**_.
- The second possibility is that there are feasible points at which the objective function is arbitrarily large; in this case, we call the problem _**unbounded**_.

### 26.2 Example 1: Shortest Paths

### 26.3 Example 2: Maximum Flows and Minimum Cuts

### 26.4 Linear Programming Duality

The translation for LP problem $\Pi$ is simplest when the $\Pi$ is in canonical form:

![][LP-dual-1]

We can also write the dual linear program in exactly the same canonical form as the primal, by swapping the coefficient vector $ c $ and the objective vector $ b $, negating both vectors, and replacing the constraint matrix A with its negative transpose.

![][LP-dual-2]

_**The Fundamental Theorem of Linear Programming.**_ A linear program $\Pi$ has an optimal solution $x^{\star}$ if and only if the dual linear program $\amalg$ has an optimal solution $y^{\star}$ such that $ c x^{\star} = y^{\star} A x^{\star} = y^{\star} b $.

The weak form of this theorem is trivial to prove.

_**Weak Duality Theorem.**_ If $ x $ is a feasible solution for a canonical linear program $\Pi$ and $ y $ is a feasible solution for its dual $\amalg$, then $ c x = y A x = y b $.

It immediately follows that if $ c x = y b $, then $ x $ and $ y $ are optimal solutions to their respective linear programs. This is in fact a fairly common way to prove that we have the optimal value for a linear program.

### 26.5 Duality Example

### 26.6 Strong Duality  
 
The Fundamental Theorem can be rephrased in the following form: 

_**Strong Duality Theorem.**_ If $x^{\star}$ is an optimal solution for a canonical linear program $\Pi$, then there is an optimal solution $y^{\star}$ for its dual $\amalg$, such that $ c x^{\star} = y^{\star} A x^{\star} = y^{\star} b $.

证明略

### 26.7 Complementary Slackness

-----

## DAA - Chapter 3 - Rounding data and dynamic programming

Approximation algorithms can be designed using dynamic programming in a variety of ways, many of which involve rounding the input data in some way.

We can then show that by rounding the sizes of the large inputs so that, again, the number of distinct, large input values is polynomial in the input size and an error parameter, we can use dynamic programming to find an optimal solution on just the large inputs. Then this solution must be augmented to a solution for the whole input by dealing with the small inputs in some way.

## DAA - Chapter 4 - Deterministic rounding of linear programs

-----

## [Dealing with NP-hard Optimization Problems](https://resources.mpi-inf.mpg.de/departments/d1/teaching/ss11/OPT/lec23.pdf)

> An old engineering slogan says, “Fast. Cheap. Reliable. Choose two.”

Our goal so far in developing algorithms for optimization problems has been to find algorithms that

- $ (a) $ find the optimal solution;
- $ (b) $ run in polynomial time;
- $ (c) $ have property $ (a) $ and $ (b) $ for any input.

We have seen that we can indeed do this for optimization problems that can be formulated as a linear program. For problems that can be formulated as an integer linear program, we are not so lucky. In fact, unless P=NP, we cannot find algorithms that satisfy $ (a) $, $ (b) $ and $ (c) $ for a general integer linear program. Therefore, unless P=NP, we are going to have to focus on developing algorithms that have just two of the three properties (and do the best we can with respect to the other property).

In this lecture, we will illustrate these three approaches using vertex cover as an example.

_**Definition 1.**_ Given an undirected graph $G = (V, E)$, the _**Minimum Vertex Cover (MVC)**_ problem asks for a vertex cover of minimum size, i.e., a set of vertices $S \subseteq V$ of minimum size $\vert S \vert$ such that every edge $e \in E$ has at least one endpoint in $ S $.

The Minimum Vertex Cover problem is known to be NP-hard, so we don’t expect to find a polynomial time algorithm that finds the optimal solution for every possible input.

### 1. To drop requirement (c) $\Rightarrow$ Restricting Input (Structure)

If we drop requirement $ (c) $, and restrict our attention to certain classes of inputs, we can however have algorithms that solve the problem in polynomial time. 

E.g. to restrict the input to bipartite graphs for Minimum Vertex Cover problem.

### 2. To drop requirement (b) $\Rightarrow$ Fixed Parameter Tractability (FPT)

Suppose we drop the requirement that we satisfy property $ (b) $, and we just try to find a minimum vertex cover with a “good” but not polynomial time algorithm.

Suppose that the size of the MVC is a fixed constant $k$, say $k = 2$ or $k = 3$ for some inputs. For such inputs, it is not hard to find a MVC in polynomial time. 

- If we know the value $ k $, we just try all subsets of vertices of size $ k $, and check whether they are a vertex cover. 
- There are $ n \choose k $ subsets of vertices of size $ k $, and checking each subset takes $ O(m) $ time, where $ n = \vert V \vert, m = \vert E \vert $. 
- If we don’t know $ k $ in advance, we can find the MVC by checking whether there exists a vertex cover of size $l$ for $l = 0, l = 1, \dots , l = k$. 
- Therefore, if the minimum vertex cover has size $ k $, we can find it in time $ O \left ( {n \choose 0} + {n \choose 1} + \dots + {n \choose k} \right ) \cdot O(m) = O(kn^km) $.

This is polynomial for fixed k, so for some inputs, this gives a polynomial time algorithm. However, this algorithm is far from practical (according to Kleinberg-Tardos, it will take longer than the age of the universe for an input with $n = 1000, k = 10$). Can we do something smarter?

_**Observation 1.**_ If $ G $ has $ n $ vertices and a vertex cover of size $ k $, then $ G $ has at most $ k(n − 1) $ edges.

_**[Proof](http://web.cs.iastate.edu/~cs511/handout10/FPT_VC.pdf).**_ Each vertex can cover at most $ n − 1 $ edges, so $ k $ vertices can cover at most $ k(n − 1) $ edges. $\tag*{$\square$}$

_**Observation 2.**_ Let $ e = \lbrace u, v \rbrace $ be any edge in $ G $. If $ G $ has a vertex cover of size $ k $, then either $ G \setminus \lbrace u \rbrace $ or $ G \setminus \lbrace v \rbrace $ has a vertex cover of size $ k − 1 $.

These two observations give rise to a simple recursive algorithm for finding a vertex cover of size $ k $ if it exists:

- If G has no edges, return the empty set.
- If G has more than $ k(\vert V \vert − 1) $ edges, then no vertex cover of size $ k $ exists.
- Else, let $ e = \lbrace u, v \rbrace $ be an edge of $ G $.
	– Find a vertex cover of size $ k − 1 $ in $ G \setminus \lbrace u \rbrace $ and in $ G \setminus \lbrace v \rbrace $. 
	- If neither of those exists, then $ G $ has no vertex cover of size $ k $. 
	- Else, if $ T $ is a vertex cover of size $ k − 1 $ of $ G \setminus \lbrace u \rbrace $ (respectively, $ G \setminus \lbrace v \rbrace $), then return $ T \cup \lbrace u \rbrace $ (respectively, $ T \cup \lbrace v \rbrace $).

_**Theorem 1.**_ There exists an algorithm to check if a graph has a vertex cover of size $ k $ that runs in $ O(2^kn) $ time.

证明略

Note that this is pretty good: If $ k = O(\log n) $, then this is still a polynomial time algorithm. This is an example of a _**fixed parameter algorithm**_.

_**Definition 2.**_ A problem is _**fixed parameter tractable (FPT)**_ with respect to parameter $ k $ if there is an algorithm with running time at most $ f(k) n^{O(1)} $.

另参：[Vertex Cover is Fixed-Parameter Tractable](http://web.cs.iastate.edu/~cs511/handout10/FPT_VC.pdf)

### 3. To drop requirement (a) $\Rightarrow$ Approximation Algorithms

Another approach for dealing with NP-hardness is dropping the requirement $ (a) $ that the algorithm has to find the optimal solution. This is called a heuristic.

For the minimum vertex cover example, a reasonable heuristic seems to be the following:

- Repeat until $ E $ is empty
	- Pick a vertex $ v $ with highest degree,
	- Add $ v $ to $ S $, and remove $ v $ and its incident edges from $ G $.
	
Unfortunately, the solution returned by this heuristic can be pretty bad – there exists a family of examples for which the minimum vertex cover has size $ k! $ and the vertex cover found by the heuristic has size $ k! \log k $.

_**Definition 3.**_ For a minimization problem, an $ \alpha $-approximation algorithm is an algorithm that runs in polynomial time and is guaranteed to output a solution of cost at most $ \alpha $ times the value of the optimal solution.

_**One popular approach to developing approximation algorithms is to use linear programming**_. We will see two exemplar algorithms: 

- LP rounding
	1. Solve LP
	1. Then round to the ILP solution
- Primal-dual

#### 3.1 LP rounding

We can formulate the MVC problem as an integer linear program _**(ILP)**_ as follows. We slightly generalize the problem, and allow each vertex to have a nonnegative weight $ w_v \geq 0 $ that is part of the input. The problem in Definition 1 is then just the special case when $ w_v = 1 $ for all $ v \in V $.

For every vertex $ v \in V $ , we introduce a variable $ x_v \in \lbrace 0,1 \rbrace $. We think of $ x_v = 1 $ as representing that $ v \in S $. Then we want to minimize $ \sum_{v \in V} w_v x_v$, subject to the constraint that $ x_u + x_v \geq 1 $ for every $e = \lbrace u,v \rbrace \in E$. Let $OPT_{ILP}$ be the optimal value of this integer linear program (which is the same as the optimal value of the minimum vertex cover problem). 

If we relax this integer program, we get the following _**LP**_:

$$
\begin{align}
\text{min } & \sum_{v \in V} w_v x_v \newline
\text{s.t. } & x_u + x_v \geq 1 & \text{ for each } e = \lbrace u,v \rbrace \in E \newline
	& x_v \geq 0 & \text{ for } v \in V
\tag{$P_{VC}$}
\end{align}
$$

(Note that we don’t need to require that $ x_v \leq 1 $, because this will automatically be true for any optimal solution!)

_**Theorem 2.**_ There exists a $2$-approximation algorithm for the minimum vertex cover problem. 

_**Proof.**_ Let $ x^{\star} $ be an optimal solution to $P_{VC}$. Note that we can find $ x^{\star} $ in polynomial time. Also, now that $ \sum_{v \in V} w_v x_v^{\star} \leq OPT_{ILP} $, since the optimal integer solution gives a feasible solution to the _**LP**_ with objective value $OPT_{ILP}$. 

注意：

- $P_{VC}$ 是一个 LP 的问题
- $ x^{\star} $ 是$P_{VC}$ 的 optimal solution，即是 LP 的 optimal solution
- 但是 MVC 本身应该是一个 ILP 的问题
- 我们的目的是从 LP 的 solution 出发，rounding 到一个 ILP 的 solution
- 假设 MVC 的 ILP 的 optimal solution 是 $x'$，那么 $x'$ 一定是满足 $P_{VC}$ 的 LP 约束的，但不一定是 $P_{VC}$ 的最优解，所以 $ OPT_{ILP} = \sum_{v \in V} w_v {x_v}' \geq \sum_{v \in V} w_v x_v^{\star} = OPT_{LP} $

Now, we just round up the variables $ x^{\star} $ that are greater than or equal to $\frac{1}{2}$. Let $x^{\dagger}$ be this rounded solution. Then $x_u^{\dagger} + x_v^{\dagger} \geq 1$ for every $\lbrace u,v \rbrace \in E$, since at least one of $ x_u^{\star} $ and $ x_v^{\star} $ must be at least $\frac{1}{2}$, so $x^{\dagger}$ is a feasible solution to vertex cover problem ($x^{\dagger}$ 确定会是一个 vertex cover，$x^{\star}$ 不一定是因为它不是整数 0 或者 1 的话就没有实际意义；但是，我们也无法保证 $x^{\dagger}$ 是 minimum 的). Also $\sum_{v \in V} w_v x_v^{\dagger} \leq 2 \sum_{v \in V} w_v x_v^{\star} \leq 2 OPT_{ILP}$. $\tag*{$\square$}$

Although this LP rounding algorithm is nice and seems simple, in some sense it is not that simple: it needs us to solve the LP relaxation, and--although we can do this in polynomial time--it is not “easy”. However, our knowledge of linear programming can also help us develop a very simple and fast algorithm.

#### 3.2 Primal-dual algorithm

待续

-----

## Class

- 03/29/2016
	- Intro
	- Approx Alg
		- Example Problem: TSP / Metrix TSP
- 03/31/2016
	- Approx Alg
		- Continue with TSP / Metrix TSP
		- Shrink $\alpha < 2$
- 04/05/2016
	- PSS A
- 04/07/2016
	- Technique for Approx Alg (1): Linear Programming (LP)
		- Example Problem: Set Cover
		- Integer Linear Programming + Randomized Rounding
- 04/12/2016
	- Technique for Approx Alg (1): Linear Programming (LP)
		- Example Problem: Set Cover
		- Duality in Linear Programming / Dual Fitting
- 04/14/2016
	- Technique for Approx Alg (2): Semi-definite Programming (SDP)
		- Example Problem: Max Cut
		- Ellipsoid Method
- 04/19/2016
	- Technique for Approx Alg (2): Semi-definite Programming (SDP)
		- Continue with Max Cut
- 04/21/2016
	- Parameterized Complexity
		- Example Problem: Vertex Cover
		- Bounded Search Tree Method
		- Chorded Completion
- 04/26/2016
	- PSS B
- 04/28/2016
	- PSS B
- 05/03/2016
	- Fixed Parameter Tractability (FPT)
		- Example Problem: Vertex Cover
		- Kernelization Method
		- Crown Method
		
-----

## DAA - Chapter 5 - Random sampling and randomized rounding of linear programs

... Thus randomization gains us simplicity in our algorithm design and analysis, while derandomization ensures that the performance guarantee can be obtained deterministically.

### 5.1 Simple algorithms for MAX SAT and MAX CUT

In this section we will give a simple randomized $\frac{1}{2}$-approximation algorithm for each problem.

- MAX SAT
	- $n$ variables $x_1, \dots, x_n$
	- $m$ clauses $C_1, \dots, C_m$
		- In the form of $(x_p \vee \dots \vee x_q) \wedge (\dots)$
		- Every $x_i$ or $\overline{x_i}$ is a _**literal**_
			- $x_i$ is a positive literal
			- $\overline{x_i}$ is a negative literal
		- The number of literals in a clause is called its size or length.
			- The length of $C_j$ is $l_j$
		- Clauses of length 1 are sometimes called unit clauses
		- We assume that no literal is repeated in a clause and clauses are distinct
	- Nonnegative weight $w_j$ for each $C_j$
	- Objective: to find an assignment of TRUE/FALSE to the $x_i$s that maximizes the total weight of the satisfied clauses
		- A clause is satisfied if one of its $x_i$ is TRUE or $\overline{x_i}$ is FALSE
		
_**Theorem 5.1:**_ Setting each $ x_i $ to TRUE with probability $\frac{1}{2}$ independently gives a randomized $\frac{1}{2}$-approximation algorithm for the MAX CUT problem.

_**Proof.**_ Define a new random variable $ Y_j $ such that  

$$
\begin{align}
	Y_j = \left \lbrace
		\begin{matrix}
			& 1, & \text{if } C_j \text{ is satisfied} \newline
			& 0, & \text{otherwise}
		\end{matrix} 
	\right.
\end{align}
$$

Total weights of the satisfied clauses $ W = \sum_{j=1}^m w_j Y_j $. 

Then, by linearity of expectation and the definition of the expectation of a 0-1 random variable, 

$$
	E[W] = \sum_{j=1}^{m} w_j E[Y_i] = \sum_{j=1}^{m} w_j \operatorname{Pr}[C_j \text{ is satisfied}] 
$$

Because $l_j \geq 1$, 

$$
	\operatorname{Pr}[C_j \text{ is satisfied}] = 1 - \left ( \frac{1}{2} \right )^{l_j} \geq \frac{1}{2}
$$

Hence, 

$$
	E[W] = \sum_{j=1}^{m} w_j \cdot \frac{1}{2} = \frac{1}{2} \sum_{j=1}^{m} w_j \geq \frac{1}{2} OPT
$$

$\tag*{$\square$}$

Observe that if $ l_j \geq k $ for each clause $ C_j $, then the analysis above shows that the algorithm is a $\big ( 1 - \left ( \frac{1}{2} \right )^k \big )$-approximation algorithm for such instances.

- MAX CUT
	- Undirected graph $G=(V,E)$
	- Nonnegative weight $w_{ij}$ for each edge $(i,j) \in E$
	- Cut $V$ into two partitions, $U$ and $W$
		- An edge across $U$ and $W$ is said to be "in the cut"
	- Objective: to find a cut to maximize the total weight of edges in the cut
	
_**Theorem 5.3:**_ If we place each vertex $v$ into $U$ independently with probability $\frac{1}{2}$, then we obtain a randomized $\frac{1}{2}$-approximation algorithm for the MAX CUT problem.

_**Proof.**_ Define a new random variable $ X_{ij} $ such that 

$$
\begin{align}
	X_{ij} = \left \lbrace
		\begin{matrix}
			& 1, & \text{if edge } C_j (i,j) \text{ is in the cut} \newline
			& 0, & \text{otherwise}
		\end{matrix} 
	\right.
\end{align}
$$

Total weights of the edges in the cut $ Z = \sum_{(i,j) \in E} w_{ij} X_{ij} $. 

Then, by linearity of expectation and the definition of the expectation of a 0-1 random variable, 

$$
	E[Z] = \sum_{(i,j) \in E} w_{ij} E[X_{ij}] = \sum_{(i,j) \in E} w_{ij} \operatorname{Pr}[\text{edge } (i,j) \text{ is in the cut}] 
$$

In this case, the probability that a specific edge $(i,j)$ is in the cut is easy to calculate: since the two endpoints are placed in the sets independently, they are in different sets with probability equal to $\frac{1}{2}$. Hence,

$$
	E[Z] = \sum_{(i,j) \in E} w_{ij} \cdot \frac{1}{2} = \frac{1}{2} \sum_{(i,j) \in E} w_{ij} \geq \frac{1}{2} OPT
$$

$\tag*{$\square$}$

### 5.2 Derandomization

To derandomize a randomized algorithm means to obtain a deterministic algorithm whose solution value is as good as the expected value of the randomized algorithm.

Assume for the moment that we will make the choice of $x_1$ deterministically, and all other variables will be set true with probability $\frac{1}{2}$ as before.

略

It is sometimes called the method of conditional expectations, due to its use of conditional expectations.

略

### 5.3 Flipping biased coins

We will show here that biasing the probability with which we set $x_i$ is actually helpful; that is, we will set $x_i$ true with some probability not equal to $\frac{1}{2}$. To do this, it is easiest to start by considering only MAX SAT instances with no unit clauses $\overline{x_i}$, that is, no negated unit clauses. We will later show that we can remove this assumption.

_**Lemma 5.4:**_ If each $x_i$ is set to true with probability $ p > \frac{1}{2} $ independently, then the probability that any given clause is satisfied is at least $ \min(p, 1−p^2) $ for MAX SAT instances with no negated unit clauses.

证明略

We can obtain the best performance guarantee by setting $ p = 1 − p^2 $. This yields $ p = \frac{1}{2} (\sqrt{5} − 1) \approx .618 $

略

### 5.4 Randomized rounding

The algorithm of the previous section shows that biasing the probability with which we set $x_i$ true yields an improved approximation algorithm. However, we gave each variable the same bias. In this section, we show that we can do still better by giving each variable its own bias. We do this by returning to the idea of randomized rounding.

we will create an integer program with a 0-1 variable $ y_i $ for each boolean variable $x_i$ such that $ y_i = 1 $ corresponds to $ x_i $ set true.

The integer program is relaxed to a linear program by replacing the constraints $ y_i \in \lbrace 0, 1 \rbrace $ with $ 0 \leq y_i \leq 1 $, and the linear programming relaxation is solved in polynomial time.

The central idea of randomized rounding is that the fractional value $ y_i^{\ast} $ is interpreted as the probability that $ y_i $ should be set to 1. In this case, we set each $ x_i $ to true with probability $ y_i^{\ast} $ independently.

We introduce a variable $ z_j $ for each clause $ C_j $ such that

$$
\begin{align}
	z_j = \left \lbrace
		\begin{matrix}
			& 1, & \text{if } C_j \text{ is satisfied} \newline
			& 0, & \text{otherwise}
		\end{matrix} 
	\right.
\end{align}
$$

For each clause $C_j$ let $P_j$ be the indices of the variables $x_i$ that occur positively in the clause, and let $N_j$ be the indices of the variables $x_i$ that are negated in the clause. We denote the clause $C_j$ by

$$
\bigvee_{i \in P_j} x_i \vee \bigvee_{i \in N_j} \overline{x_i}
$$

换句话说就是这样的：

- If $i \in P_j$, then positive literal $x_i$ is in $C_j$
- If $i \in N_j$, then negative literal $\overline{x_i}$ is in $C_j$

Then the inequality $\sum_{i \in P_j} y_i + \sum_{i \in N_j} (1-y_i) \geq z_j$ must hold for clause $C_j$.

- $\sum_{i \in P_j} y_i$ 即 $C_j$ 中 positive literal $x_i$ 取 TRUE 的个数
- $\sum_{i \in N_j} (1-y_i)$ 即 $C_j$ 中 negative literal $\overline{x_i}$ 取 FALSE 的个数

This inequality yields the following integer programming formulation of the MAX SAT problem:

$$
\begin{align}
\text{max } & \sum_{j=1}^m w_j z_j \newline
\text{s.t. } & \sum_{i \in P_j} y_i + \sum_{i \in N_j} (1-y_i) \geq z_j, & \forall C_j = \bigvee_{i \in P_j} x_i \vee \bigvee_{i \in N_j} \overline{x_i} \newline
	& y_i \in \lbrace 0, 1 \rbrace, & i = 1,\dots,n, \newline
	& z_j \in \lbrace 0, 1 \rbrace, & j = 1,\dots,m.
\end{align}
$$

If $ Z_{IP}^{\ast} $ is the optimal value of this integer program, then it is not hard to see that $ Z_{IP}^{\ast} = OPT $.

The corresponding linear programming relaxation of this integer program is

$$
\begin{align}
\text{max } & \sum_{j=1}^m w_j z_j \newline
\text{s.t. } & \sum_{i \in P_j} y_i + \sum_{i \in N_j} (1-y_i) \geq z_j, & \forall C_j = \bigvee_{i \in P_j} x_i \vee \bigvee_{i \in N_j} \overline{x_i} \newline
	& 0 \leq y_i \leq 1, & i = 1,\dots,n, \newline
	& 0 \leq z_j \leq 1, & j = 1,\dots,m.
\end{align}
$$

If $ Z_{LP}^{\ast} $ is the optimal value of this integer program, then clarly $ Z_{LP}^{\ast} \geq Z_{IP}^{\ast} = OPT $.

待续

### 5.5 Choosing the better of two solutions

待续

### 5.6 Non-linear randomized rounding

In the case of the MAX SAT problem, we set $x_i$ to true with probability $ y_i^{\ast} $ . There is no reason, however, that we cannot use some function $ f:[0,1] \rightarrow [0,1] $ to set $x_i$ to true with probability $ f(y_i^{\ast}) $. Sometimes this yields approximation algorithms with better performance guarantees than using the identity function, as we will see in this section.

待续

## DAA - Chapter 6 - Randomized rounding of semidefinite programs

So far we have used linear programming relaxations to design and analyze various approximation algorithms. In this section, we show how nonlinear programming relaxations can give us better algorithms than we know how to obtain via linear programming; in particular we use _**a type of nonlinear program called a semidefinite program**_. Part of the power of semidefinite programming is that _**semidefinite programs can be solved in polynomial time**_.

### 6.1 A brief introduction to semidefinite programming

Semidefinite programming uses symmetric, positive semidefinite matrices.

In what follows, vectors $ v \in \mathfrak{R}^n $ are assumed to be column vectors, so that $ v^T v $ is the inner product of $ v $ with itself, while $ vv^T $ is an $ n $ by $ n $ matrix.

_**Definition 6.1:**_ A matrix $ X \in \mathfrak{R}^{n \times n} $ is positive semidefinite $ \iff \forall y \in \mathfrak{R}^n, y^TXy \geq 0 $.