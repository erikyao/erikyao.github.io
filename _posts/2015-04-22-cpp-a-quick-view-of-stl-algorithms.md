---
category: C++
description: ''
tags: []
title: 'C++: A quick view of STL algorithms'
toc: true
toc_sticky: true
---

整理自：_Thinking in C++, Volume 2_

基本都是来自 `#include <algorithm>`.
	
## 1. Filling and generating

```cpp
void fill(ForwardIterator first, ForwardIterator last, const T& value)
void fill_n(OutputIterator first, Size n, const T& value)

void generate(ForwardIterator first, ForwardIterator last, Generator gen)
void generate_n(OutputIterator first, Size n, Generator gen)
```

本质就是个 assignment in loop:
	
```python
for i in range(first, last):  # fill
	seq[i] = value  

for i in range(n):       # fill_n
	seq[first + i] = value  

for i in range(first, last):  # generate
	seq[i] = gen()  

for i in range(n):       # generate_n
	seq[first + i] = gen()  
```

## 2. Counting

```cpp
// count the number of elements that are equal to `value`, or meet `pred`
int count(InputIterator first, InputIterator last, const EqualityComparable& value)
int count_if(InputIterator first, InputIterator last, Predicate pred)
```
	
## 3. Manipulating sequences

```cpp
OutputIterator copy(InputIterator first, InputIterator last, OutputIterator dest)
BidirectionalIterator copy_backward(BidirectionalIterator first, BidirectionalIterator last, BidirectionalIterator dest)

void reverse(BidirectionalIterator first, BidirectionalIterator last)
OutputIterator reverse_copy(BidirectionalIterator first, BidirectionalIterator last, OutputIterator dest)  // reverse seq1 and then copy to seq2

// Exchanges the contents in `[first1, last1)` and `[first2, last2)` (`last2` not needed as a parameter) by swapping corresponding elements.
ForwardIterator swap_ranges(ForwardIterator first1, ForwardIterator last1, ForwardIterator first2)

// Moves the contents in `[first, middle)` to the end (of the sequence), and the contents in `[middle, last)` to the beginning.
void rotate(ForwardIterator first, ForwardIterator middle, ForwardIterator last)
// Does not alter the original seq, and the rotated version is copied into `dest`, returning the past-the-end iterator of the resulting seq. 
// Note that while `swap_ranges()` requires that the two seqs be exactly the same size, the `rotate()` functions do not.
OutputIterator rotate_copy(ForwardIterator first, ForwardIterator middle, ForwardIterator last, OutputIterator dest)
```

```cpp
bool next_permutation(BidirectionalIterator first, BidirectionalIterator last)
bool next_permutation(BidirectionalIterator first, BidirectionalIterator last, StrictWeakOrdering bin_pred)

bool prev_permutation(BidirectionalIterator first, BidirectionalIterator last)
bool prev_permutation(BidirectionalIterator first, BidirectionalIterator last, StrictWeakOrdering bin_pred)
```

- A permutation is one unique ordering of a set of elements. If you have $n$ unique elements, there are $n!$ ($n$-factorial) distinct possible combinations of those elements. 
- All these combinations can be conceptually sorted into a sequence using a lexicographical (dictionary-like) ordering and thus produce a concept of a _next_ and _previous_ permutation. 
- `next_permutation()` and `prev_permutation()` functions rearrange the elements into their next or previous permutation and, if successful, return true. 
	- If there are no more _next_ permutations, the elements are in sorted order so `next_permutation()` returns `false`. 
	- If there are no more _previous_ permutations, the elements are in descending sorted order so `previous_permutation()` returns `false`.
- The versions of the functions that have a `StrictWeakOrdering` argument perform the comparisons using `bin_pred` instead of `operator<`.

```cpp
// Randomly rearranges the elements in the seq, either uses an internal RNG, or a user-supplied RNG
void random_shuffle(RandomAccessIterator first, RandomAccessIterator last)
void random_shuffle(RandomAccessIterator first, RandomAccessIterator last, RandomNumberGenerator& rng)

// Move elements that satisfy `pred` to the beginning of the seq, making 2 groups inside the seq.
// Returns the _partition point_, i.e. an iterator to the first element of the second group.
// "unstable" 是指相等的元素没有稳定的排序结果
BidirectionalIterator partition(BidirectionalIterator first, BidirectionalIterator last, Predicate pred)
BidirectionalIterator stable_partition(BidirectionalIterator first, BidirectionalIterator last, Predicate pred)
```
		
