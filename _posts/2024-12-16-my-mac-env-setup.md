---
title: "My Mac Env Setup"
description: ""
category: 
tags: []
toc: true
toc_sticky: true
---

# 1. Zsh setup: XDG + Prezto

前几年用的 [oh-my-zsh](https://github.com/ohmyzsh/ohmyzsh) 没啥特别的印象，这次直接换成了 [prezto](https://github.com/sorin-ionescu/prezto) 了。配置好之后感觉还行，但在配置过程中有两个问题需要注意。一是 `$ZDOTDIR` 的配置；二是要不要用 XGD 的 practice？这两个问题是有关联的。

## 还是得有一个 `$HOME/.zshenv`

prezto 的 config files 原件在 `${ZDOTDIR:-$HOME}"/.zprezto/runcoms` 下，安装过程中会 `ln -s` 到 `${ZDOTDIR:-$HOME}/zsh`。问题是：它其中有一个 `.zshenv` file，而 zsh 似乎只会去找 `/etc/.zshenv` 和 `$HOME/.zshenv`，并不会去找 `${ZDOTDIR:-$HOME}/zsh/.zshenv`，所以我觉得还是要有一个 `$HOME/.zshenv` 去 source `${ZDOTDIR:-$HOME}/.zshenv`。

## 在 `$HOME/.zshenv` 中设置 `$ZDOTDIR`

zsh 读取配置文件的顺序是：`.zshenv` → `.zprofile` → `.zshrc` → `.zlogin` → .`zlogout`，且如果设置了 `$ZDOTDIR` 的话，它会去 `$ZDOTDIR` 中按这个顺序去找配置文件。这里就有一个鸡生蛋、蛋生鸡的问题：我这个 `$ZDOTDIR` 必须要先设置好，但似乎只能在 `.zshenv` 中设置？所以顺理成章应该是在 `$HOME/.zshenv` 中设置 `$ZDOTDIR`。

## 在 `$HOME/.zshenv` 中设置 XDG，且让 `$ZDOTDIR` 遵循 XDG

[XDG, or Cross-Desktop Group](https://www.freedesktop.org/wiki/)，它们的诉求是 "不要把所有的 config、data、etc files 都直接放到 `$HOME` 下，太混乱"，它们有自己的一套 folder structure 的倡议，目前有些 software 的 installer 会遵循 XDG 的 folder structure，且 XDG 的 folder structure 的确看上去比较 neat，所以我也就顺应了一下潮流。XDG 的配置同样也适合放到 `$HOME/.zshenv` 中。

我们的 `$ZDOTDIR` 按 XDG 的倡议，应该落在 `XDG_CONFIG_HOME` folder 下面。

## 成品

最终得到的 `$HOME/.zshenv` 是：

```bash
#!/bin/zsh
#
# .zshenv : Zsh environment file, loaded always (by all zsh shell instances).
# .zshrc  : Zsh run commands, loaded only by interactive shells

#   Note  : An interactive shell in Linux is a shell that allows you to type 
#           commands and receive output from those commands.
#           When you run a shell script, a non-interactive shell is started 
#           and runs the commands in the script, and then exits when the 
#           script finishes.

# Syntax ${variable:-default} means: if variable is unset, use default
export ZDOTDIR=${ZDOTDIR:-$HOME/.config/zsh}  # actually under XDG_CONFIG_HOME
source "$ZDOTDIR/.zshenv"

# XDG
export XDG_CONFIG_HOME=${XDG_CONFIG_HOME:-$HOME/.config}
export XDG_CACHE_HOME=${XDG_CACHE_HOME:-$HOME/.cache}
export XDG_DATA_HOME=${XDG_DATA_HOME:-$HOME/.local/share}
export XDG_STATE_HOME=${XDG_STATE_HOME:-$HOME/.local/state}
export XDG_RUNTIME_DIR=${XDG_RUNTIME_DIR:-$HOME/.xdg}
export XDG_PROJECTS_DIR=${XDG_PROJECTS_DIR:-$HOME/Projects}
```

然后 prezto 的配置文件都在 `ZDOTDIR` 下：

```bash
❯ ll -a "$ZDOTDIR"

.zlogin    -> $HOME/.config/zsh/.zprezto/runcoms/zlogin
.zlogout   -> $HOME/.config/zsh/.zprezto/runcoms/zlogout
.zprezto
.zpreztorc -> $HOME/.config/zsh/.zprezto/runcoms/zpreztorc
.zprofile  -> $HOME/.config/zsh/.zprezto/runcoms/zprofile
.zsh_history
.zsh_sessions
.zshenv    -> $HOME/.config/zsh/.zprezto/runcoms/zshenv
.zshrc     -> $HOME/.config/zsh/.zprezto/runcoms/zshrc
```

然后如果你要修改 prezto 的配置，就应该去修改 `$ZDOTDIR` 中的那 6 个文件。

我就改了下 prompt theme，然后添加了一个 Git 的 module，改动都在 `$ZDOTDIR/.zpreztorc` 文件中：

```bash
# Set the Prezto modules to load (browse modules).
# The order matters.
zstyle ':prezto:load' pmodule \
  'environment' \
  'terminal' \
  'editor' \
  'history' \
  'directory' \
  'spectrum' \
  'utility' \
  'completion' \
  'history-substring-search' \
  'prompt' \
  'git'  # Show git info in prompt

...

#
# Prompt
#

# Set the prompt theme to load.
# Setting it to 'random' loads a random theme.
# Auto set to 'off' on dumb terminals.
# zstyle ':prezto:module:prompt' theme 'sorin'  # Prezto's default theme
zstyle ':prezto:module:prompt' theme 'peepcode' "❯"  # My prompt theme
```

# 2. Homebrew

需要注意的是：Intel 和 Apple Silicon 架构下的 homebrew 的路径是不一样的，具体可以参考 [mac.install.guide \| Homebrew](https://mac.install.guide/homebrew/3)

另外可以善用 `brew doctor` 命令来 verify installation 是否成功

# 3. SDKMAN! for Java

[SDKMAN!](https://sdkman.io) 就好比是 Java 的 Pyenv，[安装](https://sdkman.io/install/) 也很直接，它会给 `$ZDOTDIR/.zshrc` 加一句：

```bash
#THIS MUST BE AT THE END OF THE FILE FOR SDKMAN TO WORK!!!
export SDKMAN_DIR="$HOME/.sdkman"
[[ -s "$HOME/.sdkman/bin/sdkman-init.sh" ]] && source "$HOME/.sdkman/bin/sdkman-init.sh"
```

鉴于现在有茫茫多的 JDK 版本，现在甚至都有这么个网站 [Which Version of JDK Should I Use?](https://whichjdk.com)，随大流装一个 [Adoptium Eclipse Temurin](https://adoptium.net) 版本的即可

# 4. Pyenv for Python

See [PyEnv \| Installation](https://github.com/pyenv/pyenv?tab=readme-ov-file#installation)

最终会在 `$ZDOTDIR/.zshrc` 加一句：

```bash
# Pyenv setup
export PYENV_ROOT="$HOME/.pyenv"
eval "$(pyenv init -)" # install pyenv into your shell as a shell function, enable shims and autocompletion
```

# 5. NVM for node.js

See [NVM \| Installing and Updating](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)

最终会在 `$ZDOTDIR/.zshrc` 加一句：

```bash
# NVM (Node.js Version Manager) setup
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

# 6. chruby for Ruby

See [Using chruby on Mac](/ruby/2023/12/20/using-chruby-on-mac)

注意 brew 安装的路径发生了变化，应该是 Apple Silicon 的原因，我现在 `$ZDOTDIR/.zshrc` 中的 chruby 配置是：

```bash
# Chruby setup
# enable chruby
source /opt/homebrew/opt/chruby/share/chruby/chruby.sh
# enable chruby auto-switch (i.e. searching for a .ruby-version file when cd to a directory)
source /opt/homebrew/opt/chruby/share/chruby/auto.sh
```

# 7. Jekyll + Bundler

See [Jekyll on macOS](https://jekyllrb.com/docs/installation/macos/) and [Testing your GitHub Pages site locally with Jekyll](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/testing-your-github-pages-site-locally-with-jekyll)

注意：[bundler](https://bundler.io/) 是 gem 的名称，这个 gem 提供的 command 叫 `bundle`