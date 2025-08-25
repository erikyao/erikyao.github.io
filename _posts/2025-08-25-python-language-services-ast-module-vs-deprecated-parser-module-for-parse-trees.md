---
title: "Python Language Services: `ast` module (vs deprecated `parser` module for parse trees)"
description: ""
category: Compiler
tags: []
toc: true
toc_sticky: true
---

# Parse Trees vs ASTs

- Parse Tree = **(Concrete) Syntax Tree** = **100% syntactic** representation of the source code
- AST = **Abstract Syntax Tree** = **less syntactic, more semantic**

Why do we need ASTs when we already have parse trees?

## AST merit 1: Semantic analysis (type checking, name resolution, scope)

E.g. an addition experssion:

- Parse tree: multiple nodes with a skeleton of `Expr -> Term '+' Term`
    - But it does not directly tell you "this is a binary operation with operator `+`". They’re buried in grammar expansions.
- AST: you have a direct node, `BinaryOp('+', left, right)`
    - That makes it possible to check operator types, resolve variable references, and build symbol tables directly.

You could do it with a parse tree, but you’d be constantly untangling irrelevant grammar nodes. With complex languages, this quickly becomes intractable.
{: .notice--info}

## AST merit 2: Desugaring and normalization

Different syntactic forms that mean the same thing should reduce to the same AST. E.g. `for (i=0; i<n; i++) body;` and `while (i<n) { body; i++; }`.

This makes optimization and later compilation steps possible. Without an AST, you’d need to duplicate analysis for every syntactic variant.
{: .notice--info}

## AST merit 3: Optimization and transformations

Optimizations like constant folding, inlining, loop unrolling, etc. operate on _semantic constructs_ (e.g. ASTs).

In principle you could optimize on a parse tree, but it's not very pragmatic. E.g. Constant folding on the AST is trivial. On the parse tree, you'd have to traverse through many redundant nodes.
{: .notice--info}

## AST merit 4: IR generation and (target) code generation

ASTs are easier to be mapped to IR or target code. E.g. `(a+b)` vs `a+b`, they should have the same IR or target code, but their: 

- parse trees are different
- ASTs are identical

This can be crucial, because you want identical IR or target code for semantically identical code.
{: .notice--info}

## AST merit 5: Tooling (refactoring, static analysis, IDEs)

IDEs, linters, and refactoring tools rely on ASTs to understand the structure of code.

E.g. renaming a variable `x` to `y`:

- AST: find all identifier nodes named `x`.
- Parse tree: you’d need to navigate a jungle of grammar rules to even find identifiers.

# `parser` module (deleted since v3.9)

- v3.8 Docs: [`parser` — Access Python parse trees](https://docs.python.org/3.8/library/parser.html)
- v3.8 Source Code: `cpython/Modules/parsermodule.c` inside [v3.8.16](https://github.com/python/cpython/releases/tag/v3.8.16)

Example (run with Python 2 on [OneCompiler](https://onecompiler.com/python2)):

```python
import parser
import pprint

# Your source code as a string
source_code = "3"

# Parse the source code into a parse tree
st = parser.suite(source_code)

# Convert to a nested tuple representation
parse_tree = st.totuple()

# Print the parse tree (warning: this will be very verbose!)
pprint.pprint(parse_tree)

# Output:
# (257,
#  (267,
#   (268,
#    (269,
#     (270,
#      (327,
#       (304,
#        (305,
#         (306,
#          (307,
#           (308,
#            (310,
#             (311,
#              (312,
#               (313,
#                (314,
#                 (315, (316, (317, (318, (2, '3'))))),
#                 (14, '+'),
#                 (315, (316, (317, (318, (2, '4')))))))))))))))))),
#    (4, ''))
#  ),
#  (4, ''),
#  (0, '')
# )
```

# `ast` module

- Docs: [`ast` — Abstract Syntax Trees](https://docs.python.org/3/library/ast.html)
- Source Code: [cpython/Lib/ast.py](https://github.com/python/cpython/blob/3.13/Lib/ast.py)

Example:

```python
import ast

# Your source code
source_code = "3+4"

# Parse the source code into an AST
tree = ast.parse(source_code)

# Print the AST in a readable format
print(ast.dump(tree, indent=4))

# Output:
# Module(
#     body=[
#         Expr(
#             value=BinOp(
#                 left=Constant(value=3),
#                 op=Add(),
#                 right=Constant(value=4)
#             )
#         )
#     ],
#     type_ignores=[]
# )
```