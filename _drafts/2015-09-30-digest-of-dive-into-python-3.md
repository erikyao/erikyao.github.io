---
layout: post
title: "Digest of <i>Dive into Python 3</i>"
description: ""
category: Python
tags: [Python-101, Book]
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

A dictionary is an unordered set of key-value pairs.

<pre class="prettyprint linenums">
# Use {} just like Sets
&gt;&gt;&gt; a_dict = {'server': 'db.diveintopython3.org', 'database': 'mysql'} 
&gt;&gt;&gt; a_dict
{'server': 'db.diveintopython3.org', 'database': 'mysql'}
&gt;&gt;&gt; a_dict['server'] 
'db.diveintopython3.org'
&gt;&gt;&gt; a_dict['database'] 
'mysql'

# modify the value by an existing entry
&gt;&gt;&gt; a_dict['database'] = 'blog'
# add a new entry
&gt;&gt;&gt; a_dict['user'] = 'mark'
</pre>

- An empty dictionary is false. Any dictionary with at least one key-value pair is true.

### 2.8. None

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

## CHAPTER 3. COMPREHENSIONS

### 3.2.WORKINGWITH FILES AND DIRECTORIES

Python 3 comes with a module called `os`, which stands for “operating system.” The os module contains a plethora of functions to get information on — and in some cases, to manipulate — local directories, files, processes, and environment variables. Python does its best to offer a unified API across all supported operating systems so your programs can run on any computer with as little platform-specific code as possible.

<pre class="prettyprint linenums">
&gt;&gt;&gt; import os 

# 相当于 pwd 或者 cd (cd 不带参数时就相当于 pwd)
&gt;&gt;&gt; print(os.getcwd()) 
C:\Python31

# 相当于 cd 到某个目录
&gt;&gt;&gt; os.chdir('/Users/pilgrim/diveintopython3/examples') 
&gt;&gt;&gt; print(os.getcwd()) 
C:\Users\pilgrim\diveintopython3\examples

# 获取 absolute path
&gt;&gt;&gt; print(os.path.realpath('feed.xml'))
c:\Users\pilgrim\diveintopython3\examples\feed.xml

# 路径拼接
&gt;&gt;&gt; print(os.path.join('/Users/pilgrim/diveintopython3/examples/', 'humansize.py')) 
/Users/pilgrim/diveintopython3/examples/humansize.py
&gt;&gt;&gt; print(os.path.join('/Users/pilgrim/diveintopython3/examples', 'humansize.py')) 
/Users/pilgrim/diveintopython3/examples\humansize.py
&gt;&gt;&gt; print(os.path.expanduser('~')) 
c:\Users\pilgrim
&gt;&gt;&gt; print(os.path.join(os.path.expanduser('~'), 'diveintopython3', 'examples', 'humansize.py')) 
c:\Users\pilgrim\diveintopython3\examples\humansize.py

# 路径拆分
&gt;&gt;&gt; pathname = '/Users/pilgrim/diveintopython3/examples/humansize.py'
&gt;&gt;&gt; os.path.split(pathname) 
('/Users/pilgrim/diveintopython3/examples', 'humansize.py')
&gt;&gt;&gt; (dirname, filename) = os.path.split(pathname) 
&gt;&gt;&gt; dirname 
'/Users/pilgrim/diveintopython3/examples'
&gt;&gt;&gt; filename 
'humansize.py'

# 文件名与 extension 拆分
&gt;&gt;&gt; (shortname, extension) = os.path.splitext(filename) 
&gt;&gt;&gt; shortname
'humansize'
&gt;&gt;&gt; extension
'.py'
</pre>

- The `os.path.expanduser()` function will expand a pathname that uses ~ to represent the current user’s home directory.

The `glob` module is another tool in the Python standard library. It’s an easy way to get the contents of a directory programmatically, and it uses the sort of wildcards that you may already be familiar with from working on the command line.

- glob: (programming) A limited pattern matching technique using wildcards, less powerful than a regular expression.

<pre class="prettyprint linenums">
&gt;&gt;&gt; import glob

&gt;&gt;&gt; os.chdir('/Users/pilgrim/diveintopython3/')
&gt;&gt;&gt; glob.glob('examples/*.xml') 
['examples\\feed-broken.xml',
'examples\\feed-ns0.xml',
'examples\\feed.xml']