## 4. Searching and replacing

```cpp
InputIterator find(InputIterator first, InputIterator last, const EqualityComparable& value)
InputIterator find_if(InputIterator first, InputIterator last, Predicate pred)

// Searches in the seq for two adjacent elements that are equivalent, via `operator==` or `bin_pred`
ForwardIterator adjacent_find(ForwardIterator first, ForwardIterator last)
ForwardIterator adjacent_find(ForwardIterator first, ForwardIterator last, BinaryPredicate bin_pred)

// Searches in the second seq for the first element that is also contained in the first seq, , via `operator==` or `bin_pred`
ForwardIterator find_first_of(ForwardIterator first1, ForwardIterator last1, ForwardIterator first2, ForwardIterator last2)
ForwardIterator find_first_of(ForwardIterator first1, ForwardIterator last1, ForwardIterator first2, ForwardIterator last2, BinaryPredicate bin_pred)
```

`find_first_of` 本质是个双重循环：

```python
for i in range(first2, last2): 
	for j in range(first1, last1):
		if seq2[i] == seq1[j]:
			return i
```

```cpp
// Checks to see if the second seq appears within the first seq, and if so returns an iterator pointing to the place in the first seq where the second seq begins.
// 类似于 "string 里查找 substring"
ForwardIterator search(ForwardIterator first1, ForwardIterator last1, ForwardIterator first2, ForwardIterator last2)
ForwardIterator search(ForwardIterator first1, ForwardIterator last1, ForwardIterator first2, ForwardIterator last2, BinaryPredicate bin_pred)

// `search` 的逆向版本: `search` 是找第一个 subseq, `find_end` 是找最后一个 subseq
ForwardIterator find_end(ForwardIterator first1, ForwardIterator last1, ForwardIterator first2, ForwardIterator last2)
ForwardIterator find_end(ForwardIterator first1, ForwardIterator last1, ForwardIterator first2, ForwardIterator last2, BinaryPredicate bin_pred)

// Looks for a group of `count` consecutive values in the seq that are all equal to `value` or meet `bin_pred`
// Returns `last` if such a group cannot be found.
ForwardIterator search_n(ForwardIterator first, ForwardIterator last, Size count, const T& value)
ForwardIterator search_n(ForwardIterator first, ForwardIterator last, Size count, const T& value, BinaryPredicate bin_pred)

// Returns an iterator pointing to the first occurrence of the “smallest” value in the seq
// Returns `last` if the seq is empty.
// Element `i` is "smallest" if `i < j`, or `bin_pred(i, j) == false` for every other `j`
ForwardIterator min_element(ForwardIterator first, ForwardIterator last)
ForwardIterator min_element(ForwardIterator first, ForwardIterator last, BinaryPredicate bin_pred)

// Similar to `min_element`
ForwardIterator max_element(ForwardIterator first, ForwardIterator last)
ForwardIterator max_element(ForwardIterator first, ForwardIterator last, BinaryPredicate bin_pred)

void replace(ForwardIterator first, ForwardIterator last, const T& old_value, const T& new_value)
void replace_if(ForwardIterator first, ForwardIterator last, Predicate pred, const T& new_value)
OutputIterator replace_copy(InputIterator first, InputIterator last, OutputIterator dest, const T& old_value, const T& new_value)
OutputIterator replace_copy_if(InputIterator first, InputIterator last, OutputIterator dest, Predicate pred, const T& new_value)
```

## 5. Comparing ranges

