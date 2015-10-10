---
layout: post-mathjax
title: "Alg: Recursion"
description: ""
category: Algorithm
tags: [Algorithm-101]
---
{% include JB/setup %}

Digest of [Jeff Erickson](http://web.engr.illinois.edu/~jeffe/)'s [lecture notes](http://web.engr.illinois.edu/~jeffe/teaching/algorithms/) on [Recursion](http://web.engr.illinois.edu/~jeffe/teaching/algorithms/all-recursion.pdf).

-----

## 1. Recursion

### 1.1 Reductions

Reducing one problem _X_ to another problem _Y_ means to write an algorithm for _X_ that uses an algorithm for _Y_ as a _**black box**_ or _**subroutine**_.

Crucially, the correctness of the resulting algorithm cannot depend in any way on how the algorithm for _Y_ works. The only thing we can assume is that the black box solves _Y_ correctly.

### 1.2 Simplify and Delegate

Recursion is a particularly powerful kind of reduction, which can be described loosely as follows:

- If the given instance of the problem is small or simple enough, just solve it.
- Otherwise, reduce the problem to one or more simpler instances of the same problem.

It’s helpful to imagine that someone else is going to solve the simpler problems. I like to call that someone else the Recursion Fairy, which will magically take care of all the simpler subproblems for you. Mathematically sophisticated readers might recognize the Recursion Fairy by its more formal name, the _**Induction Hypothesis**_.

There is one mild technical condition that must be satisfied in order for any recursive method to work correctly: There must be no infinite sequence of reductions to ‘simpler’ and ‘simpler’ subproblems. Eventually, the recursive reductions must stop with an elementary _**base case**_ that can be solved by some other method; otherwise, the recursive algorithm will loop forever.

简单总结下：

- Base Case：规约到最后，剩下的最简单最直接的情况
- Induction Hypothesis：If problem \\( A \\) is reduced to \\( A1 \cup A2 \\), Induction Hypothesis states that the \\( A1 \\) and \\( A2 \\) are solvable or the solutions to them are correct.
	- 通过数学归纳法（Mathematical Induction, MI），我们的 Induction Hypothesis 可以一直写到 Base Case 上，to which the solution is OBVIOUS.
	
### 1.3 Tower of Hanoi

<pre class="prettyprint linenums">
# Move a stack of n disks 
# from a source peg (src) 
# to a destination peg (dst) 
# using a third temporary peg (tmp) as a placeholder.
Hanoi(n, src, dst, tmp):
	if n &gt; 0
		Hanoi(n - 1, src, tmp, dst)
		move disk n from src to dst
		Hanoi(n - 1, tmp, dst, src)
</pre>

- \\( T(0) = 0 \\)
- \\( T(n) = 2T(n-1)+1 \\) for any \\( n \geq 1 \\)
- thus, \\( T(n) = 2\^n-1 \\)

### 1.4 Mergesort

<pre class="prettyprint linenums">
MergeSort(A[1 .. n]):
	if n &gt; 1
		m &lt;- Floor(n / 2)
		MergeSort(A[1 ... m])
		MergeSort(A[m+1 ... n])
		Merge(A[1 ... n], m)

# A[1 ... m] and A[m+1 ... n] are sorted per se
# merge them into B then override A
Merge(A[1 ... n], m):
	i &lt;- 1
	j &lt;- m + 1
	
	for k &lt;- 1 to n
		if j &gt; n 			# all elements in A[m+1 ... n] are already merged
			B[k] &lt;- A[i]
			i &lt;- i + 1
		else if i &gt; m		# all elements in A[1 ... m] are already merged
			B[k] &lt;- A[j]
			j &lt;- j + 1
		else if A[i] &lt; A[j]	# A[i] in A[1 ... m] is smaller
			B[k] &lt;- A[i]
			i &lt;- i + 1
		else
			B[k] &lt;- A[j]		# A[j] in A[m+1 ... n] is smaller
			j &lt;- j + 1
	
	for k &lt;- 1 to n			# override A with B
		A[k] &lt;- B[k]
</pre>

Now we prove MergeSort correct by induction; there are two cases to consider.

– If \\( n \leq 1 \\), the algorithm _**correctly does nothing**_.
– Otherwise, the Recursion Fairy correctly sorts—sorry, I mean the induction hypothesis implies that our algorithm correctly sorts—the two smaller subarrays `A[1 ... m]` and `A[m+1 ... n]`, after which they are correctly Merged into a single sorted array (Merge 的证明省略).

$$
	T(n) = \left \\{ 
	\begin{matrix}
		& 1 & \text{if n=1,} \\\\
		& 2T(\frac{n}{2})+n & \text{otherwise.}
	\end{matrix} 
	\right.
$$

递推（recurrence）可得：\\( T(n) = 2\^kT(\frac{n}{2\^k}) + kn \\) for any postive integer \\( k \\).

When \\( k = \log\_2n \\):

$$
	T(n) = nT(1) + n\log\_2n = n + n\log\_2n = O(n\log\_2n)
$$

### 1.5 Quicksort

1. Choose a _pivot_ element from the array.
	- pivot: [ˈpɪvət], A thing on which something turns; specifically a metal pointed pin or short shaft in machinery.
2. Partition the array into three subarrays containing the elements smaller than the pivot, the pivot element itself, and the elements larger than the pivot.
3. Recursively quicksort the first and last subarray.

<pre class="prettyprint linenums">
QuickSort(A[1 .. n]):
	if (n > 1)
		Choose a pivot element A[p]
		r <- Partition(A, p)
		QuickSort(A[1 ... r - 1])
		QuickSort(A[r + 1 ... n])
		
Partition(A[1 .. n], p):
	# 把 A[p] 放到 array 末尾
	# A[p] 不会被下面的 for 循环操作到
	swap A[p] <-> A[n]
	
	i <- 0
	j <- n
	while (i < j)
		# 类似于 do-while：i 起始为 1，j 起始为 n-1
		# 位于 n 位的 A[p] 在静静地看着你们 swap
		repeat i <- i + 1 until (i >= j or A[i] >= A[n])
		repeat j <- j - 1 until (i >= j or A[j] <= A[n])
		if (i < j)
			# 此时一般有 A[i] >= A[n] & A[j] <= A[n]
			swap A[i] <-> A[j]
	
	# 再把 n 位的 A[p] swap 回来
	swap A[i] <-> [n]
	return i
</pre>

`Partition` runs in \\( O(n) \\) time: \\( j - i = n \\) at the beginning (of the while loop), \\( j - i = 0 \\) at the end (of the while loop), and we do a constant amount of work each time we increment i or decrement j. 

For `QuickSort`, we get a recurrence that depends on \\( r = \\), the rank of the chosen pivot element:

$$
	T(n) = T(r - 1) + T(n - r) + O(n) \leq \max\_{1 \leq r \leq n}(T(r - 1) + T(n - r) + O(n))
$$

If we could somehow choose the pivot to be the median element of the array `A`, we would have \\( r = \left \lfloor{\frac{n}{2}}\right \rfloor \\), the two subproblems would be as close to the same size as possible, the recurrence would become

$$
	T(n) = T(\left \lceil{\frac{n}{2}}\right \rceil - 1) + T(\left \lfloor{\frac{n}{2}}\right \rfloor) + O(n) \leq 2T(\frac{n}{2}) + O(n)
$$

and we’d have \\( T(n) = O(n\log\_n) \\) by the recursion tree method.

In the worst case, the two subproblems are completely unbalanced—either \\( r = 1 \\) or \\( r = n \\)—and the recurrence becomes \\( T(n) \leq T(n - 1) + O(n) \\). The solution is \\( T(n) = O(n\^2) \\).

### 1.7 Median Selection

So how do we find the median element of an array in linear time? The following algorithm, `Mom5Select`, was discovered by Manuel Blum, Bob Floyd, Vaughan Pratt, Ron Rivest, and Bob Tarjan in the early 1970s. `Mom5Select` actually solves the more general problem of selecting the \\( k\^{th} \\) largest element in an \\( n \\)-element array, using a variant of an algorithm called either `QuickSelect` or `one-armed quicksort`. 

- `Mom` in `Mom5Select` stands for "Median of Medians" 

#### 1.7.1 QuickSelect

The basic `QuickSelect` algorithm chooses a pivot element, partitions the array using the `Partition` subroutine from `QuickSort`, and then recursively searches only one of the two subarrays.

<pre class="prettyprint linenums">
QuickSelect(A[1 ... n], k):
	if n = 1
		return A[1]
	else
		Choose a pivot element A[p]
		r <- Partition(A[1 ... n], p)
		if k < r
			return QuickSelect(A[1 ... r - 1], k)
		else if k > r
			return QuickSelect(A[r + 1 ... n], k - r) # 在这部分要选 (k-r)<sup>th</sup> 大的元素
		else
			return A[r]
</pre>

The worst-case running time of `QuickSelect` obeys a recurrence similar to the `QuickSort` recurrence.

$$
	T(n) \leq \max\_{1 \leq r \leq n} \left ( \max \left \\{ T(r - 1) , T(n - r) \right \\} + O(n) \right )
$$

We can simplify the recurrence by using \\( \ell \\) to denote the length of the recursive subproblem:

$$
	T(n) \leq \max\_{1 \leq \ell \leq n-1} T(\ell) + O(n) \leq T(n-1) + O(n)
$$

As with `QuickSort`, we get the solution \\( T(n) = O(n\^2) \\) when \\( \ell = n - 1 \\), which happens when the chosen pivot element is either the smallest element or largest element of the array.

On the other hand, we could avoid this quadratic behavior if we could somehow magically choose a good pivot, where \\( \ell \leq \alpha n \\) for some constant \\( \alpha < 1 \\). In this case, the recurrence would simplify to

$$
	T(n) \leq T(\alpha n) + O(n)
$$

This recurrence expands into a descending geometric series, which is dominated by its largest term, so \\( T(n) = O(n) \\).

#### 1.7.2 Mom5Select

The Blum-Floyd-Pratt-Rivest-Tarjan algorithm chooses a good pivot for `QuickSort` by recursively computing the median of a carefully-selected subset of the input array.

<pre class="prettyprint linenums">
Mom5Select(A[1 ... n], k):
	if n <= 25
		use brute force
	else
		m <- ceiling(n/5)
		for i <- 1 to m
			M[i] <- MedianOfFive(A[5i - 4 ... 5i])
		mom <- Mom5Select(M[1 ... m], floor(m/2))
		
		# now mom is the pivot element.
		# copy QuickSelect's logic here.
		
		r <- Partition(A[1 ... n], mom)
		if k < r
			return Mom5Select(A[1 ... r - 1], k) 
		else if k > r
			return Mom5Select(A[r + 1 ... n], k - r) 
		else
			return mom
</pre>

There’s absolutely nothing special about the constant 25 in the pseudocode.

- 虽然这个算法是 linear time algorithm，但是 \\( T(n) = \alpha n \\) 的系数 \\( \alpha \\) 有点大。当 \\( n \\) 很小时，可能会有 \\( \alpha n > n\^2 \\)，不如直接用 `QuickSelect` 划算
- 所以这一步是实现时的优化，和算法的思想没有太大关系

We divide the input into \\( \left \lceil{\frac{n}{5}}\right \rceil \\) blocks, each containing exactly 5 elements, except possibly the last. (If the last block isn’t full, just throw in a few \\( \infty \\)s.) We find the median of each block by brute force and collect those medians into a new array \\( M[1 ... \left \lceil{\frac{n}{5}}\right \rceil] \\). Then we recursively compute the median of this new array. Finally we use the median of medians — hence `mom` — as the pivot in one-armed quicksort.

The key insight is that neither of these two subarrays can be too large. The `mom` is larger than \\( \frac{\left \lceil{\frac{n}{5}}\right \rceil}{2} - 1 \approx \frac{n}{10} \\) block medians, and each of those medians is larger than two other elements in its block. Thus, `mom` is larger than at least \\( \frac{3n}{10} \\) elements in the input array, and symmetrically, `mom` is smaller than at least \\( \frac{3n}{10} \\) input elements. Thus, in the worst case, the final recursive call searches an array of size \\( \frac{7n}{10} \\).

For purposes of illustration, imagine that we sort every column from top down, and then we sort the columns by their middle element. (Let me emphasize that the algorithm does not actually do this!) In this arrangement, the median-of-medians is the element closest to the center of the grid.

![](https://bn1304files.storage.live.com/y3psWlMZUyUSJyjU3vGJ-9CuYcdhe7wdeM2r-cUW3dwqSctUdLvAOVk1VwVNm-76w9oC0zbur089bHEeBQm31aeAVwLdzUx8t93VX-OiJ5px5JG7EQbLujVuaOGpcsS8BoN/Mom.PNG?psid=1&width=417&height=155&cropMode=center)

We conclude that the worst-case running time of the algorithm obeys the following recurrence:

$$
	T(n) \le O(n) + T(\frac{n}{5}) + T(\frac{7n}{10})
$$

The recursion tree method implies the solution \\( T(n) = O(n) \\).

Finer analysis reveals that the constant hidden by the \\( O(n) \\) is quite large, even if we _**count only comparisons**_; this is not a practical algorithm for small inputs. 

_**Selecting the median of 5 elements requires at most 6 comparisons**_, so we need at most \\( \frac{6n}{5} \\) comparisons to set up the recursive subproblem. We need another \\( n-1 \\) comparisons to partition the array after the recursive call returns. So a more accurate recurrence for the total number of comparisons is

$$
	T(n) \le \frac{11n}{5} + T(\frac{n}{5}) + T(\frac{7n}{10}) = \frac{11n}{5} \sum\_{i \ge 0}{(\frac{9}{10})\^i} = \frac{11n}{5} \times 10 = 22n
$$

-> ~~~~~ P.S. 开始 ~~~~~ <-

参考 [Wikipedia - Geometric series](https://en.wikipedia.org/wiki/Geometric_series) 

$$
	a + ar + a r\^2 + a r\^3 + \cdots + a r\^{n-1} = \sum\_{k=0}\^{n-1} ar\^k= a \, \frac{1-r\^{n}}{1-r}
$$

令 \\( a=1, r=\frac{9}{10} \\) 可得 \\( \sum\_{i \ge 0}{(\frac{9}{10})\^i} = 10 \\)

-> ~~~~~ P.S. 结束 ~~~~~ <-

-> ~~~~~ P.S. 开始 ~~~~~ <-

参考 [stackoverflow - Code to calculate “median of five” in C#](http://stackoverflow.com/questions/480960/code-to-calculate-median-of-five-in-c-sharp) 

<pre class="prettyprint linenums">
private static void Swap(ref double a, ref double b) {
    double t = a;
    a = b;
    b = t;
}

private static void Sort(ref double a, ref double b) {
    if (a > b) {
        double t = a;
        a = b;
        b = t;
    }
}

private static double MedianOfFive(double a, double b, double c, double d, double e){
    // makes a < b and c < d
    Sort(ref a, ref b);
    Sort(ref c, ref d);

    // eleminate the lowest
    if (c < a) {
        Swap(ref b, ref d);
        c = a;
    }

    // gets e in
    a = e;

    // makes a < b
    Sort(ref a, ref b);

    // eliminate another lowest
    // remaing: a,b,d
    if (a < c) {
        Swap(ref b, ref d);
        a = c;
    }

    return Math.Min(d, a);
}
</pre>

一共有三次调用 `Sort`，一次 `if (c < a)`，一次 `if (a < c)`，最后还有一个 `Math.Min(d, a)`，所以是 6 次 comparisons

-> ~~~~~ P.S. 结束 ~~~~~ <-