---
layout: post
title: "R Exploratory Data Analysis: Air Pollution Case Study"
description: "R"
category: R-101
tags: []
---
{% include JB/setup %}

对 [Air Pollution Case Study](https://class.coursera.org/exdata-005/lecture/69) 的总结。  

代码来自 [courses/04_ExploratoryAnalysis/CaseStudy/script.R](https://github.com/DataScienceSpecialization/courses/blob/master/04_ExploratoryAnalysis/CaseStudy/script.R)。  

偏基础操作。思路和操作流程值得学习。

-----

## 0. Getting raw data set and posing the question

Raw data file (on page [Download Detailed AQS Data](http://www.epa.gov/ttn/airs/airsaqs/detaildata/downloadaqsdata.htm)):

* [PM 2.5 - Local Conditions - 2012](http://www.epa.gov/ttn/airs/airsaqs/detaildata/501files/RD_501_88101_2012.zip)
* [PM 2.5 - Local Conditions - 1999](http://www.epa.gov/ttn/airs/airsaqs/detaildata/501files/Rd_501_88101_1999.Zip)

Or alternatively:

* [Data pack provided by Coursera](https://d396qusza40orc.cloudfront.net/exdata/data/pm25_data.zip)

First thing of course is that, any time you start to look at data, you have to have a basic idea in mind of what you're looking for. This could come in the form of a hypothesis or even more generally just in the basic question - do you know what are you trying to answer with this data set?  

我们在这个例子里用的数据是 1999 年和 2012 年的 PM2.5 数据，so the questions that you might want to ask is "are air pollution levels lower now than they were before?".  

## 1. Read in data from 1999

这里还是用的 "先解压再读取" 的方式。解压得到两个 txt 文件，先用 `head` 或者 `less` 命令来探一下，发现：

* 头两行以 # 开头，应该看做 comment 而不是 header
* 这两行 comment 的意思是："RD" 格式是如此如此，"RC" 格式是如此如此

	# RD|Action Code|State Code|County Code|Site ID|Parameter|POC|Sample Duration|Un
	it|Method|Date|Start Time|Sample Value|Null Data Code|Sampling Frequency|Monitor
	 Protocol (MP) ID|Qualifier - 1|Qualifier - 2|Qualifier - 3|Qualifier - 4|Qualif
	ier - 5|Qualifier - 6|Qualifier - 7|Qualifier - 8|Qualifier - 9|Qualifier - 10|A
	lternate Method Detectable Limit|Uncertainty  
	# RC|Action Code|State Code|County Code|Site ID|Parameter|POC|Unit|Method|Year|P
	eriod|Number of Samples|Composite Type|Sample Value|Monitor Protocol (MP) ID|Qua
	lifier - 1|Qualifier - 2|Qualifier - 3|Qualifier - 4|Qualifier - 5|Qualifier - 6
	|Qualifier - 7|Qualifier - 8|Qualifier - 9|Qualifier - 10|Alternate Method Detec
	table Limit|Uncertainty
	RD|I|01|027|0001|88101|1|7|105|120|19990103|00:00||AS|3|||||||||||||
	RD|I|01|027|0001|88101|1|7|105|120|19990106|00:00||AS|3|||||||||||||
	RD|I|01|027|0001|88101|1|7|105|120|19990109|00:00||AS|3|||||||||||||

为了确认一下，我们可以用 `grep` 命令来探一下是否有 "RC" 开头的记录:

> grep ^RC RD_501_88101_1999-0.txt
	
实践证明 1999 和 2012 都没有 "RC" 记录。所以我们的 column name 应该是由第一行的 comment 来指定。

接着可以着手读取 txt 文件了，需要注意的是：

* comment 不是 header，所以要指定 `header=FALSE`
* comment 要 skip 掉，所以指定 `comment.char = "#"`，意思是 "以 # 开头的是 comment，读取时请忽略掉"

<pre class="prettyprint linenums">
pm0 &lt;- read.table("RD_501_88101_1999-0.txt", comment.char = "#", header = FALSE, sep = "|", na.strings = "")
</pre>

接着是常规操作：

<pre class="prettyprint linenums">
dim(pm0)
head(pm0)
</pre>

现在要处理 column name：

<pre class="prettyprint linenums">
cnames &lt;- readLines("RD_501_88101_1999-0.txt", 1) ## read 1st line
print(cnames)
cnames &lt;- strsplit(cnames, "|", fixed = TRUE) ## split by "|"; fixed = TRUE 表示不用 regexp，match "|" exactly; 
print(cnames)
names(pm0) &lt;- make.names(cnames[[1]]) ## 首先 strsplit 返回的是一个 list；其次 make.names 的作用是把 cnames 元素里的空格换成了 "."，make it a syntactically valid name consisting of letters, numbers and the dot or underline
head(pm0)
</pre>

接着处理具体的 column：

<pre class="prettyprint linenums">
x0 &lt;- pm0$Sample.Value ## grab the PM2.5 value
class(x0)
str(x0)
summary(x0) ## 13000+ NA
mean(is.na(x0))  ## 这个用法很巧妙，得到 0.11 表示 11% 的值是 NA
</pre>

这个时候要考虑 missing value 对 analysis 的影响，在我们这个场合，是 generally 考虑年度的情况，所以 NA 应该可以忽略（NA 的处理也要具体情况具体分析）。

## 2. Read in data from 2012

和前面没有啥差别：

<pre class="prettyprint linenums">
pm1 &lt;- read.table("RD_501_88101_2012-0.txt", comment.char = "#", header = FALSE, sep = "|", na.strings = "")
names(pm1) &lt;- make.names(cnames[[1]])
head(pm1)
dim(pm1)
x1 &lt;- pm1$Sample.Value
class(x1)

summary(x1) ## Min. 是 -10，这有点不科学
summary(x0) ## make a comparison
mean(is.na(x1)) ## 5%
</pre>

## 3. Make a boxplot of both 1999 and 2012

<pre class="prettyprint linenums">
boxplot(x0, x1)
boxplot(log10(x0), log10(x1)) ## warning because x1 has some negative values
</pre>

2012 的 median 有下降，但是分布区间两头都比 1999 的要广，说明：

* 空气质量整体有好转
* 极好和极坏的情况增多

## 4. Check negative values in 'x1'

<pre class="prettyprint linenums">
negative &lt;- x1 < 0
sum(negative, na.rm = T) ## 26474 个 negative
mean(negative, na.rm = T) ## 2% are negative
dates &lt;- pm1$Date ## 我们想看下 negative values 是不是集中在某些具体的日期，先查看下日期的格式
str(dates)
dates &lt;- as.Date(as.character(dates), "%Y%m%d")
str(dates)
hist(dates, "month") ## 看看 month 的分布
</pre>

注意这里 `hist` 的用法有点特殊，这个 "month" 既不是字段也不是函数，而是一种 interval specification，参 [Histogram of a Date or Date-Time Object](http://stat.ethz.ch/R-manual/R-devel/library/graphics/html/hist.POSIXt.html)。这在 `?hist` 里是查不到的（我已经不想吐槽 R 的文档了）。

<pre class="prettyprint linenums">
hist(dates[negative], "month") ## 看看 negative values 所在的 month 的分布
## 并没有集中在某个月，所以应该不是突发的错误
## 所以这里我们就不再追究了
</pre>

## 5. Exploring changes at one monitor

这里有一个隐含的问题：我不知道 1999 和 2012 的 monitor 的位置是否有变化。如果 1999 的 monitor 都在污染严重的地方，2012 的 monitor 分布更均匀了，这也可能造成 PM2.5 的值下降。  

这时我们关注某个特定地点的情况，we can control for possible changes in the monitoring locations between 1999 and 2012，进而从侧面辅证我们的结论。  

首先我们要找到这么一个 location 在 1999 和 2012 的数据里都存在：

<pre class="prettyprint linenums">
## Find a monitor for New York State that exists in both datasets

## 注意 location 是 State-County-Site 三个值决定的
## 先从 New York State 入手
site0 &lt;- unique(subset(pm0, State.Code == 36, c(County.Code, Site.ID)))
site1 &lt;- unique(subset(pm1, State.Code == 36, c(County.Code, Site.ID)))

## 这里把 County 和 Site 拼起来，便于我们取交集
site0 &lt;- paste(site0[,1], site0[,2], sep = ".")
site1 &lt;- paste(site1[,1], site1[,2], sep = ".")
str(site0)
str(site1)

## 取交集（i.e. common locations）
both <- intersect(site0, site1)
print(both)

## 直接把 County 和 Site 拼起来创建一个新 column，便于我们用刚才得到交集来 subset
pm0$county.site &lt;- with(pm0, paste(County.Code, Site.ID, sep = "."))
pm1$county.site &lt;- with(pm1, paste(County.Code, Site.ID, sep = "."))

## 得到交集对应的记录
cnt0 &lt;- subset(pm0, State.Code == 36 & county.site %in% both)
cnt1 &lt;- subset(pm1, State.Code == 36 & county.site %in% both)

## 查看 common locations 在 2012 和 1999 的 observation number
sapply(split(cnt0, cnt0$county.site), nrow)
sapply(split(cnt1, cnt1$county.site), nrow)
</pre>

对比 observation number 之后，我们选取 `county.site == 63.2008` 这个 location： 

<pre class="prettyprint linenums">
## Choose county 63 and side ID 2008
pm1sub &lt;- subset(pm1, State.Code == 36 & County.Code == 63 & Site.ID == 2008)
pm0sub &lt;- subset(pm0, State.Code == 36 & County.Code == 63 & Site.ID == 2008)

dim(pm1sub)
dim(pm0sub)
</pre>

Plot PM2.5 data as a function of time, i.e. make a time series plot.

<pre class="prettyprint linenums">
## Plot data for 2012
dates1 <- pm1sub$Date
dates1 <- as.Date(as.character(dates1), "%Y%m%d")
x1sub <- pm1sub$Sample.Value
plot(dates1, x1sub)

## Plot data for 1999
dates0 &lt;- pm0sub$Date
dates0 &lt;- as.Date(as.character(dates0), "%Y%m%d")
x0sub &lt;- pm0sub$Sample.Value
plot(dates0, x0sub)

## Plot data for both years in same panel
par(mfrow = c(1, 2), mar = c(4, 4, 2, 1))
plot(dates0, x0sub, pch = 20)
abline(h = median(x0sub, na.rm = T))
plot(dates1, x1sub, pch = 20)  ## Whoa! Different ranges
abline(h = median(x1sub, na.rm = T))

## Make ylmt the same and re-plot
rng &lt;- range(x0sub, x1sub, na.rm = T)
plot(dates0, x0sub, pch = 20, ylim = rng)
abline(h = median(x0sub, na.rm = T))
plot(dates1, x1sub, pch = 20, ylim = rng)
abline(h = median(x1sub, na.rm = T))
</pre>

可以看出这个 location 的 median 和 extreme value 都有降。

## 6. Exploring changes at state level

这里隐藏了这样一个事实：EPA sets the national guidelines, but it is the state to make the implementation. 不同的州有不同的实施方案。

<pre class="prettyprint linenums">
##Calculate state-wide means
mn0 &lt;- with(pm0, tapply(Sample.Value, State.Code, mean, na.rm = T))
str(mn0)
summary(mn0)

mn1 &lt;- with(pm1, tapply(Sample.Value, State.Code, mean, na.rm = T))
str(mn1)

## Make separate data frames for states / years
d0 &lt;- data.frame(state = names(mn0), mean = mn0)
d1 &lt;- data.frame(state = names(mn1), mean = mn1)
mrg &lt;- merge(d0, d1, by = "state")
dim(mrg)
head(mrg)

## Plot 
par(mfrow = c(1, 1))
with(mrg, plot(rep(1999, 52), mrg[, 2], xlim = c(1998, 2013))) ## 把 52 个点都画在 x=1999 这条直线上
with(mrg, points(rep(2012, 52), mrg[, 3]))

## Connect points of each state
segments(rep(1999, 52), mrg[, 2], rep(2012, 52), mrg[, 3])
</pre>


