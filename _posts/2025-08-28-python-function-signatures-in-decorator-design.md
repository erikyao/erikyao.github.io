---
title: "Python: Function Signatures in Decorator Design"
description: ""
category: Python
tags: []
toc: true
toc_sticky: true
---

其实在 [Fluent Python: Chapter 7 - Function Decorators and Closures](/python/2016/09/16/digest-of-fluent-python#chapter-7---function-decorators-and-closures) 有讲，但没有专注在 signature 上。

-----

# 1. 纯数学角度

假设有 function $f: X \to Y$，那么 $f$ 上的 decorator 就是个 function $\Delta: (X \to Y) \to (X \to Y)$, 即若有 $f' = \Delta(f)$，那么 signature-wise 有 $f': X \to Y$ 与 $f$ 保持一致。

所以假设我们有 function `f(a, b, ..., z)`，那么 decorator `decorate` 应该要 return 一个 `f'(a, b, ..., z)`:

```python
def decorate(func):
    def decorated_func(a, b, ..., z):
        # You can call func(a, b, ..., z) here,
        # depending on your application
        pass

    return decorated_func

@decorate
def f(a, b, ..., z):
    pass
```

# 2. 纯数学写法的变体

我们把 $f'$ 设计成 `f'(*args, **kwargs)` 来 catch-all 所有的 parameter 形式：

```python
def decorate(func):
    def decorated_func(*args, **kwargs):
        # You can call func(*args, **kwargs) here,
        # depending on your application
        pass

    return decorated_func

@decorate
def f(a, b, ..., z):
    pass
```

# 3. 纯添加 side effect 的写法

```python
def decorate(func):
    print("adding side effects...")

    return func

@decorate
def f(a, b, ..., z):
    pass
```

此时可以认为有 $\Delta(f) = f$，所以不需要设计 $f'$ 的 signature.

# 4. decorator factory

**带参数的 decorator 本质都是 decorator factory**. 

你也可以写不带参数的 decorator factory，但没有什么实际意义。
{: .notice--info}

即 decorator factory $\Gamma(\cdot) = \Delta$，连起来用就是 $\Gamma(\cdot)(f) = \Delta(f) = f'$，数学上有 $\Gamma: \cdot \to \big( (X \to Y) \to (X \to Y) \big)$ w.r.t. $f: X \to Y$. 举例：

```python
def repeat(n_times : int):
    def decorator(func):
        def decorated_func(a, b, ..., z):
            result = 0
            for _ in range(n_times):
                result += func(a, b, ..., z)
            return result
        return decorated_func
    return decorator

@repeat(3)
def f(a, b, ..., z):
    pass
```

$\Gamma$ 的参数和 $f$ 没有直接联系，完全看你自己的设计。

# 5. 记得给 `f'` 带上 `@functools.wraps(f)`

```python
import functools

def decorate(func):
    @functools.wraps(func)
    def decorated_func(a, b, ..., z):
        # You can call func(a, b, ..., z) here,
        # depending on your application
        pass

    return decorated_func

@decorate
def f(a, b, ..., z):
    pass
```

[参考](/python/2016/09/16/digest-of-fluent-python#digress-functoolswrap)