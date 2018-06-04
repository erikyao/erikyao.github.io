---
layout: post
title: "Python: 3 ways to use metaclasses"
description: ""
category: Python
tags: []
---
{% include JB/setup %}

## Effective Python Item 33: Validate Subclasses with Metaclasses

主要是用来检查 static field，因为 static field 是在 class top-level 定义的，而 metaclass 的 `__new__` 是在 class top-level 跑完之后才运行的。例子：

```python
class ValidatePolygon(type):
    def __new__(meta, name, bases, class_dict):
        # Do not validate the abstract Polygon class
        if bases != (object,):
            if class_dict['sides'] < 3:
                raise ValueError('Polygons need 3+ sides')

        return type.__new__(meta, name, bases, class_dict)

class Polygon(object, metaclass=ValidatePolygon):
    """
    The abstract class
    """

    sides = None

    @classmethod
    def interior_angles(cls):
        return (cls.sides - 2) * 180

class Triangle(Polygon):
    sides = 3
```

## Effective Python Item 34: Register Class Existence with Metaclasses

用来 register 所有使用了该 metaclass 的 class。至于为什么要 register，书上的场景是：有一组 top-level 的 serialize / deserialize 的 function，满足条件 A 的 class 使用格式甲，满足条件 B 的 class 使用格式乙；而 serialize / deserialize 本身也要用到类名。这时候 register 就很有必要了。

例子：

```python
registry = {}

def register_class(target_class):
    registry[target_class.__name__] = target_class

def deserialize(data):
    params = json.loads(data)
    name = params['class']
    target_class = registry[name]
    return target_class(*params['args'])

class BetterSerializable(object):
    def __init__(self, *args):
        self.args = args
   
    def serialize(self):
        return json.dumps({
            'class': self.__class__.__name__,
            'args': self.args,
        })

class Meta(type):
    def __new__(meta, name, bases, class_dict):
        cls = type.__new__(meta, name, bases, class_dict)
        register_class(cls)
        return cls

class RegisteredSerializable(BetterSerializable, metaclass=Meta):
    pass

class Vector3D(RegisteredSerializable):
    ...
```

## Effective Python Item 35: Annotate Class Attributes with Metaclasses

与 descriptor 组合使用。descriptor 形式上也是 static field（当然用起来还是 member field），在 class top-level 定义。我们可以使用 metaclass 去修改 descriptor 的一些属性，最常见的用法就是省略掉 descriptor 的 name。

需要显式写 descriptor name 的例子：

```python
class Field(object):
    """
    The descriptor 
    """
    def __init__(self, name):
        self.name = name
        self.internal_name = '_' + self.name
    
    def __get__(self, instance, instance_type):
        if instance is None: 
            return self
        return getattr(instance, self.internal_name, ”)
    
    def __set__(self, instance, value):
        setattr(instance, self.internal_name, value)

class Customer(object):
    first_name = Field('first_name')
    last_name = Field('last_name')
    prefix = Field('prefix')
    suffix = Field('suffix')
```

省略掉 descriptor name 的写法：

```python
class Field(object):
    """
    The descriptor 
    """
    def __init__(self):
        self.name = None
        self.internal_name = None
    
    def __get__(self, instance, instance_type):
        if instance is None: 
            return self
        return getattr(instance, self.internal_name, ”)
    
    def __set__(self, instance, value):
        setattr(instance, self.internal_name, value)

class Meta(type):
    def __new__(meta, name, bases, class_dict):
        for key, value in class_dict.items():
            if isinstance(value, Field):
                value.name = key
                value.internal_name = '_' + key
        cls = type.__new__(meta, name, bases, class_dict)
        return cls

class HasField(object, metaclass=Meta):
    pass

class Customer(HasField):
    first_name = Field()
    last_name = Field()
    prefix = Field()
    suffix = Field()
```

