---
category: Python
description: ''
tags: []
title: 'Python: <i>pprint.pformat</i> can be a good friend of <i>__str__</i>'
---

```python
import pprint


class Foo:
    def __init__(self, a, b):
        self.a = a
        self.b = b

    def __str__(self):
        attr_list = ["a", "b"]  # or self.__dict__.keys()
        attr_dict = {attr: str(self.__getattribute__(attr)) for attr in attr_list}

        return pprint.pformat(attr_dict)


class Bar:
    def __init__(self, e, f):
        self.e = e
        self.f = f

    def __str__(self):
        attr_list = ["e", "f"]
        attr_dict = {attr: str(self.__getattribute__(attr)) for attr in attr_list}

        return pprint.pformat(attr_dict)


if __name__ == '__main__':
    f = Foo(999, "The quick brown fox")
    b = Bar("jumped over the lazy dog", f)

    print(f)
    print(b)

# Output:
"""
{'a': '999', 'b': 'The quick brown fox'}
{'e': 'jumped over the lazy dog',
 'f': "{'a': '999', 'b': 'The quick brown fox'}"}
"""
```

`pprint.pformat(self.__dict__)` or `pprint.pformat(vars(self))` (in fact, `vars(self)` returns `self.__dict__`; they are identical) looks an easier implementation, but actually when `print(b)`, its call to `dict.__str__` somehow won't call `f.__str__` but `f.__repr__`.

You can set `attr_list` to `self.__dict__.keys()` if you want to include all attributes; or set it to a list to pick just part of your attributes to represent.