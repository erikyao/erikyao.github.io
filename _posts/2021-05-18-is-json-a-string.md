---
category: JavaScript
description: ''
tags:
- JSON
title: Is JSON a string?
---

我写这篇的起因来自于这个灵魂拷问 [Is JSON a string?](https://stackoverflow.com/questions/54122999/is-json-a-string/54123061) 我觉得这又是个老外瞎用词导致的误解。

首先我们看下啥是 JSON。根据 [Introducing JSON](https://www.json.org/json-en.html):

> JSON (JavaScript Object Notation) is a lightweight data-interchange format...  
> <br/>
> JSON is a text format that is completely language independent...  
> <br/>
> ... make JSON an ideal data-interchange language.

我觉得这个介绍就够说明问题了：JSON 是一种 language-independent text format，同时又能看做是一门 individual language。这就够让人误解的了。

我认为，理解 JSON 的侧重点应该落到 "notation" 这个词上。因为它是 notation，所以应该把 JSON 和 JS object 分开。对 JSON 而言，JS 也好，Python 也好，Java 也好，这些 language 都是 JSON 的生产者和消费者，JSON 是独立于这些 language 的一种格式。

## Is JSON a string?

严格来说，不是。但我很能理解这种误解，因为作为 data interchange 的格式，JSON 最常见的 data interchange 载体就是 string。但同时我们也可以有 `.json` files，也能说有 "JSON data"，所以还是把 JSON 理解成格式最好。

## JSON string / JSON object / JSON data

这几个词我们虽然很常用，但其实还有点细微的区别：

- **JSON string:** a string in JSON format
  - 指的是 data interchange 的载体
- **JSON object:** the language-independent object represented in JSON format
  - 指的是 data interchange 的内容
    - 这就是把 JSON 看做是一门 language 了
- **JSON data:**
  - 可能是 JSON string 的集合
  - 也可能是 JSON object 的集合

## JSON Serialization / Deserialization

这两个词我的意见有点大，因为完备的语法逻辑是：

- To serialize (language-specific objects) to JSON format
- To deserialize from JSON format (to language-specific objects)

你说 "JSON serialization" 我总觉得你是要把 JSON data 做转换。我觉得你可以说：

- "the JSON serialization format"，或者
- "data serialization in/with JSON format"