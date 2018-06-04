---
layout: post
title: "C++ Primitive Built-in Types"
description: ""
category: C++
tags: []
---
{% include JB/setup %}

整理自 _C++ Primer, 5th Edition_

-----

Some languages, such as Smalltalk and Python, check types at run time. In contrast, C++ is a statically typed language; type checking is done at compile time. As a consequence, the compiler must know the type of every name used in the program.

C++ allows programmers to define types that include operations as well as data. <font color="red">A major design goal of C++ is to let programmers define their own types that are as easy to use as the built-in types.</font>

C++ primitive types that include:

- the arithmetic types
- a special type `void`.

## Arithmetic Types

<!--
Type,	Meaning,	Minimum Size
bool,	boolean,	NA
char,	character,	8 bits
wchar_t,	wide character,	16 bits
char16_t,	Unicode character,	16 bits
char32_t,	Unicode character,	32 bits
short,	short integer, 16 bits
int,	integer,	16 bits
long,	long integer, 32 bits
long long,	long integer,	64 bits
float,	single-precision floating-point,	6 significant digits
double,	double-precision floating-point,	10 significant digits
long double,	extended-precision floating-point,	10 significant digits
-->

| Type        | Meaning                           | Minimum Size          |
|-------------|-----------------------------------|-----------------------|
| bool        | boolean                           | NA                    |
| char        | character                         | 8 bits                |
| wchar_t     | wide character                    | 16 bits               |
| char16_t    | Unicode character                 | 16 bits               |
| char32_t    | Unicode character                 | 32 bits               |
| short       | short integer                     | 16 bits               |
| int         | integer                           | 16 bits               |
| long        | long integer                      | 32 bits               |
| long long   | long integer                      | 64 bits               |
| float       | single-precision floating-point   | 6 significant digits  |
| double      | double-precision floating-point   | 10 significant digits |
| long double | extended-precision floating-point | 10 significant digits |

