---
layout: post
title: "C++ String"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

整理自：_Thinking in C++, Volume 2_

-----

## 1. Creating strings

To use strings you include the C++ header file `<string>`. The `string` class is also in the namespace `std`.

```cpp
string imBlank;
string heyMom("Where are my socks?");
string standardReply = "Beamed into deep "
	"space on wide angle dispersion?";	// concat string literals
string useThisOneAgain(standardReply);

// Copy the first 8 chars:
string s4(s1, 0, 8);

// concat
string quoteMe = s4 + "that";

string source("xxx");
string s(source.begin(), source.end()); // string iterator
assert(s == source);

string okay(5, 'a'); // initialize a string with a number of copies of a single character
assert(okay == string("aaaaa"));
```
	
## 2. Operating on strings

### 2.1 Appending, inserting, and concatenating strings

```cpp
#include <string>
#include <iostream>
using namespace std;

int main() {
    string bigNews("I saw Elvis in a UFO. ");
    cout << bigNews << endl;

	// How much data have we actually got?
    cout << "Size = " << bigNews.size() << endl;
    cout << "Length = " << bigNews.length() << endl; // .length() and .size() are identical
	// How much can we store without reallocating?
    cout << "Capacity = " << bigNews.capacity() << endl;

	// Insert this string in bigNews immediately
	// before bigNews[1]:
    bigNews.insert(1, " thought I");
    cout << bigNews << endl;
    cout << "Size = " << bigNews.size() << endl;
    cout << "Capacity = " << bigNews.capacity() << endl;
	
	// Make sure that there will be this much space
    bigNews.reserve(500); // 注意是 reserve 不是 reverse 
	
	// Add this to the end of the string:
    bigNews.append("I've been working too hard.");
    cout << bigNews << endl;
    cout << "Size = " << bigNews.size() << endl;
    cout << "Capacity = " << bigNews.capacity() << endl;
    
    // appends spaces if the new size is greater than the current string size or truncates the string otherwise
    bigNews.resize(10);
    cout << bigNews << endl;
    cout << "Size = " << bigNews.size() << endl;
    cout << "Capacity = " << bigNews.capacity() << endl;
}

// output: 
/* 
	I saw Elvis in a UFO.
	Size = 22
	Length = 22
	Capacity = 22
	I thought I saw Elvis in a UFO.
	Size = 32
	Capacity = 44
	I thought I saw Elvis in a UFO. I've been working too hard.
	Size = 59
	Capacity = 500
	I thought
	Size = 10
	Capacity = 500
*/
```

### 2.2 Replacing string characters

There are a number of overloaded versions of `string::replace()`, but the simplest one takes three arguments: 

- an integer indicating where to start in the string, 
- an integer indicating how many characters to eliminate from the original string, 
- and the replacement string.

```cpp
#include <cassert>
#include <cstddef> // For size_t
#include <string>
using namespace std;

int main() {
    string bigNews = "I thought I saw Elvis in a UFO. "
		"I have been working too hard.";
    string replacement("wig");
    string findMe("UFO");
    
	// Look in bigNews for the "UFO"
	// starting at position 0:
    size_t i = bigNews.find(findMe, 0);
	
	// Did we find the "UFO"?
    if(i != string::npos) {
    	// Replace the "UFO" with "wig":
        bigNews.replace(i, findMe.size(), replacement);
	}

	assert(bigNews == "I thought I saw Elvis in a wig. "
		"I have been working too hard.");
}
```

另外还有一个 generic algorithm `replace()`:

```cpp
#include <algorithm>
#include <cassert>
#include <string>
using namespace std;

int main() {
	string s("aaaXaaaXXaaXXXaXXXXaaa");
	replace(s.begin(), s.end(), 'X', 'Y');
	assert(s == "aaaYaaaYYaaYYYaYYYYaaa");
}
```

The `replace()` algorithm only works with single objects (in this case, `char` objects) and will not replace quoted char arrays or string objects.

### 2.3 Removing characters from strings

`string::erase()` takes two arguments: 

- where to start removing characters (which defaults to 0), 
- and how many to remove (which defaults to `string::npos`). 

因为 `string::npos` 其实是个极大的整数，而 If you specify more characters than remain in the string, the remaining characters are all erased anyway. So calling `string::npos` without any arguments removes all characters in it.

## 3. Searching in strings

`string::find()` family，用法大体相同：找到了就返回 starting position of the first match，没找到就返回 `string:npos`。family 有：

- find()
- find_first_of()
- find_last_of()
- find_first_not_of()
- find_last_not_of()
- rfind() 				// find reversely

见名知意。

## 4. Comparing strings

C++ 的字符串是可以用 >、<、>=、<=、!=、== 来比较大小的，遵循的是字母序，比如 "a" < "b"，"aa" < "ab" 这样。

另外也可以用 `string::compare()`，与 java 的用法一致。

## 5. Strings and character traits

Observe how `string` is declared in the Standard C++ header file:

```cpp
typedef basic_string<char> string;

template <class CharType, class Traits = char_traits<CharType>, class Allocator = allocator<CharType>>
class basic_string;
```

根据 [MSDN: basic_string Class](https://msdn.microsoft.com/en-us/library/syxtdd4f.aspx) 的说法：

- CharType for `string` is `char`
- CharType for `wstring` is `wchar_t` 
- CharType for `u16string` is `char16_t` 
- CharType for `u32string` is `char32_t`

To change the way the string class treats character comparison (e.g. take uppercase and lowercase into accounts), you must supply a different `char_traits<>` template because that defines the behavior of the individual character comparison member functions.

书上 P111 给了一个例子。