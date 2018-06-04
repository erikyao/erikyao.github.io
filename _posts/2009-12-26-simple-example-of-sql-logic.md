---
layout: post
title: "简单 SQL 语句的逻辑顺序"
description: ""
category: SQL
tags: []
---
{% include JB/setup %}

　　考虑一个简单的语句：

```sql
SELECT order_num, SUM(quantity * item_price) AS ordertotal  
FROM orderitems  
WHERE quantity > 1  
GROUP BY order_num  
HAVING ordertotal >= 50  
ORDER BY ordertotal; 
```

* FROM 确定所操作的表
	* WHERE 作行过滤 (row filtering)，过滤掉不符合条件的行
		* 将过滤后的表按 GROUP BY 分组
			* HAVING 作分组过滤 (group filtering)，过滤掉不符合条件的分组
				* 在过滤后的分组上作 SELECT 操作

ORDER BY 在何时执行并不重要，它只是保证最后的结果是排序显示的。