---
category: Shell
description: ''
tags: []
title: Syntax Highlighting <i>less</i>
---

[Stéphane Chazelas on Syntax highlighting in the terminal](https://unix.stackexchange.com/a/267362) 总结得挺好，以下方法都可以 highlight `less` 命令的 output：

```bash
# Need to install Highlight from http://www.andre-simon.de/
# and terimal must support the same colour escape sequences as xterm
highlight -O xterm256 <your-file> | less -R

# Need ruby and rougify
rougify <your-file> | less -R

# Need `pip install Pygments`
pygmentize <your-file> | less -R

# Need GUN source-highlight from http://www.gnu.org/software/src-highlite/
source-highlight -f esc256 -i <your-file> | less -R

# Need vim, usually pre-installed
# Need to specify the version (e.g. `vim74`) in the path
/usr/share/vim/vim74/macros/less.sh <your-file>
```

如果想要给 linux-based docker image 配一个 highlighted `less` command，用 vim 那个方法是最简单的，因为 vim 一般都是 pre-installed，唯一麻烦的地方在于获取 `/usr/share/vim/vim74/` 这个 path。如果不想写死的话，有个稍微 overkill 的方法来自 [yolenoyer on Creating an alias in bash to less.sh (less.vim)](https://stackoverflow.com/a/43704557) 可以动态获取这个 path:

```bash
#!/bin/bash

vimruntime=`vim -e -T dumb --cmd 'exe "set t_cm=\<C-M>"|echo $VIMRUNTIME|quit' | tr -d '\015' `
[[ -z $vimruntime ]] && { echo 'Sorry, $VIMRUNTIME was not found' >&2; exit 1; }

vless=$vimruntime/macros/less.sh
[[ -x $vless ]] || { echo "Sorry, '$vless' is not accessible/executable" >&2; exit 1; }
```

然后再加个 `vless` 的 alias 就可以了。

注意上面的 `[[ ... ]]` 的用法，参 [What is the difference between `test`, `[` and `[[`?](http://mywiki.wooledge.org/BashFAQ/031)，其中：

- `test -z STRING`: True if string is empty
- `test -x FILE`: True if the file is executable by you

更多 `test` 的参数可参考 [test man page](https://linuxcommand.org/lc3_man_pages/testh.html)