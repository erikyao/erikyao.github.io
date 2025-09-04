---
category: Python
description: ''
tags:
- Book
- "Design Pattern"
title: "Digest of <i>Fluent Python: Part III - Functions as Objects</i>"
toc: true
toc_sticky: true
---

# Chapter 5 - Python Functions are First-Class Objects 

Programming language theorists define a "first-class object" as a program entity that can be:

- Created at runtime
- Assigned to a variable or element in a data structure
- Passed as an argument to a function
- Returned as the result of a function 

Integers, strings, and dictionaries are other examples of first-class objects in Python.

## 5.1 Treating a Function Like an Object 

```python
>>> def factorial(n):
... '''returns n!'''
... return 1 if n < 2 else n * factorial(n-1)
...
>>> factorial.__doc__
'returns n!'
>>> type(factorial)
<class 'function'>
>>> help(factorial)
Help on function factorial in module __main__:

factorial(n)
    returns n!
>>> fact = factorial
>>> list(map(fact, range(11)))
[1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800]
```

- `map(func, iterable)` returns an generator (an `map` object) where each item is the result of `func(e)` where `e` is an element of `iterable`
- Actually less than a _listcomp_ here:
	- `list(map(fact, range(11))) == [fact(x) for x in range(11)]`
	- `list(map(None, iter_a, iter_b)) == [(a,b) for a in iter_a for b in iter_b]`
	
简单说 `map` 就是：

```python
def map(func, iterable):
    for i in iterable:
        yield func(i)
```

## 5.2 Higher-Order Functions (e.g. `map`, `filter` and `reduce`) 

A function that takes a function as argument or returns a function as the result is a _higher-order function_. E.g. `map`, `filter` and `reduce`.

`apply` was deprecated in Python 2.3 and removed in Python 3. `apply(fn, args, kwargs) == fn(*args, **kwargs)`
{: .notice--info}

简单说 `filter` 就是：

```python
def filter(func, iterable):
	for i in iterable:
		if func(i):
			yield i
```

E.g. 

```python
   list(filter(lambda x: x % 2, range(11))) 
== [x for x in range(11) if x % 2] 
== [1,3,5,7,9]
```

而 `reduce(func, iterable)` 的作用是：apply two-argument function `func` cumulatively to the items of `iterable`, so as to reduce the iterable to a single value.

```python
def reduce(function, iterable, initializer=None):
    it = iter(iterable)
    if initializer is None:
        try:
            initializer = next(it)
        except StopIteration:
            raise TypeError('reduce() of empty sequence with no initial value')
    accum_value = initializer
    for x in it:
        accum_value = function(accum_value, x)
    return accum_value
```

E.g. 

```python
from functools import reduce
from operator import add

   reduce(add, [1,2,3,4,5])  
== (((1+2)+3)+4)+5
== 15
```

If `seq=[s1, s2, s3, ... , sn]`, calling `reduce(func, seq)` works like this:

- At first the first two elements of `seq` will be applied to `func`, i.e. `func(s1, s2)`. The list on which `reduce()` works looks now like this: `[func(s1, s2), s3, ..., sn]`
- In the next step `func` will be applied on the previous result and the third element of the list, i.e. `func(func(s1, s2), s3)`. The list looks like this now: `[func(func(s1, s2),s3), s4, ..., sn]`
- Continue like this until just one element is left and return this element as the result of `reduce()`

P.S. Other reducing built-ins are `all` and `any`:

- `all(iterable)`
	- Returns `True` if every element of the `iterable` is truthy; 
	- `all([])` returns `True`.
- `any(iterable)`
	- Returns `True` if any element of the `iterable` is truthy; 
	- `any([])` returns `False`.

## 5.3 Anonymous Functions 

The `lambda` keyword creates an anonymous function within a Python expression.

The body of lambda functions must be pure expressions. In other words, the body of a lambda cannot make assignments or use any other Python statement such as `while`, `try`, etc. 

## 5.4 The 7 Flavors of Callable Objects 

`()` in `func()` can be called a "call opertor". To determine whether an object is callable, use the `callable()` built-in function.

