---
layout: post
title: "Python: variable scope in <i>if</i>-statement"
description: ""
category: Python
tags: [Python-101]
---
{% include JB/setup %}

In Java, this is wrong and you cannot even compile:

```java
public class HelloWorld{
     public static void main(String []args) {
        if (2 > 1) {
            int a = 2;
        } else {
            int a = 1;
        }

        System.out.println(a);
     }
}

// Error: cannot find symbol ‘a’
```

And you are used to such a practice:

```java
public class HelloWorld{
     public static void main(String []args) {
        int a = 0;

        if (2 > 1) {
            a = 2;
        } else {
            a = 1;
        }

        System.out.println(a);
     }
}

// OK
// Output: 2
```

In python, things are a little different:

```python
if __name__ == '__main__':
    # a = 0  # NOT NECESSARY!
    if 2 > 1:
        a = 2
    else:
        a = 1

    print(a)

# OK
# Output: 2
```

This is because [there are 4 types of scopes in python](https://docs.python.org/3/tutorial/classes.html#python-scopes-and-namespaces):

- the innermost scope, which is searched first, contains the local names
- the scopes of any enclosing functions, which are searched starting with the nearest enclosing scope, contains non-local, but also non-global names
- the next-to-last scope contains the current module’s global names
- the outermost scope (searched last) is the namespace containing built-in names

and [**control blocks like `if` and `while` don't count a innermost scope**](https://stackoverflow.com/a/2829642).

It's even legal to write:

```python
if __name__ == '__main__':
    if 1 > 2:
        a = 1

    print(a)

# UnboundLocalError: local variable 'a' referenced before assignment
```

although you'll get a `UnboundLocalError`. 

The error message suggests that `if 1 > 2: a = 1` declares a variable `a` but does not assign a value to it. 