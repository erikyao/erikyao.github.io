---
category: JavaScript
description: ''
tags: []
title: 'JavaScript: onclick 注意事项'
---

## 迅速切换 `onclick` 函数的写法

假定有：

```js
function loginA() { ... }
function loginB() { ... }
var login = loginA;
```

- 绑定方式一： inline 的 `<xxx onclick="login();" />`
- 绑定方式二： `$('#id').onclick(login)`
- 绑定方式三： `$('#id').onclick(function() { login(); })`

如果绑定之后，我写一句 `login = loginB`，那么 绑定方式一、绑定方式二 还是执行 `loginA`，但是 绑定方式三 是执行 `loginB` 的

我的想法是切换 `onclick`，但是又不想写两次绑定操作

实践证明，绑定都是硬绑定，是绑定到 “function 本体”，并不能说 “诶，我绑定个 function 指针”上去

## Remove inline `onclick`

```js
jQueryObjectXXX.attr('onclick', '').unbind('click');
```

**BUT**, 以下绑定 click 事件的做法是不对的：

```js
jQueryObjectXXX.attr('onclick', 'alert(xxx)'); // won't work
```

## Inline `onclick` 的执行逻辑

`<a onclick="alert(this);">` 实际是执行 `a.anonymous() { window.alert(this); }`

## Digress: Caller of event handler bound by `.bind()`

```js
onXXXClick = function(event) {
    ....
}
jQueryObjectXXX.bind("click", onXXXClick)
```

执行时，`onXXXClick` 的 caller 是 `jQueryObjectXXX` 的原生对象。在 `onXXXClick` 中执行 `console.log(this); console.log($(this));` 可验证这一结论