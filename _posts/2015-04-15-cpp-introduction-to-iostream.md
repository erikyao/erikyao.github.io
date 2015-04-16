---
layout: post
title: "C++: Introduction to iostream"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

整理自：_Thinking in C++, Volumn 2_

-----

## 1. Inserters & extractors

`ostream::operator<<` is often referred to as an **inserter**, and `istream::operator>>` is often referred to as an **extractor**.

Consider how to output the representation of a Date object in MM-DD-YYYY format: 

<pre class="prettyprint linenums">
ostream& operator&lt;&lt;(ostream& os, const Date& d) {
	// 设置 fill 模式为首位填 0
	char fillc = os.fill('0'); 
	os &lt;&lt; setw(2) &lt;&lt; d.getMonth() &lt;&lt; '-'
		&lt;&lt; setw(2) &lt;&lt; d.getDay() &lt;&lt; '-'
		&lt;&lt; setw(4) &lt;&lt; setfill(fillc) &lt;&lt; d.getYear();		
		// 对年份不需要做填充，setfill(fillc) 恢复原 fill 模式
		// setfill(fillc) 返回一个 manipulator，类似 endl，所有可以直接接到 &lt;&lt; 后面
	
	return os;
}
</pre>

Extractors require a little more care because things can go wrong with input data. The way to signal a stream error is to set the stream’s **fail bit**, as follows:

<pre class="prettyprint linenums">
istream& operator>>(istream& is, Date& d) {
	is >> d.month;
	
	char dash;
	is >> dash;
	if(dash != '-')
		is.setstate(ios::failbit);
	
	is >> d.day;
	
	is >> dash;
	if(dash != '-')
		is.setstate(ios::failbit);
	
	is >> d.year;
	
	return is;
}
</pre>

When an error bit is set in a stream, all further streams operations are ignored until the stream is restored to a good state. 所以这里不需要用异常或是用 if-else 使得出错后跳过后续的某些操作，你正常写就好了. This implementation is somewhat forgiving in that it allows white space between the numbers and dashes in a date string because `operator>>` skips white space _**by default**_ when reading built-in types.

In addition, formatted input defaults to white space delimiters. 比如 `int i; char c; cin >> i; cin >> c;`，你输入 `47 x`，那就是 `i == 47` 和 `c == 'x'`；如果你输入 `4 7 x`，那就是 `i == 4`、`c == '7'`，x 会被忽略。

### Digress: <iosfwd>

如果不想 include 整个 `<iostream>`、要用 forward declaration 的话，可以用 `#include <iosfwd>`。

## 2. Handling stream errors

### 2.1 Stream state

| Stream state | Meaning |
|--------------|---------|
| badbit       | Some fatal (perhaps physical) error occurred. The stream should be considered unusable. |
| eofbit       | End-of-input has occurred (either by encountering the physical end of a file stream or by the user terminating a console stream, such as with Ctrl-Z or Ctrl!D). |
| failbit      | An I/O operation failed, most likely because of invalid data (e.g., letters were found when trying to read a number). The stream is still usable. The failbit flag is also set when end-of-input occurs. |
| goodbit      | All is well; no errors. End-of-input has not yet occurred. |

对应有 `stream::bad()`、`stream::eof()`、`stream::fail()`、`stream::good()` 四个方法，都是返回 true/false 表示是否处于该状态。但是需要额外注意 `stream::fail()` 是 returns true if either `failbit` or `badbit` is set.

Once any of the error bits in a stream’s state are set, they remain set. 如果要清除的话，需要用 `stream::clear()`：

<pre class="prettyprint linenums">
myStream.clear(); 							// clear all error bits
myStream.clear(ios::failbit | ios::eofbit); // clear failbit and eofbit
</pre>

### 2.2 Streams and exceptions

可以使用 `stream::exception()` 方法来注册一个 exception state，当出现这个状态的时候就抛一个异常，一般为 `std::ios_base::failure`。比如：

<pre class="prettyprint linenums">
std::ifstream file;
file.exceptions(std::ifstream::failbit | std::ifstream::badbit);
</pre>

The `exceptions()` function returns a bitmask of type `iostate` (which is a compiler-dependent type convertible to int) indicating which stream states will cause exceptions. If those states have already been set, an exception is thrown immediately.

不过实践中，貌似大家都不喜欢对读写操作写 try-catch（Java IO 一写就是一坨 try-catch 也是蛮烦的），所以一般的做法是手动检查 stream state。

## 3. Manipulators

Manipulators with no arguments are provided in `<iostream>`, including:

| Manipulator | Effect                                                                                                                         |
|-------------|--------------------------------------------------------------------------------------------------------------------------------|
| endl        | `cout <<  endl`: inserts a newline character + flushes the stream                                                              |
| flush       | `cout << flush;` 等价于 `cout.flush();`                                                                                        |
| ws          | `cin >> ws` 等价于 `ws(cin)`：从当前位置起，一路跳过 white space，在第一个 non-ws 的字符前停止，比如 `cin >> ws >> s;` 输入 `  foo` 可以得到 `s == "foo"` |
| dec         | 等价于 `setf(ios::dec, ios::basefield)`                                                                                        |
| oct         | 等价于 `setf(ios::oct, ios::basefield)`                                                                                        |
| hex         | 等价于 `setf(ios::hex, ios::basefield)`                                                                                        |
| showbase    | Indicate the numeric base (dec, oct, or hex) when printing an integral value.                                                  |
| noshowbase  | Turns off `showcase`                                                                                                           |

There are six standard manipulators that take arguments. These are defined in the header file `<iomanip>`:

| Manipulator               | Effect                                                                     |
|---------------------------|----------------------------------------------------------------------------|
| setiosflags(fmtflags n)   | 等价于 `ios::setf(n)`                                                      |
| resetiosflags(fmtflags n) | 等价于 `ios::unsetf(n)`                                                    |
| setbase(base n)           | Changes base to n, where n is 10, 8, or 16. (Anything else results in 10.) |
| setfill(char n)           | 等价于 `ios::fill(n)`，设置填充字符                                        |
| setprecision(int n)       | 等价于 `ios::precision(n)`，设置精度                                       |
| setw(int n)               | 等价于 `ios::width(n)`，设置字符串宽度                                     |

### Creating manipulators

我们先看下 `endl` 的构造：

<pre class="prettyprint linenums">
ostream& endl(ostream&);
</pre>

然后 `cout << endl;` 里实际是传的这个 function name，也就是 function 的地址。然后 `operator<<` 的逻辑大概是（The actual definition is a little more complicated since it involves templates）：

<pre class="prettyprint linenums">
ostream& ostream::operator&lt;&lt;(ostream& (*pf)(ostream&)) {
	return pf(*this);
}
</pre>

所以我们只要参照 endl 函数的签名，自己做一个 manipulator 也不是很难，比如：

<pre class="prettyprint linenums">
#include &lt;iostream&gt;
using namespace std;

ostream& nl(ostream& os) { // 'nl' for 'newline'
	return os &lt;&lt; '\n';
}

int main() {
	cout &lt;&lt; "newlines" &lt;&lt; nl;
}
</pre>