&gt;&gt;&gt; os.chdir('examples/') 
&gt;&gt;&gt; glob.glob('*test*.py') 
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
</pre>

Every modern file system stores metadata about each file: creation date, last-modified date, file size, and so on. Python provides a single API to access this metadata.

<pre class="prettyprint linenums">
&gt;&gt;&gt; import os

&gt;&gt;&gt; print(os.getcwd()) 
c:\Users\pilgrim\diveintopython3\examples
&gt;&gt;&gt; metadata = os.stat('feed.xml') 
&gt;&gt;&gt; metadata.st_mtime 
1247520344.9537716

&gt;&gt;&gt; import time 
&gt;&gt;&gt; time.localtime(metadata.st_mtime) 
time.struct_time(tm_year=2009, tm_mon=7, tm_mday=13, tm_hour=17,
tm_min=25, tm_sec=44, tm_wday=0, tm_yday=194, tm_isdst=1)
</pre>

- Calling the `os.stat()` function returns an object that contains several different types of metadata about the file.

### 3.3. LIST COMPREHENSIONS

A list comprehension provides a compact way of mapping a list into another list by applying a function to each of the elements of the list.

<pre class="prettyprint linenums">
&gt;&gt;&gt; a_list = [1, 9, 8, 4]
&gt;&gt;&gt; [elem * 2 for elem in a_list] 
[2, 18, 16, 8]
# a_list 本身并没有变
&gt;&gt;&gt; a_list 
[1, 9, 8, 4]
&gt;&gt;&gt; a_list = [elem * 2 for elem in a_list] 
&gt;&gt;&gt; a_list
[2, 18, 16, 8]
</pre>

- A list comprehension creates a new list; it does not change the original list.

<pre class="prettyprint linenums">
&gt;&gt;&gt; import os, glob

&gt;&gt;&gt; glob.glob('*.xml') 
['feed-broken.xml', 'feed-ns0.xml', 'feed.xml']
&gt;&gt;&gt; [os.path.realpath(f) for f in glob.glob('*.xml')] 
['c:\\Users\\pilgrim\\diveintopython3\\examples\\feed-broken.xml',
'c:\\Users\\pilgrim\\diveintopython3\\examples\\feed-ns0.xml',
'c:\\Users\\pilgrim\\diveintopython3\\examples\\feed.xml']
</pre>

List comprehensions can also filter items, producing a result that can be smaller than the original list.

<pre class="prettyprint linenums">
&gt;&gt;&gt; import os, glob

&gt;&gt;&gt; [f for f in glob.glob('*.py') if os.stat(f).st_size &gt; 6000] 
['pluraltest6.py',
'romantest10.py',
'romantest6.py',
'romantest7.py',
'romantest8.py',
'romantest9.py']
</pre>

There’s no limit to how complex a list comprehension can be.

<pre class="prettyprint linenums">
&gt;&gt;&gt; import os, glob
&gt;&gt;&gt; [(os.stat(f).st_size, os.path.realpath(f)) for f in glob.glob('*.xml')] 
[(3074, 'c:\\Users\\pilgrim\\diveintopython3\\examples\\feed-broken.xml'),
(3386, 'c:\\Users\\pilgrim\\diveintopython3\\examples\\feed-ns0.xml'),
(3070, 'c:\\Users\\pilgrim\\diveintopython3\\examples\\feed.xml')]

&gt;&gt;&gt; import humansize
&gt;&gt;&gt; [(humansize.approximate_size(os.stat(f).st_size), f) for f in glob.glob('*.xml')] 
[('3.0 KiB', 'feed-broken.xml'),
('3.3 KiB', 'feed-ns0.xml'),
('3.0 KiB', 'feed.xml')]
</pre>

### 3.4. DICTIONARY COMPREHENSIONS

<pre class="prettyprint linenums">
&gt;&gt;&gt; import os, glob

# This is a list comprehension
&gt;&gt;&gt; metadata = [(f, os.stat(f)) for f in glob.glob('*test*.py')] 
&gt;&gt;&gt; metadata[0] 
('alphameticstest.py', nt.stat_result(st_mode=33206, st_ino=0, st_dev=0,
st_nlink=0, st_uid=0, st_gid=0, st_size=2509, st_atime=1247520344,
st_mtime=1247520344, st_ctime=1247520344))

