# Overview

Copy the original `_includes/xxx.html` to this folder for modification/customization.

See [Overriding Theme Defaults](https://mmistakes.github.io/minimal-mistakes/docs/overriding-theme-defaults/).

# `_includes/head/custom.html`

See [Head](https://mmistakes.github.io/minimal-mistakes/docs/layouts/#head).

## Modification 1: added mermaid.js to every post

The inheritance and inclusion relationships between the pages involved are:

1. [_layouts/single.html](https://github.com/mmistakes/minimal-mistakes/blob/master/_layouts/single.html) is inherited from [_layout/default.html](https://github.com/mmistakes/minimal-mistakes/blob/master/_layouts/default.html)
2. [_layout/default.html](https://github.com/mmistakes/minimal-mistakes/blob/master/_layouts/default.html) includes [_includes/head.html](https://github.com/mmistakes/minimal-mistakes/blob/master/_includes/head.html) and [_includes/head/custom.html](https://github.com/mmistakes/minimal-mistakes/blob/master/_includes/head/custom.html)

[_includes/head/custom.html](https://github.com/mmistakes/minimal-mistakes/blob/master/_includes/head/custom.html) is simply blank, so currently there is no need to sync with the MM repo.

In [_includes/head/custom.html](https://github.com/mmistakes/minimal-mistakes/blob/master/_includes/head/custom.html) I added:

```html
{% if page.mermaid %}
    {% include mermaid.html %}
{% endif %}
```

and the real mermaid.js configuration goes into [_includes/mermaid.html](https://github.com/erikyao/erikyao.github.io/blob/master/_includes/mermaid.html) in my blog repo.

The full configuration is:

```js
<script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11.6.0/+esm'
    let config = { 
        startOnLoad: true,
        
        theme: "neutral",
        themeVariables: {
            nodeBorder: '#FF6B6B', // Red border for nodes

            fontSize: '1em',  // Default is 16px
            fontFamily: 'Menlo, Consolas, Monaco, "Ubuntu Mono", monospace'
        },

        flowchart: { 
            useMaxWidth: true,  // Respect container width
            htmlLabels: true  // Enable HTML in node labels (for formatting)
        } 
    };
    mermaid.initialize(config);
    await mermaid.run({
        nodes: document.querySelectorAll('.language-mermaid'),
    });
</script>
```

Note that: 

- You may find many articles/LLMs recommend using `mermaid.init()`, but this method is already deprecated.
- Instead you should use `mermaid.run()` on every `<pre class="language-mermaid">` tag, which is translated directly from a ````mermaid`-marked Markdown code block.