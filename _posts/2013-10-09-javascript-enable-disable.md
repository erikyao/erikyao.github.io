---
category: JavaScript
description: ''
tags: []
title: 'JavaScript: enable & disable'
---

disable 某 element 用：`$("#xxx").attr("disabled", true);`

enable 某 element 用：`$("#xxx").removeAttr("disabled");`

不要用：`$("#xxx").removeClass("disabled");` 或者 `$("#xxx").attr("disabled", false);`