1. _User-defined functions_. E.g. created with `def` or `lambda`.
1. _User-defined methods_. 
1. _Built-in functions_. Functions implemented in C (for CPython), like `len`.
1. _Built-in methods_. Methods implemented in C (for CPython), like `dict.get`.
1. _Class instructors_. When invoked, a class runs its `__new__` method to create an instance, then `__init__` to initialize it, and finally the instance is returned to the caller. Because there is no `new` operator in Python, calling a class is like calling a function.
1. _Callable class instances_. If a class implements a `__call__` method, then its instances can be invoked as functions.
1. _Generators_. Functions or methods that use `yield`.

## 5.5 User-Defined Callable Types 

A class implementing `__call__` is an easy way to create functions that have some internal state that must be kept across invocations. 注意这句其实说的就是：在某些需要 function 的场合，我们可以用 callable class instance 来代替 function，从而可以给这个 "function" 一些 state 来实现更多的功能。原文说的是 "...to create function-like objects that..."，不知道为何要这么拐弯抹角的表示……E.g. **decorators** must be functions, 但比如你要做一个 cache decorator，这时就需要将这个 decorator 用 callable class instance 来实现，把 cache 封装到 class 内部。

A totally different approach to creating functions with internal state is to use **closures**. Closures, as well as decorators, are the subject of Chapter 7.

## 5.6 Function Introspection 

General way to introspect an object:

- `dir(obj)`: returns a list of valid attributes for that object
- `obj.__dict__`: stores all the user attributes assigned to that object

Exclusive way to introspect a user-defined function:

- `func.__annotations__`: a dict; the parameter and return annotations
	- 注意 annotation 不同于 docstring (`'''blah blah'''`) which is stored in `func.__doc__`
- `func.__closure__`: a tuple of closure cells; the function closure, i.e. bindings for free variables (one cell for each free variable)
- `func.__code__`: a `code` object; function metadata and function body compiled into bytecode
- `func.__defaults__`: a tuple of default values for the formal parameters
- `func.__kwdefaults__`: a dict of default values for the keyword-only formal parameters

### Function Annotations 

