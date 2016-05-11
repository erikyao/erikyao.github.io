---
layout: post
title: "Digest of <i>Dive into Python 3</i>"
description: ""
category: Python
tags: [Python-101, Book]
---
{% include JB/setup %}

ToC:

- [CHAPTER 1. YOUR FIRST PYTHON PROGRAM](#CHAPTER-1--YOUR-FIRST-PYTHON-PROGRAM)
	- [1.4. THE `import` SEARCH PATH](#1-4--THE-import-SEARCH-PATH)
	- [1.5. EVERYTHING IS AN OBJECT](#1-5--EVERYTHING-IS-AN-OBJECT)
	- [1.7. EXCEPTIONS](#1-7--EXCEPTIONS)
	- [1.10. RUNNING SCRIPTS](#1-10--RUNNING-SCRIPTS)
- [CHAPTER 2. NATIVE DATATYPES](#CHAPTER-2--NATIVE-DATATYPES)
	- [2.1. DIVING IN](#2-1--DIVING-IN)
	- [2.2. BOOLEANS](#2-2--BOOLEANS)
	- [2.3. NUMBERS](#2-3--NUMBERS)
	- [2.4. LISTS](#2-4--LISTS)
	- [2.5. TUPLES](#2-5--TUPLES)
	- [2.6. SETS](#2-6--SETS)
	- [2.7. DICTIONARIES](#2-7--DICTIONARIES)
	- [2.8. None](#2-8--None)
- [CHAPTER 3. COMPREHENSIONS](#CHAPTER-3--COMPREHENSIONS)
	- [3.2. WORKINGWITH FILES AND DIRECTORIES](#3-2--WORKINGWITH-FILES-AND-DIRECTORIES)
	- [3.3. LIST COMPREHENSIONS](#3-3--LIST-COMPREHENSIONS)
	- [3.4. DICTIONARY COMPREHENSIONS](#3-4--DICTIONARY-COMPREHENSIONS)
	- [3.5. SET COMPREHENSIONS](#3-5--SET-COMPREHENSIONS)
- [CHAPTER 4. STRINGS](#CHAPTER-4--STRINGS)
	- [4.1. SOME BORING STUFF YOU NEED TO UNDERSTAND BEFORE YOU CAN DIVE IN](#4-1--SOME-BORING-STUFF-YOU-NEED-TO-UNDERSTAND-BEFORE-YOU-CAN-DIVE-IN)
	- [4.2. UNICODE](#4-2--UNICODE)
	- [4.3. DIVING IN](#4-3--DIVING-IN)
	- [4.4. FORMATTING STRINGS](#4-4--FORMATTING-STRINGS)
		- [4.4.1. COMPOUND FIELD NAMES](#4-4-1--COMPOUND-FIELD-NAMES)
		- [4.4.2. FORMAT SPECIFIERS](#4-4-2--FORMAT-SPECIFIERS)
	- [4.5. OTHER COMMON STRING METHODS](#4-5--OTHER-COMMON-STRING-METHODS)
	- [4.6. STRINGS VS. BYTES](#4-6--STRINGS-VS--BYTES)
	- [4.7. POSTSCRIPT: CHARACTER ENCODING OF PYTHON SOURCE CODE](#4-7--POSTSCRIPT-CHARACTER-ENCODING-OF-PYTHON-SOURCE-CODE)
- [CHAPTER 5. REGULAR EXPRESSIONS (略)](#CHAPTER-5--REGULAR-EXPRESSIONS)
- [CHAPTER 6. CLOSURES & GENERATORS](#CHAPTER-6--CLOSURES-&-GENERATORS)
	- [6.1. DIVING IN](#6-1--DIVING-IN)
	- [6.2. I KNOW, LET’S USE REGULAR EXPRESSIONS!](#6-2--I-KNOW-LET’S-USE-REGULAR-EXPRESSIONS!)
	- [6.3. A LIST OF FUNCTIONS](#6-3--A-LIST-OF-FUNCTIONS)
	- [6.4. A LIST OF PATTERNS](#6-4--A-LIST-OF-PATTERNS)
	- [6.5. A FILE OF PATTERNS](#6-5--A-FILE-OF-PATTERNS)
	- [6.6. GENERATORS](#6-6--GENERATORS)
		- [6.6.1. A FIBONACCI GENERATOR](#6-6-1--A-FIBONACCI-GENERATOR)
		- [6.6.2. A PLURAL RULE GENERATOR](#6-6-2--A-PLURAL-RULE-GENERATOR)
- [CHAPTER 7. CLASSES & ITERATORS](#CHAPTER-7--CLASSES-&-ITERATORS)
	- [7.1. DIVING IN](#7-1--DIVING-IN)
	- [7.2. DEFINING CLASSES](#7-2--DEFINING-CLASSES)
	- [7.3. INSTANTIATING CLASSES](#7-3--INSTANTIATING-CLASSES)
	- [7.4. INSTANCE VARIABLES](#7-4--INSTANCE-VARIABLES)
	- [7.5. A FIBONACCI ITERATOR](#7-5--A-FIBONACCI-ITERATOR)
	- [7.6. A PLURAL RULE ITERATOR](#7-6--A-PLURAL-RULE-ITERATOR)
- [CHAPTER 8. ADVANCED ITERATORS](#CHAPTER-8--ADVANCED-ITERATORS)
	- [8.3. FINDING THE UNIQUE ITEMS IN A SEQUENCE](#8-3--FINDING-THE-UNIQUE-ITEMS-IN-A-SEQUENCE)
	- [8.4. MAKING ASSERTIONS](#8-4--MAKING-ASSERTIONS)
	- [8.5. GENERATOR EXPRESSIONS](#8-5--GENERATOR-EXPRESSIONS)
	- [8.6. CALCULATING PERMUTATIONS… THE LAZYWAY!](#8-6--CALCULATING-PERMUTATIONS-THE-LAZYWAY!)
	- [8.7. OTHER FUN STUFF IN THE `itertools` MODULE](#8-7--OTHER-FUN-STUFF-IN-THE-itertools-MODULE)
	- [8.8. A NEW KIND OF STRINGMANIPULATION](#8-8--A-NEW-KIND-OF-STRINGMANIPULATION)
	- [8.9. EVALUATING ARBITRARY STRINGS AS PYTHON EXPRESSIONS](#8-9--EVALUATING-ARBITRARY-STRINGS-AS-PYTHON-EXPRESSIONS)
	- [8.10. PUTTING IT ALL TOGETHER （略）](#8-10--PUTTING-IT-ALL-TOGETHER-（略）)
- [CHAPTER 9. UNIT TESTING](#CHAPTER-9--UNIT-TESTING)
	- [9.2. A SINGLE QUESTION](#9-2--A-SINGLE-QUESTION)
	- [9.3. “HALT AND CATCH FIRE”](#9-3--“HALT-AND-CATCH-FIRE”)
	- [9.4. MORE HALTING,MORE FIRE](#9-4--MORE-HALTINGMORE-FIRE)
	- [9.5. AND ONEMORE THING…](#9-5--AND-ONEMORE-THING)
- [CHAPTER 10. REFACTORING](#CHAPTER-10--REFACTORING)
	- [10.1. DIVING IN](#10-1--DIVING-IN)
	- [10.2. HANDLING CHANGING REQUIREMENTS](#10-2--HANDLING-CHANGING-REQUIREMENTS)
	- [10.3. REFACTORING](#10-3--REFACTORING)
- [CHAPTER 11. FILES](#CHAPTER-11--FILES)
	- [11.2. READING FROM TEXT FILES](#11-2--READING-FROM-TEXT-FILES)
		- [11.2.1. CHARACTER ENCODING REARS ITS UGLY HEAD](#11-2-1--CHARACTER-ENCODING-REARS-ITS-UGLY-HEAD)
		- [11.2.2. STREAM OBJECTS](#11-2-2--STREAM-OBJECTS)
		- [11.2.3. READING DATA FROM A TEXT FILE](#11-2-3--READING-DATA-FROM-A-TEXT-FILE)
		- [11.2.4. CLOSING FILES](#11-2-4--CLOSING-FILES)
		- [11.2.5. CLOSING FILES AUTOMATICALLY](#11-2-5--CLOSING-FILES-AUTOMATICALLY)
		- [11.2.6. READING DATA ONE LINE AT A TIME](#11-2-6--READING-DATA-ONE-LINE-AT-A-TIME)
	- [11.3. WRITING TO TEXT FILES](#11-3--WRITING-TO-TEXT-FILES)
	- [11.4. BINARY FILES](#11-4--BINARY-FILES)
	- [11.5. STREAM OBJECTS FROM NON-FILE SOURCES](#11-5--STREAM-OBJECTS-FROM-NON-FILE-SOURCES)
		- [11.5.1. HANDLING COMPRESSED FILES (略)](#11-5-1--HANDLING-COMPRESSED-FILES)
	- [11.6. STANDARD INPUT, OUTPUT, AND ERROR](#11-6--STANDARD-INPUT-OUTPUT-AND-ERROR)
		- [11.6.1. REDIRECTING STANDARD OUTPUT](#11-6-1--REDIRECTING-STANDARD-OUTPUT)
- [CHAPTER 12. XML (略)](#CHAPTER-12--XML)
- [CHAPTER 13. SERIALIZING PYTHON OBJECTS](#CHAPTER-13--SERIALIZING-PYTHON-OBJECTS)
	- [13.1. DIVING IN](#13-1--DIVING-IN)
	- [13.2. SAVING DATA TO A PICKLE FILE](#13-2--SAVING-DATA-TO-A-PICKLE-FILE)
	- [13.3. LOADING DATA FROM A PICKLE FILE](#13-3--LOADING-DATA-FROM-A-PICKLE-FILE)
	- [13.4. PICKLINGWITHOUT A FILE](#13-4--PICKLINGWITHOUT-A-FILE)
	- [13.6. DEBUGGING PICKLE FILES (略)](#13-6--DEBUGGING-PICKLE-FILES)
	- [13.7. SERIALIZING PYTHON OBJECTS TO BE READ BY OTHER LANGUAGES](#13-7--SERIALIZING-PYTHON-OBJECTS-TO-BE-READ-BY-OTHER-LANGUAGES)
	- [13.8. SAVING DATA TO A JSON FILE (略)](#13-8--SAVING-DATA-TO-A-JSON-FILE)
	- [13.9. MAPPING OF PYTHON DATATYPES TO JSON (略)](#13-9--MAPPING-OF-PYTHON-DATATYPES-TO-JSON)
	- [13.10. SERIALIZING DATATYPES UNSUPPORTED BY JSON (略)](#13-10--SERIALIZING-DATATYPES-UNSUPPORTED-BY-JSON)
	- [13.11. LOADING DATA FROM A JSON FILE (略)](#13-11--LOADING-DATA-FROM-A-JSON-FILE)
- [CHAPTER 14. HTTPWEB SERVICES (略)](#CHAPTER-14--HTTPWEB-SERVICES)
- [CHAPTER 15. CASE STUDY: PORTING `chardet` TO PYTHON 3 (略)](#CHAPTER-15--CASE-STUDY-PORTING-chardet-TO-PYTHON-3)
- [CHAPTER 16. PACKAGING PYTHON LIBRARIES (略)](#CHAPTER-16--PACKAGING-PYTHON-LIBRARIES)
- [CHAPTER 17. PORTING CODE TO PYTHON 3 WITH `2to3` (略)](#CHAPTER-17--PORTING-CODE-TO-PYTHON-3-WITH-2to3)
- [CHAPTER 18. SPECIAL METHOD NAMES (略)](#CHAPTER-18--SPECIAL-METHOD-NAMES)

-----

## CHAPTER 1. YOUR FIRST PYTHON PROGRAM <a name="CHAPTER-1--YOUR-FIRST-PYTHON-PROGRAM"></a>

```python
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
```

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
	
### 1.4. THE `import` SEARCH PATH <a name="1-4--THE-import-SEARCH-PATH"></a>

Python looks in all the directories defined in `sys.path` (in its order) when you try to import a module.

```python
>>> import sys

# show sys.path
>>> sys.path 

# add an entry in sys.path
>>> sys.path.insert(0, '/home/mark/diveintopython3/examples') # The effect lasts as long as Python is running.
```

Not all modules are stored as .py files. Some are built-in modules; they are actually baked right into Python itself. Built-in modules behave just like regular modules, but their Python source code is not available, because they are not written in Python! (Like Python itself, these built-in modules are written in C.)

### 1.5. EVERYTHING IS AN OBJECT <a name="1-5--EVERYTHING-IS-AN-OBJECT"></a>

```python
>>> import humansize

>>> print(humansize.approximate_size(4096, True))
4.0 KiB

# __doc__ is a built-in attribute for functions.
# its value is the docstring
>>> print(humansize.approximate_size.__doc__)
Convert a file size to human-readable form.
......
```

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

### 1.7. EXCEPTIONS <a name="1-7--EXCEPTIONS"></a>

Unlike Java, Python functions don’t declare which exceptions they might raise. It’s up to you to determine what possible exceptions you need to catch.

If you know a line of code may raise an exception, you should handle the exception using a `try-except` block.

```python
try:
    from lxml import etree
except ImportError:
    import xml.etree.ElementTree as etree
```

By the end of this `try-except` block, you have imported some module and named it `etree`. Since both modules implement a common API, the rest of your code doesn’t need to keep checking which module got imported. And since the module that did get imported is always called `etree`, the rest of your code doesn’t need to be littered with if statements to call differently-named modules.

### 1.10. RUNNING SCRIPTS <a name="1-10--RUNNING-SCRIPTS"></a>

```python
if __name__ == '__main__':
    ......
```

- Like C, Python uses `==` for comparison and `=` for assignment. Unlike C, Python does not support in-line assignment, so there’s no chance of accidentally assigning the value you thought you were comparing.

So what makes this if statement special? Well, modules are objects, and all modules have a built-in attribute `__name__`. A module’s `__name__` depends on how you’re using the module. If you import the module, then `__name__` is the module’s filename, without a directory path or file extension.

But you can also run the module directly as a standalone program, in which case `__name__` will be a special default value, `__main__`. Python will evaluate this if statement, find a true expression, and execute the if code block.

## CHAPTER 2. NATIVE DATATYPES <a name="CHAPTER-2--NATIVE-DATATYPES"></a>

### 2.1. DIVING IN <a name="2-1--DIVING-IN"></a>

Python has many native datatypes:

- `Bytes` and `byte arrays`, e.g. a JPEG image file.
- `Lists` are ordered sequences of values.
- `Tuples` are ordered, immutable sequences of values.
- `Sets` are unordered bags of values.
- `Dictionaries` are unordered bags of key-value pairs.

### 2.2. BOOLEANS <a name="2-2--BOOLEANS"></a>

In certain places (like if statements), Python expects an expression to evaluate to a boolean value. These places are called **boolean contexts**. You can use virtually any expression in a boolean context, and Python will try to determine its truth value. Different datatypes have different rules about which values are true or false in a boolean context.

Due to some legacy issues left over from Python 2, booleans can be treated as numbers. `True` is 1; `False` is 0. 

### 2.3. NUMBERS <a name="2-3--NUMBERS"></a>

Python supports both integers and floating point numbers. There’s no type declaration to distinguish them; Python tells them apart by the presence or absence of a decimal point.

```python
>>> type(1) 
<class 'int'>
>>> isinstance(1, int) 
True
>>> 1 + 1 
2
>>> 1 + 1.0 
2.0
>>> type(2.0)
<class 'float'>

>>> float(2) 
2.0
>>> int(2.0) 
2
>>> int(2.5) 
2
>>> int(-2.5) 
-2

>>> 11 / 2
5.5
>>> 11 // 2
5
>>> −11 // 2
−6
>>> 11.0 // 2
5.0
>>> 11 ** 2
121
>>> 11 % 2 
1

>>> import fractions
>>> x = fractions.Fraction(1, 3)
>>> x
Fraction(1, 3)
>>> x * 2
Fraction(2, 3)
>>> fractions.Fraction(6, 4)
Fraction(3, 2)

>>> import math
>>> math.pi
3.1415926535897931
>>> math.sin(math.pi / 2)
1.0
>>> math.tan(math.pi / 4)
0.99999999999999989
```

- Python 2 had separate types for `int` and `long`.

### 2.4. LISTS <a name="2-4--LISTS"></a>

A better analogy would be to the `ArrayList` class, which can hold arbitrary objects and can expand dynamically as new items are added.

```python
>>> a_list = ['a', 'b', 'mpilgrim', 'z', 'example'] 
>>> a_list
['a', 'b', 'mpilgrim', 'z', 'example']
>>> a_list[0] 
'a'
>>> a_list[-1]
'example'
>>> a_list[-3]
'mpilgrim'

>>> a_list[1:3] 
['b', 'mpilgrim']
>>> a_list[1:-1] 
['b', 'mpilgrim', 'z']
>>> a_list[0:3] 
['a', 'b', 'mpilgrim']
>>> a_list[:3] 
['a', 'b', 'mpilgrim']
>>> a_list[3:] 
['z', 'example']
>>> a_list[:] 
['a', 'b', 'mpilgrim', 'z', 'example']

>>> a_list = ['a']
>>> a_list = a_list + [2.0, 3] 
>>> a_list 
['a', 2.0, 3]
>>> a_list.append(True) 
>>> a_list
['a', 2.0, 3, True]
>>> a_list.extend(['four', 'Ω']) 
>>> a_list
['a', 2.0, 3, True, 'four', 'Ω']
>>> a_list.insert(0, 'Ω') 
>>> a_list
['Ω', 'a', 2.0, 3, True, 'four', 'Ω']

>>> a_list = ['a', 'b', 'c']
>>> a_list.extend(['d', 'e', 'f'])
>>> a_list
['a', 'b', 'c', 'd', 'e', 'f']
>>> a_list.append(['g', 'h', 'i'])
>>> a_list
['a', 'b', 'c', 'd', 'e', 'f', ['g', 'h', 'i']]

>>> a_list = ['a', 'b', 'new', 'mpilgrim', 'new']
>>> a_list.count('new') 
2
>>> 'new' in a_list 
True
>>> 'c' in a_list
False
>>> a_list.index('mpilgrim') 
3
>>> a_list.index('new') 
2

>>> a_list = ['a', 'b', 'new', 'mpilgrim', 'new']
>>> a_list[1]
'b'
>>> del a_list[1] 
>>> a_list
['a', 'new', 'mpilgrim', 'new']
>>> a_list.remove('new')
>>> a_list
['a', 'mpilgrim', 'new']
>>> a_list.remove('new')
>>> a_list
['a', 'mpilgrim']

>>> a_list = ['a', 'b', 'new', 'mpilgrim']
>>> a_list.pop() 
'mpilgrim'
>>> a_list
['a', 'b', 'new']
>>> a_list.pop(1) 
'b'
>>> a_list
['a', 'new']

if []: # false
    ......

if ['a']: # true
    ......
```

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

### 2.5. TUPLES <a name="2-5--TUPLES"></a>

A tuple is an immutable list. A tuple can not be changed in any way once it is created.

```python
>>> a_tuple = ("a", "b", "mpilgrim", "z", "example")

>>> type((False))
<class 'bool'>
>>> type((False,))
<class 'tuple'>

>>> v = ('a', 2, True)
>>> (x, y, z) = v
>>> x
'a'
>>> y
2
>>> z
True

>>> (MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY) = range(7) 
>>> MONDAY 
0
>>> TUESDAY
1
```

- A tuple is defined in the same way as a list, except that the whole set of elements is enclosed in parentheses instead of square brackets.
- Tuples are faster than lists. If you’re defining a constant set of values and all you’re ever going to do with it is iterate through it, use a tuple instead of a list. 
- Some tuples can be used as dictionary keys (specifically, tuples that contain immutable values like strings, numbers, and other tuples). Lists can never be used as dictionary keys, because lists are not immutable.
- Tuples can be converted into lists, and vice-versa. The built-in `tuple()` function takes a list and returns a tuple with the same elements, and the `list()` function takes a tuple and returns a list. 
	- In effect, `tuple()` freezes a list, and `list()` thaws a tuple.
- An empty tuple is false. Any tuple with at least one item is true.
- To create a tuple of one item, you need a comma after the value. Without the comma, Python just assumes you have an extra pair of parentheses, which is harmless, but it doesn’t create a tuple.
- Here’s a cool programming shortcut: in Python, you can use a tuple to assign multiple values at once.
	- Technically, the `range()` function returns an iterator, not a list or a tuple.
	
### 2.6. SETS <a name="2-6--SETS"></a>

A set is an unordered “bag” of unique values. A single set can contain values of any immutable datatype. Once you have two sets, you can do standard set operations like union, intersection, and set difference.

```python
>>> a_set = {1}

>>> a_list = ['a', 'b', 'mpilgrim', True, False, 42]
>>> a_set = set(a_list) 
>>> a_set 
{'a', False, 'b', True, 'mpilgrim', 42}

>>> a_set = set()
>>> a_set
set()

>>> not_sure = {} 
>>> type(not_sure)
<class 'dict'>

>>> a_set = {1, 2}
>>> a_set.add(4) 
>>> a_set
{1, 2, 4}
>>> a_set.add(1)
>>> a_set
{1, 2, 4}

>>> a_set = {1, 2, 3}
>>> a_set
{1, 2, 3}
>>> a_set.update({2, 4, 6}) 
>>> a_set 
{1, 2, 3, 4, 6}
>>> a_set.update({3, 6, 9}, {1, 2, 3, 5, 8, 13}) 
>>> a_set
{1, 2, 3, 4, 5, 6, 8, 9, 13}
>>> a_set.update([10, 20, 30]) 
>>> a_set
{1, 2, 3, 4, 5, 6, 8, 9, 10, 13, 20, 30}

>>> a_set = {1, 3, 6, 10, 15, 21, 28, 36, 45}
>>> a_set
{1, 3, 36, 6, 10, 45, 15, 21, 28}
>>> a_set.discard(10) ①
>>> a_set
{1, 3, 36, 6, 45, 15, 21, 28}
>>> a_set.discard(10)
>>> a_set
{1, 3, 36, 6, 45, 15, 21, 28}
>>> a_set.remove(21)
>>> a_set
{1, 3, 36, 6, 45, 15, 28}
>>> a_set.remove(21)
Traceback (most recent call last):
File "<stdin>", line 1, in <module>
KeyError: 21
```

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

### 2.7. DICTIONARIES <a name="2-7--DICTIONARIES"></a>

A dictionary is an unordered set of key-value pairs.

```python
# Use {} just like Sets
>>> a_dict = {'server': 'db.diveintopython3.org', 'database': 'mysql'} 
>>> a_dict
{'server': 'db.diveintopython3.org', 'database': 'mysql'}
>>> a_dict['server'] 
'db.diveintopython3.org'
>>> a_dict['database'] 
'mysql'

# modify the value by an existing entry
>>> a_dict['database'] = 'blog'
# add a new entry
>>> a_dict['user'] = 'mark'
```

- An empty dictionary is false. Any dictionary with at least one key-value pair is true.

### 2.8. None <a name="2-8--None"></a>

`None` is a special constant in Python. 

- It is a null value. 
- `None` is not the same as `False`. 
	- In a boolean context, `None` is evaluated as false and `not None` as true.
- `None` is not 0. 
- `None` is not an empty string. 
- Comparing `None` to anything other than `None` will always return `False`.
- It has its own datatype (`NoneType`). 
- You can assign `None` to any variable, but you can not create other `NoneType` objects. 
- All variables whose value is `None` are equal to each other.

## CHAPTER 3. COMPREHENSIONS <a name="CHAPTER-3--COMPREHENSIONS"></a>

### 3.2. WORKINGWITH FILES AND DIRECTORIES <a name="3-2--WORKINGWITH-FILES-AND-DIRECTORIES"></a>

Python 3 comes with a module called `os`, which stands for “operating system.” The os module contains a plethora of functions to get information on — and in some cases, to manipulate — local directories, files, processes, and environment variables. Python does its best to offer a unified API across all supported operating systems so your programs can run on any computer with as little platform-specific code as possible.

```python
>>> import os 

# 相当于 pwd 或者 cd (cd 不带参数时就相当于 pwd)
>>> print(os.getcwd()) 
C:\Python31

# 相当于 cd 到某个目录
>>> os.chdir('/Users/pilgrim/diveintopython3/examples') 
>>> print(os.getcwd()) 
C:\Users\pilgrim\diveintopython3\examples

# 获取 absolute path
>>> print(os.path.realpath('feed.xml'))
c:\Users\pilgrim\diveintopython3\examples\feed.xml

# 路径拼接
>>> print(os.path.join('/Users/pilgrim/diveintopython3/examples/', 'humansize.py')) 
/Users/pilgrim/diveintopython3/examples/humansize.py
>>> print(os.path.join('/Users/pilgrim/diveintopython3/examples', 'humansize.py')) 
/Users/pilgrim/diveintopython3/examples\humansize.py
>>> print(os.path.expanduser('~')) 
c:\Users\pilgrim
>>> print(os.path.join(os.path.expanduser('~'), 'diveintopython3', 'examples', 'humansize.py')) 
c:\Users\pilgrim\diveintopython3\examples\humansize.py

# 路径拆分
>>> pathname = '/Users/pilgrim/diveintopython3/examples/humansize.py'
>>> os.path.split(pathname) 
('/Users/pilgrim/diveintopython3/examples', 'humansize.py')
>>> (dirname, filename) = os.path.split(pathname) 
>>> dirname 
'/Users/pilgrim/diveintopython3/examples'
>>> filename 
'humansize.py'

# 文件名与 extension 拆分
>>> (shortname, extension) = os.path.splitext(filename) 
>>> shortname
'humansize'
>>> extension
'.py'
```

- The `os.path.expanduser()` function will expand a pathname that uses ~ to represent the current user’s home directory.

The `glob` module is another tool in the Python standard library. It’s an easy way to get the contents of a directory programmatically, and it uses the sort of wildcards that you may already be familiar with from working on the command line.

- glob: (programming) A limited pattern matching technique using wildcards, less powerful than a regular expression.

```python
>>> import glob

>>> os.chdir('/Users/pilgrim/diveintopython3/')
>>> glob.glob('examples/*.xml') 
['examples\\feed-broken.xml',
'examples\\feed-ns0.xml',
'examples\\feed.xml']

>>> os.chdir('examples/') 
>>> glob.glob('*test*.py') 
['alphameticstest.py',
'pluraltest1.py',
'pluraltest2.py',
'pluraltest3.py',
'pluraltest4.py',
'pluraltest5.py',
'pluraltest6.py',
'romantest1.py',
'romantest10.py',
'romantest2.py',
'romantest3.py',
'romantest4.py',
'romantest5.py',
'romantest6.py',
'romantest7.py',
'romantest8.py',
'romantest9.py']
```

Every modern file system stores metadata about each file: creation date, last-modified date, file size, and so on. Python provides a single API to access this metadata.

```python
>>> import os

>>> print(os.getcwd()) 
c:\Users\pilgrim\diveintopython3\examples
>>> metadata = os.stat('feed.xml') 
>>> metadata.st_mtime 
1247520344.9537716

>>> import time 
>>> time.localtime(metadata.st_mtime) 
time.struct_time(tm_year=2009, tm_mon=7, tm_mday=13, tm_hour=17,
tm_min=25, tm_sec=44, tm_wday=0, tm_yday=194, tm_isdst=1)
```

- Calling the `os.stat()` function returns an object that contains several different types of metadata about the file.

### 3.3. LIST COMPREHENSIONS <a name="3-3--LIST-COMPREHENSIONS"></a>

A list comprehension provides a compact way of mapping a list into another list by applying a function to each of the elements of the list.

```python
>>> a_list = [1, 9, 8, 4]
>>> [elem * 2 for elem in a_list] 
[2, 18, 16, 8]
# a_list 本身并没有变
>>> a_list 
[1, 9, 8, 4]
>>> a_list = [elem * 2 for elem in a_list] 
>>> a_list
[2, 18, 16, 8]
```

- A list comprehension creates a new list; it does not change the original list.

```python
>>> import os, glob

>>> glob.glob('*.xml') 
['feed-broken.xml', 'feed-ns0.xml', 'feed.xml']
>>> [os.path.realpath(f) for f in glob.glob('*.xml')] 
['c:\\Users\\pilgrim\\diveintopython3\\examples\\feed-broken.xml',
'c:\\Users\\pilgrim\\diveintopython3\\examples\\feed-ns0.xml',
'c:\\Users\\pilgrim\\diveintopython3\\examples\\feed.xml']
```

List comprehensions can also filter items, producing a result that can be smaller than the original list.

```python
>>> import os, glob

>>> [f for f in glob.glob('*.py') if os.stat(f).st_size > 6000] 
['pluraltest6.py',
'romantest10.py',
'romantest6.py',
'romantest7.py',
'romantest8.py',
'romantest9.py']
```

There’s no limit to how complex a list comprehension can be.

```python
>>> import os, glob
>>> [(os.stat(f).st_size, os.path.realpath(f)) for f in glob.glob('*.xml')] 
[(3074, 'c:\\Users\\pilgrim\\diveintopython3\\examples\\feed-broken.xml'),
(3386, 'c:\\Users\\pilgrim\\diveintopython3\\examples\\feed-ns0.xml'),
(3070, 'c:\\Users\\pilgrim\\diveintopython3\\examples\\feed.xml')]

>>> import humansize
>>> [(humansize.approximate_size(os.stat(f).st_size), f) for f in glob.glob('*.xml')] 
[('3.0 KiB', 'feed-broken.xml'),
('3.3 KiB', 'feed-ns0.xml'),
('3.0 KiB', 'feed.xml')]
```

### 3.4. DICTIONARY COMPREHENSIONS <a name="3-4--DICTIONARY-COMPREHENSIONS"></a>

```python
>>> import os, glob

# This is a list comprehension
>>> metadata = [(f, os.stat(f)) for f in glob.glob('*test*.py')] 
>>> metadata[0] 
('alphameticstest.py', nt.stat_result(st_mode=33206, st_ino=0, st_dev=0,
st_nlink=0, st_uid=0, st_gid=0, st_size=2509, st_atime=1247520344,
st_mtime=1247520344, st_ctime=1247520344))

# This is a dictionary comprehension
>>> metadata_dict = {f:os.stat(f) for f in glob.glob('*test*.py')} 
>>> type(metadata_dict) 
<class 'dict'>
>>> list(metadata_dict.keys()) 
['romantest8.py', 'pluraltest1.py', 'pluraltest2.py', 'pluraltest5.py',
'pluraltest6.py', 'romantest7.py', 'romantest10.py', 'romantest4.py',
'romantest9.py', 'pluraltest3.py', 'romantest1.py', 'romantest2.py',
'romantest3.py', 'romantest5.py', 'romantest6.py', 'alphameticstest.py',
'pluraltest4.py']
>>> metadata_dict['alphameticstest.py'].st_size 
2509
```

- The syntax is similar to a list comprehension, with two differences. 
	- First, it is enclosed in curly braces `{}` instead of square brackets `[]`. 
	- Second, instead of a single expression for each item, it contains two expressions separated by a colon `:`. 
		- The expression before the colon (`f` in this example) is the dictionary key; 
		- the expression after the colon (`os.stat(f)` in this example) is the value.

Here’s a trick with dictionary comprehensions that might be useful someday: swapping the keys and values of a dictionary.

```python
>>> a_dict = {'a': 1, 'b': 2, 'c': 3}
>>> {value:key for key, value in a_dict.items()}
{1: 'a', 2: 'b', 3: 'c'}
```

Of course, this only works if the values of the dictionary are immutable, like strings or tuples. If you try this with a dictionary that contains lists, it will fail most spectacularly. 

### 3.5. SET COMPREHENSIONS <a name="3-5--SET-COMPREHENSIONS"></a>

```python
>>> a_set = set(range(10))
>>> a_set
{0, 1, 2, 3, 4, 5, 6, 7, 8, 9}
>>> {x ** 2 for x in a_set} 
{0, 1, 4, 81, 64, 9, 16, 49, 25, 36}
>>> {x for x in a_set if x % 2 == 0} 
{0, 8, 2, 4, 6}
>>> {2**x for x in range(10)} 
{32, 1, 2, 4, 8, 64, 128, 256, 16, 512}
```

## CHAPTER 4. STRINGS <a name="CHAPTER-4--STRINGS"></a>

### 4.1. SOME BORING STUFF YOU NEED TO UNDERSTAND BEFORE YOU CAN DIVE IN <a name="4-1--SOME-BORING-STUFF-YOU-NEED-TO-UNDERSTAND-BEFORE-YOU-CAN-DIVE-IN"></a>

科普向。写得很好。

### 4.2. UNICODE <a name="4-2--UNICODE"></a>

科普向。写得很好。

### 4.3. DIVING IN <a name="4-3--DIVING-IN"></a>

In Python 3, all strings are sequences of Unicode characters. There is no such thing as a Python string encoded in UTF-8, or a Python string encoded as CP-1252. “Is this string UTF-8 ?” is an invalid question. UTF-8 is a way of encoding characters as a sequence of bytes. Bytes are not characters; bytes are bytes. Characters are an abstraction. A string is a sequence of those abstractions.

To create a string, enclose it in quotes. Python strings can be defined with either single quotes (`'`) or double quotes (`"`).

```python
>>> s = '深入 Python' 
>>> len(s) 
9
>>> s[0] 
'深'
>>> s + ' 3' 
'深入 Python 3'
```

### 4.4. FORMATTING STRINGS <a name="4-4--FORMATTING-STRINGS"></a>

Let’s take another look at humansize.py:

```python
	......
    if size < multiple:
        return '{0:.1f} {1}'.format(size, suffix)
	......
```

Python 3 supports formatting values into strings. Although this can include very complicated expressions, the most basic usage is to insert a value into a string with a single placeholder.

```python
>>> username = 'mark'
>>> password = 'PapayaWhip' 
>>> "{0}'s password is {1}".format(username, password) 
"mark's password is PapayaWhip"
```

- First, that’s a method call on a string literal. Strings are objects, and objects have methods. 
- Second, the whole expression evaluates to a string. 
- Third, `{0}` and `{1}` are replacement fields, which are replaced by the arguments passed to the `format()` method.

#### 4.4.1. COMPOUND FIELD NAMES <a name="4-4-1--COMPOUND-FIELD-NAMES"></a>

The previous example shows the simplest case, where the replacement fields are simply integers. Integer replacement fields are treated as positional indices into the argument list of the `format()` method. That means that `{0}` is replaced by the first argument (`username` in this case), `{1}` is replaced by the second argument (`password`), &c. But replacement fields are much more powerful than that.

```python
>>> import humansize
>>> si_suffixes = humansize.SUFFIXES[1000] 
>>> si_suffixes
['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
>>> '1000{0[0]} = 1{0[1]}'.format(si_suffixes) 
'1000KB = 1MB'
```

- `{0}` would refer to the first argument passed to the `format()` method, `si_suffixes`. 
- But `si_suffixes` is a list. So `{0[0]}` refers to the first item of the list which is the first argument passed to the `format()` method: 'KB'. 
- Meanwhile, `{0[1]}` refers to the second item of the same list: 'MB'.

What this example shows is that format specifiers can access items and properties of data structures using (almost) Python syntax. This is called **compound field names**. The following compound field names “just work”:

- Passing a list, and accessing an item of the list by index (as in the previous example)
- Passing a dictionary, and accessing a value of the dictionary by key
- Passing a module, and accessing its variables and functions by name
- Passing a class instance, and accessing its properties and methods by name
- Any combination of the above

Just to blow your mind, here’s an example that combines all of the above:

```python
>>> import humansize
>>> import sys
>>> '1MB = 1000{0.modules[humansize].SUFFIXES[1000][0]}'.format(sys)
'1MB = 1000KB'
```

- The `sys` module holds information about the currently running Python instance. Since you just imported it, you can pass the `sys` module itself as an argument to the `format()` method. So the replacement field `{0}` refers to the `sys` module.
- `sys.modules` is a dictionary of all the modules that have been imported in this Python instance. The keys are the module names as strings; the values are the module objects themselves. So the replacement field `{0.modules}` refers to the dictionary of imported modules.
- `sys.modules['humansize']` is the `humansize` module which you just imported. The replacement field `{0.modules[humansize]}` refers to the humansize module. Note the slight difference in syntax here. In real Python code, the keys of the `sys.modules` dictionary are strings; to refer to them, you need to put quotes around the module name (e.g. 'humansize'). But within a replacement field, you skip the quotes around the dictionary key name (e.g. humansize). 
	- To quote [PEP 3101: Advanced String Formatting](https://www.python.org/dev/peps/pep-3101/), “The rules for parsing an item key are very simple. If it starts with a digit, then it is treated as a number, otherwise it is used as a string.”
- `sys.modules['humansize'].SUFFIXES` is the dictionary defined at the top of the `humansize` module. The replacement field `{0.modules[humansize].SUFFIXES}` refers to that dictionary.
- `sys.modules['humansize'].SUFFIXES[1000]` is a list of `SI` suffixes: `['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']`. So the replacement field `{0.modules[humansize].SUFFIXES[1000]}` refers to that list.
- `sys.modules['humansize'].SUFFIXES[1000][0]` is the first item of the list of SI suffixes: 'KB'. Therefore, the complete replacement field `{0.modules[humansize].SUFFIXES[1000][0]}` is replaced by the two-character string 'KB'.

#### 4.4.2. FORMAT SPECIFIERS <a name="4-4-2--FORMAT-SPECIFIERS"></a>

But what is `{0:.1f}`? It’s two things: `{0}`, which you recognize, and `:.1f`, which defines the format specifier.

Within a replacement field, a colon (`:`) marks the start of the format specifier. The format specifier `.1` means “round to the nearest tenth” (i.e. display only one digit after the decimal point). The format specifier `f` means “fixed-point number” (as opposed to exponential notation or some other decimal representation).

### 4.5. OTHER COMMON STRING METHODS <a name="4-5--OTHER-COMMON-STRING-METHODS"></a>

Let’s say you have a list of key-value pairs and you want to split them up and make a dictionary:

```python
>>> query = 'user=pilgrim&database=master&password=PapayaWhip'
>>> a_list = query.split('&') 
>>> a_list
['user=pilgrim', 'database=master', 'password=PapayaWhip']
>>> a_list_of_lists = [v.split('=', 1) for v in a_list if '=' in v] 
>>> a_list_of_lists
[['user', 'pilgrim'], ['database', 'master'], ['password', 'PapayaWhip']]
>>> a_dict = dict(a_list_of_lists) 
>>> a_dict
{'password': 'PapayaWhip', 'user': 'pilgrim', 'database': 'master'}
```

### 4.6. STRINGS VS. BYTES <a name="4-6--STRINGS-VS--BYTES"></a>

Bytes are bytes; characters are an abstraction. An immutable sequence of Unicode characters is called a `string`. An immutable sequence of numbers-between-0-and-255 is called a `bytes` object.

```python
>>> by = b'abcd\x65' 
>>> by
b'abcde'
>>> type(by) 
<class 'bytes'>
>>> by += b'\xff' 
>>> by # \xff 没有对应到一个 character，所以仍然显示为 \xff
b'abcde\xff'
>>> by[5] 
255
```

A bytes object is immutable; you can not assign individual bytes. If you need to change individual bytes, you can convert the bytes object into a `bytearray` object. The assigned value must be an integer between 0–255.

```python
>>> by = b'abcd\x65'
>>> barr = bytearray(by) 
>>> barr
bytearray(b'abcde')
>>> barr[0] = 102 
>>> barr
bytearray(b'fbcde')
```

The one thing you can never do is mix bytes and strings.

```python
>>> by = b'd'
>>> s = 'abcde'
>>> by + s # ERROR

>>> s.count(by) 				# ERROR
>>> s.count(by.decode('ascii')) # OK
1
```

And here is the link between `string`s and `bytes`: `bytes` objects have a `decode()` method that takes a character encoding and returns a `string`, and `string`s have an `encode()` method that takes a character encoding and returns a `bytes` object.

### 4.7. POSTSCRIPT: CHARACTER ENCODING OF PYTHON SOURCE CODE <a name="4-7--POSTSCRIPT-CHARACTER-ENCODING-OF-PYTHON-SOURCE-CODE"></a>

In Python 2, the default encoding for .py files was ASCII. In Python 3, the default encoding is UTF-8.

If you would like to use a different encoding within your Python code, you can put an encoding declaration on the first line of each file. This declaration below defines a .py file to be windows-1252:

```python
# -*- coding: windows-1252 -*-
```

Technically, the character encoding override can also be on the second line, if the first line is a UNIX-like hash-bang command.

```python
#!/usr/bin/python3
# -*- coding: windows-1252 -*-
```

## CHAPTER 5. REGULAR EXPRESSIONS (略) <a name="CHAPTER-5--REGULAR-EXPRESSIONS"></a>

## CHAPTER 6. CLOSURES & GENERATORS <a name="CHAPTER-6--CLOSURES-&-GENERATORS"></a>

### 6.1. DIVING IN <a name="6-1--DIVING-IN"></a>

first, let’s talk about how to make plural nouns. If you grew up in an English-speaking country or learned English in a formal school setting, you’re probably familiar with the basic rules:

- If a word ends in S, X, or Z, add ES. _Bass_ becomes _basses_, _fax_ becomes _faxes_, and _waltz_ becomes _waltzes_.
- If a word ends in a noisy H, add ES; if it ends in a silent H, just add S. 
	- What’s a noisy H? One that gets combined with other letters to make a sound that you can hear. So _coach_ becomes _coaches_ and _rash_ becomes _rashes_, because you can hear the CH and SH sounds when you say them. 
	- But _cheetah_ becomes _cheetahs_, because the H is silent.
- If a word ends in Y that sounds like I, change the Y to IES; if the Y is combined with a vowel to sound like something else, just add S. 		- So _vacancy_ becomes _vacancies_, but _day_ becomes _days_.
- If all else fails, just add S and hope for the best.

Let’s design a Python library that automatically pluralizes English nouns. We’ll start with just these four rules.

### 6.2. I KNOW, LET’S USE REGULAR EXPRESSIONS! <a name="6-2--I-KNOW-LET’S-USE-REGULAR-EXPRESSIONS!"></a>

```python
def plural(noun):
    if re.search('[sxz]$', noun): 
        return re.sub('$', 'es', noun) 
    elif re.search('[^aeioudgkprt]h$', noun):
        return re.sub('$', 'es', noun)
    elif re.search('[^aeiou]y$', noun):
        return re.sub('y$', 'ies', noun)
    else:
        return noun + 's'
```

### 6.3. A LIST OF FUNCTIONS <a name="6-3--A-LIST-OF-FUNCTIONS"></a>

```python
def match_sxz(noun):
    return re.search('[sxz]$', noun)
def apply_sxz(noun):
    return re.sub('$', 'es', noun)
def match_h(noun):
    return re.search('[^aeioudgkprt]h$', noun)
def apply_h(noun):
    return re.sub('$', 'es', noun)
def match_y(noun): 
    return re.search('[^aeiou]y$', noun)
def apply_y(noun): 
    return re.sub('y$', 'ies', noun)
def match_default(noun):
    return True
def apply_default(noun):
    return noun + 's'

rules = ((match_sxz, apply_sxz), 
         (match_h, apply_h),
         (match_y, apply_y),
         (match_default, apply_default)
)

def plural(noun):
    for matches_rule, apply_rule in rules:
        if matches_rule(noun):
            return apply_rule(noun)
```

The reason this technique works is that everything in Python is an object, including functions. The rules data structure contains functions — not names of functions, but actual function objects. When they get assigned in the `for` loop, then `matches_rule` and `apply_rule` are actual functions that you can call.

### 6.4. A LIST OF PATTERNS <a name="6-4--A-LIST-OF-PATTERNS"></a>

Defining separate named functions for each match and apply rule isn’t really necessary. You never call them directly; you add them to the `rules` sequence and call them through there. Furthermore, each function follows one of two patterns. All the match functions call `re.search()`, and all the apply functions call `re.sub()`. Let’s factor out the patterns so that defining new rules can be easier.

```python
import re

def build_match_and_apply_functions(pattern, search, replace):
    def matches_rule(word): 
        return re.search(pattern, word)
    
	def apply_rule(word): 
        return re.sub(search, replace, word)

	return (matches_rule, apply_rule)
```

- This technique of using the values of outside parameters within a dynamic function is called _**closures**_. You’re essentially defining constants within the `apply_rule` function you’re building: it takes one parameter (`word`), but it then acts on that plus two other values (`search` and `replace`) which were set when you defined the apply function.
- Finally, the `build_match_and_apply_functions()` function returns a tuple of two values: the two functions you just created. The constants you defined within those functions (`pattern` within the `matches_rule()` function, and `search` and `replace` within the `apply_rule()` function) stay with those functions, even after you return from `build_match_and_apply_functions()`.

If this is incredibly confusing (and it should be, this is weird stuff), it may become clearer when you see how to use it.

```python
patterns = \ 
    (
        ('[sxz]$', '$', 'es'),
        ('[^aeioudgkprt]h$', '$', 'es'),
        ('(qu|[^aeiou])y$', 'y$', 'ies'),
        ('$', '$', 's') 
    )

rules = [build_match_and_apply_functions(pattern, search, replace) for (pattern, search, replace) in patterns]
```

- There’s a slight change here, in the fallback rule. In the previous example, the `match_default()` function simply returned `True`, meaning that if none of the more specific rules matched, the code would simply add an _s_ to the end of the given word. This example does something functionally equivalent. The final regular expression asks whether the word has an end (`$` matches the end of a string). Of course, every string has an end, even an empty string, so this expression always matches. Thus, it serves the same purpose as the `match_default()` function that always returned `True`

```python
def plural(noun):
    for matches_rule, apply_rule in rules: 
        if matches_rule(noun):
            return apply_rule(noun)
```

### 6.5. A FILE OF PATTERNS <a name="6-5--A-FILE-OF-PATTERNS"></a>

First, let’s create a text file that contains the rules you want. No fancy data structures, just whitespace-delimited strings in three columns. Let’s call it `plural4-rules.txt`.

```python
[sxz]$ $ es
[^aeioudgkprt]h$ $ es
[^aeiou]y$ y$ ies
$ $ s
```

Now let’s see how you can use this rules file.

```python
import re

def build_match_and_apply_functions(pattern, search, replace):
    def matches_rule(word):
        return re.search(pattern, word)
    def apply_rule(word):
        return re.sub(search, replace, word)
    return (matches_rule, apply_rule)

rules = [] # initialized as empty

with open('plural4-rules.txt', encoding='utf-8') as pattern_file: 
    for line in pattern_file: 
        pattern, search, replace = line.split(None, 3) 
        rules.append(build_match_and_apply_functions(pattern, search, replace))
```

- The `with` statement creates what’s called a _**context**_: when the with block ends, Python will automatically close the file, even if an exception is raised inside the with block.
- The `for line in <fileobject>` idiom reads data from the open file, one line at a time.
- The first argument to the `split()` method is `None`, which means “split on any whitespace (tabs or spaces, it makes no difference).” The second argument is `3`, which means “split on whitespace 3 times, then leave the rest of the line alone.”

The improvement here is that you’ve completely separated the pluralization rules into an external file, so it can be maintained separately from the code that uses it. Code is code, data is data, and life is good.

### 6.6. GENERATORS <a name="6-6--GENERATORS"></a>

Let’s look at an interactive example first.

```python
>>> def make_counter(x):
... print('entering make_counter')
... while True:
...     yield x 
...     print('incrementing x')
...     x = x + 1
...
>>> counter = make_counter(2) 
>>> counter 
<generator object at 0x001C9C10>
>>> next(counter) 
entering make_counter
2
>>> next(counter) 
incrementing x
3
>>> next(counter) 
incrementing x
4
```

- The presence of the yield keyword in `make_counter` means that this is not a normal function. It is a special kind of function which generates values one at a time. Calling it will return a _**generator**_ object that can be used to generate successive values of `x` (Note that this does not actually execute the function code).
- The `next()` function takes a generator object and returns its next value.
	- The first time you call `next()` with the counter generator, it executes the code in `make_counter()` up to the first `yield` statement, then returns the value that was yielded.
	- Repeatedly calling `next()` with the same generator object resumes exactly where it left off and continues the loop until it hits the next `yield` statement. All variables, local state, &c. are saved on `yield` and restored on `next()`.
	- 简单说就是： `yield` pauses a function; `next()` resumes where it left off.
	
Since `make_counter` sets up an infinite loop, you could theoretically do this forever, and it would just keep incrementing `x` and spitting out values. But let’s look at more productive uses of generators instead.

#### 6.6.1. A FIBONACCI GENERATOR <a name="6-6-1--A-FIBONACCI-GENERATOR"></a>

```python
def fib(max):
    a, b = 0, 1 
    while a < max:
        yield a 
        a, b = b, a + b 
```

```python
>>> from fibonacci import fib
>>> for n in fib(1000): 
... print(n, end=' ') 
0 1 1 2 3 5 8 13 21 34 55 89 144 233 377 610 987
>>> list(fib(1000)) 
[0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987]
```

#### 6.6.2. A PLURAL RULE GENERATOR <a name="6-6-2--A-PLURAL-RULE-GENERATOR"></a>

```python
def rules(rules_filename):
    with open(rules_filename, encoding='utf-8') as pattern_file:
        for line in pattern_file:
            pattern, search, replace = line.split(None, 3)
            yield build_match_and_apply_functions(pattern, search, replace)

def plural(noun, rules_filename='plural5-rules.txt'):
    for matches_rule, apply_rule in rules(rules_filename):
        if matches_rule(noun):
            return apply_rule(noun)

	raise ValueError('no matching rule for {0}'.format(noun))
```

What have you gained over stage 4? Startup time. In stage 4, when you imported the `plural4` module, it read the entire patterns file and built a list of all the possible rules, before you could even think about calling the `plural()` function. With generators, you can do everything lazily: you read the first rule and create functions and try them, and if that works you don’t ever read the rest of the file or create any other functions.

What have you lost? Performance! Every time you call the `plural()` function, the `rules()` generator starts over from the beginning — which means re-opening the patterns file and reading from the beginning, one line at a time.

What if you could have the best of both worlds: minimal startup cost (don’t execute any code on import)(import 后不立即 parse rules) and maximum performance (don’t build the same functions over and over again). Oh, and you still want to keep the rules in a separate file (because code is code and data is data), just as long as you never have to read the same line twice. To do that, you’ll need to build your own iterator.

## CHAPTER 7. CLASSES & ITERATORS <a name="CHAPTER-7--CLASSES-&-ITERATORS"></a>

### 7.1. DIVING IN <a name="7-1--DIVING-IN"></a>

Comprehensions are just a simple form of iterators. Generators are just a simple form of iterators. A function that `yield`s values is a nice, compact way of building an iterator without building an iterator. Let me show you what I mean by that.

Remember the Fibonacci generator? Here it is as a built-from-scratch iterator:

```python
class Fib:
    '''iterator that yields numbers in the Fibonacci sequence'''

	def __init__(self, max):
        self.max = max

	def __iter__(self):
        self.a = 0
        self.b = 1
        return self

	def __next__(self):
        fib = self.a
        if fib > self.max:
            raise StopIteration
        self.a, self.b = self.b, self.a + self.b
        return fib
```

Let’s take that one line at a time. `class Fib:`. Then what's a class?

### 7.2. DEFINING CLASSES <a name="7-2--DEFINING-CLASSES"></a>

Python is fully object-oriented: you can define your own classes, inherit from your own or built-in classes, and instantiate the classes you’ve defined.

```python
class PapayaWhip: 
    pass
```

This `PapayaWhip` class doesn’t define any methods or attributes, but syntactically (of or relating to syntax), there needs to be something in the definition, thus the `pass` statement. This is a Python reserved word that just means “move along, nothing to see here”. It’s a statement that does nothing, and it’s a good placeholder when you’re stubbing out functions or classes.

- The pass statement in Python is like a empty set of curly braces (`{}`) in Java or C.

The `__init__()` method is called immediately after an instance of the class is created. It would be tempting — but technically incorrect — to call this the “constructor” of the class. It’s tempting, because it looks like a C++ constructor (by convention, the `__init__()` method is the first method defined for the class), acts like one (it’s the first piece of code executed in a newly created instance of the class), and even sounds like one. Incorrect, because the object has already been constructed by the time the `__init__()` method is called, and you already have a valid reference to the new instance of the class.

The first argument of every class method, including the `__init__()` method, is always a reference to the current instance of the class. By convention, this argument is named `self`. This argument fills the role of the reserved word `this` in C++ or Java, but `self` is NOT a reserved word in Python, merely a naming convention. Nonetheless, please don’t call it anything but `self`; this is a very strong convention.

In the `__init__()` method, `self` refers to the newly created object; in other class methods, it refers to the instance whose method was called. Although you need to specify self explicitly when defining the method, you do not specify it when calling the method; Python will add it for you automatically.

### 7.3. INSTANTIATING CLASSES <a name="7-3--INSTANTIATING-CLASSES"></a>

Instantiating classes in Python is straightforward. To instantiate a class, simply call the class as if it were a function, passing the arguments that the `__init__()` method requires. The return value will be the newly created object.

Every class instance has a built-in attribute, `__class__`, which is the object’s class. Java programmers may be familiar with the `Class` class, which contains methods like `getName()` and `getSuperclass()` to get metadata information about an object. In Python, this kind of metadata is available through attributes, but the idea is the same.

You can access the instance’s `docstring` just as with a function or a module, by the attribute `__doc__`. All instances of a class share the same `docstring`.

### 7.4. INSTANCE VARIABLES <a name="7-4--INSTANCE-VARIABLES"></a>

I.e. `self.max`, like `this.foo` in Java.

### 7.5. A FIBONACCI ITERATOR <a name="7-5--A-FIBONACCI-ITERATOR"></a>

All three of these class methods, `__init__()`, `__iter__()`, and `__next__(0`), begin and end with a pair of underscore (`_`) characters. Why is that? There’s nothing magical about it, but it usually indicates that these are “special methods.” The only thing “special” about special methods is that they aren’t called directly; Python calls them when you use some other syntax on the class or an instance of the class.

“Calling” `Fib(max)` is really creating an instance of this class and calling its` __init__()` method with `max`. The `__init__()` method saves the maximum value as an instance variable so other methods can refer to it later.

The `__iter__()` method is called whenever someone calls `iter(fib)`. (As you’ll see in a minute, a for loop will call this automatically, but you can also call it yourself manually.) After performing beginning-of-iteration initialization (in this case, resetting `self.a` and `self.b`, our two counters), the `__iter__()` method can return any object that implements a `__next__()` method. In this case (and in most cases), `__iter__()` simply returns `self`, which signals that this class has a `__next__()` method.

The `__next__()` method is called whenever someone calls `next()` on an iterator of an instance of a class. When the `__next__()` method raises a `StopIteration` exception, this signals to the caller that the iteration is exhausted. Unlike most exceptions, this is not an error; it’s a normal condition that just means that the iterator has no more values to generate. If the caller is a `for` loop, it will notice this `StopIteration` exception and gracefully exit the loop. (In other words, it will swallow the exception.) This little bit of magic is actually the key to using iterators in `for` loops.

To spit out the next value, an iterator’s `__next__()` method simply returns the value. Do not use `yield` here; that’s a bit of syntactic sugar that only applies when you’re using generators. Here you’re creating your own iterator from scratch; use `return` instead.

Let’s see how to call this iterator:

```python
>>> from fibonacci2 import Fib
>>> for n in Fib(1000):
... print(n, end=' ')
0 1 1 2 3 5 8 13 21 34 55 89 144 233 377 610 987
```

Here’s what happens:

- The for loop calls `Fib(1000)`, as shown. This returns an instance of the `Fib` class. Call this `fib_inst`.
- Secretly, and quite cleverly, the for loop calls iter(`fib_inst`), which returns an iterator object. Call this `fib_iter`. In this case, `fib_iter == fib_inst`, because the `__iter__()` method returns `self`, but the `for` loop doesn’t know (or care) about that.
- To “loop through” the iterator, the `for` loop calls `next(fib_iter)`, which calls the `__next__()` method on the `fib_iter` object, which does the next-Fibonacci-number calculations and returns a value. The `for` loop takes this value and assigns it to `n`, then executes the body of the `for` loop for that value of `n`.

### 7.6. A PLURAL RULE ITERATOR <a name="7-6--A-PLURAL-RULE-ITERATOR"></a>

```python
class LazyRules:
    rules_filename = 'plural6-rules.txt'

    def __init__(self):
        self.pattern_file = open(self.rules_filename, encoding='utf-8')
        self.cache = []

    def __iter__(self):
        self.cache_index = 0
        return self

    def __next__(self):
        self.cache_index += 1
        if len(self.cache) >= self.cache_index:
            return self.cache[self.cache_index - 1]

		if self.pattern_file.closed:
            raise StopIteration

        line = self.pattern_file.readline()
        if not line:
            self.pattern_file.close()
            raise StopIteration

        pattern, search, replace = line.split(None, 3)
        funcs = build_match_and_apply_functions(pattern, search, replace)
        self.cache.append(funcs)
        return funcs

rules = LazyRules()

def plural(noun):
    for matches_rule, apply_rule in rules:
        if matches_rule(noun):
            return apply_rule(noun)

	raise ValueError('no matching rule for {0}'.format(noun))
```

So this is a class that implements `__iter__()` and `__next__()`, so it can be used as an iterator. Then, you instantiate the class and assign it to rules. This happens just once, on import.

Putting it all together, here’s what happens when:

- When the module is imported, it creates a single instance of the `LazyRules` class, called `rules`, which opens the pattern file but does not read from it.
- When asked for the first match and apply function, it checks its cache but finds the cache is empty. So it reads a single line from the pattern file, builds the `match` and `apply` functions from those patterns, and caches them.
- Let’s say, for the sake of argument, that the very first rule matched. If so, no further `match` and `apply` functions are built, and no further lines are read from the pattern file.
- Furthermore, for the sake of argument, suppose that the caller calls the `plural()` function again to pluralize a different word. The `for` loop in the `plural()` function will call `iter(rules)`, which will reset the cache index but will not reset the open file object.
- The first time through, the `for` loop will ask for a value from rules, which will invoke its `__next__()` method. This time, however, the cache is primed with a single pair of `match` and `apply` functions, corresponding to the patterns in the first line of the pattern file. Since they were built and cached in the course of pluralizing the previous word, they’re retrieved from the cache. The cache index increments, and the open file is never touched.
- Let’s say, for the sake of argument, that the first rule does not match this time around. So the `for` loop comes around again and asks for another value from rules. This invokes the `__next__()` method a second time. This time, the cache is exhausted — it only contained one item, and we’re asking for a second — so the `__next__()` method continues. It reads another line from the open file, builds match and apply functions out of the patterns, and caches them.
- This read-build-and-cache process will continue as long as the rules being read from the pattern file don’t match the word we’re trying to pluralize. If we do find a matching rule before the end of the file, we simply use it and stop, with the file still open. The file pointer will stay wherever we stopped reading, waiting for the next `readline()` command. In the meantime, the cache now has more items in it, and if we start all over again trying to pluralize a new word, each of those items in the cache will be tried before reading the next line from the pattern file.

书上还讨论了这种写法的优势（Minimal startup cost / Maximum performance / Separation of code and data）和劣势（主要是 opened file 一直悬在那里），值得一看。

## CHAPTER 8. ADVANCED ITERATORS <a name="CHAPTER-8--ADVANCED-ITERATORS"></a>

### 8.3. FINDING THE UNIQUE ITEMS IN A SEQUENCE <a name="8-3--FINDING-THE-UNIQUE-ITEMS-IN-A-SEQUENCE"></a>

```python
>>> a_list = ['The', 'sixth', 'sick', "sheik's", 'sixth', "sheep's", 'sick']
>>> set(a_list) 
{'sixth', 'The', "sheep's", 'sick', "sheik's"}
>>> a_string = 'EAST IS EAST'
>>> set(a_string) 
{'A', ' ', 'E', 'I', 'S', 'T'}
>>> words = ['SEND', 'MORE', 'MONEY']
>>> ''.join(words) 
'SENDMOREMONEY'
>>> set(''.join(words)) 
{'E', 'D', 'M', 'O', 'N', 'S', 'R', 'Y'}
```

### 8.4. MAKING ASSERTIONS <a name="8-4--MAKING-ASSERTIONS"></a>

```python
>>> assert 1 + 1 == 2 
>>> assert 1 + 1 == 3 
Traceback (most recent call last):
File "<stdin>", line 1, in <module>
AssertionError
>>> assert 2 + 2 == 5, "Only for very large values of 2" 
Traceback (most recent call last):
File "<stdin>", line 1, in <module>
AssertionError: Only for very large values of 2
```

Therefore, this line of code:

```python
assert len(unique_characters) <= 10, 'Too many letters'
```

is equivalent to this:

```python
if len(unique_characters) > 10:
    raise AssertionError('Too many letters')
```

### 8.5. GENERATOR EXPRESSIONS <a name="8-5--GENERATOR-EXPRESSIONS"></a>

```python
# Generator expression
(x*2 for x in range(256))

# List comprehension
[x*2 for x in range(256)]

# Dictionary comprehension
{x:x*2 for x in range(256)}

# Set comprehension
{x*2 for x in range(256)}

# There is NO tuple comprehension
# but you can new a tuple with a generator expression
tuple(x*2 for x in range(256))
```

`(x*2 for x in range(256))` is equal to:

```python
def times2(range):
    for x in range:
        yield x*2

times2(range(256))
```

### 8.6. CALCULATING PERMUTATIONS… THE LAZYWAY! <a name="8-6--CALCULATING-PERMUTATIONS-THE-LAZYWAY!"></a>

```python
# [1, 2, 3] 三个选两个做排列组合
>>> import itertools 
>>> perms = itertools.permutations([1, 2, 3], 2) 
>>> next(perms) 
(1, 2)
>>> next(perms)
(1, 3)
>>> next(perms)
(2, 1) 
>>> next(perms)
(2, 3)
>>> next(perms)
(3, 1)
>>> next(perms)
(3, 2)
>>> next(perms) 
Traceback (most recent call last):
File "<stdin>", line 1, in <module>
StopIteration
```

The `permutations()` function doesn’t have to take a list. It can take any sequence — even a string.

```python
>>> import itertools
>>> perms = itertools.permutations('ABC', 3) 
>>> next(perms)
('A', 'B', 'C')
```

### 8.7. OTHER FUN STUFF IN THE `itertools` MODULE <a name="8-7--OTHER-FUN-STUFF-IN-THE-itertools-MODULE"></a>

```python
>>> import itertools
>>> list(itertools.product('ABC', '123')) 
[('A', '1'), ('A', '2'), ('A', '3'),
('B', '1'), ('B', '2'), ('B', '3'),
('C', '1'), ('C', '2'), ('C', '3')]
>>> list(itertools.combinations('ABC', 2)) 
[('A', 'B'), ('A', 'C'), ('B', 'C')]

>>> names = ['Alex', 'Anne', 'Dora', 'John', 'Mike', 'Chris', 'Ethan', 'Sarah', 'Lizzie', 'Wesley']
>>> groups = itertools.groupby(names, len)
>>> list(groups)
[(4, <itertools._grouper object at 0x00BA8BF0>),
 (5, <itertools._grouper object at 0x00BB4050>),
 (6, <itertools._grouper object at 0x00BB4030>)]
 
>>> list(itertools.chain(range(0, 3), range(10, 13))) 
[0, 1, 2, 10, 11, 12]
>>> list(zip(range(0, 3), range(10, 13))) 
[(0, 10), (1, 11), (2, 12)]
>>> list(zip(range(0, 3), range(10, 14))) 
[(0, 10), (1, 11), (2, 12)]
>>> list(itertools.zip_longest(range(0, 3), range(10, 14))) 
[(0, 10), (1, 11), (2, 12), (None, 13)]
```

### 8.8. A NEW KIND OF STRINGMANIPULATION <a name="8-8--A-NEW-KIND-OF-STRINGMANIPULATION"></a>

```python
>>> translation_table = {ord('A'): ord('O')} 
>>> translation_table ②
{65: 79}
>>> 'MARK'.translate(translation_table) 
'MORK'
```

更多内容见书上。

### 8.9. EVALUATING ARBITRARY STRINGS AS PYTHON EXPRESSIONS <a name="8-9--EVALUATING-ARBITRARY-STRINGS-AS-PYTHON-EXPRESSIONS"></a>

```python
>>> eval('1 + 1 == 2')
True
>>> eval('1 + 1 == 3')
False
>>> eval('9567 + 1085 == 10652')
True
```

The `eval()` function isn’t limited to boolean expressions. It can handle any Python expression and returns any datatype.

更多内容见书上。

### 8.10. PUTTING IT ALL TOGETHER （略） <a name="8-10--PUTTING-IT-ALL-TOGETHER-（略）"></a>

## CHAPTER 9. UNIT TESTING <a name="CHAPTER-9--UNIT-TESTING"></a>

Python has a framework for unit testing, the appropriately-named `unittest` module.

Tests run in isolation, separate from any other test cases (even if they test the same functions). Each test case is an island.

### 9.2. A SINGLE QUESTION <a name="9-2--A-SINGLE-QUESTION"></a>

```python
import roman1
import unittest

class KnownValues(unittest.TestCase):
    def test_to_roman_known_values(self):
	     ......
		 self.assertEqual(numeral, result)
	
if __name__ == '__main__':
    unittest.main()
```

A test method takes no parameters, returns no value, and must have a name beginning with the four letters `test`. 

- If a test method exits normally without raising an exception, the test is considered passed; 
- if the method raises an exception, the test is considered failed.

TDD: Write a test that fails, then code until it passes. (Still remember `pass`?)

Running the script runs `unittest.main()`, which runs each test case. There is no required organization of these test classes; they can each contain a single test method, or you can have one class that contains multiple test methods. The only requirement is that each test class must inherit from `unittest.TestCase`.

For each test case, the `unittest` module will print out the `docstring` of the method and whether that test passed or failed.

### 9.3. “HALT AND CATCH FIRE” <a name="9-3--“HALT-AND-CATCH-FIRE”"></a>

```python
class OutOfRangeError(ValueError): 
    pass

class ToRomanBadInput(unittest.TestCase):
    def test_too_large(self): 
        '''to_roman should fail with large input'''
        self.assertRaises(roman2.OutOfRangeError, roman2.to_roman, 4000)
```

A unit test actually has three return values: `pass`, `fail`, and `error`. 

- `Pass`, of course, means that the test passed — the code did what you expected. 
- `Fail` means it executed the code but the result was not what you expected. 
- `Error` means that the code didn’t even execute properly.

### 9.4. MORE HALTING,MORE FIRE <a name="9-4--MORE-HALTINGMORE-FIRE"></a>

```python
if not (0 < n < 4000): 
    raise OutOfRangeError('number out of range (must be 1..3999)')
```

This is a nice Pythonic shortcut: multiple comparisons at once. This is equivalent to `if not ((0 < n) and (n < 4000))`, but it’s much easier to read.

### 9.5. AND ONEMORE THING… <a name="9-5--AND-ONEMORE-THING"></a>

```python
if not isinstance(n, int): 
    raise NotIntegerError('non-integers can not be converted')
```

The built-in `isinstance()` function tests whether a variable is a particular type (or, technically, any descendant type).

## CHAPTER 10. REFACTORING <a name="CHAPTER-10--REFACTORING"></a>

### 10.1. DIVING IN <a name="10-1--DIVING-IN"></a>

Like it or not, bugs happen. Despite your best efforts to write comprehensive unit tests, bugs happen. What do I mean by “bug”? A bug is a test case you haven’t written yet.

```python
if not s: 
    raise InvalidRomanNumeralError('Input can not be blank')
if not re.search(romanNumeralPattern, s):
    raise InvalidRomanNumeralError('Invalid Roman numeral: {}'.format(s))
```

- 测试 blank string 用 `if not s`
- Starting in Python 3.1, you can skip the numbers when using positional indexes in a format specifier. That is, instead of using the format specifier `{0}` to refer to the first parameter to the `format()` method, you can simply use `{}` and Python will fill in the proper positional index for you. This works for any number of arguments; the first `{}` is `{0}`, the second `{}` is `{1}`, and so forth.

Coding this way (i.e. TDD, even when fixing bugs) does not make fixing bugs any easier. Simple bugs require simple test cases; complex bugs will require complex test cases. In a testing-centric environment, it may seem like it takes longer to fix a bug, since you need to articulate in code exactly what the bug is (to write the test case), then fix the bug itself. Then if the test case doesn’t pass right away, you need to figure out whether the fix was wrong, or whether the test case itself has a bug in it. However, in the long run, this back-and-forth between test code and code tested pays for itself, because it makes it more likely that bugs are fixed correctly the first time. Also, since you can easily re-run all the test cases along with your new one, you are much less likely to break old code when fixing new code. Today’s unit test is tomorrow’s regression test.

### 10.2. HANDLING CHANGING REQUIREMENTS <a name="10-2--HANDLING-CHANGING-REQUIREMENTS"></a>

Comprehensive unit testing means never having to rely on a programmer who says “Trust me.”

### 10.3. REFACTORING <a name="10-3--REFACTORING"></a>

```python
# XXX.py

def ......

build_lookup_tables()
```

- `build_lookup_tables()` gets called when the module is imported. It is important to understand that modules are ONLY imported once, then cached. If you import an already-imported module, it does nothing. So this code will only get called the first time you import this module.

## CHAPTER 11. FILES <a name="CHAPTER-11--FILES"></a>

### 11.2. READING FROM TEXT FILES <a name="11-2--READING-FROM-TEXT-FILES"></a>

```python
a_file = open('examples/chinese.txt', encoding='utf-8')
```

- The directory path uses a forward slash. It just works, no matter what the OS is.
- The above path is a relative one.

#### 11.2.1. CHARACTER ENCODING REARS ITS UGLY HEAD <a name="11-2-1--CHARACTER-ENCODING-REARS-ITS-UGLY-HEAD"></a>

Bytes are bytes; characters are an abstraction. A string is a sequence of Unicode characters. But a file on disk is not a sequence of Unicode characters; a file on disk is a sequence of bytes. So if you read a “text file” from disk, how does Python convert that sequence of bytes into a sequence of characters? It decodes the bytes according to a specific character encoding algorithm and returns a sequence of Unicode characters (otherwise known as a string).

#### 11.2.2. STREAM OBJECTS <a name="11-2-2--STREAM-OBJECTS"></a>

The `open()` function returns a `stream` object.

```python
>>> a_file = open('examples/chinese.txt', encoding='utf-8')
>>> a_file.name
'examples/chinese.txt'
>>> a_file.encoding
'utf-8'
>>> a_file.mode
'r'
```

#### 11.2.3. READING DATA FROM A TEXT FILE <a name="11-2-3--READING-DATA-FROM-A-TEXT-FILE"></a>

```python
>>> a_file = open('examples/chinese.txt', encoding='utf-8')
>>> a_file.read() 
'Dive Into Python 是为有经验的程序员编写的一本 Python 书。\n'
>>> a_file.read() 
''
```

Python does not consider reading past end-of-file to be an error; it simply returns an empty string.

#### 11.2.4. CLOSING FILES <a name="11-2-4--CLOSING-FILES"></a>

```python
>>> a_file.close()
>>> a_file.closed 
True
```

#### 11.2.5. CLOSING FILES AUTOMATICALLY <a name="11-2-5--CLOSING-FILES-AUTOMATICALLY"></a>

```python
with open('examples/chinese.txt', encoding='utf-8') as a_file:
    a_file.seek(17)
    a_character = a_file.read(1)
    print(a_character)
```

This code calls `open()`, but it never calls `a_file.close()`. The `with` statement starts a code block, like an if statement or a `for` loop. Inside this code block, you can use the variable a_file as the stream object returned from the call to `open()`. All the regular stream object methods are available — `seek()`, `read()`, whatever you need. When the `with` block ends, even if you “exit” it via an unhandled exception, Python calls `a_file.close()` _**automatically**_.

In technical terms, the `with` statement creates a _**runtime context**_. In these examples, the stream object acts as a context manager. Python creates the stream object `a_file` and tells it that it is entering a runtime context. When the `with` code block is completed, Python tells the stream object that it is exiting the runtime context, and the stream object calls its own `close()` method.

There’s nothing file-specific about the `with` statement; it’s just a generic framework for creating runtime contexts and telling objects that they’re entering and exiting a runtime context. The behavior is defined in the stream object, not in the `with` statement.

#### 11.2.6. READING DATA ONE LINE AT A TIME <a name="11-2-6--READING-DATA-ONE-LINE-AT-A-TIME"></a>

```python
line_number = 0
with open('examples/favorite-people.txt', encoding='utf-8') as a_file: 
    for a_line in a_file: 
    line_number += 1
    print('{:>4} {}'.format(line_number, a_line.rstrip())) 
```

To read a file one line at a time, use a `for` loop. That’s it. Besides having explicit methods like `read()`, the stream object is also an iterator which spits out a single line every time you ask for a value.

- The format specifier `{:>4}` means “print this argument right-justified within 4 spaces.”
- The `rstrip()` string method removes the trailing whitespace, including the carriage return characters.

### 11.3. WRITING TO TEXT FILES <a name="11-3--WRITING-TO-TEXT-FILES"></a>

There are two file modes for writing:

- “Write” mode will overwrite the file. Pass `mode='w'` to the `open()` function.
- “Append” mode will add data to the end of the file. Pass `mode='a'` to the `open()` function.

### 11.4. BINARY FILES <a name="11-4--BINARY-FILES"></a>

Not all files contain text. Some of them contain pictures of my dog.

```python
>>> an_image = open('examples/beauregard.jpg', mode='rb') 
>>> an_image.mode 
'rb'
>>> an_image.name 
'examples/beauregard.jpg'
>>> an_image.encoding 
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
AttributeError: '_io.BufferedReader' object has no attribute 'encoding'
```

- Opening a file in binary mode is simple but subtle. The only difference from opening it in text mode is that the `mode` parameter contains a 'b' character.
- A binary stream object has no `encoding` attribute

```python
>>> data = an_image.read(3) 
>>> data
b'\xff\xd8\xff'
```

- You’re reading bytes, not strings. Since you opened the file in binary mode, the `read()` method takes the number of bytes to read, not the number of characters.

### 11.5. STREAM OBJECTS FROM NON-FILE SOURCES <a name="11-5--STREAM-OBJECTS-FROM-NON-FILE-SOURCES"></a>

In the simplest case, a stream object is anything with a `read()` method which takes an optional `size` parameter and returns a string. 

- When called with no `size` parameter, the `read()` method should read everything there is to read from the input source and return all the data as a single value. 
- When called with a `size` parameter, it reads that much from the input source and returns that much data. When called again, it picks up where it left off and returns the next chunk of data.

You’re not limiting yourself to real files. The input source that’s being “read” could be anything: a web page, a string in memory, even the output of another program.

```python
>>> a_string = 'PapayaWhip is the new black.'
>>> import io 
>>> a_file = io.StringIO(a_string) 
>>> a_file.read() 
'PapayaWhip is the new black.'
```

- `io.StringIO` lets you treat a string as a text file. 
- There’s also a `io.BytesIO` class, which lets you treat a byte array as a binary file.

#### 11.5.1. HANDLING COMPRESSED FILES (略) <a name="11-5-1--HANDLING-COMPRESSED-FILES"></a>

### 11.6. STANDARD INPUT, OUTPUT, AND ERROR <a name="11-6--STANDARD-INPUT-OUTPUT-AND-ERROR"></a>

By default, both of these pipes, `stdout` and `stderr`, are just connected to the terminal window where you are working. 

In the graphical Python Shell, the `stdout` and `stderr` pipes default to your “Interactive Window”.

```python
>>> for i in range(3):
... sys.stdout.write('is the') 
is theis theis the
```

`stdout` is defined in the `sys` module, and it is a stream object. Calling its `write()` function will print out whatever string you give it. 

- In fact, this is what the print function really does; it adds a carriage return to the end of the string you’re printing, and calls `sys.stdout.write`.

`sys.stdout` and `sys.stderr` are stream objects, but they are write-only. Attempting to call their `read()` method will always raise an `IOError`.

#### 11.6.1. REDIRECTING STANDARD OUTPUT <a name="11-6-1--REDIRECTING-STANDARD-OUTPUT"></a>

`sys.stdout` and `sys.stderr` are not constants; they’re variables. That means you can assign them a new value — any other stream object — to redirect their output.

Any class can be a context manager by defining two special methods: `__enter__()` and `__exit__()`.（书上是一个 redirect + with 的例子）

## CHAPTER 12. XML (略) <a name="CHAPTER-12--XML"></a>

## CHAPTER 13. SERIALIZING PYTHON OBJECTS <a name="CHAPTER-13--SERIALIZING-PYTHON-OBJECTS"></a>

### 13.1. DIVING IN <a name="13-1--DIVING-IN"></a>

On the surface, the concept of serialization is simple. You have a data structure in memory that you want to save, reuse, or send to someone else. How would you do that? Well, that depends on how you want to save it, how you want to reuse it, and to whom you want to send it. Many games allow you to save your progress when you quit the game and pick up where you left off when you relaunch the game. In this case, a data structure that captures “your progress so far” needs to be stored on disk when you quit, then loaded from disk when you relaunch. The data is only meant to be used by the same program that created it, never sent over a network, and never read by anything other than the program that created it. Therefore, the interoperability issues are limited to ensuring that later versions of the program can read data written by earlier versions.

For cases like this, the `pickle` module is ideal. It’s part of the Python standard library, so it’s always available. It’s fast; the bulk of it is written in C, like the Python interpreter itself. It can store arbitrarily complex Python data structures.

### 13.2. SAVING DATA TO A PICKLE FILE <a name="13-2--SAVING-DATA-TO-A-PICKLE-FILE"></a>

```python
>>> import pickle
>>> with open('entry.pickle', 'wb') as f: 
... pickle.dump(entry, f)
```

- To do this, it serializes the data structure using a data format called “the pickle protocol.”
- Not every Python data structure can be serialized by the `pickle` module. The pickle protocol has changed several times as new data types have been added to the Python language, but there are still limitations.
- As a result of these changes, there is no guarantee of compatibility between different versions of Python itself. Newer versions of Python support the older serialization formats, but older versions of Python do not support newer formats (since they don’t support the newer data types).
- The latest version of the `pickle` protocol is a binary format. Be sure to open your pickle files in binary mode, or the data will get corrupted during writing.

### 13.3. LOADING DATA FROM A PICKLE FILE <a name="13-3--LOADING-DATA-FROM-A-PICKLE-FILE"></a>

```python
>>> import pickle
>>> with open('entry.pickle', 'rb') as f: 
... entry = pickle.load(f)
```

### 13.4. PICKLINGWITHOUT A FILE <a name="13-4--PICKLINGWITHOUT-A-FILE"></a>

You can also serialize to a `bytes` object in memory.

```python
>>> b = pickle.dumps(entry) 
>>> type(b) 
<class 'bytes'>
```

### 13.6. DEBUGGING PICKLE FILES (略) <a name="13-6--DEBUGGING-PICKLE-FILES"></a>

### 13.7. SERIALIZING PYTHON OBJECTS TO BE READ BY OTHER LANGUAGES <a name="13-7--SERIALIZING-PYTHON-OBJECTS-TO-BE-READ-BY-OTHER-LANGUAGES"></a>

主要是用 JSON. The JSON data format is text-based, not binary.

其余看书。

### 13.8. SAVING DATA TO A JSON FILE (略) <a name="13-8--SAVING-DATA-TO-A-JSON-FILE"></a>

### 13.9. MAPPING OF PYTHON DATATYPES TO JSON (略) <a name="13-9--MAPPING-OF-PYTHON-DATATYPES-TO-JSON"></a>
 
### 13.10. SERIALIZING DATATYPES UNSUPPORTED BY JSON (略) <a name="13-10--SERIALIZING-DATATYPES-UNSUPPORTED-BY-JSON"></a>

### 13.11. LOADING DATA FROM A JSON FILE (略) <a name="13-11--LOADING-DATA-FROM-A-JSON-FILE"></a>

## CHAPTER 14. HTTPWEB SERVICES (略) <a name="CHAPTER-14--HTTPWEB-SERVICES"></a>

## CHAPTER 15. CASE STUDY: PORTING `chardet` TO PYTHON 3 (略) <a name="CHAPTER-15--CASE-STUDY-PORTING-chardet-TO-PYTHON-3"></a>

## CHAPTER 16. PACKAGING PYTHON LIBRARIES (略) <a name="CHAPTER-16--PACKAGING-PYTHON-LIBRARIES"></a>

## CHAPTER 17. PORTING CODE TO PYTHON 3 WITH `2to3` (略) <a name="CHAPTER-17--PORTING-CODE-TO-PYTHON-3-WITH-2to3"></a>

## CHAPTER 18. SPECIAL METHOD NAMES (略) <a name="CHAPTER-18--SPECIAL-METHOD-NAMES"></a>

