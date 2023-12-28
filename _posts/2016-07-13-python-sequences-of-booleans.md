---
category: Python
description: ''
tags:
- pandas
- numpy
title: 'Python: sequences of booleans'
---

R 里面常见的一个用法是 `dataframe[boolSeq, "foo"]`，pandas 里也是一样:

```python
> import pandas
> import numpy

> df = pandas.DataFrame([[1, 2], [3, 4], [5,6], [7,8]], columns=list('AB'))
> df
   A  B
0  1  2
1  3  4
2  5  6
3  7  8

> blist = [True, False, True, False]
> barray = numpy.array([True, False, True, False])
> bSeries = (df.loc[:, "A"] > 2)

> df.loc[blist, :]
   A  B
0  1  2
2  5  6
> df.loc[barray, :]
   A  B
0  1  2
2  5  6
> bdf.loc[bSeries, :] 
   A  B
1  3  4
2  5  6
3  7  8

```

注意 `list("AB") == ["A", "B"]`。

list of booleans 有两个问题：

1. 不好取反
    - 用 `~blist` 语法错误
    - 而 `not blist` 的值其实是 `blist is empty`
        - `not blist == False` $\Rightarrow$ `blist is empty == False`
        - `not blist == True` $\Rightarrow$ `blist is empty == True`
        - 因为 “非空的 list 会 evaluate 为 True”
    - 你得用 `numpy.logical_not(blist)` 或者 `[not x for x in blist]`
        - 都很麻烦不是？
2. 两个 list of booleans 不好做 AND 或者 OR 操作
    - 你硬是要 `[x and y for x,y in zip(blist1, blist2)]` 的话我也不拦你……

```python
> blist = [True, False, True, False]

> ~blist
TypeError: bad operand type for unary ~: 'list'

> not blist
False

> numpy.logical_not(blist)
array([False,  True, False,  True], dtype=bool)

> [not x for x in blist]
[False, True, False, True]
```

用 array of booleans 或者 Series of booleans 就浑身舒爽：

```python
> ~barray
array([False,  True, False,  True], dtype=bool)

> numpy.array([True, False]) & numpy.array([True, True])
array([ True, False], dtype=bool)
> numpy.array([True, False]) | numpy.array([True, True])
array([ True,  True], dtype=bool)

> ~bSeries
0     True
1    False
2    False
3    False
Name: A, dtype: bool

> pandas.Series([True, False]) & pandas.Series([True, True])
0     True
1    False
dtype: bool
> pandas.Series([True, False]) | pandas.Series([True, True])
0    True
1    True
dtype: bool
```

注意取 AND 必须得用 `&`：

- `&&` 是语法错误
- `and` 是 `ValueError`: The truth value of an array with more than one element / Series is ambiguous.

取 OR 同理。

另外 Series of booleans 可以用 `Series.values` 无缝切换到 array of booleans:

```python
> df["A"] > 2
0    False
1     True
2     True
3     True
Name: A, dtype: bool

> (df["A"] > 2).values
array([False,  True,  True,  True], dtype=bool)
```