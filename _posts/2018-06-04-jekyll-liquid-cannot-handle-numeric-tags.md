---
layout: post
title: "Jekyll: Liquid cannot handle numeric tags"
description: ""
category: Jekyll
tags: []
---
{% include JB/setup %}

This is funny. 

I was deleting some of my meaningless tags in my posts and somehow I encountered `Liquid Exception: Liquid error (line 3): comparison of Array with Array failed`. 

The full trace of jekyll was:

```txt
~:xxx.github.io$ jekyll serve --trace
Configuration file: ~/Git-repo/xxx.github.io/_config.yml
            Source: ~/Git-repo/xxx.github.io
       Destination: ~/Git-repo/xxx.github.io/_site
 Incremental build: disabled. Enable with --incremental
      Generating... 
  Liquid Exception: Liquid error (line 3): comparison of Array with Array failed in 04-tags.html
~/.gem/ruby/2.3.0/gems/jekyll-3.7.3/lib/jekyll/filters.rb:273:in `sort': Liquid error (line 3): comparison of Array with Array failed (Liquid::ArgumentError)
	from ~/.gem/ruby/2.3.0/gems/jekyll-3.7.3/lib/jekyll/filters.rb:273:in `sort'
	from ~/.gem/ruby/2.3.0/gems/liquid-4.0.0/lib/liquid/strainer.rb:56:in `invoke'
	from ~/.gem/ruby/2.3.0/gems/liquid-4.0.0/lib/liquid/context.rb:86:in `invoke'
	from ~/.gem/ruby/2.3.0/gems/liquid-4.0.0/lib/liquid/variable.rb:78:in `block in render'
	from ~/.gem/ruby/2.3.0/gems/liquid-4.0.0/lib/liquid/variable.rb:76:in `each'
	from ~/.gem/ruby/2.3.0/gems/liquid-4.0.0/lib/liquid/variable.rb:76:in `inject'
	from ~/.gem/ruby/2.3.0/gems/liquid-4.0.0/lib/liquid/variable.rb:76:in `render'
	from ~/.gem/ruby/2.3.0/gems/liquid-4.0.0/lib/liquid/tags/assign.rb:24:in `render'
	from ~/.gem/ruby/2.3.0/gems/liquid-4.0.0/lib/liquid/block_body.rb:109:in `render_node'
	from ~/.gem/ruby/2.3.0/gems/liquid-4.0.0/lib/liquid/block_body.rb:88:in `block in render'
	from ~/.gem/ruby/2.3.0/gems/liquid-4.0.0/lib/liquid/block_body.rb:75:in `each'
	from ~/.gem/ruby/2.3.0/gems/liquid-4.0.0/lib/liquid/block_body.rb:75:in `render'
	from ~/.gem/ruby/2.3.0/gems/liquid-4.0.0/lib/liquid/template.rb:208:in `block in render'
	from ~/.gem/ruby/2.3.0/gems/liquid-4.0.0/lib/liquid/template.rb:242:in `with_profiling'
	from ~/.gem/ruby/2.3.0/gems/liquid-4.0.0/lib/liquid/template.rb:207:in `render'
	from ~/.gem/ruby/2.3.0/gems/liquid-4.0.0/lib/liquid/template.rb:220:in `render!'
	from ~/.gem/ruby/2.3.0/gems/jekyll-3.7.3/lib/jekyll/liquid_renderer/file.rb:30:in `block (2 levels) in render!'
	from ~/.gem/ruby/2.3.0/gems/jekyll-3.7.3/lib/jekyll/liquid_renderer/file.rb:42:in `measure_bytes'
	from ~/.gem/ruby/2.3.0/gems/jekyll-3.7.3/lib/jekyll/liquid_renderer/file.rb:29:in `block in render!'
	from ~/.gem/ruby/2.3.0/gems/jekyll-3.7.3/lib/jekyll/liquid_renderer/file.rb:49:in `measure_time'
	from ~/.gem/ruby/2.3.0/gems/jekyll-3.7.3/lib/jekyll/liquid_renderer/file.rb:28:in `render!'
	from ~/.gem/ruby/2.3.0/gems/jekyll-3.7.3/lib/jekyll/renderer.rb:123:in `render_liquid'
	from ~/.gem/ruby/2.3.0/gems/jekyll-3.7.3/lib/jekyll/renderer.rb:76:in `render_document'
	from ~/.gem/ruby/2.3.0/gems/jekyll-3.7.3/lib/jekyll/renderer.rb:62:in `run'
	from ~/.gem/ruby/2.3.0/gems/jekyll-3.7.3/lib/jekyll/site.rb:473:in `block in render_pages'
	from ~/.gem/ruby/2.3.0/gems/jekyll-3.7.3/lib/jekyll/site.rb:471:in `each'
	from ~/.gem/ruby/2.3.0/gems/jekyll-3.7.3/lib/jekyll/site.rb:471:in `render_pages'
	from ~/.gem/ruby/2.3.0/gems/jekyll-3.7.3/lib/jekyll/site.rb:191:in `render'
	from ~/.gem/ruby/2.3.0/gems/jekyll-3.7.3/lib/jekyll/site.rb:73:in `process'
	from ~/.gem/ruby/2.3.0/gems/jekyll-3.7.3/lib/jekyll/command.rb:28:in `process_site'
	from ~/.gem/ruby/2.3.0/gems/jekyll-3.7.3/lib/jekyll/commands/build.rb:65:in `build'
	from ~/.gem/ruby/2.3.0/gems/jekyll-3.7.3/lib/jekyll/commands/build.rb:36:in `process'
	from ~/.gem/ruby/2.3.0/gems/jekyll-3.7.3/lib/jekyll/commands/serve.rb:93:in `block in start'
	from ~/.gem/ruby/2.3.0/gems/jekyll-3.7.3/lib/jekyll/commands/serve.rb:93:in `each'
	from ~/.gem/ruby/2.3.0/gems/jekyll-3.7.3/lib/jekyll/commands/serve.rb:93:in `start'
	from ~/.gem/ruby/2.3.0/gems/jekyll-3.7.3/lib/jekyll/commands/serve.rb:75:in `block (2 levels) in init_with_program'
	from ~/.gem/ruby/2.3.0/gems/mercenary-0.3.6/lib/mercenary/command.rb:220:in `block in execute'
	from ~/.gem/ruby/2.3.0/gems/mercenary-0.3.6/lib/mercenary/command.rb:220:in `each'
	from ~/.gem/ruby/2.3.0/gems/mercenary-0.3.6/lib/mercenary/command.rb:220:in `execute'
	from ~/.gem/ruby/2.3.0/gems/mercenary-0.3.6/lib/mercenary/program.rb:42:in `go'
	from ~/.gem/ruby/2.3.0/gems/mercenary-0.3.6/lib/mercenary.rb:19:in `program'
	from ~/.gem/ruby/2.3.0/gems/jekyll-3.7.3/exe/jekyll:15:in `<top (required)>'
	from ~/.gem/ruby/2.3.0/bin/jekyll:23:in `load'
	from ~/.gem/ruby/2.3.0/bin/jekyll:23:in `<main>'
```

After nearly 2 hours I found it was caused by a typo of mine in a tag field, where I typed `1`.

![](https://farm2.staticflickr.com/1729/41668684795_b600384a12_o_d.png)

Liquid CANNOT handle such numeric tags! SMH.