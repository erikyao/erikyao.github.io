---
layout: post
title: "MySQL REGEXP"
description: ""
category: MySQL
tags: [RegularExpression-MySQL]
---
{% include JB/setup %}

　　参考 [Regular Expressions - User Guide](http://www.zytrax.com/tech/web/regex.htm)

---

## 1. 关于 [ ] 和 { }

　　[ ] 表示在 [ ] 所在的位置匹配一个 (only one) 字符，该字符的范围由 [ ] 内的内容指定。  

　　在使用 [:digit:] 这类的 Character Class 时需注意，[:digit:] 只相当于0-9，[[:digit:]] 才相当于[0-9]。[单独使用 [:digit:] 是要出问题的](http://bugs.mysql.com/bug.php?id=22568)  

　　{ } 用来指定匹配字符数，[ ] 默认地相当 [ ]{1}  

　　{ } 这类的 Iteration Metacharacter 的指定对象为 { } 之前的单个字符或 ( )，比如 abc{2} -->abcc，(abc){2} -->abcabc  

---

## 2. Positioning Metacharacters (Anchor)

　　^ 文本开始，$ 文本结尾，[[:<:]] 单词开头，[[:>:]] 单词结尾。作用范围是其前或其后的单个字符或是 ( )。注意它们出现的位置。

<pre class="prettyprint linenums">
-- 匹配一个以"x"开头、以"x"结尾的字符串  
SELECT 'x word x' REGEXP '^x[[:print:]]*x$'; -- 1  
-- 匹配一个以"x w"开头、以"d x"结尾的字符串  
SELECT 'x word x' REGEXP '^(x w)[[:print:]]*(d x)$'; -- 1  
-- 匹配一个包含以"w"开头的、以"d"结尾的单词的字符串  
SELECT 'x word x' REGEXP '[[:<:]]w[[:print:]]*d[[:>:]]'; -- 1  
-- 匹配一个包含以"wo"开头的、以"rd"结尾的单词的字符串  
SELECT 'x word x' REGEXP '[[:<:]](wo)[[:print:]]*(rd)[[:>:]]'; -- 1    
</pre>

不过这里用 ( ) 和不用 ( ) 貌似没有什么区别…