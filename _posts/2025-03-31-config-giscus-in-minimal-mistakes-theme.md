---
title: "Config Giscus in Minimal Mistakes theme"
description: ""
category: 
tags: []
toc: false
toc_sticky: false
---

Minimal Mistakes has some decent [instructions](https://mmistakes.github.io/minimal-mistakes/docs/configuration/#giscus-comments) on how to config Giscus. 

Just one thing to pay attention to: [giscus.app](https://giscus.app) will output a `<script>` tag containing all the configurations you choose. You can either:

1. hardcode the `<script>` tag into your post's html (e.g. `_layouts/single.html`), or
2. thanks to Minimal Mistakes, put those configurations inside `_config.yml`

If you choose the 2nd method, note that you have to translate the attributes in the `<script>` tag to YAML key/value pairs. Such translation can be made with the help from [minimal-mistakes/_includes/comments-providers/giscus.html](https://github.com/mmistakes/minimal-mistakes/blob/master/_includes/comments-providers/giscus.html).


E.g. if you have the tag from [giscus.app](https://giscus.app) as:

```html
<script src="https://giscus.app/client.js"
        data-mapping="pathname"
        ......
        data-theme="light"
        async>
</script>
```

then you can translate it into `_config.yml` as:

```yml
comments:
  provider: giscus
  giscus:
    discussion_term: "pathname"
    ......
    theme: "light"
```

because [minimal-mistakes/_includes/comments-providers/giscus.html](https://github.com/mmistakes/minimal-mistakes/blob/master/_includes/comments-providers/giscus.html) has done the following work for you:

```js
script.setAttribute('data-mapping', '{{ site.comments.giscus.discussion_term | default: "pathname" }}');
......
script.setAttribute('data-theme', '{{ site.comments.giscus.theme | default: "light" }}');
```
