---
layout: post
title: "Algorithm Quizzes"
description: ""
category: Interview
tags: [Interview-101]
---
{% include JB/setup %}

## Quiz 1

求以下两段代码各自的computational cost（参 [Computational cost](http://stackoverflow.com/questions/3127145/computational-cost)）：

	(1) while(n>2)	
			n = sqrt(n); 
	(2) while(n>2) 
			n = log(n)

解：(1) 设 sqrt(n) == p，假设程序运行 k 次，有：

	k = 1, p = n ^ ½ 
	k = 2, p = n ^ ¼ 
	…… 
	k = m, p = n ^ (½ ^ m)
 
假设 k = m 时，p <= 2，有：

	p = n ^ (½ ^ m)，两边同时 (2 ^ m) 次方，得：
	p ^ (2 ^ m) = n，两边同时取对数，得：
	(2 ^ m) × log p = log n，两边再次取对数，得：
	log (2 ^ m) + log log p = log log n，即：
	m•log2 + log log p = log log n

	∵ p <= 2 为常数
	∴ log log p 为常数
	又 ∵ log2 是常数
	∴ m ~= log log n
	
即算法复杂度为 O(log log n)

解：(2) 设 log(n) == p，假设程序运行 k 次，有 

	k = 1, p = log n 
	k = 2, p = log log n 
	…… 
	k = m, p = log log …… log n // m 个 log

假设 k = m 时，p <= 2，根据 Iterated logarithm，有：

	log*(n) = 1 + log*(log n)
			= 2 + log*(log log n)
			= 3 + log*(log log log n)
			= ……
			= m + log*(log log …… log n) // m 个 log
			= m + log*(p)

	∵ p <= 2 为常数
	∴ log*(p) 为常数
	∴ m ~= log*(n)
	
即算法复杂度为 O(log log n)

## Quiz 2

如何判断一个正整数是不是 2 的 n 次方？

解：设 x 为 2 的 n 次方，x 有 m bits，则 x 的最高位为 1，后 m-1 位为 0

同时 x-1 的最高位为 0，后 m-1 位为 1，所以做与运算有 x & (x - 1) == 0


