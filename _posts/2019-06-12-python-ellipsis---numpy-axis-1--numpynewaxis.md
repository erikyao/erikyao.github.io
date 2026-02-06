---
category: Numpy
description: ''
tags: []
title: 'Python: Ellipsis (...) / Numpy: <i>axis=-1</i> / <i>np.newaxis</i>'
---

## Ellipsis

`Ellipsis` is a [python constant](https://docs.python.org/dev/library/constants.html#Ellipsis), just like `False`, `True` and `None`.

`...` is the ellipsis literal; it's equivalent to `Ellipsis`.

```python
In [9]: Ellipsis
Out[9]: Ellipsis

In [10]: ...
Out[10]: Ellipsis
```

When used for slicing, `...` usually (depending on the `__getitem__` implementation) means **_"all the other dimensions (between the specified sentinels)"_** (`:` means _"all the elements in that dimension"_).

It's useful when you are handling variant-dimension arrays/matrices. Say you need a function to return _"the last element(s) of each dimension"_. (See [Stack Overflow: “Slicing” in Python Expressions documentation](https://stackoverflow.com/a/753260))

- If it's a 1-D, you need `array[-1]`
- If it's a 2-D, you need `array[:, -1]`
- If it's a 3-D, you need `array[:, :, -1]`
- ......
- No matter how many dimensions, you can always have `array[..., -1]`

## `axis=-1`

Just like `list[-1]` indicates the last elements, `axis=-1` means **_"the last dimension"_** (See [Stack Overflow: What is the meaning of axis=-1 in keras.argmax?](https://stackoverflow.com/a/47436103)):

- It's the 2nd dimension of a 2-D array
- It's the 3rd dimension of a 3-D array
- ...

## `np.newaxis`

Used to increase the dimension of the current array, directly from the slicing processes.

A great illustration of how it works is from [Stack Overflow: How does numpy.newaxis work and when to use it?](https://stackoverflow.com/a/41267079):

![](/assets/posts/2019-06-12-python-ellipsis---numpy-axis-1--numpynewaxis/zkMBy.png)

Tensorflow has a similar `tf.newaxis`; it works the same way:

```python
In [2]:  t = tf.constant([[1., 2., 3.], [4., 5., 6.]])

In [6]: t[:, 1].shape
Out[6]: TensorShape([2])

In [7]: t[:, 1, tf.newaxis].shape
Out[7]: TensorShape([2, 1])

In [8]: t[tf.newaxis, :, 1].shape
Out[8]: TensorShape([1, 2])
```

- `t[:, 1]` is the vector `[2, 5]`
- `t[:, 1, tf.newaxis]` makes a $2 \times 1$ matrix: 2 rows, each being a one-element vector
- `t[tf.newaxis, :, 1]` makes a $1 \times 2$ matrix: 1 row, containing a two-element vector