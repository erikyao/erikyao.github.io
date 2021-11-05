---
layout: post
title: "URL Parameters / URL Query / Tornado <i>get_argument()</i>"
description: ""
category: Network 
tags: [URL]
---
{% include JB/setup %}

## URL Parameters / URL Query

又是个 terminology 用着用着就乱了的地方……

首先 URL Parameters 和 URL Query 在一个完备的 URL 中是两个不同的位置，现在常见的现象是 "不使用 URL Query 这个词"，然后 "又用 parameter 来指代 URL Query"，就 whatever 吧……

它俩的区别，粗略来说可以看 `help(urlparse.urlparse)`:

```python
In [39]: from urllib.parse import urlparse

In [40]: help(urlparse)

Help on function urlparse in module urllib.parse:

urlparse(url, scheme='', allow_fragments=True)
    Parse a URL into 6 components:
    <scheme>://<netloc>/<path>;<params>?<query>#<fragment>
    Return a 6-tuple: (scheme, netloc, path, params, query, fragment).
    Note that we don't break the components up in smaller bits
    (e.g. netloc is a single string) and we don't expand % escapes.
```

简单来说就是：

- `<path>` 后面 `;` 接着的就是 URL Parameters (注意是用词是复数)
- `<path>` 后面 `?` 接着的就是 URL Query (注意是用词是单数)
  - 单数说明即使你是多个 pair，比如 `k1=v1&k2=v2` 这样的形式，它整体是被视为 1 个 query 的
  - 也有把这个部分整体叫 "query string" 的，更能体现它的整体性 (虽然是 non-standard)

