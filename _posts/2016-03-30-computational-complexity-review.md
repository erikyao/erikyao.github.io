---
layout: post-mathjax
title: "Computational Complexity Review"
description: ""
category: Math
tags: []
---
{% include JB/setup %}

[Reduction]: https://farm2.staticflickr.com/1670/25699429983_0e32464a98_o_d.jpg
[M_Prime]: https://farm2.staticflickr.com/1698/26278452596_b3f4a02ca9_o_d.jpg
[Picture_of_Reduction]: https://farm2.staticflickr.com/1617/26031609730_046b650ddd_o_d.jpg

## Turing Machines @ [Automata](https://class.coursera.org/automata-003/lecture) by Jeff Ullman

Questions:

- How to show that certain tasks are impossible, or in some cases, possible but intractable--that is, they can be solved but only by very slow algorithms?
- What can be solved by computer algorithms?

Turing machine:

- In some sense an ultimate automaton.
- A formal computing model that can compute anything we can do with computer or with any other realistic model that we might think of as computing.
- TMs define the class of recursively enumerable languages which thus the largest class of languages about which we can compute anything.
	- There is another smaller class called recursive languages that can be thought of as modeling algorithms--computer programs that answer a particular question and then finish.
	
Data types:

- int, float, string, etc.
- But at another level, there is only one type--string of bit.
	- It is more convenient to think of binary strings as integers. 
- Programs are also strings and thus strings of bits.
	- The fact that programs and data are at heart the same thing is what let us build a powerful theory about what is not computable.
	
"The $i^{th}$ data":

- Integers are 1,2,3...
- "Data" can also be assigned to 1,2,3...
	- Need some tricks from coding or cryptography.
	- Then it makes sense to talk about "the $i^{th}$ data".
- E.g. "the $i^{th}$ string":
	- Strings of ASCII or Unicode characters can be thought of as binary strings.
	- There’s a small glitch: If you think simply of binary integers, then strings like $101, 0101, 00101,\dots$ all appear to be “the $5^{th}$ string.”
		- Fix by prepending a $1$ to the string before converting to an integer. 
		- Thus, $101$, $0101$, and $00101$ are the $13^{th}$ ($\color{red}{1}101 = 13$), $21^{st}$, and $37^{th}$ strings, respectively.
- E.g. "the $i^{th}$ proof":
	- A formal proof is a sequence of logical expressions.
	- We can encode mathematical expressions of any kind in Unicode.
	- Convert expression to a binary string and then an integer.
	- Problems:
		- A proof is a sequence of expressions, so we need a way to separate them. 
		- Also, we need to indicate which expressions are given and which follow from previous expressions.
	- Quick-and-dirty way to introduce special symbols into binary strings: 
		- Given a binary string, precede each bit by 0. 
			- Example: $101$ becomes $010001$. 
		- Use strings of two or more $1$’s as the special symbols. 
			- Example: $111$ = “the following expression is given”; $11$ = “end of expression.”
		- E.g. $\color{blue}{111}\color{red}{0}\underline{1}\color{red}{0}\underline{0}\color{red}{0}\underline{1}\color{blue}{11}\color{cyan}{111}\color{red}{0}\underline{0}\color{red}{0}\underline{0}\color{red}{0}\underline{1}\color{red}{0}\underline{1}\color{cyan}{11} = \underline{101},\underline{0011}$

Orders of infinity:
		
- There aren't more "data" than there are integers.
- While the number is infinite, you may aware that there are different orders of infinity, and the integers is of the smallest one. 
	- E.g. there are more real numbers than there are integers, so there are more real numbers than there are "programs" (think of programs as data). 
		- This immediately tells you that some real numbers cannot be computed by programs.
		
Finite sets:

- A finite set has a particular integer that is the count of the number of members--the cardinality. 
	- Example: $\lbrace a, b, c \rbrace$ is a finite set; its cardinality is 3. 
- It is impossible to find a 1-1 mapping between a finite set and a proper subset of itself.

Infinite Sets:

- Formally, an infinite set is a set for which there is a 1-1 correspondence between itself and a proper subset of itself. 
	- Example: the positive integers $\lbrace 1, 2, 3,\dots \rbrace$ is an infinite set. 
		- There is a 1-1 correspondence 1<->2, 2<->4, 3<->6,… between this set and a proper subset (the set of even integers).
		
Countable Sets:

- A countable set is a set with a 1-1 correspondence with the positive integers. 
	- Hence, all countable sets are infinite. 
	- Example: set of all integers. 
		- 0 <-> 1; $-i$ <-> $2i$; $+i$ <-> $2i+1$. 
		- Thus, order is 0, -1, 1, -2, 2, -3, 3,...
			- I.e. the $1^{st}$ integer is 0; $2^{nd}$ is -1; ...
	- Examples: set of binary strings, set of Java programs.
	- Example: pairs of integers
		- Order the pairs of positive integers first by sum, then by first component: [1,1], [2,1], [1,2], [3,1], [2,2], [1,3], [4,1], [3,2], ..., [1,4], [5,1], ... 
		- $[i,j]$ <-> $f(i,j) = \frac{(i+j)(i+j-1)}{2} - i + 1 = \frac{(i+j-1)(i+j-2)}{2} + j$.
		
Enumerations: 

- An enumeration of a set is a 1-1 correspondence between the set and the positive integers.
- Thus, we have seen enumerations for strings, programs, proofs, and pairs of integers.

Set of all languages over some fixed alphabet:

- Are the languages over $\lbrace 0,1 \rbrace$ countable?
- No. Proof by Diagonalization. (a table of $m$ strings $\times$ $n$ languages)
	- Suppose we could enumerate all languages over $\lbrace 0,1 \rbrace$ and talk about "the $i^{th}$ language."
	- Consider the language $L = \lbrace w \vert w \text{ is the } i^{th} \text{ binary string and } w \text{ is not in the } i^{th} \text{ language } \rbrace$.
	- Clearly, $L$ is a language over $\lbrace 0,1 \rbrace$.
	- Thus, it is the $j^{th}$ language for some particular $j$.
	- Let $x$ be the $j^{th}$ string. Is $x$ in $L$?
		- If so, $x$ is not in $L$ by definition of $L$.
		- If not, then $x$ is in $L$ by definition of $L$.
	- We have a contradiction: $x$ is neither in $L$ nor not in $L$, so our sole assumption (that there was an enumeration of the languages) is wrong.
- Comment: This is really bad; there are more languages than programs.

Turing-Machine Theory:

- One important purpose of the theory of Turing machines is to prove that certain specific languages have no membership algorithm.
- The first step is to prove certain languages about Turing machines themselves have no membership algorithm.
- Reductions are used to prove more common questions undecidable.

Picture of a Turing Machine:

- Finite number of _**states**_.
- Infinite _**tape**_ with cells containing tape _**symbols**_ chosen from a finite alphabet.
	- Tape head: always points to one of the tape cells.
- _**Action**_: based on the state and the tape symbol under the head, 
	- change state, 
	- overwrite the current symbol or 
	- move the head one cell left or right.
	
Why Turing Machines?

