---
category: Python
description: ''
tags: []
title: 'Python: Yes, you can unpack a generator!'
---

```python
def square_and_cube(x):
    yield x**2
    yield x**3
```

```python
>>> square, cube = square_and_cube(4)
>>> print(square)
16
>>> print(cube)
25
```

Keep in mind that `zip` objects are also generators in Python 3. Therefore you can also do:

```python
>>> squares, cubes = zip(square_and_cube(4), square_and_cube(5))
>>> print(squares)
(16, 25)
>>> print(cubes)
(64, 125)
```