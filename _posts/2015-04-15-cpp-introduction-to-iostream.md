---
layout: post
title: "C++: Introduction to iostream"
description: ""
category: C++
tags: []
---
{% include JB/setup %}

整理自：_Thinking in C++, Volume 2_ & _C++ Primer, 5th Edition_

-----

## 1. Getting Started

### 1.1 The iostream library

Fundamental to the `<iostream>` library are two types named `istream` and `ostream`, which represent input and output streams, respectively. A stream is a sequence of characters read from or written to an IO device. The term _stream_ is intended to suggest that the characters are generated, or consumed, sequentially over time.

The `<iostream>` library defines four IO objects. 

* To handle input, we use an object of type `istream` named **cin** (pronounced see-in). This object is also referred to as the **standard input**. 
* For output, we use an `ostream` object named **cout** (pronounced see-out；short for “console output”). This object is also known as the **standard output**. 
* The library also defines two other `ostream` objects, named **cerr** and **clog** (pronounced see-err and see-log, respectively). We typically use cerr, referred to as the **standard error**, for warning and error messages and clog for general information about the execution of the program.

Ordinarily, the system associates each of these objects with the window in which the program is executed. So, when we read from **cin**, data are read from the window in which the program is executing, and when we write to **cout**, **cerr**, or **clog**, the output is written to the same window.

### 1.2 Operator Precedence

```cpp
std::cout << "Enter two numbers:" << std::endl;
```

The output operator `<<` takes two operands: The left-hand operand must be an `ostream` object; the right-hand operand is a value to print. The operator writes the given value on the given `ostream`. The result of the output operator is its left-hand operand. That is, the result is the `ostream` on which we wrote the given value.

Thus, our expression is equivalent to

```cpp
(std::cout << "Enter two numbers:") << std::endl;
```

or

```cpp
std::cout << "Enter two numbers:";
std::cout << std::endl;
```

The input operator `>>` behaves analogously to the output operator.

### 1.3 Flushing
	
Writing `endl` has the effect of ending the current line and flushing the buffer associated with that device. Flushing the buffer ensures that all the output the program has generated so far is actually written to the output stream, rather than sitting in memory waiting to be written.

Programmers often add print statements during debugging. Such statements should always flush the stream. Otherwise, if the program crashes, output may be left in the buffer, leading to incorrect inferences about where the program crashed.

By default, reading **cin** flushes **cout**; **cout** is also flushed when the program ends normally.

### 1.4 Stream as a condition

```cpp
// read until end-of-file, calculating a running total of all values read
while (std::cin >> value)
	sum += value;
```

When we use an `istream` as a condition, the effect is to test the state of the stream. If the stream is valid—that is, if the stream hasn’t encountered an error—then the test succeeds. An `istream` becomes invalid when we hit _end-of-file_ or encounter an invalid input, such as reading a value that is not an integer. An `istream` that is in an invalid state will cause the condition to yield false.

On Windows systems we enter an _end-of-file_ by typing a "ctrl + z" followed by hitting either the Enter or Return key. On UNIX systems, including on Mac OS X machines, end-of-file is usually "ctrl + d".

### 1.5 Redirection Command

```cpp
> addItems <infile >outfile
```

Assuming our addition program has been compiled into an executable file named "addItems.exe" (or "addItems" on UNIX systems), this command will (force `std::cin` to) read transactions from a file named `infile` and (force `std::cout` to) write its output to a file named `outfile` in the current directory.

## 2. Inserters & extractors

`ostream::operator<<` is often referred to as an **inserter**, and `istream::operator>>` is often referred to as an **extractor**.

Consider how to output the representation of a Date object in MM-DD-YYYY format: 

```cpp
ostream& operator<<(ostream& os, const Date& d) {
	// 设置 fill 模式为首位填 0
	char fillc = os.fill('0'); 
	os << setw(2) << d.getMonth() << '-'
		<< setw(2) << d.getDay() << '-'
		<< setw(4) << setfill(fillc) << d.getYear();		
		// 对年份不需要做填充，setfill(fillc) 恢复原 fill 模式
		// setfill(fillc) 返回一个 manipulator，类似 endl，所有可以直接接到 << 后面
	
	return os;
}
```

Extractors require a little more care because things can go wrong with input data. The way to signal a stream error is to set the stream’s **fail bit**, as follows:

```cpp
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
```

When an error bit is set in a stream, all further streams operations are ignored until the stream is restored to a good state. 所以这里不需要用异常或是用 if-else 使得出错后跳过后续的某些操作，你正常写就好了. This implementation is somewhat forgiving in that it allows white space between the numbers and dashes in a date string because `operator>>` skips white space _**by default**_ when reading built-in types.

In addition, formatted input defaults to white space delimiters. 比如 `int i; char c; cin >> i; cin >> c;`，你输入 `47 x`，那就是 `i == 47` 和 `c == 'x'`；如果你输入 `4 7 x`，那就是 `i == 4`、`c == '7'`，x 会被忽略。

### Digress: <iosfwd>

如果不想 include 整个 `<iostream>`、要用 forward declaration 的话，可以用 `#include <iosfwd>`。

## 3. Handling stream errors

### 3.1 Stream state

| Stream state | Meaning |
|--------------|---------|
| badbit       | Some fatal (perhaps physical) error occurred. The stream should be considered unusable. |
| eofbit       | End-of-input has occurred (either by encountering the physical end of a file stream or by the user terminating a console stream, such as with Ctrl-Z or Ctrl!D). |
| failbit      | An I/O operation failed, most likely because of invalid data (e.g., letters were found when trying to read a number). The stream is still usable. The failbit flag is also set when end-of-input occurs. |
| goodbit      | All is well; no errors. End-of-input has not yet occurred. |

对应有 `stream::bad()`、`stream::eof()`、`stream::fail()`、`stream::good()` 四个方法，都是返回 true/false 表示是否处于该状态。但是需要额外注意 `stream::fail()` 是 returns true if either `failbit` or `badbit` is set.

Once any of the error bits in a stream’s state are set, they remain set. 如果要清除的话，需要用 `stream::clear()`：

```cpp
myStream.clear(); 							// clear all error bits
myStream.clear(ios::failbit | ios::eofbit); // clear failbit and eofbit
```

### 3.2 Streams and exceptions

可以使用 `stream::exception()` 方法来注册一个 exception state，当出现这个状态的时候就抛一个异常，一般为 `std::ios_base::failure`。比如：

```cpp
std::ifstream file;
file.exceptions(std::ifstream::failbit | std::ifstream::badbit);
```

The `exceptions()` function returns a bitmask of type `iostate` (which is a compiler-dependent type convertible to int) indicating which stream states will cause exceptions. If those states have already been set, an exception is thrown immediately.

不过实践中，貌似大家都不喜欢对读写操作写 try-catch（Java IO 一写就是一坨 try-catch 也是蛮烦的），所以一般的做法是手动检查 stream state。

## 4. Manipulators

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

```cpp
ostream& endl(ostream&);
```

然后 `cout << endl;` 里实际是传的这个 function name，也就是 function 的地址。然后 `operator<<` 的逻辑大概是（The actual definition is a little more complicated since it involves templates）：

```cpp
ostream& ostream::operator<<(ostream& (*pf)(ostream&)) {
	return pf(*this);
}
```

所以我们只要参照 endl 函数的签名，自己做一个 manipulator 也不是很难，比如：

```cpp
#include <iostream>
using namespace std;

ostream& nl(ostream& os) { // 'nl' for 'newline'
	return os << '\n';
}

int main() {
	cout << "newlines" << nl;
}
```
