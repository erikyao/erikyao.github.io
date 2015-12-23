---
layout: post-mathjax
title: "Digest of <i>Advanced R</i>"
description: ""
category: R
tags: [Book, Rcpp]
---
{% include JB/setup %}

[curve-demo-1]: https://farm6.staticflickr.com/5650/23292343704_0917e5ef3b_o_d.png
[lapply]: https://farm2.staticflickr.com/1625/23920545705_e466826c92_o_d.png
[roll-mean-1]: https://farm6.staticflickr.com/5808/23812247222_c884f5ff53_o_d.png
[search-path]: https://farm6.staticflickr.com/5806/23552708399_86ce622bb0_o_d.png

## ToC

- Part I. Foundations
	- [1. Data structures](#1--Data-structures)
		- [1.1 Quiz](#1-1-Quiz)
		- [1.2 Atomic Vectors](#1-2-Atomic-Vectors)
		- [1.3 Lists](#1-3-Lists)
		- [1.4 Attributes](#1-4-Attributes)
		- [1.5 Factors](#1-5-Factors)
		- [1.6 Matrices and arrays](#1-6-Matrices-and-arrays)
		- [1.7 Data frames](#1-7-Data-frames)
	- [2. Subsetting](#2--Subsetting)
		- [2.1 Quiz](#2-1-Quiz)
		- [2.2 Subsetting operator <code>[]</code>](#2-2-Subsetting-operator-)
			- [2.2.1 Subsetting atomic vectors](#2-2-1-Subsetting-atomic-vectors)
			- [2.2.2 Subsetting lists](#2-2-2-Subsetting-lists)
			- [2.2.3 Subsetting matrices and arrays](#2-2-3-Subsetting-matrices-and-arrays)
			- [2.2.4 Subsetting data frames](#2-2-4-Subsetting-data-frames)
		- [2.3 Subsetting operator <code>[[]]</code>](#2-3-Subsetting-operator-)
			- [Simplifying vs. preserving subsetting](#Simplifying-vs--preserving-subsetting)
			- [How does it simplify?](#How-does-it-simplify)
			- [Out-of-bound indices](#Out-of-bound-indices)
		- [2.4 Subsetting operator `$`](#2-4-Subsetting-operator-)
		- [2.5 Subsetting S3 and S4 objects](#2-5-Subsetting-S3-and-S4-objects)
		- [2.6 Subsetting and assignment](#2-6-Subsetting-and-assignment)
		- [2.7 Applications](#2-7-Applications)
			- [Lookup tables (character subsetting)](#Lookup-tables-character-subsetting)
			- [Random samples/bootstrap (integer subsetting)](#Random-samples-bootstrap-integer-subsetting)
			- [Expanding aggregated counts (integer subsetting)](#Expanding-aggregated-counts-integer-subsetting)
	- [3. Functions](#3--Functions)
		- [3.1 Function components](#3-1-Function-components)
			- [Exception: Primitive functions](#Exception-Primitive-functions)
		- [3.2 Lexical scoping](#3-2-Lexical-scoping)
			- [3.2.1 Name Masking](#3-2-1-Name-Masking)
			- [3.2.2 Functions vs. variables](#3-2-2-Functions-vs--variables)
			- [3.2.3 A fresh start](#3-2-3-A-fresh-start)
			- [3.2.4 Dynamic lookup](#3-2-4-Dynamic-lookup)
		- [3.3 Every operation is a function call](#3-3-Every-operation-is-a-function-call)
		- [3.4 Function arguments](#3-4-Function-arguments)
			- [3.4.1 Calling functions](#3-4-1-Calling-functions)
			- [3.4.2 Calling a function given a list of arguments](#3-4-2-Calling-a-function-given-a-list-of-arguments)
			- [3.4.3 Default and missing arguments](#3-4-3-Default-and-missing-arguments)
			- [3.4.4 Lazy evaluation](#3-4-4-Lazy-evaluation)
			- [3.4.5 Variable argument list `...`](#3-4-5-Variable-argument-list----)
		- [3.5 Special calls](#3-5-Special-calls)
			- [3.5.1 Infix functions](#3-5-1-Infix-functions)
			- [3.5.2 Replacement functions](#3-5-2-Replacement-functions)
		- [3.6 Return values](#3-6-Return-values)
			- [3.6.1 Invisible](#3-6-1-Invisible)
			- [3.6.2 On exit](#3-6-2-On-exit)
	- [4. OO field guide](#4--OO-field-guide)
		- [4.1 Quiz](#4-1-Quiz)
		- [4.2 Base types](#4-2-Base-types)
		- [4.3 S3](#4-3-S3)
			- [4.3.1 Recognising objects, generic functions, and methods](#4-3-1-Recognising-objects-generic-functions-and-methods)
			- [4.3.2 Defining classes and creating objects](#4-3-2-Defining-classes-and-creating-objects)
			- [4.3.3 Creating new methods and generics](#4-3-3-Creating-new-methods-and-generics)
		- [4.4 S4](#4-4-S4)
			- [4.4.1 Recognising objects, generic functions, and methods](#4-4-1-Recognising-objects-generic-functions-and-methods)
			- [4.4.2 Defining classes and creating objects](#4-4-2-Defining-classes-and-creating-objects)
			- [4.4.3 Creating new methods and generics](#4-4-3-Creating-new-methods-and-generics)
		- [4.5 RC](#4-5-RC)
			- [4.5.1 Defining classes and creating objects](#4-5-1-Defining-classes-and-creating-objects)
			- [4.5.2 Recognising objects and methods](#4-5-2-Recognising-objects-and-methods)
			- [4.5.3 Method dispatch](#4-5-3-Method-dispatch)
		- [4.6 Picking a system](#4-6-Picking-a-system)
	- [5. Environments](#5--Environments)
		- [5.1 Quiz](#5-1-Quiz)
		- [5.2 Environment basics](#5-2-Environment-basics)
		- [5.3 Recursing over environments](#5-3-Recursing-over-environments)
		- [5.4 Function environments](#5-4-Function-environments)
			- [5.4.1 The enclosing environment](#5-4-1-The-enclosing-environment)
			- [5.4.2 Binding environments](#5-4-2-Binding-environments)
			- [5.4.3 Execution environments](#5-4-3-Execution-environments)
			- [5.4.4 Calling environments](#5-4-4-Calling-environments)
			- [5.4.5 Summary](#5-4-5-Summary)
		- [5.5 Binding names to values](#5-5-Binding-names-to-values)
		- [5.6 Using environments explicitly](#5-6-Using-environments-explicitly)
			- [5.6.1 Avoiding copies](#5-6-1-Avoiding-copies)
			- [5.6.2 Package state](#5-6-2-Package-state)
			- [5.6.3 As a hashmap](#5-6-3-As-a-hashmap)
	- [6. Debugging, condition handling, and defensive programming](#6--Debugging-condition-handling-and-defensive-programming)
		- [6.1 Condition handling](#6-1-Condition-handling)
			- [6.1.1 Ignore errors with a single `try()`](#6-1-1-Ignore-errors-with-a-single-try)
			- [6.1.2 Handle conditions with `tryCatch()`](#6-1-2-Handle-conditions-with-tryCatch)
		- [6.2 Defensive programming](#6-2-Defensive-programming)
- Part II. Functional programming
	- [7. Functional programming](#7--Functional-programming)
		- [7.1 Anonymous functions](#7-1-Anonymous-functions)
		- [7.2 Closures](#7-2-Closures)
		- [7.3 Mutable state](#7-3-Mutable-state)
		- [7.4 Lists of functions](#7-4-Lists-of-functions)
	- [8. Functionals](#8--Functionals)
		- [8.1 My first functional: `lapply()`](#8-1-My-first-functional-lapply)
			- [Looping patterns](#Looping-patterns)
			- [Digress: parameter order](#Digress-parameter-order)
		- [8.2 For loop functionals: friends of `lapply()`](#8-2-For-loop-functionals-friends-of-lapply)
			- [8.2.1 Vector output: `sapply()` and `vapply()`](#8-2-1-Vector-output-sapply-and-vapply)
			- [8.2.2 Multiple inputs: Map (and `mapply()`)](#8-2-2-Multiple-inputs-Map-and-mapply)
			- [8.2.3 Rolling computations](#8-2-3-Rolling-computations)
			- [8.2.4 Parallelisation](#8-2-4-Parallelisation)
		- [8.3 Manipulating matrices and data frames](#8-3-Manipulating-matrices-and-data-frames)
			- [8.3.1 Matrix and array operations](#8-3-1-Matrix-and-array-operations)
			- [8.3.2 Group apply](#8-3-2-Group-apply)
			- [8.3.3 The `plyr` package](#8-3-3-The-plyr-package)
		- [8.4 Manipulating lists](#8-4-Manipulating-lists)
			- [8.4.1 `Reduce()`](#8-4-1-Reduce)
			- [8.4.2 Predicate functionals](#8-4-2-Predicate-functionals)
		- [8.5 Mathematical functionals](#8-5-Mathematical-functionals)
		- [8.6 Loops that should be left as is](#8-6-Loops-that-should-be-left-as-is)
	- [9. Function operators (FOs)](#9--Function-operators-FOs)
		- [9.1 Behavioural FOs](#9-1-Behavioural-FOs)
			- [9.1.1 Memoization](#9-1-1-Memoization)
			- [9.1.2 Capturing function invocations](#9-1-2-Capturing-function-invocations)
			- [9.1.3 Laziness](#9-1-3-Laziness)
		- [9.2 Output FOs](#9-2-Output-FOs)
			- [9.2.1 Minor modifications](#9-2-1-Minor-modifications)
			- [9.2.2 Changing what a function does](#9-2-2-Changing-what-a-function-does)
		- [9.3 Input FOs](#9-3-Input-FOs)
			- [9.3.1 Prefilling function arguments: partial function application](#9-3-1-Prefilling-function-arguments-partial-function-application)
			- [9.3.2 Changing input types](#9-3-2-Changing-input-types)
		- [9.4. Combining FOs](#9-4--Combining-FOs)
			- [9.4.1 Aggregating multiple functions into a single function](#9-4-1-Aggregating-multiple-functions-into-a-single-function)
			- [9.4.2 Function composition](#9-4-2-Function-composition)
			- [9.4.3 Logical predicates and boolean algebra](#9-4-3-Logical-predicates-and-boolean-algebra)
- Part III. Metaprogramming
	- [10. Non-standard evaluation](#10--Non-standard-evaluation)
		- [10.1 Capturing expressions](#10-1-Capturing-expressions)
		- [10.2 Non-standard evaluation in subset](#10-2-Non-standard-evaluation-in-subset)
		- [10.3 Scoping issues](#10-3-Scoping-issues)
		- [10.4 Calling from another function](#10-4-Calling-from-another-function)
		- [10.5 More on `substitute()`](#10-5-More-on-substitute)
			- [Adding an escape hatch to `substitute()`](#Adding-an-escape-hatch-to-substitute)
			- [Capturing unevaluated `…`](#Capturing-unevaluated-)
		- [10.6 The downsides of non-standard evaluation](#10-6-The-downsides-of-non-standard-evaluation)
	- [11. Expressions](#11--Expressions)
		- [11.1 Structure of expressions](#11-1-Structure-of-expressions)
		- [11.2 Names](#11-2-Names)
		- [11.3 Calls](#11-3-Calls)
		- [11.4 Capturing the current call](#11-4-Capturing-the-current-call)
		- [11.5 Pairlists](#11-5-Pairlists)
		- [11.6 Parsing and deparsing](#11-6-Parsing-and-deparsing)
		- [11.7 Walking the AST with recursive functions](#11-7-Walking-the-AST-with-recursive-functions)
			- [11.7.1 Finding F(ALSE) and T(RUE)](#11-7-1-Finding-FALSE-and-TRUE)
			- [11.7.2 Finding all variables created by assignment](#11-7-2-Finding-all-variables-created-by-assignment)
			- [11.7.3 Modifying the call tree](#11-7-3-Modifying-the-call-tree)
	- [12. Domain Specific Languages](#12--Domain-Specific-Languages)
		- [12.1 DSL Example 1: Generating HTML](#12-1-DSL-Example-1-Generating-HTML)
			- [12.1.1 Goal](#12-1-1-Goal)
			- 实现细节略
		- [12.2 DSL Example 2: Turning R mathematical expressions into LaTeX](#12-2-DSL-Example-2-Turning-R-mathematical-expressions-into-LaTeX)
			- [12.2.1 Goal](#12-2-1-Goal)
			- 实现细节略
- Part IV. Performant code
	- [13. Performance](#13--Performance)
		- [13.1 Why is R slow?](#13-1-Why-is-R-slow)
		- [13.2 Microbenchmarking](#13-2-Microbenchmarking)
		- [13.3 Language performance](#13-3-Language-performance)
			- [13.3.1 Extreme dynamism](#13-3-1-Extreme-dynamism)
			- [13.3.2 Name lookup with mutable environments](#13-3-2-Name-lookup-with-mutable-environments)
			- [13.3.3 Lazy evaluation overhead](#13-3-3-Lazy-evaluation-overhead)
		- [13.4 Implementation performance](#13-4-Implementation-performance)
			- [13.4.1 Extracting a single value from a data frame](#13-4-1-Extracting-a-single-value-from-a-data-frame)
			- [13.4.2 `ifelse()`, `pmin()`, and `pmax()`](#13-4-2-ifelse-pmin-and-pmax)
	- [14. Optimising code](#14--Optimising-code)
		- [14.1 Measuring performance](#14-1-Measuring-performance)
			- [Limitations](#Limitations)
		- [14.2 Improving performance](#14-2-Improving-performance)
			- [14.2.1 Best practice: Organize your code](#14-2-1-Best-practice-Organize-your-code)
			- [14.2.2 Technique 1: Look for existing solutions](#14-2-2-Technique-1-Look-for-existing-solutions)
			- [14.2.3 Technique 2: Unburden your functions](#14-2-3-Technique-2-Unburden-your-functions)
			- [14.2.4 Technique 3: Vectorise](#14-2-4-Technique-3-Vectorise)
			- [14.2.5 Technique 4: Avoid copies](#14-2-5-Technique-4-Avoid-copies)
			- [14.2.6 Technique 5: Byte-code compile](#14-2-6-Technique-5-Byte-code-compile)
			- [14.2.7 Case study: t-test](#14-2-7-Case-study-t-test)
			- [14.2.8 Technique 6: Parallelise](#14-2-8-Technique-6-Parallelise)
		- [14.3 Other techniques](#14-3-Other-techniques)
	- [15. Memory](#15--Memory)
	- [16. High performance functions with Rcpp](#16--High-performance-functions-with-Rcpp)
		- [16.1 Getting started](#16-1-Getting-started)
			- [16.1.1 Example 1: No inputs, scalar output](#16-1-1-Example-1-No-inputs-scalar-output)
			- [16.1.2 Example 2: Scalar input, scalar output](#16-1-2-Example-2-Scalar-input-scalar-output)
			- [16.1.3 Example 3: Vector input, scalar output](#16-1-3-Example-3-Vector-input-scalar-output)
			- [16.1.4 Example 4: Vector input, vector output](#16-1-4-Example-4-Vector-input-vector-output)
			- [16.1.5 Example 5: Matrix input, vector output](#16-1-5-Example-5-Matrix-input-vector-output)
			- [16.1.6 Using `sourceCpp()`](#16-1-6-Using-sourceCpp)
		- [16.2 Attributes and other classes](#16-2-Attributes-and-other-classes)
			- [16.2.1 Functions](#16-2-1-Functions)
			- [16.2.2 Other types](#16-2-2-Other-types)
		- [16.3 Missing values](#16-3-Missing-values)
			- [16.3.1 Scalar NAs](#16-3-1-Scalar-NAs)
				- [Integer NA](#Integer-NA)
				- [Double NA](#Double-NA)
				- [Boolean NA](#Boolean-NA)
			- [16.3.2 Vector NAs](#16-3-2-Vector-NAs)
		- [16.4 Rcpp sugar](#16-4-Rcpp-sugar)
			- [16.4.1 Arithmetic and logical operators](#16-4-1-Arithmetic-and-logical-operators)
			- [16.4.2 Logical summary functions](#16-4-2-Logical-summary-functions)
			- [16.4.3 Vector views](#16-4-3-Vector-views)
			- [16.4.4 Other useful functions](#16-4-4-Other-useful-functions)
		- [16.5 The STL](#16-5-The-STL)
			- [16.5.1 Using iterators](#16-5-1-Using-iterators)
			- [16.5.2 Sets](#16-5-2-Sets)
		- [16.6 Case studies (略)](#16-6-Case-studies)
		- [16.7 Using Rcpp in a package (略)](#16-7-Using-Rcpp-in-a-package)
	- [17. R's C interface](#17--R's-C-interface)
		- [17.1 Calling C functions from R](#17-1-Calling-C-functions-from-R)
		- [17.2 R's C data structures](#17-2-R's-C-data-structures)
		- [17.3 Creating and modifying vectors](#17-3-Creating-and-modifying-vectors)
			- [17.3.1 Creating vectors and garbage collection](#17-3-1-Creating-vectors-and-garbage-collection)
			- [17.3.2 Missing and non-finite values](#17-3-2-Missing-and-non-finite-values)
			- [17.3.3 Accessing vector data](#17-3-3-Accessing-vector-data)
			- [17.3.4 Character vectors and lists](#17-3-4-Character-vectors-and-lists)
			- [17.3.5 Modifying inputs](#17-3-5-Modifying-inputs)
			- [17.3.6 Coercing scalars](#17-3-6-Coercing-scalars)
			- [17.3.7 Long vectors](#17-3-7-Long-vectors)
		- [17.4 Pairlists](#17-4-Pairlists)
		- [17.5 Input validation](#17-5-Input-validation)
		- [17.6 Finding the C source code for a function](#17-6-Finding-the-C-source-code-for-a-function)

-----

## 1. Data structures <a name="1--Data-structures"></a>

|     | Homogeneous   | Heterogeneous | 
|-----|---------------|---------------| 
| 1-d | Atomic vector | List          | 
| 2-d | Matrix        | Data frame    | 
| n-d | Array         |               | 

Note that R has no 0-dimensional, or scalar types. Individual numbers or strings, which you might think would be scalars, are actually vectors of length one.

### 1.1 Quiz <a name="1-1-Quiz"></a>

**Q:** What are the three properties of a vector, other than its contents?

- The three properties of a vector `x` are `typeof(x)`, `length(x)`, and `attributes(x)`.

**Q:** What are the four common types of atomic vectors? What are the two rare types?

- The four common types of atomic vector are logical, integer, double (sometimes called numeric), and character. The two rarer types are complex and raw.
- atomic 本身并没有指特定的某种类型，你理解为 primitive 就好了

**Q:** What are attributes? How do you get them and set them?

- Attributes allow you to associate arbitrary additional metadata to any object. You can get and set individual attributes with `attr(x, "y")` and `attr(x, "y") <- value;` or get and set all attributes at once with `attributes(x)` (implemented as a list).

**Q:** How is a list different from an atomic vector? How is a matrix different from a data frame?

- The elements of a list can be any type (even a list); the elements of an atomic vector are all of the same type. Similarly, every element of a matrix must be the same type; in a data frame, the different columns can have different types.

**Q:** Can you have a list that is a matrix? Can a data frame have a column that is a matrix?

- You can make “list-array” by assuming dimensions to a list. You can make a matrix a column of a data frame with `df$x <- matrix()`, or using `I()` when creating a new data frame `data.frame(x = I(matrix()))`.

### 1.2 Atomic Vectors <a name="1-2-Atomic-Vectors"></a>

`c()` means "combine".

<pre class="prettyprint linenums">
# 你没看错，你没写小数点也默认是 double
dbl_var &lt;- c(1, 2, 4)

# With the L suffix, you get an integer rather than a double
int_var &lt;- c(1L, 6L, 10L)

# Use TRUE and FALSE (or T and F) to create logical vectors
log_var &lt;- c(TRUE, FALSE, T, F)

# string vector
chr_var &lt;- c("these are", "some strings")
</pre>

Atomic vectors are always flat, even if you nest `c()`’s:

<pre class="prettyprint linenums">
c(1, c(2, c(3, 4)))
#&gt; [1] 1 2 3 4
</pre>

除了 `typeof(x)` 外，还有：

- `is.character(x)`
- `is.double(x)`
- `is.integer(x)`
- `is.logical(x)`
- `is.numeric(x)`: 虽然一般管 double 叫 numeric，但是 `is.numeric(x) == is.double(x) || is.integer(x)`
- or, more generally, `is.atomic(x)`.

### 1.3 Lists <a name="1-3-Lists"></a>

Lists are sometimes called recursive vectors, because a list can contain other lists. This makes them fundamentally different from atomic vectors.

<pre class="prettyprint linenums">
x &lt;- list(list(list(list())))
str(x)
#&gt; List of 1
#&gt;  $ :List of 1
#&gt;   ..$ :List of 1
#&gt;   .. ..$ : list()
is.recursive(x)
#&gt; [1] TRUE
</pre>

`c()` will combine several lists into one. If given a combination of atomic vectors and lists, `c()` will coerce the vectors to lists before combining them.

<pre class="prettyprint linenums">
x &lt;- list(list(1, 2), c(3, 4))
y &lt;- c(list(1, 2), c(3, 4))
str(x)
#&gt; List of 2
#&gt;  $ :List of 2
#&gt;   ..$ : num 1
#&gt;   ..$ : num 2
#&gt;  $ : num [1:2] 3 4
str(y)
#&gt; List of 4
#&gt;  $ : num 1
#&gt;  $ : num 2
#&gt;  $ : num 3
#&gt;  $ : num 4
</pre>

Lists are used to build up many of the more complicated data structures in R.

<pre class="prettyprint linenums">
is.list(mtcars)
#&gt; [1] TRUE

mod &lt;- lm(mpg ~ wt, data = mtcars)
is.list(mod)
#&gt; [1] TRUE
</pre>

注意：如果要把 list 转成 vector，应该用 `unlist(x)` 而不是 `as.vector(x)`；`unlist(x)` 会得到一个 named vector，如果不要 name 的话，可以用 `unname(unlist(x))`。

### 1.4 Attributes <a name="1-4-Attributes"></a>

All objects can have arbitrary additional attributes, used to store metadata about the object. Attributes can be thought of as a named list (with unique names).

The `structure()` function returns a new object with modified attributes:

<pre class="prettyprint linenums">
structure(1:10, my_attribute = "This is a vector")
#&gt;  [1]  1  2  3  4  5  6  7  8  9 10
#&gt; attr(,"my_attribute")
#&gt; [1] "This is a vector"
</pre>

Note that some attributes (namely "class", "comment", "dim", "dimnames", "names", "row.names" and "tsp") are treated specially and have restrictions on the values which can be set.

The attributes hidden by `attributes(x)` are the three most important:

- "names", a character vector giving each element a name.
- "dim", used to turn vectors into matrices and arrays.
- "class", used to implement the S3 object system.

Each of these three attributes has a specific accessor function to get and set values. When working with these attributes, use `names(x)`, `dim(x)`, and `class(x)`, NOT `attr(x, "names")`, `attr(x, "dim")`, and `attr(x, "class")`.

### 1.5 Factors <a name="1-5-Factors"></a>

Factors are built on top of integer vectors using two attributes: 

- `class(f) == “factor”`, which makes them behave differently from regular integer vectors and
- `levels(f)`, which defines the set of allowed values.

### 1.6 Matrices and arrays <a name="1-6-Matrices-and-arrays"></a>

Adding a `dim(x)` attribute to an atomic vector `x` allows it to behave like a multi-dimensional array. A special case of the array is the matrix, which has two dimensions.

- `length(x)` generalizes to `nrow(x)` and `ncol(x)` for matrices, and `dim(x)` for arrays.
- `names(x)` generalizes to `rownames(x)` and `colnames(x)` for matrices, and `dimnames(x)`, a list of character vectors, for arrays.
- `c()` generalizes to `cbind()` and `rbind()` for matrices, and to `abind()` (provided by the `abind` package) for arrays. 
- You can transpose a matrix with `t()`; the generalized equivalent for arrays is `aperm()`.

### 1.7 Data frames <a name="1-7-Data-frames"></a>

Under the hood, a data frame is a list of equal-length vectors. This makes it a 2-dimensional structure, so it shares properties of both the matrix and the list. 

- This means that a data frame has `names()`, `colnames()`, and `rownames()`, although `names()` and `colnames()` are the same thing. 
- The `length()` of a data frame is the length of the underlying list and so is the same as `ncol()`; 
- `nrow()` gives the number of rows.

Because a `data.frame` is an S3 class, its type reflects the underlying vector used to build it: the list. To check if an object is a data frame, use `class()` or test explicitly with `is.data.frame()`:

<pre class="prettyprint linenums">
typeof(df)
#&gt; [1] "list"
class(df)
#&gt; [1] "data.frame"
is.data.frame(df)
#&gt; [1] TRUE
</pre>

You can coerce an object to a data frame with `as.data.frame()`:

- A vector will create a one-column data frame.
- A list will create one column for each element; it’s an error if they’re not all the same length.
- A matrix will create a data frame with the same number of columns and rows as the matrix.

It’s a common mistake to try and create a data frame by `cbind()`ing vectors together. This doesn’t work because `cbind()` will create a matrix unless one of the arguments is already a data frame. Instead use `data.frame()` directly.

## 2. Subsetting <a name="2--Subsetting"></a>

It’s easiest to learn how subsetting works for atomic vectors, and then how it generalises to higher dimensions and other more complicated objects.

### 2.1 Quiz <a name="2-1-Quiz"></a>

**Q:** What is the result of subsetting a vector with positive integers, negative integers, a logical vector, or a character vector?

- Positive integers select elements at specific positions, negative integers drop elements; logical vectors keep elements at positions corresponding to TRUE; character vectors select elements with matching names.

**Q:** What’s the difference between `[`, `[[`, and `$` when applied to a list?

- `[` selects sub-lists. It always returns a list; if you use it with a single positive integer, it returns a list of length one. 
- `[[` selects an element within a list. 
- `$` is a convenient shorthand: `x$y` is equivalent to `x[["y"]]`.

**Q:** When should you use `drop = FALSE`?

- 简单说就是：如果 `drop = FALSE`，你 subset 的输入和输出会保持同一类型，比如你 subset 一个 matrix，得到的结果还是 matrix，不会变成 vector

**Q:** If `x` is a matrix, what does `x[] <- 0` do? How is it different to `x <- 0`?

- If `x` is a matrix, `x[] <- 0` will replace every element with 0, keeping the same number of rows and columns. 
- `x <- 0` completely replaces the matrix with the value 0.

**Q:** How can you use a named vector to relabel categorical variables?

- A named character vector can act as a simple lookup table: `c(x = 1, y = 2, z = 3)[c("y", "z", "x")]`

### 2.2 Subsetting operator [] <a name="2-2-Subsetting-operator-"></a>

#### 2.2.1 Subsetting atomic vectors <a name="2-2-1-Subsetting-atomic-vectors"></a>

There are six things that you can use to subset a vector:

<pre class="prettyprint linenums">
x &lt;- c(2.1, 4.2, 3.3, 5.4)

# CASE 1. Positive integers, which return elements at the specified positions
x[c(3, 1)]
x[order(x)]
x[c(1, 1)]		# Duplicated indices yield duplicated values
x[c(2.1, 2.9)]	# Real numbers are silently truncated to integers

# CASE 2. Negative integers, which omit elements at the specified positions
x[-c(3, 1)]
x[c(-1, 2)] # ERROR. You can’t mix positive and negative integers in a single subset

# CASE 3. Logical vectors, which select elements where the corresponding logical value is TRUE
x[c(TRUE, TRUE, FALSE, FALSE)]
x[x &gt; 3]
x[c(TRUE, FALSE)]			# If the logical vector is shorter than the vector being subsetted, it will be recycled to be the same length.
x[c(TRUE, TRUE, NA, FALSE)] # A missing value in the index always yields a missing value in the output

# CASE 4. Nothing, which returns the original vector
# More useful for matrices, data frames, and arrays
x[]

# CASE 5. Zero, which returns a zero-length vector
x[0]

# CASE 6. Character vectors, which return elements with matching names
# Only if the vector is named
y &lt;- setNames(x, letters[1:4]) # letters[1:4] = c("a", "b", "c", "d")
y[c("d", "c", "a")]
y[c("a", "a", "a")] # Like integer indices, you can repeat indices
</pre>

CASE 4, "Subsetting with nothing" can be useful in conjunction with assignment because it will preserve the original object class and structure. Compare the following two expressions:

<pre class="prettyprint linenums">
mtcars[] <- lapply(mtcars, as.integer)	# mtcars will remain as a data frame
mtcars <- lapply(mtcars, as.integer)	# mtcars will become a list
</pre>

#### 2.2.2 Subsetting lists <a name="2-2-2-Subsetting-lists"></a>

Subsetting a list works in the same way as subsetting an atomic vector. Using `[` will always return a list.

#### 2.2.3 Subsetting matrices and arrays <a name="2-2-3-Subsetting-matrices-and-arrays"></a>

You can subset higher-dimensional structures in three ways:

- With multiple vectors.
	- 以 matrix 为例就是 `m[rows, cols]`
		- 如果省略了 `rows` 就表示 all rows
		- 如果省略了 `cols` 就表示 all cols
		- 逗号不能省，否则就变成了 subsetting with a single vector
	- 比如 `m[1:2, 3:4]` 就是要 1-2 row, 3-4 col 一共 4 个元素
- With a single vector.
	- 以 matrix 为例就是 `m[indices]`
	- indices 是 column-wise 算的，比如一个 5x5 的 matrix，
		- index=3 表示 `m[3,1]`
		- index=15 表示 `m[5,3]`
		- `m[c(3, 15)]` 就是把上面这两个元素都选出来
- With a matrix.
	- 以 matrix 为例就是 `m[indices]`
	- indices 是一个 2-column 的 matrix，每一 row 表示一个下标
		- 比如 \\( \begin{bmatrix}1 & 1 \\\\3 & 1\\\\4 & 2 \end{bmatrix} \\) 就可以取到 `m[1,1]`, `m[3,1]`, `m[4,2]` 这三个元素
		
如果是 array 的话，上面这三种方法都需要扩展维数。

#### 2.2.4 Subsetting data frames <a name="2-2-4-Subsetting-data-frames"></a>

Data frames possess the characteristics of both lists and matrices: 

- if you subset with a single vector, they behave like lists;
	- 而 list 和 vector 的逻辑是一样的
- if you subset with two vectors, they behave like matrices.

<pre class="prettyprint linenums">
df <- data.frame(x = 1:3, y = 3:1, z = letters[1:3])

df[df$x == 2, ]	# x=2 的row
df[c(1, 3), ]	# 1st and 3rd rows

# select multiple columns
# 这两种方法是等价的，而且返回结果都是 data frame
df[c("x", "z")]
df[, c("x", "z")]

# select single column
# 情况稍微有点不同
df["x"]		# return a data frame
df[, "x"]	# return a vector
</pre>

### 2.3 Subsetting operator [[]] <a name="2-3-Subsetting-operator-"></a>

`[[` is similar to `[`, except it can only return a single value and it allows you to pull pieces out of a list.

You need `[[` when working with lists. This is because when `[` is applied to a list it always returns a list: it never gives you the contents of the list. To get the contents, you need `[[`.

Because it can return only a single value, you must use `[[` with either a single positive integer or a string:

<pre class="prettyprint linenums">
a &lt;- list(a = 1, b = 2)
a[[1]]
#&gt; [1] 1
a[["a"]]
#&gt; [1] 1

# If you do supply a vector it indexes recursively
b &lt;- list(a = list(b = list(c = list(d = 1))))
b[[c("a", "b", "c", "d")]]
#&gt; [1] 1
# Same as
b[["a"]][["b"]][["c"]][["d"]]
#&gt; [1] 1
</pre>

Because data frames are lists of columns, you can use `[[` to extract a column from data frames: `mtcars[[1]]`, `mtcars[["cyl"]]`. 

#### Simplifying vs. preserving subsetting <a name="Simplifying-vs--preserving-subsetting"></a>

- Simplifying subsets returns the simplest possible data structure that can represent the output, and is useful interactively because it usually gives you what you want. 
- Preserving subsetting keeps the structure of the output the same as the input, and is generally better for programming because the result will always be the same type. 
	- Omitting `drop = FALSE` when subsetting matrices and data frames is one of the most common sources of programming errors.
	
Unfortunately, how you switch between simplifying and preserving differs for different data types:

|             | Simplifying               | Preserving                                   |
|-------------|---------------------------|----------------------------------------------|
| Vector      | `x[[1]]`                  | `x[1]`                                       |
| List        | `x[[1]]`                  | `x[1]`                                       |
| Factor      | `x[1:4, drop = T]`        | `x[1:4]`                                     |
| Array       | `x[1, ]` __or__ `x[, 1]`  | `x[1, , drop = F]` __or__ `x[, 1, drop = F]` |
| Data frame  | `x[, 1]` __or__ `x[[1]]`  | `x[, 1, drop = F]` __or__ `x[1]`             |

#### How does it simplify? <a name="How-does-it-simplify"></a>

<pre class="prettyprint linenums">
# CASE: atomic vector 
	# Remove names.
x &lt;- c(a = 1, b = 2)
x[1]
#&gt; a 
#&gt; 1
x[[1]]
#&gt; [1] 1

# CASE: list 
	# Return the object inside the list, not a single element list.
# 例子略

# CASE: factor 
	# Drops any unused levels.
z &lt;- factor(c("a", "b"))
z[1]
#&gt; [1] a
#&gt; Levels: a b
z[1, drop = TRUE]
#&gt; [1] a
#&gt; Levels: a

# CASE: matrix or array 
	# If any of the dimensions has length 1, drops that dimension.
a &lt;- matrix(1:4, nrow = 2)
a[1, , drop = FALSE]
#&gt;      [,1] [,2]
#&gt; [1,]    1    3
a[1, ]
#&gt; [1] 1 3

# CASE: data frame
	# If output is a single column, returns a vector instead of a data frame.
df &lt;- data.frame(a = 1:2, b = 1:2)
str(df[1])
#&gt; 'data.frame':    2 obs. of  1 variable:
#&gt;  $ a: int  1 2
str(df[[1]])
#&gt;  int [1:2] 1 2
str(df[, "a", drop = FALSE])
#&gt; 'data.frame':    2 obs. of  1 variable:
#&gt;  $ a: int  1 2
str(df[, "a"])
#&gt;  int [1:2] 1 2
</pre>

#### Out-of-bound indices <a name="Out-of-bound-indices"></a>

`[` and `[[` differ slightly in their behaviour when the index is out of bounds (OOB)。我们干脆总结得远一些：

| Operator | Index       | Atomic      | List          |
|----------|-------------|-------------|---------------|
| `[`      | OOB         | `NA`        | `list(NULL)`  |
| `[`      | `NA_real_`  | `NA`        | `list(NULL)`  |
| `[`      | `NULL`      | `x[0]`      | `list(NULL)`  |
| `[[`     | OOB         | Error       | Error         |
| `[[`     | `NA_real_`  | Error       | `NULL`        |
| `[[`     | `NULL`      | Error       | Error         |

### 2.4 Subsetting operator $ <a name="2-4-Subsetting-operator-"></a>

`$` is a shorthand operator, where `x$y` is equivalent to `x[["y", exact = FALSE]]`. It’s often used to access variables in a data frame, as in `mtcars$cyl` or `diamonds$carat`.

There’s one important difference between `$` and `[[`. `$` does **partial matching**:

<pre class="prettyprint linenums">
x &lt;- list(abc = 1)
x$a
#&gt; [1] 1
x[["a"]]
#&gt; NULL
</pre>

### 2.5 Subsetting S3 and S4 objects <a name="2-5-Subsetting-S3-and-S4-objects"></a>

- S3 objects
	- S3 objects are made up of atomic vectors, arrays, and lists, so you can always pull apart an S3 object using the techniques described above and the knowledge you gain from `str()`.
- S4 objects
	- There are also two additional subsetting operators that are needed for S4 objects: 
		- `@` (equivalent to `$`), and 
			- `@` is more restrictive than `$` in that it will return an error if the slot does not exist.
		- `slot()` (equivalent to `[[`). 

S3 and S4 objects can override the standard behaviour of `[` and `[[` so they behave differently for different types of objects.

### 2.6 Subsetting and assignment <a name="2-6-Subsetting-and-assignment"></a>

就两个小地方注意下：

- With lists, you can use subsetting + assignment + NULL to remove components from a list. 
	- data frame 是 list of vectors，所以可以赋 NULL 来 remove 某个 column
- To add a literal NULL to a list, use `[` and `list(NULL)`.

<pre class="prettyprint linenums">
x &lt;- list(a = 1, b = 2)
x[["b"]] &lt;- NULL
str(x)
#&gt; List of 1
#&gt;  $ a: num 1

y &lt;- list(a = 1)
y["b"] &lt;- list(NULL)
str(y)
#&gt; List of 2
#&gt;  $ a: num 1
#&gt;  $ b: NULL
</pre>

### 2.7 Applications <a name="2-7-Applications"></a>

#### Lookup tables (character subsetting) <a name="Lookup-tables-character-subsetting"></a>

讲真，lookup 做 noun 的时候表示的是 looking something up 这样一个动作，所以把一个 var 命名为 lookup 我是有点难理解的；用 lookupTable 会好一点，但是要注意逻辑是 looking something up in this lookupTable。

Say you want to convert abbreviations:

<pre class="prettyprint linenums">
x <- c("m", "f", "u", "f", "f", "m", "m")
lut <- c(m = "Male", f = "Female", u = NA)
lut[x]
#>	m		f			u	f			f			m		m 
#>	"Male"	"Female"	NA	"Female"	"Female"	"Male"	"Male"
unname(lut[x])
#> [1] "Male"	"Female"	NA	"Female"	"Female"	"Male"	"Male"

# Or with fewer output values
lut2 <- c(m = "Known", f = "Known", u = "Unknown")
unname(lut2[x])
#> 
#> [1] "Known"	"Known"	"Unknown"	"Known"	"Known"	"Known"	"Known"
</pre>

#### Random samples/bootstrap (integer subsetting) <a name="Random-samples-bootstrap-integer-subsetting"></a>

<pre class="prettyprint linenums">
df &lt;- data.frame(x = rep(1:3, each = 2), y = 6:1, z = letters[1:6])

# Set seed for reproducibility
set.seed(10)

# Randomly reorder
df[sample(nrow(df)), ]

# Select 3 random rows
df[sample(nrow(df), 3), ]

# Select 6 bootstrap replicates
df[sample(nrow(df), 6, rep = T), ]
</pre>

#### Expanding aggregated counts (integer subsetting) <a name="Expanding-aggregated-counts-integer-subsetting"></a>

<pre class="prettyprint linenums">
df &lt;- data.frame(x = c(2, 4, 1), y = c(9, 11, 6), n = c(3, 5, 1))
rep(1:nrow(df), df$n)
#&gt; [1] 1 1 1 2 2 2 2 2 3
df[rep(1:nrow(df), df$n), ]
#&gt;     x  y n
#&gt; 1   2  9 3
#&gt; 1.1 2  9 3
#&gt; 1.2 2  9 3
#&gt; 2   4 11 5
#&gt; 2.1 4 11 5
#&gt; 2.2 4 11 5
#&gt; 2.3 4 11 5
#&gt; 2.4 4 11 5
#&gt; 3   1  6 1
</pre>

这里 `n` 是表示 count，比如 `(x, y, n) = (2, 9, 3)` 就表示 `(x, y) = (2, 9)` 的数据有 3 个。我们用上面的语句把这个 count 展开。

## 3. Functions <a name="3--Functions"></a>

### 3.1 Function components <a name="3-1-Function-components"></a>

All R functions have three parts:

- `body(f)`, the code inside the function.
- `formals(f)`, the list of formal arguments which controls how you can call the function.
- `environment(f)`, the “map” of the location of the function’s variables.

<pre class="prettyprint linenums">
f &lt;- function(x) x^2
f
#&gt; function(x) x^2

formals(f)
#&gt; $x
body(f)
#&gt; x^2
environment(f)
#&gt; &lt;environment: R_GlobalEnv&gt;
</pre>

#### Exception: Primitive functions <a name="Exception-Primitive-functions"></a>

There is one exception to the rule that functions have three components. Primitive functions, like `sum()`, call C code directly with `.Primitive()` interface and contain no R code. Therefore their `formals()`, `body()`, and `environment()` are all NULL:

<pre class="prettyprint linenums">
sum
#&gt; function (..., na.rm = FALSE)  .Primitive("sum")
formals(sum)
#&gt; NULL
body(sum)
#&gt; NULL
environment(sum)
#&gt; NULL
</pre>

Primitive functions are only found in the `base` package, and since they operate at a low level, they can be more efficient (primitive replacement functions don’t have to make copies), and can have different rules for argument matching (e.g., switch and call). This, however, comes at a cost of behaving differently from all other functions in R. Hence the R core team generally avoids creating them unless there is no other option.

<pre class="prettyprint linenums">
# 见名知意
is.function(f)
is.primitive(f)
</pre>

### 3.2 Lexical scoping <a name="3-2-Lexical-scoping"></a>

Scoping is the set of rules that govern how R looks up the value of a symbol. 比如我们有 `x <- 10`，那么 scoping is the set of rules that leads R to go from the symbol `x` to its value 10.

R has two types of scoping: **lexical scoping**, implemented automatically at the language level, and **dynamic scoping**, used in select functions to save typing during interactive analysis. We discuss lexical scoping here because it is intimately tied to function creation.

The “lexical” in lexical scoping doesn’t correspond to the usual English definition (“of or relating to words or the vocabulary of a language as distinguished from its grammar and construction”) but comes from the computer science term “lexing”, which is part of the process that converts code represented as text to meaningful pieces that the programming language understands.

Lexical scoping looks up symbol values based on how functions were nested when they were created, NOT how they are nested when they are called. With lexical scoping, you don’t need to know how the function is called to figure out where the value of a variable will be looked up. You just need to look at the function’s definition.

There are four basic principles behind R’s implementation of lexical scoping:

- name masking
- functions vs. variables
- a fresh start
- dynamic lookup

#### 3.2.1 Name Masking <a name="3-2-1-Name-Masking"></a>

注：老实说这一节我不明白为啥叫 Name Masking，因为好像并没有讲 masking 啊……根据 [How does R handle overlapping object names?](http://www.ats.ucla.edu/stat/r/faq/referencing_objects.htm) 的说法：

> Masking occurs when two or more packages have objects (such as functions) with the same name.

这个和我理解得一样。Anyway，以下是正文。

When there is a name in a function, R will look for the name's definition inside the current function, then where that function was defined (maybe an outer function), and so on, all the way up to the global environment, and then on to other loaded packages.

<pre class="prettyprint linenums">
x &lt;- 1
h &lt;- function() {
  y &lt;- 2
  i &lt;- function() {
    z &lt;- 3
    c(x, y, z)
  }
  i()
}
h() # output: [1] 1 2 3
</pre>

The same rules apply to **closures**, functions created by other functions. The following function, `j()`, returns a function:

<pre class="prettyprint linenums">
j &lt;- function(x) {
  y &lt;- 2
  function() {
    c(x, y)
  }
}
k &lt;- j(1)
k() # output: [1] 1 2
</pre>

This seems a little magical. How does R know what the value of `y` is after the function has been called? It works because `k` preserves the environment in which it was defined and because the environment includes the value of `y`. Environments gives some pointers on how you can dive in and figure out what values are stored in the environment associated with each function.

#### 3.2.2 Functions vs. variables <a name="3-2-2-Functions-vs--variables"></a>

The same principles apply regardless of the type of associated value — finding functions works exactly the same way as finding variables.

However, there is one small tweak to the rule. If you are using a name in a context where it’s obvious that you want a function (e.g., `f(3)`), R will ignore objects that are not functions while it is searching. In the following example `n` takes on a different value depending on whether R is looking for a function or a variable.

<pre class="prettyprint linenums">
n &lt;- function(x) x / 2 # this n is a function
o &lt;- function() {
  n &lt;- 10 # and this n is a variable
  n(n) # WTF!
}
o() # output: [1] 5
</pre>

However, using the same name for functions and other objects will make for confusing code, and is generally best avoided.

#### 3.2.3 A fresh start <a name="3-2-3-A-fresh-start"></a>

<pre class="prettyprint linenums">
# exists("a") returns true if variable `a` exists.

j &lt;- function() {
  if (!exists("a")) {
    a &lt;- 1
  } else {
    a &lt;- a + 1
  }
  print(a)
}
j()
</pre>

`j()` returns the same value, 1, every time. This is because every time a function is called, a new environment is created to host execution. A function has no way to tell what happened the last time it was run (除非我们用 `<<-`); each invocation is completely independent.

#### 3.2.4 Dynamic lookup <a name="3-2-4-Dynamic-lookup"></a>

Lexical scoping determines where to look for values, not when to look for them. R looks for values when the function is run, not when it’s created (但查找还是先到 definition 里去查). This means that the output of a function can be different depending on objects outside its environment:

<pre class="prettyprint linenums">
f &lt;- function() x
x &lt;- 15
f()
#&gt; [1] 15

x &lt;- 20
f()
#&gt; [1] 20
</pre>

You generally want to avoid this behaviour because it means the function is no longer **self-contained**. This is a common error — if you make a spelling mistake in your code, you won’t get an error when you create the function, and you might not even get one when you run the function, depending on what variables are defined in the global environment.

One way to detect this problem is the `findGlobals()` function from `codetools`. This function lists all the external dependencies of a function:

<pre class="prettyprint linenums">
f &lt;- function() x + 1
codetools::findGlobals(f)
#&gt; [1] "+" "x"
</pre>

Another way to try and solve the problem would be to manually change the environment of the function to the `emptyenv()`, an environment which contains absolutely nothing:

<pre class="prettyprint linenums">
environment(f) &lt;- emptyenv()
f()
#&gt; Error in f(): could not find function "+"
</pre>

However this hardly works because R relies on lexical scoping to find _everything_, even the `+` operator. It’s never possible to make a function completely self-contained because you must always rely on functions defined in base R or other packages.

### 3.3 Every operation is a function call <a name="3-3-Every-operation-is-a-function-call"></a>

Great, the C++ way.

This includes infix operators like `+`, control flow operators like `for`, `if`, and `while`, subsetting operators like `[]` and `$`, and even the curly brace `{`.

Note that <code>&#96;</code>, the backtick, lets you refer to functions or variables that have otherwise reserved or illegal names:

<pre class="prettyprint linenums">
x &lt;- 10; y &lt;- 5
x + y
#&gt; [1] 15
`+`(x, y)
#&gt; [1] 15

for (i in 1:2) print(i)
#&gt; [1] 1
#&gt; [1] 2
`for`(i, 1:2, print(i))
#&gt; [1] 1
#&gt; [1] 2

x[3]
#&gt; [1] NA
`[`(x, 3)
#&gt; [1] NA
</pre>

It is possible to override the definitions of these special functions, but you need to be careful.

It’s more often useful to treat special functions as ordinary functions. For example, we could use `sapply()` to add 3 to every element of a list by first defining a function `add()`, like this:

<pre class="prettyprint linenums">
add &lt;- function(x, y) x + y
sapply(1:10, add, 3)
#&gt;  [1]  4  5  6  7  8  9 10 11 12 13
</pre>

But we can also get the same effect using the built-in `+` function:

<pre class="prettyprint linenums">
sapply(1:5, `+`, 3)
#&gt; [1] 4 5 6 7 8

# This works because sapply can use match.fun() to find functions given their names.
sapply(1:5, "+", 3) 
#&gt; [1] 4 5 6 7 8
</pre>

A more useful application is to combine `lapply()` or `sapply()` with subsetting:

<pre class="prettyprint linenums">
x &lt;- list(1:3, 4:9, 10:12)
sapply(x, "[", 2)
#&gt; [1]  2  5 11

# equivalent to
sapply(x, function(x) x[2])
#&gt; [1]  2  5 11
</pre>

### 3.4 Function arguments <a name="3-4-Function-arguments"></a>

#### 3.4.1 Calling functions <a name="3-4-1-Calling-functions"></a>

When calling a function you can specify arguments by position, by complete name, or by partial name. Arguments are matched 

- first by exact name (perfect matching), 
	- then by prefix matching, 
		- and finally by position.
		
If a function uses `...`, you can only specify arguments listed after `...` with their full name.

#### 3.4.2 Calling a function given a list of arguments <a name="3-4-2-Calling-a-function-given-a-list-of-arguments"></a>

Suppose you had a list of function arguments. How could you then send that list to `mean()`? You need `do.call()`:

<pre class="prettyprint linenums">
args &lt;- list(1:10, na.rm = TRUE)
do.call(mean, args)
#&gt; [1] 5.5

# Equivalent to
mean(1:10, na.rm = TRUE)
#&gt; [1] 5.5
</pre>

注意这里 `na.rm` 是 `args` 的一个元素，并不是 `args` 的一个参数。

#### 3.4.3 Default and missing arguments <a name="3-4-3-Default-and-missing-arguments"></a>

You can determine if an argument was supplied or not with the `missing()` function.

<pre class="prettyprint linenums">
i &lt;- function(a, b) {
  c(missing(a), missing(b))
}
i()
#&gt; [1] TRUE TRUE
i(a = 1)
#&gt; [1] FALSE  TRUE
i(b = 2)
#&gt; [1]  TRUE FALSE
i(1, 2)
#&gt; [1] FALSE FALSE
</pre>

#### 3.4.4 Lazy evaluation <a name="3-4-4-Lazy-evaluation"></a>

By default, R function arguments are lazy — they’re only evaluated if they’re actually used:

<pre class="prettyprint linenums">
f &lt;- function(x) {
  10
}
f(stop("This is an error!"))
#&gt; [1] 10
</pre>

`stop()` is not used, so not evaluated (thus not executed).

If you want to ensure that an argument is evaluated you can use `force()`:

<pre class="prettyprint linenums">
f &lt;- function(x) {
  force(x)
  10
}
f(stop("This is an error!"))
#&gt; Error in force(x): This is an error!
</pre>

This code is exactly equivalent to:

<pre class="prettyprint linenums">
f &lt;- function(x) {
  x
  10
}
f(stop("This is an error!"))
</pre>

This is important when creating closures with lapply() or a loop:

<pre class="prettyprint linenums">
add &lt;- function(x) {
  function(y) x + y
}
adders &lt;- lapply(1:10, add)
adders[[1]](10)
#&gt; [1] 20
adders[[10]](10)
#&gt; [1] 20
</pre>

因为 `x` 在 `add` 内没有值，所以最终 `adders[[1]]` 到 `adders[[10]]` 这 10 个函数用的都是外部的 `x` 值，而外部 `x` 的值是最终定格在 10 的（`1:10`），所以你调用任意的 `adders[[n]](10)` 都是执行 10+10 而不是 n+10。

正确的写法是：

<pre class="prettyprint linenums">
add &lt;- function(x) {
  force(x)
  function(y) x + y
}
adders2 &lt;- lapply(1:10, add)
adders2[[1]](10)
#&gt; [1] 11
adders2[[10]](10)
#&gt; [1] 20
</pre>

Default arguments are evaluated inside the function:

<pre class="prettyprint linenums">
f &lt;- function(x = ls()) {
  a &lt;- 1
  x
}

# ls() evaluated inside f:
f()
#&gt; [1] "a" "x"
</pre>

More technically, an unevaluated argument is called a **promise**, or (less commonly) a **thunk** ([θʌŋk], a delayed computation). A promise is made up of two parts:

- The expression which gives rise to the delayed computation. (It can be accessed with `substitute()`.)
- The environment where the expression was created and where it should be evaluated.

The first time a promise is accessed, the expression is evaluated in the environment where it was created. This value is cached, so that subsequent access to the evaluated promise does not recompute the value (but the original expression is still associated with the value, so `substitute()` can continue to access it). You can find more information about a promise using `pryr::promise_info()`. This uses some C++ code to extract information about the promise without evaluating it, which is impossible to do in pure R code.

#### 3.4.5 Variable argument list `...` <a name="3-4-5-Variable-argument-list----"></a>

- ellipsis: [ɪˈlɪpsɪs], 省略号

To capture `...` in a form that is easier to work with, you can use `list(...)`:

<pre class="prettyprint linenums">
f &lt;- function(...) {
  names(list(...))
}
f(a = 1, b = 2)
#&gt; [1] "a" "b"
</pre>

It’s often better to be explicit rather than implicit, so you might instead ask users to supply a list of additional arguments. That’s certainly easier if you’re trying to use `...` with multiple additional functions.

### 3.5 Special calls <a name="3-5-Special-calls"></a>

R supports two additional syntaxes for calling special types of functions: 

- infix and 
- replacement functions.

#### 3.5.1 Infix functions <a name="3-5-1-Infix-functions"></a>

Most functions in R are “prefix” operators: the name of the function comes before the arguments. You can also create infix functions where the function name comes in between its arguments, like `+` or `-`. All user-created infix functions must start and end with `%`. R comes with the following infix functions predefined: `% %`, `%*%`, `%/%`, `%in%`, `%o%`, `%x%`.

For example, we could create a new operator that pastes together strings:

<pre class="prettyprint linenums">
`%+%` &lt;- function(a, b) paste0(a, b)
"new" %+% " string"
#&gt; [1] "new string"
</pre>

#### 3.5.2 Replacement functions <a name="3-5-2-Replacement-functions"></a>

Replacement functions act like they modify their arguments in place, and have the special name `xxx<-`. They typically have two arguments (`x` and `value`), although they can have more, and they must return the modified object. For example, the following function allows you to modify the second element of a vector:

<pre class="prettyprint linenums">
`second&lt;-` &lt;- function(x, value) {
  x[2] &lt;- value
  x
}
x &lt;- 1:10
second(x) &lt;- 5L
x
#&gt;  [1]  1  5  3  4  5  6  7  8  9 10
</pre>

I say they “act” like they modify their arguments in place, because they actually **create a modified copy**. We can see that by using `pryr::address()` to find the memory address of the underlying object.

<pre class="prettyprint linenums">
library(pryr)
x &lt;- 1:10
address(x) # 类似 C 的 &x
#&gt; [1] "0x433fdf0"
second(x) &lt;- 6L
address(x)
#&gt; [1] "0x4305078"
</pre>

Built-in functions that are implemented using `.Primitive()` will modify in place:

<pre class="prettyprint linenums">
x &lt;- 1:10
address(x)
#&gt; [1] "0x103945110"

x[2] &lt;- 7L
address(x)
#&gt; [1] "0x103945110"
</pre>

It’s important to be aware of this behaviour since it has important performance implications.

If you want to supply additional arguments, they go in between `x` and `value`:

<pre class="prettyprint linenums">
`modify&lt;-` &lt;- function(x, position, value) {
  x[position] &lt;- value
  x
}
modify(x, 1) &lt;- 10
x
#&gt;  [1] 10  6  3  4  5  6  7  8  9 10
</pre>

When you call `modify(x, 1) <- 10`, behind the scenes R turns it into `` x <- `modify<-`(x, 1, 10) ``. This means you CANNOT do things like: `modify(get("x"), 1) <- 10` because that gets turned into the invalid code: `` get("x") <- `modify<-`(get("x"), 1, 10) ``.

### 3.6 Return values <a name="3-6-Return-values"></a>

The last expression evaluated in a function becomes the return value, or you can use an explicit `return()`. 

The functions that are the easiest to understand and reason about are **pure functions**: functions that always map the same input to the same output and have no other impact on the workspace. In other words, pure functions have no **side effects**: they don’t affect the state of the world in any way apart from the value they return.

R protects you from one type of side effect: most R objects have copy-on-modify semantics. So modifying a function argument does not change the original value. (也就是传说中的 pass-by-value)

Most base R functions are pure, with a few notable exceptions:

- `library()` which loads a package, and hence modifies the search path.
- `setwd()`, `Sys.setenv()`, `Sys.setlocale()` which change the working directory, environment variables, and the locale, respectively.
- `plot()` and friends which produce graphical output.
- `write()`, `write.csv()`, `saveRDS()`, etc. which save output to disk.
- `options()` and `par()` which modify global settings.
- S4 related functions which modify global tables of classes and methods.
- Random number generators which produce different numbers each time you run them.

#### 3.6.1 Invisible <a name="3-6-1-Invisible"></a>

Functions can return **invisible** values, which are not printed out by default when you call the function.

<pre class="prettyprint linenums">
f1 &lt;- function() 1
f2 &lt;- function() invisible(1)

f1()
#&gt; [1] 1
f2()
f1() == 1
#&gt; [1] TRUE
f2() == 1
#&gt; [1] TRUE
</pre>

You can force an invisible value to be displayed by wrapping it in parentheses:

<pre class="prettyprint linenums">
(f2())
#&gt; [1] 1
</pre>

The most common function that returns invisibly is `<-`:

<pre class="prettyprint linenums">
a &lt;- 2
(a &lt;- 2)
#&gt; [1] 2
</pre>

#### 3.6.2 On exit <a name="3-6-2-On-exit"></a>

As well as returning a value, functions can set up other triggers to occur when the function is finished using `on.exit()`. This is often used as a way to guarantee that changes to the global state are restored when the function exits. The code in `on.exit()` is run regardless of how the function exits, whether with an return, an error, or simply reaching the end of the function body.

<pre class="prettyprint linenums">
in_dir &lt;- function(dir, code) {
  old &lt;- setwd(dir)
  on.exit(setwd(old))

  force(code)
}
getwd()
#&gt; [1] "/home/travis/build/hadley/adv-r"
in_dir("~", getwd())
#&gt; [1] "/home/travis"
</pre>

Caution: If you’re using multiple `on.exit()` calls within a function, make sure to set `add = TRUE`. Unfortunately, the default in `on.exit()` is `add = FALSE`, so that every time you run it, it overwrites existing exit expressions.

## 4. OO field guide <a name="4--OO-field-guide"></a>

R has three object oriented systems, S3, S4, "Reference Classes" (S5), and a "Base Types" system.

- **Base types**, the internal C-level types that underlie the other OO systems. Base types are mostly manipulated using C code, but they’re important to know about because they provide the building blocks for the other OO systems.
- **S3** implements a style of OO programming called **generic-function OO**. This is different from most programming languages, like Java, C++, and C#, which implement **message-passing OO**. 
	- With message-passing, objects usually appear before the name of the method/message: e.g., `canvas.drawRect("blue")`. 
	- S3 is different. While computations are still carried out via methods, a special type of function called a generic function decides which method to call, e.g., drawRect(canvas, "blue"). 
	- S3 is a very casual system. It has no formal definition of classes.
- **S4** works similarly to S3, but is more formal. There are two major differences to S3:
	- S4 has formal class definitions, which describe the representation and inheritance for each class, and has special helper functions for defining generics and methods. 
	- S4 also has multiple dispatch, which means that generic functions can pick methods based on the class of any number of arguments, not just one.
- **Reference classes**, called **RC** for short, are quite different from S3 and S4. RC implements message-passing OO, so methods belong to classes, not functions. $ is used to separate objects and methods, so method calls look like `canvas$drawRect("blue")`. RC objects are also mutable: they don’t use R’s usual copy-on-modify semantics, but are modified in place. This makes them harder to reason about, but allows them to solve problems that are difficult to solve with S3 or S4.

In the examples below, you’ll need `install.packages("pryr")`, to access useful functions for examining OO properties.

### 4.1 Quiz <a name="4-1-Quiz"></a>

**Q:** How do you tell what OO system (base, S3, S4, or RC) an object is associated with?

- If `!is.object(x)`, it’s a base object. 
	- If `!isS4(x)`, it’s S3. 
		- If `!is(x, "refClass")`, it’s S4; 
			- otherwise it’s RC.

**Q:** How do you determine the base type (like integer or list) of an object?

- Use `typeof()` to determine the base class of an object.

**Q:** What is a generic function?

- A generic function calls specific methods depending on the class of it inputs. In S3 and S4 object systems, methods belong to generic functions, not classes like in other programming languages.

### 4.2 Base types <a name="4-2-Base-types"></a>

Underlying every R object is a C structure (or struct) that describes how that object is stored in memory. The struct includes the contents of the object, the information needed for memory management, and, most importantly for this section, a **type**. This is the base type of an R object. Base types are not really an object system because only the R core team can create new types. As a result, new base types are added very rarely.

Data structures section explains the most common base types (atomic vectors and lists), but base types also encompass functions, environments, and other more exotic objects likes names, calls, and promises.

You can determine an object’s base type with `typeof()`. Unfortunately the names of base types are not used consistently throughout R:

<pre class="prettyprint linenums">
# The type of a function is "closure"
f &lt;- function() {}
typeof(f)
#&gt; [1] "closure"
is.function(f)
#&gt; [1] TRUE

# The type of a primitive function is "builtin"
typeof(sum)
#&gt; [1] "builtin"
is.primitive(sum)
#&gt; [1] TRUE
</pre>

Functions that behave differently for different base types are almost always written in C, where dispatch occurs using switch statements (e.g., `switch(TYPEOF(x))`).

### 4.3 S3 <a name="4-3-S3"></a>

#### 4.3.1 Recognising objects, generic functions, and methods <a name="4-3-1-Recognising-objects-generic-functions-and-methods"></a>

Most objects that you encounter are S3 objects. But unfortunately there’s no simple way to test if an object is an S3 object in base R. The closest you can come is `is.object(x) & !isS4(x)`, i.e., it’s an object, but not S4. An easier way is to use `pryr::otype()`:

<pre class="prettyprint linenums">
library(pryr)

df &lt;- data.frame(x = 1:10, y = letters[1:10])
otype(df)    # A data frame is an S3 class
#&gt; [1] "S3"
otype(df$x)  # A numeric vector isn't
#&gt; [1] "base"
otype(df$y)  # A factor is
#&gt; [1] "S3"
</pre>

In S3, methods belong to functions, called generic functions, or generics for short. To determine if a function is an S3 generic, you can inspect its source code for a call to `UseMethod()`: that’s the function that figures out the correct method to call, the process of **method dispatch**. `pryr` also provides `ftype()` which describes the object system, if any, associated with a function:

<pre class="prettyprint linenums">
mean
#&gt; function (x, ...) 
#&gt; UseMethod("mean")
#&gt; &lt;bytecode: 0x2bc14a0&gt;
#&gt; &lt;environment: namespace:base&gt;
ftype(mean)
#&gt; [1] "s3"      "generic"
</pre>

Some S3 generics, like `[`, `sum()`, and `cbind()`, don’t call `UseMethod()` because they are implemented in C. Instead, they call the C functions `DispatchGroup()` or `DispatchOrEval()`. Functions that do method dispatch in C code are called internal generics and are documented in `?"internal generic"`. `ftype()` knows about these special cases too.

Given a class, the job of an S3 generic is to call the right S3 method. You can recognise S3 methods by their names, which look like `generic.class()`. For example, the Date method for the `mean()` generic is called `mean.Date()`, and the factor method for `print()` is called `print.factor()`.

This is the reason that most modern style guides discourage the use of `.` in function names: it makes them look like S3 methods.

<pre class="prettyprint linenums">
ftype(t.data.frame) # data frame method for t()
#&gt; [1] "s3"     "method"
ftype(t.test)       # generic function for t tests
#&gt; [1] "s3"      "generic"
</pre>

You can see all the methods that belong to a generic with `methods()`:

<pre class="prettyprint linenums">
methods("mean")
#&gt; [1] mean.Date     mean.default  mean.difftime mean.POSIXct  mean.POSIXlt
methods("t.test")
#&gt; [1] t.test.default* t.test.formula*
#&gt; 
#&gt;    Non-visible functions are asterisked
</pre>

Apart from methods defined in the base package, most S3 methods will not be visible: use `getS3method()` to read their source code.

You can also list all generics that have a method for a given class:

<pre class="prettyprint linenums">
methods(class = "ts")
#&gt;  [1] aggregate.ts     as.data.frame.ts cbind.ts*        cycle.ts*       
#&gt;  [5] diffinv.ts*      diff.ts*         kernapply.ts*    lines.ts*       
#&gt;  [9] monthplot.ts*    na.omit.ts*      Ops.ts*          plot.ts         
#&gt; [13] print.ts*        time.ts*         [&lt;-.ts*          [.ts*           
#&gt; [17] t.ts*            window&lt;-.ts*     window.ts*      
#&gt; 
#&gt;    Non-visible functions are asterisked
</pre>

#### 4.3.2 Defining classes and creating objects <a name="4-3-2-Defining-classes-and-creating-objects"></a>

S3 is a simple and ad hoc system; it has no formal definition of a class. To make an object an instance of a class, you just take an existing base object and set the class attribute. You can do that during creation with `structure()`, or after the fact with `class<-()`:

<pre class="prettyprint linenums">
# Create and assign class in one step
foo &lt;- structure(list(), class = "foo")

# Create, then set class
foo &lt;- list()
class(foo) &lt;- "foo"
</pre>

You can determine the class of any object using `class(x)`, and see if an object inherits from a specific class using inherits(x, "classname").

<pre class="prettyprint linenums">
class(foo)
#&gt; [1] "foo"
inherits(foo, "foo")
#&gt; [1] TRUE
</pre>

S3 objects are usually built on top of lists, or atomic vectors with attributes. You can also turn functions into S3 objects.

The class of an S3 object can be a vector, which describes behaviour from most to least specific. For example, the class of the `glm()` object is `c("glm", "lm")` indicating that generalised linear models inherit behaviour from linear models.

Most S3 classes provide a constructor function. This ensures that you’re creating the class with the correct components. Constructor functions usually have the same name as the class (like `factor()` and `data.frame()`).

<pre class="prettyprint linenums">
foo &lt;- function(x) {
  if (!is.numeric(x)) stop("X must be numeric")
  structure(list(x), class = "foo")
}
</pre>

Apart from developer supplied constructor functions, S3 has no checks for correctness. This means you can change the class of existing objects. If you’ve used other OO languages, this might make you feel queasy ([ˈkwi:zi], having an unpleasantly nervous or doubtful feeling).

#### 4.3.3 Creating new methods and generics <a name="4-3-3-Creating-new-methods-and-generics"></a>

一般的模式是这样的：

<pre class="prettyprint linenums">
f &lt;- function(x) UseMethod("f") # dispatch on the function name "f"

objA &lt;- structure(list(), class = "a") # we define an object, `objA`, of class `a`
f.a &lt;- function(x) { # f.a 专门负责 class 为 `a` 的参数
	# code goes here 
} 

f(objA) # dispatched to f.a(objA)
</pre>

其中 `f.a` 是一个 method，然后 `f` 是一个 generic。

Adding a method to an existing generic works in the same way:

<pre class="prettyprint linenums">
mean.a &lt;- function(x) {
	# code goes here 
}
mean(objA) # dispatched to mean.a(objA)
</pre>

A `default` class makes it possible to set up a fall back method for otherwise unknown classes:

<pre class="prettyprint linenums">
f.default <- function(x) {
	# code goes here 
}

objB &lt;- structure(list(), class = "b")

f(objB) # dispatched to f.default(objB) because we don't have `f.b(x)`
</pre>

### 4.4 S4 <a name="4-4-S4"></a>

S4 works in a similar way to S3, but it adds formality and rigour. Methods still belong to functions, not classes, but:

- Classes have formal definitions which describe their fields and inheritance structures (parent classes).
- Method dispatch can be based on multiple arguments to a generic function, not just one.
- There is a special operator, `@`, for extracting **slots** (aka **fields**) from an S4 object.

All S4 related code is stored in the `methods` package. This package is always available when you’re running R interactively, but may not be available when running R in batch mode. For this reason, it’s a good idea to include an explicit `library(methods)` whenever you’re using S4.

#### 4.4.1 Recognising objects, generic functions, and methods <a name="4-4-1-Recognising-objects-generic-functions-and-methods"></a>

You can identify an S4 object if: 

- `str()` describes it as a “formal” class, 
- `isS4()` returns TRUE, or
- `pryr::otype()` returns “S4”.

#### 4.4.2 Defining classes and creating objects <a name="4-4-2-Defining-classes-and-creating-objects"></a>

In S3, you can turn any object into an object of a particular class just by setting the class attribute. S4 is much stricter: you must define the representation of a class with `setClass()`, and create a new object with `new()`. You can find the documentation for a class with a special syntax: `class?className`, e.g., `class?mle`.

An S4 class has three key properties:

- A name: an alpha-numeric class identifier. By convention, S4 class names use `UpperCamelCase`.
- A named list of slots (fields), which defines slot names and permitted classes. 
	- For example, a person class might be represented by a character name and a numeric age: `list(name = "character", age = "numeric")`.
- A string giving the class it inherits from, or, in S4 terminology, that it **contains**. You can provide multiple classes for multiple inheritance, but this is an advanced technique which adds much complexity.

S4 classes have other optional properties like a `validity` method that tests if an object is valid, and a `prototype` object that defines default slot values. See `?setClass` for more details.

The following example creates a `Person` class with fields `name` and `age`, and an `Employee` class that inherits from `Person`. The `Employee` class inherits the slots and methods from the `Person`, and adds an additional slot, `boss`. To create objects we call `new()` with the name of the class, and name-value pairs of slot values.

<pre class="prettyprint linenums">
setClass("Person",
  slots = list(name = "character", age = "numeric"))
setClass("Employee",
  slots = list(boss = "Person"),
  contains = "Person")

alice &lt;- new("Person", name = "Alice", age = 40)
john &lt;- new("Employee", name = "John", age = 20, boss = alice)
</pre>

Most S4 classes also come with a constructor function with the same name as the class: if that exists, use it instead of calling `new()` directly.

To access slots of an S4 object use `@` or `slot()` (`@` is equivalent to `$`, and `slot()` to `[[`.):

<pre class="prettyprint linenums">
alice@age
#&gt; [1] 40
slot(john, "boss")
#&gt; An object of class "Person"
#&gt; Slot "name":
#&gt; [1] "Alice"
#&gt; 
#&gt; Slot "age":
#&gt; [1] 40
</pre>

If an S4 object contains (inherits from) an S3 class or a base type, it will have a special `.Data` slot which contains the underlying base type or S3 object.

#### 4.4.3 Creating new methods and generics <a name="4-4-3-Creating-new-methods-and-generics"></a>

S4 provides special functions for creating new generics and methods. `setGeneric()` creates a new generic or converts an existing function into a generic. `setMethod()` takes the name of the generic, the classes the method should be associated with, and a function that implements the method:

<pre class="prettyprint linenums">
setGeneric("union")
#&gt; [1] "union"
setMethod("union",
  c(x = "data.frame", y = "data.frame"),
  function(x, y) {
    unique(rbind(x, y))
  }
)
#&gt; [1] "union"
</pre>

If you create a new generic from scratch, you need to supply a function that calls `standardGeneric()`:

<pre class="prettyprint linenums">
setGeneric("myGeneric", function(x) {
  standardGeneric("myGeneric")
})
#&gt; [1] "myGeneric"
</pre>

`standardGeneric()` is the S4 equivalent to `UseMethod()`.

### 4.5 RC <a name="4-5-RC"></a>

They are fundamentally different to S3 and S4 because:

- RC methods belong to objects, not functions
- RC objects are mutable: the usual R copy-on-modify semantics do not apply

These properties make RC objects behave more like objects do in most other programming languages, e.g., Python, Ruby, Java, and C#. Reference classes are implemented using R code: they are a special S4 class that wraps around an environment.

#### 4.5.1 Defining classes and creating objects <a name="4-5-1-Defining-classes-and-creating-objects"></a>

<pre class="prettyprint linenums">
Account &lt;- setRefClass("Account",
  fields = list(balance = "numeric"))

a &lt;- Account$new(balance = 100)
a$balance
#&gt; [1] 100
a$balance &lt;- 200
a$balance
#&gt; [1] 200
</pre>

Note that RC objects are mutable, i.e., they have reference semantics, and are not copied-on-modify:

<pre class="prettyprint linenums">
b &lt;- a
b$balance
#&gt; [1] 200
a$balance &lt;- 0
b$balance
#&gt; [1] 0
</pre>

嗯，这真真是 reference。

For this reason, RC objects come with a `copy()` method that allow you to make a copy of the object:

<pre class="prettyprint linenums">
c &lt;- a$copy()
c$balance
#&gt; [1] 0
a$balance &lt;- 100
c$balance
#&gt; [1] 0
</pre>

RC methods are associated with a class and can modify its fields in place. In the following example, note that you access the value of fields with their name, and modify them with `<<-`:

<pre class="prettyprint linenums">
Account &lt;- setRefClass("Account",
  fields = list(balance = "numeric"),
  methods = list(
    withdraw = function(x) {
      balance &lt;&lt;- balance - x
    },
    deposit = function(x) {
      balance &lt;&lt;- balance + x
    }
  )
)
</pre>

The final important argument to `setRefClass()` is contains. This is the name of the parent RC class to inherit behaviour from. The following example creates a new type of bank account that returns an error preventing the balance from going below 0:

<pre class="prettyprint linenums">
NoOverdraft &lt;- setRefClass("NoOverdraft",
  contains = "Account",
  methods = list(
    withdraw = function(x) {
      if (balance &lt; x) stop("Not enough money")
      balance &lt;&lt;- balance - x
    }
  )
)
</pre>

All reference classes eventually inherit from `envRefClass`. It provides useful methods like 

- `copy()`,
- `callSuper()` (to call the parent field),
- `field()` (to get the value of a field given its name),
- `export()` (equivalent to `as()`), and 
- `show()` (overridden to control printing). 

See the inheritance section in `setRefClass()` for more details.

#### 4.5.2 Recognising objects and methods <a name="4-5-2-Recognising-objects-and-methods"></a>

You can recognise RC objects if they are S4 objects (`isS4(x)`) that inherit from “refClass” (`is(x, "refClass")`). `pryr::otype()` will return “RC”. RC methods are also S4 objects, with class `refMethodDef`.

#### 4.5.3 Method dispatch <a name="4-5-3-Method-dispatch"></a>

When you call `x$f()`, R will look for a method f in the class of `x`, then in its parent, then its parent’s parent, and so on. From within a method, you can call the parent method directly with `callSuper()`.

### 4.6 Picking a system <a name="4-6-Picking-a-system"></a>

- In R you usually create fairly simple objects and methods for pre-existing generic functions like `print()`, `summary()`, and `plot()`. S3 is well suited to this task, and the majority of OO code that I have written in R is S3. S3 is a little quirky, but it gets the job done with a minimum of code.
- If you are creating more complicated systems of interrelated objects, S4 may be more appropriate. A good example is the `Matrix` package by Douglas Bates and Martin Maechler. It is designed to efficiently store and compute with many different types of sparse matrices. S4 is also used extensively by `Bioconductor` packages, which need to model complicated interrelationships between biological objects (BTW, `Bioconductor` provides many good resources for learning S4.).
- If you’ve programmed in a mainstream OO language, RC will seem very natural. But because they can introduce side effects through mutable state.

## 5. Environments <a name="5--Environments"></a>

- The environment is the data structure that powers scoping.
- Environments can also be useful data structures in their own right because they have reference semantics. When you modify a binding in an environment, the environment is not copied; it’s modified in place.

### 5.1 Quiz <a name="5-1-Quiz"></a>

**Q:** List at least three ways that an environment is different to a list.

- There are four ways: every object in an environment must have a name; order doesn’t matter; environments have parents; environments have reference semantics.

**Q:** What is the parent of the global environment? What is the only environment that doesn’t have a parent?

- The parent of the global environment is the last package that you loaded. 
- The only environment that doesn’t have a parent is the empty environment.

**Q:** What is the enclosing environment of a function? Why is it important?

- The enclosing environment of a function is the environment where it was created. It determines where a function looks for variables.

**Q:** How are `<-` and `<<-` different?

- `<-` always creates a binding in the current environment; 
- `<<-` rebinds an existing name in a parent of the current environment.

### 5.2 Environment basics <a name="5-2-Environment-basics"></a>

The job of an environment is to associate, or **bind**, a set of names to a set of values. Each name points to an object stored elsewhere in memory:

<pre class="prettyprint linenums">
e &lt;- new.env()

e$a &lt;- FALSE
e$b &lt;- "a"
e$c &lt;- 2.3
e$d &lt;- 1:3

e$a &lt;- e$d # a 和 d 同时指向同一组 1:3
e$a &lt;- 1:3 # 此时 a 指向一组新的 1:3
</pre>

If an object has no names pointing to it, it gets automatically deleted by the garbage collector.

Every environment has a parent, another environment. The parent is used to implement lexical scoping: if a name is not found in an environment, then R will look in its parent (and so on). Only one environment doesn’t have a parent: the **empty** environment.

More technically, an environment is made up of two components: 

- the **frame**, which contains the name-object bindings, and 
- the parent environment. 

Unfortunately “frame” is used inconsistently in R. For example, `parent.frame()` doesn’t give you the parent frame of an environment. Instead, it gives you the calling environment.

There are four special environments:

- The `globalenv()`, or global environment, is the interactive workspace. This is the environment in which you normally work. The parent of the global environment is the last package that you attached with `library()` or `require()`.
- The `baseenv()`, or base environment, is the environment of the `base` package. Its parent is the empty environment.
- The `emptyenv()`, or empty environment, is the ultimate ancestor of all environments, and the only environment without a parent.
- The `environment()` is the current environment.

`search()` lists all parents of the global environment. This is called the **search path** because objects in these environments can be found from the top-level interactive workspace. It contains one environment for each attached package and any other objects that you've `attach()`ed. It also contains a special environment called `Autoloads` which is used to save memory by only loading package objects (like big datasets) when needed. 

You can access any environment on the search list using `as.environment()`.

<pre class="prettyprint linenums">
search()
#&gt; [1] ".GlobalEnv"        "package:stats"     "package:graphics" 
#&gt; [4] "package:grDevices" "package:utils"     "package:datasets" 
#&gt; [7] "package:methods"   "Autoloads"         "package:base"     

as.environment("package:stats")
#&gt; &lt;environment: package:stats&gt;
</pre>

`globalenv()`, `baseenv()`, the environments on the search path, and `emptyenv()` are connected as shown below. Each time you load a new package with `library()` it is inserted between the global environment and the package that was previously at the button of the search path.

![][search-path]

To create an environment manually, use `new.env()`:

<pre class="prettyprint linenums">
e &lt;- new.env()
# the default parent provided by new.env() is environment from 
# which it is called - in this case that's the global environment.
parent.env(e)
#&gt; &lt;environment: R_GlobalEnv&gt;

e$a &lt;- 1
e$b &lt;- 2
e$.a &lt;- 2

ls(e)
#&gt; [1] "a" "b"
ls(e, all.names = TRUE)
#&gt; [1] "a"  ".a" "b"

str(e)
#&gt; &lt;environment: 0x122f450&gt;

ls.str(e)
#&gt; a :  num 1
#&gt; b :  num 2
ls.str(e, all.names = TRUE)
#&gt; .a :  num 2
#&gt; a :  num 1
#&gt; b :  num 2

e$c &lt;- 3
e$c
#&gt; [1] 3
e[["c"]]
#&gt; [1] 3
get("c", envir = e) # get() uses the regular scoping rules and throws an error if the binding is not found
#&gt; [1] 3

rm(".a", envir = e) # e$.a &lt;- NULL 并不能 remove 掉 .a

x &lt;- 10
exists("x", envir = e)
#&gt; [1] TRUE
exists("x", envir = e, inherits = FALSE)
#&gt; [1] FALSE

# To compare environments, you must use identical() not ==:
identical(globalenv(), environment())
#&gt; [1] TRUE
globalenv() == environment()
#&gt; Error in globalenv() == environment(): comparison (1) is possible only for atomic and list types
</pre>

### 5.3 Recursing over environments <a name="5-3-Recursing-over-environments"></a>

<pre class="prettyprint linenums">
library(pryr)
x &lt;- 5
where("x")
#&gt; &lt;environment: R_GlobalEnv&gt;
where("mean")
#&gt; &lt;environment: base&gt;
</pre>

`where` 的实现大概是这样的：

<pre class="prettyprint linenums">
where &lt;- function(name, env = parent.frame()) {
  if (identical(env, emptyenv())) {
    # Base case
    stop("Can't find ", name, call. = FALSE)
  } else if (exists(name, envir = env, inherits = FALSE)) {
    # Success case
    env
  } else {
    # Recursive case
    where(name, parent.env(env))
  }
}
</pre>

### 5.4 Function environments <a name="5-4-Function-environments"></a>

- The **enclosing environment** is the environment where the function was created. 
	- Every function has one and only one enclosing environment.
- Binding a function to a name with `<-` defines a **binding environment**.
- Calling a function creates an ephemeral ([ɪˈfemərəl], lasting a very short time) **execution environment** that stores variables created during execution.
- Every execution environment is associated with a **calling environment**, which tells you where the function was called.
	- For the 3 types of environment above, there may be 0, 1, or many environments associated with each function.
	
#### 5.4.1 The enclosing environment <a name="5-4-1-The-enclosing-environment"></a>

When a function is created, it gains a reference to the environment where it was made. This is the __enclosing environment__ and is used for lexical scoping. You can determine the enclosing environment of a function by calling `environment(f)`:

<pre class="prettyprint linenums">
y &lt;- 1
f &lt;- function(x) x + y
environment(f)
#&gt; &lt;environment: R_GlobalEnv&gt;
</pre>

#### 5.4.2 Binding environments <a name="5-4-2-Binding-environments"></a>

The name of a function is defined by a binding. The binding environments of a function are all the environments which have a binding to it.

<pre class="prettyprint linenums">
e &lt;- new.env()
e$g &lt;- function() 1
</pre>

- 所谓 binding 就是 `foo <- bar` 这么一个赋值。binding environment 最简单的判断方法就是：变量（函数名）在哪个 environment，哪个 environment 就是 binding environment。比如上面的 `e$g <- function`，`g` 在 `e` 内部，所以 binding environment 就是 `e`
- 而 `e$g` 的 enclosing environment 是 global，因为 `function` 的定义是写在当前 workspace 的。实在吃不准的时候别忘了可以用 `environment(e$g)`
- The enclosing environment belongs to the function, and never changes, even if the function is moved to a different environment. 
- The enclosing environment determines how the function finds values; 
	- the binding environments determine how we find the function.
	
Namespaces are implemented using environments, taking advantage of the fact that functions don’t have to live in their enclosing environments. For example, take the base function `sd()`. It’s binding and enclosing environments are different:

<pre class="prettyprint linenums">
environment(sd)
#&gt; &lt;environment: namespace:stats&gt;
where("sd")
#&gt; &lt;environment: package:stats&gt;
</pre>

The definition of `sd()` uses `var()`, but if we make our own version of `var()` it doesn’t affect `sd()`:

<pre class="prettyprint linenums">
x &lt;- 1:10
sd(x)
#&gt; [1] 3.02765
var &lt;- function(x, na.rm = TRUE) 100
sd(x)
#&gt; [1] 3.02765
</pre>

This works because every package has two environments associated with it: the **package environment** and the **namespace environment**. 

- The package environment contains every publicly accessible function, and is placed on the search path. 
- The namespace environment contains all functions (including internal functions), and its parent environment is a special imports environment that contains bindings to all the functions that the package needs. 
- Every exported function in a package is bound into the package environment, but enclosed by the namespace environment. 

When we type `var` into the console, it’s found first in the global environment. When `sd()` looks for `var()` it finds it first in its namespace environment so never looks in the `globalenv()`.

#### 5.4.3 Execution environments <a name="5-4-3-Execution-environments"></a>

Each time a function is called, a new environment is created to host execution. Once the function has completed, this environment is thrown away.

#### 5.4.4 Calling environments <a name="5-4-4-Calling-environments"></a>

<pre class="prettyprint linenums">
f2 &lt;- function() {
  x &lt;- 5
  function() {
    innerX &lt;- get("x", environment())
    outerX &lt;- get("x", parent.frame())
    list(outerX = outerX, innerX = innerX, x = x)
  }
}
g2 &lt;- f2()
x &lt;- 47
str(g2())
#&gt; List of 3
#&gt;  $ outerX: num 47
#&gt;  $ innerX: num 5
#&gt;  $ x     : num 5
identical(parent.env(environment(g2)), environment(f2))
#&gt; [1] TRUE
</pre>

Note that each execution environment has two parents: a calling environment and an enclosing environment. R’s regular scoping rules only use the enclosing parent; `parent.frame()` allows you to access the calling parent.

Looking up variables in the calling environment rather than in the enclosing environment is called **dynamic scoping**. Dynamic scoping is primarily useful for developing functions that aid interactive data analysis. It is one of the topics discussed in "non-standard evaluation".

#### 5.4.5 Summary <a name="5-4-5-Summary"></a>

总结一下：

- Enclosing environment: 函数定义所在的 environment
	- 获取方法：
		- 在函数 `f` 外部调用 `environment(f)`
		- 在函数内部调用 `parent.env(environment())`
	- The enclosing environment belongs to the function, and never changes.
- Binding environment：函数名所在的 environment
	- 比如 `e$g <- function() {}`，binding environment 就是 `e`
- Execution environment：函数执行创建的 envrionment
	- 获取方法：函数内部调用 `environment()` (不带参数，表示 to get current environment)
	- Execution environment 有两个 parents：
		- Enclosing environment
		- Calling environment
	- 如果在 Execution environment 里找不到 variable，scoping 规定会去 Enclosing environment 里去找，而不会去 Calling environment
- Calling environment：the environment from which a function is called
	- 获取方法：函数内部调用 `parent.frame()` (不带参数)

实验：

<pre class="prettyprint linenums">
f &lt;- function() {
	print(environment())
	function() {
		print(environment())
		print(parent.frame())
		print(parent.env(environment()))
	}
}
g &lt;- f()
#&gt; &lt;environment: 0x0000000008175e28&gt; # SAME
g()
#&gt; &lt;environment: 0x0000000008181d68&gt;
#&gt; &lt;environment: R_GlobalEnv&gt;
#&gt; &lt;environment: 0x0000000008175e28&gt; # SAME
</pre>

### 5.5 Binding names to values <a name="5-5-Binding-names-to-values"></a>

- The regular assignment arrow, `<-`, always creates a variable in the current environment. 
- The deep assignment arrow, `<<-`, never creates a variable in the current environment, but instead modifies an existing variable found by walking up the parent environments. 
	- If `<<-` doesn’t find an existing variable, it will create one in the global environment.
	- You can also do deep binding with `assign()`: `name <<- value` is equivalent to `assign("name", value, inherits = TRUE)`.
	
There are two other special types of binding:

- A **delayed binding** creates and stores a promise to evaluate the expression when needed. 
	- We can create delayed bindings with the special assignment operator `%<d-%`, provided by the `pryr` package.
	- `%<d-%` is a wrapper around the base `delayedAssign()` function.
- An **active binding** does not bound to a constant object. Instead, they’re re-computed every time they’re accessed.
	- We can create active bindings with the special assignment operator `%<a-%`, provided by the `pryr` package.
	- `%<a-%` is a wrapper for the base function `makeActiveBinding()`.
	
<pre class="prettyprint linenums">
library(pryr)

x %&lt;d-% (a + b)
a &lt;- 10
b &lt;- 100
x
#&gt; [1] 110

set.seed(47)
x %&lt;a-% runif(1)
x
#&gt; [1] 0.976962
x
#&gt; [1] 0.373916
</pre>

### 5.6 Using environments explicitly <a name="5-6-Using-environments-explicitly"></a>

Environments are also useful data structures in their own right because they have **reference semantics**.

<pre class="prettyprint linenums">
modify &lt;- function(x) {
  x$a &lt;- 2
  invisible()
}

# CASE 1: pass by value
x_l &lt;- list()
x_l$a &lt;- 1
modify(x_l)
x_l$a
#&gt; [1] 1

# CASE 2: pass by reference
x_e &lt;- new.env()
x_e$a &lt;- 1
modify(x_e)
x_e$a
#&gt; [1] 2
</pre>

When creating your own environment, note that you should set its parent environment to be the empty environment. This ensures you don’t accidentally inherit objects from somewhere else:

<pre class="prettyprint linenums">
x &lt;- 1
e1 &lt;- new.env()
get("x", envir = e1)
#&gt; [1] 1

e2 &lt;- new.env(parent = emptyenv())
get("x", envir = e2)
#&gt; Error in get("x", envir = e2): object 'x' not found
</pre>

Environments are data structures useful for solving three common problems:

- Avoiding copies of large data.
- Managing state within a package.
- Efficiently looking up values from names.

#### 5.6.1 Avoiding copies <a name="5-6-1-Avoiding-copies"></a>

Since environments have reference semantics, you’ll never accidentally create a copy. This makes it a useful vessel for large objects. It’s a common technique for `bioconductor` packages which often have to manage large genomic objects. Changes to R 3.1.0 have made this use substantially less important because modifying a list no longer makes a deep copy. Previously, modifying a single element of a list would cause every element to be copied, an expensive operation if some elements are large. Now, modifying a list efficiently reuses existing vectors, saving much time.

#### 5.6.2 Package state <a name="5-6-2-Package-state"></a>

Explicit environments are useful in packages because they allow you to maintain state across function calls. Normally, objects in a package are locked, so you can’t modify them directly. Instead, you can do something like this:

<pre class="prettyprint linenums">
my_env &lt;- new.env(parent = emptyenv())
my_env$a &lt;- 1

get_a &lt;- function() {
  my_env$a
}
set_a &lt;- function(value) {
  old &lt;- my_env$a
  my_env$a &lt;- value
  invisible(old)
}
</pre>

#### 5.6.3 As a hashmap <a name="5-6-3-As-a-hashmap"></a>

A hashmap is a data structure that takes constant, `O(1)`, time to find an object based on its name. Environments provide this behaviour by default, so can be used to simulate a hashmap.

## 6. Debugging, condition handling, and defensive programming <a name="6--Debugging-condition-handling-and-defensive-programming"></a>

详细内容见 [原地址](http://adv-r.had.co.nz/Exceptions-Debugging.html)。实际操作时再来看学得更快。另外还有

- [Beyond Exception Handling: Conditions and Restarts](http://adv-r.had.co.nz/beyond-exception-handling.html) 

**Conditions** include:

- **Errors** raised by `stop()`
- **Warnings** raised by `warning()`
- **Messages** raised by `message()`

Condition handling tools, like `withCallingHandlers()`, `tryCatch()`, and `try()` allow you to take specific actions when a condition occurs.

### 6.1 Condition handling <a name="6-1-Condition-handling"></a>

#### 6.1.1 Ignore errors with a single try() <a name="6-1-1-Ignore-errors-with-a-single-try"></a>

`try()` allows execution to continue even after an error has occurred. If you wrap the statement that creates the error in `try()`, the error message will be printed but execution will continue

<pre class="prettyprint linenums">
f1 &lt;- function(x) {
  log(x)
  10
}
f1("x")
#&gt; Error in log(x): non-numeric argument to mathematical function

f2 &lt;- function(x) {
  try(log(x))
  10
}
f2("a")
#&gt; Error in log(x) : non-numeric argument to mathematical function
#&gt; [1] 10
</pre>

You can suppress the message with `try(..., silent = TRUE)`.

To pass larger blocks of code to `try()`, wrap them in `{}`:

<pre class="prettyprint linenums">
try({
  a &lt;- 1
  b &lt;- "x"
  a + b
})
</pre>

You can also capture the output of the try() function. If successful, it will be the last result evaluated in the block (just like a function). If unsuccessful it will be an (invisible) object of class `try-error`:

<pre class="prettyprint linenums">
success &lt;- try(1 + 2)
failure &lt;- try("a" + "b")
class(success)
#&gt; [1] "numeric"
class(failure)
#&gt; [1] "try-error"
</pre>

`try()` is particularly useful when you’re applying a function to multiple elements in a list. 这样把每个元素都过一遍，出错了也不要紧，最后的结果我们过滤掉 `try-error` 就好了：

<pre class="prettyprint linenums">
elements &lt;- list(1:10, c(-1, 10), c(T, F), letters)
results &lt;- lapply(elements, log) # 不用 try 的话会中断执行
#&gt; Warning in lapply(elements, log): NaNs produced
#&gt; Error in FUN(X[[4L]], ...): non-numeric argument to mathematical function
results &lt;- lapply(elements, function(x) try(log(x)))
#&gt; Warning in log(x): NaNs produced

# filter 函数：return TRUE if x inherits from "try-error"
is.error &lt;- function(x) inherits(x, "try-error")

succeeded &lt;- !sapply(results, is.error)

# look at successful results
str(results[succeeded])
#&gt; List of 3
#&gt;  $ : num [1:10] 0 0.693 1.099 1.386 1.609 ...
#&gt;  $ : num [1:2] NaN 2.3
#&gt;  $ : num [1:2] 0 -Inf

# look at inputs that failed
str(elements[!succeeded])
#&gt; List of 1
#&gt;  $ : chr [1:26] "a" "b" "c" "d" ...
</pre>

#### 6.1.2 Handle conditions with tryCatch() <a name="6-1-2-Handle-conditions-with-tryCatch"></a>

With `tryCatch()` you map conditions to handlers, named functions that are called with the condition as an input.

<pre class="prettyprint linenums">
show_condition &lt;- function(code) {
  tryCatch(code,
    error = function(c) print(c$message),
    warning = function(c) print(c$message),
    message = function(c) print(c$message)
  )
}

show_condition(stop("Error-1"))
#&gt; [1] "Error-1"
show_condition(warning("Warning-2"))
#&gt; [1] "Warning-2"
show_condition(message("Message-3"))
#&gt; [1] "Message-3\n"

# If no condition is captured, tryCatch returns the value of `code`
show_condition(10)
#&gt; [1] 10
</pre>

As well as returning default values when a condition is signalled, handlers can be used to make more informative error messages. For example, by modifying the message stored in the error condition object, the following function wraps `read.csv()` to add the file name to any errors:

<pre class="prettyprint linenums">
read.csv2 &lt;- function(file, ...) {
  tryCatch(read.csv(file, ...), error = function(c) {
    c$message &lt;- paste0(c$message, " (in ", file, ")")
    stop(c)
  })
}
read.csv("code/dummy.csv")
#&gt; Error in file(file, "rt"): cannot open the connection
read.csv2("code/dummy.csv")
#&gt; Error in file(file, "rt"): cannot open the connection (in code/dummy.csv)
</pre>

### 6.2 Defensive programming <a name="6-2-Defensive-programming"></a>

A key principle of defensive programming is to “**fail fast**”: as soon as something wrong is discovered, signal an error. This is more work for the author of the function (you!), but it makes debugging easier for users because they get errors earlier rather than later, after unexpected input has passed through several functions.

In R, the “fail fast” principle is implemented in three ways:

- Be strict about what you accept.
- Avoid functions that use non-standard evaluation, like `subset`, `transform`, and `with`.
- Avoid functions that return different types of output depending on their input. 
	- The two biggest offenders are `[` and `sapply()`. 
	- Whenever subsetting a data frame in a function, you should always use `drop = FALSE`, otherwise you will accidentally convert 1-column data frames into vectors. 
	- Similarly, never use `sapply()` inside a function: always use the stricter `vapply()` which will throw an error if the inputs are incorrect types and return the correct type of output even for zero-length inputs.
	
There is a tension between interactive analysis and programming. 

- When you’re working interactively, you want R to do what you mean. If it guesses wrong, you want to discover that right away so you can fix it. 
- When you’re programming, you want functions that signal errors if anything is even slightly wrong or underspecified. 

Keep this tension in mind when writing functions. 

- If you’re writing functions to facilitate interactive data analysis, feel free to guess what the analyst wants and recover from minor misspecifications automatically. 
- If you’re writing functions for programming, be strict. Never try to guess what the caller wants.

## 7. Functional programming <a name="7--Functional-programming"></a>

R, at its heart, is a functional programming (FP) language.

Then you’ll learn about the three building blocks of functional programming: 

- anonymous functions, 
- closures (functions written by functions), and 
- lists of functions.

我们举一个 anonymous function + function vector 的例子：

<pre class="prettyprint linenums">
x &lt;- 1:10

# 基础版
summary &lt;- function(x) {
  c(mean(x, na.rm = TRUE),
    median(x, na.rm = TRUE),
    sd(x, na.rm = TRUE),
    mad(x, na.rm = TRUE),
    IQR(x, na.rm = TRUE))
}

# 高阶版
summary &lt;- function(x) {
  funs &lt;- c(mean, median, sd, mad, IQR)
  lapply(funs, function(f) f(x, na.rm = TRUE))
}
</pre>

有点厉害。

### 7.1 Anonymous functions <a name="7-1-Anonymous-functions"></a>

In R, functions are objects in their own right. They aren’t automatically bound to a name. If you choose not to give the function a name, you get an **anonymous function**.

You can call an anonymous function without giving it a name, but the code is a little tricky to read:

<pre class="prettyprint linenums">
# 定义了一个 function，body 是 "3()"
# 这里 "3" 被当做一个函数名，因为没有被调用，所以没有报错
# 一旦调用这个函数，就会报错，以为 "3" 不是一个合法的函数名
function(x) 3()
#&gt; function(x) 3()

# With appropriate parenthesis, the function is called:
(function(x) 3)()
#&gt; [1] 3
(function(x) x + 3)(10)
#&gt; [1] 13
</pre>

### 7.2 Closures <a name="7-2-Closures"></a>

Closures are functions written by functions. Closures get their name because they enclose the environment of the parent function and can access all its variables. This is useful because it allows us to have two levels of parameters: 

- a parent level that controls operation and 
- a child level that does the work.

从上面这一段论述来看，好像被包的函数才叫 closure。

The following example uses this idea to generate a family of power functions in which a parent function (`power()`) creates two child functions (`square()` and `cube()`).

<pre class="prettyprint linenums">
power &lt;- function(exponent) {
  function(x) {
    x ^ exponent
  }
}

square &lt;- power(2)
square(2)
#&gt; [1] 4
square(4)
#&gt; [1] 16

cube &lt;- power(3)
cube(2)
#&gt; [1] 8
cube(4)
#&gt; [1] 64
</pre>

The difference between `square()` and `cube()` is their enclosing environments. One way to see the contents of the environment is to convert it to a list; Another way to see what’s going on is to use `pryr::unenclose()`.

<pre class="prettyprint linenums">
as.list(environment(square))
#&gt; $exponent
#&gt; [1] 2
as.list(environment(cube))
#&gt; $exponent
#&gt; [1] 3

library(pryr)
unenclose(square)
#&gt; function (x) 
#&gt; {
#&gt;     x^2
#&gt; }
unenclose(cube)
#&gt; function (x) 
#&gt; {
#&gt;     x^3
#&gt; }
</pre>

The parent environment of a closure is the execution environment of the function that created it. The execution environment normally disappears after the function returns a value. However, when function `outer` returns function `inner`, function `inner` captures and stores the execution environment of function `outer`, and it doesn’t disappear.

- Primitive functions call C code directly and don’t have an associated environment.

我们也称 `power()` 这样生成 function 的 function 为 **function factory**。Function factories are most useful when:

- The different levels are more complex, with multiple arguments and complicated bodies.
- Some work only needs to be done once, when the function is generated.

### 7.3 Mutable state <a name="7-3-Mutable-state"></a>

Having variables at two levels allows you to maintain state across function invocations. This is possible because **while the execution environment is refreshed every time, the enclosing environment is constant**.

<pre class="prettyprint linenums">
new_counter &lt;- function() {
  i &lt;- 0
  function() {
    i &lt;&lt;- i + 1
    i
  }
}

counter_a &lt;- new_counter()
counter_b &lt;- new_counter()

counter_a()
#&gt; [1] 1
counter_a()
#&gt; [1] 2
counter_a()
#&gt; [1] 3

counter_b()
#&gt; [1] 1
counter_b()
#&gt; [1] 2
counter_b()
#&gt; [1] 3
</pre>

是不是有点像 object 和 object member！

### 7.4 Lists of functions <a name="7-4-Lists-of-functions"></a>

起手式：

<pre class="prettyprint linenums">
x &lt;- 1:10

funs &lt;- list(
  sum = sum,
  mean = mean,
  median = median
)

lapply(funs, function(f) f(x))
#> $sum
#> [1] 55
#> 
#> $mean
#> [1] 5.5
#> 
#> $median
#> [1] 5.5
</pre>

## 8. Functionals <a name="8--Functionals"></a>

The complement to a closure is a functional, a function that takes a function as an input.

### 8.1 My first functional: lapply() <a name="8-1-My-first-functional-lapply"></a>

- Input `x` is a list.
	- Remember that data frames are also lists.
- Also returns a list.

![][lapply]

#### Looping patterns <a name="Looping-patterns"></a>

It’s useful to remember that there are three basic ways to loop over a vector:

- loop over the elements: `for (x in xs)`
	- Usually not a good choice if you generate output like `res <- c(); for (x in xs) { res <- c(res, sqrt(x)) }`--it copies `res` every step.
- loop over the numeric indices: `for (i in seq_along(xs))`
	- 比上面的情况好很多：`res <- numeric(length(xs)) for (i in seq_along(xs)) { res[i] <- sqrt(xs[i]) }`
- loop over the names: `for (nm in names(xs))`

Just as there are three basic ways to use a for loop, there are three basic ways to use `lapply()`:

- loop over the elements: `lapply(xs, function(x) {})`
	- `lapply()` takes care of saving the output for you.
- loop over the numeric indices: `lapply(seq_along(xs), function(i) {})`
- loop over the names: `lapply(names(xs), function(nm) {})`

#### Digress: parameter order <a name="Digress-parameter-order"></a>

假定有 `foo(x, y)`，如果不指定的话，`lapply(ms, foo, n)` 的参数顺序就是 `foo(m[[i]], n)`，如果指定了 `lapply(ms, foo, x=n)`，则参数顺序就是 `foo(n, m[[i]])`：

<pre class="prettyprint linenums">
foo &lt;- function(x, y) {
	c(x, y)
}

ms &lt;- 1:2
n &lt;- 47

lapply(ms, foo, n)
[[1]]
[1]  1 47

[[2]]
[1]  2 47

lapply(ms, foo, x=n)
[[1]]
[1] 47  1

[[2]]
[1] 47  2
</pre>

### 8.2 For loop functionals: friends of lapply() <a name="8-2-For-loop-functionals-friends-of-lapply"></a>

#### 8.2.1 Vector output: sapply and vapply <a name="8-2-1-Vector-output-sapply-and-vapply"></a>

`sapply()` and `vapply()` are very similar to `lapply()` except they simplify their output to produce an atomic vector. 

- While `sapply()` guesses, 
- `vapply()` takes an additional argument `FUN.VALUE` specifying the output type.

<pre class="prettyprint linenums">
sapply(mtcars, is.numeric)
#&gt;  mpg  cyl disp   hp drat   wt qsec   vs   am gear carb 
#&gt; TRUE TRUE TRUE TRUE TRUE TRUE TRUE TRUE TRUE TRUE TRUE
vapply(mtcars, is.numeric, logical(1))
#&gt;  mpg  cyl disp   hp drat   wt qsec   vs   am gear carb 
#&gt; TRUE TRUE TRUE TRUE TRUE TRUE TRUE TRUE TRUE TRUE TRUE
sapply(list(), is.numeric)
#&gt; list()
vapply(list(), is.numeric, logical(1))
#&gt; logical(0)
</pre>

关于 `vapply` 这里说两句：

- `logical(1)` 指长度为 1 的 logical vector；我们的 TRUE、FALSE 其实都是 `logical(1)`。这里 `FUN.VALUE = logical(1)` 的意思就是规定输出结果的每个元素都是 `logical(1)`
- 虽然 `is.numeric` 本身就是返回 TRUE/FALSE 的，但是 `FUN.VALUE` 这个参数必须要指定
- 如果 `FUN.VALUE` 指定为 `numeric(1)`，输出结果会把 TRUE 转成 1，FALSE 转为 0，相当于做了一个 `as.numeric(x)` 转换
- `character(1)` 是长度为 1 的 string vector，不要误解为是长度为 1 的 string：

<pre class="prettyprint linenums">
df &lt;- data.frame(x = 1:10, y = letters[1:10])
vapply(df, class, character(1))
#&gt;         x         y 
#&gt; "integer"  "factor"
</pre>

`sapply()` is a thin wrapper around `lapply()` that transforms a list into a vector in the final step. `vapply()` is an implementation of `lapply()` that assigns results to a vector (or matrix) of appropriate type instead of as a list. The following code shows a pure R implementation of the essence of `sapply()` and `vapply()` (the real functions have better error handling and preserve names, among other things).

<pre class="prettyprint linenums">
sapply2 &lt;- function(x, f, ...) {
  res &lt;- lapply2(x, f, ...)
  simplify2array(res)
}

vapply2 &lt;- function(x, f, f.value, ...) {
  out &lt;- matrix(rep(f.value, length(x)), nrow = length(x))
  for (i in seq_along(x)) {
    res &lt;- f(x[i], ...)
    stopifnot(
      length(res) == length(f.value),
      typeof(res) == typeof(f.value)
    )
    out[i, ] &lt;- res
  }
  out
}
</pre>

#### 8.2.2 Multiple inputs: Map (and mapply) <a name="8-2-2-Multiple-inputs-Map-and-mapply"></a>

`lapply(xs, foo)` 是循环 `foo(xs[[i]])`，那么 `Map(foo, xs, ys)` 就是循环 `foo(xs[[i]], ys[[i]])`。It is equivalent to:

<pre class="prettyprint linenums">
lapply(seq_along(xs), function(i) {
  foo(xs[[i]], ws[[i]])
})
</pre>

或者更严密一点：

<pre class="prettyprint linenums">
stopifnot(length(xs) == length(ws))
out &lt;- vector(mode="list", length=length(xs))
for (i in seq_along(xs)) {
  out[[i]] &lt;- weighted.mean(xs[[i]], ws[[i]])
}
</pre>

- 注意 `vector(mode="list")` 是创建了一个 list

Technically, `Map()` is equivalent to `mapply()` with `simplify = FALSE`, which is almost always what you want.

#### 8.2.3 Rolling computations <a name="8-2-3-Rolling-computations"></a>

What if you need a for-loop replacement that doesn’t exist in base R? You can often create your own wrapper. For example, you might be interested in smoothing your data using a rolling (or running) mean function:

<pre class="prettyprint linenums">
rollmean &lt;- function(x, n) {
  out &lt;- rep(NA, length(x))

  offset &lt;- trunc(n / 2)
  for (i in (offset + 1):(length(x) - n + offset + 1)) {
    out[i] &lt;- mean(x[(i - offset):(i + offset - 1)])
  }
  out
}
x &lt;- seq(1, 3, length = 1e2) + runif(1e2)
plot(x)
lines(rollmean(x, 5), col = "blue", lwd = 2)
lines(rollmean(x, 10), col = "red", lwd = 2)
</pre>

![][roll-mean-1]

But if the noise was more variable, you might worry that your rolling mean was too sensitive to outliers. Instead, you might want to compute a rolling median. 此时我们就可以重构一下，把 `mean` 和 `median` 作为参数传给我们自己的 apply 函数：

<pre class="prettyprint linenums">
rollapply &lt;- function(x, n, f, ...) {
  out &lt;- rep(NA, length(x))

  offset &lt;- trunc(n / 2)
  for (i in (offset + 1):(length(x) - n + offset + 1)) {
    out[i] &lt;- f(x[(i - offset):(i + offset)], ...)
  }
  out
}
plot(x)
lines(rollapply(x, 5, median), col = "red", lwd = 2)
</pre>

You might notice that the internal loop looks pretty similar to a `vapply()` loop, so we could rewrite the function as:

<pre class="prettyprint linenums">
rollapply &lt;- function(x, n, f, ...) {
  offset &lt;- trunc(n / 2)
  locs &lt;- (offset + 1):(length(x) - n + offset + 1)
  num &lt;- vapply(
    locs, 
    function(i) f(x[(i - offset):(i + offset)], ...),
    numeric(1)
  )

  c(rep(NA, offset), num)
}
</pre>

This is effectively the same as the implementation in `zoo::rollapply()`, which provides many more features and much more error checking.

#### 8.2.4 Parallelisation <a name="8-2-4-Parallelisation"></a>

- parallelisation: [pærəlelaɪ'zeɪʃən]

One interesting thing about the implementation of `lapply()` is that because each iteration is isolated from all others, the order in which they are computed doesn’t matter. 比如我们可以先计算 `foo(xs[[2]])` 再计算 `foo(xs[[1]])`。

This has a very important consequence: since we can compute each element in any order, it’s easy to dispatch the tasks to different cores, and compute them in parallel. This is what `parallel::mclapply()` (and `parallel::mcMap()`) does. (These functions are not available in Windows, but you can use the similar `parLapply()` with a bit more work.)

如果并行的任务太简单，`mclapply()` may be slower than `lapply()`. This is because the cost of the individual computations is low, and additional work is needed to send the computation to the different cores and to collect the results.

If we take a more realistic example, generating bootstrap replicates of a linear model for example, the advantages are clearer:

<pre class="prettyprint linenums">
boot_df &lt;- function(x) x[sample(nrow(x), rep = T), ]
rsquared &lt;- function(mod) summary(mod)$r.square
boot_lm &lt;- function(i) {
  rsquared(lm(mpg ~ wt + disp, data = boot_df(mtcars)))
}

system.time(lapply(1:500, boot_lm))
#&gt;    user  system elapsed 
#&gt;   1.527   0.008   1.565
system.time(mclapply(1:500, boot_lm, mc.cores = 2))
#&gt;    user  system elapsed 
#&gt;   0.706   0.065   0.774
</pre>

### 8.3 Manipulating matrices and data frames <a name="8-3-Manipulating-matrices-and-data-frames"></a>

In this section, we'll give a brief overview of the available options, hint at how they can help you, and point you in the right direction to learn more. We'll cover three categories of data structure functionals:

* `apply()`, `sweep()`, and `outer()` work with matrices.
* `tapply()` summarises a vector by groups defined by another vector.
* the `plyr` package, which generalises `tapply()` to make it easy to work with data frames, lists, or arrays as inputs, and data frames, lists, or arrays as outputs.

#### 8.3.1 Matrix and array operations <a name="8-3-1-Matrix-and-array-operations"></a>

You can think of `apply()` as an operation that summarises a matrix or array by **collapsing** each row or column to a single number. It has four arguments: 

* `X`, the matrix or array to summarise
* `MARGIN`, an integer vector giving the dimensions to summarise over, 1 = rows, 2 = columns, etc.
* `FUN`, a summary function
* `...` other arguments passed on to `FUN`

<pre class="prettyprint linenums">
a <- matrix(1:20, nrow = 5)
a
#>      [,1] [,2] [,3] [,4]
#> [1,]    1    6   11   16
#> [2,]    2    7   12   17
#> [3,]    3    8   13   18
#> [4,]    4    9   14   19
#> [5,]    5   10   15   20
apply(a, 1, mean)
#> [1]  8.5  9.5 10.5 11.5 12.5
apply(a, 2, mean)
#> [1]  3  8 13 18
</pre>

There are a few caveats to using `apply()`: 

- It doesn’t have a simplify argument, so you can never be completely sure what type of output you’ll get. This means that `apply()` is not safe to use inside a function unless you carefully check the inputs. 
- `apply()` is also not idempotent in the sense that if the summary function is the identity operator, the output is not always the same as the input.
	- idempotent: [aɪ'dempətənt], 幂等的, describing an action which, when performed multiple times, has no further effect on its subject after the first time it is performed.
	- You can put high-dimensional arrays back in the right order using `aperm()`, or use `plyr::aaply()`, which is idempotent.

<pre class="prettyprint linenums">
a &lt;- matrix(1:20, nrow = 5) # 5x4 matrix

# identity(x) == x，它就是这么一个无聊的用途……

a1 &lt;- apply(a, 1, identity) # 4x5 matrix. WTF!
a2 &lt;- apply(a, 2, identity) # 5x4 matrix. same with a
</pre>

`sweep()` allows you to “sweep” out the values of a summary statistic. It is often used with `apply()` to standardise arrays. The following example scales the rows of a matrix so that all values lie between 0 and 1:

<pre class="prettyprint linenums">
x &lt;- matrix(rnorm(20, 0, 10), nrow = 4)

# 每一 row 都减去自己 row 的 min，使得每一 row 的最小值都是 0
x1 &lt;- sweep(x, 1, apply(x, 1, min), `-`)
# 每一 row 都除以自己 row 的 max，使得每一 row 的最大值都是 1
x2 &lt;- sweep(x1, 1, apply(x1, 1, max), `/`)
</pre>

The final matrix functional is `outer()`. It’s a little different in that it takes multiple vector inputs and creates a matrix or array output where the input function is run over every combination of the inputs:

<pre class="prettyprint linenums">
outer(1:3, 1:10, "*")
#&gt;      [,1] [,2] [,3] [,4] [,5] [,6] [,7] [,8] [,9] [,10]
#&gt; [1,]    1    2    3    4    5    6    7    8    9    10
#&gt; [2,]    2    4    6    8   10   12   14   16   18    20
#&gt; [3,]    3    6    9   12   15   18   21   24   27    30
</pre>

#### 8.3.2 Group apply <a name="8-3-2-Group-apply"></a>

<pre class="prettyprint linenums">
x &lt;- 1:22
group &lt;- rep(c("A", "B"), c(10, 12)) # 10 个 A，12 个 B

tapply(x, group, length)
#&gt;  A  B 
#&gt; 10 12
tapply(x, group, mean)
#&gt;   A    B 
#&gt; 5.5 16.5 
</pre>

这里 `x` 和 `group` 是两个 vector，实际情况更多的是 data.frame 的两个 column。

`tapply()` is just the combination of `split()` and `sapply()`:

<pre class="prettyprint linenums">
&gt; split(x, group)
#&gt; $A
#&gt;  [1]  1  2  3  4  5  6  7  8  9 10
#&gt; $B
#&gt;  [1] 11 12 13 14 15 16 17 18 19 20 21 22

tapply2 &lt;- function(x, group, f, ..., simplify = TRUE) {
  pieces &lt;- split(x, group)
  sapply(pieces, f, simplify = simplify)
}
</pre>

#### 8.3.3 The plyr package <a name="8-3-3-The-plyr-package"></a>

One challenge with using the base functionals is that they have grown organically over time, and have been written by multiple authors. This means that they are not very consistent:

* With `tapply()` and `sapply()`, the simplify argument is called `simplify`.   With `mapply()`, it's called `SIMPLIFY`. With `apply()`, the argument is   absent.
* `vapply()` is a variant of `sapply()` that allows you to describe what the   output should be, but there are no corresponding variants for `tapply()`,   `apply()`, or `Map()`.
* The first argument of most base functionals is a vector, but the first   argument in `Map()` is a function. 

This makes learning these operators challenging, as you have to memorise all of the variations. Additionally, if you think about the possible combinations of input and output types, base R only covers a partial set of cases:

| input \ output | list       | data frame | array      |
|----------------|------------|------------|------------|
| list           | `lapply()` |            | `sapply()` |
| data frame     | `by()`     |            |            |
| array          |            |            | `apply()`  |

This was one of the driving motivations behind the creation of the `plyr` package. It provides consistently named functions with consistently named arguments and covers all combinations of input and output data structures:

| input \ output | list      | data frame | array     |
|----------------|-----------|------------|-----------|
| list           | `llply()` | `ldply()`  | `laply()` |
| data frame     | `dlply()` | `ddply()`  | `daply()` |
| array          | `alply()` | `adply()`  | `aaply()` |

Each of these functions splits up the input, applies a function to each piece, and then combines the results. Overall, this process is called "split-apply-combine".

### 8.4 Manipulating lists <a name="8-4-Manipulating-lists"></a>

Another way of thinking about functionals is as a set of general tools for altering, subsetting, and collapsing lists. Every functional programming language has three tools for this: `Map()`, `Reduce()`, and `Filter()`. We've seen `Map()` already, and the following sections describe:

- `Reduce()`, a powerful tool for extending two-argument functions, and 
- `Filter()`, a member of an important class of functionals that work with predicates, functions that return a single TRUE or FALSE.
- 没有一点点防备，就这样讲到了 MapReduce

#### 8.4.1 Reduce() <a name="8-4-1-Reduce"></a>

`Reduce()` reduces a vector, `x`, to a single value by recursively calling a function, `f`, two arguments at a time. It combines the first two elements with `f`, then combines the result of that call with the third element, and so on. Calling `Reduce(f, 1:3)` is equivalent to `f(f(1, 2), 3)`. Reduce is also known as fold, because it folds together adjacent elements in the list.

- `init` is an optional initial value
- `right=FALSE` indicates whether to from right to left
- `accumulate = FALSE` indicates whether the successive reduce combinations should be accumulated.
	- 比如  `` a <- 1:3; Reduce(`+`, a, accumulate=TRUE) `` 返回一个 vector [1 3 6]
	
Imagine you have a list of numeric vectors, and you want to find the values that occur in every element. Using `reduce()` make it easier: 

<pre class="prettyprint linenums">
set.seed(1130)
x &lt;- replicate(5, sample(1:5, 7, replace = T), simplify = FALSE)
str(x)
#&gt; List of 5
#&gt;  $ : int [1:7] 1 5 5 3 1 1 3
#&gt;  $ : int [1:7] 4 1 4 5 4 2 5
#&gt;  $ : int [1:7] 1 5 3 4 2 5 3
#&gt;  $ : int [1:7] 5 5 3 4 4 1 5
#&gt;  $ : int [1:7] 4 4 5 1 5 4 1
Reduce(intersect, x)
#&gt; [1] 1 5
</pre>

#### 8.4.2 Predicate functionals <a name="8-4-2-Predicate-functionals"></a>

A __predicate__ is a function that returns a single `TRUE` or `FALSE`, like `is.character`, `all`, or `is.NULL`. There are three useful predicate functionals in base R: 

* `Filter()` selects only those elements which match the predicate.
* `Find()` returns the first element which matches the predicate (or the last element if `right = TRUE`).
* `Position()` returns the position of the first element that matches the   predicate (or the last element if `right = TRUE`).
 
Another useful predicate functional is `where()`, a custom functional that generates a logical vector from a list (or a data frame) and a predicate: 

<pre class="prettyprint linenums">
where &lt;- function(f, x) {
  vapply(x, f, logical(1))
}
</pre>

The following example shows how you might use these functionals with a data frame:

<pre class="prettyprint linenums">
# 注意 stringsAsFactors 没有关
df &lt;- data.frame(x = 1:3, y = c("a", "b", "c"))
where(is.factor, df)
#&gt;     x     y 
#&gt; FALSE  TRUE
str(Filter(is.factor, df))
#&gt; 'data.frame':    3 obs. of  1 variable:
#&gt;  $ y: Factor w/ 3 levels "a","b","c": 1 2 3
str(Find(is.factor, df))
#&gt;  Factor w/ 3 levels "a","b","c": 1 2 3
Position(is.factor, df)
#&gt; [1] 2
</pre>

### 8.5 Mathematical functionals <a name="8-5-Mathematical-functionals"></a>

In this section we'll use some of R's built-in mathematical functionals. There are three functionals that work with functions to return single numeric values:

* `integrate(f, lower, upper)` calculates the area under the curve defined by `f()`, within \\( [lower, upper] \\)
	- i.e. 积分
* `uniroot(f, interval)` returns \\( x \\) where \\( x \in interval \\) and \\( f(x) = 0 \\)
* `optimise(f, interval)` finds the \\( x \\) of lowest (or highest) value of \\( f(x) \\)

<pre class="prettyprint linenums">
integrate(sin, 0, pi)
str(uniroot(sin, pi * c(1 / 2, 3 / 2)))
str(optimise(sin, c(0, 2 * pi)))
str(optimise(sin, c(0, pi), maximum = TRUE))
</pre>

In statistics, optimisation is often used for maximum likelihood estimation (MLE). In MLE, we have two sets of parameters: the data, which is fixed for a given problem, and the parameters, which vary as we try to find the maximum. These two sets of parameters make the problem well suited for closures. Combining closures with optimisation gives rise to the following approach to solving MLE problems. 

The following example shows how we might find the maximum likelihood estimate for \\( \lambda \\), if our data come from a Poisson distribution. First, we create a function factory that, given a dataset, returns a function that computes the negative log likelihood (NLL) for parameter `lambda`. In R, it's common to work with the negative since `optimise()` defaults to finding the minimum. 

<pre class="prettyprint linenums">
poisson_nll &lt;- function(x) {
  n &lt;- length(x)
  sum_x &lt;- sum(x)
  function(lambda) {
    n * lambda - sum_x * log(lambda) # + terms not involving lambda
  }
}
</pre>

Note how the closure allows us to precompute values that are constant with respect to the data.

We can use this function factory to generate specific NLL functions for input data. Then `optimise()` allows us to find the best values (the maximum likelihood estimates), given a generous starting range.

<pre class="prettyprint linenums">
x1 &lt;- c(41, 30, 31, 38, 29, 24, 30, 29, 31, 38)
x2 &lt;- c(6, 4, 7, 3, 3, 7, 5, 2, 2, 7, 5, 4, 12, 6, 9)
nll1 &lt;- poisson_nll(x1)
nll2 &lt;- poisson_nll(x2)
lambdas &lt;- c(0, 100)

optimise(nll1, lambdas)$minimum
#&gt; [1] 32.09999
optimise(nll2, lambdas)$minimum
#&gt; [1] 5.466681
</pre>

Another important mathematical functional is `optim()`. It is a generalisation of `optimise()` that works with more than one dimension. If you're interested in how it works, you might want to explore the `Rvmmin` package, which provides a pure-R implementation of `optim()`. Interestingly `Rvmmin` is no slower than `optim()`, even though it is written in R, not C. For this problem, the bottleneck lies not in controlling the optimisation but with having to evaluate the function multiple times. 

### 8.6 Loops that should be left as is <a name="8-6-Loops-that-should-be-left-as-is"></a>

Some loops have no natural functional equivalent. In this section you'll learn about three common cases: 

* modifying in place
	- If you need to modify part of an existing data frame, it’s often better to use a for-loop.
* recursive relationships
	- It’s hard to convert a for-loop into a functional when the relationship between elements is not independent, or is defined recursively.
	- independent elements 的意思是 element 的计算顺序有要求，比如要先计算 `xs[[i]]` 再计算 `xs[[i+1]]`。
		- `Reduce()` 可能有用，但不一定能照顾到所有的情况
* while-loops
	- 比如 `while (TRUE) { break }` 这种，你就不好改写成 functional
	
It's possible to torture these problems to use a functional, but it's not a good idea. You'll create code that is harder to understand, eliminating the main reason for using functionals in the first case.
	
## 9. Function operators (FOs) <a name="9--Function-operators-FOs"></a>

A function operator is a function that takes one (or more) functions as input and returns a function as output.

The chapter covers four important types of FO: 

- **Behaviour FOs** change the behaviour of a function like automatically logging usage to disk or ensuring that a function is run only once.
- **Output FOs** manipulate the output of a function, like capturing errors, or fundamentally change what the function does.
- **Input FOs** modify the inputs to a function.
- **Combining FOs** provide function composition and logical operations.

其实这一节更像是 R 的 design pattern，但是与 procedural 与 object-oriented 的做法都不一样，请仔细体会 

### 9.1 Behavioural FOs <a name="9-1-Behavioural-FOs"></a>

Behavioural FOs leave the inputs and outputs of a function unchanged, but add some extra behaviour. 

比如我们有一个 url 的 vector，要 download one by one，我们希望第 n 次下载开始后，间隔 1 秒再开始第 n+1 次，我们可以做这么一个 FO：

<pre class="prettyprint linenums">
delay_by &lt;- function(seconds, f) {
  function(...) {
    f(...)
	Sys.sleep(seconds)
  }
}
</pre>

若是我们希望每下载 10 个 url 就在 console 打一个 `.` 来表示 progress，可以做这么一个 FO：

<pre class="prettyprint linenums">
dot_every &lt;- function(n, f) {
  i &lt;- 1
  function(...) {
    if (i %% n == 0) cat(".")
    i &lt;&lt;- i + 1
    f(...)
  }
}
</pre>

Notice that I’ve made the function the last argument in each FO. This makes it easier to read when we compose multiple function operators:

<pre class="prettyprint linenums">
# Good practice
download &lt;- dot_every(10, delay_by(1, download_file))

# Bad practice
download &lt;- dot_every(delay_by(download_file, 1), 10)
</pre>

#### 9.1.1 Memoization <a name="9-1-1-Memoization"></a>

- memoize: memo + -ize, 发音这这么发
- memoization: (computer science) A technique in which partial results are recorded (forming a memo) and then can be re-used later without having to recompute them.

Another thing you might worry about when downloading multiple files is accidentally downloading the same file multiple times. You could avoid this by calling `unique()` on the list of input URLs, or manually managing a data structure that mapped the URL to the result. An alternative approach is to use memoization: modify a function to automatically cache its results.

你可以这样理解 memoized function：它维护了一个 `Map<Input, Output>`，对每一个 input，它先检查下有没有 output，有的话就直接返回，没有就按正常业务走，然后把这对 `<input, output>` 存到 Map 里。

A realistic use of memoisation is computing the Fibonacci series: 

<pre class="prettyprint linenums">
library(memoise)

fib &lt;- function(n) {
  if (n &lt; 2) return(1)
  fib(n - 2) + fib(n - 1)
}
system.time(fib(23))
#&gt;    user  system elapsed 
#&gt;   0.126   0.011   0.137
system.time(fib(24))
#&gt;    user  system elapsed 
#&gt;   0.205   0.000   0.205

fib2 &lt;- memoise(function(n) {
  if (n &lt; 2) return(1)
  fib2(n - 2) + fib2(n - 1)
})
system.time(fib2(23))
#&gt;    user  system elapsed 
#&gt;   0.005   0.000   0.004
system.time(fib2(24))
#&gt;    user  system elapsed 
#&gt;       0       0       0
</pre>

It doesn’t make sense to memoise all functions. For example, a memoised random number generator is no longer random.

#### 9.1.2 Capturing function invocations <a name="9-1-2-Capturing-function-invocations"></a>

这里的情形其实和我们 debug 时在函数前后打 log 的做法是一样的：

<pre class="prettyprint linenums">
ignore &lt;- function(...) NULL

tee &lt;- function(f, on_input = ignore, on_output = ignore) {
  function(...) {
    on_input(...)
    output &lt;- f(...)
    on_output(output)
    output
  }
}
</pre>

(The function is inspired by the unix shell command `tee`, which is used to split up streams of file operations so that you can both display what’s happening and save intermediate results to a file.)

We can use `tee()` to look inside the `uniroot()` functional, and see how it iterates its way to a solution:

<pre class="prettyprint linenums">
g &lt;- function(x) cos(x) - x
show &lt;- function(x, ...) cat(sprintf("%+.08f", x), "\n")

# The x it tries step by step
zeros &lt;- uniroot(tee(g, on_input = show), c(-5, 5))
#&gt; -5.00000000 
#&gt; +5.00000000 
#&gt; +0.28366219 
#&gt; +0.87520341 
#&gt; +0.72298040 
#&gt; +0.73863091 
#&gt; +0.73908529 
#&gt; +0.73902425 
#&gt; +0.73908529

# The g(x) value it gets per step
zeros &lt;- uniroot(tee(g, on_output = show), c(-5, 5))
#&gt; +5.28366219 
#&gt; -4.71633781 
#&gt; +0.67637474 
#&gt; -0.23436269 
#&gt; +0.02685676 
#&gt; +0.00076012 
#&gt; -0.00000026 
#&gt; +0.00010189 
#&gt; -0.00000026
</pre>

我们其实还可以再套一个 closure 把每一对 `<x, g(x)>` 都记录下来，然后再画个图啥的，具体就不展开了。

#### 9.1.3 Laziness <a name="9-1-3-Laziness"></a>

The function operators we've seen so far follow a common pattern:

<pre class="prettyprint linenums">
funop &lt;- function(f, otherargs) {
  function(...) {
    # maybe do something
    res &lt;- f(...)
    # maybe do something else
    res
  }
}
</pre>

Unfortunately there's a problem with this implementation because function arguments are lazily evaluated: `f()` may have changed between applying the FO and evaluating the function. This is a particular problem if you're using a for loop or `lapply()` to apply multiple function operators. In the following example, we take a list of functions and delay each one. But when we try to evaluate the mean, we get the sum instead: 

<pre class="prettyprint linenums">
funs &lt;- list(mean = mean, sum = sum)
funs_m &lt;- lapply(funs, delay_by, seconds = 0.1)

funs_m$mean(1:10)
#&gt; [1] 55
</pre>

We can avoid that problem by explicitly forcing the evaluation of `f()`:

<pre class="prettyprint linenums">
delay_by &lt;- function(seconds, f) {
  force(f) # the skeleton key
  function(...) {
    Sys.sleep(seconds)
    f(...)
  }
}
</pre>

It's good practice to do that whenever you create a new FO.

### 9.2 Output FOs <a name="9-2-Output-FOs"></a>

#### 9.2.1 Minor modifications <a name="9-2-1-Minor-modifications"></a>

- `base::Negate(f)` takes a function that returns a logical vector (i.e. a predicate function), and returns the negation of that function.
	- negate: [nɪˈgeɪt], (grammar) to make (a word or phrase) negative
	- 比如 `Negate(is.null)` 返回一个相当于 `!is.null()` 的 function，我们可以就可以测试参数是否为 "非 NULL"：`(Negate(is.null))(x)`
- `plyr::failwith(defaultResult, f)` turns a function that throws an error into a function that returns a default value when there’s an error.
	- 不用自己写 try 或是 tryCatch 了
	
#### 9.2.2 Changing what a function does <a name="9-2-2-Changing-what-a-function-does"></a>

举两个例子：

<pre class="prettyprint linenums">
# EG 1: Return text that the function printed
capture_it &lt;- function(f) {
  force(f)
  function(...) {
    capture.output(f(...))
  }
}
str_out &lt;- capture_it(str)
str(1:10)
#&gt;  int [1:10] 1 2 3 4 5 6 7 8 9 10
str_out(1:10)
#&gt; [1] " int [1:10] 1 2 3 4 5 6 7 8 9 10"

# EG 2: Return how long a function took to run
time_it &lt;- function(f) {
  force(f)
  function(...) {
    system.time(f(...))
  }
}
</pre>

### 9.3 Input FOs <a name="9-3-Input-FOs"></a>

#### 9.3.1 Prefilling function arguments: partial function application <a name="9-3-1-Prefilling-function-arguments-partial-function-application"></a>

比如我们有一个函数有 n 个参数，但是实际应用的时候，有 m 个参数的值都是固定的。为了不用每次都写那么长一串参数，我们很容易想到写一个只有 (n-m) 个函数来把这个函数包起来。我们称这种做法为 partial function application，而 `pryr::partial()` 给我们提供了一种简写的方式：

<pre class="prettyprint linenums">
# 一般的写法：
f &lt;- function(a) g(a, b = 1) # 绑定 b=1
compact &lt;- function(x) Filter(Negate(is.null), x) # 绑定第一个参数为 Negate(is.null)
Map(function(x, y) f(x, y, zs), xs, ys) # 绑定第三个参数为 zs

# 用 partial() 的写法：
f &lt;- partial(g, b = 1)
compact &lt;- partial(Filter, Negate(is.null))
Map(partial(f, zs = zs), xs, ys)
</pre>

NB: Using partial function application is a straightforward task in many functional programming languages, but it’s not entirely clear how it should interact with R’s lazy evaluation rules.

#### 9.3.2 Changing input types <a name="9-3-2-Changing-input-types"></a>

`base::Vectorize()` creates a function wrapper that vectorizes the action of its argument `FUN`. 有点不好解释，看下面的例子：

<pre class="prettyprint linenums">
sample2 &lt;- Vectorize(sample, "size", SIMPLIFY = FALSE)
str(sample2(1:5, c(1, 1, 3))) # size=1, size=1 and size=3 
#&gt; List of 3
#&gt;  $ : int 3
#&gt;  $ : int 4
#&gt;  $ : int [1:3] 5 4 3
</pre>

- `SIMPLIFY = FALSE` ensures that our newly vectorised function always returns a list. This is usually what you want.

`splat()` converts a function that takes multiple arguments to a function that takes a single list of arguments. This is useful when you want to run a function with different argument composition.

<pre class="prettyprint linenums">
splat &lt;- function (f) {
  force(f)
  function(args) {
    do.call(f, args)
  }
}

x &lt;- c(NA, runif(100), 1000)
args &lt;- list(
  list(x),							# 第一套参数
  list(x, na.rm = TRUE),			# 第二套参数
  list(x, na.rm = TRUE, trim = 0.1) # 第三套参数
)
lapply(args, splat(mean))
#&gt; [[1]]
#&gt; [1] NA
#&gt; [[2]]
#&gt; [1] 10.4192
#&gt; [[3]]
#&gt; [1] 0.5280969
</pre>

`plyr::colwise(f)(df)` apply function `f` column-wise to `df`:

<pre class="prettyprint linenums">
median(mtcars)
#&gt; Error in median.default(mtcars): need numeric data
median(mtcars$mpg)
#&gt; [1] 19.2
plyr::colwise(median)(mtcars)
#&gt;    mpg cyl  disp  hp  drat    wt  qsec vs am gear carb
#&gt; 1 19.2   6 196.3 123 3.695 3.325 17.71  0  0    4    2
</pre>

### 9.4. Combining FOs <a name="9-4--Combining-FOs"></a>

#### 9.4.1 Aggregating multiple functions into a single function <a name="9-4-1-Aggregating-multiple-functions-into-a-single-function"></a>

<pre class="prettyprint linenums">
summaries &lt;- plyr::each(mean, sd, median)
summaries(1:10)
#&gt;    mean      sd  median 
#&gt; 5.50000 3.02765 5.50000
</pre>

#### 9.4.2 Function composition <a name="9-4-2-Function-composition"></a>

这里说的 composition 指 `f(g(x))` 这种形式，我们可以用 `pryr::compose(f, g)` 来实现：

<pre class="prettyprint linenums">
sapply(mtcars, compose(length, unique))
#&gt;  mpg  cyl disp   hp drat   wt qsec   vs   am gear carb 
#&gt;   25    3   27   22   22   29   30    2    2    3    6

# 等价于 sapply(mtcars, function(x) length(unique(x)))
</pre>

Mathematically, function composition is often denoted with the infix operator, `o`, like `(f o g)(x)`. In R, we can create our own infix composition function:

<pre class="prettyprint linenums">
"%o%" &lt;- compose
sapply(mtcars, length %o% unique)
#&gt;  mpg  cyl disp   hp drat   wt qsec   vs   am gear carb 
#&gt;   25    3   27   22   22   29   30    2    2    3    6

sqrt(1 + 8)
#&gt; [1] 3
compose(sqrt, `+`)(1, 8)
#&gt; [1] 3
(sqrt %o% `+`)(1, 8)
#&gt; [1] 3
</pre>

Compose also allows for a very succinct implementation of `Negate`, which is just a partially evaluated version of `compose()`:

<pre class="prettyprint linenums">
Negate &lt;- partial(compose, `!`)
</pre>

We could implement the population standard deviation with function composition:

<pre class="prettyprint linenums">
square &lt;- function(x) x^2
deviation &lt;- function(x) x - mean(x)

sd2 &lt;- sqrt %o% mean %o% square %o% deviation
sd2(1:10)
#&gt; [1] 2.872281
</pre>

This type of programming is called tacit or **point-free programming**. (The term point-free comes from the use of “point” to refer to values in topology; this style is also derogatorily known as pointless). In this style of programming, you don’t explicitly refer to variables. Instead, you focus on the high-level composition of functions rather than the low-level flow of data. The focus is on what’s being done, not on objects it’s being done to. Since we’re using only functions and not parameters, we use verbs and not nouns. This style is common in Haskell, and is the typical style in stack based programming languages like Forth and Factor. It’s not a terribly natural or elegant style in R, but it is fun to play with.

综合 `compose()` 和 `partial()` 我们可以改写本章开头的那个例子：

<pre class="prettyprint linenums">
download &lt;- dot_every(10, memoise(delay_by(1, download_file)))

# 新写法
download &lt;- pryr::compose(
  partial(dot_every, 10),
  memoise,
  partial(delay_by, 1),
  download_file
)
</pre>

#### 9.4.3 Logical predicates and boolean algebra <a name="9-4-3-Logical-predicates-and-boolean-algebra"></a>

举几个例子：

<pre class="prettyprint linenums">
and &lt;- function(f1, f2) {
  force(f1); force(f2)
  function(...) {
    f1(...) && f2(...)
  }
}

or &lt;- function(f1, f2) {
  force(f1); force(f2)
  function(...) {
    f1(...) || f2(...)
  }
}

not &lt;- function(f) {
  force(f)
  function(...) {
    !f(...)
  }
}
</pre>

This would allow us to write:

<pre class="prettyprint linenums">
Filter(or(is.character, is.factor), iris)
Filter(not(is.numeric), iris)
</pre>

是不是方便多了~

## 10. Non-standard evaluation <a name="10--Non-standard-evaluation"></a>

### 10.1 Capturing expressions <a name="10-1-Capturing-expressions"></a>

Instead of using the value, `substitute(x)` or `quote(x)` returns the code of its parameter (i.e. the expression):

<pre class="prettyprint linenums">
f &lt;- function(x) {
  substitute(x)
}
f(1:10)
#&gt; 1:10

x &lt;- 10 
f(x)
#&gt; x

y &lt;- 13 
f(x + y^2)
#&gt; x + y^2
</pre>

上面这个例子中，`substitute()` 是在函数内部使用的，而且是直接作用于函数的参数，这个使用场景需要注意，因为不同的使用场景对 `substitute()` 的结果会有影响。

`substitute()` 和 `quote()` 的区别在于：

- `quote(x)` 直接返回 expression `x`，没有任何附加的处理
- `substitute(x, env)` returns the parse tree for expression `x` (目前可以简单理解为就是 expression), substituting any variables bound in `env`.
	- `env` defaults to the current evaluation environment.
	- Substitution takes place by examining each component of the parse tree as follows: 
		- CASE 1: If it is not a bound symbol in `env`, it is unchanged.
		- CASE 2: 如果不是 CASE 1 的话，it is an ordinary variable in `env`, and its value will be substituted, unless `env` is `.GlobalEnv` in which case the symbol is left unchanged.
		- CASE 3: If it is a promise object, i.e., a formal argument to a function or explicitly created using `delayedAssign()`, the expression slot of the promise replaces the symbol. 
			- Function arguments are represented by a special type of object called a __promise__, which contain three slots: 
				- a value (lazy evaluated), 
				- an expression, and 
				- an environment.
			- 上面的例子就是这种情况。
			- You're not normally aware of promises because the first time you access a promise its code is evaluated in its environment, yielding a value. 
		
我们举个 CASE 1 和 CASE 2 的例子：

<pre class="prettyprint linenums">
e &lt;- new.env()
e$a &lt;- 5
substitute(a+b, e)
#&gt; 5 + b
quote(a+b)
#&gt; a + b
quote(e$a+e$b)
#&gt; e$a + e$b
</pre>

`substitute()` and `quote()` are often paired with `deparse()`. That function takes an expression, and turns it into a character vector:

<pre class="prettyprint linenums">
g &lt;- function(x) deparse(substitute(x))
g(1:10)
#&gt; [1] "1:10"
g(x)
#&gt; [1] "x"
g(x + y^2)
#&gt; [1] "x + y^2"
</pre>  

这样 `plot(x, y)` 才能知道在 x-axis 上写 "x"、在 y-axis 上写 "y" (如果是 data.frame 的话可以用 `names(df)`)。

There are a lot of functions in Base R that use these ideas. Some use them to avoid quotes:

<pre class="prettyprint linenums">
library(ggplot2)
# the same as
library("ggplot2")
</pre>

### 10.2 Non-standard evaluation in subset <a name="10-2-Non-standard-evaluation-in-subset"></a>

<pre class="prettyprint linenums">
sample_df &lt;- data.frame(a = 1:5, b = 5:1, c = c(5, 3, 1, 4, 1))

subset(sample_df, a &gt;= 4)
# equivalent to:
sample_df[sample_df$a &gt;= 4, ]

subset(sample_df, b == c)
# equivalent to:
sample_df[sample_df$b == sample_df$c, ]
</pre>

`subset()` is special because it implements different scoping rules: the expressions `a >= 4` or `b == c` are evaluated in the specified data frame rather than in the current or global environments. This is the essence of non-standard evaluation.

How does `subset()` work? We've already seen how to capture an argument's expression rather than its result, so we just need to figure out how to evaluate that expression in the right context. Specifically, we want `x` to be interpreted as `sample_df$x`, not `globalenv()$x`. To do this, we need `eval()`. This function takes an expression and evaluates it in the specified environment: 

<pre class="prettyprint linenums">
eval(quote(x &lt;- 1))
eval(quote(x))
#&gt; [1] 1

eval(quote(y))
#&gt; Error in eval(expr, envir, enclos): object 'y' not found

e &lt;- new.env()
e$x &lt;- 20
eval(quote(x), e) # evaluate in envrionment e
#&gt; [1] 20
</pre>

Because lists and data frames bind names to values in a similar way to environments, `eval()`’s second argument need not be limited to an environment: it can also be a list or a data frame:

<pre class="prettyprint linenums">
eval(quote(x), list(x = 30))
#&gt; [1] 30
eval(quote(x), data.frame(x = 40))
#&gt; [1] 40
</pre>

This gives us one part of `subset()`:

<pre class="prettyprint linenums">
eval(quote(a &gt;= 4), sample_df)
#&gt; [1] FALSE FALSE FALSE  TRUE  TRUE
eval(quote(b == c), sample_df)
#&gt; [1]  TRUE FALSE FALSE FALSE  TRUE
</pre>

A common mistake when using `eval()` is to forget to quote the first argument. Compare the results below:

<pre class="prettyprint linenums">
a &lt;- 10
eval(quote(a), sample_df)
#&gt; [1] 1 2 3 4 5
eval(a, sample_df)
#&gt; [1] 10
</pre>

Now we can use `eval()` and `substitute()` to write `subset()`:

<pre class="prettyprint linenums">
# Caution: Scoping issue
subset2 &lt;- function(x, condition) {
  condition_call &lt;- substitute(condition)
  r &lt;- eval(condition_call, x)
  x[r, ]
}
subset2(sample_df, a &gt;= 4)
#&gt;   a b c
#&gt; 4 4 2 4
#&gt; 5 5 1 1
</pre>

### 10.3 Scoping issues <a name="10-3-Scoping-issues"></a>

There is something wrong with the previous implementation:

<pre class="prettyprint linenums">
x &lt;- 4
y &lt;- 4

subset2(sample_df, a == 4) # OK
#&gt;   a b c
#&gt; 4 4 2 4
subset2(sample_df, a == y) # OK
#&gt;   a b c
#&gt; 4 4 2 4
subset2(sample_df, a == x) # WTF!
#&gt;       a  b  c
#&gt; 1     1  5  5
#&gt; 2     2  4  3
#&gt; 3     3  3  1
#&gt; 4     4  2  4
#&gt; 5     5  1  1
#&gt; NA   NA NA NA
#&gt; NA.1 NA NA NA
</pre>

What went wrong? In the previous implementation, if `eval()` can’t find the variable inside the data frame (its second argument), it looks first in the environment of `subset2()`. That’s obviously not what we want, so we need some way to tell `eval()` where to look if it can’t find the variables in the data frame.

The key is the third argument to `eval()`: `enclos`. This allows us to specify a parent (or enclosing) environment for objects that don’t have one (like lists and data frames). If the binding is not found in `env`, `eval()` will next look in `enclos`, and then in the parents of `enclos`. `enclos` is ignored if `env` is a real environment. We want to look for `x` in the environment from which `subset2()` was called. In R terminology this is called the parent frame and is accessed with `parent.frame()`. This is an example of **dynamic scoping**: the values come from the location where the function was called, not where it was defined:

<pre class="prettyprint linenums">
subset2 &lt;- function(x, condition) {
  condition_call &lt;- substitute(condition)
  r &lt;- eval(condition_call, x, parent.frame())
  x[r, ]
}

x &lt;- 4
subset2(sample_df, a == x)
#&gt;   a b c
#&gt; 4 4 2 4
</pre>

We can get the same behaviour by using `list2env()`. It turns a list into an environment with an explicit parent:

<pre class="prettyprint linenums">
subset2a &lt;- function(x, condition) {
  condition_call &lt;- substitute(condition)
  env &lt;- list2env(x, parent = parent.frame())
  r &lt;- eval(condition_call, env)
  x[r, ]
}
</pre>

### 10.4 Calling from another function <a name="10-4-Calling-from-another-function"></a>

这一段的论述其实我没有看懂。它主要说的问题就是外部函数把 expression 作为参数传到其调用的内部函数（比如上面的 `subset2()`）时会出现一个有点微妙的错误，比如：

<pre class="prettyprint linenums">
subset2 &lt;- function(x, condition) {
  condition_call &lt;- substitute(condition)
  r &lt;- eval(condition_call, x, parent.frame())
  x[r, ]
}

scramble &lt;- function(x) x[sample(nrow(x)), ]

subscramble &lt;- function(x, condition) {
  scramble(subset2(x, condition))
}

subscramble(sample_df, a &gt;= 4)
# Error in eval(expr, envir, enclos) : object 'a' not found
</pre>

修正的方案是把 `condition` 放在外部函数 `subscramble()` 里转成 expression，然后 `subset2` 里不做 `substitute()` 或是 `quote()`，直接 `eval()`:

<pre class="prettyprint linenums">
subset2_q &lt;- function(x, condition) {
  r &lt;- eval(condition, x, parent.frame())
  x[r, ]
}

subscramble &lt;- function(x, condition) {
  condition &lt;- substitute(condition)
  scramble(subset2_q(x, condition))
}

subscramble(sample_df, a &gt;= 3)
#&gt;   a b c
#&gt; 4 4 2 4
#&gt; 5 5 1 1
#&gt; 3 3 3 1
</pre>

出错的原因我觉得在于：在 `subscramble()` 内部，`condition` 已经被 evaluate 了一次，此时 `a >= 3` 这样的式子在 `subscramble()` 的 environment（以及其 parent）中必定是找不到 object `a` 的，所以这个已经被 evaluate 的结果，再传给 `eval()`，报的错误还是说找不到 object `a`。

除此之外，本节 debug 的手法值得学习一下：

<pre class="prettyprint linenums">
# Debugging Example 1

subscramble(sample_df, a &gt;= 4)
# Error in eval(expr, envir, enclos) : object 'a' not found
traceback()
#&gt; 5: eval(expr, envir, enclos)
#&gt; 4: eval(condition_call, x, parent.frame()) at #3
#&gt; 3: subset2(x, condition) at #1
#&gt; 2: scramble(subset2(x, condition)) at #2
#&gt; 1: subscramble(sample_df, a &gt;= 4)

# Debugging Example 2

debugonce(subset2)
subscramble(sample_df, a &gt;= 4)
#&gt; debugging in: subset2(x, condition)
#&gt; debug at #1: {
#&gt;     condition_call &lt;- substitute(condition)
#&gt;     r &lt;- eval(condition_call, x, parent.frame())
#&gt;     x[r, ]
#&gt; }
n
#&gt; debug at #2: condition_call &lt;- substitute(condition)
n
#&gt; debug at #3: r &lt;- eval(condition_call, x, parent.frame())
r &lt;- eval(condition_call, x, parent.frame())
#&gt; Error in eval(expr, envir, enclos) : object 'a' not found
condition_call
#&gt; condition
eval(condition_call, x)
#&gt; Error in eval(expr, envir, enclos) : object 'a' not found
Q
</pre>

### 10.5 More on substitute() <a name="10-5-More-on-substitute"></a>

To make it easier to experiment with `substitute()`, `pryr` provides the `subs()` function. It works exactly the same way as `substitute()` except it has a shorter name and **it works in the global environment**. These two features make experimentation easier:

<pre class="prettyprint linenums">
a &lt;- 1
b &lt;- 2
subs(a + b + z)
#&gt; 1 + 2 + z
</pre>

The second argument `env` (of both `subs()` and `substitute()`) can override the use of the current environment, and provide an alternative via a list of name-value pairs:

<pre class="prettyprint linenums">
subs(a + b, list(a = "y"))
#&gt; "y" + b
subs(a + b, list(a = quote(y)))
#&gt; y + b
subs(a + b, list(a = quote(y())))
#&gt; y() + b
</pre>

Remember that every action in R is a function call, so we can also replace `+` with another function:

<pre class="prettyprint linenums">
subs(a + b, list("+" = quote(f)))
#&gt; f(a, b)
subs(a + b, list("+" = quote(`*`)))
#&gt; a * b
</pre>

#### Adding an escape hatch to substitute() <a name="Adding-an-escape-hatch-to-substitute"></a>

`substitute()` is itself a function that uses non-standard evaluation and doesn’t have an escape hatch. This means we can’t use `substitute()` if we already have an expression saved in a variable:

<pre class="prettyprint linenums">
x &lt;- quote(a + b)
substitute(x, list(a = 1, b = 2))
#&gt; x
</pre>

Although `substitute()` doesn’t have a built-in escape hatch, we can use the function itself to create one:

<pre class="prettyprint linenums">
substitute_q &lt;- function(x, env) {
  call &lt;- substitute(substitute(y, env), list(y = x))
  eval(call)
}

x &lt;- quote(a + b)
substitute_q(x, list(a = 1, b = 2))
#&gt; 1 + 2
</pre>

- First, the expression `substitute(y, env)` is captured and `y` is replaced by the value of `x`. Because we’ve put `x` inside a list, it will be evaluated and the rules of substitute will replace `y` with its value. This yields the expression `substitute(a + b, env)`.
- Next we evaluate `substitute(a + b, env)` given `env=list(a = 1, b = 2)` and the result will be `1 + 2`.

#### Capturing unevaluated `…` <a name="Capturing-unevaluated-"></a>

Another useful technique is to capture all of the unevaluated expressions in `...`. Base R functions do this in many ways, but there’s one technique that works well across a wide variety of situations:

<pre class="prettyprint linenums">
dots &lt;- function(...) {
  eval(substitute(alist(...)))
}
</pre>

This uses the `alist()` function which simply captures all its arguments. This function is the same as `pryr::dots()`. `pryr` also provides `pryr::named_dots()`, which, by using deparsed expressions as default names, ensures that all arguments are named (just like `data.frame()`).

### 10.6 The downsides of non-standard evaluation <a name="10-6-The-downsides-of-non-standard-evaluation"></a>

The biggest downside of NSE is that functions that use it are no longer **referentially transparent**. A function is referentially transparent if you can replace its arguments with their values and its behaviour doesn’t change. For example, if a function, `f()`, is referentially transparent and both `x` and `y` are 10, then `f(x)`, `f(y)`, and `f(10)` will all return the same result. Referentially transparent code is easier to reason about because the names of objects don’t matter, and because you can always work from the innermost parentheses outwards.

There are many important functions that by their very nature are not referentially transparent. Take the assignment operator. You can’t take `a <- 1` and replace `a` by its value and get the same behaviour.

Using NSE prevents a function from being referentially transparent. This makes the mental model needed to correctly predict the output much more complicated. So, it’s only worthwhile to use NSE if there is significant gain. For example, `library()` and `require()` can be called either with or without quotes, because internally they use `deparse(substitute(x))` plus some other tricks. This means that these two lines do exactly the same thing:

<pre class="prettyprint linenums">
library(ggplot2)
library("ggplot2")
</pre>

Things start to get complicated if the variable is associated with a value. What package will this load?

<pre class="prettyprint linenums">
ggplot2 &lt;- "plyr"
library(ggplot2)
</pre>

There are a number of other R functions that work in this way, like `ls()`, `rm()`, `data()`, `demo()`, `example()`, and `vignette()`. To me, eliminating two keystrokes is not worth the loss of referential transparency, and I don’t recommend you use NSE for this purpose.

One situation where non-standard evaluation is worthwhile is `data.frame()`. If not explicitly supplied, it uses the input to automatically name the output variables:

<pre class="prettyprint linenums">
x &lt;- 10
y &lt;- "a"
df &lt;- data.frame(x, y)
names(df)
#&gt; [1] "x" "y"
</pre>

I think it’s worthwhile because it eliminates a lot of redundancy in the common scenario when you’re creating a data frame from existing variables. More importantly, if needed, it’s easy to override this behaviour by supplying names for each variable.

Non-standard evaluation allows you to write functions that are extremely powerful. However, they are harder to understand and to program with. As well as always providing an escape hatch, carefully consider both the costs and benefits of NSE before using it in a new domain.

## 11. Expressions <a name="11--Expressions"></a>

Throughout this chapter we’re going to use tools from the `pryr` package to help see what’s going on.

### 11.1 Structure of expressions <a name="11-1-Structure-of-expressions"></a>

An expression is also called an **abstract syntax tree** (AST) because it represents the hierarchical tree structure of the code. We’ll use `pryr::ast()` to see this more clearly:

<pre class="prettyprint linenums">
x &lt;- 4

# 恰好构成一个先根遍历（pre-order）
ast(y &lt;- x * 10)
#&gt; \- ()			# A function call
#&gt;   \- `&lt;-		# the function name (also a name)
#&gt;   \- `y			# the 1st argument (also a name)
#&gt;   \- ()			# the 2nd argument (another function call)
#&gt;     \- `*
#&gt;     \- `x
#&gt;     \-  10	# A constant

ast(function(x = 1, y) x)
#&gt; \- ()
#&gt;   \- `function
#&gt;   \- []				# A pairlist
#&gt;     \ x = 1
#&gt;     \ y =`MISSING
#&gt;   \- `x
#&gt;   \- &lt;srcref&gt;	# An attribute of function
</pre>

There are four possible components of an expression:

- **Constants** are length one atomic vectors, like `"a"`, `10`, `1L` or `TRUE`. `ast()` displays them as is.
	- Quoting a constant returns it unchanged: `identical(1, quote(1)) == TRUE`
- **Names**, or symbols, represent the name of an object rather than its value. `ast()` prefixes names with a backtick, like <code>&#96;x</code>.
- **Calls** represent the action of calling a function. `ast()` prints `()` and then lists the children. The first child is the function that is called, and the remaining children are the function’s arguments.
- **Pairlists**, short for dotted pair lists (in the form of `< e1 . e2 >`), are a legacy of R’s past. They are only used in one place: the formal arguments of a function. `ast()` prints `[]` at the top-level of a pairlist.

Note that `str()` does not follow these naming conventions when describing objects. Instead, it describes names as "symbols" and calls as "language objects":

<pre class="prettyprint linenums">
str(quote(a))
#&gt;  symbol a
str(quote(a + b))
#&gt;  language a + b
</pre>

### 11.2 Names <a name="11-2-Names"></a>

Typically, we use `quote()` to capture names. You can also convert a string to a name with `as.name()`. However, this is most useful only when `as.name()` receives strings as input:

<pre class="prettyprint linenums">
as.name("name")
#&gt; name
identical(quote(name), as.name("name"))
#&gt; [1] TRUE

is.name("name")
#&gt; [1] FALSE
is.name(quote(name))
#&gt; [1] TRUE
is.name(quote(f(name)))
#&gt; [1] FALSE
</pre>

Names are also called **symbols**. `as.symbol()` and `is.symbol()` are identical to `as.name()` and `is.name()`.

Names that would otherwise be invalid are automatically surrounded by backticks (意思是如果不用 backticks 包一下的话就是个非法的 name):

<pre class="prettyprint linenums">
as.name("a b")
#&gt; `a b`
as.name("if")
#&gt; `if`
</pre>

There’s one special name that needs a little extra discussion: the empty name. It is used to represent missing arguments. This object behaves strangely. You can’t bind it to a variable. If you do, it triggers an error about missing arguments. It’s only useful if you want to programmatically create a function with missing arguments.

<pre class="prettyprint linenums">
f &lt;- function(x) 10
formals(f)$x
#&gt; # empty line here
is.name(formals(f)$x)
#&gt; [1] TRUE
as.character(formals(f)$x)
#&gt; [1] ""

missing_arg &lt;- formals(f)$x
# Doesn't work!
is.name(missing_arg)
#&gt; Error in eval(expr, envir, enclos): argument "missing_arg" is missing, with no default
</pre>

### 11.3 Calls <a name="11-3-Calls"></a>

A call is very similar to a list. It has `length`, `[[` and `[` methods. The first element of the call is the function that gets called. It’s usually the name of a function:

<pre class="prettyprint linenums">
x &lt;- quote(read.csv("important.csv", row.names = FALSE))
x[[1]]
#&gt; read.csv
is.name(x[[1]])
#&gt; [1] TRUE
</pre>

You can add, modify, and delete elements of the call with the standard replacement operators, like `x$row.names <- TRUE` or `x[[4]] <- NULL`.

Calls also support the `[` method. But use it with care:

<pre class="prettyprint linenums">
x &lt;- quote(read.csv("important.csv", row.names = FALSE))
x[1]
#&gt; read.csv()
x[2]
#&gt; "important.csv"()
x[-1] # remove the function name - but it's still a call!
#&gt; "important.csv"(row.names = FALSE)
x[-2] # remove the first argument
#&gt; read.csv(row.names = FALSE)

# A list of the unevaluated arguments
as.list(x[-1])
#&gt; [[1]]
#&gt; [1] "important.csv"
#&gt; 
#&gt; $row.names
#&gt; [1] FALSE
</pre>

Generally speaking, because R’s function calling semantics are so flexible, getting or setting arguments by position is dangerous. To work around this problem, `pryr` provides `standardise_call()`. It uses the base match.call() function to convert all positional arguments to named arguments:

<pre class="prettyprint linenums">
m1 &lt;- quote(read.delim("data.txt", sep = "|"))
m2 &lt;- quote(read.delim(s = "|", "data.txt"))
m3 &lt;- quote(read.delim(file = "data.txt", , "|"))

standardise_call(m1)
#&gt; read.delim(file = "data.txt", sep = "|")
standardise_call(m2)
#&gt; read.delim(file = "data.txt", sep = "|")
standardise_call(m3)
#&gt; read.delim(file = "data.txt", sep = "|")
</pre>

To create a new call from its components, you can use `call()` or `as.call()`. The first argument to `call()` is a string which gives a function name. The other arguments are expressions that represent the arguments of the call.

<pre class="prettyprint linenums">
call(":", 1, 10)
#&gt; 1:10
call("mean", quote(1:10), na.rm = TRUE)
#&gt; mean(1:10, na.rm = TRUE)
</pre>

`as.call()` is a minor variant of `call()` that takes a single list as input. The first element is a name or call. The subsequent elements are the arguments.

<pre class="prettyprint linenums">
as.call(list(quote(mean), quote(1:10)))
#&gt; mean(1:10)
</pre>

### 11.4 Capturing the current call <a name="11-4-Capturing-the-current-call"></a>

- `sys.call()` captures exactly what the user typed.
- `match.call()` makes a call that only uses named arguments. It’s like automatically calling `pryr::standardise_call()` on the result of `sys.call()`

<pre class="prettyprint linenums">
f &lt;- function(abc = 1, def = 2, ghi = 3) {
  list(sys = sys.call(), match = match.call())
}
f(d = 2, 2) # d 模糊匹配到 def
#&gt; $sys
#&gt; f(d = 2, 2)
#&gt; 
#&gt; $match
#&gt; f(abc = 2, def = 2)
</pre>

Modelling functions often use `match.call()` to capture the call used to create the model. This makes it possible to `update()` a model, re-fitting the model after modifying some of original arguments. Here’s an example of `update()` in action:

<pre class="prettyprint linenums">
mod <- lm(mpg ~ wt, data = mtcars)
update(mod, formula = . ~ . + cyl)
#&gt; 
#&gt; Call:
#&gt; lm(formula = mpg ~ wt + cyl, data = mtcars)
#&gt; 
#&gt; Coefficients:
#&gt; (Intercept)           wt          cyl  
#&gt;      39.686       -3.191       -1.508
</pre>

具体实现部分省略。

### 11.5 Pairlists <a name="11-5-Pairlists"></a>

Pairlists are a holdover from R’s past. They behave identically to lists, but have a different internal representation (as a linked list rather than a vector). Pairlists have been replaced by lists everywhere except in function arguments.

The only place you need to care about the difference between a list and a pairlist is if you’re going to construct functions by hand:

<pre class="prettyprint linenums">
make_function &lt;- function(args, body, env = parent.frame()) {
  args &lt;- as.pairlist(args)

  # `function 本身也是个 operator，作用是返回一个 function
  eval(call("function", args, body), env)
}
</pre>

This function is also available in `pryr`, where it does a little extra checking of arguments. `make_function()` is best used in conjunction with `alist()` (alist for Argument LIST). `alist()` doesn’t evaluate its arguments so that `alist(x = a)` is shorthand for `list(x = quote(a))`.

<pre class="prettyprint linenums">
add &lt;- make_function(alist(a = 1, b = 2), quote(a + b))
add(1)
#&gt; [1] 3
add(1, 2)
#&gt; [1] 3

# To have an argument with no default, you need an explicit =
make_function(alist(a = , b = a), quote(a + b))
#&gt; function (a, b = a) 
#&gt; a + b

# To take `...` as an argument put it on the LHS of =
make_function(alist(a = , b = , ... =), quote(a + b))
#&gt; function (a, b, ...) 
#&gt; a + b
</pre>

`make_function()` has one advantage over using closures to construct functions: with it, you can easily read the source code. For example:

<pre class="prettyprint linenums">
adder &lt;- function(x) {
  make_function(alist(y =), substitute({x + y}), parent.frame())
}
adder(10)
#&gt; function (y) 
#&gt; {
#&gt;     10 + y
#&gt; }
</pre>

One useful application of `make_function()` is in functions like `curve()`. `curve()` allows you to plot a mathematical function without creating an explicit R function:

<pre class="prettyprint linenums">
curve(sin(exp(4 * x)), n = 1000)
</pre>

![][curve-demo-1]

Here `x` is a pronoun (代词). `x` doesn’t represent a single concrete value, but is instead a placeholder that varies over the range of the plot. One way to implement `curve()` would be with `make_function()`:

<pre class="prettyprint linenums">
curve2 &lt;- function(expr, xlim = c(0, 1), n = 100, 
                   env = parent.frame()) {
  f &lt;- make_function(alist(x = ), substitute(expr), env)

  x &lt;- seq(xlim[1], xlim[2], length = n)
  y &lt;- f(x)

  plot(x, y, type = "l", ylab = deparse(substitute(expr)))
}
</pre>

Functions that use a pronoun are called **anaphoric functions**. They are used in Arc (a lisp-like language), Perl, and Clojure.

### 11.6 Parsing and deparsing <a name="11-6-Parsing-and-deparsing"></a>

Sometimes code is represented as a string, rather than as an expression. You can convert a string to an expression with `parse()`. `parse()` is the opposite of `deparse()`: it takes a character vector and returns an expression object. 

- The primary use of `parse()` is parsing files of code to disk, so the first argument is a file path. 
- If you have code in a character vector, you need to use the `text` argument.

<pre class="prettyprint linenums">
z &lt;- quote(y &lt;- x * 10)
deparse(z)
#&gt; [1] "y &lt;- x * 10"

parse(text = deparse(z))
#&gt; expression(y &lt;- x * 10)
</pre>

Because there might be many top-level calls in a file, `parse()` doesn’t return just a single expression. Instead, it returns an expression object, which is essentially a list of expressions:

<pre class="prettyprint linenums">
exp &lt;- parse(text = c("
  x &lt;- 4
  x
  5
"))
length(exp)
#&gt; [1] 3
typeof(exp)
#&gt; [1] "expression"

exp[[1]]
#&gt; x &lt;- 4
exp[[2]]
#&gt; x
</pre>

You can create expression objects by hand with `expression()`, but I wouldn’t recommend it. There’s no need to learn about this esoteric data structure if you already know how to use expressions.

With `parse()` and `eval()`, it’s possible to write a simple version of `source()`. We read in the file from disk, `parse()` it and then `eval()` each component in a specified environment. This version defaults to a new environment, so it doesn’t affect existing objects. `source()` invisibly returns the result of the last expression in the file, so `simple_source()` does the same.

<pre class="prettyprint linenums">
simple_source &lt;- function(file, envir = new.env()) {
  stopifnot(file.exists(file))
  stopifnot(is.environment(envir))

  lines &lt;- readLines(file, warn = FALSE)
  exprs &lt;- parse(text = lines)

  n &lt;- length(exprs)
  if (n == 0L) return(invisible())

  for (i in seq_len(n - 1)) {
    eval(exprs[i], envir)
  }
  invisible(eval(exprs[n], envir))
}
</pre>

### 11.7 Walking the AST with recursive functions <a name="11-7-Walking-the-AST-with-recursive-functions"></a>

It's easy to modify a single call with `substitute()` or `pryr::modify_call()`. For more complicated tasks we need to work directly with the AST. The base `codetools` package provides some useful motivating examples of how we can do this: \index{recursion!over ASTs}

* `findGlobals()` locates all global variables used by a function. This   can be useful if you want to check that your function doesn't inadvertently   rely on variables defined in their parent environment.
 * `checkUsage()` checks for a range of common problems including   unused local variables, unused parameters, and the use of partial   argument matching. 
 
To write functions like `findGlobals()` and `checkUsage()`, we'll need a new tool. Because expressions have a tree structure, using a recursive function would be the natural choice. The key to doing that is getting the recursion right. This means making sure that you know what the base case is and figuring out how to combine the results from the recursive case. For calls, there are two base cases (atomic vectors and names) and two recursive cases (calls and pairlists). This means that a function for working with expressions will look like:

<pre class="prettyprint linenums">
recurse_call &lt;- function(x) {
  if (is.atomic(x)) {
    # Return a value
  } else if (is.name(x)) {
    # Return a value
  } else if (is.call(x)) {
    # Call recurse_call recursively
  } else if (is.pairlist(x)) {
    # Call recurse_call recursively
  } else {
    # User supplied incorrect input
    stop("Don't know how to handle type ", typeof(x), 
      call. = FALSE)
  }
}
</pre>

#### 11.7.1 Finding F(ALSE) and T(RUE) <a name="11-7-1-Finding-FALSE-and-TRUE"></a>

We’ll start simple with a function that determines whether a function uses the logical abbreviations `T` and `F`. Using `T` and `F` is generally considered to be poor coding practice, and is something that `R CMD check` will warn about. Let’s first compare the AST for `T` vs. `TRUE`:

<pre class="prettyprint linenums">
ast(TRUE)
#&gt; \-  TRUE
ast(T)
#&gt; \- `T
</pre>

`TRUE` is parsed as a logical vector of length one, while `T` is parsed as a name. This tells us how to write our base cases for the recursive function: while an atomic vector will never be a logical abbreviation, a name might.

<pre class="prettyprint linenums">
logical_abbr &lt;- function(x) {
  if (is.atomic(x)) {
    FALSE
  } else if (is.name(x)) {
    identical(x, quote(T)) || identical(x, quote(F))
  } else if (is.call(x) || is.pairlist(x)) {
    for (i in seq_along(x)) {
      if (logical_abbr(x[[i]])) return(TRUE)
    }
    FALSE
  } else {
    stop("Don't know how to handle type ", typeof(x), 
      call. = FALSE)
  }
}

logical_abbr(quote(TRUE))
#&gt; [1] FALSE
logical_abbr(quote(T))
#&gt; [1] TRUE
logical_abbr(quote(mean(x, na.rm = T)))
#&gt; [1] TRUE
logical_abbr(quote(function(x, na.rm = T) FALSE))
#&gt; [1] TRUE
</pre>

#### 11.7.2 Finding all variables created by assignment <a name="11-7-2-Finding-all-variables-created-by-assignment"></a>

The next task, listing all variables created by assignment, is a little more complicated. Again, we start by looking at the AST for assignment:

<pre class="prettyprint linenums">
ast(x &lt;- 10)
#&gt; \- ()
#&gt;   \- `&lt;-
#&gt;   \- `x
#&gt;   \-  10
</pre>

Assignment is a call where the first element is the name `<-`, the second is the object the name is assigned to, and the third is the value to be assigned. This makes the base cases simple: constants and names don’t create assignments, so they return NULL. The recursive cases aren’t too hard either. We `lapply()` over pairlists and over calls to functions other than `<-`.

非常精彩的一个重构的例子，具体请看书。

#### 11.7.3 Modifying the call tree <a name="11-7-3-Modifying-the-call-tree"></a>

The next step up in complexity is returning a modified call tree, like what you get with `bquote()`. `bquote()` is a slightly more flexible form of `quote()`: it allows you to optionally quote and unquote some parts of an expression (it’s similar to the backtick operator in Lisp). Everything is quoted, unless it’s encapsulated in `.()` in which case it’s evaluated and the result is inserted:

<pre class="prettyprint linenums">
a &lt;- 1
b &lt;- 3
bquote(a + b)
#&gt; a + b
bquote(a + .(b))
#&gt; a + 3
bquote(.(a) + .(b))
#&gt; 1 + 3
bquote(.(a + b))
#&gt; [1] 4
</pre>

How does `bquote()` work? Below, I’ve rewritten `bquote()` to use the same style as our other functions:

<pre class="prettyprint linenums">
bquote2 &lt;- function (x, where = parent.frame()) {
  if (is.atomic(x) || is.name(x)) {
    # Leave unchanged
    x
  } else if (is.call(x)) {
    if (identical(x[[1]], quote(.))) {
      # Call to .(), so evaluate
      eval(x[[2]], where)
    } else {
      # Otherwise apply recursively, turning result back into call
      as.call(lapply(x, bquote2, where = where))
    }
  } else if (is.pairlist(x)) {
    as.pairlist(lapply(x, bquote2, where = where))
  } else {
    # User supplied incorrect input
    stop("Don't know how to handle type ", typeof(x), 
      call. = FALSE)
  }
}

x &lt;- 1
y &lt;- 2
bquote2(quote(x == .(x)))
#&gt; x == 1
bquote2(quote(function(x = .(x)) {
  x + .(y)
}))
#&gt; function(x = 1) {
#&gt;     x + 2
#&gt; }
</pre>

The main difference between this and the previous recursive functions is that after we process each element of calls and pairlists, we need to coerce them back to their original types.

These tools are somewhat similar to Lisp macros, as discussed in [Programmer's Niche: Macros in R](http://www.r-project.org/doc/Rnews/Rnews_2001-3.pdf#page=10) by Thomas Lumley. However, macros are run at compile-time, which doesn't have any meaning in R, and always return expressions. They're also somewhat like Lisp [fexprs](http://en.wikipedia.org/wiki/Fexpr). A fexpr is a function where the arguments are not evaluated by default. The terms macro and fexpr are useful to know when looking for useful techniques from other languages.

## 12. Domain Specific Languages <a name="12--Domain-Specific-Languages"></a>

The combination of first class environments, lexical scoping, non-standard evaluation, and metaprogramming gives us a powerful toolkit for creating embedded domain specific languages (DSLs) in R. Embedded DSLs take advantage of a host language’s parsing and execution framework, but adjust the semantics to make them more suitable for a specific task. DSLs are a very large topic, and this chapter will only scratch the surface, focussing on important implementation techniques rather than on how you might come up with the language in the first place.

R’s most popular DSL is the formula specification, which provides a succinct way of describing the relationship between predictors and the response in a model. Other examples include `ggplot2` (for visualisation) and `plyr` (for data manipulation). Another package that makes extensive use of these ideas is `dplyr`, which provides `translate_sql()` to convert R expressions into SQL:

<pre class="prettyprint linenums">
library(dplyr)
translate_sql(sin(x) + tan(y))
#&gt; &lt;SQL&gt; SIN("x") + TAN("y")
translate_sql(x &lt; 5 & !(y &gt;= 5))
#&gt; &lt;SQL&gt; "x" &lt; 5.0 AND NOT(("y" &gt;= 5.0))
translate_sql(first %like% "Had*")
#&gt; &lt;SQL&gt; "first" LIKE 'Had*'
translate_sql(first %in% c("John", "Roger", "Robert"))
#&gt; &lt;SQL&gt; "first" IN ('John', 'Roger', 'Robert')
translate_sql(like == 7)
#&gt; &lt;SQL&gt; "like" = 7.0
</pre>

### 12.1 DSL Example 1: Generating HTML <a name="12-1-DSL-Example-1-Generating-HTML"></a>

#### 12.1.1 Goal <a name="12-1-1-Goal"></a>

Our goal is to make it easy to generate HTML from R:

<pre class="prettyprint linenums">
with_html(body(
  h1("A heading", id = "first"),
  p("Some text &", b("some bold text.")),
  img(src = "myimg.png", width = 100, height = 100)
))

## Generates:

&lt;body&gt;
  &lt;h1 id='first'&gt;A heading&lt;/h1&gt;
  &lt;p&gt;Some text &amp; &lt;b&gt;some bold text.&lt;/b&gt;&lt;/p&gt;
  &lt;img src='myimg.png' width='100' height='100' /&gt;
&lt;/body&gt;
</pre>

### 12.2 DSL Example 2: Turning R mathematical expressions into LaTeX <a name="12-2-DSL-Example-2-Turning-R-mathematical-expressions-into-LaTeX"></a>

#### 12.2.1 Goal <a name="12-2-1-Goal"></a>

Our goal is to use these rules to automatically convert an R expression to its appropriate LaTeX representation. We'll tackle this in four stages:

* Convert known symbols: 
	- E.g. `pi` => `\pi`
* Leave other symbols unchanged: 
	- E.g. `x` => `x`, `y` => `y`
* Convert known functions to their special forms: 
	- E.g. `sqrt(frac(a, b))` => `\sqrt{\frac{a, b}}`
* Wrap unknown functions with `\textrm`: 
	- E.g. `f(a)` => `\textrm{f}(a)`

## 13. Performance <a name="13--Performance"></a>

### 13.1 Why is R slow? <a name="13-1-Why-is-R-slow"></a>

To understand R’s performance, it helps to think about R both a) as a language and b) as an implementation of that language.

- The language is abstract: it defines what R code means and how it should work. 
	- I’ll call the language **R-language**.
- The implementation is concrete: it reads R code and computes a result.
	- The most popular implementation is the one from [r-project.org](http://r-project.org/). 
	- I’ll call that implementation **GNU-R**.
	- There are alternative R implementations like **pqR** (pretty quick R), **Renjin**, **FastR** and **Riposte**
	
The distinction between R-language and GNU-R is a bit murky because the R-language is not formally defined. The R-language is mostly defined in terms of how GNU-R works. This is in contrast to other languages, like C++ and javascript, that make a clear distinction between language and implementation by laying out formal specifications that describe in minute detail how every aspect of the language should work. Nevertheless, the distinction between R-language and GNU-R is still useful: 

- poor performance due to the language is hard to fix without breaking existing code; 
- fixing poor performance due to the implementation is easier.

Why is R slow? Two general reasons are:

- The design of the R-language imposes fundamental constraints on R’s speed.
- GNU-R is currently far from the theoretical maximum.

### 13.2 Microbenchmarking <a name="13-2-Microbenchmarking"></a>

While it’s hard to know exactly how much faster a better implementation could be, a ">10x" improvement in speed seems achievable.

The best tool for microbenchmarking in R is the `microbenchmark` package:

<pre class="prettyprint linenums">
library(microbenchmark)

x &lt;- runif(100)
microbenchmark(
  sqrt(x),
  x ^ 0.5
)
#&gt; Unit: nanoseconds
#&gt;     expr    min     lq  mean median     uq    max neval
#&gt;  sqrt(x)  1,820  2,040  2479  2,410  2,770  8,160   100
#&gt;    x^0.5 17,200 17,600 19928 19,400 19,700 87,500   100
</pre>

By default, `microbenchmark()` runs each expression 100 times (controlled by the `times` parameter). In the process, it also randomises the order of the expressions. It summarises the results with a minimum (`min`), lower quartile (`lq`), median, upper quartile (`uq`), and maximum (`max`). Focus on the median, and use the upper and lower quartiles (`lq` and `uq`) to get a feel for the variability. In this example, you can see that using the special purpose `sqrt()` function is faster than the general exponentiation operator. 

As with all microbenchmarks, pay careful attention to the units:

- ms: millisecond, 1s == 1,000ms
- µs: microsecond, 1s == 1,000,000µs
- ns: nanosecond, 1s == 1,000,000,000ns

### 13.3 Language performance <a name="13-3-Language-performance"></a>

In this section, I’ll explore three trade-offs that limit the performance of the R-language: 

- extreme dynamism, 
- name lookup with mutable environments, and 
- lazy evaluation of function arguments. 

I’ll illustrate each trade-off with a microbenchmark, showing how it slows GNU-R down. I benchmark GNU-R because you can’t benchmark the R-language (it can’t run code). This means that the results are only suggestive of the cost of these design decisions, but are nevertheless useful.

#### 13.3.1 Extreme dynamism <a name="13-3-1-Extreme-dynamism"></a>

R is an extremely dynamic programming language. Almost anything can be modified after it is created, like adding new fields to an S3 object, or even changing its class. Pretty much the only things you can’t change are objects in sealed namespaces, which are created when you load a package.

- The advantage of dynamism is that you need minimal upfront planning. You can change your mind at any time, iterating your way to a solution without having to start afresh. 
- The disadvantage of dynamism is that it’s difficult to predict exactly what will happen with a given function call. 
	- This is a problem because the easier it is to predict what’s going to happen, the easier it is for an interpreter or compiler to make an optimisation.
	- For example, the following loop is slow in R, because R doesn’t know that `x` is always an integer. That means R has to look for the right `+` method (i.e., is it adding doubles, or integers?) in every iteration of the loop.
	
<pre class="prettyprint linenums">
x &lt;- 0L
for (i in 1:1e6) {
  x &lt;- x + 1
}
</pre>

The cost of finding the right method is higher for non-primitive functions. microbenchmark 部分略。

#### 13.3.2 Name lookup with mutable environments <a name="13-3-2-Name-lookup-with-mutable-environments"></a>

It’s surprisingly difficult to find the value associated with a name in the R-language. This is due to combination of lexical scoping and extreme dynamism. This means that you can’t do name lookup just once: you have to start from scratch each time (比如我们在函数的内部访问了函数外部的一个 `a`，然后在函数内部我们自己又创建了一个 `a`).

This problem is exacerbated by the fact that almost every operation is a lexically scoped function call. You might think the following simple function calls two functions: `+` and `^`. In fact, it calls four because `{` and `(` are regular functions in R.

<pre class="prettyprint linenums">
f &lt;- function(x, y) {
  (x + y) ^ 2
}
</pre>

Since these functions are in the global environment, R has to look through every environment in the search path, which could easily be 10 or 20 environments. microbenchmark 部分略。

#### 13.3.3 Lazy evaluation overhead <a name="13-3-3-Lazy-evaluation-overhead"></a>

To implement lazy evaluation, R uses a promise object that contains the expression needed to compute the result and the environment in which to perform the computation. Creating these objects has some overhead, so each additional argument to a function decreases its speed a little. microbenchmark 部分略。

### 13.4 Implementation performance <a name="13-4-Implementation-performance"></a>

The design of the R language limits its maximum theoretical performance, but GNU-R is currently nowhere near that maximum.

R is over 20 years old. It contains nearly 800,000 lines of code (about 45% C, 19% R, and 17% Fortran). Changes to base R can only be made by members of the _R Core Team_ (or _R-core_ for short). Currently R-core has twenty members, but only six are active in day-to-day development. No one on R-core works full time on R. Most are statistics professors who can only spend a relatively small amount of their time on R. Because of the care that must be taken to avoid breaking existing code, R-core tends to be very conservative about accepting new code. It can be frustrating to see R-core reject proposals that would improve performance. However, the overriding concern for R-core is not to make R fast, but to build a stable platform for data analysis and statistics.

Below, I’ll show two small, but illustrative, examples of parts of R that are currently slow but could, with some effort, be made faster. 

#### 13.4.1 Extracting a single value from a data frame <a name="13-4-1-Extracting-a-single-value-from-a-data-frame"></a>

The following microbenchmark shows seven ways to access a single value from the built-in `mtcars` dataset (to be specific, the number in the bottom-right corner). The variation in performance is startling: the slowest method takes 30x longer than the fastest. There’s no reason that there has to be such a huge difference in performance. It’s simply that no one has had the time to fix it.

<pre class="prettyprint linenums">
microbenchmark(
  "[32, 11]"      = mtcars[32, 11],
  "$carb[32]"     = mtcars$carb[32],
  "[[c(11, 32)]]" = mtcars[[c(11, 32)]],
  "[[11]][32]"    = mtcars[[11]][32],
  ".subset2"      = .subset2(mtcars, 11)[32]
)
#&gt; Unit: nanoseconds
#&gt;           expr    min     lq  mean median     uq     max neval
#&gt;       [32, 11] 35,700 36,800 40421 37,700 39,800  80,100   100
#&gt;      $carb[32] 19,000 19,800 22622 20,500 21,400  69,800   100
#&gt;  [[c(11, 32)]] 14,900 15,800 17690 16,600 19,700  28,000   100
#&gt;     [[11]][32] 14,300 15,000 17215 15,800 19,200  34,300   100
#&gt;       .subset2    511    888  5267    982  1,150 416,000   100
</pre>

#### 13.4.2 ifelse(), pmin(), and pmax() <a name="13-4-2-ifelse-pmin-and-pmax"></a>

Some base functions are known to be slow. For example, take the following three implementations of `squish()`, a function that ensures that the smallest value in a vector `x` is at least `a` and its largest value is at most `b`:

<pre class="prettyprint linenums">
squish_ife &lt;- function(x, a, b) {
  ifelse(x &lt;= a, a, ifelse(x &gt;= b, b, x))
}
squish_p &lt;- function(x, a, b) {
  pmax(pmin(x, b), a)
}
squish_in_place &lt;- function(x, a, b) {
  x[x &lt;= a] &lt;- a
  x[x &gt;= b] &lt;- b
  x
}

x &lt;- runif(100, -1.5, 1.5)
microbenchmark(
  squish_ife      = squish_ife(x, -1, 1),
  squish_p        = squish_p(x, -1, 1),
  squish_in_place = squish_in_place(x, -1, 1),
  unit = "us"
)
#&gt; Unit: microseconds
#&gt;             expr  min   lq mean median   uq   max neval
#&gt;       squish_ife 81.1 83.5 88.1   85.7 89.8 177.0   100
#&gt;         squish_p 33.7 35.9 45.8   37.6 39.6 767.0   100
#&gt;  squish_in_place 11.5 12.2 13.5   12.8 13.5  24.7   100
</pre>

`pmin` 和 `pmax` 的 p 是 parallel 的意思，通过代码来体会一下：

<pre class="prettyprint linenums">
min(5:1, pi)
#&gt; 1
pmin(5:1, pi)
#&gt; 3.141593 3.141593 3.000000 2.000000 1.000000
</pre>

We can often do even better by using C++.

## 14. Optimising code <a name="14--Optimising-code"></a>

Optimising code to make it run faster is an iterative process:

1. Find the biggest bottleneck (the slowest part of your code).
	- Instead of relying on your intuition, you should **profile** your code: use realistic inputs and measure the run-time of each individual operation.
1. Try to eliminate it (you may not succeed but that’s ok).
1. Repeat until your code is “fast enough.”

Prerequisites: In this chapter we'll be using the `lineprof` package to understand the performance of R code. Get it with:

<pre class="prettyprint linenums">
devtools::install_github("hadley/lineprof")
</pre>

注意会用到 Rtools（中的 make），请把类似 "E:\Rtools\bin" 这样的路径添加到 path。

### 14.1 Measuring performance <a name="14-1-Measuring-performance"></a>

To understand performance, you use a profiler. There are a number of different types of profilers. R uses a fairly simple type called a **sampling** or **statistical profiler**. A sampling profiler stops the execution of code every few milliseconds and records which function is currently executing (along with which function called that function, and so on). For example, consider `f()`, below:

<pre class="prettyprint linenums">
f &lt;- function() {
  pause(0.1)
  g()
  h()
}
g &lt;- function() {
  pause(0.1)
  h()
}
h &lt;- function() {
  pause(0.1)
}

tmp &lt;- tempfile()
Rprof(tmp, interval = 0.1)
f()
Rprof(NULL)
summaryRprof(tmp)
</pre>

更多 `Rprof` 的用法请参考 [How to efficiently use Rprof in R?](http://stackoverflow.com/questions/3650862/how-to-efficiently-use-rprof-in-r)。简化一下 profile 的结果，我们可以得到的这样的一个结构：

	f() 
	f() > g()
	f() > g() > h()
	f() > h()

Each line represents one “tick” of the profiler (0.1 s in this case), and function calls are nested with `>`. It shows that the code spends 0.1 s running `f()`, then 0.2 s running `g()`, then 0.1 s running `h()`.

I wrote the `lineprof` package as a simpler way to visualise profiling data. As the name suggests, the fundamental unit of analysis in `lineprof()` is a line of code. This makes lineprof less precise than the alternatives (because a line of code can contain multiple function calls), but it’s easier to understand the context.

To use `lineprof`, we first save the code in a file and `source()` it. Here "profiling-example.R" contains the definition of `f()`, `g()`, and `h()`. Note that you must use `source()` to load the code. This is because lineprof uses `srcref`s to match up the code to the profile, and the needed `srcref`s are only created when you load code from disk. We then use `lineprof()` to run our function and capture the timing output:

<pre class="prettyprint linenums">
library(lineprof)
source("profiling-example.R")
l &lt;- lineprof(f())
l
#&gt;    time alloc release dups           ref     src
#&gt; 1 0.074 0.001       0    0 profiling.R#2 f/pause
#&gt; 2 0.143 0.002       0    0 profiling.R#3 f/g    
#&gt; 3 0.071 0.000       0    0 profiling.R#4 f/h   

library(shiny)
shine(l)
</pre>

`lineprof` provides some functions to navigate through this data structure, but they’re a bit clumsy. Instead, we’ll start an interactive explorer using the `shiny` package. `shine(l)` will open a new web page (or if you’re using RStudio, a new pane) that shows your source code annotated with information about how long each line took to run. `shine()` starts a shiny app which “blocks” your R session. To exit, you’ll need to stop the process using escape or `ctrl + c`.

#### Limitations <a name="Limitations"></a>

There are some other limitations to profiling:

- Profiling does not extend to C code. You can see if your R code calls C/C++ code but not what functions are called inside of your C/C++ code. 
- Similarly, you can’t see what’s going on inside primitive functions or byte code compiled code.
- If you’re doing a lot of functional programming with anonymous functions, it can be hard to figure out exactly which function is being called. 
	- The easiest way to work around this is to name your functions.
- Lazy evaluation means that arguments are often evaluated inside another function. For example, in `j(i())`, profiling would make it seem like `i()` was called by `j()` because the argument isn’t evaluated until it’s needed by `j()`. 
	- If this is confusing, you can create temporary variables to force computation to happen earlier.
	
### 14.2 Improving performance <a name="14-2-Improving-performance"></a>

The following sections introduce you to 6 basic techniques that I’ve found broadly useful:

- Look for existing solutions.
- Do less work.
- Vectorise.
- Parallelise.
- Avoid copies.
- Byte-code compile.

A final technique is to rewrite in a faster language, like C++. That’s a big topic and is covered in Rcpp.

Before we get into specific techniques, I’ll first describe a general strategy and organisational style that’s useful when working on performance.

#### 14.2.1 Best practice: Organize your code <a name="14-2-1-Best-practice-Organize-your-code"></a>

When tackling a bottleneck, you’re likely to come up with multiple approaches. Write a function for each approach, encapsulating all relevant behaviour. This makes it easier to check that each approach returns the correct result and to time how long it takes to run. To demonstrate the strategy, I’ll compare two approaches for computing the mean:

<pre class="prettyprint linenums">
mean1 &lt;- function(x) mean(x)
mean2 &lt;- function(x) sum(x) / length(x)
</pre>

I recommend that you keep a record of everything you try, even the failures. If a similar problem occurs in the future, it’ll be useful to see everything you’ve tried. To do this I often use R Markdown, which makes it easy to intermingle code with detailed comments and notes.

Next, generate a representative test case. The case should be big enough to capture the essence of your problem but small enough that it takes only a few seconds to run. You don’t want it to take too long because you’ll need to run the test case many times to compare approaches. On the other hand, you don’t want the case to be too small because then results might not scale up to the real problem.

Use this test case to quickly check that all variants return the same result. An easy way to do so is with `stopifnot()` and `all.equal()`. For real problems with fewer possible outputs, you may need more tests to make sure that an approach doesn’t accidentally return the correct answer. That’s unlikely for the mean.

<pre class="prettyprint linenums">
x &lt;- runif(100)
stopifnot(all.equal(mean1(x), mean2(x)))
</pre>

Finally, use the `microbenchmark` package to compare how long each variation takes to run. For bigger problems, reduce the times parameter so that it only takes a couple of seconds to run. Focus on the median time, and use the upper and lower quartiles to gauge the variability of the measurement.

<pre class="prettyprint linenums">
microbenchmark(
  mean1(x),
  mean2(x)
)
#&gt; Unit: microseconds
#&gt;      expr   min    lq  mean median    uq  max neval
#&gt;  mean1(x) 12.60 12.90 14.34  13.10 13.40 68.4   100
#&gt;  mean2(x)  1.58  1.74  2.35   2.11  2.22 26.4   100
</pre>

(You might be surprised by the results: `mean(x)` is considerably slower than `sum(x) / length(x)`. This is because, among other reasons, `mean(x)` makes two passes over the vector to be more numerically accurate.)

Before you start experimenting, you should have a target speed that defines when the bottleneck is no longer a problem. Setting such a goal is important because you don’t want to spend valuable time over-optimising your code.

#### 14.2.2 Technique 1: Look for existing solutions <a name="14-2-2-Technique-1-Look-for-existing-solutions"></a>

If your bottleneck is a function in a package, it’s worth looking at other packages that do the same thing. Two good places to start are:

- [CRAN task views](http://cran.rstudio.com/web/views/). If there’s a CRAN task view related to your problem domain, it’s worth looking at the packages listed there.
- Reverse dependencies of Rcpp, as listed on its [CRAN page](http://cran.r-project.org/web/packages/Rcpp). Since these packages use C++, it’s possible to find a solution to your bottleneck written in a higher performance language.

Otherwise, the challenge is describing your bottleneck in a way that helps you find related problems and solutions. Knowing the name of the problem or its synonyms will make this search much easier.

It’s often helpful to restrict your search to R related pages. For Google, try [rseek](http://www.rseek.org/). For stackoverflow, restrict your search by including the R tag, `[R]`, in your search.

As discussed above, record all solutions that you find, not just those that immediately appear to be faster. Some solutions might be initially slower, but because they are easier to optimise they end up being faster. You may also be able to combine the fastest parts from different approaches.

#### 14.2.3 Technique 2: Unburden your functions <a name="14-2-3-Technique-2-Unburden-your-functions"></a>

One way to do that is use a function tailored to a more specific type of input or ouput, or a more specific problem. For example:

* `rowSums()`, `colSums()`, `rowMeans()`, and `colMeans()` are faster than equivalent invocations that use `apply()` because they are vectorised.
* `vapply()` is faster than `sapply()` because it pre-specifies the output type.
* If you want to see if a vector contains a single value, `any(x == 10)` is much faster than `10 %in% x`. This is because testing equality is simpler than testing inclusion in a set.

Having this knowledge at your fingertips requires knowing that alternative functions exist: you need to have a good vocabulary. Good places to read code are the [R-help mailing list](https://stat.ethz.ch/mailman/listinfo/r-help) and [stackoverflow](http://stackoverflow.com/questions/tagged/r).

Some functions coerce their inputs into a specific type. If your input is not the right type, the function has to do extra work. Instead, look for a function that works with your data as it is, or consider changing the way you store your data. The most common example of this problem is using `apply()` on a data frame. `apply()` always turns its input into a matrix. Not only is this error prone (because a data frame is more general than a matrix), it is also slower.

Other functions will do less work if you give them more information about the problem. It's always worthwhile to carefully read the documentation and experiment with different arguments. Some examples that I've discovered in the past include:

* For `read.csv()`: specify known column types with `colClasses`.
* For `factor()`: specify known levels with `levels`.
* For `cut()`: don't generate labels with `labels = FALSE` if you don't need them, or, even better, use `findInterval()` as mentioned in the "see also" section of the documentation.
* `unlist(x, use.names = FALSE)` is much faster than `unlist(x)`.
* For `interaction()`: if you only need combinations that exist in the data, use `drop = TRUE`.

Sometimes you can make a function faster by avoiding method dispatch, which can be costly in R. If you're calling a method in a tight loop, you can avoid some of the costs by doing the method lookup only once: 

* For S3, you can do this by calling `{generic}.{class}()` instead of `{generic}()`. 
	- For example, calling `mean.default()` quite a bit faster than calling `mean()` for small vectors.
	- This optimisation is a little risky. While `mean.default()` is faster, it’ll fail in surprising ways if `x` is not a numeric vector. You should only use it if you know for sure what `x` is.
* For S4, you can do this by using `findMethod()` to find the method, saving it to a variable, and then calling that function. 

Knowing that you’re dealing with a specific type of input can be another way to write faster code. For example, `as.data.frame()` is quite slow because it coerces each element into a data frame and then `rbind()`s them together. If you have a named list with vectors of equal length, you can directly transform it into a data frame. In this case, if you’re able to make strong assumptions about your input, you can write a method that’s about 20x faster than the default. Again, note the trade-off. This method is fast because it’s dangerous. If you give it bad inputs, you’ll get a corrupt data frame.

<pre class="prettyprint linenums">
quickdf &lt;- function(l) {
  class(l) &lt;- "data.frame"
  attr(l, "row.names") &lt;- .set_row_names(length(l[[1]]))
  l
}

l &lt;- lapply(1:26, function(i) runif(1e3))
names(l) &lt;- letters

microbenchmark(
  quick_df      = quickdf(l),
  as.data.frame = as.data.frame(l)
)
#&gt; Unit: microseconds
#&gt;           expr     min      lq   mean  median      uq     max neval
#&gt;       quick_df    28.5    34.2   42.6    41.4    51.1    70.7   100
#&gt;  as.data.frame 2,560.0 3,050.0 3239.3 3,220.0 3,340.0 5,290.0   100
</pre>

You can also take a general-purpose function and simplify its code for your specific goal. 书上简化 `diff()` 的做法是

- 假定 input 类型
- 固定 arguments 的值

A final example of doing less work is to use simpler data structures. For example, when working with rows from a data frame, it’s often faster to work with row indices than the whole data frame.

#### 14.2.4 Technique 3: Vectorise <a name="14-2-4-Technique-3-Vectorise"></a>

Vectorising your code is not just about avoiding for loops, although that’s often a step. Vectorising is about taking a “whole object” approach to a problem, thinking about vectors, not scalars. There are two key attributes of a vectorised function:

- It makes many problems simpler. Instead of having to think about the components of a vector, you only think about entire vectors.
- The loops in a vectorised function are written in C instead of R. Loops in C are much faster because they have much less overhead.

Functionals stressed the importance of vectorised code as a higher level abstraction. Vectorisation is also important for writing fast R code. This doesn’t mean simply using `apply()` or `lapply()`, or even `Vectorise()`. Those functions improve the interface of a function, but don’t fundamentally change performance. Using vectorisation for performance means finding the existing R function that is implemented in C and most closely applies to your problem.

例子略。

#### 14.2.5 Technique 4: Avoid copies <a name="14-2-5-Technique-4-Avoid-copies"></a>

A pernicious source of slow R code is growing an object with a loop. Whenever you use `c()`, `append()`, `cbind()`, `rbind()`, or `paste()` to create a bigger object, R must first allocate space for the new object and then copy the old object to its new home. If you're repeating this many times, like in a for loop, this can be quite expensive. You've entered Circle 2 of the ["R inferno"](http://www.burns-stat.com/pages/Tutor/R_inferno.pdf). 

Here's a little example that shows the problem. We first generate some random strings, and then combine them either iteratively with a loop using `collapse()`, or in a single pass using `paste()`. Note that the performance of `collapse()` gets relatively worse as the number of strings grows: combining 100 strings takes almost 30 times longer than combining 10 strings. 

<pre class="prettyprint linenums">
random_string &lt;- function() {
  paste(sample(letters, 50, replace = TRUE), collapse = "")
}
strings10 &lt;- replicate(10, random_string())
strings100 &lt;- replicate(100, random_string())

collapse &lt;- function(xs) {
  out &lt;- ""
  for (x in xs) {
    out &lt;- paste0(out, x)
  }
  out
}

microbenchmark(
  loop10  = collapse(strings10),
  loop100 = collapse(strings100),
  vec10   = paste(strings10, collapse = ""),
  vec100  = paste(strings100, collapse = "")
)
</pre>

Modifying an object in a loop, e.g., `x[i] <- y`, can also create a copy, depending on the class of `x`. 

#### 14.2.6 Technique 5: Byte-code compile <a name="14-2-6-Technique-5-Byte-code-compile"></a>

R 2.13.0 introduced a byte code compiler which can increase the speed of some code. Using the compiler is an easy way to get improvements in speed. Even if it doesn't work well for your function, you won't have invested a lot of time in the effort. The following example shows the pure R version of `lapply()`. Compiling it gives a considerable speedup, although it's still not quite as fast as the C version provided by base R. 

<pre class="prettyprint linenums">
lapply2 &lt;- function(x, f, ...) {
  out &lt;- vector("list", length(x))
  for (i in seq_along(x)) {
    out[[i]] &lt;- f(x[[i]], ...)
  }
  out
}

lapply2_c &lt;- compiler::cmpfun(lapply2)

x &lt;- list(1:10, letters, c(F, T), NULL)
microbenchmark(
  lapply2(x, is.null),
  lapply2_c(x, is.null),
  lapply(x, is.null)
)
</pre>

Byte code compilation really helps here, but in most cases you're more likely to get a 5-10% improvement. All base R functions are byte code compiled by default.

#### 14.2.7 Case study: t-test <a name="14-2-7-Case-study-t-test"></a>

一个非常详细的例子，写的很好，建议看书。

#### 14.2.8 Technique 6: Parallelise <a name="14-2-8-Technique-6-Parallelise"></a>

Parallelisation uses multiple cores to work simultaneously on different parts of a problem. It doesn't reduce the computing time, but it saves your time because you're using more of your computer's resources. 

What I want to show is a simple application of parallel computing to what are called "embarrassingly parallel problems". An embarrassingly parallel problem is one that's made up of many simple problems that can be solved independently. A great example of this is `lapply()` because it operates on each element independently of the others. It's very easy to parallelise `lapply()` on Linux and the Mac because you simply substitute `mclapply()` for `lapply()`. The following code snippet runs a trivial (but slow) function on all cores of your computer.

<pre class="prettyprint linenums">
library(parallel)

cores &lt;- detectCores()
cores
#&gt; [1] 32

pause &lt;- function(i) {
  function(x) Sys.sleep(i)
}

system.time(lapply(1:10, pause(0.25)))
#&gt;    user  system elapsed 
#&gt;   0.002   0.000   2.508
system.time(mclapply(1:10, pause(0.25), mc.cores = cores))
#&gt;    user  system elapsed 
#&gt;   0.017   0.120   0.326
</pre>

Life is a bit harder in Windows. 具体看书。

There is some communication overhead with parallel computing. If the subproblems are very small, then parallelisation might hurt rather than help. It's also possible to distribute computation over a network of computers (not just the cores on your local computer) but that's beyond the scope of this book, because it gets increasingly complicated to balance computation and communication costs. A good place to start for more information is the [high performance computing CRAN task view](http://cran.r-project.org/web/views/HighPerformanceComputing.html).

### 14.3 Other techniques <a name="14-3-Other-techniques"></a>

介绍了一些其他的资源（文档和书），有空可以看看。

## 15. Memory (很有意思，建议看书) <a name="15--Memory-很有意思，建议看书"></a>

## 16. High performance functions with Rcpp <a name="16--High-performance-functions-with-Rcpp"></a>

### 16.1 Getting started <a name="16-1-Getting-started"></a>

`cppFunction()` allows you to write C++ functions in R:

<pre class="prettyprint linenums">
library(Rcpp)

cppFunction('int add(int x, int y, int z) {
  int sum = x + y + z;
  return sum;
}')
# add works like a regular R function
add
#&gt; function (x, y, z) 
#&gt; .Primitive(".Call")(&lt;pointer: 0x7ff50baf33d0&gt;, x, y, z)
add(1, 2, 3)
#&gt; [1] 6
</pre>

When you run this code, Rcpp will compile the C++ code and construct an R function that connects to the compiled C++ function.

#### 16.1.1 Example 1: No inputs, scalar output <a name="16-1-1-Example-1-No-inputs-scalar-output"></a>

<pre class="prettyprint linenums">
cppFunction('int one() {
  return 1;
}')
</pre>

This function returns an `int` (a scalar integer). The classes for the most common types of R vectors are: `NumericVector`, `IntegerVector`, `CharacterVector`, and `LogicalVector`.

#### 16.1.2 Example 2: Scalar input, scalar output <a name="16-1-2-Example-2-Scalar-input-scalar-output"></a>

<pre class="prettyprint linenums">
cppFunction('int signC(int x) {
  if (x &gt; 0) {
    return 1;
  } else if (x == 0) {
    return 0;
  } else {
    return -1;
  }
}')
</pre>

As in R you can use `break` to exit the loop, but to skip one iteration you need to use `continue` instead of `next`.

#### 16.1.3 Example 3: Vector input, scalar output <a name="16-1-3-Example-3-Vector-input-scalar-output"></a>

<pre class="prettyprint linenums">
# Bad practice anyway
sumR &lt;- function(x) {
  total &lt;- 0
  for (i in seq_along(x)) {
    total &lt;- total + x[i]
  }
  total
}

cppFunction('double sumC(NumericVector x) {
  int n = x.size();
  double total = 0;
  for(int i = 0; i &lt; n; ++i) {
    total += x[i];
  }
  return total;
}')
</pre>

#### 16.1.4 Example 4: Vector input, vector output <a name="16-1-4-Example-4-Vector-input-vector-output"></a>

<pre class="prettyprint linenums">
pdistR &lt;- function(x, ys) {
  sqrt((x - ys) ^ 2)
}

cppFunction('NumericVector pdistC(double x, NumericVector ys) {
  int n = ys.size();
  NumericVector out(n);

  for(int i = 0; i &lt; n; ++i) {
    out[i] = sqrt(pow(ys[i] - x, 2.0));
  }
  return out;
}')
</pre>

Another useful way of making a vector is to copy an existing one: `NumericVector zs = clone(ys)`.

In the [Rcpp sugar](#) section, you’ll see how to rewrite this function to take advantage of Rcpp’s vectorised operations so that the C++ code is almost as concise ([kənˈsaɪs], brief, yet including all important information) as R code.

#### 16.1.5 Example 5: Matrix input, vector output <a name="16-1-5-Example-5-Matrix-input-vector-output"></a>

Each vector type in R has a matrix equivalent in Rcpp: `NumericMatrix`, `IntegerMatrix`, `CharacterMatrix`, and `LogicalMatrix`. For example, we could create a function that reproduces `rowSums()`:

<pre class="prettyprint linenums">
cppFunction('NumericVector rowSumsC(NumericMatrix x) {
  int nrow = x.nrow(), ncol = x.ncol();
  NumericVector out(nrow);

  for (int i = 0; i &lt; nrow; i++) {
    double total = 0;
    for (int j = 0; j &lt; ncol; j++) {
      total += x(i, j); # x[i, j] in R
    }
    out[i] = total;
  }
  return out;
}')
</pre>

The main differences:

- In C++, you subset a matrix with `()`, not `[]`.
- Use `.nrow()` and `.ncol()` methods to get the dimensions of a matrix.

#### 16.1.6 Using sourceCpp() <a name="16-1-6-Using-sourceCpp"></a>

So far, we’ve used inline C++ with `cppFunction()`. This makes presentation simpler, but for real problems, it’s usually easier to use stand-alone C++ files and then source them into R using `sourceCpp()`.

Your stand-alone C++ file should have extension ".cpp", and needs to start with Rcpp lib and namespace:

<pre class="prettyprint linenums">
#include &lt;Rcpp.h&gt;
using namespace Rcpp;
</pre>

And for **each** function that you want available within R, you need to prefix it with an Rcpp Attribute:

<pre class="prettyprint linenums">
// [[Rcpp::export]]
</pre>

You can embed R code in special C++ comment blocks. This is really convenient if you want to run some test code:

<pre class="prettyprint linenums">
/*** R
# R code goes here
*/
</pre>

注意：按 [Using Rcpp with RStudio](https://support.rstudio.com/hc/en-us/articles/200486088-Using-Rcpp-with-RStudio) 的说法：

> The `sourceCpp` function will first compile the C++ code into a shared library and then `source` all of the embedded R code.

而这里的 R code 一般都是函数调用，像上面说的 "run some test code" 就是个很常见的用法。比如你用 C++ 写了 `foo(int x)`，你可以紧接着写个 R 来调用，比如 `foo(100);`，或是用 benchmark 来测。

The R code is run with `source(echo = TRUE)` so you don’t need to explicitly print output.

To compile the C++ code, use `sourceCpp("path/to/file.cpp")`. This will create the matching R functions and add them to your current session. Note that these functions can not be saved in a .Rdata file and reloaded in a later session; they must be recreated each time you restart R. For example, running `sourceCpp()` on the following file implements mean in C++ and then compares it to the built-in `mean()`:

<pre class="prettyprint linenums">
#include &lt;Rcpp.h&gt;
using namespace Rcpp;

// [[Rcpp::export]]
double meanC(NumericVector x) {
  int n = x.size();
  double total = 0;

  for(int i = 0; i &lt; n; ++i) {
    total += x[i];
  }
  return total / n;
}

/*** R
library(microbenchmark)
x &lt;- runif(1e5)
microbenchmark(
  mean(x),
  meanC(x)
)
*/
</pre>

NB: if you run this code yourself, you’ll notice that `meanC()` is much faster than the built-in `mean()`. This is because it trades numerical accuracy for speed.

### 16.2 Attributes and other classes <a name="16-2-Attributes-and-other-classes"></a>

All R objects have attributes, which can be queried and modified with `.attr()`. Rcpp also provides `.names()` as an alias for the name attribute. The following code snippet illustrates these methods. Note the use of `::create()`, a class method. This allows you to create an R vector from C++ scalar values:

<pre class="prettyprint linenums">
#include &lt;Rcpp.h&gt;
using namespace Rcpp;

// [[Rcpp::export]]
NumericVector attribs() {
  NumericVector out = NumericVector::create(1, 2, 3);

  out.names() = CharacterVector::create("a", "b", "c");
  out.attr("my-attr") = "my-value";
  out.attr("class") = "my-class";

  return out;
}
</pre>

For S4 objects, `.slot()` plays a similar role to `.attr()`.

#### 16.2.1 Functions <a name="16-2-1-Functions"></a>

You can put R functions in an object of type `Function`. This makes calling an R function from C++ straightforward:

<pre class="prettyprint linenums">
#include &lt;Rcpp.h&gt;
using namespace Rcpp;

// [[Rcpp::export]]
RObject callWithOne(Function f) {
  return f(1);
}
</pre>

Then call it from R:

<pre class="prettyprint linenums">
callWithOne(function(x) x + 1)
#&gt; [1] 2
callWithOne(paste)
#&gt; [1] "1"
</pre>

What type of object does an R function return? We don’t know, so we use the catchall type `RObject`. An alternative is to return a `List`. For example, the following code is a basic implementation of `lapply` in C++:

<pre class="prettyprint linenums">
#include &lt;Rcpp.h&gt;
using namespace Rcpp;

// [[Rcpp::export]]
List lapply1(List input, Function f) {
  int n = input.size();
  List out(n);

  for(int i = 0; i &lt; n; i++) {
    out[i] = f(input[i]); # calling R function f
  }

  return out;
}
</pre>

In cpp, calling R functions with positional arguments is obvious, but to use named arguments, you need a special syntax:

<pre class="prettyprint linenums">
f("y", 1);
f(_["x"] = "y", _["value"] = 1);
</pre>

#### 16.2.2 Other types <a name="16-2-2-Other-types"></a>

There are also classes for many more specialised language objects: `Environment`, `ComplexVector`, `RawVector`, `DottedPair`, `Language`, `Promise`, `Symbol`, `WeakReference`, and so on.

### 16.3 Missing values <a name="16-3-Missing-values"></a>

#### 16.3.1 Scalar NAs <a name="16-3-1-Scalar-NAs"></a>

<pre class="prettyprint linenums">
#include &lt;Rcpp.h&gt;
using namespace Rcpp;

// [[Rcpp::export]]
List scalar_missings() {
  int int_s = NA_INTEGER;
  String chr_s = NA_STRING;
  bool lgl_s = NA_LOGICAL;
  double num_s2 = NAN;

  return List::create(int_s, chr_s, lgl_s, num_s, num_s2);
}
</pre>

<pre class="prettyprint linenums">
str(scalar_missings())
#&gt; List of 4
#&gt;  $ : int NA
#&gt;  $ : chr NA
#&gt;  $ : logi TRUE
#&gt;  $ : num NA
#&gt;  $ : num NaN
</pre>

##### Integer NA <a name="Integer-NA"></a>

With integers, missing values are stored as the smallest integer. But, since C++ doesn’t know that the smallest integer has this special behaviour, if you do anything to it you’re likely to get an incorrect value: for example, `evalCpp('NA_INTEGER + 1')` gives -2147483647.

##### Double NA <a name="Double-NA"></a>

R’s NA is a special type of IEEE 754 floating point number `NaN` (Not a Number). Any comparision that involves a `NaN` (or in C++, `NAN`) always evaluates as FALSE:

<pre class="prettyprint linenums">
evalCpp("NAN == 1")
#&gt; [1] FALSE
evalCpp("NAN &lt; 1")
#&gt; [1] FALSE
evalCpp("NAN &gt; 1")
#&gt; [1] FALSE
evalCpp("NAN == NAN")
#&gt; [1] FALSE
</pre>

But be careful when combining then with boolean values:

<pre class="prettyprint linenums">
evalCpp("NAN && TRUE")
#&gt; [1] TRUE
evalCpp("NAN || FALSE")
#&gt; [1] TRUE
</pre>

In numeric contexts NaNs will get propagated:

<pre class="prettyprint linenums">
evalCpp("NAN + 1")
#&gt; [1] NaN
evalCpp("NAN - 1")
#&gt; [1] NaN
evalCpp("NAN / 1")
#&gt; [1] NaN
evalCpp("NAN * 1")
#&gt; [1] NaN
</pre>

##### Boolean NA <a name="Boolean-NA"></a>

While C++’s bool has two possible values (true or false), a logical vector in R has three (TRUE, FALSE, and NA). If you coerce a length 1 logical vector, make sure it doesn’t contain any missing values otherwise they will be converted to TRUE.

#### 16.3.2 Vector NAs <a name="16-3-2-Vector-NAs"></a>

With vectors, you need to use a missing value specific to the type of vector, `NA_REAL`, `NA_INTEGER`, `NA_LOGICAL`, `NA_STRING`:

<pre class="prettyprint linenums">
#include &lt;Rcpp.h&gt;
using namespace Rcpp;

// [[Rcpp::export]]
List missing_sampler() {
  return List::create(
    NumericVector::create(NA_REAL),
    IntegerVector::create(NA_INTEGER),
    LogicalVector::create(NA_LOGICAL),
    CharacterVector::create(NA_STRING));
}
</pre>

<pre class="prettyprint linenums">
str(missing_sampler())
#&gt; List of 4
#&gt;  $ : num NA
#&gt;  $ : int NA
#&gt;  $ : logi NA
#&gt;  $ : chr NA
</pre>

To check if a value in a vector is missing, use the class method `::is_na()`:

<pre class="prettyprint linenums">
#include &lt;Rcpp.h&gt;
using namespace Rcpp;

// [[Rcpp::export]]
LogicalVector is_naC(NumericVector x) {
  int n = x.size();
  LogicalVector out(n);

  for (int i = 0; i &lt; n; ++i) {
    out[i] = NumericVector::is_na(x[i]);
  }
  return out;
}
</pre>

<pre class="prettyprint linenums">
is_naC(c(NA, 5.4, 3.2, NA))
#&gt; [1]  TRUE FALSE FALSE  TRUE
</pre>

Another alternative is the sugar function `is_na()`, which takes a vector and returns a logical vector:

<pre class="prettyprint linenums">
#include &lt;Rcpp.h&gt;
using namespace Rcpp;

// [[Rcpp::export]]
LogicalVector is_naC2(NumericVector x) {
  return is_na(x);
}
</pre>

<pre class="prettyprint linenums">
is_naC2(c(NA, 5.4, 3.2, NA))
#&gt; [1]  TRUE FALSE FALSE  TRUE
</pre>

Finally, `noNA(x)` asserts that the vector `x` does not contain any missing values, and allows optimisation of some mathematical operations.

### 16.4 Rcpp sugar <a name="16-4-Rcpp-sugar"></a>

Rcpp provides a lot of syntactic “sugar” to ensure that C++ functions work very similarly to their R equivalents. In fact, Rcpp sugar makes it possible to write efficient C++ code that looks almost identical to its R equivalent. If there’s a sugar version of the function you’re interested in, you should use it: it’ll be both expressive and well tested. Sugar functions aren’t always faster than a handwritten equivalent, but they will get faster in the future as more time is spent on optimising Rcpp.

#### 16.4.1 Arithmetic and logical operators <a name="16-4-1-Arithmetic-and-logical-operators"></a>

All the basic arithmetic and logical operators are vectorised: `+` `*`, `-`, `/`, `pow`, `<`, `<=`, `>`, `>=`, `==`, `!=`, `!`.  For example, we could use sugar to considerably simplify the implementation of `pdistC()`.

<pre class="prettyprint linenums">
pdistR &lt;- function(x, ys) {
  sqrt((x - ys) ^ 2)
}
</pre>

<pre class="prettyprint linenums">
#include &lt;Rcpp.h&gt;
using namespace Rcpp;

// [[Rcpp::export]]
NumericVector pdistC2(double x, NumericVector ys) {
  return sqrt(pow((x - ys), 2));
}
</pre>

#### 16.4.2 Logical summary functions <a name="16-4-2-Logical-summary-functions"></a>

The sugar function `any()` and `all()` are fully lazy so that `any(x == 0)`, for example, might only need to evaluate one element of a vector, and return a special type that can be converted into a `bool` using `.is_true()`, `.is_false()`, or `.is_na()`. We could also use this sugar to write an efficient function to determine whether or not a numeric vector contains any missing values. To do this in R, we could use `any(is.na(x))`:

<pre class="prettyprint linenums">
any_naR &lt;- function(x) any(is.na(x))
</pre>

However, the above code will do the same amount of work regardless of the location of the missing value. Here's the C++ implementation:

<pre class="prettyprint linenums">
#include &lt;Rcpp.h&gt;
using namespace Rcpp;

// [[Rcpp::export]]
bool any_naC(NumericVector x) {
  return is_true(any(is_na(x)));
}
</pre>

<pre class="prettyprint linenums">
x0 &lt;- runif(1e5)
x1 &lt;- c(x0, NA)
x2 &lt;- c(NA, x0)

microbenchmark(
  any_naR(x0), any_naC(x0),
  any_naR(x1), any_naC(x1),
  any_naR(x2), any_naC(x2)
)
#&gt; Unit: microseconds
#&gt;         expr    min     lq   mean median     uq     max neval
#&gt;  any_naR(x0) 592.00 611.00 708.89 622.00 694.00 1,790.0   100
#&gt;  any_naC(x0) 595.00 635.00 680.86 645.00 735.00   801.0   100
#&gt;  any_naR(x1) 551.00 612.00 765.49 624.00 751.00 1,910.0   100
#&gt;  any_naC(x1) 585.00 634.00 669.19 644.00 679.00   802.0   100
#&gt;  any_naR(x2) 326.00 332.00 457.22 347.00 402.00 1,570.0   100
#&gt;  any_naC(x2)   2.16   3.23   4.29   4.01   4.68    18.2   100
</pre>

#### 16.4.3 Vector views <a name="16-4-3-Vector-views"></a>

A number of helpful functions provide a "view" of a vector: `head()`, `tail()`, `rep_each()`, `rep_len()`, `rev()`, `seq_along()`, and `seq_len()`. In R these would all produce copies of the vector, but in Rcpp they simply point to the existing vector and override the subsetting operator (`[`) to implement special behaviour. This makes them very efficient: for instance, `rep_len(x, 1e6)` does not have to make a million copies of x.

#### 16.4.4 Other useful functions <a name="16-4-4-Other-useful-functions"></a>

Finally, there's a grab bag of sugar functions that mimic frequently used R functions:

* Math functions: `abs()`, `acos()`, `asin()`, `atan()`, `beta()`, `ceil()`, `ceiling()`, `choose()`, `cos()`, `cosh()`, `digamma()`, `exp()`, `expm1()`, `factorial()`, `floor()`, `gamma()`, `lbeta()`, `lchoose()`, `lfactorial()`, `lgamma()`, `log()`, `log10()`, `log1p()`, `pentagamma()`, `psigamma()`, `round()`, `signif()`, `sin()`, `sinh()`, `sqrt()`, `tan()`, `tanh()`, `tetragamma()`, `trigamma()`, `trunc()`. 
* Scalar summaries: `mean()`, `min()`, `max()`, `sum()`, `sd()`, and (for vectors) `var()`.
* Vector summaries: `cumsum()`, `diff()`, `pmin()`, and `pmax()`.
* Finding values: `match()`, `self_match()`, `which_max()`, `which_min()`.
* Dealing with duplicates: `duplicated()`, `unique()`.
* `d/q/p/r` for all standard distributions.

### 16.5 The STL <a name="16-5-The-STL"></a>

#### 16.5.1 Using iterators <a name="16-5-1-Using-iterators"></a>

<pre class="prettyprint linenums">
#include &lt;Rcpp.h&gt;
using namespace Rcpp;

// [[Rcpp::export]]
double sum3(NumericVector x) {
  double total = 0;
  
  NumericVector::iterator it;
  for(it = x.begin(); it != x.end(); ++it) {
    total += *it;
  }
  return total;
}
</pre>

<pre class="prettyprint linenums">
#include &lt;numeric&gt;
#include &lt;Rcpp.h&gt;
using namespace Rcpp;

// [[Rcpp::export]]
double sum4(NumericVector x) {
  return std::accumulate(x.begin(), x.end(), 0.0);
}
</pre>

`accumulate()` (along with the other functions in `<numeric>`, like `adjacent_difference()`, `inner_product()`, and `partial_sum()`) is not that important because Rcpp sugar provides equivalents.

#### 16.5.2 Sets <a name="16-5-2-Sets"></a>

The following function uses an unordered set to implement an equivalent to `duplicated()` for integer vectors. Note the use of `seen.insert(x[i]).second`: 

- `insert()` returns a pair, 
- the `.first` value is an iterator that points to element and 
- the `.second` value is a boolean that’s true if the value was a new addition to the set.

<pre class="prettyprint linenums">
// [[Rcpp::plugins(cpp11)]]
#include &lt;Rcpp.h&gt;
#include &lt;unordered_set&gt;
using namespace Rcpp;

// [[Rcpp::export]]
LogicalVector duplicatedC(IntegerVector x) {
  std::unordered_set&lt;int&gt; seen;
  int n = x.size();
  LogicalVector out(n);

  for (int i = 0; i &lt; n; ++i) {
    out[i] = !seen.insert(x[i]).second;
  }

  return out;
}
</pre>

Note that unordered sets are only available in C++ 11, which means we need to use the **cpp11 plugin**, `[[Rcpp::plugins(cpp11)]]`.

### 16.6 Case studies (略) <a name="16-6-Case-studies"></a>

### 16.7 Using Rcpp in a package (略) <a name="16-7-Using-Rcpp-in-a-package"></a>

## 17. R's C interface <a name="17--R's-C-interface"></a>

To see R’s complete C API, look at the header file `Rinternals.h`. It’s easiest to find and display this file from within R:

<pre class="prettyprint linenums">
rinternals &lt;- file.path(R.home("include"), "Rinternals.h")
file.show(rinternals)
</pre>

All functions are defined with either the prefix `Rf_` or `R_` but are exported without it (unless `#define R_NO_REMAP` has been used).

I do not recommend using C for writing new high-performance code. Instead write C++ with Rcpp. The Rcpp API protects you from many of the historical idiosyncracies of the R API, takes care of memory management for you, and provides many useful helper methods.

To understand existing C code, it’s useful to generate simple examples of your own that you can experiment with. To that end, all examples in this chapter use the `inline` package, which makes it extremely easy to compile and link C code to your current R session.

### 17.1 Calling C functions from R <a name="17-1-Calling-C-functions-from-R"></a>

Generally, calling a C function from R requires two pieces: a C function and an R wrapper function that uses `.Call()`. The simple function below adds two numbers together and illustrates some of the complexities of coding in C:

<pre class="prettyprint linenums">
// In C ----------------------------------------
#include &lt;R.h&gt;
#include &lt;Rinternals.h&gt;

SEXP add(SEXP a, SEXP b) {
  SEXP result = PROTECT(allocVector(REALSXP, 1));
  REAL(result)[0] = asReal(a) + asReal(b);
  UNPROTECT(1);

  return result;
}
</pre>

<pre class="prettyprint linenums">
# In R ----------------------------------------
add &lt;- function(a, b) {
  .Call("add", a, b)
}
</pre>

(An alternative to using `.Call` is to use `.External`.  It is used almost identically, except that the C function will receive a single argument containing a `LISTSXP`, a pairlist from which the arguments can be extracted. This makes it possible to write functions that take a variable number of arguments. However, it's not commonly used in base R and `inline` does not currently support `.External` functions.) 

In this chapter we'll produce the two pieces in one step by using the `inline` package. This allows us to write: 

<pre class="prettyprint linenums">
add &lt;- cfunction(c(a = "integer", b = "integer"), "
  SEXP result = PROTECT(allocVector(REALSXP, 1));
  REAL(result)[0] = asReal(a) + asReal(b);
  UNPROTECT(1);

  return result;
")
add(1, 5)
</pre>

### 17.2 R's C data structures <a name="17-2-R's-C-data-structures"></a>

At the C-level, all R objects are stored in a common datatype, the `SEXP`, or S-expression. All R objects are S-expressions so every C function that you create must return a `SEXP` as output and take `SEXP`s as inputs. (Technically, this is a pointer to a structure with typedef `SEXPREC`.) A `SEXP` is a variant type, with subtypes for all R's data structures. The most important types are: 

* `REALSXP`: numeric vector
* `INTSXP`: integer vector
* `LGLSXP`: logical vector
* `STRSXP`: character vector
* `VECSXP`: list
* `CLOSXP`: function (closure)
* `ENVSXP`: environment

__Beware:__ In C, lists are called `VECSXP`s not `LISTSXP`s. This is because early implementations of lists were Lisp-like linked lists, which are now known as "pairlists".

Character vectors are a little more complicated than the other atomic vectors. A `STRSXP`s contains a vector of `CHARSXP`s, where each `CHARSXP` points to C-style string stored in a global pool. This design allows individual `CHARSXP`'s to be shared between multiple character vectors, reducing memory usage. 

There are also `SEXP`s for less common object types:

* `CPLXSXP`: complex vectors
* `LISTSXP`: "pair" lists. At the R level, you only need to care about the distinction lists and pairlists for function arguments, but internally they are used in many more places
* `DOTSXP`: '...'
* `SYMSXP`: names/symbols
* `NILSXP`: `NULL`

And `SEXP`s for internal objects, objects that are usually only created and used by C functions, not R functions:

* `LANGSXP`: language constructs
* `CHARSXP`: "scalar" strings
* `PROMSXP`: promises, lazily evaluated function arguments
* `EXPRSXP`: expressions

There's no built-in R function to easily access these names, but pryr provides `sexp_type()`:
  
<pre class="prettyprint linenums">
library(pryr)

sexp_type(10L)
#&gt; [1] "INTSXP"
sexp_type("a")
#&gt; [1] "STRSXP"
sexp_type(T)
#&gt; [1] "LGLSXP"
sexp_type(list(a = 1))
#&gt; [1] "VECSXP"
sexp_type(pairlist(a = 1))
#&gt; [1] "LISTSXP"
</pre>

### 17.3 Creating and modifying vectors <a name="17-3-Creating-and-modifying-vectors"></a>

At the heart of every C function are conversions between R data structures and C data structures. Inputs and output will always be R data structures (`SEXP`s) and you will need to convert them to C data structures in order to do any work. 

An additional complication is the garbage collector: if you don’t **protect** every R object you create, the garbage collector will think they are unused and delete them.

#### 17.3.1 Creating vectors and garbage collection <a name="17-3-1-Creating-vectors-and-garbage-collection"></a>

The simplest way to create a new R-level object is to use `allocVector()`. It takes two arguments, the type of `SEXP` (or `SEXPTYPE`) to create, and the length of the vector:

<pre class="prettyprint linenums">
dummy &lt;- cfunction(body = '
  SEXP dbls = PROTECT(allocVector(REALSXP, 4));
  SEXP lgls = PROTECT(allocVector(LGLSXP, 4));
  SEXP ints = PROTECT(allocVector(INTSXP, 4));

  SEXP vec = PROTECT(allocVector(VECSXP, 3));
  SET_VECTOR_ELT(vec, 0, dbls);
  SET_VECTOR_ELT(vec, 1, lgls);
  SET_VECTOR_ELT(vec, 2, ints);

  UNPROTECT(4);
  return vec;
')
dummy()
#&gt; [[1]]
#&gt; [1] 2.85e-316 1.71e-316 2.35e-316  0.00e+00
#&gt; [[2]]
#&gt; [1]  TRUE  TRUE  TRUE FALSE
#&gt; [[3]]
#&gt; [1] 1 1 1 0
</pre>

- `PROTECT()` tells R that the object is in use and shouldn’t be deleted if the garbage collector is activated.
- `UNPROTECT()` takes a single integer argument, `n`, and unprotects the last `n` objects that were protected. 
	- The number of protects and unprotects must match. 
	- If not, R will warn about a “stack imbalance in .Call”.
	
Other specialised forms of protection are needed in some circumstances:

- `UNPROTECT_PTR()` unprotects the object pointed to by the SEXPs.
- `PROTECT_WITH_INDEX()` saves an index of the protection location that can be used to replace the protected value using `REPROTECT()`.

Properly protecting the R objects you allocate is extremely important! Improper protection leads to difficulty diagnosing errors, typically segfaults, but other corruption is possible as well. In general, if you allocate a new R object, you must `PROTECT` it.

For real functions, you may want to loop through each element in the vector and set it to a constant. The most efficient way to do that is to use `memset()`:

<pre class="prettyprint linenums">
zeroes &lt;- cfunction(c(n_ = "integer"), '
  int n = asInteger(n_);

  SEXP out = PROTECT(allocVector(INTSXP, n));
  memset(INTEGER(out), 0, n * sizeof(int));
  UNPROTECT(1);

  return out;
')
zeroes(10);
#&gt;  [1] 0 0 0 0 0 0 0 0 0 0
</pre>

#### 17.3.2 Missing and non-finite values <a name="17-3-2-Missing-and-non-finite-values"></a>

<pre class="prettyprint linenums">
is_na &lt;- cfunction(c(x = "ANY"), '
  int n = length(x);

  SEXP out = PROTECT(allocVector(LGLSXP, n));

  for (int i = 0; i &lt; n; i++) {
    switch(TYPEOF(x)) {
      case LGLSXP:
        LOGICAL(out)[i] = (LOGICAL(x)[i] == NA_LOGICAL);
        break;
      case INTSXP:
        LOGICAL(out)[i] = (INTEGER(x)[i] == NA_INTEGER);
        break;
      case REALSXP:
        LOGICAL(out)[i] = ISNA(REAL(x)[i]);
        break;
      case STRSXP:
        LOGICAL(out)[i] = (STRING_ELT(x, i) == NA_STRING);
        break;
      default:
        LOGICAL(out)[i] = NA_LOGICAL;
    }
  }
  UNPROTECT(1);

  return out;
')
is_na(c(NA, 1L))
#&gt; [1]  TRUE FALSE
is_na(c(NA, 1))
#&gt; [1]  TRUE FALSE
is_na(c(NA, "a"))
#&gt; [1]  TRUE FALSE
is_na(c(NA, TRUE))
#&gt; [1]  TRUE FALSE
</pre>

#### 17.3.3 Accessing vector data <a name="17-3-3-Accessing-vector-data"></a>

Use helper functions `REAL()`, `INTEGER()`, `LOGICAL()`, `COMPLEX()`, and `RAW()` to access the C array inside numeric, integer, logical, complex, and raw vectors:

<pre class="prettyprint linenums">
add_one &lt;- cfunction(c(x = "numeric"), "
  int n = length(x);
  SEXP out = PROTECT(allocVector(REALSXP, n));
  
  for (int i = 0; i &lt; n; i++) {
    REAL(out)[i] = REAL(x)[i] + 1; # REAL(out)[i] for out[i]
  }
  UNPROTECT(1);

  return out;
")
add_one(as.numeric(1:10))
#&gt;  [1]  2  3  4  5  6  7  8  9 10 11
</pre>

When working with longer vectors, there’s a performance advantage to using the helper function once and saving the result in a pointer:

<pre class="prettyprint linenums">
px = REAL(x);
pout = REAL(out);
for (int i = 0; i &lt; n; i++) {
  pout[i] = px[i] + 2;
}
</pre>

#### 17.3.4 Character vectors and lists <a name="17-3-4-Character-vectors-and-lists"></a>

Strings and lists are more complicated because the individual elements of a vector are `SEXP`s, not basic C data structures. 

- Each element of a `STRSXP` is a `CHARSXP`s, an immutable object that contains a pointer to C string stored in a global pool. 
- `STRING_ELT(x, i)` extract the `CHARSXP` at `x[i]`.
	- `CHAR(STRING_ELT(x, i))` to get the actual `const char*` string. 
- `SET_STRING_ELT(x, i, value)` set string at `x[i]`. 
- `mkChar()` turns a C string into a `CHARSXP`.
- `mkString()` turns a C string into a `STRSXP`. 

<pre class="prettyprint linenums">
abc &lt;- cfunction(NULL, '
  SEXP out = PROTECT(allocVector(STRSXP, 3));

  SET_STRING_ELT(out, 0, mkChar("a"));
  SET_STRING_ELT(out, 1, mkChar("b"));
  SET_STRING_ELT(out, 2, mkChar("c"));

  UNPROTECT(1);

  return out;
')
abc()
#&gt; [1] "a" "b" "c"
</pre>

#### 17.3.5 Modifying inputs <a name="17-3-5-Modifying-inputs"></a>

<pre class="prettyprint linenums">
add_three &lt;- cfunction(c(x = "numeric"), '
  REAL(x)[0] = REAL(x)[0] + 3;
  return x;
')
x &lt;- 1
y &lt;- x
add_three(x)
#&gt; [1] 4
x
#&gt; [1] 4
y
#&gt; [1] 4
</pre>

Not only has it modified the value of `x`, it has also modified `y`! This happens because of R’s lazy copy-on-modify semantics. To avoid problems like this, always `duplicate()` inputs before modifying them:

<pre class="prettyprint linenums">
add_four &lt;- cfunction(c(x = "numeric"), '
  SEXP x_copy = PROTECT(duplicate(x));
  REAL(x_copy)[0] = REAL(x_copy)[0] + 4;
  UNPROTECT(1);
  return x_copy;
')
x &lt;- 1
y &lt;- x
add_four(x)
#&gt; [1] 5
x
#&gt; [1] 1
y
#&gt; [1] 1
</pre>

If you’re working with lists, use `shallow_duplicate()` to make a shallow copy; `duplicate()` will also copy every element in the list.

#### 17.3.6 Coercing scalars <a name="17-3-6-Coercing-scalars"></a>

There are a few helper functions that turn length one R vectors into C scalars:

* `asLogical(x)`: `LGLSXP` => int
* `asInteger(x)`: `INTSXP` => int
* `asReal(x)`: `REALSXP` => double
* `CHAR(asChar(x))`: `STRSXP` => `const char*`

And helpers to go in the opposite direction:

* `ScalarLogical(x)`: int => `LGLSXP`
* `ScalarInteger(x)`: int => `INTSXP`
* `ScalarReal(x)`: double => `REALSXP`
* `mkString(x)`: `const char*` => `STRSXP`

#### 17.3.7 Long vectors <a name="17-3-7-Long-vectors"></a>

As of R 3.0.0, R vectors can have length greater than `2^31 - 1`. This means that vector lengths can no longer be reliably stored in an `int` and if you want your code to work with long vectors, you can't write code like `int n = length(x)`. Instead use the `R_xlen_t` type and the `xlength()` function, and write `R_xlen_t n = xlength(x)`.

### 17.4 Pairlists <a name="17-4-Pairlists"></a>

In R code, there are only a few instances when you need to care about the difference between a pairlist and a list. In C, pairlists play much more important role because they are used for calls, unevaluated arguments, attributes, and in `...`. In C, lists and pairlists differ primarily in how you access and name elements.

Unlike lists (`VECSXP`s), pairlists (`LISTSXP`s) have no way to index into an arbitrary location. Instead, R provides a set of helper functions that navigate along a linked list. The basic helpers are: 

- `CAR()`, which extracts the first element of the list, and 
	- CAR short for "Contents of the Address part of Register number". 是 lisp 术语。
- `CDR()`, which extracts the rest of the list. 
	- CDR short for "Contents of the Decrement part of Register number"
- These can be composed to get `CAAR()`, `CDAR()`, `CADDR()`, `CADDDR()`, and so on. 
- Corresponding to the getters, R provides setters `SETCAR()`, `SETCDR()`, etc.

<pre class="prettyprint linenums">
car &lt;- cfunction(c(x = "ANY"), 'return CAR(x);')
cdr &lt;- cfunction(c(x = "ANY"), 'return CDR(x);')
cadr &lt;- cfunction(c(x = "ANY"), 'return CADR(x);')

x &lt;- quote(f(a = 1, b = 2))
# The first element
car(x)
#&gt; f
# Second and third elements
cdr(x)
#&gt; $a
#&gt; [1] 1
#&gt; 
#&gt; $b
#&gt; [1] 2
# Second element
car(cdr(x))
#&gt; [1] 1
cadr(x)
#&gt; [1] 1
</pre>

Pairlists are always terminated with `R_NilValue`. To loop over all elements of a pairlist, use this template:

<pre class="prettyprint linenums">
count &lt;- cfunction(c(x = "ANY"), '
  SEXP el, nxt;
  int i = 0;

  for(nxt = x; nxt != R_NilValue; el = CAR(nxt), nxt = CDR(nxt)) {
    i++;
  }
  return ScalarInteger(i);
')
count(quote(f(a, b, c)))
#&gt; [1] 4
count(quote(f()))
#&gt; [1] 1
</pre>

You can make new pairlists with `CONS()` (for CONStruct) and new calls with `LCONS()`. Remember to set the last value to `R_NilValue`. Since these are R objects as well, they are eligible for garbage collection and must be `PROTECT`ed.

<pre class="prettyprint linenums">
new_call &lt;- cfunction(NULL, '
  SEXP REALSXP_10 = PROTECT(ScalarReal(10));
  SEXP REALSXP_5 = PROTECT(ScalarReal(5));
  SEXP out = PROTECT(LCONS(install("+"), LCONS(
    REALSXP_10, LCONS(
      REALSXP_5, R_NilValue
    )
  )));
  UNPROTECT(3);
  return out;
')
gctorture(TRUE)
new_call()
#&gt; 10 + 5
gctorture(FALSE)
</pre>

`TAG()` and `SET_TAG()` allow you to get and set the tag (aka name) associated with an element of a pairlist. The tag should be a symbol. To create a symbol (the equivalent of `as.symbol()` in R), use `install()`. 

Attributes are also pairlists, but come with the helper functions `setAttrib()` and `getAttrib()`:

<pre class="prettyprint linenums">
set_attr &lt;- cfunction(c(obj = "SEXP", attr = "SEXP", value = "SEXP"), '
  const char* attr_s = CHAR(asChar(attr));

  duplicate(obj);
  setAttrib(obj, install(attr_s), value);
  return obj;
')
x &lt;- 1:10
set_attr(x, "a", 1)
#&gt;  [1]  1  2  3  4  5  6  7  8  9 10
#&gt; attr(,"a")
#&gt; [1] 1
</pre>

(Note that `setAttrib()` and `getAttrib()` must do a linear search over the attributes pairlist.)

There are some (confusingly named) shortcuts for common setting operations: `classgets()`, `namesgets()`, `dimgets()`, and `dimnamesgets()` are the internal versions of the default methods of `class<-`, `names<-`, `dim<-`, and `dimnames<-`.

### 17.5 Input validation <a name="17-5-Input-validation"></a>

It’s usually easier to valid the input at the R level:

<pre class="prettyprint linenums">
add_ &lt;- cfunction(signature(a = "integer", b = "integer"), "
  SEXP result = PROTECT(allocVector(REALSXP, 1));
  REAL(result)[0] = asReal(a) + asReal(b);
  UNPROTECT(1);

  return result;
")

add &lt;- function(a, b) {
  stopifnot(is.numeric(a), is.numeric(b)) # validation
  stopifnot(length(a) == 1, length(b) == 1) # validation
  add_(a, b)
}
</pre>

Alternatively, if we wanted to be more accepting of diverse inputs we could do the following:

<pre class="prettyprint linenums">
add &lt;- function(a, b) {
  a &lt;- as.numeric(a)
  b &lt;- as.numeric(b)

  if (length(a) &gt; 1) warning("Only first element of a used")
  if (length(b) &gt; 1) warning("Only first element of b used")
  
  add_(a, b)
}
</pre>

To coerce objects at the C level, use `PROTECT(new = coerceVector(old, SEXPTYPE))`. This will return an error if the `SEXP` can not be converted to the desired type. 

To check if an object is of a specified type, you can use `TYPEOF`, which returns a `SEXPTYPE`:

<pre class="prettyprint linenums">
is_numeric &lt;- cfunction(c("x" = "ANY"), "
  return ScalarLogical(TYPEOF(x) == REALSXP);
")
is_numeric(7)
#&gt; [1] TRUE
is_numeric("a")
#&gt; [1] FALSE
</pre>

There are also a number of helper functions which return 0 for FALSE and 1 for TRUE:

* For atomic vectors: `isInteger()`, `isReal()`, `isComplex()`, `isLogical()`, `isString()`.
* For combinations of atomic vectors: `isNumeric()` (integer, logical, real), `isNumber()` (integer, logical, real, complex), `isVectorAtomic()` (logical, integer, numeric, complex, string, raw).
* For matrices (`isMatrix()`) and arrays (`isArray()`).
* For more esoteric objects: `isEnvironment()`, `isExpression()`, `isList()` (a pair list), `isNewList()` (a list), `isSymbol()`, `isNull()`, `isObject()` (S4 objects), `isVector()` (atomic vectors, lists, expressions).

Note that some of these functions behave differently to similarly named R functions with similar names. For example `isVector()` is true for atomic vectors, lists, and expressions, where `is.vector()` returns TRUE only if its input has no attributes apart from names.

### 17.6 Finding the C source code for a function <a name="17-6-Finding-the-C-source-code-for-a-function"></a>

In the base package, R doesn’t use `.Call()`. Instead, it uses two special functions: `.Internal()` and `.Primitive()`. Finding the source code for these functions is an arduous task: you first need to look for their C function name in `src/main/names.c` and then search the R source code. `pryr::show_c_source()` automates this task using GitHub code search:

<pre class="prettyprint linenums">
tabulate
#&gt; function (bin, nbins = max(1L, bin, na.rm = TRUE)) 
#&gt; {
#&gt;     if (!is.numeric(bin) && !is.factor(bin)) 
#&gt;         stop("'bin' must be numeric or a factor")
#&gt;     if (typeof(bin) != "integer") 
#&gt;         bin &lt;- as.integer(bin)
#&gt;     if (nbins &gt; .Machine$integer.max) 
#&gt;         stop("attempt to make a table with &gt;= 2^31 elements")
#&gt;     nbins &lt;- as.integer(nbins)
#&gt;     if (is.na(nbins)) 
#&gt;         stop("invalid value of 'nbins'")
#&gt;     .Internal(tabulate(bin, nbins)) # Then search this function!
#&gt; }
#&gt; &lt;bytecode: 0x62c5bd0&gt;
#&gt; &lt;environment: namespace:base&gt;
</pre>

<pre class="prettyprint linenums">
pryr::show_c_source(.Internal(tabulate(bin, nbins)))
#&gt; tabulate is implemented by do_tabulate with op = 0
</pre>

Internal and primitive functions (i.e. functions wrapped by `.Internal()` and `.Primitive()`) have a somewhat different interface than `.Call()` functions. They always have four arguments: 

* `SEXP call`: the complete call to the function. `CAR(call)` gives the name of the function (as a symbol); `CDR(call)` gives the arguments.
* `SEXP op`: an "offset pointer". This is used when multiple R functions use the same C function. For example `do_logic()` implements `&`, `|`, and `!`. `show_c_source()` prints this out for you.
* `SEXP args`: a pairlist containing the unevaluated arguments to the function.
* `SEXP rho`: the environment in which the call was executed.

例子略。
