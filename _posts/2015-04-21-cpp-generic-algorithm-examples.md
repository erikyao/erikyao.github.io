---
layout: post
title: "C++: Generic Algorithm Examples"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

整理自：_Thinking in C++, Volume 2_

-----

## 目录

- [1. `copy`(a.begin, a.end, b.begin) & `equal`(a.begin, a.end, b.begin) & `back_inserter`(vector)](#ga1)
- [2. `remove_copy_if`(a.begin, a.end, b.begin, predicateA) & `remove_copy_if`(a.begin, a.end, b.begin, predicateA, replacement) & `replace_if`(a.begin, a.end, predicateA, replacement)](#ga2)
- [3. `count_if`(a.begin, a.end, predicateA) & `find`(a.begin, a.end, target)](#ga3)
- [4. `ostream_iterator`(ostream, delimiter) & `istream_iterator`(istream)](#ga4)
- [5. `for_each`(a.begin, a.end, func)](#ga5)
- [6. `transform`(a.begin, a.end, b.begin, func)](#ga6)

-----

## <a name="ga1"></a>1. copy(a.begin, a.end, b.begin) & equal(a.begin, a.end, b.begin) & back_inserter(vector)

```cpp
#include <algorithm>
#include <cassert>
#include <cstddef> // For size_t
using namespace std;

int main() {
    int a[] = { 10, 20, 30 };
    const size_t SIZE = sizeof a / sizeof a[0];
    
	int b[SIZE];
    copy(a, a + SIZE, b);
    
	for(size_t i = 0; i < SIZE; ++i)
        assert(a[i] == b[i]);
	
	// assert(equal(a, a + SIZE, b)); // equivalent
}
```

```cpp
#include <algorithm>
#include <cassert>
#include <cstddef>
#include <vector>
using namespace std;

int main() {
    int a[] = { 10, 20, 30 };
    const size_t SIZE = sizeof a / sizeof a[0];
    
    vector<int> v1(a, a + SIZE);
    vector<int> v2(SIZE);
    
    copy(v1.begin(), v1.end(), v2.begin());
    assert(equal(v1.begin(), v1.end(), v2.begin()));
}
```

As with the example earlier, it’s important that `v2` have enough space to receive a copy of the contents of `v1`. For convenience, a special library function, `back_inserter(v2)`, which returns a special type of iterator that inserts elements to `v2`, may be used to expand memory as needed.

```cpp
#include <algorithm>
#include <cassert>
#include <cstddef>
#include <iterator>
#include <vector>
using namespace std;

int main() {
    int a[] = { 10, 20, 30 };
    const size_t SIZE = sizeof a / sizeof a[0];
    
    vector<int> v1(a, a + SIZE);
    vector<int> v2; // v2 is empty here
    
    copy(v1.begin(), v1.end(), back_inserter(v2));
    assert(equal(v1.begin(), v1.end(), v2.begin()));
}
```

The implementation of `copy()` looks like the following code:

```cpp
template<typename Iterator>
void copy(Iterator begin, Iterator end, Iterator dest) {
	while(begin != end)
		*begin++ = *dest++;
}
```

Whichever argument type you use in the call, `copy()` assumes it properly implements `operator*` and `operator++`. If it doesn’t, you’ll get a compile-time error.

## <a name="ga2"></a>2. remove_copy_if(a.begin, a.end, b.begin, predicateA) & remove_copy_if(a.begin, a.end, b.begin, predicateA, replacement) & replace_if(a.begin, a.end, predicateA, replacement)

先来个例子看下什么叫 predicate。注意这里 predicate 是 noun，读作 /'predɪkət/，意思是谓语，(grammar) The part of the sentence (or clause) which states something about the subject or the object of the sentence.

```cpp
#include <algorithm>
#include <cstddef>
#include <iostream>
using namespace std;

// You supply this predicate
bool gt15(int x) {
    return x > 15;
}

int main() {
    int a[] = { 10, 20, 30 };
    const size_t SIZE = sizeof a / sizeof a[0];
    
    int b[SIZE];
    int* bEnd = remove_copy_if(a, a+SIZE, b, gt15);
    int* bBegin = b;
    while(bBegin != bEnd)
        cout << *bBegin++ << endl; // output: 10
}
```

predicate 简单说就是一个返回 true/false 的函数，用来检测集合中单个元素是否满足某个条件。

The `remove_copy_if()` algorithm applies `gt15()` to each element of `a` and ignores those elements where the predicate yields true when copying to `b`. 这个用法很有点像 R 的 apply family，又有点 `a[a>15]` 的意味。

接下来这两个例子应该就好懂了：

```cpp
#include <algorithm>
#include <cstddef>
#include <iostream>
#include <string>
using namespace std;

// The predicate
bool contains_e(const string& s) {
    return s.find('e') != string::npos;
}

int main() {
    string a[] = {"read", "my", "lips"};
    const size_t SIZE = sizeof a / sizeof a[0];
    
	string b[SIZE];
    string* bEnd = replace_copy_if(a, a + SIZE, b,
                                   contains_e, string("kiss"));
    string* bBegin = b;
    while(bBegin != bEnd)
        cout << *bBegin++ << endl;
}

// output:
/*
	kiss
	my
	lips
*/
```

```cpp
#include <algorithm>
#include <cstddef>
#include <iostream>
#include <string>
using namespace std;

bool contains_e(const string& s) {
    return s.find('e') != string::npos;
}

int main() {
    string a[] = {"read", "my", "lips"};
    const size_t SIZE = sizeof a / sizeof a[0];
    
	replace_if(a, a + SIZE, contains_e, string("kiss"));
    string* p = a;
    while(p != a + SIZE)
        cout << *p++ << endl;
}

// output:
/*
	kiss
	my
	lips
*/
```

## <a name="ga3"></a>3. count_if(a.begin, a.end, predicateA) & find(a.begin, a.end, target)

`count_if(a.begin, a.end, predicateA)` 返回容器 `a` 内满足条件 `predicateA` 的元素的个数：

```cpp
#include <algorithm>
#include <cstddef>
#include <iostream>
using namespace std;

bool gt15(int x) {
    return x > 15;
}
 
int main() {
    int a[] = { 10, 20, 30 };
    const size_t SIZE = sizeof a / sizeof a[0];
    
    int aNumGt15 = count_if(a, a+SIZE, gt15);
    
	cout << aNumGt15 << endl;
	// output: 2
}
```

`find(a.begin, a.end, target)` 返回容器 `a` 内值为 `target` 的元素的指针，找到第一个时立刻返回；如果没有找到，返回 `a.end`：

```cpp
#include <algorithm>
#include <cstddef>
#include <iostream>
using namespace std;

bool gt15(int x) {
    return x > 15;
}
 
int main() {
    int a[] = { 10, 20, 30 };
    const size_t SIZE = sizeof a / sizeof a[0];
    
    int* p = find(a, a + SIZE, 20);
    
	cout << *p << endl;
	// output: 20
}
```

## <a name="ga4"></a>4. ostream_iterator<T>(ostream, delimiter) & istream_iterator<T>(istream)

```cpp
#include <algorithm>
#include <cstddef>
#include <iostream>
#include <iterator>
using namespace std;

bool gt15(int x) {
    return x > 15;
}

int main() {
    int a[] = { 10, 20, 30 };
    const size_t SIZE = sizeof a / sizeof a[0];
    
    remove_copy_if(a, a + SIZE,
                   ostream_iterator<int>(cout, "\n"), gt15); 
    // output: 10
}
```

Every time `remove_copy_if()` assigns an integer from the sequence a to `cout` through this iterator, the iterator writes the integer to `cout` and also automatically writes an delimiter (its second argument), which in this case "\n".

```cpp
#include <algorithm>
#include <fstream>
#include <iostream>
#include <iterator>
using namespace std;

bool gt15(int x) {
    return x > 15;
}

int main() {
    ofstream ints("someInts.dat");
    ints << "1 3 47 5 84 9";
    ints.close();
    
    ifstream inf("someInts.dat");
    remove_copy_if(istream_iterator<int>(inf),
                   istream_iterator<int>(),
                   ostream_iterator<int>(cout, "\n"), gt15);
}

// output:
/*
	1
	3
	5
	9
*/
```

The first argument `istream_iterator<int>(inf)` attaches an `istream_iterator` object to the input file stream `inf`. The second argument `istream_iterator<int>()` uses the default constructor which builds a special `istream_iterator` that indicates EOF, so that when the first iterator finally encounters the end of the physical file, the algorithm is terminated correctly.

## <a name="ga5"></a>5. for_each(a.begin, a.end, func)

```cpp
#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

void print(int x) {
	cout << x << endl;
}

int main() {
	vector<int> intVector;
	intVector.push_back(1);
	intVector.push_back(2);
	intVector.push_back(3);
	
	for_each(intVector.begin(), intVector.end(), print);
	// for_each(intVector.begin(), intVector.end(), ptr_fun<int, void>(print)); // equivalent
} 

// output:
/*
	1
	2
	3
*/
```

对，这就是 R 里面的 apply！

## <a name="ga6"></a>6. transform(a.begin, a.end, b.begin, func)

```cpp
#include <string>
#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

void print(string x) {
	cout << x << endl;
}

string addZero(int x) {
	return to_string(x) + "0"; // MinGW 下 to_string 会有 bug
}

int main() {
	vector<int> intVector;
	intVector.push_back(1);
	intVector.push_back(2);
	intVector.push_back(3);

	vector<string> strVector;
	strVector.resize(intVector.size());

	transform(intVector.begin(), intVector.end(), strVector.begin(), addZero);
	for_each(strVector.begin(), strVector.end(), print);
}

// output:
/*
	10
	20
	30
*/
```

`transform(a.begin, a.end, b.begin, func)` 的逻辑就是 "把从 a.begin 到 a.end 的每一个元素 a.i 传给 func，将 func(a.i) 依次存入 b"。

还有个复杂的版本是 `transform(a.begin, a.end, b.begin, c.begin, func)`，它的逻辑是 "把从 a.begin 到 a.end 的每一个元素 a.i，与 b.i 配对传给 func，将 func(a.i, bi) 依次存入 c"。