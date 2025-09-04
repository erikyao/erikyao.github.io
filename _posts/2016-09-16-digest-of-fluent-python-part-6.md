---
category: Python
description: ''
tags:
- Book
title: "Digest of <i>Fluent Python: Part VI - Metaprogramming</i>"
toc: true
toc_sticky: true
---


[21-4-object-type]: https://farm5.staticflickr.com/4333/37163854232_ee8efc2396_z_d.jpg
[21-4-metaclass]: https://farm5.staticflickr.com/4358/36498898824_16ac200d04_z_d.jpg


# Chapter 19 - Dynamic Attributes and Properties 

> The crucial importance of properties is that their existence makes it perfectly safe and indeed advisable for you to expose public data attributes as part of your class’s public interface.
> <br/>
> <p align="right">-- Alex Martelli</p>

Data attributes and methods are collectively known as **attributes** in Python: **a method is just an attribute that is callable**. Besides data attributes and methods, we can also create **properties**, which can be used to replace a public data attribute with accessor methods (i.e., getter/setter), without changing the class interface. This agrees with the _Uniform access principle_:

> All services offered by a module should be available through a uniform notation, which does not betray whether they are implemented through storage or through computation.

## 19.1 Data Wrangling with Dynamic Attributes 

### 19.1.1 Exploring JSON-Like Data with Dynamic Attributes 

Consider a `dict`-like JSON object, `feed`. The syntax `feed['Schedule']['events'][40] ['name']` is cumbersome. How can we just write `feed.Schedule.events[40].name` to fetch the same attribute?

We construct a `FrozenJSON` class so that `feed = FrozenJSON(feed)` could transform `feed` into an object with "dynamic attributes".

```python
from collections import abc


class FrozenJSON:
	"""A read-only façade for navigating a JSON-like object
	using attribute notation
	"""
	def __init__(self, mapping):
		self.__data = dict(mapping)
	
	def __getattr__(self, name):
		if hasattr(self.__data, name):
			return getattr(self.__data, name)
		else:
			return FrozenJSON.build(self.__data[name])
	
	@classmethod
	def build(cls, obj):
		if isinstance(obj, abc.Mapping):
			return cls(obj)
		elif isinstance(obj, abc.MutableSequence):
			return [cls.build(item) for item in obj]
		else:
			return obj
```

### 19.1.2 The Invalid Attribute Name Problem 

比如 `feed.class`，因为 `class` 是关键字，所以这一句会是 syntax error.

- 方案一：用 `getattr(feed, "class")`
- 方案二：把名字是 keyword 的 key 改名

```python
def __init__(self, mapping):
	self.__data = {}
	for key, value in mapping.items():
		if keyword.iskeyword(key):  # `keyword` is a built-in module
			key += '_'
			self.__data[key] = value
```

同理还有 invalid identifier 的问题，比如 `feed.2be`，同样也是 syntax error。解决方案类似上面方案二，可以用 `key.isidentifier()` 来判断 key 是否是合法 identifier，不过这里要给 key 改名的话就只能靠你自己发挥了。

### 19.1.3 Flexible Object Creation with `__new__` 

```python
from collections import abc


class FrozenJSON:
	"""A read-only façade for navigating a JSON-like object
	using attribute notation
	"""

	def __new__(cls, arg):
		if isinstance(arg, abc.Mapping):
			return super().__new__(cls)
		elif isinstance(arg, abc.MutableSequence):
			return [cls(item) for item in arg]
		else:
			return arg
	
	def __init__(self, mapping):
		self.__data = {}
		for key, value in mapping.items():
			if iskeyword(key):
				key += '_'
			self.__data[key] = value
	
	def __getattr__(self, name):
		if hasattr(self.__data, name):
			return getattr(self.__data, name)
		else:
			return FrozenJSON(self.__data[name])
```

### 19.1.4 Restructuring the OSCON Feed with `shelve` 