- Question: Why not represent computation by C programs or something like that?
- Answer: 
	- You can develop a theory about programs without using Turing machines, but it is easier to prove things about TM’s, because they are so simple.
	- And yet they are as powerful as any computer.
		- More so (i.e. more powerful than any computer), in fact, since they have infinite memory.
			- Computers always have a finite amount of storage, however large that may be. But this difference is not that essential, since in principle, we could always buy more storage for a computer.
			- A good counter argument is the universe is finite so where are you going to get the atoms from which to build all of those discs? But even if you accept that the universe is finite, the limitation doesn't seem to be effecting what we can compute in practice. So we are not going to argue that a computer is weaker than a Turing machine in a meaningful way.
			
Turing-Machine Formalism:

- A TM is described by: 
	1. A finite set of _**states**_ => $Q$, typically 
	1. An _**input alphabet**_ => $\Sigma$, typically
		- symbol 和 alphabet 的关系是 $\text{symbol} \in \text{alphabet}$
	1. A _**tape alphabet**_ => $\Gamma$, typically; $\Sigma \subseteq \Gamma$
	1. A _**transition function**_ => $\delta$, typically
	1. A _**start state**_ => $q_0 \in Q$, typically 
	1. A _**blank symbol**_ => $B \in \Gamma \setminus \Sigma$, typically 
		- All tape except for the input is blank initially. 
		- $B$ is never an input symbol.
	1. A set of _**final states**_ => $F \subseteq Q$, typically
- Conventions:
	- $a, b, \dots$ are input symbols.
	- $\dots, X, Y, Z$ are tape symbols.
	- $\dots, w, x, y, z$ are strings of input symbols.
	- $\alpha, \beta, \dots$ are strings of tape symbols.
- The Transition Function:
	- Takes two arguments:
		1. Current state $q \in Q$.
		1. Current tape symbol $Z \in \Gamma$.
	- $\delta(q, Z)$ is either undefined or a triple of the form $(p, Y, D)$.
		- $p$ is a state.
		- $Y$ is the new tape symbol (to replace the current symbol on the tape head).
		- $D$ is a direction, $L$ or $R$.
		
TM Example:

- Description:
	- This TM scans its input (all binary bits) left to right, looking for a 1. 
	- If it finds 1, it changes it to a 0, goes to final state $f$, and halts. 
	- If it reaches a blank, it changes it to a 1 and moves left.
- Formalism:
	- States $Q = \lbrace q \text{ (start)}, f \text{ (final)} \rbrace$.
	- Input symbols $\Sigma = \lbrace 0, 1 \rbrace$.
	- Tape symbols $\Gamma = \lbrace 0, 1, B \rbrace$.
	- $\delta(q, 0) = (q, 0, R)$.
	- $\delta(q, 1) = (f, 0, R)$.
	- $\delta(q, B) = (q, 1, L)$.
- Example tape: $BB00BB$; starts from the first 0
	- $BB\color{red}{0}0BB$, $(q, 0)$ => $(q, 0, R)$, move right
	- $BB0\color{red}{0}BB$, $(q, 0)$ => $(q, 0, R)$, move right
	- $BB00\color{red}{B}B$, $(q, B)$ => $(q, 1, L)$, move left
	- $BB0\color{red}{0}1B$, $(q, 0)$ => $(q, 0, R)$, move right
	- $BB00\color{red}{1}B$, $(q, 1)$ => $(f, 0, R)$, move right
	- $BB000\color{red}{B}$, no transition defined, halt.

Instantaneous Descriptions of a Turing Machine:

- Initially, a TM has a tape consisting of a string of input symbols surrounded by an infinity of blanks in both directions.
- The TM is in the start state, and the head is at the leftmost input symbol.
- TM ID’s: (我觉得更合适的名字应该叫 TM State ID)
	- An ID is a string $\alpha q \beta$, where 
		- $\alpha = $ string from the leftmost nonblank to tape head (exclusive)
		- $\beta = $ string from the tape head (inclusive) to the rightmost nonblanks. 
			- I.e. the symbol to the right of $q$ is the one being scanned. 
		- If an ID is in the form of $\alpha q$, it is scanning a $B$. 
	- As for PDA’s (Pushdown automaton) we may use symbols 
		- $ID_i \vdash ID_j$ to represent “$ID_i$ becomes $ID_j$ in one move” and 
		- $ID_i \vdash^{\star} ID_j$ to represent “$ID_i$ becomes $ID_j$ in zero or more moves,”。
	- Example: The moves of the previous TM are $q00 \vdash 0q0 \vdash 00q \vdash 0q01 \vdash 00q1 \vdash 000f$
- Formal Definition of Moves:
	1. If $\delta(q, Z) = (p, Y, R)$, then 
		- $\alpha qZ \beta \vdash \alpha Yp \beta$ 
		- If $Z$ is the blank $B$, then $\alpha q \vdash \alpha Yp$ 
	2. If $\delta(q, Z) = (p, Y, L)$, then 
		- For any $X$, $\alpha XqZ \beta \vdash \alpha pXY \beta$		
		- In addition, $qZ \beta \vdash pBY \beta$
		
Languages of a TM:

- There are actually two ways to define the language of a TM.
	- A TM defines a language by final state.
		- $L(M) = \lbrace w \vert q_0 w \vdash^{\star} I, \text{ where } I \text{ is an ID with a final state} \rbrace$. 
	- Or, a TM can accept a language by halting. 
		- $H(M) = \lbrace w \vert q_0 w \vdash^{\star} I, \text{ and there is no move possible from ID } I \rbrace$.
- Equivalence of Accepting and Halting
	1. If $L = L(M)$, then there is a TM $M’$ such that $L = H(M’)$.
	1. If $L = H(M)$, then there is a TM $M”$ such that $L = L(M”)$.
- Proof of 1: Final State -> Halting
	- Modify $M$ to become $M’$ as follows:
		1. For each final state of $M$, remove any moves, so $M’$ halts in that state.
		1. Avoid having $M’$ accidentally halt.
			- Introduce a new state $s$, which runs to the right forever; that is $\delta(s, X) = (s, X, R)$ for all symbols $X$.
			- If $q$ is not a final state, and $\delta(q, X)$ is undefined, let $\delta(q, X) = (s, X, R)$.
- Proof of 2: Halting -> Final State
	- Modify $M$ to become $M”$ as follows:
		1. Introduce a new state $f$, the only final state of $M”$.
		1. $f$ has no moves.
		1. If $\delta(q, X)$ is undefined for any state $q$ and symbol $X$, define it by $\delta(q, X) = (f, X, R)$.
		
Recursively Enumerable Languages:

- We now see that the classes of languages defined by TM’s using final state and halting are the same.
- This class of languages (that can be defined in both those ways) is called the recursively enumerable languages.
	- Why this name? The term actually predates the Turing machine and refers to another notion of computation of functions.
	
Recursive Languages:

- A proper subset of Recursively Enumerable Languages.
- An _**algorithm**_ formally is a TM accepting (a language) by final state that halts on any input regardless of whether that input is accepted or not.
	- 注意这里的逻辑，algorithm 是 TM 而不是 language.
- If $L = L(M)$ for some TM $M$ that is an algorithm, we say $L$ is a recursive language.
	- In other words, the language that is accepted by final state by some algorithm is a recursive language.
	- Why this name? Again, don’t ask; it is a term with a history.
