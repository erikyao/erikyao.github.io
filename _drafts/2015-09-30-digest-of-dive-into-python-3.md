---
layout: post
title: "Digest of <i>Dive into Python 3</i>"
description: ""
category: Python
tags: [Python-101]
---
{% include JB/setup %}

## CHAPTER 1. YOUR FIRST PYTHON PROGRAM

<pre class="prettyprint linenums">
# humansize.py

SUFFIXES = {1000: ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            1024: ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']}

def approximate_size(size, a_kilobyte_is_1024_bytes=True):
    '''Convert a file size to human-readable form.
        
    Keyword arguments:
    size -- file size in bytes
    a_kilobyte_is_1024_bytes -- if True (default), use multiples of 1024
                                if False, use multiples of 1000
    Returns: string
    
    '''
    if size < 0:
        raise ValueError('number must be non-negative')

    multiple = 1024 if a_kilobyte_is_1024_bytes else 1000

    for suffix in SUFFIXES[multiple]:
        size /= multiple
        if size < multiple:
            return '{0:.1f} {1}'.format(size, suffix)

    raise ValueError('number too large')

if __name__ == '__main__':
    print(approximate_size(1000000000000, False))
    print(approximate_size(1000000000000))
</pre>

- Python functions have no explicit `begin` or `end`, and no curly braces to mark where the function code starts and stops. The only delimiter is a colon (`:`) and the indentation of the code itself.
	- 缩进请用 spaces 不要用 \\t
	- It doesn’t need to be 4 spaces, it just needs to be consistent. 
	- The first line that is not indented marks the end of the function.
- The `print()` function is built-in; you’ll never see an explicit declaration of it. You can just use it, anytime, anywhere.
- The keyword `def` starts the function declaration.
- Python functions do not specify the datatype of their return value; they don’t even specify whether or not they return a value. 
	- In fact, every Python function returns a value; if the function ever executes a `return` statement, it will return that value, otherwise it will return `None`, the Python null value.)
- In Python, variables are never explicitly typed. Python figures out what type a variable is and keeps track of it internally.
- Python allows function arguments to have default values; if the function is called without the argument, the argument gets its default value.
- Furthermore, arguments can be specified in any order by using named arguments.
	- Once you have a single named argument, all arguments to the right of that need to be named arguments too.
- You can export this function to console by `from humansize import approximate_size`.
- A `docstring` (the `'''` part), if it exists, must be the first thing defined in a function (that is, on the next line after the function declaration).
	- `docstring`s are for people who are going to be using your code without needing or wanting to know how it works. 
	- `docstring`s can be turned into actual documentation. 
	- 类似于 JavaDoc，不同于一般的 comment
	
### 1.4. THE `import` SEARCH PATH

Python looks in all the directories defined in `sys.path` (in its order) when you try to import a module.

<pre class="prettyprint linenums">
&gt;&gt;&gt; import sys

# show sys.path
&gt;&gt;&gt; sys.path 

# add an entry in sys.path
&gt;&gt;&gt; sys.path.insert(0, '/home/mark/diveintopython3/examples') # The effect lasts as long as Python is running.
</pre>

Not all modules are stored as .py files. Some are built-in modules; they are actually baked right into Python itself. Built-in modules behave just like regular modules, but their Python source code is not available, because they are not written in Python! (Like Python itself, these built-in modules are written in C.)

### 1.5. EVERYTHING IS AN OBJECT

<pre class="prettyprint linenums">
&gt;&gt;&gt; import humansize

&gt;&gt;&gt; print(humansize.approximate_size(4096, True))
4.0 KiB

# __doc__ is a built-in attribute for functions.
# its value is the docstring
&gt;&gt;&gt; print(humansize.approximate_size.__doc__)
Convert a file size to human-readable form.
......
</pre>

When you want to use functions defined in imported modules, you need to include the module name. So
you can’t just say `approximate_size`; it must be `humansize.approximate_size`.

In Python, the definition of an object is looser. 

- Some objects have neither attributes nor methods, but they could. 
- Not all objects are subclassable. 
- But everything is an object in the sense that it can be assigned to a variable or passed as an argument to a function.

You may have heard the term “first-class object” in other programming contexts.

- In Python, functions are first-class objects. You can pass a function as an argument to another function. 
- Modules are first-class objects. You can pass an entire module as an argument to a function. 
- Classes are first-class objects, and individual instances of a class are also first-class objects.

### 1.7. EXCEPTIONS

Unlike Java, Python functions don’t declare which exceptions they might raise. It’s up to you to determine what possible exceptions you need to catch.

If you know a line of code may raise an exception, you should handle the exception using a `try-except` block.

<pre class="prettyprint linenums">
try:
    from lxml import etree
