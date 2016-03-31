---
layout: post-mathjax
title: "Computational Complexity Review"
description: ""
category: Math
tags: []
---
{% include JB/setup %}

## Turing Machines @ [Automata](https://class.coursera.org/automata-003/lecture) by Jeff Ullman

Questions:

- How to show that certain tasks are impossible, or in some cases, possible but intractable--that is, they can be solved but only by very slow algorithms?
- What can be solved by computer algorithms?

Turing machine:

- In some sense a ultimate automaton.
- A formal computing model that can compute anything we can do with computer or with any other realistic model that we might think of as computing.
- TMs define the class of recursively innumerable languages which thus the largest class of languages about which we can compute anything.
	- There is another smaller class called recursive languages that can be thought of as modeling algorithms--computer programs that answer a particular question and then finish.
	
Data types:

- int, float, string, etc.
- But at another level, there is only one type--string of bit.
	- It is more convenient to think of binary strings as integers. 
- Programs are also strings and thus strings of bits.
	- The fact that programs and data are at heart the same thing is what let us build a powerful theory about what is not computable.
	
The $i^{th}$ "data":

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
	
-----

- [Tim Gowers - Computational Complexity and Quantum Compuation](http://www.sms.cam.ac.uk/collection/545358;jsessionid=53925A3FEE89D7505565619066A413C8)
- [Lecture 23: Computational Complexity](http://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-006-introduction-to-algorithms-fall-2011/lecture-videos/lecture-23-computational-complexity/)