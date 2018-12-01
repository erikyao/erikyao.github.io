---
layout: post
title: "Digest of <i>R for Data Science</i>"
description: ""
category: R
tags: [Book]
---
{% include JB/setup %}

# Part I - Exploration

## Chapter 1 - Data Visualization with `ggplot2`

`data` 与 `mapping` 的完全形式：

```r
ggplot(data = <DATA>， mapping = aes(<MAPPINGS>)) + <GEOM_FUNCTION>(data = <DATA>， mapping = aes(<MAPPINGS>))
```

`ggplot` 里的 `data` 和 `mapping` 是 plot-global 的，`geom` 里的 `data` 和 `mapping` 是 geom-local 的，你不写就默认全盘使用 global；写了就是在 `geom` 范围内用 local 覆盖掉 global 相应的部分。这样在有多个 `geom` 时就可以灵活组合。比如：  

```r
ggplot(data = mpg, mapping = aes(x = displ, y = hwy)) +
	geom_point(mapping = aes(color = class)) +
	geom_smooth(data = filter(mpg, class == "subcompact"), se = FALSE)
```

七参数模型：

```r
ggplot(data = <DATA>) +
    <GEOM_FUNCTION>(mapping = aes(<MAPPINGS>), stat = <STAT>, position = <POSITION>) +
    <COORDINATE_FUNCTION> +
    <FACET_FUNCTION>
```

The seven parameters in the template compose the **grammar of graphics**.


## Chapter 2 - Workflow: Basics

R 语言基础。略。

## Chapter 3 - Data Transformation with `dplyr`

