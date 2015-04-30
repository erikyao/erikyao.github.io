---
layout: post
title: "C++: Specifiers / Literal Prefix &amp; Suffix"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

## Specifiers

Specifiers modify the meanings of the basic built-in types and expand them to a much larger set. There are four specifiers: 

- `long`
- `short`
- `signed`
- `unsigned`.

The size hierarchy for floating point numbers is: `float`, `double`, and `long double`. “long float” is not a legal type. There are no `short` floating-point numbers.

When you are modifying an int with `short` or `long`, the keyword `int` is optional.

## Literal Prefix & Suffix

### Character & String Literals

| Prefix | Meaning                     | Type     | Example                   |
|--------|-----------------------------|----------|---------------------------|
| u      | utf-16                      | char16_t | `u'x'`                    |
| U      | utf-32                      | char32_t | `U'x'`                    |
| L      | wide character              | wchar_t  | `L"wide string"`          |
| u8     | utf-8 (string literal only) | char     | `u8"I'm a UTF-8 string."` |

### Integer Literals

| Suffix   | Type      | Example                    |
|----------|-----------|----------------------------|
| u or U   | unsigned  | `12U`                      |
| l or L   | long      | `12L` / `12UL` / `12LU`    |
| ll or LL | long long | `12LL` / `12ULL` / `12LLU` |

The minus sign, e.g. in `-47`, is not part of the literal. It is an operator that negates the value of its (literal) operand.

### Float-Point Literals

| Suffix | Type        |
|--------|-------------|
| f or F | float       |
| l or L | long double |