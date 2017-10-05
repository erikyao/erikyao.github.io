---
layout: post
title: "Python: <i>__all__</i>"
description: ""
category: Python
tags: [Python-101]
---
{% include JB/setup %}

_Effective Python Item 50: Use Packages to Organize Modules and Provide Stable APIs_

Python can limit the "interface" exposed to API consumers by using the `__all__` special attribute of a **module** or **package**. The value of `__all__` is a list of every name to export from the module as part of its public API. 

## Define `__all__` in a module

When consuming code does `from foo import *`, only the attributes in `foo.__all__` will be imported from `foo`. If `__all__` isn’t present in `foo`, then only public attributes, those without a leading underscore, are imported.

```python
# foo.py

__all__ = ['Foo']

class Foo(object):
    pass
```

## Define `__all__` for a package

To do this with package `mypackage`, you need to modify the `__init__.py` file in the `mypackage` directory. This file actually becomes the contents of the `mypackage` module when it's imported. Thus, you can specify an explicit API for `mypackage` by limiting what you import into `__init__.py`. 

Suppose `mypackage` directory structure is:

```bash
mypackage
├── __init__.py
├── model.py
└── util.py
```

and `__all__` are defined in `model.py` and `util.py` both.

Since all of my internal modules already specify `__all__`, I can expose the public interface of `mypackage` by simply importing everything from the internal modules and updating `__all__` accordingly.

```python
# __init__.py

__all__ = []

from .models import *
__all__ += models.__all__

from .utils import *
__all__ += utils.__all__

```

Note that `from .xxx` (no space between `.` and `xxx`) means relative import, i.e. importing from a relative path. 

[PEP 328 -- Imports: Multi-Line and Absolute/Relative (Guido's Decision)](https://www.python.org/dev/peps/pep-0328/#guido-s-decision):

> Guido has Pronounced that relative imports will use leading dots. A single leading dot indicates a relative import, starting with the current package. Two or more leading dots give a relative import to the parent(s) of the current package, one level per dot after the first.

Also note that you can also `from . import xxx` to relatively import the whole module `xxx`.