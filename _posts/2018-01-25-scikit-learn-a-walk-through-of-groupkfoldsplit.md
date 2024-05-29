---
category: sklearn
description: ''
tags:
- cross-validation
- np.unique
title: 'scikit-learn: A walk through of <i>GroupKFold.split()</i>'
---

Suppose $X[\text{"groups"}] = \begin{bmatrix} a \newline b \newline b \newline c \newline c \newline c \end{bmatrix}$ and `n_splits=3`.

Then `GroupKFold.split(X, y, X["groups"])` will run into the [`_iter_test_indices`](https://github.com/scikit-learn/scikit-learn/blob/a24c8b46/sklearn/model_selection/_split.py#L487) method which simply yields the indices of the test folds.

```python
# Parameter groups == X["groups"]
unique_groups, groups = np.unique(groups, return_inverse=True)
```

$$
\begin{align}
unique\_groups &= \begin{bmatrix} a \\ b \\ c \end{bmatrix} \newline
groups &= \begin{bmatrix} 0 \\ 1 \\ 1 \\ 2 \\ 2 \\ 2 \end{bmatrix}
\end{align}
$$

So this `groups` is an interesting index: if `X["groups"]` has $n$ unique values, `groups` could assign $n$ markers to the original `X["groups"]`. E.g.

```python
markers = np.array(['△', '○', '□'])
markers[[0, 1, 1, 2, 2, 2]] == array(['△', '○', '○', '□', '□', '□'], dtype='<U1')
```

$$
markers[groups] = \begin{bmatrix} △ \rightarrow a \\ ○ \rightarrow b \\ ○ \rightarrow b \\ □ \rightarrow c \\ □ \rightarrow c \\ □ \rightarrow c \end{bmatrix} \\
$$

And especially, `unique_groups[groups] == X["groups"]`.

```python
n_groups = len(unique_groups)  # 3
 
# Weight groups by their number of occurrences
n_samples_per_group = np.bincount(groups)
```

$$
n\_samples\_per\_group = \begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix}
$$

```python
# Distribute the most frequent groups first
indices = np.argsort(n_samples_per_group)[::-1]
n_samples_per_group = n_samples_per_group[indices]
```

$$
\begin{align}
indices &= \begin{bmatrix} 2 \\ 1 \\ 0 \end{bmatrix} \newline
n\_samples\_per\_group &= \begin{bmatrix} 3 \\ 2 \\ 1 \end{bmatrix} 
\end{align}
$$

```python
# Total weight of each fold
n_samples_per_fold = np.zeros(self.n_splits)  # [0, 0, 0]

# Mapping from group index to fold index
group_to_fold = np.zeros(len(unique_groups))  # [0, 0, 0]

# Distribute samples by adding the largest weight to the lightest fold
for group_index, weight in enumerate(n_samples_per_group):
    lightest_fold = np.argmin(n_samples_per_fold)
    n_samples_per_fold[lightest_fold] += weight
    group_to_fold[indices[group_index]] = lightest_fold
```

- `group_index = 0`； `weight = 3`
	- `lightest_fold = 0`
	- `n_samples_per_fold[0] = 3`
	- `group_to_fold[2] = 0`
- `group_index = 1`; `weight = 2`
	- `lightest_fold = 1`
	- `n_samples_per_fold[1] = 2`
	- `group_to_fold[1] = 1`
- `group_index = 2`; `weight = 1`
	- `lightest_fold = 2`
	- `n_samples_per_fold[2] = 1`
	- `group_to_fold[0] = 2`

$$
group\_to\_fold = \begin{bmatrix} 2 \\ 1 \\ 0 \end{bmatrix}
$$

```python
indices = group_to_fold[groups]
```

Key step! `group_to_fold` is actually a marker triple here.

$$
indices = group\_to\_fold[groups] = \begin{bmatrix} 2 \rightarrow a \\ 1 \rightarrow b \\ 1 \rightarrow b \\ 0 \rightarrow c \\ 0 \rightarrow c \\ 0 \rightarrow c \end{bmatrix} \\
$$

```python
for f in range(self.n_splits):
    yield np.where(indices == f)[0]  # note that `np.where` here return a one-elemented tuple
```

- The 1st split: `f = 0`, `yield np.array([3, 4, 5])`
- The 2nd split: `f = 1`, `yield np.array([1, 2])`
- The 3rd split: `f = 2`, `yield np.array([0])`

```python
# This is an abstract class， `_iter_test_indices` being the abstract method
class BaseCrossValidator(with_metaclass(ABCMeta)):
    def split(self, X, y=None, groups=None):
        X, y, groups = indexable(X, y, groups)
        indices = np.arange(_num_samples(X))  # array([0, 1, 2, 3, 4, 5]) here
        for test_index in self._iter_test_masks(X, y, groups):
            train_index = indices[np.logical_not(test_index)]
            test_index = indices[test_index]
            yield train_index, test_index

    def _iter_test_masks(self, X=None, y=None, groups=None):
        """Generates boolean masks corresponding to test sets.
        By default, delegates to _iter_test_indices(X, y, groups)
        """
        for test_index in self._iter_test_indices(X, y, groups):
            test_mask = np.zeros(_num_samples(X), dtype=np.bool)
            test_mask[test_index] = True
            yield test_mask

    def _iter_test_indices(self, X=None, y=None, groups=None):
        """Generates integer indices corresponding to test sets."""
        raise NotImplementedError
```

- The 1st split:
    - `test_mask == np.array([False, False, False, True, True, True])`
    - `train_index == np.array([0, 1, 2])`
    - `test_index == np.array([3, 4, 5])`
- The 2nd split:
    - `test_mask == np.array([False, True, True, False, False, False])`
    - `train_index == np.array([0, 3, 4, 5])`
    - `test_index == np.array([1, 2])`
- The 3rd split: 
    - `test_mask == np.array([True, False, False, False, False, False])`
    - `train_index == np.array([1, 2, 3, 4, 5])`
    - `test_index == np.array([0])`

P.S. Note that, given its input, `GroupKFold`'s output is fixed. No random seed is needed.