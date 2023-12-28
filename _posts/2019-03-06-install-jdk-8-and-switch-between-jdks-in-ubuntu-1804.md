---
category: Java
description: ''
tags: []
title: Install Oracle JDK 8 and switch between JDKs in Ubuntu 18.04
---

## 1. Check installed Open JDK

Note that by default Ubuntu 18.04 includes Open JDK 10 or 11. Check your current Java version first, or list the JDK package installed.

```bash
yao@DESKTOP:~$ sudo apt list --installed | grep jdk

WARNING: apt does not have a stable CLI interface. Use with caution in scripts.

openjdk-11-jdk/bionic-updates,bionic-security,now 10.0.2+13-1ubuntu0.18.04.4 amd64 [installed]
openjdk-11-jdk-headless/bionic-updates,bionic-security,now 10.0.2+13-1ubuntu0.18.04.4 amd64 [installed,automatic]
openjdk-11-jre/bionic-updates,bionic-security,now 10.0.2+13-1ubuntu0.18.04.4 amd64 [installed,automatic]
openjdk-11-jre-headless/bionic-updates,bionic-security,now 10.0.2+13-1ubuntu0.18.04.4 amd64 [installed,automatic]
```

## 2. Install Oracle JDK 8 (or 9)

Follow [Install Oracle Java 8 / 9 in Ubuntu 16.04, Linux Mint 18](http://tipsonubuntu.com/2016/07/31/install-oracle-java-8-9-ubuntu-16-04-linux-mint-18/). It also works in Ubuntu 18.04.

- Add PPA

```bash
sudo add-apt-repository ppa:webupd8team/java
```

- Install Oracle JDK 8 (or 9)

```bash
sudo apt update

sudo apt install oracle-java8-installer

sudo apt install oracle-java9-installer
```

- Now the `javac -verison` should be switched to the new Oracle JDK 8 (or 9), but better check before we go on.

```bash
yao@DESKTOP:~$ javac -version
javac 1.8.0_201
```

- Set Java environment variables

```bash
yao@DESKTOP:~$ sudo apt install oracle-java8-set-default
Reading package lists... Done
Building dependency tree
Reading state information... Done
oracle-java8-set-default is already the newest version (8u201-1~webupd8~1).
oracle-java8-set-default set to manually installed.
0 upgraded, 0 newly installed, 0 to remove and 182 not upgraded.
```

## 3. Switch between JDKs

```bash
yao@DESKTOP:~$ sudo update-alternatives --config java
There are 2 choices for the alternative java (providing /usr/bin/java).

  Selection    Path                                         Priority   Status
------------------------------------------------------------
  0            /usr/lib/jvm/java-11-openjdk-amd64/bin/java   1101      auto mode
  1            /usr/lib/jvm/java-11-openjdk-amd64/bin/java   1101      manual mode
* 2            /usr/lib/jvm/java-8-oracle/jre/bin/java       1081      manual mode

Press <enter> to keep the current choice[*], or type selection number:2
```