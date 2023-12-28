---
category: Python
description: ''
tags: []
title: 'Python: <i>itertools.groupby()</i> and <i>pd.DataFrame.groupby()</i> are different!'
---

Looks like I've been wrong for years... maybe because I am too familiar with the SQL-style `groupby` operation.

```python
import pandas as pd

# A dataframe with only one column `grade`
df = pd.DataFrame(data={'grade': list('AAAABBBCCDAABBB')})

# Every accumulated `g` has the same dataframe structure with `df`
for k, g in df.groupby(by='grade'):
    print(k, ":", list(g.grade))

# Output:
    # A : ['A', 'A', 'A', 'A', 'A', 'A']
    # B : ['B', 'B', 'B', 'B', 'B', 'B']
    # C : ['C', 'C']
    # D : ['D']
```

Works as expected. 

```python
from itertools import groupby

# Every accumulated `g` is a generator
for k, g in groupby('AAAABBBCCDAABBB'):
    print(k, ":", list(g))

# Output:
    # A : ['A', 'A', 'A', 'A']
    # B : ['B', 'B', 'B']
    # C : ['C', 'C']
    # D : ['D']
    # A : ['A', 'A']
    # B : ['B', 'B', 'B']
```

Yes, 2 groups with key `'A'` and 2 groups with key `'B'`. They won't combine!

Simply put:

- `pd.DataFrame.groupby()` groups data **globally**
    - since it can see the whole data
- `itertools.groupby()` groups data **locally**
    - since it has to iterate through data entries one by one.
    - Previous groups are not referred to when processing latter ones.