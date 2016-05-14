---
layout: post
title: "Python tips from Datacamp"
description: ""
category: Python
tags: [Python-101]
---
{% include JB/setup %}

## 1. Extends a list

```python
x = ["a", "b", "c"]

y = x + ["d", "e"]      # y == ['a', 'b', 'c', 'd', 'e']

x.append(["d", "e"])    # x == ['a', 'b', 'c', ['d', 'e']]
x.extend(["d", "e"])    # x == ['a', 'b', 'c', ['d', 'e'], 'd', 'e']
```

`append()` and `extend()` are in-place operations; they return neither new lists nor booleans, just `None`. Therefore it's meaningless to write `x = x.append()` or `y = x.append()`.

## 2. Delete list elements

```python
areas = ["hallway", 11.25, "kitchen", 18.0,
        "chill zone", 20.0, "bedroom", 10.75,
         "bathroom", 10.50, "poolhouse", 24.5,
         "garage", 15.45]

# How to delete "poolhouse" and 24.5?
del(areas[-4:-2])               # CORRECT
del(areas[10:12])               # CORRECT
del(areas[10]); del(areas[11])  # WRONG
```

- After a `del` operation, the indices will be changed! So `del(areas[10]); del(areas[11])` is wrong.
- The `;` sign is used to place commands on the same line.

## 3. Shallow copy v.s. deep copy of lists

```python
x = ["a", "b", "c"]

y = x       # shallow copy
y = list(x) # deep copy
y = x[:]    # deep copy
```