The funny name of the standard `shelve` module makes sense when you realize that `pickle` is the name of the Python object serialization format. Because pickle jars are kept in shelves, it makes sense that `shelve` provides `pickle` storage.

shelve: [verb] to place on a shelf
{: .notice--info}

The `shelve.open` high-level function returns a `shelve.Shelf` instance — a simple key-value object database backed by the `dbm` module, with these characteristics:

- `shelve.Shelf` subclasses `abc.MutableMapping`, so it provides the essential methods we expect of a mapping type
- In addition, `shelve.Shelf` provides a few other I/O management methods, like `sync` and `close`; it’s also a context manager.
- Keys and values are saved whenever a new value is assigned to a key.
- The keys must be strings.
- The values must be objects that the `pickle` module can handle.

We will read all records from the JSON file and save them to a `shelve.Shelf`. Each key will be made from the record type and the serial number (e.g., `'event.33950'` or `'speaker.3471'`) and the value will be an instance of a new `Record` class we are about to introduce.

```python
import warnings
import osconfeed


DB_NAME = 'data/schedule1_db'
CONFERENCE = 'conference.115'

class Record:
	def __init__(self, **kwargs):
		# Updating an instance __dict__ with a mapping is a quick way to create a bunch of attributes in that instance
		self.__dict__.update(kwargs)

def load_db(db):
	raw_data = osconfeed.load()
	warnings.warn('loading ' + DB_NAME)
	for collection, rec_list in raw_data['Schedule'].items():
		record_type = collection[:-1]
		for record in rec_list:
			key = '{}.{}'.format(record_type, record['serial'])
			record['serial'] = key
			db[key] = Record(**record)
```

```python
>>> import shelve
>>> db = shelve.open(DB_NAME)
>>> if CONFERENCE not in db:
...     load_db(db)
...
>>> speaker = db['speaker.3471']
>>> type(speaker)
<class 'schedule1.Record'>
>>> speaker.name, speaker.twitter
('Anna Martelli Ravenscroft', 'annaraven')
>>> db.close()
```

### 19.1.5 Linked Record Retrieval with Properties (略)

## 19.2 Using a Property for Attribute Validation 

### 19.2.1 `LineItem` Take #1: Class for an Item in an Order 

```python
class LineItem:
	def __init__(self, description, weight, price):
		self.description = description
		self.weight = weight
		self.price = price
	
	def subtotal(self):
		return self.weight * self.price
```

How to handle negative weights and prices?

### 19.2.2 `LineItem` Take #2: A Validating Property 

```python
class LineItem:
	def __init__(self, description, weight, price):
		self.description = description
		self.weight = weight
		self.price = price

	def subtotal(self):
		return self.weight * self.price
	
	@property
	def weight(self):
		return self.__weight
	
	@weight.setter
	def weight(self, value):
		if value > 0:
			self.__weight = value
		else:
			raise ValueError('value must be > 0')
```

## 19.3 A Proper Look at Properties 

Although often used as a decorator `@property`, the `property` built-in is actually a class. `@property(func)` is actually calling `property` constructor.

