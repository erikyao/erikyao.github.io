---
layout: post
title: "Python: sharing states between processes"
description: ""
category: Python
tags: []
---
{% include JB/setup %}

首先复习一下：

- multi-threading：
    - 好处是天然地能够 share main process' (or main thread's) memory
    - GIL 的存在使得 multi-threading 只能发挥出 concurrent 的效果，达不到 parallel
    - 同时应该认识到 "GIL 并没有天然保证 thread-safe"，因为 race-condition 不会因为 GIL 而消失
- multi-processing：
    - 虽然无法 share main process' memory，但是我可以 share global memory 啊

sharing global memory 这个做法在 [官方 docs](https://docs.python.org/3/library/multiprocessing.html#sharing-state-between-processes) 里讲得很详细了。不过首先还是要注意：

> As mentioned above, when doing concurrent programming it is usually best to avoid using shared state as far as possible. This is particularly true when using multiple processes.  
> <br/>
> However, **if you really do** need to use some shared data...

可以使用下面两种模式：

## Shared Memory

```python
from multiprocessing import Process, Value, Array

def f(n, a):
    n.value = 3.1415927
    for i in range(len(a)):
        a[i] = -a[i]

if __name__ == '__main__':
    num = Value('d', 0.0)        # 'd' for double
    arr = Array('i', range(10))  # 'i' for int

    p = Process(target=f, args=(num, arr))
    p.start()
    p.join()

    print(num.value)
    print(arr[:])
```

注意：

- `'d'` 和 `'i'` 是 **typecodes** 的其中两种，但是官方 docs 在这一小节并没有讲啥叫 typecodes，应该参考的是 [array — Efficient arrays of numeric values](https://docs.python.org/3/library/array.html)
    - 其实如果记不住 typecodes 的话，直接用 `double`/`int` 这样的 type 也是可以的

我们来看下这个 `Value` 和 `Array` 是啥。根据 [Shared ctypes Objects](https://docs.python.org/3/library/multiprocessing.html#shared-ctypes-objects):

`multiprocessing.Value(typecode_or_type, *args, lock=True)`:

> Return a `ctypes` object allocated from shared memory. By default the return value is actually **a synchronized wrapper** for the object. The object itself can be accessed via the _value_ attribute of a `Value`.  
> <br/>
> If _lock_ is `True` (the default) then a new recursive lock object is created to synchronize access to the value. If _lock_ is a `Lock` or `RLock` object then that will be used to synchronize access to the value. If _lock_ is False then access to the returned object will not be automatically protected by a lock, so it will not necessarily be "process-safe".

注意：Operations like `+=` which involve a read and write are not atomic. So if, for instance, you want to atomically increment a shared value it is insufficient to just do

```python
v.value += 1  # NOT thread-safe or process-safe
```

Assuming the associated lock is recursive (which it is by default) you can instead do

```
with v.get_lock():
    v.value += 1
```

`multiprocessing.Array(typecode_or_type, size_or_initializer, *, lock=True)`:

> Return a `ctypes` array allocated from shared memory. By default the return value is actually **a synchronized wrapper** for the array.

其余的地方与 `Value` 类似

## Server Process

> A `manager` object returned by `Manager()` controls a server process which holds Python objects and allows other processes to manipulate them using **proxies**.  
> <br/>
> A `manager` returned by `Manager()` will support types `list`, `dict`, `Namespace`, `Lock`, `RLock`, `Semaphore`, `BoundedSemaphore`, `Condition`, `Event`, `Barrier`, `Queue`, `Value` and `Array`

这个命名让人有点想吐槽。感觉这个 server process 就是个 shared object factory...举例：

```python
from multiprocessing import Process, Manager

def f(d, l):
    d[1] = '1'
    d['2'] = 2
    d[0.25] = None
    l.reverse()

if __name__ == '__main__':
    with Manager() as manager:
        d = manager.dict()
        l = manager.list(range(10))

        p = Process(target=f, args=(d, l))
        p.start()
        p.join()

        print(d)
        print(l)
```

