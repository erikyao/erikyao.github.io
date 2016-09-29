---
layout: post
title: "Python: Zip"
description: ""
category: Python
tags: [Python-101]
---
{% include JB/setup %}

`zip` 这个函数，用起来总是没有什么信心……我们上一下 [The Python Standard Library](https://docs.python.org/3/library/functions.html#zip) 上的示例代码看看（注意：这并非源码，因为现在已经是返回一个 `zip` 对象了）：

```python
def zip(*iterables):
    # zip('ABCD', 'xy') --> Ax By
    sentinel = object()
    iterators = [iter(it) for it in iterables]
    while iterators:
        result = []
        for it in iterators:
            elem = next(it, sentinel)
            if elem is sentinel:
                return
            result.append(elem)
        yield tuple(result)
```

注意 `iterators` 是个 list，所以 `len(iterators) != 0` 时，`while iterators` 就是个死循环，得等到里面的 `return` 执行才能退出。

## 那么第一个问题来了：什么时候 `iterators` 为空？

因为 `iterables` 是个 tuple（注意 parameters 传进来以后是被包装到 `iterables` 这个 tuple 里的，我并不是说要传一个 tuple 进来），所以即使你只传一个参数进来， `iterables` 非空，所以 `iterators` 也非空。只有不传参数时，`iterators` 才为空，此时 `zip()` 是个 empty generator。

题外话：没有 `return` 的 function 实际是默认 `return None` 的，比如：

```python
def func():
    pass
    
a = func()  # OK! Unbelievable!

print(a is None)  # True
print(func() is None)  # True
```

按理说，如果 `zip()` 是个 empty generator，那么它也应该返回 `None` 才对，但是：

```python
list(zip())     # OK. ==[]
list(*zip())    # OK. ==[]
list(None)      # TypeError: 'NoneType' object is not iterable
list(*None)     # TypeError: type object argument after * must be an iterable, not NoneType
```

（暂时不要问我 `list(zip())` 和 `list(*zip())` 有什么区别……）所以 `zip()` 并没有返回 None，empty generator 的逻辑肯定是在 `zip` 对象里单独处理了。

## 参数场景一：`zip([1,2], [3,4])`

一点点分析：

- 首先 `iterables == ([1,2], [3,4])`
- `iterators == [iter([1,2]), iter([3,4])]`
- `while` 循环第一次：
    - `for` 循环第一次：
        - result == [1]
    - `for` 循环第二次：
        - result == [1,3]
    - `yield (1, 3)`
- `while` 循环第二次：
    - `for` 循环第一次：
        - result == [2]
    - `for` 循环第二次：
        - result == [2,4]
    - `yield (2, 4)`
- `while` 循环第三次：
    - `for` 循环第一次：
        - `return`
- 结束

所以 `zip([1,2], [3,4])` generates `(1,3)` and `(2,4)`:

```python
list(zip([1,2], [3,4]))  # OK. ==[(1, 3), (2, 4)]
```

## 场景一特有技术一：并行 iterate 两个 list

```python
a_list = [1,2]
b_list = [3,4]

for a, b in zip(a_list, b_list):
    print(a,b)
    
# output
#   1 3
#   2 4
```

## 场景一特有技术二：一个 listcomp 返回两个 list

```python
square_cube = [[i**2, i**3] for i in range(5)]
square, cube = zip(*square_cube)

print(square)   # (0, 1, 4, 9, 16)
print(cube)     # (0, 1, 8, 27, 64)
```

这个技术可以看做是 “并行 iterate” 的变种。当然，这个技术我觉得有点二，还不如写两个 listcomp……

## 参数场景二：`zip([1,2,3,4])`

一点点分析：

- 首先 `iterables == ([1,2,3,4],)`
- `iterators == [iter([1,2,3,4])]`
- `while` 循环第一次：
    - `for` 循环第一次：
        - result == [1]
    - `yield (1,)`
- `while` 循环第二次：
    - `for` 循环第一次：
        - result == [2]
    - `yield (2,)`
- ……
- `while` 循环第五次：
    - `for` 循环第一次：
        - `return`
- 结束

所以 `zip([1,2,3,4])` generates `(1,)`, `(2,)`, `(3,)` and `(4,)`:

```python
list(zip([1,2,3,4]))  # OK. ==[(1,), (2,), (3,), (4,)]
```

我们可以看到，如果只给 `zip` 传一个参数——假定这个参数名是 `sth_iterable`——`zip` 其实就是把 `sth_iterable` iterate 了一遍，而且是一边 iterate 一边 `yield`，所以 `zip(sth_iterable)` 相当于 `get_generator_of(sth_iterable)`。

## Intuitive: 切菜

把 `a`, `b`, `c` 想象成 3 根芹菜（whatever，长条形状的就行），`zip(a, b, c)` 相当于把这 3 根芹菜对齐，每次都是左手在芹菜上找一个单位长度，比方说 1 厘米，（这相当于在 iterate），然后右手拿刀一次切下三块（这相当于在 `yield`）。

这么想的话，场景二也就好理解了——你只有一根芹菜。

能切多少刀，取决于最短的芹菜的长度。
