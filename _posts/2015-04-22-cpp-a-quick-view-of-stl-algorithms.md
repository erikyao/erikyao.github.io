---
layout: post
title: "C++: A quick view of STL algorithms"
description: ""
category: C++
tags: [Cpp-101]
---
{% include JB/setup %}

整理自：_Thinking in C++, Volumn 2_

基本都是来自 `<algorithm>`。

-----

## 目录

- [1. Filling and generating](#fill-gen)
- [2. Counting](#count)
- [3. Manipulating sequences](#manipulate-seq)
- [4. Searching and replacing](#search-replace)
- [5. Comparing ranges](#compare)
- [6. Removing elements](#remove)
- [7. Sorting and operations on sorted ranges](#sort-op)
	- [7.1 Sorting](#sort)
	- [7.2 Locating elements in sorted ranges](#locate-in-sorted)
	- [7.3 Merging sorted ranges](#merge-sorted)
	- [7.4 Set operations on sorted ranges](#set-op)
- [8. Heap operations](#heap-op)
- [9. Applying an operation to each element in a range](#apply)
- [10. Numeric algorithms](#numeric)
- [11. General utilities](#util)

-----

## 缩写

| Abbr.   | Original              |
|---------|-----------------------|
| InI     | InputIterator         |
| OutI    | OutputIterator        |
| ForwI   | ForwardIterator       |
| BiI     | BidirectionalIterator |
| RAI     | RandomAccessIterator  |
| SWO     | StrictWeakOrdering    |
| BinPred | BinaryPredicate       |
| UnaFunc | UnaryFunction         |
| BinFunc | BinaryFunction        |

-----
	
## <a name="fill-gen"></a>1. Filling and generating
	
- void **fill**(ForwI first, ForwI last, const T& value): 
	- assigns `value` to every element in the range [first, last)
- void **fill_n**(OutI first, Size n, const T& value): 
	- assigns `value` to `n` elements starting at `first`.
- void **generate**(ForwI first, ForwI last, Generator gen): 
	- makes a call to `gen()` for each element in the range [first, last)
- void **generate_n**(OutI first, Size n, Generator gen): 
	- calls `gen()` `n` times and assigns each result to `n` elements starting at `first`.
	
## <a name="count"></a>2. Counting
	
- **count**(InI first, InI last, const EqualityComparable& value):
	- returns the number of elements in [first, last) that are equivalent to `value` (when tested using `operator==`).
- **count_if**(InI first, InI last, Predicate pred):
	- returns the number of elements in [first, last`) that each cause `pred` to return true.
	
## <a name="manipulate-seq"></a>3. Manipulating sequences
	
- OutI **copy**(InI first, InI last, OutI destination)
- BiI2 **copy_backward**(BiI1 first, BiI1 last, BiI2 destinationEnd)
- void **reverse**(BiI first, BiI last)
- OutI **reverse_copy**(BiI first, BiI last, OutI destination)
- ForwI2 **swap_ranges**(ForwI1 first1, ForwI1 last1, ForwI2 first2)
	- Exchanges the contents of this two ranges of equal size by swapping corresponding elements.
- void **rotate**(ForwI first, ForwI middle, ForwI last)
	- Moves the contents of [first, middle) to the end of the sequence, and the contents of [middle, last) to the beginning.
- OutI **rotate_copy**(ForwI first, ForwI middle, ForwI last, OutI destination)
	- The original range is untouched, and the rotated version is copied into `destination`, returning the past-the-end iterator of the resulting range. 
	- Note that while `swap_ranges()` requires that the two ranges be exactly the same size, the “rotate” functions do not.
- bool **next_permutation**(BiI first, BiI last)
- bool **next_permutation**(BiI first, BiI last, SWO binary_pred)
- bool **prev_permutation**(BiI first, BiI last)
- bool **prev_permutation**(BiI first, BiI last, SWO binary_pred)
	- A permutation is one unique ordering of a set of elements. If you have `n` unique elements, there are `n!` (n factorial) distinct possible combinations of those elements. All these combinations can be conceptually sorted into a sequence using a lexicographical (dictionary-like) ordering and thus produce a concept of a “next” and “previous” permutation. So whatever the current ordering of elements in the range, there is a distinct “next” and “previous” permutation in the sequence of permutations.
	- The `next_permutation()` and `prev_permutation()` functions rearrange the elements into their next or previous permutation and, if successful, return true. 
		- If there are no more “next” permutations, the elements are in sorted order so `next_permutation()` returns false. 
		- If there are no more “previous” permutations, the elements are in descending sorted order so `previous_permutation()` returns false.
	- The versions of the functions that have a SWO argument perform the comparisons using `binary_pred` instead of `operator<`.
- void **random_shuffle**(RAI first, RAI last)
- void **random_shuffle**(RAI first, RAI last, RandomNumberGenerator& rand)
	- Randomly rearranges the elements in the range.
	- The first form uses an internal random number generator, 
	- and the second uses a user-supplied random-number generator. 
		- The generator must return a value in the range [0, n) for some positive n
- BiI **partition**(BiI first, BiI last, Predicate pred)
- BiI **stable_partition**(BiI first, BiI last, Predicate pred)
	- The “partition” functions move elements that satisfy `pred` to the beginning of the sequence. 
	- An iterator pointing one past the last of those elements is returned, 
		- which is, in effect, an “end iterator” for the initial subsequence of elements that satisfy pred. 
		- This location is often called the “partition point.”
		
## <a name="search-replace"></a>4. Searching and replacing

- InI **find**(InI first, InI last, const EqualityComparable& value)
- InI **find_if**(InI first, InI last, Predicate pred)
	- 见名知意
- ForwI **adjacent_find**(ForwI first, ForwI last)
- ForwI **adjacent_find**(ForwI first, ForwI last, BinPred binary_pred)
	- The first version searches for two adjacent elements that are equivalent (via `operator==`). 
	- The second version searches for two adjacent elements that, when passed together to `binary_pred`, produce a true result.
- ForwI1 **find_first_of**(ForwI1 first1, ForwI1 last1, ForwI2 first2, ForwI2 last2)
- ForwI1 **find_first_of**(ForwI1 first1, ForwI1 last1, ForwI2 first2, ForwI2 last2, BinPred binary_pred)
	- Search for the first element in the second range that’s equivalent to one in the first
		- 注意这是 range 2 的元素逐个与 range 1 的元素比较，是一个双重循环。可以想象成两个集合取交集时的比较。并不是 string 里找 substring 的逻辑
	- The first version uses `operator==`. 
	- The second version searches for two elements that, when passed together to `binary_pred`, produce a true result.
- ForwI1 **search**(ForwI1 first1, ForwI1 last1, ForwI2 first2, ForwI2 last2)
- ForwI1 **search**(ForwI1 first1, ForwI1 last1, ForwI2 first2, ForwI2 last2 BinPred binary_pred)
	- Checks to see if the second range occurs (in the exact order of the second range) within the first range, and if so returns an iterator pointing to the place in the first range where the second range begins. 
	- 这才是 string 里找 substring 的逻辑
- ForwI1 **find_end**(ForwI1 first1, ForwI1 last1, ForwI2 first2, ForwI2 last2)
- ForwI1 **find_end**(ForwI1 first1, ForwI1 last1, ForwI2 first2, ForwI2 last2, BinPred binary_pred)
	- `search` 的逆向版本。`search` 是找第一个 substring，`find_end` 是找最后一个 substring
- ForwI **search_n**(ForwI first, ForwI last, Size count, const T& value)
- ForwI **search_n**(ForwI first, ForwI last, Size count, const T& value, BinPred binary_pred)
	- Looks for a group of `count` consecutive values in [first, last) that are all equal to `value` (in the first form) or that all cause a return value of true when passed into `binary_pred` (in the second form). 
	- Returns last if such a group cannot be found.
- ForwI **min_element**(ForwI first, ForwI last)
- ForwI **min_element**(ForwI first, ForwI last, BinPred binary_pred)
	- Returns an iterator pointing to the first occurrence of the “smallest” value in the range
	- Returns last if the range is empty.
	- The first version performs comparisons with `operator<`, and the value `r` returned is such that `*e < *r ` is false for every element `e` in the range [first, r)
	- The second version compares using `binary_pred`, and the value `r` returned is such that `binary_pred(*e, *r)` is false for every element `e` in the range [first, r)
- ForwI **max_element**(ForwI first, ForwI last)
- ForwI **max_element**(ForwI first, ForwI last, BinPred binary_pred)
	- Returns an iterator pointing to the first occurrence of the largest value in the range.
	- Returns last if the range is empty.
	- The first version performs comparisons with `operator<`, and the value `r` returned is such that `*r < *e` is false for every element `e` in the range [first, r). 
	- The second version compares using `binary_pred`, and the value `r` returned is such that `binary_pred(*r, *e)` is false for every element `e` in the range [first, r).
- void **replace**(ForwI first, ForwI last, const T& old_value, const T& new_value)
- void **replace_if**(ForwI first, ForwI last, Predicate pred, const T& new_value)
- OutI **replace_copy**(InI first, InI last, OutI result, const T& old_value, const T& new_value)
- OutI **replace_copy_if**(InI first, InI last, OutI result, Predicate pred, const T& new_value)

## <a name="compare"></a>5. Comparing ranges

- bool **equal**(InI first1, InI last1, InI first2)
- bool **equal**(InI first1, InI last1, InI first2, BinPred binary_pred)
	- Returns true if both ranges are exactly the same. 
	- In the first case, the `operator==` performs the comparison, 
	- and in the second case `binary_pred` decides if two elements are the same.
- bool **lexicographical_compare**(InI1 first1, InI1 last1, InI2 first2, InI2 last2)
- bool **lexicographical_compare**(InI1 first1, InI1 last1, InI2 first2, InI2 last2, BinPred binary_pred)
	- Lexicographical comparison, or “dictionary” comparison, means that the comparison is done in the same way that we establish the order of strings in a dictionary.
	- 其实就是 java 的 String compare 的逻辑，但是要注意 returnType 是 bool。这里的逻辑是 `return range1 < range2;`
	- In the first version of the function, `operator<` performs the comparisons, 
	- and in the second version, binary_pred is used.
- pair<InI1, InI2> **mismatch**(InI1 first1, InI1 last1, InI2 first2)
- pair<InI1, InI2> **mismatch**(InI1 first1, InI1 last1, InI2 first2, BinPred binary_pred)
	- Returns 
		- (1) the element in the first range where the mismatch occurred and 
		- (2) the element in the second range where the mismatch occurred
	- If no mismatch occurs, the return value is last1 combined with the past-the-end iterator of the second range.
	- The `pair` template class is a struct with two members defined in the `<utility>` header.
	- The first function tests for equality using `operator==` while the second one uses `binary_pred`.
	
## <a name="remove"></a>6. Removing elements

首先要说下 remove 操作。remove 的时候，STL 的想法是维持 [first, last) 这个 range，不直接干掉元素而是把要删除的元素挪到了容器末尾，同时 remove 会 return 一个 new_last，这样 [first, new_last) 就成了新的 range，[new_last, last) is the sequence of removed elements，而 iterators in [new_last, last) are dereferenceable, and the element values are unspecified.

如果要强制删除，可以用 `c.erase(remove(c.begin(), c.end(), value), c.end());` 或者 remove 后紧接一个 resize。

- ForwI **remove**(ForwI first, ForwI last, const T& value)
- ForwI **remove_if**(ForwI first, ForwI last, Predicate pred)
- OutI **remove_copy**(InI first, InI last, OutI result, const T& value)
- OutI **remove_copy_if**(InI first, InI last, OutI result, Predicate pred)
	- The “if” versions pass each element to `pred()`. If `pred()` returns true, the element is removed. 
	- The “copy” versions do not modify the original sequence, but instead copy the remained values into a new range beginning at `result` and return an iterator indicating the past-the-end value of this new range.
- ForwI **unique**(ForwI first, ForwI last)
- ForwI **unique**(ForwI first, ForwI last, BinPred binary_pred)
- OutI **unique_copy**(InI first, InI last, OutI result)
- OutI **unique_copy**(InI first, InI last, OutI result, BinPred binary_pred)
	- 如果有连续的重复元素，则只保留一个，比如 aaaabbcd 会变成 abcd。但是这个操作和 remove 一样，要维持 [first, last) 这个 range；同时也是一样返回一个 new_last。
	- 用 `binary_pred` 的版本，如果 `binary_pred(*i, *(i-1))` 返回 true，我们则认为这两个相邻的元素是重复的。

## <a name="sort-op"></a>7. Sorting and operations on sorted ranges

### <a name="sort"></a>7.1 Sorting

- void **sort**(RAI first, RAI last)
	- Use `operator<` to sort the range into ascending order.
- void **sort**(RAI first, RAI last, SWO binary_pred)
- void **stable_sort**(RAI first, RAI last)
- void **stable_sort**(RAI first, RAI last, SWO binary_pred)
	- `sort()` 是 unstable 的。unstable 是指相等的元素没有稳定的排序结果，有可能这次是 "A1 < A2 < B" 下次就是 "A2 < A1 < B"
- void **partial_sort**(RAI first, RAI middle, RAI last)
- void **partial_sort**(RAI first, RAI middle, RAI last, SWO binary_pred)
	- Elements before `middle` are the smallest ones in the entire range and are sorted in ascending order, while the remaining elements are left without any specific order.
- RAI **partial_sort_copy**(InI first, InI last, RAI result_first, RAI result_last)
- RAI **partial_sort_copy**(InI first, InI last, RAI result_first, RAI result_last, SWO binary_pred)
	- 假设 range1 [first, last) 有 n 个元素，range2 [result_first, result_last) 有 m 个元素，一般会假设 m <= n。把 range1 排序，结果截取 m 个元素 copy 到 range2
	- 如果 m > n，也只能把 range1 的 n 个全部 copy 过去
	- range1 的实际顺序并没有改变
- void **nth_element**(RAI first, RAI nth, RAI last)
- void **nth_element**(RAI first, RAI nth, RAI last, SWO binary_pred)
	- 书上的解释我实在是看不懂，以下参考 [What's the practical difference between std::nth_element and std::sort?](http://stackoverflow.com/a/10352527)
	- 假设 [first, last) 有 m 个元素，m > n。`nth_element` 执行的是一个排序，排序过后，[first, nth) 内的元素都比 \*nth 小（前 n-1 名），(nth, last) 内的元素都比 \*nth 大（后 m-n-1 名）；而 \*nth 一定是第 n 小的元素（第 n 名）
		- [first, nth) 和 (nth, last) 这两个范围内并没有严格排序
	- If you want to answer "which element is the 4^th-smallest?" or "which elements are the 4 smallest ones?", use `nth_element(first, first+3, last)`
	- If you want to get the 4 smallest elements _in order_, you may want to consider using `partial_sort(first, first+3, last)`
	
### <a name="locate-in-sorted"></a>7.2 Locating elements in sorted ranges

- bool **binary_search**(ForwI first, ForwI last, const T& value)
- bool **binary_search**(ForwI first, ForwI last, const T& value, SWO binary_pred)
	- Tells you whether value appears in the sorted range [first, last).
- ForwI **lower_bound**(ForwI first, ForwI last, const T& value)
- ForwI **lower_bound**(ForwI first, ForwI last, const T& value, SWO binary_pred)
	- Returns an iterator indicating the first occurrence of `value` in the SORTED range [first, last). 
	- If `value` is not present, an iterator to where it would fit in the sequence is returned.
- ForwI **upper_bound**(ForwI first, ForwI last, const T& value)
- ForwI **upper_bound**(ForwI first, ForwI last, const T& value, SWO binary_pred)
	- Returns an iterator indicating one past the last occurrence of `value` in the SORTED range [first, last). 
	- If `value` is not present, an iterator to where it would fit in the sequence is returned.
- pair<ForwI, ForwI> **equal_range**(ForwI first, ForwI last, const T& value)
- pair<ForwI, ForwI> **equal_range**(ForwI first, ForwI last, const T& value, SWO binary_pred)
	- Essentially returns `lower_bound()` and `upper_bound()` results in a `pair`

### <a name="merge-sorted"></a>7.3 Merging sorted ranges

- OutI **merge**(InI1 first1, InI1 last1, InI2 first2, InI2 last2, OutI result)
- OutI **merge**(InI1 first1, InI1 last1, InI2 first2, InI2 last2, OutI result, SWO binary_pred)
	- 假定 range1 和 range2 都已经排好序，合并 range1 和 range2 到 `result` 并再次排序
- void **inplace_merge**(BiI first, BiI middle, BiI last)
- void **inplace_merge**(BiI first, BiI middle, BiI last, SWO binary_pred)
	- Assumes that [first, middle) and [middle, last) are both sorted ranges in the same sequence. Merge these two sub-ranges in sorted order.
	
### <a name="set-op"></a>7.4 Set operations on sorted ranges

- bool **includes**(InI1 first1, InI1 last1, InI2 first2, InI2 last2)
- bool **includes**(InI1 first1, InI1 last1, InI2 first2, InI2 last2, SWO binary_pred)
	- 你可以理解为 "如果 range2 是 range1 的子集，则返回 true"
	- 但实际并不是严格意义上的判断子集，因为 range1 和 range2 都不算是 set，是可以有重复元素的
- OutI **set_union**(InI1 first1, InI1 last1, InI2 first2, InI2 last2, OutI result)
- OutI **set_union**(InI1 first1, InI1 last1, InI2 first2, InI2 last2, OutI result, SWO binary_pred)
	- 同理，并不是严格意义上的取并集
	- 返回 `result` 的 last
- OutI **set_intersection**(InI1 first1, InI1 last1, InI2 first2, InI2 last2, OutI result)
- OutI **set_intersection**(InI1 first1, InI1 last1, InI2 first2, InI2 last2, OutI result, SWO binary_pred)
	- 同理，并不是严格意义上的取交集
	- 返回 `result` 的 last
- OutI **set_difference**(InI1 first1, InI1 last1, InI2 first2, InI2 last2, OutI result)
- OutI **set_difference**(InI1 first1, InI1 last1, InI2 first2, InI2 last2, OutI result, SWO binary_pred)
	- 同理，并不是严格意义上的取交集
	- All the elements that are in [first1, last1) but not in [first2, last2) are placed in the `result` set.
	- 返回 `result` 的 last
- OutI **set_symmetric_difference**(InI1 first1, InI1 last1, InI2 first2, InI2 last2, OutI result)
- OutI **set_symmetric_difference**(InI1 first1, InI1 last1, InI2 first2, InI2 last2, OutI result, SWO binary_pred)
	- 所谓 symmetric difference 就是 A-B 并上 B-A，等价于 A、B 的并集减去 A、B 的交集
	- 返回 `result` 的 last

## <a name="heap-op"></a>8. Heap operations

这里 heap 并不是内存的那个 heap，单指 heap 这种数据结构。

A heap is a way to organize the elements of a range that allows for fast retrieval of the element with the highest value at any moment (with `pop_heap()`), even repeatedly, while allowing for fast insertion of new elements (with `push_heap()`).

The element with the highest value is always pointed by `first`. The order of the other elements depends on the particular implementation, but it is consistent throughout all heap-related functions of this header.

- void **make_heap**(RAI first, RAI last)
- void **make_heap**(RAI first, RAI last, SWO binary_pred)
	- Turns an arbitrary range into a heap.
- void **push_heap**(RAI first, RAI last)
- void **push_heap**(RAI first, RAI last, SWO binary_pred)
	- Adds the element *(last-1) to the heap determined by the range [first, last-1)
- void **pop_heap**(RAI first, RAI last)
- void **pop_heap**(RAI first, RAI last, SWO binary_pred)
	- Places the largest element, i.e. *first, into the position (last-1) and reorganizes the remaining range so that it’s still in heap order. 
	- If you simply fetch *first, the next element would not be the next-largest element.
- void **sort_heap**(RAI first, RAI last)
- void **sort_heap**(RAI first, RAI last, SWO binary_pred)
	- This could be thought of as the complement to `make_heap()`. It takes a range that is in heap order and turns it into ordinary sorted order, so it is no longer a heap. 
	- That means that if you call `sort_heap()`, `push_heap()` or `pop_heap()` no longer make any sense.

## <a name="apply"></a>9. Applying an operation to each element in a range

- UnaFunc **for_each**(InI first, InI last, UnaFunc f)
	- Applies the function object `f` to each element in [first, last)
	- Returns `f`
- OutI **transform**(InI first, InI last, OutI result, UnaFunc f)
- OutI **transform**(InI1 first, InI1 last, InI2 first2, OutI result, BinFunc f)
	- Applies the function object `f` to each element in the range1 [first, last), or along with each element in range2 in the second version. 
	- Copies the return value (using `operator=`) into *result, incrementing `result` after each copy

## <a name="numeric"></a>10. Numeric algorithms

From `<numeric>`.

- T **accumulate**(InI first, InI last, T init)
- T **accumulate**(InI first, InI last, T init, BinFunc f)
	- `for(i in range) { init += f(init, i); } return init;`
- T **inner_product**(InI1 first1, InI1 last1, InI2 first2, T init)
- T **inner_product**(InI1 first1, InI1 last1, InI2 first2, T init, BinFunc1 op1, BinFunc2 op2)
	- 假定 range1 = {1, 1, 2, 2} and range2 = {1, 2, 3, 4}
	- version 1 的计算方法就是 (1*1) + (1*2) + (2*3) + (2*4)，最后加上 init 的值
	- version 2 的计算方法是：
		1. init = op1(init, op2(1,1));
		1. init = op1(init, op2(1,2));
		1. init = op1(init, op2(2,3));
		1. init = op1(init, op2(2,4));
- OutI **partial_sum**(InI first, InI last, OutI result)
- OutI **partial_sum**(InI first, InI last, OutI result, BinFunc op)
	- 计算 accumulative sum 序列
	- 比如假定 range1 = {1, 1, 2, 2, 3}, the generated sequence is {1, 1 + 1, 1 + 1 + 2, 1 + 1 + 2 + 2, 1 + 1 + 2 + 2 + 3}, that is, {1, 2, 4, 6, 9}.
	- version 2 是用 `op` 替代了 version 1 的 `operator+`。比如我们给 `op` 传一个 `multiplies<int>()`，那么得到的序列就是 {1, 1 x 1, 1 x 1 x 2, 1 x 1 x 2 x 2, 1 x 1 x 2 x 2 x 3}, that is, {1, 1, 2, 4, 12}.
	- 返回 result 的 last
- OutI **adjacent_difference**(InI first, InI last, OutI result)
- OutI **adjacent_difference**(InI first, InI last, OutI result, BinFunc op)
	- 假定 range1 = {1, 1, 2, 2, 3}, the resulting sequence is {1, 1 – 1, 2 – 1, 2 – 2, 3 – 2}, that is: {1, 0, 1, 0, 1}.
	- version 2 是用 `op` 替代了 version 1 的 `operator-`
	- 返回 result 的 last
	
## <a name="util"></a>11. General utilities

- const LessThanComparable& **min**(const LessThanComparable& a, const LessThanComparable& b)
- const T& **min**(const T& a, const T& b, BinPred binary_pred)
- const LessThanComparable& **max**(const LessThanComparable& a, const LessThanComparable& b)
- const T& **max**(const T& a, const T& b, BinPred binary_pred)
- void **swap**(Assignable& a, Assignable& b)
	- When this function is applied to two containers of the same type, it uses container's member function `swap()` to achieve fast performance. 
	- Consequently, if you apply the `sort()` algorithm to a container of containers, you will find that the performance is very fast—it turns out that fast sorting of a container of containers was a design goal of the STL.
- void **iter_swap**(ForwI1 a, ForwI2 b)

From `<utility>`.

- template<class T1, class T2> struct pair
- template<class T1, class T2> pair<T1, T2> **make_pair**(const T1&, const T2&)

From `<iterator>`.

- difference_type **distance**(InI first, InI last)
	- Tells you the number of elements between `first` and `last`. 
	- More precisely, it returns an integral value that tells you the number of times `first` must be incremented before it is equal to `last`.
- void **advance**(InI& i, Distance n)
	- Moves the iterator `i` forward by the value of `n`. 
	- It can also be moved backward for negative values of `n` if the iterator is bidirectional.
- back_insert_iterator<Container> **back_inserter**(Container& x)
- front_insert_iterator<Container> **front_inserter**(Container& x)
- insert_iterator<Container> **inserter**(Container& x, Iterator i)