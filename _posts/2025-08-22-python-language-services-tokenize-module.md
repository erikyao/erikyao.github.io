---
title: "Python Language Services: `tokenize` module"
description: ""
category: Compiler
tags: []
toc: true
toc_sticky: true
---

# `tokenize` module

- Docs: [`tokenize` — Tokenizer for Python source](https://docs.python.org/3/library/tokenize.html)
- Source Code: [cpython/Lib/tokenize.py](https://github.com/python/cpython/blob/3.13/Lib/tokenize.py)

## `TokenInfo` class

注意这个 class 不是在 `token` module 中定义的。

```python
class TokenInfo(collections.namedtuple('TokenInfo', 'type string start end line')):
    def __repr__(self):
        annotated_type = '%d (%s)' % (self.type, tok_name[self.type])
        return ('TokenInfo(type=%s, string=%r, start=%r, end=%r, line=%r)' %
                self._replace(type=annotated_type))

    @property
    def exact_type(self):
        if self.type == OP and self.string in EXACT_TOKEN_TYPES:
            return EXACT_TOKEN_TYPES[self.string]
        else:
            return self.type
```

注意：

- `type` 的值是 `token` module 中的 `tok_name` 成员
- `string` 是 token 的字面值
- `start` 和 `end` 两者都是 tuple: 
    - `start := (srow, scol) := (start_lineno, start_index)`
    - `end := (erow, ecol) := (end_lineno, end_index)`
    - 逻辑就是：`line = lines[lineno]; pos = line[index]`
- `line` 不是指的 lineno，而是整个 line 的 content (as a string)

举例：

```python
TokenInfo(type=2 (NUMBER), string='3', start=(1, 0), end=(1, 1), line='3+4')
```

严格来说 `token` module 里都是 token names (or types), `TokenInfo` 才是具体 tokenization 产出的 token instance. 命名上还是有值得商榷的地方。
{: .notice--info}

## Tokenization functions

注意 function 的参数有 `str` vs `bytes` 的区分，虽然 source code 没有 type hints，但其实有：

- `def generate_tokens(readline: () -> str) -> Generator[TokenInfo, None, None]`
- `def tokenize(readline: () -> bytes | bytearray) -> Generator[TokenInfo, None, None]`
    - 会调用 `def detect_encoding(readline: () -> bytes | bytearray) -> tuple[str, Sequence[bytes]]`

所以若你想不使用 file (比如 unit test 时)：

- 若是用 `io.StringIO` 来 wrap 待 tokenize 的 python code，你只能使用 `generate_tokens`
- 若是用 `io.BytesIO`，那就只能用 `tokenize`

且 `tokenize` 会额外产出一个 special token for encoding:

```py
TokenInfo(type=67 (ENCODING), string='utf-8', start=(0, 0), end=(0, 0), line='')
```

# Wrap it into your own tokenizer

无论 `generate_tokens` 还是 `tokenize`，它们都是 `Generator[TokenInfo]`. 若是需要 "peek next token" 这样的功能，还是需要把 token 都放到一个 array 中：

- 我们当然可以直接获取所有的 tokens, 比如 `array = list(generate_tokens(...))`，但如果 parser 在某个 token 位置发现了 error，其后续的 tokenization effort 都被浪费了，性能上不是很高效
- GvR 在 [PEG Parsing Series Overview](https://medium.com/@gvanrossum_83706/peg-parsing-series-de5d41b2ed60) 系列中用的是一种 "**generate on demand**" 的模式：

```python
class Tokenizer:
    def __init__(self, token_gen):
        self.token_gen = token_gen  # feed tokenize.generate_tokens() here
        self.tokens = []
        self.pos = 0

    @property
    def mark(self):
        """
        returns the current position in the array
        """
        return self.pos

    def reset(self, pos):
        """
        sets the position in the array (the argument must be something you got from `mark()`)
        """
        self.pos = pos

    def get_token(self):
        """
        returns the next token, advancing the position in the array
        (reading another token from the source if we’re at the end of the array)
        """
        token = self.peek_token()
        self.pos += 1
        return token

    def peek_token(self):
        if self.pos == len(self.tokens):
            # generate on demand
            self.tokens.append(next(self.token_gen))
        return self.tokens[self.pos]
```

你认为 "这部分逻辑应该 wrap 到 parser 中" 也是 ok 的。
{: .notice--info}