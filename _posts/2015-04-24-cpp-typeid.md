---
layout: post
title: "C++: typeid"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

整理自：_Thinking in C++, Volume 2_

-----

`typeid` operator returns an object of class `type_info`, which yields information about the type of object to which it was applied. If the type is polymorphic, it gives information about the most derived type that applies (the dynamic type); otherwise it yields static type information.

<pre class="prettyprint linenums">
#include &lt;iostream&gt;
#include &lt;typeinfo&gt;
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
    
	cout &lt;&lt; typeid(pPolyBase).name() &lt;&lt; endl;
    cout &lt;&lt; typeid(*pPolyBase).name() &lt;&lt; endl;
    cout &lt;&lt; boolalpha &lt;&lt; (typeid(*pPolyBase) == typeid(polyExt))
         &lt;&lt; endl;
    cout &lt;&lt; (typeid(PolyExt) == typeid(const PolyExt))
         &lt;&lt; endl;
	
	// Test non-polymorphic Types
    const NonPolyExt nonPolyExt(1);
    const NonPolyBase* pNonPolyBase = &nonPolyExt;
    
	cout &lt;&lt; typeid(pNonPolyBase).name() &lt;&lt; endl;
    cout &lt;&lt; typeid(*pNonPolyBase).name() &lt;&lt; endl;
    cout &lt;&lt; (typeid(*pNonPolyBase) == typeid(nonPolyExt)) &lt;&lt; endl;
	
	// Test a built-in type
    int i;
    
	cout &lt;&lt; typeid(i).name() &lt;&lt; endl;
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
</pre>

- Notice that RTTI ignores top-level `const` and `volatile` qualifiers.
- It turns out that you can’t store the result of a typeid operation in a `type_info` object, because there are no accessible constructors and assignment is disallowed. You must use it as we have shown. 
- In addition, the actual string returned by `type_info::name()` is compiler dependent. 
- Applying `typeid` to an expression that dereferences a null pointer will cause a `bad_typeid` exception (also defined in `<typeinfo>`).
- You can also apply `typeid` to nested class.
- You can also ask a `type_info` object if it precedes another `type_info` object in the implementation-defined “collation sequence”.
	- `if(typeid(foo).before(typeid(bar)))`
	- This is useful if you use `type_info` objects as keys.