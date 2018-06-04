---
layout: post
title: "DSA setting at SSH client end"
description: ""
category: SSH
tags: []
---
{% include JB/setup %}

I met a problem setting up SSH and git today, and I am happy to share my workaround just in case you met the same problem. 

- Background:
	- Windows 7 Enterprise, 64-bit
	- git version 2.5.1.windows.1 (type `git --version` to see your version)
	- OpenSSH_7.1p1 (type `ssh -v localhost` to see your version)
	- I have another RSA key for my github
- Symptom:
	- After my DSA public key was added to server end, ssh console failed my password.

First, you have to tell SSH to use your DSA key instead of your RSA key. Following the posts [How to tell git which private key to use?](http://superuser.com/questions/232373/how-to-tell-git-which-private-key-to-use/232406#232406) and [Creating remote server nicknames with .ssh/config](http://www.saltycrane.com/blog/2008/11/creating-remote-server-nicknames-sshconfig/), you can create a config file, `C:\Users\xxx\.ssh\config`, like

```conf
Host myhost
  User johndoe
  HostName foo.bar.baz
  IdentityFile ~/.ssh/id_dsa_johndoe
```

N.B. The "Host" property can be anything you like. Now you can replace "johndoe@foo.bar.baz" with your "Host" property, "myhost" in this case, in your commands.

Second, you must enable DSA in SSH. If not, `ssh -v -l johndoe foo.bar.baz` or just `ssh -v myhost` will show you a message:

	debug1: Skipping ssh-dss key C:/Users/xxx/.ssh/id_dsa for not in PubkeyAcceptedKeyTypes

According to [when openssh 7 blocks your public-key](https://coderwall.com/p/ykgawg/when-openssh-7-blocks-your-public-key), just adding another line, `PubkeyAcceptedKeyTypes ssh-dss`, to the config file would do:

```conf
Host myhost
  User johndoe
  HostName foo.bar.baz
  IdentityFile ~/.ssh/id_dsa_johndoe
  PubkeyAcceptedKeyTypes ssh-dss
```

Now `ssh myhost` should be working. 

When setting up git, you no longer need to type `git remote add origin johndoe@foo.bar.baz:xxx.git`. Use `git remote add origin myhost:xxx.git` instead. 

Now everything is OK. Enjoy.