- Example: Every CFL (Context-free language) is a recursive language.
	- By the CYK algorithm.
	
## Decidability @ [Automata](https://class.coursera.org/automata-003/lecture) by Jeff Ullman

Central Ideas:

- TMs can be enumerated, so we can talk about "the $i^{th}$ TM".
	- Thus possible to diagonalize over TMs, showing a language that cannot be the language of any TM.
- Establish the principle that a problem is really a language.
	- Therefore some specific problems do not have TMs.
	
Binary-Strings from TM’s:

- We shall restrict ourselves to TM’s with input alphabet $\lbrace 0, 1 \rbrace$.
- Assign positive integers to the three classes of elements involved in moves:
	1. States: $q_1$ (start state), $q_2$ (final state), $q_3$, etc. 
	1. Symbols: $X_1$ (0), $X_2$ (1), $X_3$ (blank), $X_4$, etc.
	1. Directions: $D_1$ (L) and $D_2$ (R).
- Suppose $\delta(q_i, X_j) = (q_k, X_l, D_m)$.
- Represent this rule by string $0^i10^j10^k10^l10^m$. ($0^n$ 表示 $n$ 个连续的 $0$)
	- Key point: since integers $i, j, \dots$ are all $> 0$, there cannot be two consecutive $1$’s in these strings.
- Represent a TM by concatenating the codes for each of its moves, separated by $11$ as punctuation.
	- That is: $\text{Code}_111\text{Code}_211\text{Code}_311\dots$
	- Note: if bianry string $i$ cannot be parsed as a TM, assume the $i^{th}$ TM accepts nothing.

Diagonalization:

- Table of Acceptance (denoted by $A$):
	- TM $i=1,2,3,\dots$ $\times$ String $j=1,2,3,\dots$
	- $A_{ij} = 0$ means the $i^{th}$ TM does not accept the $j^{th}$ string.
	- $A_{ij} = 1$ otherwise.
- Construct a 0/1 sequence $D=d_1 d_2 \dots$, where $d_i = \overline{A_{ii}}$
	- $D$ cannot be a row in $A$.
	- Question: Let’s suppose $w=10101010\dots$. What does it mean if $w$ appears in the $i^{th}$ row of the table $A$?
	- Answer: It means the $i^{th}$ TM exactly accepts the $1^{st}, 3^{rd}, 5^{th}, \dots$ binary strings.
- Let's give a name to this language--the diagonalization language $L_d = \lbrace w \vert w \text{ is the } i^{th} \text{ string, and the } i^{th} \text{ TM does not accept } w \rbrace$.
- We have shown that $L_d$ is not a recursively enumerable language; i.e., it has no TM.
	- There are no more TMs than integers.
	- $L_d$ exists but we cannot always tell whether a given binary string $w$ is in $L_d$.

Problems:

- Informally, a “problem” is a yes/no (the output) question about an infinite set of possible instances (the input).
	- Example: “Does graph G have a Hamilton cycle (cycle that touches each node exactly once)?
	- Each undirected graph is an instance of the “Hamilton-cycle problem.”
- Formally, a problem is a language.
	- Each string encodes some instance.
	- The string is in the language if and only if the answer to this instance of the problem is “yes.”
- Example: A Problem About Turing Machines
	- We can think of the language $L_d$ as a problem.
	- 如果 table $A$ 的 string 是 TM 自身的 binary string 的话，这个 problem 就成了 “Does this TM not accept its own code?”

Decidable Problems:

- A problem is _**decidable**_ if there is an algorithm to answer it.
	- Recall: An “algorithm,” formally, is a TM that halts on all inputs, accepted or not.
	- Put another way, “decidable problem” = “recursive language.”
- Otherwise, the problem is undecidable.

Bullseye Picture:

- 最中心的集合：Decidable problems = Recursive languages
- 外一圈：Recursively enumerable languages
	- Languages accepted by TMs with no guarantee that they will halt on inputs they never accept 
	- Recursively enumerable languages $\supset$ Recursive languages
- 最外层：Not recursively enumerable languages，比如 $L_d$
	- Languages that have no TM at all.
	- Recursively enumerable languages 的补集
	
Examples: Real-world Undecidable Problems

- Can a particular line of code in a program ever be executed?
- Is a given context-free grammar ambiguous?
- Do two given CFG’s generate the same language?

The Universal Language:

- An example of a recursively enumerable, but not recursive language
- We call it $L_u$, of a universal Turing machine, or call it Universal TM language. 
- UTM inputs include:
	- a binary string representing some TM $M$, and 
	- a binary string $w$ for $M$
- UTM accepts $\langle M,w \rangle$ if and only if $M$ accepts $w$.
- E.g. JVM
	- JVM takes a coded Java program and input for the program and executes the program on the input.

Designing the UTM:

- Inputs are of the form: $\text{Code--for--}M \, 111 \, w$
	- Note: A valid TM code never has $111$, so we can split $M$ from $w$.
	- The UTM must accept its input if and only if $M$ is a valid TM code and $M$ accepts $w$.
- UTM is a multi-tape machine:
	- Tape 1 holds the input $\text{Code--for--}M \, 111 \, w$
		- Tape 1 is never changed, i.e. never overwritten.
	- Tape 2 represents the current tape of $M$ during the simulation of $M$ with input $w$
	- Tape 3 holds the state of $M$.
- Step 1: The UTM checks that $M$ is a valid code for a TM.
	- E.g., all moves have five components, no two moves have the same state/symbol as first two components.
	- If $M$ is not valid, its language is empty, so the UTM immediately halts without accepting.
