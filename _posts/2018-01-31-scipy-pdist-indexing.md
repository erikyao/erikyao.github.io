---
category: scipy
description: ''
tags:
- pdist
- dense-matrix
title: 'scipy: pdist indexing'
---

`scipy.spatial.distance.pdist(X)` gives the pair-wise distances of `X`, $\operatorname{dist}(X[i], X[i])$ not included. The distances are stored in a dense matrix `D`. 

Question: how to get $\operatorname{dist}(X[i], X[j])$ without expanding this dense matrix by `scipy.spatial.distance.squareform(D)`?

A good answer from [How does condensed distance matrix work? (pdist)](https://stackoverflow.com/questions/13079563/how-does-condensed-distance-matrix-work-pdist):

```python
def square_to_condensed(i, j, n):
    assert i != j, "no diagonal elements in condensed matrix"
    if i < j:
        i, j = j, i
    return n*j - j*(j+1)/2 + i - 1 - j
```

Take $n$ == `X.shape[0]` == $4$ as an example. In the code, $i$ and $j$ are swapped if $i < j$, so only consider the bottom triangular region, i.e. $i > j$ always holds in the discussion below.

| i\j |   0  |   1  |   2  |   3  |
|:---:|:----:|:----:|:----:|:----:|
|  0  |   -  | D[0] | D[1] | D[2] |
|  1  | D[0] |   -  | D[3] | D[4] |
|  2  | D[1] | D[3] |   -  | D[5] |
|  3  | D[2] | D[4] | D[5] |   -  |

Suppose the indexing function is $\operatorname{f}$: $\operatorname{f}(i, j) = k$ when $\operatorname{dist}(X[i], X[j]) = D[k]$

`len(D)` = ${n \choose 2} = (n-1) + (n-2) + \dots + 1$. 

- When $j = 0$, $\operatorname{f}(i, j) = i - j - 1$
- When $j = 1$, $\operatorname{f}(i, j) = (n-1) + (i - j - 1)$
- When $j = 2$, $\operatorname{f}(i, j) = (n-1) + (n-2) + (i - j - 1)$

So the pattern here is:

$$
\operatorname{f}(i, j) = \text{indices used in previous } (j-1) \text{ columns} + \text{starting index in } j^{\text{th}} \text{ column} 
$$

Further more:

$$
\operatorname{f}(i, j) = {n \choose 2} - {n-j \choose 2} + (i - j - 1) = nj - \frac{j(j+1)}{2} + i - j - 1
$$