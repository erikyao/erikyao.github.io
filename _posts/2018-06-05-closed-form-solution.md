---
layout: post
title: "Closed-Form Solution"
description: ""
category: Math
tags: []
---
{% include JB/setup %}

P.S. 讲了这么多，其实 closed-form expression 就是 "解析解"，analytic expression。这两者其实有微妙的差别，但大体上你理解成是同一事物是 OK 的。而且你还能见到 "analytic closed-form solution" 这种表达方式，真的不需要 care 太多。

-----

Quote from [What does closed form solution usually mean?](https://math.stackexchange.com/a/2061844)

-----

Let us assume, $f(x)=0$ is to be solved for $x$.  

If an equation $f(x)=0$ has no **closed-form solution**, the equation has no solution which can be expressed as a **closed-form expression**.

[Wikipedia: Closed-form expression](https://en.wikipedia.org/wiki/Closed-form_expression)

> In mathematics, a closed-form expression is a mathematical expression that can be evaluated in a finite number of operations. It may contain constants, variables, certain "well-known" operations (e.g., $+ − \times \div$), and functions (e.g., $n$-th root, exponent, logarithm, trigonometric functions, and inverse hyperbolic functions), but usually no limit. The set of operations and functions admitted in a closed-form expression may vary with author and context.

(E.g. $x={-b\pm {\sqrt {b^{2}-4ac}} \over 2a}$ is the closed-form solution to $ax^{2}+bx+c=0$)

Let us say, a (local) closed-form inverse $f^{−1}$ is a (local) inverse which can be expressed as closed-form expression.

Because of $f(x)=0$ and the definition of a (local) inverse $f^{−1}(f(x))=x$, the following holds: $f^{−1}(f(x))=f^{−1}(0), x=f^{−1}(0)$. And therefore: If an equation $f(x)=0$ has no closed-form solution, the function $f$ has no local closed-form inverse, or a local closed-form inverse exists but is not defined for the argument $0$ of the right side of the equation. This means, $x$ cannot be isolated on only one side of the equation

- by applying a local closed-form inverse,
- by only applying the local closed-form inverses and inverse operations of the closed-form functions respective operations which are contained in the expression $f(x)$.

The existence of a local closed-form inverse is a sufficient but not a necessary criterion for the existence of a closed-form solution.

The elementary functions are a special kind of closed-form expressions. 

[Wikipedia: Elementary function](https://en.wikipedia.org/wiki/Elementary_function):

> In mathematics, an elementary function is a function of one variable which is the composition of a finite number of arithmetic operations ($+ − \times \div$), exponentials, logarithms, constants, and solutions of algebraic equations (a generalization of $n$-th roots)

If $f$ is an elementary function, the following statements are equivalent:

- $f$ is generated from its only argument variable in a finite number of steps by performing only arithmetic operations, power functions with integer exponents, root functions, exponential functions, logarithm functions, trigonometric functions, inverse trigonometric functions, hyperbolic functions and/or inverse hyperbolic functions.
- $f$ is generated from its only argument variable in a finite number of steps by performing only arithmetic operations, exponentials and/or logarithms.
- $f$ is generated from its only argument variable in a finite number of steps by performing only explicit algebraic functions, exponentials and/or logarithms.

Whereas _Joseph Fels Ritt_ allows explicit and implicit algebraic functions, _Timothy Chow_ restricts the approved algebraic operations to the explicit algebraic functions, that are the arithmetic operations.