---
title: "Python Structural Pattern Matching (`match`/`case` since Python 3.10)"
description: ""
category: Python
tags: []
toc: true
toc_sticky: true
---

# 0. Overview

Docs:

- [PEP 634 – Structural Pattern Matching: Specification](https://peps.python.org/pep-0634/)
- [PEP 635 – Structural Pattern Matching: Motivation and Rationale](https://peps.python.org/pep-0635/)
- [PEP 636 – Structural Pattern Matching: Tutorial](https://peps.python.org/pep-0636/)
- [What’s New In Python 3.10 >> New Features >> PEP 634: Structural Pattern Matching](https://docs.python.org/3/whatsnew/3.10.html#pep-634-structural-pattern-matching)

之前学习 OCaml 时就很喜欢它的 pattern matching，比如：

```ocaml
let rec len lst = 
    match lst with
    | [] -> 0
    | head :: tail -> 1 + (len tail)
```

Python 现在这个 pattern matching 功能也不错，远不止基础的 `switch`/`case`.

# 1. Simple Examples

## Matching Simple Values

```python
def describe_value(x):
    match x:
        case 0:
            return "Zero"
        case 1:
            return "One"
        case 2:
            return "Two"
        case _:
            return f"Something else: {x}"

print(describe_value(1))  # Outputs: One
print(describe_value(5))  # Outputs: Something else: 5
```

`_` is the wildcard, which matches all other cases not specified. If the wildcard not used and no match is found, then no `case` clause will be exectuted (i.e. nothing happens at all).

## Matching Sequences (Tuples, Lists)

```python
def analyze_point(point):
    match point:
        case (0, 0):
            return "Origin"
        case (0, y):
            return f"Y-axis at {y}"
        case (x, 0):
            return f"X-axis at {x}"
        case (x, y):
            return f"Point at ({x}, {y})"
        case _:
            return "Not a point"

print(analyze_point((0, 0)))      # Outputs: Origin
print(analyze_point((0, 5)))      # Outputs: Y-axis at 5
print(analyze_point((3, 4)))      # Outputs: Point at (3, 4)
```

## Matching Simple Values with Guards (using `if`)

```python
def categorize_number(num):
    match num:
        case n if n < 0:
            return "Negative"
        case 0:
            return "Zero"
        case n if n % 2 == 0:
            return "Positive even"
        case _:
            return "Positive odd"

print(categorize_number(-5))  # Outputs: Negative
print(categorize_number(0))   # Outputs: Zero
print(categorize_number(6))   # Outputs: Positive even
print(categorize_number(7))   # Outputs: Positive odd
```

## Matching Dicts/Objects with Guards (using `if`)

```python
def process_user(user):
    match user:
        case {"name": name, "age": age} if age < 18:
            return f"{name} is a minor"
        case {"name": name, "age": age}:
            return f"{name} is an adult"
        case {"name": name}:
            return f"{name}'s age is unknown"
        case _:
            return "Invalid user data"

print(process_user({"name": "Alice", "age": 25}))  # Outputs: Alice is an adult
print(process_user({"name": "Bob", "age": 15}))    # Outputs: Bob is a minor
print(process_user({"name": "Charlie"}))           # Outputs: Charlie's age is unknown
```

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

def describe_person(person):
    match person:
        case Person(name="Alice", age=age):
            return f"Alice is {age} years old"
        case Person(name=name, age=age) if age < 18:
            return f"{name} is a minor"
        case Person(name=name, age=age):
            return f"{name} is an adult"
        case _:
            return "Not a person"

print(describe_person(Person("Alice", 30)))  # Outputs: Alice is 30 years old
print(describe_person(Person("Bob", 15)))    # Outputs: Bob is a minor
```

## $\operatorname{OR}$ Patterns using `|`

```python
def check_status(status):
    match status:
        case "ok" | "OK" | "Ok" | "success":
            return "Everything is fine"
        case "error" | "failure" | "failed":
            return "Something went wrong"
        case _:
            return "Unknown status"

print(check_status("OK"))     # Outputs: Everything is fine
print(check_status("error"))  # Outputs: Something went wrong
```

其中每一个小 pattern (比如 `"ok"`) 都可以称为 subpattern，但 subpattern 不一定非要和 `|` 一起用，比如下面的例子也是有 subpattern.

## Binding Subpatterns using `as`

```python
def describe_rectangle(points):
    match points:
        case ((x1, y1) as p1, (x2, y2) as p2):
            return f"top-left is {p1}; buttom-right is {p2}."
        case ((x1, y1) as p1, (x2, y2) as p2, (x3, y3) as p3, (x4, y4) as p4):
            return f"top-left is {p1}; top-right is {p2}; buttom-left is {p3}, buttom-right is {p4}."
        case _:
            return "Not a rectangle"
```

# 2. A Complex Example

```python
def process_command(command):
    match command.split():
        case ["quit"]:
            return "Exiting program"
        case ["help"]:
            return "Available commands: quit, help, add, subtract, multiply"
        case ["add", x, y]:
            try:
                return f"Result: {float(x) + float(y)}"
            except ValueError:
                return "Error: Arguments must be numbers"
        case ["subtract", x, y]:
            try:
                return f"Result: {float(x) - float(y)}"
            except ValueError:
                return "Error: Arguments must be numbers"
        case ["multiply", x, y]:
            try:
                return f"Result: {float(x) * float(y)}"
            except ValueError:
                return "Error: Arguments must be numbers"
        case [cmd, *args]:
            return f"Unknown command: {cmd}"
        case _:
            return "Please enter a command"

print(process_command("add 5 3"))      # Outputs: Result: 8.0
print(process_command("multiply 4 7")) # Outputs: Result: 28.0
print(process_command("divide 10 2"))  # Outputs: Unknown command: divide
print(process_command("help"))         # Outputs: Available commands: quit, help, add, subtract, multiply
```

# 3. My Favourite

我经常遇到这样的场景：

```python
if (a is None) and (b is None):
    return 2  # number of None values

# If program executes down to this line, it implied that a and b cannot be None at the same time now.

if (a is None) or (b is None):  # Given the implication above, it means exactly one of a or b is None.
    return 1

# If program executes down to this line, it implied neither a nor b can be None now. 
return 0
```

用 `match`/`case` 写起来神清气爽：

```python
match (a is None, b is None):
    case (True, True):
        return 2  # number of None values
    case (True, False) | (False, True):
        return 1
    case (False, False):
        return 0
```