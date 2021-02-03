---
layout: post
title: "Python tips from Datacamp"
description: ""
category: Python
tags: []
---
{% include JB/setup %}

## 1. Python Lists

### 1. Extend a list

```python
x = ["a", "b", "c"]

y = x + ["d", "e"]      # y == ['a', 'b', 'c', 'd', 'e']

x.append(["d", "e"])    # x == ['a', 'b', 'c', ['d', 'e']]
x.extend(["d", "e"])    # x == ['a', 'b', 'c', ['d', 'e'], 'd', 'e']
```

`append()` and `extend()` are in-place operations; they return neither new lists nor booleans, just `None`. Therefore it's meaningless to write `x = x.append()` or `y = x.append()`.

### 2. Delete list elements

```python
areas = ["hallway", 11.25, "kitchen", 18.0,
         "chill zone", 20.0, "bedroom", 10.75,
         "bathroom", 10.50, "poolhouse", 24.5,
         "garage", 15.45]

# How to delete "poolhouse" and 24.5?
del areas[-4:-2]                # CORRECT
del areas[10:12]               # CORRECT
del areas[10]; del areas[11]  # WRONG
```

- After a `del` operation, the indices will be changed! So `del areas[10]; del areas[11]` is wrong.
- The `;` sign is used to place commands on the same line.

注：原文的写法是 `del(areas[10:12])`，我十分不推荐这么写，因为 `del` 是关键字，你的 `del(areas[10:12])` 会先被解析成 `del (areas[10:12])`，然后因为这里括号没有意义，所以等价于 `del areas[10:12]` 

### 3. Shallow copy v.s. deep copy of lists

```python
x = ["a", "b", "c"]

y = x       # shallow copy
y = list(x) # deep copy
y = x[:]    # deep copy
```

## 2. Numpy

### 2.1 Numpy arrays: contain only one type

```python
In [19]: np.array([1.0, "is", True])
Out[19]: array(['1.0', 'is', 'True'], dtype='<U32') 
```

### 2.2 Element-wise calculations

```python
In [20]: python_list = [1, 2, 3]

In [21]: numpy_array = np.array([1, 2, 3])

In [22]: python_list + python_list
Out[22]: [1, 2, 3, 1, 2, 3]

In [23]: numpy_array + numpy_array
Out[23]: array([2, 4, 6])

In [13]: height = [1.73, 1.68, 1.71, 1.89, 1.79]
In [14]: weight = [65.4, 59.2, 63.6, 88.4, 68.7]
In [15]: weight / height ** 2
TypeError: unsupported operand type(s) for **: 'list' and 'int' 

In [16]: np_height = np.array(height)
In [17]: np_weight = np.array(weight)
In [18]: np_weight / np_height ** 2
Out[18]: array([ 21.852, 20.975, 21.75 , 24.747, 21.441])
```

```python
# Height in foot, weight in lb, bmi
In [2]: baseball = np.array([[77.0, 210.0, 25.82], 
							[79.0, 205.0, 25.5], 
							[78.0, 208.0, 29.57]])

In [3]: conversion = np.array([0.0254, 0.453592, 1])

# Height in meter, weight in kg, bmi
In [4]: baseball * conversion
Out[4]: 
array([[  1.9558  ,  95.25432 ,  25.82    ],
       [  2.0066  ,  92.98636 ,  25.5     ],
       [  1.9812  ,  94.347136,  29.57    ]])
```

### 2.3 Basic Statistics

```python
np.mean(np_height)
np.median(np_height)
np.std(np_height) # standard deviation
np.corrcoef(np_height, np_weight) # correlation
```