```cpp
// Returns true if both seqs are exactly the same
bool equal(InputIterator first1, InputIterator last1, InputIterator first2)
bool equal(InputIterator first1, InputIterator last1, InputIterator first2, BinaryPredicate bin_pred)

// 其实就是 java 的 String compare 的逻辑 (e.g. "AA" < "AB" < "BC")
// Returns `seq1 < seq2;` 
bool lexicographical_compare(InputIterator first1, InputIterator last1, InputIterator first2, InputIterator last2)
bool lexicographical_compare(InputIterator first1, InputIterator last1, InputIterator first2, InputIterator last2, BinaryPredicate bin_pred)

// Return the 2 locations (in the first seq and in the second seq respectively, as a pair) of the first mismatch (where `operator==` or `bin_pred` is false)
// `pair` is defined in `<utility>`
pair<InputIterator, InputIterator> mismatch(InputIterator first1, InputIterator last1, InputIterator first2)
pair<InputIterator, InputIterator> mismatch(InputIterator first1, InputIterator last1, InputIterator first2, BinaryPredicate bin_pred)
```
	
## 6. Removing elements

首先要说下 remove 操作的逻辑：

- remove 的时候，STL 的想法是维持 `[first, last)` 这个 range，不直接干掉元素而是把要删除的元素挪到了 seq 末尾，同时会 return 一个 `new_last`，这样 `[first, new_last)` 就成了新的 range
	- `[new_last, last)` is the sequence of removed elements，而 iterators to `[new_last, last)` are dereferenceable, and the element values are unspecified
- 如果要强制删除，可以用 `c.erase(remove(c.begin(), c.end(), value), c.end());` 或者 remove 后紧接一个 resize

```cpp
ForwardIterator remove(ForwardIterator first, ForwardIterator last, const T& value)
ForwardIterator remove_if(ForwardIterator first, ForwardIterator last, Predicate pred)

// Does not alter the original seq, copies the after-removal contents to `dest`
OutputIterator remove_copy(InputIterator first, InputIterator last, OutputIterator dest, const T& value)
OutputIterator remove_copy_if(InputIterator first, InputIterator last, OutputIterator dest, Predicate pred)

// 如果 seq 内有连续的重复元素，则只保留一个 (比如 aaaabbcd 会变成 abcd)
// 重复元素可以用 `operator==(*i, *(i+1))` 或者 `bin_pred(*i, *(i+1))` 判断
// 这个操作和 remove 一样，要维持 `[first, last)` 这个 range，同时也是一样返回一个 `new_last`
ForwardIterator unique(ForwardIterator first, ForwardIterator last)
ForwardIterator unique(ForwardIterator first, ForwardIterator last, BinaryPredicate bin_pred)

// Does not alter the original seq, copies the after-removal contents to `dest`
OutputIterator unique_copy(InputIterator first, InputIterator last, OutputIterator dest)
OutputIterator unique_copy(InputIterator first, InputIterator last, OutputIterator dest, BinaryPredicate bin_pred)
```

## 7. Sorting / Operations on sorted ranges

### 7.1 Sorting

```cpp
// "unstable" 是指相等的元素没有稳定的排序结果
void sort(RandomAccessIterator first, RandomAccessIterator last)
void sort(RandomAccessIterator first, RandomAccessIterator last, StrictWeakOrdering bin_pred)

void stable_sort(RandomAccessIterator first, RandomAccessIterator last)
void stable_sort(RandomAccessIterator first, RandomAccessIterator last, StrictWeakOrdering bin_pred)

// Elements before `middle` are the smallest ones in the entire range and are sorted in ascending order, while the remaining elements are left without any specific order.
void partial_sort(RandomAccessIterator first, RandomAccessIterator middle, RandomAccessIterator last)
void partial_sort(RandomAccessIterator first, RandomAccessIterator middle, RandomAccessIterator last, StrictWeakOrdering bin_pred)

// Does not alter the original seq, copies the after-sorted contents to `dest`
// 假设 seq1 [first, last) 有 n 个元素，seq2 [dest_first, dest_last) 有 m 个元素
	// 若 n > m: seq1 排序后，截取 m 个元素 copy 到 seq2
	// 若 n < m: seq1 排序后，把全部 n 个元素 copy 到 seq2
RandomAccessIterator partial_sort_copy(InputIterator first, InputIterator last, RandomAccessIterator dest_first, RandomAccessIterator dest_last)
RandomAccessIterator partial_sort_copy(InputIterator first, InputIterator last, RandomAccessIterator dest_first, RandomAccessIterator dest_last, StrictWeakOrdering bin_pred)

// 命名鬼才！这俩 function 的意思是 "pivot by the nth element"
// 排序过后，[first, nth) 内的元素都比 nth 小，(nth, last) 内的元素都比 nth 大，而 nth 一定是第 n 小的元素
void nth_element(RandomAccessIterator first, RandomAccessIterator nth, RandomAccessIterator last)
void nth_element(RandomAccessIterator first, RandomAccessIterator nth, RandomAccessIterator last, StrictWeakOrdering bin_pred)
```

