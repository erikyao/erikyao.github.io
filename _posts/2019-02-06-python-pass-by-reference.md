---
category: Python
description: ''
tags: []
title: 'Python: pass-by-reference'
---

再次提出这个问题是因为遇到了一个 "想在 function 中修改 list 内容" 的场景，而正确的写法应该是用 slice-then-assign:

```python
def test1(lst):
    lst = [999, 1000]

def test2(lst):
    lst[:] = [999, 1000]

if __name__ == "__main__":
    lst = [1, 2]
    
    test1(lst)
    print(lst)

    test2(lst)
    print(lst)

# Output:
#   [1, 2]
#   [999, 1000]
```

函数体内的 `lst` 只是 argument 的一个 copy，而这里 argument 是一个 reference，指向一个 list；而你对这个 reference copy 赋值，相当于让它指向一个新的 list，原来的 reference 没有变动。所以 `test1` 的逻辑大约是：

```python
if __name__ == "__main__":
    lst = [1, 2]

    ENTER test1:
        lst_copy = lst  # => [1, 2]
        lst_copy = [999, 1000]
    EXIT test1

    print(lst)

# Output
#   [1, 2]
```

而 `test2` 的先 slice 再 assignment 实际上是调用了 `__setitem__`。根据 [How assignment works with python list slice](https://stackoverflow.com/a/35632876):

1. If the left side of assignment is subscription, Python will call `__setitem__` on that object. `a[i] = x` is equivalent to `a.__setitem__(i, x)`.
1. If the left side of assignment is slice, Python will also call `__setitem__`, but with different arguments: `a[1:4]=[1,2,3]` is equivalent to  `a.__setitem__(slice(1,4,None), [1,2,3])`

所以即是 caller 是 reference copy，但它能实际影响 reference 指向的值。`test2` 的逻辑大约是：

```python
if __name__ == "__main__":
    lst = [1, 2]

    ENTER test2:
        lst_copy = lst  # => [1, 2]
        lst_copy.__setitem__(slice(None, None, None), [999, 1000])
    EXIT test2

    print(lst)

# Output
#   [999, 1000]
```