- Step 2: Assuming the code for $M$ is valid, the UTM next examines $M$ to see how many of its own tape cells it needs to represent one symbol of $M$.
	- How to do this: we discover the longest block of $0$s representing a tape symbol and add one cell to that for a marker (e.g. $\text{#}$) between symbols of $M$'s tape. 
	- Thus if say $X_7$ is the highest numbered symbol then we'll use 8 squares to represent one symbol of $M$. 
		- Symbol $X_i$ will be represented $i$ $0$s and $7-i$ blanks followed by a marker outside. 
		- For example, here's how we would represent $X_5$: $00000BB\text{#}$. 
- Step 3: Initialize Tape 2 to represent the tape of $M$ with input $w$, and initialize Tape 3 to hold the start state (always $q_1$ so it is represented by a single $0$).
- Step 4: Simulate $M$.
	- Look for a move on Tape 1 that matches the state on Tape 3 and the tape symbol under the head on Tape 2.
		- If we cannot find one then apparently $M$ halts without accepting $w$ so UTM does so as well.
	- If found, change the symbol and move the head on Tape 2 and change the State on Tape 3.
	- If $M$ accepts (i.e. halts), the UTM also accepts (i.e. halts).

**Proof** That $L_u$ is Recursively Enumerable (RE), but not Recursive:

- We designed a TM for $L_u$, so it is surely RE.
- Proof by contradiction: 
	- Suppose $L_u$ were recursive, which means we could design a UTM $U$ that always halted.
	- Then we could also design an algorithm for $L_d$, as follows.
		- Given input $w$, we can decide if $w \in L_d$ by the following steps.
			1. Check that $w$ is a valid TM code.
				- If not, then $w$'s language is empty, so $w \in L_d$.
			1. If valid, use the hypothetical algorithm to decide whether $w \, 111 \, w$ is $\in L_u$.
			1. If so, then $w \notin L_d$; else $w \in L_d$.
	- But we already know there is no algorithm for $L_d$.
	- Thus, our assumption that there was an algorithm for $L_u$ is wrong.
	- $L_u$ is RE, but not recursive.
	
这个证明需要好好解读与总结：

- 什么是 language? 
	- TM $M$ 的 language $L_M = \lbrace \text{tape (不算两端的 blank 区域)} \vert \text{TM 能从这个 tape 的起始点一直运行到一个 final state, i.e. halt} \rbrace$
	- Tape 的本质是什么？是 string 呀
	- 我们说 TM $M$ accepts a language，那么同样也可以说 TM $M$ accepts a string，然后所有 $M$ accept 的 string 构成了 $M$ 的 language
- 什么是 algorithm?
	- algorithm 是个 TM, which always halts on any input regardless of whether that input is accepted or not
		- always halts 是什么意思？你可以理解为 "always generate an output"
			- accept 输出 1
			- reject 输出 0
		- 明显，infinite loop 不可能是一个 algorithm
- 什么是 problem?
	- problem is a language
- TM accept a language => algorithm accepts a problem
	- 但是我们一般不这么说，因为我们常用的说法是 algorithm solves a problem
	- 反过来，a problem is solved by algorithm，也就相当于 "我们可以为 problem 这个 language 找到一个 always halt 的 TM，即找到一个 algorithm"
		- 能找到 algorithm 的 problem => Decidable Problem, i.e. Recursive language
		- 能找到 TM (但不保证是 algorithm) 的 problem => Recursively enumerable language
			- 能找到 TM，但确定不是 algorithm 的 problem => The Universal Language
		- 连 TM 都找不到的 problem => Not recursively enumerable language
- $w$ 的两面性
	- 如果 TM $M$ 的 binary string 是 $w$，那么
		1. $w$ 可以表示 TM $M$
		1. $w$ 可以表示一个 plain string
	- 那么我们可以同时有 "$w$ accepts $w$" 和 "$w$ is accepted by $w$" 这两种逻辑
- $L_d$ 的两种解读
	- 首先它是个 language，然后 language 可以看做一个集合；然后 problem 也是 language，所以也把 $L_d$ 抽象成一个问题描述
	- 貌似默认是把 Acceptance table $A$ 的 string 限定为 TM 的 binary string 的话（相当于是 $w \times w$ 这样的一张表），那么：
		- $L_d = \lbrace w \vert \text{TM } w \text{ does not accept string } w \rbrace$
			- 你理解为 string 的集合或者 TM 的集合都行，因为 $w$ 的两面性
			- 原来的定义是 $L_d = \lbrace w \vert w \text{ is the } i^{th} \text{ string, and the } i^{th} \text{ TM does not accept } w \rbrace$，请自行体会一下是不是可以这么理解
		- $L_d$ is a problem “Does this TM not accept its own code?”
- If $w$ is not a valid TM code:
	- 有点无赖地，我们把这样的 $w$ 看做一种特殊的 TM 
	- $w$'s language is empty
		- => $w$ accepts nothing
			- => $w$ cannot accept $w$
				- => $w \in L_d$ 
- $L_u$ 没有 algorithm 意味着什么？
	- 给定一个 $\langle M, w \rangle$，没有 algorithm 确定是否有 $M$ accepts $w$
	- 还是回到 "$w$ accepts $w$" 这个逻辑上，然后我们可以把 $\langle w, w \rangle$ 写成 $w \, 111 \, w$，所以针对这个输入，没有 algorithm 可以确定是否有 $w$ accepts $w$
	
## Extensions and properties of Turing machines @ [Automata](https://class.coursera.org/automata-003/lecture) by Jeff Ullman

### 17.1 Programming Tricks

Programming Trick: Multiple Tracks

- Enable us to leave markers on the tape so TM can find their way back to an important place.
- If there are $k$ tracks => Treat each symbol as a vector of size $k$
	- E.g. $k=3$. $\left( \begin{smallmatrix} 0 \newline 0 \newline 0 \end{smallmatrix} \right)$ represents symbol $0$; $\left( \begin{smallmatrix} B \newline B \newline B \end{smallmatrix} \right)$ represents blank; $\left( \begin{smallmatrix} X \newline Y \newline Z \end{smallmatrix} \right)$ represents symbol $[X,Y,Z]$
	
Programming Trick: Marking

- $k-1$ tracks for data; 1 track for marks
- Almost all tape cells hold blank in this mark track, but several hold special symbols (marks) that allow the TM to find particular places on the tape.
- E.g. $\left( \begin{smallmatrix} B & X & B \newline W & Y & Z \end{smallmatrix} \right)$ represents an unmarked $W$, a marked $Y$ and an unmarked $Z$ ($X$ is a mark)

Programming Trick: Caching in the State

- Treat state as a vector.
- First component is the “control state,” i.e. the orginal state
- Other components are used as a cache to hold values the TM needs to remember.

例子待续

### 17.2 Restrictions

Semi-infinite Tape: 待续

### 17.3 Extensions

Multitape TM:

- To simulate a $k$-Tape TM, use $2 \times k$ tracks ($2 \times k$ tracks 仍然视为一个 tape；$k$-Tape 是要有 $k$ 个 head 的)
- For every 2 tracks simulating 1 tape:
	- 1 track for tape data
	- 1 track for tape head (use mark $X$ to indicate the head position)
- 待续

Nondeterministic TM:

- Allow TM to have more than 1 choice of move at each step for any &lt;state, symbol&gt; pair.
	- Each choice is a &lt;state,symbol,direction&gt; triple, as for the deterministic TM.
- Simulating a NTM by a DTM: 待续
	
How a TM can simulate a &lt;name-value&gt; store (a storage system that allow us to associate any value with any name):

- Very large &lt;name-value&gt; stores => a significant factor in big-data world, like google's big table.
- 待续

### 17.4 Closure Properties of Recursive and RE Languages

待续

## Specific undecidable problems

Rice's theorem: tells us that almost every question we can ask about the recursively enumerable languae is undecidable.

Properties of Languages:

- Any set of languages is a _**property**_ of languages.
	- Example: The infiniteness property is the set of infinite languages.
	- If a language $L$ "has property infiniteness", it means "L \in \text{ property infiniteness}"
	- In what follows, we’ll focus on properties of RE languages, because we can’t represent other languages by TM’s.
- We shall think of a property as a problem about Turing machines.
	- 我们可以认为 property $P = \lbrace L \vert L \text{ has property } P \rbrace$。从这个角度看，property 是一个关于 languages 的 language；进一步，property 是一个 problem。
		- 这个 problem 可以描述为：Given a language, does it have property $P$?
		- 那尽然 property 是一个 problem，我们就可以说 "property is decidable/undecidable"
	- 又因为 $L$ 可以由 TM 产生，所以我们进一步定义：For any property $P$, we can define a language $L_P$, the set of binary strings for TM $M$ such that $L(M)$ has property $P$.
		- 简单说就是 $L(M) \in P \Rightarrow M \in L_P$
		- 我们可以把 $L_P$ 视为这样的一个 problem：Given a code for a TM, does it define a language with that property $P$?
- There are two (_**trivial**_) properties $P$ for which $L_P$ is decidable.
	1. The always-false property, which contains no RE languages.
		- E.g. "this language is not RE."
		- How do we decide this property? I.e. the algorithm for this property is: Given an input $ w $, ignore it and say no (reject).
		- Empty language is a RE language.
	1. The always-true property, which contains every RE language.
		- E.g. "this language is RE."
		- How do we decide this property? I.e. the algorithm for this property is: Given an input $ w $, ignore it and say yes (accept).
- Rice’s Theorem: For every other (i.e. non-trivial) property $P$, $L_P$ is undecidable.

Reductions:

- A reduction from language $ L $ to language $ L' $ is an algorithm (TM that always halts) that takes a string $ w $ and converts it to a string $ x $, with the property that: $ x $ is in $ L' $ if and only if $ w $ is in $ L $.
- The value of having such a reduction is that it tells us $L$ is no harder than $L'$, at least as far as decidability is concerned.
- TM’s as Transducers
	- We have regarded TM’s as acceptors of strings.
	- But we could just as well visualize TM’s as having an output tape, where a string is written prior to the TM halting.
- If we reduce $L$ to $L'$, and $L'$ is decidable, then the algorithm for $L$ + the algorithm of the reduction shows that $L$ is also decidable.
	- Normally used in the contrapositive (逆否命题).
	- If we know $L$ is not decidable, then $L'$ cannot be decidable.
- More powerful forms of reduction: if there is an algorithm for $L'$, then there is an algorithm for $L$.
	- E.g. we reduced $L_d$ to $L_u$
- More in NP-completeness discussion on Karp vs. Cook reductions
	- The simple reduction is called a Karp reduction.
	- More general kinds of reductions are called Cook reductions.
	
![][Reduction]

Proof of Rice’s Theorem

- Proof Skeleton
	- We shall show that for every nontrivial property $ P $ of the RE languages, $ L_P $ is undecidable.
	- We show how to reduce $ L_u $ to $ L_P $.
	- Since we know $ L_u $ is undecidable, it follows that $ L_P $ is also undecidable.
- The Reduction
	- The input to $L_u$, is a TM $ M $ and an input $ w $ for $M$. Then our reduction algorithm produces the code for a TM $ M' $.
	- Define property $ P = "M \text{ accepts } w" $.
		- Thus $L(M')$ has property $ P $ if and only if $ M $ accepts $ w $.
			- "$L(M')$ has property $ P $" 也就意味着 "$M'$ accepts a language with property $P$"
		- That is $M' \in L_P$ if and only if $\langle M,w \rangle \in L_u$.
	- $ M' $ has two tapes, used for:
		1. Simulates another TM $ M_L $ on $M'$'s own input, say $x$
			- The transducer (which in fact is $M$) does not deal with or see $x$
		1. Simulates $ M $ on $ w $.
			- Note: neither $ M $, $ M_L $, nor $ w $ is input to $ M' $.
	- Assume that the empty language $ \emptyset $ does not have property $ P $.
		- If it does, consider the complement of $ P $, say $Q$. $ \emptyset $ then has property $Q$.
		- If we could prove that $Q$ are undecidable, then $P$ must be undecidable. That is if $L_P$ were a recursive language, then so would be $L_Q$ since the recursive languages are closed under complementation.
	- Let $ L $ be any language with property $ P $, and let $ M_L $ be a TM that accepts $ L $.
- Design of $ M' $
	1. On the second tape, $ M' $ writes $ w $ and then simulate $ M $ on $ w $.
	1. If $ M $ accepts $ w $, then simulate $ M_L $ on the input $ x $ on the first tape.
	1. $ M' $ accepts its input $ x $ if and only if $ M_L $ accepts $ x $, i.e. $x \in L$.
		- If $M$ does not accept $w$, $M'$ never gets to the stage where it simulate $M_L$, and therefore $M'$ accept nothing.
		- In this case, $M'$ defines an empty language, which does not have property $ P $.
	1. Suppose $ M $ accepts $ w $.
		- Then $ M' $ simulates $ M_L $ and therefore accepts $ x $ if and only if $ x $ is in $ L $.
		- That is, $ L(M) = L $, $ L(M') $ has property $ P $, and $ M' \in L_P $.
	1. Suppose $ M $ does not accept $ w $.
		- Then $ M' $ never starts the simulation of $ M_L $, and never accepts its input $ x $.
		- Thus, $ L(M') = \emptyset $, and $ L(M') $ does not have property $ P $.
		- That is, $ M' \not \in L_P $.
	1. Thus, the algorithm that converts $ M $ and $ w $ to $ M' $ is a reduction of $ L_u $ to $ L_P $.
		- Thus, $ L_P $ is undecidable.
		
![][M_Prime]
![][Picture_of_Reduction]

-----

## Turing Machines @ [Erickson §6](http://jeffe.cs.illinois.edu/teaching/algorithms/notes/models/06-turing-machines.pdf)

### 6.1 Why Bother?

Admittedly, Turing machines are a terrible model for thinking about _**fast**_ computation; simple operations that take constant time in the standard random-access model can require arbitrarily many steps on a Turing machine. Worse, seemingly minor variations in the precise definition of “Turing machine” can have significant impact on problem complexity. As a simple example (which will make more sense later), we can reverse a string of n bits in $O(n)$ time using a two-tape Turing machine, but the same task provably requires $\Omega(n^2)$ time on a single-tape machine.

But here we are not interested in finding _**fast**_ algorithms, or indeed in finding algorithms at all, but rather in proving that some problems cannot be solved by _**any**_ computational means. Such a bold claim requires a formal definition of “computation” that is simple enough to support formal argument, but still powerful enough to describe arbitrary algorithms. Turing machines are ideal for this purpose. In particular, Turing machines are powerful enough to simulate other Turing machines, while still simple enough to let us build up this self-simulation from scratch, unlike more complex but efficient models like the standard random-access machine.

(Arguably, self-simulation is even simpler in Church’s $\lambda$-calculus, or in Schönfinkel and Curry’s combinator calculus, which is one of many reasons those models are more common in the design and analysis of programming languages than Turing machines. Those models much more abstract; in particular, they are harder to show equivalent to standard iterative models of computation.)

### 6.2 Formal Definitions

- Three distinct special states $\lbrace \text{start}, \text{accept}, \text{reject} \in Q \rbrace$.
- A transition function $\delta: (Q \setminus \lbrace \text{start}, \text{reject} \rbrace) \times \Gamma \rightarrow Q \times \Gamma \times \lbrace −1,+1 \rbrace$.

-----

## Turing Machines @ class

### Languages and UTM

Language:

- A language is a subset of $\lbrace 0,1 \rbrace^\star$ (actually it could be any subset of $\lbrace 0,1 \rbrace^\star$)
- A language $L$ is a set of "yes-instances"
	- $x$ is a "yes-instance" if $x \in L$ 
- Language $S$ is _**Turing-recognizable**_ (“recursively enumerable / r.e.”) if $\exists$ TM $M$, such that $\forall x$
	- $x \in S  \Rightarrow M $ accepts $x$
	- $x \not\in S  \Rightarrow M $ rejects $x$ or runs forever
- Language $S$ is _**Turing-decidable**_ (“recursive”) if $\exists$ TM $M$, such that $\forall x$
	- $x \in S  \Rightarrow M $ accepts $x$
	- $x \not\in S  \Rightarrow M $ rejects $x$
- If $M$ is a TM, define $L(M) = \lbrace x \vert M \text{ accepts } x \rbrace$

Programming conventions:

- Programming a TM for real is cruel!
- Describe a TM “program” in terms of tape modifications & head movements
- “Mark” cells on the tape (e.g., $a \rightarrow \acute{a}$)

E.g. TM algorithm for $ \text{Palindromes} = \lbrace x \vert x = reverse(x) \rbrace $:

1. “Mark” first char (e.g., $ O \rightarrow \emptyset$), remember that char in internal state
1. If char to the right is “marked” or blank, then accept; else scan right until blank or a “marked” char
1. If $ \text{prev char} \neq \text{remembered char} $, reject; else mark it
1. Scan left to leftmost unmarked char; if no more unmarked chars, accept; else repeat from step #1

Universal Machines:

- TMs can be encoded as strings (“code is data”)
	- Convention: every string encodes some TM
	- $\langle M \rangle$: encoding of a TM $M$
	- $\langle M,x \rangle$: encoding of a TM $M$ and a string $x$
- $ L_{acc} = \lbrace \langle M,x \rangle \vert M \text{ is a TM that accepts } x \rbrace $ is Turing-recognizable (RE)
	- $\exists \text{TM } U \text{ that accepts } \langle M,x \rangle \Leftrightarrow \langle M,x \rangle \in L_{acc}$
- The single TM that recognize $L_{acc}$ can simulate any TM $M$! Thus call it a "universal TM"

Design of Universal TM:

- On input $ \langle M,x \rangle $, use 3 tapes:
	- one for description of $M$
	- one for $M$'s work tape contents
	- one for $M$'s current state
- Transitions: $\langle \text{state, char, newstate, newchar, direction} \rangle$
- Legal to say “simulate execution of $ M $ on input $ x $” in our TM pseudocode!
	– If $ M $ halts on $ x $, the simulation will also halt
	– “Simulate execution of $ M $ on input $ x $ for $ t $ steps” also possible (always halts)
	- Can simulate $ t $ steps of a TM in $ O(t \log t) $ steps
	
### Diagonalization and Reduction
	
Diagonalization:

- $ L_{acc} = \lbrace \langle M,x \rangle \vert M \text{ is a TM that accepts } x \rbrace $ is not Turing-decidable (“recursive”)
	- Likewise, $ L_{halt} = \lbrace \langle M,x \rangle \vert M \text{ is a TM that halts } x \rbrace $ 
- 这里的 $L_{acc}$ 即前面 Jeff Ullman 的 $L_u$

Reductions:

- Motivation:
	- Let's not use diagonalization technique every time to prove something undecidable!
	- Instead, “reduce” one problem to another.
- What does "Alg decides lang" mean?
	- Language $L = \lbrace x \vert x \text{ is/satisfies blab blah blah} \rbrace$ is a collection of yes-instances.
		- An $x$ that is/satisfies "blab blah blah" is a yes-instance.
	- An algorithm is in nature a TM, so we can say "an algorithm $M$".
	- If we say "$M$ decides $L$", it means:
		- $L(M) = L$
		- Imagine $M$ as a function, 
			- The datatype of the parameter to $M$ is the the one of the elements of $L$. E.g.
				- if $L=\lbrace x \vert \dots \rbrace$, elements are $x$'s. Therefore the function signature is $M(x)$;
				- if $L=\lbrace \langle x,y \rangle \vert \dots \rbrace$, elements are $\langle x,y \rangle$'s. Therefore the function signature is $M(\langle x,y \rangle)$.
			- $M(x)=\text{yes}$ if $x$ is/satisfies "blab blah blah"
			- $M(x)=\text{no}$ otherwise
	- If we say "go find an algorithm for language", it means:
		- go find an $M$ such that $L(M) = L$
		- go find an $M$ such that $M(x)=\text{yes}$ if $x$ is/satisfies "blab blah blah"
- Definition:
	- We say $L_1 \leq_T L_2$ ("$L_1$ Turing-reduces to $L_2$") if there is an algorithm that decides $ L_1 $ using a (hypothetical) algorithm that decides $ L_2 $.
- Inference:
	- CASE 1: implication
		- Ground Truth: $L_2$ is decidable
		- Goal: To prove $L_1$ is also decidable
		- Method: Construct an algorithm $M_1$ for $L_1$ which satisfies $L_1 \leq_T L_2$
			- $L_2$ is decidable so there must exist an $M_2$ for $L_2$
			- Call $M_2$ inside $M_1$
			- In this way we prove that $L_1 \leq_T L_2$ holds.
	- CASE 2: contrapositive 
		- Ground Truth: $L_1$ is undecidable
		- Goal: To prove $L_2$ is also undecidable
		- Method: Assume $L_2$ is decidable. Under this assumption, show we can construct an algorithm $M_1$ for $L_1$ which satisfies $L_1 \leq_T L_2$, i.e. $L_1 \leq_T L_2$ holds.
			- In this way we imply that $L_1$ is decidable.
			- However, we already know that $L_1$ is undecidable.
			- Therefore the assumption is invalid.
- E.g. show that $L_{empty} = \lbrace \langle M \rangle \vert M \text{ is a TM and } L(M) = \emptyset \rbrace$ is undecidable.
	- Choose $ L_{acc} = \lbrace \langle M,x \rangle \vert M \text{ is a TM that accepts } x \rbrace $ as $L_1$
	- $L_{empty}$ is $L_2$. 
		- Assume there exists an algorithm $M_{empty}$.
	- Construct an algorithm $M_{acc}$ using $M_{empty}$:
		- Signature: $M_{acc}(\langle M,x \rangle)$
		- For every single pair of input $\langle M_i,x_j \rangle$: 
			- Construct an TM $M_{ij}^{\star}(z) = \lbrace \text{ignore } z; \text{return } M_i(x_j) \rbrace$
				- 根据 $ L_{acc} $ 的语义，$ M_i $ 要么 accept $ x_j $，要么 reject
				- CASE 1: If $ M_i $ accepts $ x_j $, $M_i(x_j)=\text{yes}$.
					- Therefore $M_{ij}^{\star}(z) = \lbrace \text{ignore } z; \text{return yes} \rbrace$. 
					- I.e. $M_{ij}^{\star}$ accept every $z$.
					- I.e. $M_{ij}^{\star}$ accept everything.
					- I.e. $L(M_{ij}^{\star}) = \Omega$ (全集)
					- I.e. $\langle M_{ij}^{\star} \rangle \not \in L_{empty}$.
					- I.e. $M_{empty}(\langle M_{ij}^{\star} \rangle) = \text{no}$.
				- CASE 2: If $ M_i $ rejects $ x_j $, $M_i(x_j)=\text{no}$.
					- Therefore $M_{ij}^{\star}(z) = \lbrace \text{ignore } z; \text{return no} \rbrace$. 
					- I.e. $M_{ij}^{\star}$ rejects every $z$.
					- I.e. $M_{ij}^{\star}$ accept nothing.
					- I.e. $L(M_{ij}^{\star}) = \emptyset$
					- I.e. $\langle M_{ij}^{\star} \rangle \in L_{empty}$.
					- I.e. $M_{empty}(\langle M_{ij}^{\star} \rangle) = \text{yes}$.
			- If $M_{empty}(\langle M_{ij}^{\star} \rangle) = \text{yes}$
				- I.e. $\langle M_{ij}^{\star} \rangle \in L_{empty}$
				- 一路反推到 CASE 2，我们有 $ M_i $ rejects $ x_j $
				- 此时我们的 $M_{acc}(\langle M_i,x_j \rangle)$ 要 return no
			- If $M_{empty}(\langle M_{ij}^{\star} \rangle) = \text{no}$
				- I.e. $\langle M_{ij}^{\star} \rangle \not \in L_{empty}$
				- 一路反推到 CASE 1，我们有 $ M_i $ accepts $ x_j $
				- 此时我们的 $M_{acc}(\langle M_i,x_j \rangle)$ 要 return yes
	- Now we showed $L_{acc} \leq_T L_{empty}$. We assumed $L_{empty}$ is decidable, so $L_{acc}$ is also decidable, which is against the truth. Therefore the assumption is invalid and $L_{empty}$ is undecidable.
	- 最难的地方在 "Construct an algorithm $M_{acc}$ using $M_{empty}$" 这一步，请结合 $M_{acc}$ 和 $M_{empty}$ 综合考虑。一般的的套路是：
		- 根据 $L_1$ 的输入做一个临时变量，然后把这个临时变量当做 $L_2$ 的输入。
			- 这个临时变量要满足 $M_2$ 的 signature
			- 如果临时变量是一个 TM，比如上面的 $M_{ij}^{\star}$，在处理自身的输入 $z$ 时要见机行事
				- 如果能直接 $\text{return }M_i(x_j)$ 或者 $\text{return }!M_i(x_j)$ 无疑是最好的
				- 如果不能，考虑 $\text{if } M_i(x_j) = \text{yes}, \text{return } function(z)$ 这样的形式
		- 然后根据 $L_2$ 的输出决定 $L_1$ 的输出。

<pre class="prettyprint linenums">
// Reduce L_acc to L_empty
M_acc(&lt;M_i,x_j&gt;) {
	M*_ij = TurningMachine(z) {
		return M_i(x_j)
	}
	
	return !M_empty(M*_ij)
}

// General form of reduction algorithm for L_acc
M_acc(&lt;M_i,x_j&gt;) {
	M*_ij = TurningMachine(z) {
		if(M_i(x_j) = yes) {
			return f_1(z)
		} else {
			return f_2(z)
		}
	}
	
	return f_3(M_2(M*_ij))
}
</pre>

### Rice's Theorem

Rice's Theorem: 待补充。$L_{acc} \leq_T L_P$ 的证明很精彩

### Kolmogorov Complexity (or, “optimal compression is hard!”) @ [Algorithmic Information Theory and Kolmogorov Complexity](http://www.lirmm.fr/~ashen/uppsala-notes.pdf)

Problem: 

- 假设 compress $x$ 得到 $y$，decompress $y$ 得到 $x$
- 假设有一个 decompression algorithm $U$ that $U(y)=x$
- $K_U(x) = \min \lbrace \lvert y \rvert \vert U(y)=x \rbrace$
	- How small $x$ can be compressed?
	- Here $ \lvert y \rvert $ denotes the length of a binary string $ y $
- In other words, the _**complexity**_ of $x$ is defined as the length of the shortest description of $x$ if each binary string $y$ is considered as a description of $U(y)$

Optimal decompression algorithm:

- The definition of $K_U$ depends on $U$. 
- For the trivial decompression algorithm $U(y) = y$ we have $K_U(x) = \vert x \vert$. 
- One can try to find better decompression algorithms, where “better” means “giving smaller complexities”

_**Definition 1**_ An algorithm $ U $ is _**asymptotically not worse**_ than an algorithm $ V $ if $ K_U(x) \leq K_V(x)+C $ for some constant $ C $ and for all $ x $.

_**Theorem 1**_ There exists an decompression algorithm $ U $ which is asymptotically not worse than any other algorithm $ V $.

Such an algorithm is called _**asymptotically optimal**_ one. 

- The complexity $ K_U $ with respect to an asymptotically optimal $ U $ is called _**Kolmogorov complexity**_.
- Assume that some asymptotically optimal decompression algorithm $U$ is fixed, the Kolmogorov complexity of a string $ x $ is denoted by $ K(x) $ ($=K_U(x)$).
	- The complexity $ K(x) $ can be interpreted as the amount of information in $ x $ or the “compressed size” of $ x $.
	
The construction of optimal decompression algorithm:

- The idea of the construction is used in the so-called “self-extracting archives”. Assume that we want to send a compressed version of some file to our friend, but we are not sure he has the decompression program. What to do? Of course, we can send the program together with the compressed file. Or we can append the compressed file to the end of the program and get an executable file which will be applied to its own contents during the execution.
- 待补充。

Basic properties of Kolmogorov complexity:

- 待补充。

Algorithmic properties of $ K $

- 结合 Berry Paradox 补充

Complexity and incompleteness:

- 不懂

Algorithmic properties of $ K $ (continued):

- 不懂

An encodings-free definition of complexity:

- 不懂

Axioms of complexity:

- 不懂

### Time/space complexity classes: P & NP @ class

Resource bounds:

- $M$ has (worst case) running time $ T $ if $\forall$ string $x$, $M$ halts after at most $T(\vert x \vert)$ steps.
- $M$ has (worst case) space usage $ S $ if $\forall$ string $x$, $M$ writes on at most $S(\vert x \vert)$ tape cells.

Basic Complexity Class:

- $ DTIME(f(n)) = \lbrace L \vert L \text{ decided by a (deterministic) TM with running time } O(f(n)) \rbrace $
	- D for "deterministic"
	- Formally, $ L \in TIME(f(n)) $ if there is a TM $M$ and a constant $c$ such that 
		1. $M$ decides $L$, and 
		1. $M$ runs in time $c \cdot f$; 
			- i.e., for all $x$ (of length at least 1), $M(x)$ halts in at most $c \cdot f(\lvert x \rvert) $ steps.
	- E.g. $ DTIME(n^2) = \text{set of all problems that can be solved in quadratic time}$
- $ DSPACE(f(n)) = \lbrace L \vert L \text{ decided by a TM that uses spaces } O(f(n)) \rbrace $
- Language / decision problem = set of strings (yes-instances)
- Complexity class = set of languages

Standard Complexity Classes:

- $P = \text{set of problems that can be solved (by a deterministical TM) in poly time} = \bigcup_{k=1,2,\dots} DTIME(n^k)$ 
	- 如果把 $P$ 看做 property 的话，$P$ 可以简单描述为 "deterministic poly time"
		- "deterministic" = "deterministically solvable in time" = "solvable in time by a deterministical TM"
- $PSPACE = \text{set of problems that can be solved using poly space} = \bigcup_{k=1,2,\dots} DSPACE(n^k)$ 
- $EXP = \text{set of problems that can be solved by in exponential time} = \bigcup_{k=1,2,\dots} DTIME(2^{n^k})$ 
- $L = \text{set of problems that can be solved using log space} = DSPACE(\log n)$ 

Translating from “Complexity Theory Speak”:

- Is $X \in PSPACE$?
	- Can problem $ X $ be solved using polynomial space?
- Is $PSPACE \subseteq P$?
	- Can every problem solvable in polynomial space also be solved in polynomial time?
- This is true: $P \subseteq PSPACE$

Relationships between Complexity Classes:

- $\forall f(n), DTIME(f(n)) \subseteq DSPACE(f(n))$
	- This follows from the observation that a TM cannot write on more than a constant number of cells per move.
- If $f(n) = O(g(n))$, then $DTIME(f(n)) subseteq DTIME(g(n))$

Complementation @ [Complement Classes and the Polynomial Time Hierarchy](http://cs.brown.edu/courses/cs159/lect.06.Hierarchy.pdf):

- 这里先声明下，全集可以表示为 $\Omega$、$\sum^{\star}$ 或者 $\lbrace 0,1 \rbrace^{\star}$
- The complement of a decision problem $ \mathcal{L} $, denoted $co\mathcal{L}$, is the set of “No”-instances of $ \mathcal{L} $.
	- 一般来说，我们可以认为 $co\mathcal{L} = \overline{\mathcal{L}} = \Omega \setminus \mathcal{L}$
	- 严格来说，$\mathcal{L} \cup co\mathcal{L} = WF_{\mathcal{L}} \subseteq \Omega $ where $WF_{\mathcal{L}}$ is the set of _**well-formed strings**_ describing “Yes” and “No” instances. That is, $ co\mathcal{L} = WF_{\mathcal{L}} − \mathcal{L} $.
		- 只是通常会限定 $WF_{\mathcal{L}} = \Omega$
	- 举个例子:Every positive integer $x>1$ is either composite (合数) or prime (质数)
		- 如果限定 $ \Omega = WF_{\mathcal{L}} = \lbrace x \vert x \text{ is a positive integer and } x > 1 \rbrace $
			- $ \mathcal{L} = \lbrace x \vert x \text{ is prime } \rbrace$
			- $ co\mathcal{L} = \overline{\mathcal{L}} = \lbrace x \vert x \text{ is not prime }\rbrace = \lbrace x \vert x \text{ is composite }\rbrace$
		- 如果仅限定 $ \Omega = WF_{\mathcal{L}} = \lbrace x \vert x \text{ is a positive integer }\rbrace $
			- $ co\mathcal{L} = \overline{\mathcal{L}} = \lbrace x \vert x \text{ is not prime }\rbrace \neq \lbrace x \vert x \text{ is composite }\rbrace$
			- 因为 1 既不是 prime 也不是 composite
- The complement of a complexity class is the set of complements of languages in the class.
	- $\mathcal{C} = \lbrace \mathcal{L} \vert \mathcal{L} \text{ has complexity } \mathcal{C} \rbrace$
	- $co\mathcal{C} = \lbrace co\mathcal{L} \vert \mathcal{L} \in \mathcal{C} \rbrace $
	- 注意 $co\mathcal{C}$ 和 $\overline{\mathcal{C}}$ 没有半毛钱的关系
		- $\overline{\mathcal{C}} = \lbrace \mathcal{L} \vert \mathcal{L} \text{ does NOT have complexity } \mathcal{C} \rbrace$
		- $co\mathcal{C} = \lbrace \mathcal{L} \vert \mathcal{L} \text{'s complement has complexity } \mathcal{C} \rbrace$
			- $\mathcal{L} \text{'s complement has complexity } \mathcal{C}$ 并不能说明 $\mathcal{L} \text{ has } \mathcal{C} \text{ or not}$
- _**Theorem 1.**_ $\mathcal{C}_1 \subseteq \mathcal{C}_2 \hspace{1em} \Rightarrow  \hspace{1em} co\mathcal{C}_1 \subseteq co\mathcal{C}_2 $
- _**Theorem 2.**_ $\mathcal{C}_1 = \mathcal{C}_2 \hspace{1em} \Rightarrow  \hspace{1em} co\mathcal{C}_1 = co\mathcal{C}_2 $
- Closure under complementation means: $\mathcal{C} = co\mathcal{C}$
	- We say such class $\mathcal{C}$ are "closed under complementation".
- _**Theorem 3.**_ If $\mathcal{C}$ is a deterministic time or space complexity class, then $\mathcal{C} = co\mathcal{C}$.
	- E.g. 
		- $coTIME(f(n)) = TIME(f(n))$
		- $coP = P$
			-  翻译一下：如果 $\mathcal{L}$ can be solved by in poly time $\Rightarrow$ $co\mathcal{L}$ can also be solved by in poly time
			- vise versa
		- $coPSPACE = PSPACE$
	- Why? For any class $\mathcal{C}$ defined by a deterministic TM $M$, just switch accpet/reject behavior and you get a TM $coM$ that decide $co\mathcal{C}$
		- i.e. $ M(\mathcal{L}) = \text{yes} \hspace{1em} \Rightarrow \hspace{1em} coM(co\mathcal{L}) = \text{yes}$, in the same bound of time or space.

$NP$:

- $NP$ 可以描述为 nondeterministic polynomial time
	- "nondeterministic" = "nondeterministically solvable in time" = "solvable in time by a nondeterministical TM"
- _**Definition 1.**_ A problem is assigned to the $NP$ class if it is solvable in polynomial time by a nondeterministic TM.
	- $NP = \text{set of problems that can be solved by a nondeterministic TM in poly time}$
- _**Definition 2.**_ $NP = \text{set of decision problems } L $, where
	- $L = \lbrace x \vert \exists w : M(x,w) = 1 \rbrace$
	- $M$ halts in polynomial time, as a function of $ \lvert x \rvert $ alone.
	- $x$: instance
	- $w$: proof / witness / solution
	- 简单理解就是，我们没有办法直接确定是否有 $x \in L$ (nondeterministic)，只能通过 $(x,w)$ 是否满足 $L$ 的条件来判断这个 $x$ 是否有 $\in L$
- 举例待补充
	
$coNP$
	
- _**Definition.**_ $coNP = \text{set of decision problems } L $, where
	- $L = \lbrace x \vert \not\exists w : M(x,w) = 1 \rbrace$
	- 等价于 $L = \lbrace x \vert \forall w : M(x,w) = 0 \rbrace$
	- 等价于 $L = \lbrace x \vert \forall w : M(x,w) = 1 \rbrace$
	- $M$ halts in polynomial time, as a function of $ \lvert x \rvert $ alone.
- 举例待补充	

$P$ vs $NP$ vs $coNP$

- _**Theorem 1.**_ $ P \subseteq NP $
- _**Theorem 2.**_ $ P \subseteq coNP $
- 证明待补充

Closure Properties of $NP$, $coNP$

- 待补充
				
-----

- [Tim Gowers - Computational Complexity and Quantum Compuation](http://www.sms.cam.ac.uk/collection/545358;jsessionid=53925A3FEE89D7505565619066A413C8)
- [Lecture 23: Computational Complexity](http://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-006-introduction-to-algorithms-fall-2011/lecture-videos/lecture-23-computational-complexity/)