---
layout: post
title: "Python: Be cautious when using generators/iterators in nested loops"
description: ""
category: Python
tags: []
---
{% include JB/setup %}

Simply because generators/itertors would drain.

```python
X = [1,2]
Y = [3,4]

[(x, y) for x in X for y in Y]  # OK
# Output: [(1, 3), (1, 4), (2, 3), (2, 4)]
```

```python
X = iter([1,2])
Y = [3,4]

[(x, y) for x in X for y in Y]  # OK
# Output: [(1, 3), (1, 4), (2, 3), (2, 4)]
```

```python
X = iter([1,2])
Y = iter([3,4])

[(x, y) for x in X for y in Y]  # What the hell!
# Output: [(1, 3), (1, 4)]
```

Otherwise you can create a new generator/iterator for each run.

```python
X = iter([1,2])
# Y = iter([3,4])

[(x, y) for x in X for y in iter([3,4])]  # OK
# Output: [(1, 3), (1, 4), (2, 3), (2, 4)]
```