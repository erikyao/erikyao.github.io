---
category: Python
description: ''
tags: []
title: 'Python: Signature'
---

Just a reminder that we have such objects to inspect the function signatures， as [PEP 362 -- Function Signature Object](https://www.python.org/dev/peps/pep-0362/) indicates.

Here is an example from [The Python Standard Library -- 29.12.3. Introspecting callables with the Signature object](https://docs.python.org/3/library/inspect.html#introspecting-callables-with-the-signature-object).

```python
from inspect import signature

def foo(a, *, b:int, **kwargs):
    pass

sig = signature(foo)

print(str(sig))  # (a, *, b:int, **kwargs)
print(str(sig.parameters['b']))  # b:int
print(sig.parameters['b'].annotation)  # <class 'int'>
```

I can smell something like Java reflection.