except ImportError:
    import xml.etree.ElementTree as etree
</pre>

By the end of this `try-except` block, you have imported some module and named it `etree`. Since both modules implement a common API, the rest of your code doesn’t need to keep checking which module got imported. And since the module that did get imported is always called `etree`, the rest of your code doesn’t need to be littered with if statements to call differently-named modules.

### 1.10. RUNNING SCRIPTS

<pre class="prettyprint linenums">
if __name__ == '__main__':
    ......
</pre>

- Like C, Python uses `==` for comparison and `=` for assignment. Unlike C, Python does not support in-line assignment, so there’s no chance of accidentally assigning the value you thought you were comparing.

So what makes this if statement special? Well, modules are objects, and all modules have a built-in attribute `__name__`. A module’s `__name__` depends on how you’re using the module. If you import the module, then `__name__` is the module’s filename, without a directory path or file extension.

But you can also run the module directly as a standalone program, in which case `__name__` will be a special default value, `__main__`. Python will evaluate this if statement, find a true expression, and execute the if code block.

## CHAPTER 2. NATIVE DATATYPES

### 2.1. DIVING IN

Python has many native datatypes:

- `Bytes` and `byte arrays`, e.g. a JPEG image file.
- `Lists` are ordered sequences of values.
- `Tuples` are ordered, immutable sequences of values.
- `Sets` are unordered bags of values.
- `Dictionaries` are unordered bags of key-value pairs.

### 2.2. BOOLEANS

In certain places (like if statements), Python expects an expression to evaluate to a boolean value. These places are called **boolean contexts**. You can use virtually any expression in a boolean context, and Python will try to determine its truth value. Different datatypes have different rules about which values are true or false in a boolean context.

Due to some legacy issues left over from Python 2, booleans can be treated as numbers. `True` is 1; `False` is 0. 

### 2.3. NUMBERS

Python supports both integers and floating point numbers. There’s no type declaration to distinguish them; Python tells them apart by the presence or absence of a decimal point.

<pre class="prettyprint linenums">
&gt;&gt;&gt; type(1) 
&lt;class 'int'&gt;
&gt;&gt;&gt; isinstance(1, int) 
True
&gt;&gt;&gt; 1 + 1 
2
&gt;&gt;&gt; 1 + 1.0 
2.0
&gt;&gt;&gt; type(2.0)
&lt;class 'float'&gt;

&gt;&gt;&gt; float(2) 
2.0
&gt;&gt;&gt; int(2.0) 
2
&gt;&gt;&gt; int(2.5) 
2
&gt;&gt;&gt; int(-2.5) 
-2

&gt;&gt;&gt; 11 / 2
5.5
&gt;&gt;&gt; 11 // 2
5
&gt;&gt;&gt; −11 // 2
−6
&gt;&gt;&gt; 11.0 // 2
5.0
&gt;&gt;&gt; 11 ** 2
121
&gt;&gt;&gt; 11 % 2 
1

&gt;&gt;&gt; import fractions
&gt;&gt;&gt; x = fractions.Fraction(1, 3)
&gt;&gt;&gt; x
Fraction(1, 3)
&gt;&gt;&gt; x * 2
Fraction(2, 3)
&gt;&gt;&gt; fractions.Fraction(6, 4)
Fraction(3, 2)

&gt;&gt;&gt; import math
&gt;&gt;&gt; math.pi
3.1415926535897931
&gt;&gt;&gt; math.sin(math.pi / 2)
1.0
&gt;&gt;&gt; math.tan(math.pi / 4)
0.99999999999999989
</pre>

- Python 2 had separate types for `int` and `long`.

### 2.4. LISTS

A better analogy would be to the `ArrayList` class, which can hold arbitrary objects and can expand dynamically as new items are added.

<pre class="prettyprint linenums">
&gt;&gt;&gt; a_list = ['a', 'b', 'mpilgrim', 'z', 'example'] 
&gt;&gt;&gt; a_list
['a', 'b', 'mpilgrim', 'z', 'example']
&gt;&gt;&gt; a_list[0] 
'a'
&gt;&gt;&gt; a_list[-1]
'example'
&gt;&gt;&gt; a_list[-3]
'mpilgrim'

&gt;&gt;&gt; a_list[1:3] 
['b', 'mpilgrim']
&gt;&gt;&gt; a_list[1:-1] 
['b', 'mpilgrim', 'z']
&gt;&gt;&gt; a_list[0:3] 
['a', 'b', 'mpilgrim']
&gt;&gt;&gt; a_list[:3] 
['a', 'b', 'mpilgrim']
&gt;&gt;&gt; a_list[3:] 
['z', 'example']
&gt;&gt;&gt; a_list[:] 
['a', 'b', 'mpilgrim', 'z', 'example']

