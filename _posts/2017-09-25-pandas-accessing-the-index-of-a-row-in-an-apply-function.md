---
category: Pandas
description: ''
tags:
- apply
title: 'Pandas: Accessing the index of a row in an <i>apply</i> function'
---

You CANNOT access each row's index via `lambda x: x.index` in `DataFrame.apply(axis=1)` because `apply` treats each row as a `numpy` object, not a `Series`. However you can use `lambda x: x.name` to access each row's name, which happens to equal its index.

```python
df.apply(axis=1, func=lambda x: func(x.index))  # Wrong!
df.apply(axis=1, func=lambda x: func(x.name))   # OK!
```

Another workaround is to use `Index.map()`. Note that this function does not preserve indices.

```python
pd.Series(df.index.map(lambda x: func(x)), index=df.index)
```