See [9.4.1 Digress: `@property` / `__getattribute__()` / `__get__()`](/python/2016/09/16/digest-of-fluent-python-part-4#941-digress-property--__getattribute__--__get__).

### 19.3.1 Properties Override Instance Attributes (略；书上的例子不可复制)

### 19.3.2 Property Documentation 

If used with the classic call syntax, `property` can get the documentation string as the doc argument:

```python
weight = property(get_weight, set_weight, doc='weight in kilograms')
```

When `property` is deployed as a decorator, the docstring of the getter method--the one with the `@property` decorator itself--is used as the documentation of the property as a whole. 

## 19.4 Coding a Property Factory 

We’ll create a `quantity` property factory below to avoid the `@property` repetitions.

```python
def quantity(storage_name):
	def qty_getter(instance):
		return instance.__dict__[storage_name]
	
	def qty_setter(instance, value):
		if value > 0:
			instance.__dict__[storage_name] = value
		else:
			raise ValueError('value must be > 0')
					
	return property(qty_getter, qty_setter)

class LineItem:
	weight = quantity('weight')
	price = quantity('price')

	def __init__(self, description, weight, price):
		self.description = description
		self.weight = weight
		self.price = price

	def subtotal(self):
		return self.weight * self.price
```

## 19.5 Handling Attribute Deletion 

In a property definition, the `@member.deleter` decorator is used to wrap the `def member(self)` method in charge of `del my_obj.member`.

If you are not using a property, attribute deletion can also be handled by implementing the lower-level `__delattr__` special method.

## 19.6 Essential Attributes and Functions for Attribute Handling (略)

# Chapter 20 - Attribute Descriptors 

A descriptor is a class that implements a protocol consisting of the `__get__`, `__set__`, and `__delete__` methods. The `property` class implements the full descriptor protocol. As usual with protocols, partial implementations are OK. In fact, most descriptors we see in real code implement only `__get__` and `__set__`, and many implement only one of these methods.

## 20.1 Descriptor Example: Attribute Validation 

As we saw in [19.4 Coding a Property Factory](/python/2016/09/16/digest-of-fluent-python-part-6#194-coding-a-property-factory), a property factory is a way to avoid repetitive coding of getters and setters by applying functional programming patterns. A property factory is a higher-order function that creates a parameterized set of accessor functions and builds a custom `property` instance from them, with closures to hold settings like the `storage_name`. The object-oriented way of solving the same problem is a descriptor class.

### 20.1.1 `LineItem` Take #3: A Simple Descriptor 

```python
class Quantity:
	def __init__(self, storage_name):
		self.storage_name = storage_name
	
	def __set__(self, instance, value):
		if value > 0:
			instance.__dict__[self.storage_name] = value  # ①
		else:
			raise ValueError('value must be > 0')

class LineItem:
	weight = Quantity('weight')
	price = Quantity('price')
	
	def __init__(self, description, weight, price):
		self.description = description
		self.weight = weight
		self.price = price
	
	def subtotal(self):
		return self.weight * self.price
```

- ① Here, we must handle the managed instance `__dict__` directly; trying to use the `setattr` built-in would trigger the `__set__` method again, leading to infinite recursion.
	- `.price` is called "managed attribute" and `.__dict__['price']` "storage attribute".
- ① The logic here is: `line_item.price = 0` $\Rightarrow$ `price.__set__(line_item, 0)`

### 20.1.2 `LineItem` Take #4: Automatic Storage Attribute Names 

A drawback of the above example is the need to repeat the names of the attributes when the descriptors are instantiated in the managed class body. Here we come up with a new solution.

```python
class Quantity:
	__counter = 0
	
	def __init__(self):
		cls = self.__class__
		prefix = cls.__name__
		index = cls.__counter
		self.storage_name = '_{}#{}'.format(prefix, index)
		cls.__counter += 1
	
	def __get__(self, instance, owner):  # ①
		return getattr(instance, self.storage_name)  # ②
	
	def __set__(self, instance, value):
		if value > 0:
			setattr(instance, self.storage_name, value)  # ②
		else:
			raise ValueError('value must be > 0')

class LineItem:
	weight = Quantity()
	price = Quantity()

	def __init__(self, description, weight, price):
		self.description = description
		self.weight = weight
		self.price = price
	
	def subtotal(self):
		return self.weight * self.price
```

- ① The `owner` argument of `__get__` is a reference to the managed class (`LineItem` here), and it’s handy when the descriptor is used to get attributes from the class.
	- When you retrieve attributes from the class, e.g. `LineItem.price`, `instance` argument of `__get__` will be set to `None` 
- ② Here we can use the higher-level `getattr` and `setattr` built-ins to store the value--instead of resorting to `instance.__dict__`--because the managed attribute (e.g. `.price`) and the storage attribute (e.g. `.__dict__['_Quantity#1']`) have different names, so calling `getattr` or `setattr` on the storage attribute will not trigger the descriptor, avoiding the infinite recursion discussed in the previous example.

To support introspection and other metaprogramming tricks by the user, it’s a good practice to make `__get__` return the descriptor instance when the managed attribute is accessed through the class. 

```python
def __get__(self, instance, owner):
	if instance is None:
		return self
	else:
		return getattr(instance, self.storage_name)
```

Usually we do not define a descriptor in the same module where it’s used, but in a separate utility module designed to be used across the application--even in many applications, if you are developing a framework.

### 20.1.3 `LineItem` Take #5: A New Descriptor Type 

Because descriptors are defined in classes, we can leverage inheritance to reuse some of the code we have for new descriptors. That’s what we’ll do in the following section.

略

## 20.2 Overriding Versus Nonoverriding Descriptors 

Recall that there is an important asymmetry in the way Python handles attributes. 

- Reading an attribute through an instance normally returns the attribute defined in the instance, but if there is no such attribute in the instance, a class attribute will be retrieved. 
- On the other hand, assigning to an attribute in an instance normally creates the attribute in the instance, without affecting the class at all.

We can observe that:

- Descriptor instances are actually class attributes,
- but are used as object attributes.

This asymmetry also affects descriptors, in effect creating two broad categories of descriptors depending on whether the `__set__` method is defined. 

### 20.2.1 Overriding Descriptor (a.k.a. Data Descriptor / Enforced Descriptor) 

A descriptor that implements the `__set__` method is called an overriding descriptor, because although it is a class attribute, a descriptor implementing `__set__` will override attempts to assign to instance attributes.

### 20.2.2 Overriding Descriptor Without `__get__` 

In this case, only writing is handled by the descriptor. Reading the descriptor through an instance will return the descriptor object itself (from the instance's class) because there is no `__get__` to handle that access. If a namesake (同名的) instance attribute is created with a new value via direct access to the instance `__dict__`, the `__set__` method will still override further attempts to set that attribute, but reading that attribute will simply return the new value (from the instance), instead of returning the descriptor object (from the instance's class). In other words, the instance attribute will shadow the descriptor, but only when reading. 

### 20.2.3 Nonoverriding Descriptor (a.k.a. Nondata Descriptor / Shadowable Descriptor) 

If a descriptor does not implement `__set__`, then it’s a nonoverriding descriptor. Setting an instance attribute with the same name will shadow the descriptor, rendering it ineffective for handling that attribute in that specific instance. 

### 20.2.4 Overwriting a Descriptor in the Class 

Regardless of whether a descriptor is overriding or not, it can be overwritten by assignment to the class, e.g. `LineItem.price = 1`. 

This reveals another asymmetry regarding reading and writing attributes:

- Although the reading of a class attribute can be controlled by a descriptor with `__get__` attached to the managed class, 
- the writing of a class attribute cannot be handled by a descriptor with `__set__` attached to the same class.

In order to control the setting of attributes in a class, you have to attach descriptors to the class of the class--in other words, the metaclass. We'll discuss this topic in Chapter 21.

## 20.3 Methods Are (Nonoverriding) Descriptors 

A function within a class becomes a bound method because all user-defined functions have a `__get__` method, therefore they operate as descriptors when attached to a class.

Similarly, we can observe that:

- Functions are actually class attributes,
- but are used as object attributes.

```python
>>> class Foo():
...     def bar():
...             pass
... 
>>> Foo.bar
<function Foo.bar at 0x7f60b61b3620>
>>> Foo().bar
<bound method Foo.bar of <__main__.Foo object at 0x7f60b689a7f0>>
```

As usual with descriptors, the `__get__` of a function returns a reference to itself when the access happens through the managed class. But when the access goes through an instance, the `__get__` of the function returns a bound method object: a callable that wraps the function and binds the managed instance (e.g., `Foo()`) to the first argument of the function (i.e., `self`), like the `functools.partial` function does.

So basically, 

```python
f = Foo()
f.bar()

# ----- IS EQUIVALENT TO ----- # 

Foo.bar(f)

# ----- OR ----- #

f.__class__.bar(f)
```

The bound method object also has a `__call__` method, which handles the actual invocation. This method calls the original function referenced in `__func__`, passing the `__self__` attribute of the method as the first argument. That’s how the implicit binding of the conventional `self` argument works.

## 20.4 Descriptor Usage Tips 

- Use property to Keep It Simple
	- The `property` built-in actually creates overriding descriptors implementing both `__set__` and `__get__`, even if you do not define a setter method. 
	- The default `__set__` of a property raises `AttributeError: can't set attribute`, so a property is the easiest way to create a read-only attribute, avoiding the issue described next.
- Read-only descriptors require `__set__`
	- If you use a descriptor class to implement a read-only attribute, you must remember to code both `__get__` and `__set__`, otherwise setting a namesake attribute on an instance will shadow the descriptor. 
	- The `__set__` method of a read-only attribute should just raise `AttributeError` with a suitable message.
- Validation descriptors can work with `__set__` only
	- In a descriptor designed only for validation, the `__set__` method should check the value argument it gets, and if valid, set it directly in the instance `__dict__` using the descriptor instance name as key. 
	- That way, reading the attribute with the same name from the instance will be as fast as possible, because it will not require a `__get__`.
- Caching can be done efficiently with `__get__` only
	- If you code just the `__get__` method, you have a nonoverriding descriptor. These are useful to make some expensive computation and then cache the result by setting an attribute by the same name on the instance. The namesake instance attribute will shadow the descriptor, so subsequent access to that attribute will fetch it directly from the instance `__dict__` and not trigger the descriptor `__get__` anymore.
- Nonspecial methods can be shadowed by instance attributes
	- However, this issue does not interfere with special methods. The interpreter only looks for special methods in the class itself, in other words, `repr(x)` is executed as `x.__class__.__repr__(x)`, so a redefined `x.__repr__` attribute has no effect on `repr(x)`. 
	
# Chapter 21 - Class Metaprogramming 

Class metaprogramming is the art of creating or customizing classes at runtime. 

## 21.1 A Class Factory 

We create a `record_factory` to mimic `collections.namedtuple`.

```python
def record_factory(cls_name, field_names):
    try:
        field_names = field_names.replace(',', ' ').split() 
    except AttributeError:  # no `.replace` or `.split`
        pass  # assume it's already a sequence of identifiers
    field_names = tuple(field_names)

    def __init__(self, *args, **kwargs):
        attrs = dict(zip(self.__slots__, args))
        attrs.update(kwargs)
        for name, value in attrs.items():
            setattr(self, name, value)

    def __iter__(self):
        for name in self.__slots__:
            yield getattr(self, name)

    def __repr__(self):
        values = ', '.join('{}={!r}'.format(*i) for i
                           in zip(self.__slots__, self))
        return '{}({})'.format(self.__class__.__name__, values)

    cls_attrs = dict(__slots__ = field_names,
                     __init__  = __init__,
                     __iter__  = __iter__,
                     __repr__  = __repr__)

    return type(cls_name, (object,), cls_attrs)
```

```python
>>> Dog = record_factory('Dog', 'name weight owner')
>>> rex = Dog('Rex', 30, 'Bob')
>>> rex
Dog(name='Rex', weight=30, owner='Bob')
>>> Dog.__mro__
(<class 'factories.Dog'>, <class 'object'>)
```

Note that `type` is actually a class instead of a function:

- `type(obj)`: constructs a class which equals to `obj.__class__`
- `type(name, bases, dict)`: constructs a class following that
	- the `name` string is the class name and becomes the `__name__` attribute; 
	- the `bases` tuple itemizes the base classes and becomes the `__bases__` attribute; 
	- and the `dict` dictionary is the namespace containing definitions for class body and is copied to a standard dictionary to become the `__dict__` attribute

E.g., the following two statements create identical type objects:

```python
class X:
    a = 1

# ----- IS EQUIVALENT TO ----- # 

X = type('X', (object,), dict(a=1))
```

A more complicated example:

```python
MyClass = type('MyClass', 
               (MySuperClass, MyMixin),
               {'x': 42, 'x2': lambda self: self.x * 2})

# ----- IS EQUIVALENT TO ----- # 

class MyClass(MySuperClass, MyMixin):
	x = 42
	
	def x2(self):
		return self.x * 2
```

Instances of classes created by `record_factory` have a limitation: they are not serializable--that is, they can’t be used with the `dump`/`load` functions from the `pickle` module. Solving this problem is beyond the scope of this example, which aims to show the `type` class in action in a simple use case. For the full solution, study the source code for `collections.nameduple`; search for the word “pickling.” 

## 21.2 A Class Decorator for Customizing Descriptors 

When we left the LineItem example in “LineItem Take #5: A New Descriptor Type” , the issue of descriptive storage names was still pending: the value of attributes such as `weight` was stored in an instance attribute named `_Quantity#0`, which made debugging a bit hard. 

But once the whole class is assembled and the descriptors are bound to the class attributes, we can inspect the class and set proper storage names to the descriptors. That can be done with a class decorator or a metaclass. We’ll do it first in the easier way.

```python
def entity(cls):
    for key, attr in cls.__dict__.items():
        if isinstance(attr, Validated):  
            type_name = type(attr).__name__
            attr.storage_name = '_{}#{}'.format(type_name, key)  
    return cls  

@entity
class LineItem:
    description = model.NonBlank()
    weight = model.Quantity()
    price = model.Quantity()

    def __init__(self, description, weight, price):
        self.description = description
        self.weight = weight
        self.price = price

    def subtotal(self):
        return self.weight * self.price
```

## 21.3 What Happens When: Import Time Versus Runtime 

Python programmers talk about **import time** versus **runtime** but the terms are not strictly defined and there is a gray area between them. 

At import time, the interpreter parses the source code of a `.py` module in one pass from top to bottom, and generates the bytecode to be executed. That’s when syntax errors may occur. If there is an up-to-date `.pyc` file available in the local `__pycache__`, those steps are skipped because the bytecode is ready to run.

In particular, the `import` statement is not merely a declaration (Contrast with the `import` statement in Java, which is just a declaration to let the compiler know that certain packages are required.) but it actually runs all the top-level code of the imported module when it’s imported for the first time in the process--further imports of the same module will use a cache, and only name binding occurs then. That top-level code may do anything, including actions typical of “runtime”, such as connecting to a database. That’s why the border between “import time” and “runtime” is fuzzy.

On intepreter parsing a `def` statement:

- If it is a function, the interpreter compiles the function body (if it’s the first time that module is imported), and binds the function object to its global name, but it does not execute the body of the function, obviously. 
	- In the usual case, this means that the interpreter defines top-level functions at import time, but executes their bodies only when--and if--the functions are invoked at runtime.
- If it is a class, the story is different: at import time, the interpreter executes the body of every class, even the body of classes nested in other classes. Execution of a class body means that the attributes and methods of the class are defined, and then the class object itself is built. In this sense, the body of classes is “top-level code”: it runs at import time.

## 21.4 Metaclasses 101 

A metaclass is a class factory, except that instead of a function, like `record_factory`, a metaclass is written as a class. 

Consider the Python object model: classes are objects, therefore each class must be an instance of some other class. By default, Python classes are instances of `type`. In other words, `type` is the metaclass for most built-in and user-defined classes.

```python
>>> 'spam'.__class__
<class 'str'>
>>> str.__class__
<class 'type'>
>>> type.__class__
<class 'type'>
```

To avoid infinite regress, `type` is an instance of itself, as the last line shows.

Note that I am not saying that `str` inherits from `type`. What I am saying is that `str` is a instance of type. `str` is a subclass of object.

![][21-4-object-type]

The classes `object` and `type` have a unique relationship: `object` is an instance of `type`, and `type` is a subclass of `object`. This relationship is “magic”: it cannot be expressed in Python because either class would have to exist before the other could be defined. 

Every class is an instance of `type`, directly or indirectly, but only metaclasses are also subclasses of `type`. That’s the most important relationship to understand metaclasses: a metaclass, such as `ABCMeta`, inherits from `type` the power to construct classes. 

![][21-4-metaclass]

Let's see how `class Bar(metaclass=Foo)` works:

```python
class Foo(type):
    def __new__(cls, name, base, dic):
        print("[Foo] Calling __new__: cls = {}, name = {}, base = {}, dic = {}".format(cls, name, base, dic))
        # return type(name, base, dic)
        return type.__new__(Foo, name, base, dic)
    
    def __init__(cls, name, base, dic):
        print("[Foo] Calling __init__: cls = {}, name = {}, base = {}, dic = {}".format(cls, name, base, dic))

class Bar(metaclass=Foo):
    print("[Bar] Running class top-level")
    pass

class Baz(Bar):  # NOT EQUIVALENT TO class Baz(metaclass=Bar)
    print("[Baz] Running class top-level")
    pass
```

When you import these 3 classes (just import, at import time), the output would be:

```python
[Bar] Running class top-level
[Foo] Calling __new__: cls = <class '__main__.Foo'>, name = Bar, base = (), dic = {'__qualname__': 'Bar', '__module__': '__main__'}
[Foo] Calling __init__: cls = <class '__main__.Bar'>, name = Bar, base = (), dic = {'__qualname__': 'Bar', '__module__': '__main__'}
[Baz] Running class top-level
[Foo] Calling __new__: cls = <class '__main__.Foo'>, name = Baz, base = (<class '__main__.Bar'>,), dic = {'__qualname__': 'Baz', '__module__': '__main__'}
[Foo] Calling __init__: cls = <class '__main__.Baz'>, name = Baz, base = (<class '__main__.Bar'>,), dic = {'__qualname__': 'Baz', '__module__': '__main__'}
```

So you see a `Foo` instance is created through `__new__` and then `__init__` on declaring class `Bar` and `Baz` (AFTER the "class top-level" gets exectuted).

Note that if `Foo.__new__()` did not return an instance of `Foo`, e.g. `return type(name, base, dic)` as in the comment, `Foo.__init__()` would not be invoked. Further, declaring class `Baz` would not require the creation of another instance of `Foo` because `Baz`'s actual metaclass is now `type`.

注意 `class Bar(metaclass=Foo)` 是指定元类型，`class Bar(Foo)` 是继承，本质上并不相同！

注意执行顺序！[Python Documentation: 3.3.3.1. Metaclasses](https://docs.python.org/3/reference/datamodel.html#metaclasses) says:

> By default, classes are constructed using `type()`. The class body is executed in a new namespace and the class name is bound locally to the result of `type(name, bases, namespace)`.

所以是先执行 class body 再绑定 class，这也就解释了为什么 "class top-level" 先执行，`Foo` 对象的创建后执行。

注意 metaclass 的继承！[Python Documentation: 3.3.3.2. Determining the appropriate metaclass](https://docs.python.org/3/reference/datamodel.html#determining-the-appropriate-metaclass) says:

> The appropriate metaclass for a class definition is determined as follows:
> <br/>
> - if no bases and no explicit metaclass are given, then `type()` is used
> - if an explicit metaclass is given and it is not an instance of `type()`, then it is used directly as the metaclass
> - if a) an explicit metaclass is given and it is an instance of `type()`, or b) bases are defined, then the most derived metaclass is used

## 21.5 A Metaclass for Customizing Descriptors 

```python
class EntityMeta(type):
	"""Metaclass for business entities with validated fields"""
	
	def __init__(cls, name, bases, attr_dict):
		super().__init__(name, bases, attr_dict)
		for key, attr in attr_dict.items():
			if isinstance(attr, Validated):
				type_name = type(attr).__name__
				attr.storage_name = '_{}#{}'.format(type_name, key)

class Entity(metaclass=EntityMeta):
    """Business entity with validated fields"""

class LineItem(Entity):
	description = NonBlank()
	weight = Quantity()
	price = Quantity()
	
	def __init__(self, description, weight, price):
		self.description = description
		self.weight = weight
		self.price = price
	
	def subtotal(self):
		return self.weight * self.price
```

注意执行顺序！首先 "class top-level" 执行，所以 `description = NonBlank(); weight = Quantity()； price = Quantity()` 这三句先跑，然后再绑定 `metaclass=EntityMeta`，开始跑 `EntityMeta.__init__`，从而可以去修改 `storage_name`

## 21.6 The Metaclass `__prepare__` Special Method (only available in Python 3) 

[Python Documentation: 3.3.3.1. Metaclasses](https://docs.python.org/3/reference/datamodel.html#metaclasses) says:

> When a class definition is executed, the following steps occur:
> <br/>
> - the appropriate metaclass is determined
> - the class namespace is prepared ★
> - the class body is executed
> - the class object is created

如果是 `class Bar(metaclass=Foo)`, 那么 Bar 的 namespace 的创建过程可以大致写成：

```python
if Foo.__prepare__:
	Bar.namespace = Foo.__prepare__(name, bases, **kwds)  # `__prepare__` is `@classmethod` decorated 
else:
	Bar.namespace = collections.OrderedDict()  # an empty ordered mapping 
```

The `__prepare__` method is invoked by the interpreter before the `__new__` method in the metaclass to create the mapping that will be filled with the attributes from the class body. Besides the metaclass as first argument, `__prepare__` gets the name of the class to be constructed and its tuple of base classes, and it must return a mapping, which will be received as the last argument by `__new__` and then `__init__` when the metaclass builds a new class.

## 21.7 Classes as Objects 

Every class has a number of attributes defined in the Python data model:

- `cls.__mro__`
- `cls.mro()`: 
	- When building `cls`, the interpreter calls this method to obtain the tuple of superclasses that is stored in `cls.__mro__`. 
	- A metaclass can override this method to customize the method resolution order of the class under construction.
- `cls.__class__`
- `cls.__name__`
- `cls.__bases__`: The tuple of base classes of the class.
- `cls.__qualname__`: A new attribute in Python 3.3 holding the qualified name of a class or function, which is a dotted path from the global scope of the module to the class definition.
- `cls.__subclasses__()`:
	- This method returns a list of the immediate subclasses of the class. 
	- The implementation uses weak references to avoid circular references between the superclass and its subclasses--which hold a strong reference to the superclasses in their `__bases__` attribute. 
	- The method returns the list of subclasses that currently exist in memory.

## 21.8 Advices on Metaclasses 

In the real world, metaclasses are used in frameworks and libraries that help programmers perform, among other tasks:

- Attribute validation
- Applying decorators to many methods at once
- Object serialization or data conversion
- Object-relational mapping
- Object-based persistency
- Dynamic translation of class structures from other languages

Metaclasses are challenging, exciting, and--sometimes--abused by programmers trying to be too clever. To wrap up, let’s recall Alex Martelli’s final advice from his essay “Waterfowl and ABCs”:

> And, _don’t_ define custom ABCs (or metaclasses) in production code... if you feel the urge to do so, I’d bet it’s likely to be a case of “all problems look like a nail”-syndrome for somebody who just got a shiny new hammer--you (and future maintainers of your code) will be much happier sticking with straightforward and simple code, eschewing such depths.
> <br/>
> <p align="right">-- Alex Martelli</p>