&gt;&gt;&gt; a_list = ['a']
&gt;&gt;&gt; a_list = a_list + [2.0, 3] 
&gt;&gt;&gt; a_list 
['a', 2.0, 3]
&gt;&gt;&gt; a_list.append(True) 
&gt;&gt;&gt; a_list
['a', 2.0, 3, True]
&gt;&gt;&gt; a_list.extend(['four', 'Ω']) 
&gt;&gt;&gt; a_list
['a', 2.0, 3, True, 'four', 'Ω']
&gt;&gt;&gt; a_list.insert(0, 'Ω') 
&gt;&gt;&gt; a_list
['Ω', 'a', 2.0, 3, True, 'four', 'Ω']

&gt;&gt;&gt; a_list = ['a', 'b', 'c']
&gt;&gt;&gt; a_list.extend(['d', 'e', 'f'])
&gt;&gt;&gt; a_list
['a', 'b', 'c', 'd', 'e', 'f']
&gt;&gt;&gt; a_list.append(['g', 'h', 'i'])
&gt;&gt;&gt; a_list
['a', 'b', 'c', 'd', 'e', 'f', ['g', 'h', 'i']]

&gt;&gt;&gt; a_list = ['a', 'b', 'new', 'mpilgrim', 'new']
&gt;&gt;&gt; a_list.count('new') 
2
&gt;&gt;&gt; 'new' in a_list 
True
&gt;&gt;&gt; 'c' in a_list
False
&gt;&gt;&gt; a_list.index('mpilgrim') 
3
&gt;&gt;&gt; a_list.index('new') 
2

&gt;&gt;&gt; a_list = ['a', 'b', 'new', 'mpilgrim', 'new']
&gt;&gt;&gt; a_list[1]
'b'
&gt;&gt;&gt; del a_list[1] 
&gt;&gt;&gt; a_list
['a', 'new', 'mpilgrim', 'new']
&gt;&gt;&gt; a_list.remove('new')
&gt;&gt;&gt; a_list
['a', 'mpilgrim', 'new']
&gt;&gt;&gt; a_list.remove('new')
&gt;&gt;&gt; a_list
['a', 'mpilgrim']

&gt;&gt;&gt; a_list = ['a', 'b', 'new', 'mpilgrim']
&gt;&gt;&gt; a_list.pop() 
'mpilgrim'
&gt;&gt;&gt; a_list
['a', 'b', 'new']
&gt;&gt;&gt; a_list.pop(1) 
'b'
&gt;&gt;&gt; a_list
['a', 'new']

if []: # false
    ......

if ['a']: # true
    ......
</pre>

- If the negative index is confusing to you, think of it this way: `a_list[-n] == a_list[len(a_list) - n]`. So in this list, `a_list[-3] == a_list[5 - 3] == a_list[2]`.
- You can get a part of a list, called a “slice”, by specifying two indices. The return value is a new list containing all the items of the list.
- `a_list[:]` is shorthand for making a complete copy of a list.
- The `+` operator concatenates lists to create a new list.
	- However, if memory is a concern, you should be aware that list concatenation creates a second list in memory.
	- In this case, that new list is immediately assigned to the existing variable `a_list`. So this line of code is really a two-step process — concatenation then assignment — which can (temporarily) consume a lot of memory when you’re dealing with large lists.
- List items do not need to be unique.
- The `extend()` method takes a single argument, which is always a list, and adds each of the items of that list to `a_list`.
- On the other hand, the `append()` method takes a single argument, which can be any datatype.
- The `index()` method finds the first occurrence of a value in the list.
- The `remove()` method takes a value and removes the first occurrence of that value from the list.
- When called without arguments, the `pop()` list method removes the last item in the list and returns the value it removed.
	- You can pop arbitrary items from a list. Just pass a positional index to the `pop()` method.
- Empty lists are false; all other lists are true.

### 2.5. TUPLES

A tuple is an immutable list. A tuple can not be changed in any way once it is created.

<pre class="prettyprint linenums">
&gt;&gt;&gt; a_tuple = ("a", "b", "mpilgrim", "z", "example")

&gt;&gt;&gt; type((False))
&lt;class 'bool'&gt;
&gt;&gt;&gt; type((False,))
&lt;class 'tuple'&gt;

&gt;&gt;&gt; v = ('a', 2, True)
&gt;&gt;&gt; (x, y, z) = v
&gt;&gt;&gt; x
'a'
&gt;&gt;&gt; y
2
&gt;&gt;&gt; z
True

