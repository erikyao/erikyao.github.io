---
title: "What Can a Parser Return? Six Output Forms, LL vs LR"
description: ""
category: Compiler
tags: []
toc: true
toc_sticky: true
---

# Output Type 1: Boolean (i.e. acceptance only)

Summary:

- Simplest case: parser just checks whether the input string is valid.
- Scenario: 
    - ✅ regex engine
    - ✅ syntax checker

For $LL$ parsers, each parsing function returns `True` if parsing matched, `False` otherwise. E.g.

```python
def program() -> bool:
    return statements()
```

For $LR$ parsers, acceptance is implicit: if the parser (i.e. the entry function) consumes all tokens and ends in the accept state, return `True`; otherwise `False`.

# Output Type 2: Parse Tree

Summary:

- Case: shows every rule applied in the grammar.
- Scenario: 
    - ✅ debugging grammars
    - ✅ teaching purposes
    - ✅ when you need exact syntax recovery (e.g. pretty-printers, formatters)
    - ❌ too verbose for compilers

For $LL$ parsers:

- Each parsing function builds a node for its non-terminal, recursively attaches child results, and returns the tree.
- Very natural because recursion mirrors the grammar.

For $LR$ parsers:

- Each grammar symbol on the stack carries a pointer to a node.
- On reduction, create a parent node that hubs those popped children.
- Push the parent node back into stack.

# Output Type 3: AST

Summary:

- Scenario: ✅ most common output in compilers

For $LL$ parsers: similar to returning parse trees, but now returns a simplified AST node (e.g. [BinOp](/compiler/2025/08/25/python-language-services-ast-module-vs-deprecated-parser-module-for-parse-trees#ast-module)).

E.g. when parsing `3+4`:

```python
def addition() -> ParseTree:
    left = term()  # A sub-parse tree like `term -> number -> 3`
    expect("+")
    right = term()
    
    return ParseTree("+", left, right)


def addition() -> AST:
    left = Constant()  # An abstract grammar token `Constant(value=3)`
    expect("+")
    right = Constant()
    
    return BinOp("+", left, right) 
```

For $LR$ parsers: 

- Have to specify _semantic actions_ to rules/productions in the grammar
- When performing a reduction, its associated _semantic action_ is performed to created an AST node

E.g.

```ebnf
Expr : Expr '+' Term { $$ = make_binop('+', $1, $3); }
```

# Output Type 4: Direct Evaluation (i.e. interactive interpreter style)

Summary:

- Case: instead of building a tree, the parser directly executes code as it parses.
    - Downside: ❌ you lose structure, so you can’t do later passes (optimizations, codegen).
- Scenario: ✅ calculator

For $LL$ parsers: similar to returning parse trees or ASTs, but now returns the result of evaluation. E.g.:

```python
def addition() -> int:
    left = term()  # int of 3
    expect("+")
    right = term()  # int of 4
    
    return left + right
```

For $LR$ parsers: similar to returning ASTs, have to specify _semantic actions_ for evaluation. E.g.:

```python
Expr : Expr '+' Term { $$ = $1 + $3; }
```

# Output Type 5: Syntax-Directed Translation (i.e. to emit code/text directly; I/O instead of returning)

Summary:

- Case: parser writes directly to another representation during parsing.
- Scenario: ✅ source-to-source translator
    - E.g.: a Python -> C translator, which emits C code as it recognizes Python constructs.
- Downside: ❌ messy and hard to maintain if you need semantic analysis later.

<div class="notice--info" markdown="1">
Note that there are other types of translation:

- **Semantic-Directed Translation:** Translation based on the semantic structure rather than just syntactic structure
- **Multi-Pass Translation:** Instead of translating during parsing, this approach first builds an IR and then performs translation in separate passes. 
    - This allows for more complex analysis and optimization.
- **Attribute-Directed Translation:** Similar to syntax-directed but focuses on propagating and computing attributes through the parse tree, which then drive the translation decisions.
</div>

For $LL$ parsers: every parser function performs output as they recurse. E.g. in `if_statement()`, output the equivalent C-style `if`-statement.

For $LR$ parsers: have to specify _semantic actions_ to emit code. E.g.:

```ebnf
if_stmt: IF condition COLON statements
         {
             printf("if (%s) {\n%s\n}\n", $2, $4);
         }
```

which means whenever we reduce `IF condition COLON statements` to a `if_stmt` in Python, we output in C like:

```c
if (<condition>) {
    <statements>
}
```

Note that there should be similar _semantic actions_ for `condition` and `statements`

# Output Type 6: IR

Summary:

- Case: some parsers skip ASTs and generate an IR directly 
- Scenario: 
    - ❌ rare in modern compilers, usually AST -> IR is cleaner
    - ✅ yacc/bison actions that emit three-address code during parsing

Can be seen as a variant of [Output Type 3: AST](/compiler/2025/08/25/what-can-a-parser-return-6-output-forms-ll-vs-lr#output-type-3-ast).