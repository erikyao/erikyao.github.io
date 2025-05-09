---
title: "Python: Import Enum Uniformly before Comparison"
description: ""
category: Python
tags: []
toc: false
toc_sticky: false
---

This is not considered a bug in `Enum` but it's quite subtle indeed. 

-----

# 1. Problem

Example project structure:

```bash
.
├── src
│   ├── __init__.py
│   ├── peg_parser.py
│   └── peg_token.py
├── tests
│   ├── __init__.py
│   └── test_peg_parser.py
```

Both `peg_parser.py` and `test_peg_parser.py` imports enum `TokenType` from `peg_token.py`:

```python
# src/peg_parser.py
from peg_token import TokenType

# tests/test_peg_parser.py
from src.peg_token import TokenType
```

and in `test_peg_parser.py`, a unit test that parses `var x = 5;` would finally call `ToyPEGParser.consume_token()`:

```python
    def consume_token(self, token_type, value=None) -> Token | None:
        if ((self.current_token.type == token_type) and
                (value is None or self.current_token.value == value)):
            consumed_token = self.current_token
            self.advance_to_next_token()
            return consumed_token
        return None
```

The problem is that this method always `return None` because `self.current_token.type` and `token_type` are NOT equal EVEN when they are both `TokenType.VAR`.

This problem was also discussed in [cpython - Issue#74730](https://github.com/python/cpython/issues/74730) and [Python Enums across Modules](https://stackoverflow.com/questions/26589805/python-enums-across-modules).

# 2. Solution

You can debug inside `ToyPEGParser.consume_token()` method and probe `__module__` fields like:

```python
print(f"self.current_token.type.__module__: {self.current_token.type.__module__}")
print(f"token_type.__module__: {token_type.__module__}")
```

and you would get results like:

```bash
self.current_token.type.__module__: src.peg_token
token_type.__module__: peg_token
```

This is the root cause: the enum `TokenType` is actually imported TWICE as TWO types, one `src.peg_token.TokenType` and the other `peg_token.TokenType`. Therefore the equality test always fails.

The solution is quite simple: import the enum UNIFORMLY:

```python
# src/peg_parser.py
from src.peg_token import TokenType

# tests/test_peg_parser.py
from src.peg_token import TokenType
```