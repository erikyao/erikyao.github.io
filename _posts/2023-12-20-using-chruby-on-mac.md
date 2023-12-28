---
category: Ruby
description: ''
tags: []
title: Using chruby on Mac
---

# 1. macOS 自带的 Ruby

目前我的 `macOS Ventura 13.6.3` 自带的还是 `ruby 2.6`。同时也要注意 `gem` 也是自带的，都位于 `/usr/bin/`.

```bash
~ ᐅ where ruby
/usr/bin/ruby
~ ᐅ ruby -v
ruby 2.6.10p210 (2022-04-12 revision 67958) [universal.x86_64-darwin22]

~ ᐅ where gem
/usr/bin/gem
~ ᐅ gem -v
3.0.3.1
```

# 2. Don't Use System Ruby

尽量不去碰 macOS 自带的 `ruby 2.6`，这一点很好理解。

但根据 [Don't Use System Ruby](https://dontusesystemruby.com/#/?id=what-is-system-ruby) 的说法，`homebrew install ruby` 也算是 system ruby。我个人觉得理由有：

1. `homebrew` 自身需要 macOS 自带的 `ruby 2.6`，安装新的 ruby 会产生各种 symlink，再加上 `gem` 的 symlink，很容 messy
2. `homebrew` 安装的 ruby 缺乏一个 explicit 的 environment switching 的动作，以至于有时候你不知道你会使用哪个 ruby

所以我们的 alternative 是 [ruby-install](https://github.com/postmodern/ruby-install):

```bash
homebrew install ruby-install
```

# 3. Ruby Env Management with `chruby`

Ruby 的 environment management 工具其实还有 [RVM](https://rvm.io/), [rbenv](https://github.com/rbenv/rbenv), [frum](https://github.com/TaKO8Ki/frum), [asdf](https://github.com/asdf-vm/asdf) (这个名字也太随便了 www 另外它其实可以管理多种语言的 env，比如 Node, Erlang, Elixir, Haskel, Ocaml, PHP, Python, Rust, etc.)

`chruby` 是非常轻量级的，用法和 `pyenv` 其实有点像。

## 3.1 Installation：

```bash
homebrew install chruby
```

然后需要配置 `.zshrc`，酌情添加下面两行：

```bash
# enable chruby
source /usr/local/share/chruby/chruby.sh

# enable chruby auto-switch (i.e. searching for a .ruby-version file when cd to a directory)
source /usr/local/share/chruby/auto.sh
```

- 第一句是 enable `chruby` in terminal
- 第二句是 enable auto-switch，下面详述

## 3.2 Manual Switch

假定我们已经通过 `ruby-install` 安装了 `ruby-3.2.2`，`chruby` 就能 list 出这个版本： 

```bash
~ ᐅ chruby
   ruby-3.2.2
```

我们可以 `chruby ruby-3.2.2` 切换过去，甚至可以用简写 `chruby ruby` 或者 `chruby 3.2.2`，前提是这里 interpreter name `ruby` 或者 version `3.2.2` 能唯一 match 到你现有的某个 env 上。

存在其他的 interpreter 比如 [JRuby](http://jruby.org/) (类似 CPython?)，可以通过 `ruby-install` 查看：

```bash
~ ᐅ ruby-install
Stable ruby versions:
  ruby:
    3.0.6
    3.1.4
    3.2.2
  jruby:
    9.4.5.0
  truffleruby:
    23.1.1
  truffleruby-graalvm:
    23.1.1
  mruby:
    3.0.0
```

切换之后，我们可以看到新的 path 和 version：

```bash
~ ᐅ where ruby
/Users/<username>/.rubies/ruby-3.2.2/bin/ruby
/usr/bin/ruby
~ ᐅ ruby -v
ruby 3.2.2 (2023-03-30 revision e51014f9c0) [x86_64-darwin22]

~ ᐅ where gem
/Users/<username>/.rubies/ruby-3.2.2/bin/gem
/usr/bin/gem
~ ᐅ gem -v
3.4.10
```

macOS 自带的 ruby 有个固定名字 `system`，所以可以再度切换回去：

```bash
~ ᐅ chruby system
~ ᐅ ruby -v
ruby 2.6.10p210 (2022-04-12 revision 67958) [universal.x86_64-darwin22]
```

## 3.3 Auto Switch

类似于 `pyenv` 能识别 `.python-version` 文件，`chruby` 也能识别 `.ruby-version` 文件。假如对某个 directory，你想固定使用 `ruby-3.2.2`，你可以在这个 directory 下添加一个 `.ruby-version` 文件并写上 `ruby-3.2.2`：

```bash
echo 'ruby-3.2.2' >> .ruby-version
```

简写形式应该也是可以的。当你 `cd` 到这个 directory，`chruby` 的 auto-switch 功能 detect 到这么一个 `.ruby-version` 文件后，它就能自动给你 switch 到这个版本。

如果你想每次启动 terminal 都固定 switch 到 `ruby-3.2.2`，你也可以把 `chruby ruby-3.2.2` 写到 `.zshrc`。