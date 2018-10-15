---
layout: post
title: "Pandas: How to check if two DataFrames are equal"
description: ""
category: Pandas
tags: []
---
{% include JB/setup %}

Suppose those 2 DataFrames has identical column names.

```python
import pandas as pd

df_a = pd.read_csv("df_a.tsv", sep="\t")
df_a = df_a.set_index("xxx").sort_index()

df_b = pd.read_csv("df_b.tsv", sep="\t")
df_b = df_b.set_index("xxx").sort_index()
```

```python
>>> df_a.equals(df_b)
>>> True
>>> all(df_a == df_b)
>>> True
```

- `sort_index()` is a MUST because `DataFrame.equals()` is weak in that it won't compare records with the same index automatically! Instead it seems to compare row-wise.
- `df_a == df_b` also performs row-wise comparison but if the indices of those 2 DataFrames were not exactly the same (in values and orders), it will throw `ValueError: Can only compare identically-labeled DataFrame objects`.