The size of—that is, the number of bits in—the arithmetic types varies across machines. The standard guarantees minimum sizes as listed in Table 2.1. However, compilers are allowed to use larger sizes for these types. Because the number of bits varies, the largest (or smallest) value that a type can represent also varies. 比如 int 在 32-bit 系统的 Visual Studio 2008 下就是 32 bits 长的。规范只规定了诸如 "int: Not smaller than short. At least 16 bits." 这样的大规范，不同的机器、不同的编译器可以有不同的 type size。（源出：[Variables and types](http://www.cplusplus.com/doc/tutorial/variables)）

也有些类型是定长的，比如 `__int32` 一定是 32 bits，具体见 [Data Type Ranges](https://msdn.microsoft.com/zh-cn/library/s3f49ktz.aspx) 和 [What does the C++ standard state the size of int, long type to be?](http://stackoverflow.com/questions/589575/what-does-the-c-standard-state-the-size-of-int-long-type-to-be)。

A `char` is guaranteed to be big enough to hold numeric values corresponding to the characters in the machine’s basic character set. That is, a `char` is the same size as a single machine byte.

> The smallest chunk of addressable memory is referred to as a “byte.” The basic unit of storage, usually a small number of bytes, is referred to as a “word.” On most machines a byte contains 8 bits and a word is either 32 or 64 bits, that is, 4 or 8 bytes.

A `signed` type represents negative or positive numbers (including zero); an `unsigned` type represents only values >= zero.

Unlike the other integer types, there are three distinct basic character types: 

* `char`
* `signed char`
* `unsigned char`

不要天真地以为一定是 `(plain) char == signed char`，因为有的系统是 `(plain) char == signed char`，有的系统是 `(plain) char == unsigned char`，这也是由编译器说了算的。

The standard does not define how signed types are represented, but does specify that the range should be evenly divided between positive and negative values. Hence, an 8-bit `signed char` is guaranteed to be able to hold values from –127 through 127; most modern machines use representations that allow values from –128 through 127.

The remaining integral types represent integer values of (potentially) different sizes. The language guarantees that an `int` will be at least as large as `short`, a `long` at least as large as an `int`, and `long long` at least as large as `long`. The type `long long` was introduced by the new standard.

Typically, `float`s are represented in one word (32 bits), `double`s in two words (64 bits), and `long double`s in either three or four words (96 or 128 bits). The type `long double` is often used as a way to accommodate special-purpose floating-point hardware; its precision is more likely to vary from one implementation to another.

### Advice: Deciding which Type to Use
   
<font color="red">C++, like C, is designed to let programs get close to the hardware when necessary.</font> The arithmetic types are defined to cater to the peculiarities of various kinds of hardware. Accordingly, the number of arithmetic types in C++ can be bewildering. Most programmers can (and should) ignore these complexities by restricting the types they use. A few rules of thumb can be useful in deciding which type to use:  

* Use an unsigned type when you know that the values cannot be negative.
* Use `int` for integer arithmetic. `short` is usually too small and, in practice, `long` often has the same size as `int`. If your data values are larger than the minimum guaranteed size of an `int`, then use `long long`.
* Do not use plain `char` or `bool` in arithmetic expressions. Use them only to hold characters or truth values. Computations using `char` are especially problematic because `char` is `signed` on some machines and `unsigned` on others. If you need a tiny integer, explicitly specify either `signed char` or `unsigned char`.
* Use `double` for floating-point computations; `float` usually does not have enough precision, and the cost of double-precision calculations versus single-precision is negligible. In fact, on some machines, double-precision operations are faster than single. The precision offered by `long double` usually is unnecessary and often entails considerable run-time cost.

## Type Conversions

```cpp
bool b = 42; 			// b is true
int i = b; 				// i has value 1
i = 3.14; 				// i has value 3
double pi = i; 			// pi has value 3.0
unsigned char c = -1; 	// assuming 8-bit chars, c has value 255
signed char c2 = 256; 	// assuming 8-bit chars, the value of c2 is undefined

int i = 42;
if (i) 					// condition will evaluate as true
	i = 0;
```

* When we assign one of the non-`bool` arithmetic types to a `bool` object, the result is false if the value is 0 and true otherwise.
* When we assign a `bool` to one of the other arithmetic types, the resulting value is 1 if the bool is true and 0 if the bool is false.
* When we assign a floating-point value to an object of integral type, the value is **truncated**. The value that is stored is the part before the decimal point.
* When we assign an integral value to an object of floating-point type, the fractional part is zero. Precision may be lost if the integer has more bits than the floating-point object can accommodate.
* If we assign an out-of-range value to an object of `unsigned` type, the result is the remainder of the value modulo the number of values the target type can hold. For example, an 8-bit `unsigned char` can hold values from 0 through 255, inclusive. If we assign a value outside this range, the compiler assigns the remainder of that value modulo 256. Therefore, assigning –1 to an 8-bit `unsigned char` gives that object the value 255.
* If we assign an out-of-range value to an object of signed type, the result is **undefined**. The program might appear to work, it might crash, or it might produce garbage values.

### Advice: Avoid Undefined and Implementation-Defined Behavior

Undefined behavior results from errors that the compiler is not required (and sometimes is not able) to detect. Even if the code compiles, a program that executes an undefined expression is in error.  

Unfortunately, programs that contain undefined behavior can appear to execute correctly in some circumstances and/or on some compilers. There is no guarantee that the same program, compiled under a different compiler or even a subsequent release of the same compiler, will continue to run correctly. Nor is there any guarantee that what works with one set of inputs will work with another.  

Similarly, programs usually should avoid implementation-defined behavior, such as assuming that the size of an `int` is a fixed and known value. Such programs are said to be **nonportable**. When the program is moved to another machine, code that relied on implementation-defined behavior may fail. Tracking down these sorts of problems in previously working programs is, mildly put, unpleasant.

### Caution: Don’t Mix Signed and Unsigned Types

If we use both `unsigned` and `int` values in an arithmetic expression, the `int` value ordinarily is converted to `unsigned`.

```cpp
unsigned u = 10;
int i = -42;
std::cout << i + i << std::endl; // prints -84
std::cout << u + i << std::endl; // if 32-bit ints, prints 4294967264

unsigned u1 = 42, u2 = 10;
std::cout << u1 - u2 << std::endl; // ok: result is 32
std::cout << u2 - u1 << std::endl; // ok: but the result will wrap
around

// WRONG: u can never be less than 0; the condition will always succeed
for (unsigned u = 10; u >= 0; --u)
	std::cout << u << std::endl;
```
	
Expressions that mix signed and unsigned values can yield surprising results when the signed value is negative. It is essential to remember that signed values are automatically converted to unsigned. For example, in an expression like `a * b`, if `a` is -1 and `b` is 1, then if both `a` and `b` are `int`s, the value is, as expected -1. However, if `a` is `int` and `b` is an `unsigned`, then the value of this expression depends on how many bits an int has on the particular machine. On our machine, this expression yields 4294967295.