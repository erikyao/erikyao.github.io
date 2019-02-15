---
layout: post
title: "Pandas: one-column Boolean DataFrame vs Boolean Series"
description: ""
category: Pandas
tags: []
---
{% include JB/setup %}

Caution when you apply `any` or `all` on a one-column Boolean DataFrame, or you should never apply these 2 functions to such a DataFrame because it works differently from your intention.

The logics of `any` and `all` are:

```python
def all(iterable):
    for element in iterable:
        if not element:
            return False
    return True
```

```python
def any(iterable):
    for element in iterable:
        if element:
            return True
    return False
```

The trickiest part with a DataFrame is that when being iterated, its `element`s are actually its **column names, with types!**

A column name can be a string (in most cases), an integer (acceptable) or even a Boolean (What?). Therefore when applying `any()` or `all()` to a DataFrame, you're actually iterating its column names, which are then evaluated in the `if element:` clause, and at the same time NONE of the values underneath is accessed at all.

```python
>>> foo = pd.DataFrame(data=[1,2])
>>> foo
   0
0  1
1  2
>>> for element in foo:
...     print(element)
... 
0
```

```python
>>> foo = pd.DataFrame(data=[1,2], columns=[True])
>>> foo
   True
0     1
1     2
>>> for element in foo:
...     print(element)
... 
True
```

And this exactly explains the seemingly contradicting results in the following code:

```python
>>> one_c_df = pd.DataFrame(data=[False, False], index=["a", "b"], columns=["a_colname_not_evaluated_to_False"])
>>> one_c_df
   a_colname_not_evaluated_to_False
a                             False
b                             False
>>> any(one_c_df)  # I cannot believe this at first sight!
True
>>> all(one_c_df)
True
```

```python
>>> series = pd.Series(data=[False, False], index=["a", "b"], name="does_not_matter")
>>> series
a    False
b    False
Name: does_not_matter, dtype: bool
>>> any(series)
False
>>> all(series)
False
```