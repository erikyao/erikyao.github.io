---
category: Python
description: ''
tags: []
title: 'Python: global declaration not needed in main'
---

```python
DATA_DIR = "./data"

def func(fn):
    global DATA_DIR  # OK

    path = os.path.join(DATA_DIR, fn)

    ...

if __name__ == '__main__':
    # global DATA_DIR  # WRONG

    fn = "foo.txt"
    path = os.path.join(DATA_DIR, fn)  # OK

    ...
```

If you declare `global` inside the `main` block, you'll get `SyntaxWarning: name 'DATA_DIR' is assigned to before global declaration global DATA_DIR`. This is simply [because](https://stackoverflow.com/a/20785053):

1. Unlike some other languages, an `if` statement doesn't introduce a new scope in Python
2. To declare a variable as global, you are not allowed to have used that variable name previously in the same scope