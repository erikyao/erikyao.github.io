---
layout: post
title: "Pandas: split a DataFrame into chunks"
description: ""
category: Pandas
tags: 
---
{% include JB/setup %}

Prepare a test dataset:

```python
import pandas as pd
from sklearn.datasets import load_breast_cancer

bc = load_breast_cancer()

dfm = pd.DataFrame(bc['data'])
dfm.columns = bc['feature_names']

print(dfm.shape)  # (569, 30)
print(dfm.index)  # RangeIndex(start=0, stop=569, step=1)
```

Introduce [`np.split(ary, indices_or_sections, axis=0)`](https://docs.scipy.org/doc/numpy-dev/reference/generated/numpy.split.html):

> If `indices_or_sections` is a 1-D array of sorted integers, the entries indicate where along axis the array is split. For example, `[2, 3]` would, for `axis=0`, result in `[ary[:2], ary[2:3], ary[3:]]`.

First we define a function to generate such a `indices_or_sections` based on the DataFrame's number of rows and the chunk size:

```python
def index_marks(nrows, chunk_size):
    return range(1 * chunk_size, (nrows // chunk_size + 1) * chunk_size, chunk_size)

indices = list(chunk_marks(dfm.shape[0], 100))
print("Marks: {}".format(indices))

# Output:
#   Marks: [100, 200, 300, 400, 500]
```

So here we are going to cut `dfm` into a list of sub DataFrames, `[dfm[0:100], dfm[100:200], dfm[200:300], dfm[300:400], dfm[400:500], dfm[500:569]]`.

```python
import numpy as np

def split(dfm, chunk_size):
    indices = index_marks(dfm.shape[0], chunk_size)
    return np.split(dfm, indices)

chunks = split(dfm, 100)
for c in chunks:
    print("Shape: {}; {}".format(c.shape, c.index))

# Output:
"""
    Shape: (100, 30); RangeIndex(start=0, stop=100, step=1)
    Shape: (100, 30); RangeIndex(start=100, stop=200, step=1)
    Shape: (100, 30); RangeIndex(start=200, stop=300, step=1)
    Shape: (100, 30); RangeIndex(start=300, stop=400, step=1)
    Shape: (100, 30); RangeIndex(start=400, stop=500, step=1)
    Shape: (69, 30); RangeIndex(start=500, stop=569, step=1)
"""
```