我要说 Hadley Wickham 真的是取名鬼才。[`dplyr` issue #1857: meaning of dplyr's name](https://github.com/tidyverse/dplyr/issues/1857):

> The `d` is for dataframes, the `plyr` is to evoke pliers (钳子).

And also:

> The precursor to `dplyr` was called `plyr`. The 'ply' in `plyr` comes from an expansion/refining of the various "apply" functions in R as part of the "split-apply-combine" model/strategy.

本章用的数据集是 `nycflights13::flights`，需要 `library(nycflights13)`

### 3.1 `dplyr` Basics

- `filter(df, x > 1[, y > 2])` 等价于：
```sql 
select from df where x > 1 [and y > 2]
```
- `arrange(df, x[, y])` 等价于：
```sql
select from df order by x [ASC] [, y [ASC]]
```
- `arrange(df, desc(x)[, y])` 等价于：
```sql
select from df order by x DESC [, y [ASC]]
``` 
- `select(df, x[, y])` 等价于：
```sql
select x [, y] from df
``` 
- Create new columns from other columns (`mutate()`).
- Collapse many values down to a single summary (`summarize()`).
- All above can be used in conjunction with `group_by()`

All these 6 functions work similarly:

1. The first argument is a data frame.
2. The subsequent arguments describe what to do with the data frame, using the variable names (**without quotes**).
3. The result is a new data frame.

### 3.2 `dplyr::filter()`

取 `(fligths$month == 1) & (flights$day == 1)` 的 row：

```r
filter(flights, month == 1, day == 1)  # 多个参数默认是 AND 关系
    # IS EQUIVALENT TO
filter(flights, month == 1 & day == 1)  # 不要用 &&
```

注意以下符号或函数都可以直接用：

- `x & y`
- `x | y`
- `!x`
- `xor(x, y)`
- `x %in% c(1,2,3)`

比如：

```r
filter(flights, month == 11 | month == 12)  # 取 `(fligths$month == 11) | (flights$month == 12)` 的 row；注意不要用 ||
    # IS EQUIVALENT TO
filter(flights, month %in% c(11, 12))

filter(flights, !(arr_delay > 120 | dep_delay > 120))
```

如果 column 上有 `NA` 值，那么对应的 row 不会被取到：

```r
df <- tibble(x = c(1, NA, 3))

filter(df, x > 1)
#> # A tibble: 1 x 1
#>       x
#>   <dbl>
#> 1     3
filter(df, is.na(x) | x > 1)
#> # A tibble: 2 x 1
#>       x
#>   <dbl>
#> 1    NA
#> 2     3
```

- 这是因为当 `x = NA` 时，`x > 1` 不可能被 evaluate 为 `TRUE` (实际会被 evaluate 成 `NA`)，那么必然也就不会被选到
- 这和当 `x = 0` 时，`x > 1` 是 `FALSE` 所以自然不会被选到是同一个道理

### 3.3 `dplyr::arrange()`

Order `flights` by `flights$year`, `flights$month` and `flights$day`:

```r
arrange(flights, year, month, day)
```

默认是升序排列 (`order by x ASC`)。若要降序 (`order by x DESC`) 排列，需要给 column name 套一个 `desc()` 函数：

```r
arrange(flights, desc(year))
```

注意：不管是升序还是降序，`NA` 值永远排在最后：

```r
df <- tibble(x = c(5, 2, NA))
arrange(df, x)
#> # A tibble: 3 × 1
#>       x
#>   <dbl>
#> 1     2
#> 2     5
#> 3    NA
arrange(df, desc(x))
#> # A tibble: 3 × 1
#>       x
#>   <dbl>
#> 1     5
#> 2     2
#> 3    NA
```

### 3.4 `dplyr::select()`

`flights[, c("year", "month", "day")]` 可以写成：

```r
select(flights, year, month, day)
```

然后 column name 竟然支持 slice 操作！比如 `year:day` 表示 "all columns between `year` and `day` (inclusive)":

```r
select(flights, year:day)
```

slice 还可以用负号表示 "inverse selection" (反选)，比如 `-(year:day)` 表示 "all columns except those from `year` to `day` (inclusive)":

```r
select(flights, -(year:day))
```

#### 3.4.1 `dplyr::select()` helpers

如果你在导入 `tidyverse` 后 `？select_helpers` 你其实会发现有两组文档：

```r
> library(tidyverse)
> ?select_helpers
Help on topic ‘select_helpers’ was found in the following packages:

  Package               Library
  dplyr                 /home/erik/R/x86_64-pc-linux-gnu-library/3.4
  tidyselect            /home/erik/R/x86_64-pc-linux-gnu-library/3.4
```

这个 `tidyselect` 包和 `dplyr` 的关系是：它是 `dplyr` 的 backend (参 [GitHub: tidyverse/tidyselect](https://github.com/tidyverse/tidyselect))。

而 `dplyr` 的 select helpers (和后面的 colnames context) 有很多接口是直接 delegate 给 `tidyselect` 的，我们后面会看到。这也说明这里我们可以不用太区分这两个包。

- 我这里提 `tidyselect` 是因为你 google 函数名经常是搜到 `tidyselect` 的文档里去了，但是只要你知道它和 `dplyr` 的关系，看 `tidyselect` 的文档其实也是一样能理解的

我们直接看 `dplyr` 的 `?select_helpers`：

- Description: These functions allow you to select variables based on their names.
    - `starts_with():` starts with a prefix
    - `ends_with():` ends with a prefix
    - `contains():` contains a literal string
    - `matches():` matches a regular expression
    - `num_range():` a numerical range like x01, x02, x03.
    - `one_of():` variables in character vector.
    - `everything():` all variables.
- Usage
    - `current_vars()`
    - `starts_with(match, ignore.case = TRUE, vars = current_vars())`
    - `ends_with(match, ignore.case = TRUE, vars = current_vars())`
    - `contains(match, ignore.case = TRUE, vars = current_vars())`
    - `matches(match, ignore.case = TRUE, vars = current_vars())`
    - `num_range(prefix, range, width = NULL, vars = current_vars())`
    - `one_of(..., vars = current_vars())`
    - `everything(vars = current_vars())`
- Arguments
    - `match:` A string. 
    - `ignore.case:` If `TRUE`, the default, ignores case when matching names.
    - `vars:` A character vector of variable names. When called from inside `select()` these are automatically set to the names of the table.
    - `prefix:` A prefix that starts the numeric range.
    - `range:` A sequence of integers, like 1:5
    - `width:`	Optionally, the "width" of the numeric range. For example, a range of 2 gives "01", a range of 3 gives "001", etc.
    - `...:` One or more character vectors.
- Return Value: An integer vector giving the position of the matched variables.

简单看几个例子：

选取 name 以 "d" 开头的 column：

```r
> select(flights, starts_with("d"))
# A tibble: 336,776 x 5
     day dep_time dep_delay dest  distance
   <int>    <int>     <dbl> <chr>    <dbl>
 1     1      517         2 IAH       1400
 2     1      533         4 IAH       1416
```

选取 name 以 "y" 结尾的 column：

```r
> select(flights, ends_with("y"))
# A tibble: 336,776 x 3
     day dep_delay arr_delay
   <int>     <dbl>     <dbl>
 1     1         2        11
 2     1         4        20
```

选取 name 包含 "arr" 的 column：

```r
> select(flights, contains("arr"))
# A tibble: 336,776 x 4
   arr_time sched_arr_time arr_delay carrier
      <int>          <int>     <dbl> <chr>  
 1      830            819        11 UA     
 2      850            830        20 UA
```

- `select(flights, matches(regex))` 这个就是选取 name 符合 `regex` 的 column
- `select(flights, num_range("x", 8:11))` 这个就是选取 name 为 "x8", "x9", "x10", "x11" 的这 4 个 column
- `select(flights, one_of(colnames_vec_a, colnames_vec_b))` 这个 `one_of` 的命名我觉得是最莫名其妙的，其实你看它源代码的意思是："取 name 在 $\text{colnames_vec_a} \cap \text{colnames_vec_b}$ 这个交集中的 column"
    - [Stack Overflow: Why is one_of() called that?](https://stackoverflow.com/a/46248833) 提到说 `one_of` 的一个 make sense 的使用场景是：我不知道 `colnames_vec_a` 到底是什么，它可能是用户输入的，可能是另一个 dataframe 的 colnames。我把 `colnames_vec_a` 拿过来就是想检查一下它里面的 colnames 是不是都合法，然后用来 subset 当前 dataframe 的时候也不会报 key error 

```r
> dplyr::one_of
function (..., vars = current_vars()) 
{
    keep <- c(...)
    if (!is_character(keep)) {
        bad("All arguments must be character vectors, not {type_of(keep)}")
    }
    if (!all(keep %in% vars)) {
        bad <- setdiff(keep, vars)
        warn(glue("Unknown variables: ", paste0("`", bad, "`", 
            collapse = ", ")))
    }
    match_vars(keep, vars)
}
<environment: namespace:dplyr>
```

- `select(flights, everything())` 这个就比较简单了，相当于 `select * from flights`

另外其实还有一个隐藏的:

- `select(flights, tidyselect::last_col())` 选取 last column

#### 3.4.2 `dplyr::select()` colnames context

我们注意到这所有的 helper 函数都有一个参数 `vars = current_vars()`，根据文档：

> `vars:` A character vector of variable names. When called from inside `select()` these are automatically set to the names of the table.

所以 `current_vars()` 的作用是：返回 dataframe `df` 的 `colnames(df)`

从这个角度来看，`select(flights, current_vars())`， `select(flights, one_of(current_vars()))` 和 `select(flights, everything())` 效果是一样的，但是不建议在应用中使用 `current_vars()` 因为它是给内部机制服务的，而且随着 package 的发展可能会被 deprecate 掉。[`dplyr`: Select variables](https://dplyr.tidyverse.org/reference/select_vars.html):

> **Retired**: These functions now live in the `tidyselect` package as `tidyselect::vars_select()`, `tidyselect::vars_rename()` and `tidyselect::vars_pull()`. These `dplyr` aliases are soft-deprecated and will be deprecated sometimes in the future.

从源代码来看，`current_vars()` 是从一个名为 `cur_vars_env` 的变量中取得 `colnames(df)` 的；对应的有一个 `set_current_vars()` 用来赋值 `cur_vars_env`：

```r
> dplyr::current_vars
function () 
{
    cur_vars_env$selected %||% abort("Variable context not set")
}
<environment: namespace:dplyr>
> dplyr:::set_current_vars
function (x) 
{
    stopifnot(is_character(x) || is_null(x))
    old <- cur_vars_env$selected
    cur_vars_env$selected <- x
    invisible(old)
}
<environment: namespace:dplyr>
```

- 我习惯叫 colnames context，统计学的 variable 本质就是 column，所以 variable environment 和 colnames context 是一个意思

而且 `cur_vars_env` 是 `dplyr` 的一个全局变量，并不是我一开始想象的 ~~"每次调用 `dplyr::select` 都会生成一个 select 对象来保存 colnames"~~

所以我们可以猜想 `select(flights, starts_with("d"))` 的内部过程是这样的：

```r
> dplyr:::set_current_vars(colnames(flights))  # STEP 1: 保存所有 colnames
> dplyr::current_vars()
 [1] "year"           "month"          "day"            "dep_time"      
 [5] "sched_dep_time" "dep_delay"      "arr_time"       "sched_arr_time"
 [9] "arr_delay"      "carrier"        "flight"         "tailnum"       
[13] "origin"         "dest"           "air_time"       "distance"      
[17] "hour"           "minute"         "time_hour" 
> dplyr::starts_with("d")  # STEP 2: 调用 starts_with("d") 返回待取 colnames 的 integer index
[1]  3  4  6 14 16
> dplyr::select_at(flights, dplyr::starts_with("d"))  # STEP 3: 根据 integer index 获取对应的 column
# A tibble: 336,776 x 5
     day dep_time dep_delay dest  distance
   <int>    <int>     <dbl> <chr>    <dbl>
 1     1      517         2 IAH       1400
 2     1      533         4 IAH       1416
```

#### 3.4.3 Digression: `::` 与 `:::`

细心的你可能已经发现了，`dplyr::current_vars()` 用的是 `::` 而 `dplyr:::set_current_vars` 用的是 `:::`。

这个问题在 [Re: [R] How to export a function from a package and access it only by specifying the namespace?](https://www.mail-archive.com/r-help@r-project.org/msg77742.html) 有讲：

> ...you did not export my_test_f in your NAMESPACE file. To access unexported functions, you must use the ':::' operator ...

> The purpose of the '::' operator is for those cases where multiple packages are loaded that each export a function with the same name.  This is known as "masking" and the last loaded package will contribute the dominant function-- i.e. the function the gets called when the user types "functionName()" and not "packageName::functionName()". The "::" operator allows the selection of functions that are masked by the dominant function.  
> <br/>
> If you really want to conceal a function from user-level code, don't export it and it will only be accessible via the ":::" operator.

- 所以 R 的 NAMESPACE file 大抵相当于 python 的 `__all__` (参 [Python: \_\_all\_\_](/python/2017/10/04/python-__all__))
- 若 `functionName` 出现在 `packageName` 的 NAMESPACE file，说明它随着 `packageName` 被 export，它可以在 `library(packageName)` 之后被直接访问到或是通过 "双冒号式" `packageName::functionName` 访问到
- 若 `functionName` 没有出现在 `packageName` 的 NAMESPACE file，说明它没有被 export，直接通过函数名或是 "双冒号式" 都无法访问到，但是可以通过 "三冒号式" `packageName:::functionName` 强行访问到

更多关于 NAMESPACE file 的内容可以参考 [Making Your First R Package](http://tinyheero.github.io/jekyll/update/2015/07/26/making-your-first-R-package.html)

### 3.5 Digression: `dplyr::rename()` 与 `dplyr::select()` 与

重命名单个 column：