&gt;&gt;&gt; (MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY) = range(7) 
&gt;&gt;&gt; MONDAY 
0
&gt;&gt;&gt; TUESDAY
1
</pre>

- A tuple is defined in the same way as a list, except that the whole set of elements is enclosed in parentheses instead of square brackets.
- Tuples are faster than lists. If you’re defining a constant set of values and all you’re ever going to do with it is iterate through it, use a tuple instead of a list. 
- Some tuples can be used as dictionary keys (specifically, tuples that contain immutable values like strings, numbers, and other tuples). Lists can never be used as dictionary keys, because lists are not immutable.
- Tuples can be converted into lists, and vice-versa. The built-in `tuple()` function takes a list and returns a tuple with the same elements, and the `list()` function takes a tuple and returns a list. 
	- In effect, `tuple()` freezes a list, and `list()` thaws a tuple.
- An empty tuple is false. Any tuple with at least one item is true.
- To create a tuple of one item, you need a comma after the value. Without the comma, Python just assumes you have an extra pair of parentheses, which is harmless, but it doesn’t create a tuple.
- Here’s a cool programming shortcut: in Python, you can use a tuple to assign multiple values at once.
	- Technically, the `range()` function returns an iterator, not a list or a tuple.
	
### 2.6. SETS

A set is an unordered “bag” of unique values. A single set can contain values of any immutable datatype. Once you have two sets, you can do standard set operations like union, intersection, and set difference.

<pre class="prettyprint linenums">
&gt;&gt;&gt; a_set = {1}

&gt;&gt;&gt; a_list = ['a', 'b', 'mpilgrim', True, False, 42]
&gt;&gt;&gt; a_set = set(a_list) 
&gt;&gt;&gt; a_set 
{'a', False, 'b', True, 'mpilgrim', 42}

&gt;&gt;&gt; a_set = set()
&gt;&gt;&gt; a_set
set()

&gt;&gt;&gt; not_sure = {} 
&gt;&gt;&gt; type(not_sure)
&lt;class 'dict'&gt;

&gt;&gt;&gt; a_set = {1, 2}
&gt;&gt;&gt; a_set.add(4) 
&gt;&gt;&gt; a_set
{1, 2, 4}
&gt;&gt;&gt; a_set.add(1)
&gt;&gt;&gt; a_set
{1, 2, 4}

&gt;&gt;&gt; a_set = {1, 2, 3}
&gt;&gt;&gt; a_set
{1, 2, 3}
&gt;&gt;&gt; a_set.update({2, 4, 6}) 
&gt;&gt;&gt; a_set 
{1, 2, 3, 4, 6}
&gt;&gt;&gt; a_set.update({3, 6, 9}, {1, 2, 3, 5, 8, 13}) 
&gt;&gt;&gt; a_set
{1, 2, 3, 4, 5, 6, 8, 9, 13}
&gt;&gt;&gt; a_set.update([10, 20, 30]) 
&gt;&gt;&gt; a_set
{1, 2, 3, 4, 5, 6, 8, 9, 10, 13, 20, 30}

&gt;&gt;&gt; a_set = {1, 3, 6, 10, 15, 21, 28, 36, 45}
&gt;&gt;&gt; a_set
{1, 3, 36, 6, 10, 45, 15, 21, 28}
&gt;&gt;&gt; a_set.discard(10) ①
&gt;&gt;&gt; a_set
{1, 3, 36, 6, 45, 15, 21, 28}
&gt;&gt;&gt; a_set.discard(10)
&gt;&gt;&gt; a_set
{1, 3, 36, 6, 45, 15, 21, 28}
&gt;&gt;&gt; a_set.remove(21)
&gt;&gt;&gt; a_set
{1, 3, 36, 6, 45, 15, 28}
&gt;&gt;&gt; a_set.remove(21)
Traceback (most recent call last):
File "&lt;stdin&gt;", line 1, in &lt;module&gt;
KeyError: 21
</pre>

- Sets are actually implemented as classes.
- You can actually call the `update()` method with any number of arguments.
- There are three ways to remove individual values from a set:
	- If you call the `discard()` method with a value that doesn’t exist in the set, it does nothing. No error; it’s just a no-op. 
	- If the value doesn’t exist in the set, the `remove()` method raises a KeyError exception.
	- Like lists, sets have a `pop()` method. However, since sets are unordered, there is no “last” value in a set, so there is no way to control which value gets removed. It is completely arbitrary.
		- Attempting to pop a value from an empty set will raise a `KeyError` exception.
- The `clear()` method removes all values from a set, leaving you with an empty set. This is equivalent to `a_set = set()`
- Any two sets that contain all the same values (even with difference orders) are considered equal.
- An empty set is false. Any set with at least one item is true.

### 2.7. DICTIONARIES























