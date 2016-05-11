---
layout: post
title: "C++: A quick view of design pattern"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

整理自：_Thinking in C++, Volume 2_

-----

## 0. Categories

- Creational:
	- [Singleton](#Singleton)
	- [Factory](#Factory)
	- **Builder:** separates the construction of an object from its “representation.”
- Structural:
	- [Proxy](#Proxy-State)
	- **Adapter:** takes one type and produces an interface to some other type. 
- Behavioral:
	- [Command](#Command)
	- Template Method
	- [State](#Proxy-State)
	- [Strategy](#Strategy)
	- [Chain of Responsibility](#CoR)
	- **Observer:** what if a group of objects needs to update themselves when some other object changes state?
	- [Multiple Dispatching (另起一篇)](/c++/2015/04/26/cpp-double-dispatch)
	- [Visitor (参考另一篇)](/java/2014/06/24/digest-of-agile-software-development-ppp#ch28)
	
## <a name="Singleton"></a>1. Singleton

```cpp
#include <iostream>
using namespace std;

class Singleton {
private:
    static Singleton s;
    int i;
    Singleton(int x) : i(x) { }			// To disable constructor
    Singleton& operator=(Singleton&); 	// To disable operator=
    Singleton(const Singleton&); 		// To disable copy-constructor
public:
    static Singleton& instance() {
        return s;
    }
    int getValue() {
        return i;
    }
    void setValue(int x) {
        i = x;
    }
};

Singleton Singleton::s(47); // initialize the static instance

int main() {
    Singleton& s = Singleton::instance();
    cout << s.getValue() << endl; // output: 47
    
	Singleton& s2 = Singleton::instance();
    s2.setValue(9);
    cout << s.getValue() << endl; // output: 9
}
```

lazy-initialization version:

```cpp
class Singleton {
    int i;
    Singleton(int x) : i(x) { }			// To disable constructor
    Singleton& operator=(Singleton&); 	// To disable operator=
    Singleton(const Singleton&); 		// To disable copy-constructor
public:
    static Singleton& instance() {
        static Singleton s(47);	// local static
        return s;
    }
    int getValue() {
        return i;
    }
    void setValue(int x) {
        i = x;
    }
};
```

## <a name="Command"></a>2. Command

The point is to decouple the choice of function to be called from the site where that function is called.

```cpp
#include <iostream>
#include <vector>
using namespace std;

class Command {
public:
    virtual void execute() = 0;
};

class SayHello : public Command {
public:
    void execute() {
        cout << "Hello ";
    }
};

class SayWorld : public Command {
public:
    void execute() {
        cout << "World! ";
    }
};

class SayIAm : public Command {
public:
    void execute() {
        cout << "I'm the command pattern!";
    }
};

int main() {
    vector<Command*> commandVector;
    commandVector.push_back(new SayHello);
    commandVector.push_back(new SayWorld);
    commandVector.push_back(new SayIAm);
    
    for (Command* pc : commandVector) {
    	pc->execute();
    	delete pc;
	}
	// output: Hello World! I'm the command pattern! 
}
```

GoF says that “Commands are an object-oriented replacement for callbacks.”

## <a name="Proxy-State"></a>3. Proxy & State

Proxy is simply a special case of State. Structurally, the difference between Proxy and State is simple: a Proxy has only one implementation, while State has more than one.

### Proxy: fronting for another object

其实就是一种 composition 的运用：

```cpp
#include <iostream>
using namespace std;

class FooBase {
public:
    virtual void g() = 0;
    virtual void h() = 0;
    virtual ~FooBase() {}
};

class FooImpl : public FooBase {
public:
    void g() {
        cout << "FooImpl.g()" << endl;
    }
    void h() {
        cout << "FooImpl.h()" << endl;
    }
};

class FooProxy : public FooBase {
    FooBase* foo;
public:
    FooProxy() {
        foo = new FooImpl();
    }
    ~FooProxy() {
        delete foo;
    }
	
	// Forward calls to the FooImpl:
    void g() {
        foo->g();
    }
    void h() {
        foo->h();
    }
};

int main() {
    FooProxy proxy;
    proxy.g();
    proxy.h();
}
```

`FooImpl` doesn’t need the same interface as `FooProxy`.

### State: changing object behavior

```cpp
#include <iostream>
#include <string>
using namespace std;

class FrogPrince {
    class State {
    public:
        virtual string response() = 0;
    };
    
	class Frog : public State {
    public:
        string response() {
            return "Ribbet!"; // 青蛙叫的拟声词 
        }
    };
    
	class Prince : public State {
    public:
        string response() {
            return "Darling!";
        }
    };
    
    State* state;
public:
    FrogPrince() : state(new Frog()) {}
    
	void greet() {
        cout << state->response() << endl;
    }
    
	void kiss() {
        delete state;
        state = new Prince();
    }
};

int main() {
    FrogPrince frogPrince;

    frogPrince.greet();
    frogPrince.kiss();
    frogPrince.greet();
}
```

It is not necessary to make the implementing classes nested or private, but if you can it creates cleaner code.

## <a name="Strategy"></a>4. Strategy: choosing the algorithm at runtime

实现形式上有点像 command，但是参考 [Difference between Strategy pattern and Command pattern](http://stackoverflow.com/a/4835013)：

> ... There will tend to be a large number of distinct Command objects that pass through a given point in a system over time, and the Command objects will hold varying parameters describing the operation requested.
> <br/>
> The Strategy pattern, on the other hand, is used to specify how something should be done, and plugs into a larger object or method to provide a specific algorithm. A Strategy for sorting might be a merge sort, might be an insertion sort, or perhaps something more complex like only using merge sort if the list is larger than some minimum size. Strategy objects are rarely subjected to the sort of mass shuffling about that Command objects are, instead often being used for configuration or tuning purposes.

## <a name="CoR"></a>5. Chain of Responsibility: trying a sequence of strategies

Chain of Responsibility might be thought of as a “dynamic generalization of recursion” using Strategy objects.

- In recursion, one function calls itself over and over until a termination condition is reached.
- With Chain of Responsibility, a function calls itself, which (by moving down the chain of Strategies) calls a different implementation of the function, until one of the strategies is successful or the chain ends.

## <a name="Factory"></a>6. Factories: encapsulating object creation

```cpp
#include <iostream>
#include <stdexcept>
#include <cstddef>
#include <string>
#include <vector>
#include "../purge.h"
using namespace std;

class Shape {
public:
    virtual void draw() = 0;
    virtual ~Shape() {}
    
	class BadShapeCreation : public logic_error {
    public:
        BadShapeCreation(string type)
            : logic_error("Cannot create type " + type) {}
    };
    
	static Shape* factory(const string& type) throw(BadShapeCreation);
};

class Circle : public Shape {
private:
    Circle() {} // Private constructor
    friend class Shape;
public:
    void draw() { cout << "Circle::draw" << endl; }
    ~Circle() { cout << "Circle::~Circle" << endl; }
};

class Square : public Shape {
private:
    Square() {} // Private constructor
    friend class Shape;
public:
    void draw() { cout << "Square::draw" << endl; }
    ~Square() { cout << "Square::~Square" << endl; }
};

Shape* Shape::factory(const string& type) throw(Shape::BadShapeCreation) {
    if(type == "Circle") 
		return new Circle;
    
	if(type == "Square") 
		return new Square;
    
	throw BadShapeCreation(type);
}

int main() {
    try {
    	Shape* ps = Shape::factory("Square");
    } catch(Shape::BadShapeCreation e) {
        cout << e.what() << endl;
        delete ps;
        return EXIT_FAILURE;
    }
    ...
}
```

You could also declare only `Shape::factory()` to be a friend, but it seems reasonably harmless to declare the entire base class as a friend.

And actually different types of factories can be derived from the basic factory--we call them polymorphic factories. 这样就不用像上面把 base 声明为 friend 了。

