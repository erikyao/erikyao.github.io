---
layout: post
title: "Python: &#42;expression"
description: ""
category: Python
tags: [Python-101]
---
{% include JB/setup %}

## `*expression` and `**expression` inside function calls

From [The Python Language Reference - 6.3.4. Calls](https://docs.python.org/dev/reference/expressions.html#calls):

> If the syntax `*expression` appears in the function call, `expression` must evaluate to an **_iterable_**. Elements from these iterables are treated as if they were additional positional arguments. For the call `f(x1, x2, *y, x3, x4)`, if `y` evaluates to a sequence `y1, ..., yM`, this is equivalent to a call `f(x1, x2, y1, ..., yM, x3, x4)`.

> If the syntax `**expression` appears in the function call, `expression` must evaluate to a **_mapping_**, the contents of which are treated as additional keyword arguments. If a keyword is already present (as an explicit keyword argument, or from another unpacking), a `TypeError` exception is raised.

Pay attention to the parameter order: `*expression` syntax may appear after explicit keyword arguments, it is processed before the keyword arguments and any `**expression` arguments. E.g.

```python
def func(a, b ,c):
    print(a, b, c)

func(c=3, 1, 2)                # SyntaxError: positional argument follows keyword argument
func(c=3, *(1,2))              # OK. 1 2 3
func(c=3, **dict(a=1,b=2))     # OK. 1 2 3
func(c=3, *(1,), **dict(b=2))  # OK. 1 2 3
```

## Unpacking inside tuple, list, set and dictionary **_displays_**

N.B. This PEP does NOT include unpacking operators inside list, set and dictionary **_comprehensions_**. 

From [PEP 448 -- Additional Unpacking Generalizations](https://www.python.org/dev/peps/pep-0448/):

```python
>>> *range(4), 4
(0, 1, 2, 3, 4)
>>> [*range(4), 4]
[0, 1, 2, 3, 4]
>>> {*range(4), 4}
{0, 1, 2, 3, 4}
>>> {'x': 1, **{'y': 2}}
{'x': 1, 'y': 2}
```

In dictionaries, later values will always override earlier ones:

```python
>>> {'x': 1, **{'x': 2}}
{'x': 2}
>>> {**{'x': 2}, 'x': 1}
{'x': 1}
```

N.B. We can also call

- `*`: iterable unpacking operator and 
- `**`: dictionary unpacking operator

## Extended Unpacking (`*expression` on LHS of assignments)

From [PEP 3132 -- Extended Iterable Unpacking](https://www.python.org/dev/peps/pep-3132/), if `seq` is a slicable sequence, all the following assignments are equivalent if `seq` has at least 3 elements:

```python
a, *b, c = seq
[a, *b, c] = seq
a, b, c = seq[0], list(seq[1:-1]), seq[-1]
```

It is an error to use the starred expression as a lone assignment target, as in

```python
*a = range(5)  # Error
```

This, however, is valid syntax:

```python
*a, = range(5)  # OK
```

This proposal also applies to tuples in implicit assignment context, such as in a `for` statement:

```python
for a, *b in [(1, 2, 3), (4, 5, 6, 7)]:
    print(b)
    
# output:
#   [2, 3]
#   [5, 6, 7]
```

More examples in [stack overflow: Unpacking, Extended unpacking, and nested extended unpacking](http://stackoverflow.com/questions/6967632/unpacking-extended-unpacking-and-nested-extended-unpacking).