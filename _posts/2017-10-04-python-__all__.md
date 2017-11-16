---
layout: post
title: "Python: <i>__all__</i>"
description: ""
category: Python
tags: [Python-101]
---
{% include JB/setup %}

_Effective Python Item 50: Use Packages to Organize Modules and Provide Stable APIs_

Python can limit the "interface" exposed to API consumers who use `import *` by defining the `__all__` special attribute of a **module** or **package**. 

~~~~~ 2017-11-16 补充开始 ~~~~~ 

[__all__ and wild imports in Python](http://xion.io/post/code/python-all-wild-imports.html):

> `__all__` doesn’t prevent any of the module symbols (functions, classes, etc.) from being **directly** imported. In our the example, the seemingly omitted `baz` function (which is not included in `__all__`), is still **perfectly** importable by writing `from module import baz`.  
> <br/>  
> Similarly, `__all__` doesn’t influence what symbols are included in the results of `dir(module)` or `vars(module)`. So in the case above, a `dir` call would result in a `['Foo', 'bar', 'baz']` list, even though `'baz'` does not occur in `__all__`.  
> <br/>  
> In other words, the content of `__all__` is **more of a convention rather than a strict limitation**. Regardless of what you put there, every symbol defined in your module will still be accessible from the outside.  
> <br/>  
> This is a clear reflection of the common policy in Python: [assume everyone is a consenting adult](https://mail.python.org/pipermail/tutor/2003-October/025932.html), and that visibility controls are not necessary.

~~~~~ 2017-11-16 补充结束 ~~~~~ 

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