# This is a dictionary comprehension
&gt;&gt;&gt; metadata_dict = {f:os.stat(f) for f in glob.glob('*test*.py')} 
&gt;&gt;&gt; type(metadata_dict) 
&lt;class 'dict'&gt;
&gt;&gt;&gt; list(metadata_dict.keys()) 
['romantest8.py', 'pluraltest1.py', 'pluraltest2.py', 'pluraltest5.py',
'pluraltest6.py', 'romantest7.py', 'romantest10.py', 'romantest4.py',
'romantest9.py', 'pluraltest3.py', 'romantest1.py', 'romantest2.py',
'romantest3.py', 'romantest5.py', 'romantest6.py', 'alphameticstest.py',
'pluraltest4.py']
&gt;&gt;&gt; metadata_dict['alphameticstest.py'].st_size 
2509
</pre>

- The syntax is similar to a list comprehension, with two differences. 
	- First, it is enclosed in curly braces `{}` instead of square brackets `[]`. 
	- Second, instead of a single expression for each item, it contains two expressions separated by a colon `:`. 
		- The expression before the colon (`f` in this example) is the dictionary key; 
		- the expression after the colon (`os.stat(f)` in this example) is the value.

Here’s a trick with dictionary comprehensions that might be useful someday: swapping the keys and values of a dictionary.

<pre class="prettyprint linenums">
&gt;&gt;&gt; a_dict = {'a': 1, 'b': 2, 'c': 3}
&gt;&gt;&gt; {value:key for key, value in a_dict.items()}
{1: 'a', 2: 'b', 3: 'c'}
</pre>

Of course, this only works if the values of the dictionary are immutable, like strings or tuples. If you try this with a dictionary that contains lists, it will fail most spectacularly. 

### 3.5. SET COMPREHENSIONS

<pre class="prettyprint linenums">
&gt;&gt;&gt; a_set = set(range(10))
&gt;&gt;&gt; a_set
{0, 1, 2, 3, 4, 5, 6, 7, 8, 9}
&gt;&gt;&gt; {x ** 2 for x in a_set} 
{0, 1, 4, 81, 64, 9, 16, 49, 25, 36}
&gt;&gt;&gt; {x for x in a_set if x % 2 == 0} 
{0, 8, 2, 4, 6}
&gt;&gt;&gt; {2**x for x in range(10)} 
{32, 1, 2, 4, 8, 64, 128, 256, 16, 512}
</pre>

## CHAPTER 4. STRINGS

### 4.1. SOME BORING STUFF YOU NEED TO UNDERSTAND BEFORE YOU CAN DIVE IN

科普向。写得很好。

### 4.2. UNICODE

科普向。写得很好。

### 4.3. DIVING IN

In Python 3, all strings are sequences of Unicode characters. There is no such thing as a Python string encoded in UTF-8, or a Python string encoded as CP-1252. “Is this string UTF-8 ?” is an invalid question. UTF-8 is a way of encoding characters as a sequence of bytes. Bytes are not characters; bytes are bytes. Characters are an abstraction. A string is a sequence of those abstractions.

To create a string, enclose it in quotes. Python strings can be defined with either single quotes (`'`) or double quotes (`"`).

<pre class="prettyprint linenums">
&gt;&gt;&gt; s = '深入 Python' 
&gt;&gt;&gt; len(s) 
9
&gt;&gt;&gt; s[0] 
'深'
&gt;&gt;&gt; s + ' 3' 
'深入 Python 3'
</pre>

### 4.4. FORMATTING STRINGS

Let’s take another look at humansize.py:

<pre class="prettyprint linenums">
	......
    if size < multiple:
        return '{0:.1f} {1}'.format(size, suffix)
	......
</pre>

Python 3 supports formatting values into strings. Although this can include very complicated expressions, the most basic usage is to insert a value into a string with a single placeholder.

<pre class="prettyprint linenums">
&gt;&gt;&gt; username = 'mark'
&gt;&gt;&gt; password = 'PapayaWhip' 
&gt;&gt;&gt; "{0}'s password is {1}".format(username, password) 
"mark's password is PapayaWhip"
</pre>

- First, that’s a method call on a string literal. Strings are objects, and objects have methods. 
- Second, the whole expression evaluates to a string. 
- Third, `{0}` and `{1}` are replacement fields, which are replaced by the arguments passed to the `format()` method.