注意这两个分隔符是固定的，[RCF 1808 - 2.2. BNF for Relative URLs](https://datatracker.ietf.org/doc/html/rfc1808.html#section-2.2) 有写：

```bnf
rel_path    = [ path ] [ ";" params ] [ "?" query ]
```

另外，[RCF 1808](https://datatracker.ietf.org/doc/html/rfc1808) 是 [urllib.parse 的 docs](https://docs.python.org/3/library/urllib.parse.html) 在 refer 的，但其实最新的标准是 [RCF 3986](https://datatracker.ietf.org/doc/html/rfc3986)。不过这么基本的内容应该大差不离。

## A `urlparse` Bug? 

[Why URLs are Hard: Path Params & urlparse](https://sethmlarson.dev/blog/2020-04-10/why-urls-are-hard-path-params-urlparse) 里提到了一个 quirky 的例子：

```python
In [42]: from urllib.parse import urlparse

In [43]: urlparse("http://example.com/a;z=y;x/b;c;d=e")
Out[43]: ParseResult(scheme='http', netloc='example.com', path='/a;z=y;x/b', params='c;d=e', query='', fragment='')
```

对照 [RCF 1808 - 2.2. BNF for Relative URLs](https://datatracker.ietf.org/doc/html/rfc1808.html#section-2.2)，怎么看都应该是：`path='a'` 然后 `params='z=y;x/b;c;d=e'` 才对……(不知道 `urllib` 是写了个 Parser 还是用 regex 来做部分的……)

这从侧面说明 URL Parameters 可能会很 tricky，不知道这算不算是现在都用 URL Query 的原因之一……

## 分隔符 inside URL Query

最常见的 URL Query 形式就是 `k1=v1&k2=v2` 这样的，但是这里 `=` 和 `&` 的使用都是 **convention**。URL Query 的 BNF 并没有限定只能使用这两个符号，也没有限定 query 必须写成这样的形式。更多的讨论可以参考 [unor: What is the difference between URL parameters and query strings?](https://stackoverflow.com/a/39294675)。

### Multiple Values with the Same Parameter Name

这种情况下，URL Query 可以用 `k=v1&k=v2` 这样重复的 key 带多个 value，参照 [Correct way to pass multiple values for same parameter name in GET request](https://stackoverflow.com/questions/24059773/correct-way-to-pass-multiple-values-for-same-parameter-name-in-get-request) 的讨论，可见这也是 **convention**。

当然，你也可以用自定义的分隔符来切割 value，比如 `k=v1,v2` 这样。但此时这应该被视为 1 个 key 和 1 个 value，后续你自己 `split(',')` 是你 application 的事情。

看过上面 URL Parameters 之后，我觉得应该不推荐使用 `;` 来切割 value。

## 题外话：POST 的 Request Body 的写法

参照 [How are parameters sent in an HTTP POST request?](https://stackoverflow.com/questions/14551194/how-are-parameters-sent-in-an-http-post-request)，request body 的写法千奇百怪，要看它具体的 `Content-Type`。但如果是 `Content-Type: application/x-www-form-urlencoded`，它的 request body 的写法还是用的 URL Query 这一套 (从 `urlencoded` 这个名字应该能看出来)，比如：

```http
http://127.0.0.1/pass.php
POST /pass.php HTTP/1.1

Host: 127.0.0.1
User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64; rv:18.0) Gecko/20100101 Firefox/18.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
DNT: 1
Referer: http://127.0.0.1/pass.php
Cookie: passx=87e8af376bc9d9bfec2c7c0193e6af70; PHPSESSID=l9hk7mfh0ppqecg8gialak6gt5
Connection: keep-alive
Content-Type: application/x-www-form-urlencoded
Content-Length: 30
username=zurfyx&pass=password
```

最后一行是 request body，它还是 URL Query 那样的写法。 

## Tornado 的 `get_argument()`

先看 [`RequestHandler`](https://www.tornadoweb.org/en/stable/_modules/tornado/web.html#RequestHandler):

- `RequestHandler.get_query_argument(name=key)`: 获取 URL Query 中 `key` 对应的值
- `RequestHandler.get_body_argument(name=key)`: 获取 Request Body 中 `key` 对应的值
- `RequestHandler.get_argument(name=key)`: URL Query 和 Request Body 都检查，获取 `key` 对应的值

如果有 multiple value with the same key 的情况，可以用上述方法的复数 `get_arguments()`。

`RequestHandler` 内部会组合一个 [`HTTPServerRequest`](https://www.tornadoweb.org/en/stable/_modules/tornado/httputil.html#HTTPServerRequest) 来实现上述的功能：

```python
class RequestHandler(object):
    def __init__(
        self,
        application: "Application",
        request: httputil.HTTPServerRequest,
        **kwargs: Any
    ) -> None:
        ...
        self.request = request
        ...
```

`HTTPServerRequest` 会直接映射到 URL 的各个组成部分、以及 Request Body 等其他内容，同时会维护 `arguments`、`query_arguments`、`body_arguments` 这 3 个 `Dict[str, List[bytes]]`:

```python
def __init__(
        self,
        method: Optional[str] = None,
        uri: Optional[str] = None,
        version: str = "HTTP/1.0",
        headers: Optional[HTTPHeaders] = None,
        body: Optional[bytes] = None,
        host: Optional[str] = None,
        files: Optional[Dict[str, List["HTTPFile"]]] = None,
        connection: Optional["HTTPConnection"] = None,
        start_line: Optional["RequestStartLine"] = None,
        server_connection: Optional[object] = None,
    ) -> None:
        ...

        if uri is not None:
            self.path, sep, self.query = uri.partition("?")  # 注意 query 不是 init 的参数之一
        self.arguments = parse_qs_bytes(self.query, keep_blank_values=True)
        self.query_arguments = copy.deepcopy(self.arguments)
        self.body_arguments = {}  # type: Dict[str, List[bytes]]
```

然后 `HTTPServerRequest` 的 `self.body_arguments` 会在它自己的 `_parse_body()` 方法中填充，并回填到 `self.arguments`:

```python
def _parse_body(self) -> None:
    parse_body_arguments(
        self.headers.get("Content-Type", ""),
        self.body,
        self.body_arguments,
        self.files,
        self.headers,
    )

    for k, v in self.body_arguments.items():
        self.arguments.setdefault(k, []).extend(v)
```

这么一来，`RequestHandler` 就获得了 3 个查询 argument 的 sources:

1. `self.request.arguments`
1. `self.request.query_arguments`
1. `self.request.body_arguments`

`RequestHandler.get_argument(name=key)` 只需要把 `key` 对应的 bytes 从对应的 source 中拿出来，然后 decode 一下就可以 return 了。