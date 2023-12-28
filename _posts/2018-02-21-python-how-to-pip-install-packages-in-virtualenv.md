---
category: Python
description: ''
tags:
- pip
- sudo
- virtualenv
title: 'Python: How to pip-install packages in virtualenv'
---

My aim is to install ALL packages I need for a project to a non-default location.

First install `pip3` then `virtualenv` (I am OK with `virtualenv` being installed in the default location like `/usr/lib/python3.5/site-packages`):

```bash
sudo apt install python3-pip

# sudo if necessary
pip3 install virtualenv
```

Then create a root folder for all the virtual environments (this is optional):

```bash
# cd to somewhere
mkdir myvirtualenvs
```

Next a specific virtual environment can be created:

```bash
cd myvirtualenvs

sudo virtualenv --no-site-packages my-project-virtualenv
```

Note that `--no-site-packages` is now the default behavior, meaning `my-project-virtualenv` is not going to use the global python packages (i.e. packages in `/usr/lib/python3.5/site-packages`). It's OK to remove this option in my case. Double check by `virtualenv --help`.

Activiate this virtual environment:

```bash
. my-project-virtualenv/bin/activate
```

Install packages by `pip3`. E.g.:

```bash
pip3 install scikit-learn==0.19.1
```

**Caution:** if you are not going to use `sudo`, the above command works well. `skleran` package will be directly installed to `myvirtualenvs/my-project-virtualenv/lib/python3.5/site-packages`. HOWEVER, if you need `sudo`, even when your are in the activated environment, it will be installed to the global destination (i.e. `/usr/lib/python3.5/site-packages`). 

An explanation I found is from [stackoverflow: How to install a package inside virtualenv?](https://stackoverflow.com/a/44075783):

> When you use sudo pip install package, you are running Virtualenv as root, escaping the whole environment which was created, and then, installing the package on global site-packages, and not inside the project folder where you have a Virtual Environment, although you have activated the environment.

In this case, you need to specify the destination:

```bash
sudo pip3 install scikit-learn==0.19.1 -t myvirtualenvs/my-project-virtualenv/lib/python3.5/site-packages
```

Check if it's installed inside the activated environment by `python3 -c "import sklearn"`.