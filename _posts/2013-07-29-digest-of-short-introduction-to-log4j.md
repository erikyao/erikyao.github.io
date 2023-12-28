---
category: log4j
description: ''
tags:
- Article
title: Digest of <i>Short introduction to log4j</i>
---

摘自 [Short introduction to log4j](http://logging.apache.org/log4j/1.2/manual.html)，自加评论。

-----

The first and foremost advantage of any logging API over plain System.out.println resides in its ability to disable certain log statements while allowing others to print unhindered. This capability assumes that the logging space, that is, the space of all possible logging statements, is categorized according to some developer-chosen criteria. This observation had previously led us to choose category as the central concept of the package. However, since log4j version 1.2, Logger class has replaced the Category class. For those familiar with earlier versions of log4j, the Logger class can be considered as a mere alias to the Category class.

> 在同一区域（比如同一个类中）打出的 log 称为同一 category 的 log，这个区域称为 logging space，logging  space 可以用 category 表示。目前 Logger 代替了 Category 的概念

-----

**Named Hierarchy**:   

A logger is said to be an ancestor of another logger if its name followed by a dot is a prefix of the descendant logger name. A logger is said to be a parent of a child logger if there are no ancestors between itself and the descendant logger.

> 比如 Logger("foo.bar") 就是 Logger("foo.bar.par") 的祖先

-----

The root logger resides at the top of the logger hierarchy. It is exceptional in two ways:

1. it always exists,
2. it cannot be retrieved by name.

> Root Logger 只能通过 Logger.getRootLogger 静态方法获取得到

-----

Loggers may be assigned levels. The set of possible levels, that is: TRACE, DEBUG, INFO, WARN, ERROR and FATAL  

If a given logger is not assigned a level, then it inherits one from its closest ancestor with an assigned level. More formally:

**Level Inheritance**

The inherited level for a given logger C, is equal to the first non-null level in the logger hierarchy, starting at C and proceeding upwards in the hierarchy towards the root logger.

To ensure that all loggers can eventually inherit a level, the root logger always has an assigned level.

> 如果 Logger 没有被 assign Level，那么它会从最近的一个有赋 Level 的祖先出继承 Level，一直追到 Root Logger 身上。所以 Root Logger 请务必 assign 一个 Level  
>   
> 如果 Logger 有被 assign 一个 Level，那么就不会继承 Level

-----

Logging requests are made by invoking one of the printing methods of a logger instance. These printing methods are debug, info, warn, error, fatal and log.
By definition, the printing method determines the level of a logging request. For example, if c is a logger instance, then the statement c.info("..") is a logging request of level INFO.

> 调用 logger 方法称为发起 logging 请求，比如 logger.info 表示发起一个 Level 为 INFO 的 logging 请求

-----

A logging request is said to be enabled if its level is higher than or equal to the level of its logger. Otherwise, the request is said to be disabled. A logger without an assigned level will inherit one from the hierarchy. This rule is summarized below.  

**Basic Selection Rule  **

A log request of level p in a logger with (either assigned or inherited, whichever is appropriate) level q, is enabled if p >= q
	
This rule is at the heart of log4j. It assumes that levels are ordered. For the standard levels, we have ALL < TRACE < DEBUG < INFO < WARN < ERROR < FATAL < OFF.

> 只有比 Logger 的 Level 高或者平级的 Logging request 才能被打出来  
>   
> 换言之，Logger 的 Level 其实是一个 threshold，只有达到这个 threshold 的 Logging request 才能打出来

-----

Calling the getLogger method with the same name will always return a reference to the exact same logger object. For example, in

```java
Logger x = Logger.getLogger("wombat");
Logger y = Logger.getLogger("wombat");
```
   
x and y refer to exactly the same logger object.

-----
 
Log4j allows logging requests to print to multiple destinations. In log4j speak, an output destination is called an appender. Currently, appenders exist for the console, files, GUI components, remote socket servers, JMS, NT Event Loggers, and remote UNIX Syslog daemons. It is also possible to log asynchronously.
More than one appender can be attached to a logger.

> appender 可以理解为输出文件

-----

Each enabled logging request for a given logger will be forwarded to all the appenders in that logger as well as the appenders higher in the hierarchy. In other words, appenders are inherited additively from the logger hierarchy. For example, if a console appender is added to the root logger, then all enabled logging requests will at least print on the console. If in addition a file appender is added to a logger, say C, then enabled logging requests for C and C's children will print on a file and on the console. It is possible to override this default behavior so that appender accumulation is no longer additive by setting the additivity flag to false.

> 一个 Logging request 首先会打到对应 Logger 的所有 appender 上，若该 logger 开了追加效果（additivity flag is true），那么这个 Logging 还会打到该 Logger 的上一级祖先（parent ONLY, not each ancestor）的 appender 上

-----

More often than not, users wish to customize not only the output destination but also the output format. This is accomplished by associating a layout with an appender. The layout is responsible for formatting the logging request according to the user's wishes, whereas an appender takes care of sending the formatted output to its destination.

> Layout 即 log 的格式

-----

```java
import com.foo.Bar;

// Import log4j classes.
import org.apache.log4j.Logger;
import org.apache.log4j.BasicConfigurator;

public class MyApp {

	// Define a static logger variable so that it references the
	// Logger instance named "MyApp".
	static Logger logger = Logger.getLogger(MyApp.class);

	public static void main(String[] args) {

		// Set up a simple configuration that logs on the console.
		BasicConfigurator.configure();

		logger.info("Entering application.");
		Bar bar = new Bar();
		bar.doIt();
		logger.info("Exiting application.");
	}
}
```

The invocation of the `BasicConfigurator.configure` method creates a rather simple log4j setup. This method is hardwired to add to the root logger a ConsoleAppender. The output will be formatted using a PatternLayout set to the pattern "%-4r [%t] %-5p %c %x - %m%n".  

Note that by default, the root logger is assigned to Level.DEBUG.  

-----

```java
import com.foo.Bar;

import org.apache.log4j.Logger;
import org.apache.log4j.PropertyConfigurator;

public class MyApp {

	static Logger logger = Logger.getLogger(MyApp.class.getName());

	public static void main(String[] args) {

		// BasicConfigurator replaced with PropertyConfigurator.
		PropertyConfigurator.configure(args[0]);

		logger.info("Entering application.");
		Bar bar = new Bar();
		bar.doIt();
		logger.info("Exiting application.");
	}
}
```

This version of MyApp instructs PropertyConfigurator to parse a configuration file and set up logging accordingly.

-----

Here is a sample configuration file that results in identical output as the previous BasicConfigurator based example.

```properties
# Set root logger level to DEBUG and its only appender to A1.
log4j.rootLogger=DEBUG, A1

# A1 is set to be a ConsoleAppender.
log4j.appender.A1=org.apache.log4j.ConsoleAppender

# A1 uses PatternLayout.
log4j.appender.A1.layout=org.apache.log4j.PatternLayout
log4j.appender.A1.layout.ConversionPattern=%-4r [%t] %-5p %c %x - %m%n
```
	
* 指定 Root Logger 的 Level 为 DEBUG，使用 appedner A1
* 指定 appender A1 为 一个 ConsoleAppender
* 指定 appender A1 的 Layout 为一个 PatternLayout，并随即给出指定的 Pattern

-----

The user should be aware of the following performance issues.

### 1. Logging performance when logging is turned off.

```java
logger.debug("Entry number: " + i + " is " + String.valueOf(entry[i]));
```

- 若打出 log： 字符串拼接时间 + 判断 debug 能否打出的时间 + 真正输出 log 的时间  
- 若不打出 log： 字符串拼接时间 + 判断 debug 能否打出的时间

```java
if (logger.isDebugEnabled()) {  
	logger.debug("Entry number: " + i + " is " + String.valueOf(entry[i]));  
}
```

- 若打出 log: 字符串拼接时间 + 两次判断 debug 能否打出的时间 + 真正输出 log 的时间  
- 若不打出 log: 判断 debug 能否打出的时间

判断 debug 能否打出的时间 很短。以上两种方式请酌情考虑
	
### 2. The performance of deciding whether to log or not to log when logging is turned on.

This is essentially the performance of walking the logger hierarchy. When logging is turned on, log4j still needs to compare the level of the log request with the level of the request logger. However, loggers may not have an assigned level; they can inherit them from the logger hierarchy. Thus, before inheriting a level, the logger may need to search its ancestors.  

There has been a serious effort to make this hierarchy walk to be as fast as possible. For example, child loggers link only to their existing ancestors. In the BasicConfigurator example shown earlier, the logger named com.foo.Bar is linked directly to the root logger, thereby circumventing the nonexistent com or com.foo loggers. This significantly improves the speed of the walk, especially in "sparse" hierarchies.  

The typical cost of walking the hierarchy is typically 3 times slower than when logging is turned off entirely.

### 3. Actually outputting log messages

This is the cost of formatting the log output and sending it to its target destination. Here again, a serious effort was made to make layouts (formatters) perform as quickly as possible. The same is true for appenders. The typical cost of actually logging is about 100 to 300 microseconds.