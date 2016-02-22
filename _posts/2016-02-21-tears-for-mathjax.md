---
layout: post
title: "Mathjax 血泪史"
description: ""
category: jekyll
tags: [Config-Jekyll]
---
{% include JB/setup %}

Github Pages 升级到了 Jekyll 3.0，而且将使用 kramdown 解析引擎。我紧跟大部队，local build 环境也升级了，但是发现了 MathJax 有超级多的问题，特来写下血泪史……

local build environment:

- jekyll: 3.1.1
- kramdown: 1.9.0

<!-- -->

	markdown: kramdown
	mathjax: true

	kramdown:
		# GFM for Github Flavored Markdown
		input: GFM
		syntax_highlighter: rouge

## 1. 需要你 escape `_` 和 `^` 的解析引擎都不是好引擎！

没错，我说的就是你 rdiscount！我 replace 原来 blog 里无数的 `\_` 和 `\^`。这一点必须给 kramdown 点赞。

## 2. 但是有些字符在 `\\( ... \\)` 要 escape，而在 `$ ... $` 中不会

我忘了具体是什么字符，但是我树立了一个标准：在 MathJax 里写的 latex，拿到 TexLive 之类的编辑器里可以立即使用，不要搞两个标准。所以我全部使用 `$ ... $` 和 `$$ ... $$`。

## 3. 请严格区分 `$ ... $` 和 `$$ ... $$`

local build 对 `$ ... $` 和 `$$ ... $$` 识别得很好！你在一行文字中间使用 `$$ ... $$` 它会自动识别成 inline math mode！

但是！online build 没有这么聪明！`$$ ... $$` 是一定会占一整行的……所以请严格区分 inline 和 display math mode！

还有，请务必打开这个配置！

	# \_includes\themes\twitter\default-mathjax.html
	
	<script type="text/x-mathjax-config">
	MathJax.Hub.Config({
		extensions: ["tex2jax.js"],
		jax: ["input/TeX", "output/HTML-CSS"],
		tex2jax: {
			inlineMath: [ ['$','$'] ],
			displayMath: [ ['$$','$$'] ],
			processEscapes: true
		},
		"HTML-CSS": { availableFonts: ["TeX"] }
	});
	</script>

## 4. 你搞不清楚是要 `\\` 还是 `\\\\`，那就用 `\newline`

这一点我超喜欢 latex，总有可以避免 “你妹到底要不要 escape” 这个问题的解决方案。

不过有个新问题是 `\begin{equation} ... \end{equation}` 内部不能使用 `\newline`，原来使用 `\\\\` 的时候没有这个问题。改成 `\begin{align} ... \end{align}` 就好了。
	
## 5. 请替换 `\left \{ ... \right \}` 为 `\lbrace ... \rbrace`

同样也是转义的问题，我搞不清楚到底是要 `\{` 还是 `\\{`，那就干脆都不用，用 `\lbrace ... \rbrace` 好了。而且还可以手动配置大小：

- `\big \lbrace`: L
- `\Big \lbrace`: XL
- `\bigg \lbrace`: XXL
- `\Bigg \lbrace`: XXXL

顺便说下 `\left (` 和 `left [` 都不需要 escape，暂时可以放心使用。哪天出了问题再统一换掉……

## 6. 请替换 `|` 为 `\vert`、`\lvert` 和 `\rvert`

`|` 会被无脑识别为 table 的 column 的分隔符！所以你在 text 里使用还得用 `\|`。

latex 里有 `\vert` 就用 `\vert` 吧……顺便双竖线是 `\Vert`。

另外，online build 只有 GFM 才支持 table，而 local build 的 markdown 就支持 table……why！
	
## 7. `*` 会被识别为斜体……我也是……没啥好说的

`\ast` is your good friend. 顺便 `\star` 也蛮好看的~

