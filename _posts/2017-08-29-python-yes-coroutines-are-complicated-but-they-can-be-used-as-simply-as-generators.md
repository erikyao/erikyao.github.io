---
layout: post
title: "Python: Yes, coroutines are complicated, but they can be used as simply as generators"
description: ""
category: Python
tags: [Python-101]
---
{% include JB/setup %}

The fact is that we often take the `.send()` sematics of coroutines too seriosly that we simply ignore the possibility to use them just like generators.

```python
def simple_generator():
    yield
    yield
    yield

def simple_coroutine():
    x = yield 
    y = yield
    z = yield

    print("[simple_coroutine] after 3 yields, x = {}, y = {}, z = {}".format(x, y, z))
    
    # return value of coroutines are not used in our examples
    # so having a return-statement or not does not matter here
    # return (x, y, z)  

def simple_generator2():
    yield 1
    yield 2
    yield 3

def simple_coroutine2():
    x = yield 1
    y = yield 2
    z = yield 3

    print("[simple_coroutine2] after 3 yields, x = {}, y = {}, z = {}".format(x, y, z))

    # return (x, y, z)  

# Or simply `my_gen = (None for _ in range(3))`
# Prefer generator functions here for better comparison of code
my_gen = simple_generator()
my_coro = simple_coroutine()

my_gen2 = simple_generator2()
my_coro2 = simple_coroutine2()

def yield_from(sth):
    yield from sth
    
print(list(yield_from(my_gen)))
print("------------------")
print(list(yield_from(my_coro)))
print("------------------")
print(list(yield_from(my_gen2)))
print("------------------")
print(list(yield_from(my_coro2)))

# Output:
"""
[None, None, None]
------------------
[simple_coroutine] after 3 yields, x = None, y = None, z = None
[None, None, None]
------------------
[1, 2, 3]
------------------
[simple_coroutine2] after 3 yields, x = None, y = None, z = None
[1, 2, 3]
"""
```

- A simple `yield` with no argument, yields `None`
- A statement like `x = yield`, with no argument after `yield`, yields `None` (same in a generator's way)
- Priming a coroutine does trigger the first `yield`, which will yield something (same in a generator's way)
    - Recall that `next(coro)` and `coro.send(None)` both serve as primers.
        - The consistency of `next(coro)` and `coro.send(None)` in the ability to prime a coroutine is actually a good clue to follow!