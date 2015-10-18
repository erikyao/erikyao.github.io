---
layout: post
title: "Install Scientific Environment in Ubuntu 14.04 With Python 3.4"
description: ""
category: Python
tags: [Python-101]
---
{% include JB/setup %}

## Basic Installation Flow

Thanks to [Kenarius Octonotes](http://bikulov.org/), I basically followed his article [Install Up-to-date Scientific Environment in Ubuntu 14.04 With Python 3.4](http://bikulov.org/blog/2014/05/14/install-up-to-date-scientific-environment-in-ubuntu-14-dot-04-with-python-3-dot-4/). The installation flow goes like this (with some modification with Kenarius' note):

<pre class="prettyprint linenums">
#!/usr/bin/env bash

# change to root
sudo su

# install python development packages and g++
apt-get install -y python3-dev g++

# install dependencies for scipy
apt-get install -y libblas-dev liblapack-dev gfortran

# install dependencies for matplotlib
apt-get install -y libfreetype6-dev libpng-dev

# install numpy
apt-get install python3-numpy

# exit from `sudo su`
exit

# ipython notebook has bug:
# https://bugs.launchpad.net/ubuntu/+source/python3.4/+bug/1290847

python3 -m venv --clear --without-pip venv/ipython-notebook

# activate virtual env and install pip
source venv/ipython-notebook/bin/activate

# (1) DO NOT switch to `easy_install pip` in the middle of the installation flow
wget https://bootstrap.pypa.io/get-pip.py
python3 get-pip.py
rm get-pip.py

# install scientific packages
sudo -H pip3 install numpy sympy matplotlib scipy pandas

# install ipython notebook and dependencies
sudo -H pip3 install ipython pyzmq jinja2 pygments bokeh

# install latest dev scikit-learn and build it
# sudo -H pip3 install cython https://github.com/scikit-learn/scikit-learn/archive/master.zip

# You don't have to use the latest version of scikit-learn
sudo -H pip3 install cython scikit-learn

# install prettyplotlib by Olga Botvinnik for beauty plots
sudo -H pip3 install brewer2mpl prettyplotlib

# install ipython and notebook, jupyter and patsy
sudo -H pip3 install ipython[notebook]
sudo -H pip3 install jupyter
sudo -H pip3 install patsy

# start notebook. current folder will be your workspace
sudo ipython notebook

# deactivate venv, complementary to `source venv/ipython-notebook/bin/activate`
deactivate
</pre>

However, there might be some problems.

## Problem 1: invalid command 'egg_info'

The solution is provided in [stackoverflow: Can't install via pip because of egg_info error](http://stackoverflow.com/a/17890155):

> Found out what was wrong. I never installed the setuptools for python, so it was missing some vital files, like the egg ones.
> <br/>  
> If you find yourself having my issue above, download [this file](https://bitbucket.org/pypa/setuptools/raw/bootstrap/ez_setup.py) and then in powershell or command prompt, navigate to ez_setup’s directory and execute the command <code>python ez_setup.py</code> and this will run the file for you.

But please don't change to `easy_install pip`, which is suggested in the above post, in the middle way.

If you did got some trouble from `easy_install pip`, you can check [stackoverflow: How do I remove packages installed with Python's easy_install?](http://stackoverflow.com/questions/1231688/how-do-i-remove-packages-installed-with-pythons-easy-install).

## Problem 2: No module named notebook.notebookapp

According to [stackoverflow: ImportError: No module named notebook.notebookapp](http://stackoverflow.com/a/31459216), the solution is:

> For 4.0 and above You need to install the notebook app separately from [https://github.com/jupyter/notebook](https://github.com/jupyter/notebook)
> <br/>  
> <code>pip install jupyter</code>

How to check the versions of your packages?

<pre class="prettyprint linenums">
pip freeze
</pre>

## Problem 3: Unrecognized alias

The profile mechanism changed, so you don't have to create profile under `~/.ipython/`, as [stackoverflow: IPython notebook won't read the configuration file](http://stackoverflow.com/a/31982416) says:

> IPython has now moved to [version 4.0](http://blog.jupyter.org/2015/08/12/first-release-of-jupyter/), which means that if you are using it, it will be reading its configuration from <code>~/.jupyter</code>, not <code>~/.ipython</code>. You have to create a new configuration file with
> <br/>  
> <code>jupyter notebook --generate-config</code>
> <br/>  
> and then edit the resulting <code>~/.jupyter/jupyter_notebook_config.py</code> file according to your needs.
> <br/>  
> More installation instructions [here](https://jupyter.readthedocs.org/en/latest/config.html).