注意 python 的 annotation 不同于的 java 的 annotation；python 的 annotation 是为 documentation 服务的，最详细的说明在 [PEP 3107 -- Function Annotations](https://www.python.org/dev/peps/pep-3107/)。annotation 可以有两种形式：一是 string，二是 type，我们来看下规范：

```python
def foo(a: "annotation for a" [= a_def_val]) -> "annotaton for returned value":
	pass
	
def bar(a: TypeA (= a_def_val)) -> ReturnType:
	pass
```

举个例子：

```python
def foo(a: "this is parameter a") -> "return nothing":
	return None
	
>>> foo.__annotations__
>>> {'a': 'this is parameter a', 'return': 'return nothing'}

class ReturnType: pass
def bar(a: int = 1) -> ReturnType:
	pass
	
>>> bar.__annotations__
>>> {'a': int, 'return': __main__.ReturnType}
```

### Function Closure 

先看例子：

```python
def print_msg(msg):
	'''This is the outer enclosing function'''

    def printer():
		'''This is the nested function'''
        print(msg)

    return printer

print_hello = print_msg("Hello")
print_hello()  # Output: Hello

>>> print_hello.__closure__
>>> (<cell at 0x000001B2408F6C78: str object at 0x000001B240A34110>,)

>>> inspect.getclosurevars(print_hello)
>>> ClosureVars(nonlocals={'msg': 'Hello'}, globals={}, builtins={'print': <built-in function print>}, unbound=set())
```

这里的 `msg = 'Hello'` 是 `print_hello` 的一个 free variable。我们先来看下 free variable 的定义：

- In mathematics:
  - a _**free variable**_ is a variable in an expression where substitution may take place. 
    - 也就是说，能做替换操作的 variable 都是 free variable
  - a _**bound variable**_ is a variable that was previously free, but has been bound to a specific value or set of values.
	- E.g., the variable $x$ becomes a bound variable when we write: 	
		- $\forall x, (x + 1)^2 = x^2 + 2x + 1$, or 
		- $\exists x \text{ such that } x^2 = 2$
	- Some older books use the terms _**real variable**_ and _**apparent variable**_ for free variable and bound variable.
- In computer programming:
  - the term _**free variable**_ refers to variables used in a function that are neither local variables nor parameters of that function.
  - 这个场合下，bound variable 就不好定义了，也没有必要往这个方向去考虑。

所以在 python 这儿，如果 `func.__closure__` 就是 closure 的话，那 closure 相当于被定义成了 free variable 的一个 enviroment 或者 namespace. 我觉得这么理解其实挺好记的，非常直观 (毕竟你可以直接 print 到 console……)。

我对 closure 一直不理解是因为我看到了各种各样的定义，比如：

- "function + its free variables", or the code snippet of "function + its free variables"
- The function object itself (i.e. `print_hello` here)
- A phenomenon which happens when a function has access to a local variable from an enclosing scope.

这些统统没有 `func.__closure__` 直观，所以暂且按 `func.__closure__` 来记好了。若是以后对 closure 的理解出了偏差，还可以甩锅给 python 说它变量名起得不对 www

参考 [Variable / Bound Variable / Free Variable / Scope / Closure](/compiler/2020/12/05/variable-bound-variable-free-variable-scope-closure#5-closure).

### Default Parameter Values vs Default Keyword-Only Parameter Values 

按 [PEP 3102 -- Keyword-Only Arguments](https://www.python.org/dev/peps/pep-3102/) 的说法，kwyword-only argument 是：

> Arguments that can only be supplied by keyword and which will never be automatically filled in by a positional argument.

```python
def func(a, b = 1, *args, kwa, kwb = 2):
	pass
	
>>> func.__defaults__
>>> (1,)

>>> func.__kwdefaults__
>>> {'kwb': 2}
```

从逻辑上，keyword-only parameter 是 parameter 的一种 (其实一共就两种，一个 positional 一个 keyword-only)，但是上面这个例子里 `__kwdefaults__.values` $\not \subset$ `__defaults__`.

另外一个需要注意的问题是：default parameter value 只在 `def` 的被执行的时候初始化一次，而不是每次调用 function 的时候都初始化一次 (有点类似 static；Ruby 也是这样的)。比如下面这个例子：

```python
def func2(b = [], *args, kwb = []):
	b.append('F')
	kwb.append('F')
	
	print("b == {}".format(b))
	print("kwb == {}".format(kwb))

for _ in range(3):
	func2()

// output:
/** 
	b == ['F']
	kwb == ['F']
	b == ['F', 'F']
	kwb == ['F', 'F']
	b == ['F', 'F', 'F']
	kwb == ['F', 'F', 'F']
**/
```

所以如果你要每次调用 function 时都默认参数为 `[]`，正确的写法应该是：

```python
def func3(b = None):
	if b is None
		b = []
	......
```

当然这个特性也可以合理利用，比如你要做一个 cache，你当然不希望每次都初始化为默认的值。

注意这章一开始有说 Python functions are first-class objects，所以 default parameter value 也有点像 object 的 attribute.

## 5.7 Packages for Functional Programming: `operator` and `functools` 

### 5.7.1 `operator`: arithmetic operators / `itemgetter` / `attrgetter` / `methodcaller` 

Python does not aim to be a functional programming language, but a functional coding style can be used to good extent, thanks to the support of packages like `operator` and `functools`.

To save you the trouble of writing trivial anonymous functions like `lambda a, b: a*b`, the `operator` module provides function equivalents for dozens of arithmetic operators.

```python
from functools import reduce
from operator import mul

def fact(n):  # lambda version
	return reduce(lambda a, b: a*b, range(1, n+1))

def fact(n):  # operator version
	return reduce(mul, range(1, n+1))
```

Another group of one-trick lambdas that `operator` replaces are functions to pick items from sequences or read attributes from objects: `itemgetter` and `attrgetter` actually build custom functions to do that.

- Essentially, `itemgetter(1)` does the same as `lambda fields: fields[1]`
- If you pass multiple index arguments to `itemgetter()`, the function it builds will return tuples with the extracted values
- `itemgetter()` uses the `[]` operator--it supports not only sequences but also mappings and any class that implements `__getitem__()`.

```python
metro_data = [
	('Tokyo', 'JP', 36.933, (35.689722, 139.691667)),
	('Delhi NCR', 'IN', 21.935, (28.613889, 77.208889)),
	('Mexico City', 'MX', 20.142, (19.433333, -99.133333)),
	('New York-Newark', 'US', 20.104, (40.808611, -74.020386)),
	('Sao Paulo', 'BR', 19.649, (-23.547778, -46.635833)),
]

from operator import itemgetter

for city in sorted(metro_data, key=itemgetter(1)):
	print(city)

# Output:
"""
('Sao Paulo', 'BR', 19.649, (-23.547778, -46.635833)) 
('Delhi NCR', 'IN', 21.935, (28.613889, 77.208889)) 
('Tokyo', 'JP', 36.933, (35.689722, 139.691667)) 
('Mexico City', 'MX', 20.142, (19.433333, -99.133333)) 
('New York-Newark', 'US', 20.104, (40.808611, -74.020386)) 
"""

cc_name = itemgetter(1, 0)
for city in metro_data:
	"""
	注意 itemgetter(...) 等价于一个 lambda
	所以它本身是一个 function
	既然是 function 自然就可以 call 
	(换言之 itemgetter 是一个 "return function 的 function")
	"""
	print(cc_name(city))

# Output:
"""
('JP', 'Tokyo')
('IN', 'Delhi NCR')
('MX', 'Mexico City')
('US', 'New York-Newark')
('BR', 'Sao Paulo')
"""
```

A sibling of `itemgetter` is `attrgetter`, which creates functions to extract object attributes by name. 

- E.g. `attrgetter("__class__")("hello")` return `"hello".__class__` (== `<class 'str'>`)
- If you pass attrgetter several attribute names as arguments, it also returns a tuple of values. 
- In addition, if any argument name contains a `.` (dot), attrget ter navigates through nested objects to retrieve the attribute
	- E.g. `attrgetter('__class__.__name__')("hello")` return `"hello".__class__.__name__` (== `'str'`)

At last we cover `methodcaller`--the function it creates calls a method by name on the object given as argument:

```python
from operator import methodcaller

s = 'The time has come'
upcase = methodcaller('upper')
upcase(s)

# 'THE TIME HAS COME'

hiphenate = methodcaller('replace', ' ', '-')
hiphenate(s)

# 'The-time-has-come'
```

总结一下：

```python
def itemgetter(*keys):
    if len(keys) == 1:
        key = keys[0]
        return lambda x: x[key]
    else:
        return lambda x: tuple(x[key] for key in keys)

def attrgetter(*names):
    if any(not isinstance(name, str) for name in names):
        raise TypeError('attribute name must be a string')
    
	if len(names) == 1:
        name = names[0]
        return lambda x: x.__getattribute__(name)
    else:
        return lambda x: tuple(x.__getattribute__(name) for name in names)

def methodcaller(name, *args, **kwargs):
    return lambda x: getattr(x, name)(*args, **kwargs)
```

```python
get_first_two_items = itemgetter(0, 1)
	# is equivalent to define
def get_first_two_items(x):
	return (x[0], x[1])

get_foo_and_bar = attrgetter("foo", "bar")
	# is equivalent to define
def get_foo_and_bar(x):
	return (x.foo, x.bar)

call_foo_with_bar_and_baz = methodcaller("foo", "bar", baz="baz")
call_foo_with_bar_and_baz(f)
	# is equivalent to call
f.foo("bar", baz="baz")
```

### 5.7.2 `functools`: Freezing Arguments with `partial()` 

```python
from operator import mul
from functools import partial

triple = partial(mul, 3)
triple(7)

# Output: 21
```

# Chapter 6 - Design Patterns with First-Class Functions 

## 6.1 Case Study: Refactoring Strategy 

第一个例子，注意两点：

1. package `abc` 名字的意思是 abstract base class……
1. 写 empty function body 的两种方式：
	- `pass`
	- 连 `pass` 都不用写，只留下 docstring 

```python
from abc import ABC, abstractmethod

class Order:
	def __init__(self, customer, cart, promotion=None):
		self.customer = customer
		self.cart = list(cart)
		self.promotion = promotion

	def due(self):
		if self.promotion is None:
			discount = 0
		else:
			discount = self.promotion.discount(self)
		return self.total() - discount

# In Python 3.4, the simplest way to declare an ABC is to subclass `abc.ABC`
class Promotion(ABC): # the Strategy: an abstract base class
	@abstractmethod
	def discount(self, order):
		"""Return discount as a positive dollar amount"""
		# pass

class FidelityPromo(Promotion): # first Concrete Strategy
	"""5% discount for customers with 1000 or more fidelity points"""
	def discount(self, order):
		return order.total() * .05 if order.customer.fidelity >= 1000 else 0

class BulkItemPromo(Promotion): # second Concrete Strategy
	"""10% discount for each LineItem with 20 or more units"""
	def discount(self, order):
		discount = 0
		for item in order.cart:
			if item.quantity >= 20:
				discount += item.total() * .1
		return discount

class LargeOrderPromo(Promotion): # third Concrete Strategy
	"""7% discount for orders with 10 or more distinct items"""
	def discount(self, order):
		distinct_items = {item.product for item in order.cart}
			if len(distinct_items) >= 10:
				return order.total() * .07
		return 0
```

Each concrete strategy above is a class with a single method, `discount`. Furthermore, the strategy instances have no state (no instance attributes). You could say they look a lot like plain functions, and you would be right. We can refactor this example to function-oriented:

```python
class Order:
	def __init__(self, customer, cart, promotion=None):
		self.customer = customer
		self.cart = list(cart)
		self.promotion = promotion

	def due(self):
		if self.promotion is None:
			discount = 0
		else:
			discount = self.promotion(self)  # 精妙之处在此
		return self.total() - discount

def fidelity_promo(order):
	"""5% discount for customers with 1000 or more fidelity points"""
	return order.total() * .05 if order.customer.fidelity >= 1000 else 0

def bulk_item_promo(order):
	"""10% discount for each LineItem with 20 or more units"""
	discount = 0
	for item in order.cart:
		if item.quantity >= 20:
			discount += item.total() * .1
	return discount

def large_order_promo(order):
	"""7% discount for orders with 10 or more distinct items"""
	distinct_items = {item.product for item in order.cart}
	if len(distinct_items) >= 10:
		return order.total() * .07
	return 0
```

### 6.1.1 Flyweight Pattern 

It is interesting to note that in _Design Patterns_ the authors suggest: “Strategy objects often make good flyweights.” A definition of the Flyweight in another part of that work states: 

> A flyweight is a shared object that can be used in multiple contexts simultaneously.

flyweight 本意是拳击比赛的 “轻量级”。
{: .notice--info}

这个定义并没有很清楚，这篇 [Flyweight](http://gameprogrammingpatterns.com/flyweight.html) 我觉得写得不错。给出的例子是 game programming 中的地图渲染的场景：

- 你有很多很多个 `Tree` object 要渲染
- 但是你可以只存一个 static 或者 singleton 的 `TreeModel` object，记录树的多边形、颜色等等信息 (假设你地图上所有的树都长一样)
- 然后你的 `Tree` object 就可以引用或者指向这个 `TreeModel` object，然后再保存 coordinate 这些自身 specific 的信息
- 这样比较省空间的 `Tree` object 我们成为 flyweight object

总结得也不错：

> Flyweight, like its name implies, comes into play when you have objects that need to be more lightweight, generally because you have too many of them.
> The Flyweight pattern is purely about efficiency.

极端一点说，所有带 static 的 object 都可以看做 flyweight object.

### 6.1.2 Choosing the Best Strategy: Simple Approach 

炫技一波：

```python
promos = [fidelity_promo, bulk_item_promo, large_order_promo]

def best_promo(order):
	"""Select best discount available"""
	return max(promo(order) for promo in promos)
```

### 6.1.3 Advanced Approach: Finding Strategies in a Module 

```python
"""
globals():
	Return a dictionary representing the current global symbol table. This is always the
	dictionary of the current module (inside a function or method, this is the module
	where it is defined, not the module from which it is called).
"""
promos = [globals()[name] for name in globals() if name.endswith('_promo') and name != 'best_promo']

def best_promo(order):
	"""Select best discount available"""
	return max(promo(order) for promo in promos)
```

Another way of collecting the available promotions would be to create a module, `promotions.py`, and put all the strategy functions there, except for `best_promo`.

```python
promos = [func for name, func in inspect.getmembers(promotions, inspect.isfunction)]
```

## 6.2 Command Pattern 

```python
class MacroCommand:
	"""A command that executes a list of commands"""
	
	def __init__(self, commands):
		self.commands = list(commands)

	def __call__(self):
		for command in self.commands:
			command()  ## Need implementation of `__call__` inside each command object
```
