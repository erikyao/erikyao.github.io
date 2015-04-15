---
layout: post
title: "C++: iostream"
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

