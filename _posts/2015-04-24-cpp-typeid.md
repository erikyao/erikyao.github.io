---
category: C++
description: ''
tags: [RTTI]
title: 'C++: typeid'
---

整理自：_Thinking in C++, Volume 2_

-----

`typeid` operator returns an object of class `type_info`, which yields information about the type of object to which it was applied. If the type is polymorphic, it gives information about the most derived type that applies (the dynamic type); otherwise it yields static type information.

```cpp
#include <iostream>
#include <typeinfo>
using namespace std;

struct PolyBase {
    virtual ~PolyBase() {}
};

struct PolyExt : PolyBase {
    PolyExt() {}
};

struct NonPolyBase {};

struct NonPolyExt : NonPolyBase {
    NonPolyExt(int) {}
};

int main() {
	// Test polymorphic Types
    const PolyExt polyExt;
    const PolyBase* pPolyBase = &polyExt;
    
	cout << typeid(pPolyBase).name() << endl;
    cout << typeid(*pPolyBase).name() << endl;
    cout << boolalpha << (typeid(*pPolyBase) == typeid(polyExt))
         << endl;
    cout << (typeid(PolyExt) == typeid(const PolyExt))
         << endl;
	
	// Test non-polymorphic Types
    const NonPolyExt nonPolyExt(1);
    const NonPolyBase* pNonPolyBase = &nonPolyExt;
    
	cout << typeid(pNonPolyBase).name() << endl;
    cout << typeid(*pNonPolyBase).name() << endl;
    cout << (typeid(*pNonPolyBase) == typeid(nonPolyExt)) << endl;
	
	// Test a built-in type
    int i;
    
	cout << typeid(i).name() << endl;
}

// output:
/*
	struct PolyBase const *
	struct PolyExt
	true
	true
	struct NonPolyBase const *
	struct NonPolyBase
	false
	int
*/
```

- Notice that RTTI ignores top-level `const` and `volatile` qualifiers.
	- 因为 cv-qualifiers 表示的是 compile-time limits，RTTI 没有获取 cv-qualifiers 的机制 (或者说 cv-qualifiers 的信息没有保存给 runtime)，所以 RTTI 的选择是直接忽略掉
- You can’t store the result of a `typeid` operation in a `type_info` object, because there are no accessible constructors, and assignment is disallowed. You must use it as we have shown. 
- The actual string returned by `type_info::name()` is compiler dependent. 
- Applying `typeid` to an expression that dereferences a null pointer will cause a `bad_typeid` exception (also defined in `<typeinfo>`).
- You can apply `typeid` to nested class.
- You can ask a `type_info` object if it precedes another `type_info` object in the implementation-defined “collation sequence”.
	- E.g. `if(typeid(foo).before(typeid(bar)))`
	- This is useful if you use `type_info` objects as keys.