关于 `nth_element`:

- 可以参考 [What's the practical difference between `std::nth_element` and `std::sort`?](http://stackoverflow.com/a/10352527)
- If you want to answer "which element is the 4th-smallest?" or "which elements are the 4 smallest ones?", use `nth_element(first, first+3, last)`
- If you want to get the 4 smallest elements _in order_, use `partial_sort(first, first+3, last)`
	
### 7.2 Locating elements in sorted ranges

```cpp
bool binary_search(ForwardIterator first, ForwardIterator last, const T& value)
bool binary_search(ForwardIterator first, ForwardIterator last, const T& value, StrictWeakOrdering bin_pred)

// Returns an iterator pointing the first occurrence of `value` in the SORTED seq. 
// If `value` is not present, an iterator to where it would fit in the seq is returned.
ForwardIterator lower_bound(ForwardIterator first, ForwardIterator last, const T& value)
ForwardIterator lower_bound(ForwardIterator first, ForwardIterator last, const T& value, StrictWeakOrdering bin_pred)

// Returns an iterator pointing one past the last occurrence of `value` in the SORTED seq. 
// If `value` is not present, an iterator to where it would fit in the sequence is returned.
ForwardIterator upper_bound(ForwardIterator first, ForwardIterator last, const T& value)
ForwardIterator upper_bound(ForwardIterator first, ForwardIterator last, const T& value, StrictWeakOrdering bin_pred)

// Returns `lower_bound()` and `upper_bound()` results in a `pair`
pair<ForwardIterator, ForwardIterator> equal_range(ForwardIterator first, ForwardIterator last, const T& value)
pair<ForwardIterator, ForwardIterator> equal_range(ForwardIterator first, ForwardIterator last, const T& value, StrictWeakOrdering bin_pred)
```

### 7.3 Merging sorted ranges

```cpp
// Assume seq1 and seq2 are both SORTED. Merges them and sorts again, saves result into `result`
OutputIterator merge(InputIterator first1, InputIterator last1, InputIterator first2, InputIterator last2, OutputIterator result)
OutputIterator merge(InputIterator first1, InputIterator last1, InputIterator first2, InputIterator last2, OutputIterator result, StrictWeakOrdering bin_pred)

// Assume [first, middle) and [middle, last) are both SORTED. Merges them and sorts in place
void inplace_merge(BidirectionalIterator first, BidirectionalIterator middle, BidirectionalIterator last)
void inplace_merge(BidirectionalIterator first, BidirectionalIterator middle, BidirectionalIterator last, StrictWeakOrdering bin_pred)
```
	
### 7.4 Set operations on sorted ranges

```cpp
// 你可以理解为 "如果 seq2 是 seq1 的子集，则返回 true"
// 但实际并不是严格意义上的判断子集，因为 seq1 和 seq2 都不算是 set，是可以有重复元素的
bool includes(InputIterator first1, InputIterator last1, InputIterator first2, InputIterator last2)
bool includes(InputIterator first1, InputIterator last1, InputIterator first2, InputIterator last2, StrictWeakOrdering bin_pred)

// 同理，并不是严格意义上的 “取并集"
// 返回 `result` 的 `last`
OutputIterator set_union(InputIterator first1, InputIterator last1, InputIterator first2, InputIterator last2, OutputIterator result)
OutputIterator set_union(InputIterator first1, InputIterator last1, InputIterator first2, InputIterator last2, OutputIterator result, StrictWeakOrdering bin_pred)

// 同理，并不是严格意义上的 “取交集"
// 返回 `result` 的 `last`
OutputIterator set_intersection(InputIterator first1, InputIterator last1, InputIterator first2, InputIterator last2, OutputIterator result)
OutputIterator set_intersection(InputIterator first1, InputIterator last1, InputIterator first2, InputIterator last2, OutputIterator result, StrictWeakOrdering bin_pred)

// 同理，并不是严格意义上的 “取差集"
// 返回 `result` 的 `last`
OutputIterator set_difference(InputIterator first1, InputIterator last1, InputIterator first2, InputIterator last2, OutputIterator result)
OutputIterator set_difference(InputIterator first1, InputIterator last1, InputIterator first2, InputIterator last2, OutputIterator result, StrictWeakOrdering bin_pred)

// 等价于 set_union(set_difference(A, B), set_difference(B, A)
// 等价于 set_difference(set_union(A, B), set_intersection(A, B))  
OutputIterator set_symmetric_difference(InputIterator first1, InputIterator last1, InputIterator first2, InputIterator last2, OutputIterator result)
OutputIterator set_symmetric_difference(InputIterator first1, InputIterator last1, InputIterator first2, InputIterator last2, OutputIterator result, StrictWeakOrdering bin_pred)
```

## 8. Heap operations

这里 heap 并不是内存的那个 heap，单指 heap 这种数据结构。

- A heap is a way to organize the elements of a range that allows for fast retrieval of the element with the highest value at any moment (with `pop_heap()`), even repeatedly, while allowing for fast insertion of new elements (with `push_heap()`).
- The element with the highest value is always pointed by `first`. 
- The order of the other elements depends on the particular implementation, but it is consistent throughout all heap-related functions of this header.

```cpp
// Turns an arbitrary seq into a heap.
// Defaults to max-heap
// To construct a min-heap, use `bin_pred = std::greater<>{}`
void make_heap(RandomAccessIterator first, RandomAccessIterator last)
void make_heap(RandomAccessIterator first, RandomAccessIterator last, StrictWeakOrdering bin_pred)

// Adds the element *(last-1) to the heap determined by the range [first, last-1)
void push_heap(RandomAccessIterator first, RandomAccessIterator last)
void push_heap(RandomAccessIterator first, RandomAccessIterator last, StrictWeakOrdering bin_pred)

// Places the largest element, i.e. *first, into the position (last-1) and reorganizes the remaining seq so that it’s still in heap order. 
// Note that if you simply fetch *first, the next element would not be the next-largest element.
void pop_heap(RandomAccessIterator first, RandomAccessIterator last)
void pop_heap(RandomAccessIterator first, RandomAccessIterator last, StrictWeakOrdering bin_pred)
```

C++ 的 heap 有点奇怪，它更像是个 conceptual 的 class，而不是一个具体的 class，比如你可以把一个 `vector` 给 `make_heap`:

```cpp
std::vector<int> v{3, 1, 4, 1, 5, 9};  // v = [3, 1, 4, 1, 5, 9]
std::make_heap(v.begin(), v.end());    // v = [9, 5, 4, 1, 1, 3]
```

从这个角度来说，`make_heap` 更应该被命名为 `make_into_heap_order`

此时我们仍然可以操作 `vector v`，但这些操作不直接影响 `v` 上的这个 heap:

```cpp
v.push_back(6);                      // v = [9, 5, 4, 1, 1, 3, 6]
// 注意此时只有 v[0:5] 构成一个合法的 heap
// v[6] == 6 是 vector 的元素不假，但它目前还没有在 heap 中 (i.e. 没有被排序)

std::push_heap(v.begin(), v.end());  // v = [9, 5, 6, 1, 1, 3, 4]
// 此时元素 6 才正式在 heap 中
// 或者说此时 v[0:6] 整体才构成一个合法的 heap
```

```cpp
// Takes a seq that is in heap order and turns it into ordinary sorted order
// After this operation, the seq is no longer a heap, and your further calls to `sort_heap()`, `push_heap()` or `pop_heap()` no longer make any sense.
void sort_heap(RandomAccessIterator first, RandomAccessIterator last)
void sort_heap(RandomAccessIterator first, RandomAccessIterator last, StrictWeakOrdering bin_pred)
```

## 9. Applying an operation to each element in a range

```cpp
// Applies the function object `f` to each element
// Returns `f`
UnaryFunction for_each(InputIterator first, InputIterator last, UnaryFunction f)

// Applies the function object `f` to each element in seq1, copies the return value (using `operator=`) into *result, incrementing `result` after each copy
OutputIterator transform(InputIterator first, InputIterator last, OutputIterator result, UnaryFunction f)
```

## 10. Numeric algorithms

```cpp
#include <numeric>

T accumulate(InputIterator first, InputIterator last, T init)
T accumulate(InputIterator first, InputIterator last, T init, BinaryFunction f)

T inner_product(InputIterator first1, InputIterator last1, InputIterator first2, T init)
T inner_product(InputIterator first1, InputIterator last1, InputIterator first2, T init, BinaryFunction op1, BinaryFunction op2)

// 计算 accumulative sum 序列
// 返回 `result` 的 `last`
OutputIterator partial_sum(InputIterator first, InputIterator last, OutputIterator result)
OutputIterator partial_sum(InputIterator first, InputIterator last, OutputIterator result, BinaryFunction op)

// 返回 `result` 的 `last`
OutputIterator adjacent_difference(InputIterator first, InputIterator last, OutputIterator result)
OutputIterator adjacent_difference(InputIterator first, InputIterator last, OutputIterator result, BinaryFunction op)
```

`inner_product` 的计算方法：

```python
# inner_product(seq1.begin(), seq1.end(), seq2.begin(), T init)
	# is EQUIVALENT to
result = init
for i in range(seq1.begin(), seq1.end()):
	result += seq1[i] * seq2[i]

# inner_product(seq1.begin(), seq1.end(), seq2.begin(), T init, BinaryFunction op1, BinaryFunction op2)
	# is EQUIVALENT to
result = init
for i in range(seq1.begin(), seq1.end()):
	result = op1(result, op2(seq1[i], seq2[i]))
```

`partial_sum` 的计算方法：

```python
# partial_sum(seq.begin(), seq.end(), result.begin())
	# is EQUIVALENT to
result[0] = seq[0]
i = 1
while i + seq.begin() < seq.end():
	result[i] = result[i-1] + seq[i]

# partial_sum(seq.begin(), seq.end(), result.begin(), op = multiplies<int>())
	# is EQUIVALENT to
result[0] = seq[0]
i = 1
while i + seq.begin() < seq.end():
	result[i] = op(result[i-1], seq[i])
```

`adjacent_difference` 的计算方法：

```python
# adjacent_difference(seq.begin(), seq.end(), result.begin())
	# is EQUIVALENT to
result[0] = seq[0]
i = 1
while i + seq.begin() < seq.end():
	result[i] = seq[i] - seq[i-1]

# partial_sum(seq.begin(), seq.end(), result.begin(), op)
	# is EQUIVALENT to
result[0] = seq[0]
i = 1
while i + seq.begin() < seq.end():
	result[i] = op(seq[i], seq[i-1])
```
	
## 11. General utilities

```cpp
const LessThanComparable& min(const LessThanComparable& a, const LessThanComparable& b)
const T& min(const T& a, const T& b, BinaryPredicate bin_pred)
const LessThanComparable& max(const LessThanComparable& a, const LessThanComparable& b)
const T& max(const T& a, const T& b, BinaryPredicate bin_pred)
void swap(Assignable& a, Assignable& b)
void iter_swap(ForwI1 a, ForwI2 b)
```

关于 `swap`:

- When `swap(a, b)` is applied to two containers (of the same type), it uses the container's member function `a.swap(b)` for better performance. 
- Similarly, if you apply `sort()` to a container of containers, you will find the performance very fast, because fast sorting of a container of containers was a design goal of the STL.

```cpp
#include <utility>

template<class T1, class T2> struct pair
template<class T1, class T2> pair<T1, T2> make_pair(const T1&, const T2&)
```

```cpp
#include<iterator>

// Tells you the number of elements between `first` and `last`.
// More precisely, the difference is an integral value indicating the number of times `first` must be incremented before it is equal to `last`.
difference_type distance(InputIterator first, InputIterator last)

// Moves the iterator `i` forward by the value of `n`. 
// It can also be moved backward for negative values of `n` if the iterator is bidirectional.
void advance(InputIterator& i, Distance n)

back_insert_iterator<Container> back_inserter(Container& x)
front_insert_iterator<Container> front_inserter(Container& x)
insert_iterator<Container> inserter(Container& x, Iterator i)
```