#### 4.4.1. COMPOUND FIELD NAMES

The previous example shows the simplest case, where the replacement fields are simply integers. Integer replacement fields are treated as positional indices into the argument list of the `format()` method. That means that `{0}` is replaced by the first argument (`username` in this case), `{1}` is replaced by the second argument (`password`), &c. But replacement fields are much more powerful than that.

<pre class="prettyprint linenums">
&gt;&gt;&gt; import humansize
&gt;&gt;&gt; si_suffixes = humansize.SUFFIXES[1000] 
&gt;&gt;&gt; si_suffixes
['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
&gt;&gt;&gt; '1000{0[0]} = 1{0[1]}'.format(si_suffixes) 
'1000KB = 1MB'
</pre>

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

<pre class="prettyprint linenums">
&gt;&gt;&gt; import humansize
&gt;&gt;&gt; import sys
&gt;&gt;&gt; '1MB = 1000{0.modules[humansize].SUFFIXES[1000][0]}'.format(sys)
'1MB = 1000KB'
</pre>

- The `sys` module holds information about the currently running Python instance. Since you just imported it, you can pass the `sys` module itself as an argument to the `format()` method. So the replacement field `{0}` refers to the `sys` module.
- `sys.modules` is a dictionary of all the modules that have been imported in this Python instance. The keys are the module names as strings; the values are the module objects themselves. So the replacement field `{0.modules}` refers to the dictionary of imported modules.
- `sys.modules['humansize']` is the `humansize` module which you just imported. The replacement field `{0.modules[humansize]}` refers to the humansize module. Note the slight difference in syntax here. In real Python code, the keys of the `sys.modules` dictionary are strings; to refer to them, you need to put quotes around the module name (e.g. 'humansize'). But within a replacement field, you skip the quotes around the dictionary key name (e.g. humansize). 
	- To quote [PEP 3101: Advanced String Formatting](https://www.python.org/dev/peps/pep-3101/), “The rules for parsing an item key are very simple. If it starts with a digit, then it is treated as a number, otherwise it is used as a string.”
- `sys.modules['humansize'].SUFFIXES` is the dictionary defined at the top of the `humansize` module. The replacement field `{0.modules[humansize].SUFFIXES}` refers to that dictionary.
- `sys.modules['humansize'].SUFFIXES[1000]` is a list of `SI` suffixes: `['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']`. So the replacement field `{0.modules[humansize].SUFFIXES[1000]}` refers to that list.
- `sys.modules['humansize'].SUFFIXES[1000][0]` is the first item of the list of SI suffixes: 'KB'. Therefore, the complete replacement field `{0.modules[humansize].SUFFIXES[1000][0]}` is replaced by the two-character string 'KB'.

#### 4.4.2. FORMAT SPECIFIERS

But what is `{0:.1f}`? It’s two things: `{0}`, which you recognize, and `:.1f`, which defines the format specifier.

Within a replacement field, a colon (`:`) marks the start of the format specifier. The format specifier `.1` means “round to the nearest tenth” (i.e. display only one digit after the decimal point). The format specifier `f` means “fixed-point number” (as opposed to exponential notation or some other decimal representation).

### 4.5. OTHER COMMON STRING METHODS

Let’s say you have a list of key-value pairs and you want to split them up and make a dictionary:

<pre class="prettyprint linenums">
&gt;&gt;&gt; query = 'user=pilgrim&database=master&password=PapayaWhip'
&gt;&gt;&gt; a_list = query.split('&') 
&gt;&gt;&gt; a_list
['user=pilgrim', 'database=master', 'password=PapayaWhip']
&gt;&gt;&gt; a_list_of_lists = [v.split('=', 1) for v in a_list if '=' in v] 
&gt;&gt;&gt; a_list_of_lists
[['user', 'pilgrim'], ['database', 'master'], ['password', 'PapayaWhip']]
&gt;&gt;&gt; a_dict = dict(a_list_of_lists) 
&gt;&gt;&gt; a_dict
{'password': 'PapayaWhip', 'user': 'pilgrim', 'database': 'master'}
</pre>

### 4.6. STRINGS VS. BYTES

Bytes are bytes; characters are an abstraction. An immutable sequence of Unicode characters is called a `string`. An immutable sequence of numbers-between-0-and-255 is called a `bytes` object.

<pre class="prettyprint linenums">
&gt;&gt;&gt; by = b'abcd\x65' 
&gt;&gt;&gt; by
b'abcde'
&gt;&gt;&gt; type(by) 
&lt;class 'bytes'&gt;
&gt;&gt;&gt; by += b'\xff' 
&gt;&gt;&gt; by # \xff 没有对应到一个 character，所以仍然显示为 \xff
b'abcde\xff'
&gt;&gt;&gt; by[5] 
255
</pre>

A bytes object is immutable; you can not assign individual bytes. If you need to change individual bytes, you can convert the bytes object into a `bytearray` object. The assigned value must be an integer between 0–255.

<pre class="prettyprint linenums">
&gt;&gt;&gt; by = b'abcd\x65'
&gt;&gt;&gt; barr = bytearray(by) 
&gt;&gt;&gt; barr
bytearray(b'abcde')
&gt;&gt;&gt; barr[0] = 102 
&gt;&gt;&gt; barr
bytearray(b'fbcde')
</pre>

The one thing you can never do is mix bytes and strings.

<pre class="prettyprint linenums">
&gt;&gt;&gt; by = b'd'
&gt;&gt;&gt; s = 'abcde'
&gt;&gt;&gt; by + s # ERROR

&gt;&gt;&gt; s.count(by) 				# ERROR
&gt;&gt;&gt; s.count(by.decode('ascii')) # OK
1
</pre>

And here is the link between `string`s and `bytes`: `bytes` objects have a `decode()` method that takes a character encoding and returns a `string`, and `string`s have an `encode()` method that takes a character encoding and returns a `bytes` object.

### 4.7. POSTSCRIPT: CHARACTER ENCODING OF PYTHON SOURCE CODE

In Python 2, the default encoding for .py files was ASCII. In Python 3, the default encoding is UTF-8.

If you would like to use a different encoding within your Python code, you can put an encoding declaration on the first line of each file. This declaration below defines a .py file to be windows-1252:

<pre class="prettyprint linenums">
# -*- coding: windows-1252 -*-
</pre>

Technically, the character encoding override can also be on the second line, if the first line is a UNIX-like hash-bang command.

<pre class="prettyprint linenums">
#!/usr/bin/python3
# -*- coding: windows-1252 -*-
</pre>

## CHAPTER 5. REGULAR EXPRESSIONS (略)

## CHAPTER 6. CLOSURES & GENERATORS

### 6.1. DIVING IN

first, let’s talk about how to make plural nouns. If you grew up in an English-speaking country or learned English in a formal school setting, you’re probably familiar with the basic rules:

- If a word ends in S, X, or Z, add ES. _Bass_ becomes _basses_, _fax_ becomes _faxes_, and _waltz_ becomes _waltzes_.
- If a word ends in a noisy H, add ES; if it ends in a silent H, just add S. 
	- What’s a noisy H? One that gets combined with other letters to make a sound that you can hear. So _coach_ becomes _coaches_ and _rash_ becomes _rashes_, because you can hear the CH and SH sounds when you say them. 
	- But _cheetah_ becomes _cheetahs_, because the H is silent.
- If a word ends in Y that sounds like I, change the Y to IES; if the Y is combined with a vowel to sound like something else, just add S. 		- So _vacancy_ becomes _vacancies_, but _day_ becomes _days_.
- If all else fails, just add S and hope for the best.

Let’s design a Python library that automatically pluralizes English nouns. We’ll start with just these four rules.

### 6.2. I KNOW, LET’S USE REGULAR EXPRESSIONS!

<pre class="prettyprint linenums">
def plural(noun):
    if re.search('[sxz]$', noun): 
        return re.sub('$', 'es', noun) 
    elif re.search('[^aeioudgkprt]h$', noun):
        return re.sub('$', 'es', noun)
    elif re.search('[^aeiou]y$', noun):
        return re.sub('y$', 'ies', noun)
    else:
        return noun + 's'
</pre>

### 6.3. A LIST OF FUNCTIONS

<pre class="prettyprint linenums">
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
</pre>

The reason this technique works is that everything in Python is an object, including functions. The rules data structure contains functions — not names of functions, but actual function objects. When they get assigned in the `for` loop, then `matches_rule` and `apply_rule` are actual functions that you can call.