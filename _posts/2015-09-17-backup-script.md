---
layout: post
title: "Backup Script"
description: ""
category: Linux
tags: [Shell]
---
{% include JB/setup %}

参考：

- [How to mount Mac OS X Lion fileshare?](http://askubuntu.com/questions/63046/how-to-mount-mac-os-x-lion-fileshare)
- [mount.cifs - man](https://www.samba.org/samba/docs/man/manpages-3/mount.cifs.8.html)
- [How to Send Email via SMTP Server from Linux Command Line (with SSMTP)](http://tecadmin.net/send-email-smtp-server-linux-command-line-ssmtp)
- [Configuring send emails using GMail Account in CentOS 6 with SSMTP](https://voidtech.wordpress.com/2014/03/11/configuring-send-emails-using-gmail-account-in-centos-6-with-ssmtp/)
- [Shell script to send email](http://stackoverflow.com/questions/4658283/shell-script-to-send-email)
- [does linux shell support list data structure?](http://stackoverflow.com/questions/12316167/does-linux-shell-support-list-data-structure)
- [How set the From email address for mailx command?](http://stackoverflow.com/questions/1296979/how-set-the-from-email-address-for-mailx-command)

-----

最近在写一个脚本，在 VirtualBox 5.0.4 + Ubuntu 14.04 上通过 samba mount 到 MacMini 上做备份，然后通过 gmail 发邮件通知。

## 1. Mounting

### 1.1 VM Config and Network Accessibility

Make sure that VM network is configured to use NAT (on eth0).

假设目标 ip 是 2.2.22.223. 我们可以做一下连接检测：

<pre class="prettyprint linenums">
ping 2.2.22.223
</pre>

<pre class="prettyprint linenums">
telnet 2.2.22.223 445 # 445 is the port number. 23 by default
</pre>

### 1.2 Mounting to MacMini

目前 `mount -t smbfs` 是 deprecated，需要使用 `mount -t cifs` 或者直接使用 `mount.cifs`。前提是你需要安装 `cifs.utils`:

<pre class="prettyprint linenums">
sudo apt-get install cifs.utils
</pre>

samba 和 cifs 的关系是：cifs 是协议，samba 是 cifs 的一个实现。

然后其他的参数，因为是 Mac，所以要指定为 `nounix,sec=ntlmssp`，具体可以 google "ubuntu samba mount mac" 查询。我最终的命令是：

<pre class="prettyprint linenums">
sudo mount.cifs //2.2.22.223/foo /mnt -o username=bar,password='baz',nounix,sec=ntlmssp,noperm,rw
</pre>

一般 password 是不用加引号的，只有在有特殊字符需要转义的情况下才需要加上引号。

也可以把 username 和 password 写到一个配置文件里（配置文件的密码里即使有特殊字符也可以不用加引号）：

<pre class="prettyprint linenums">
## ~/Documents/cifs_credentials
username=bar
password=baz
</pre>

<pre class="prettyprint linenums">
sudo mount.cifs //2.2.22.223/foo /mnt -o credentials=~/Documents/cifs_credentials,nounix,sec=ntlmssp,noperm,rw
</pre>

### 1.3 Error Log 

<pre class="prettyprint linenums">
tail -100 /var/log/syslog
</pre>

<pre class="prettyprint linenums">
dmesg
</pre>

## 2. Sending Emails

### 2.1 Basis

首先装一个 SSMTP，参照 [How to Send Email via SMTP Server from Linux Command Line (with SSMTP)](http://tecadmin.net/send-email-smtp-server-linux-command-line-ssmtp) 和 [Configuring send emails using GMail Account in CentOS 6 with SSMTP](https://voidtech.wordpress.com/2014/03/11/configuring-send-emails-using-gmail-account-in-centos-6-with-ssmtp/)。需要注意的是，Ubuntu 的 `TLS_CA_File` 不是 `/etc/pki/tls/certs/ca-bundle.crt` 而是 `/etc/ssl/certs/ca-certificates.crt`：

<pre class="prettyprint linenums">
sudo apt-get install ssmtp
</pre>

<pre class="prettyprint linenums">
## /etc/ssmtp/ssmtp.conf

# The person who gets all mail for userids < 1000
# Make this empty to disable rewriting.
root=bot@gmail.com

# The place where the mail goes. The actual machine name is required no 
# MX records are consulted. Commonly mailhosts are named mail.domain.com
mailhub=smtp.gmail.com:587

rewriteDomain=gmail.com
UseTLS=Yes
UseSTARTTLS=YES
AuthUser=bot@gmail.com
AuthPass=bar
TLS_CA_File=/etc/ssl/certs/ca-certificates.crt

# Where will the mail seem to come from?
#rewriteDomain=

# The full hostname
hostname=YourHostName

# Are users allowed to set their own From: address?
# YES - Allow the user to specify their own From: address
# NO - Use the system generated From: address
FromLineOverride=YES
</pre>

安装完 `mailutils` 我们就可以发信啦:

<pre class="prettyprint linenums">
sudo apt-get install mailutils

echo "BODY" | mail -s "SUBJECT" toaddr@somewhere.com
</pre>

### 2.2 Sending to multiple address

用 shell 的 array 就好了：

<pre class="prettyprint linenums">
mailtoaddr=("foo@gmail.com" "bar@gmail.com")

for addr in "${mailtoaddr[@]}"; do
	echo "System ${myhostname} backup done on $(date +'%r, %m/%d/%Y')" | mail -s "Backup Done!" ${addr}
done
</pre>

### 2.3 Changing the From address

因为 bot@gmail 是用我的 first name 和 last name 注册的，所以收信方看到的都是我的 first name。想让收信方看到不同的名字（比如 "bot"），在 Gmail 里设置是不起作用的（Settings -> Accounts and Import -> Send mail as），需要在命令行里指定一个新的 Header：

<pre class="prettyprint linenums">
sudo apt-get install mailutils

echo "BODY" | mail -s "SUBJECT" a "From: bot &lt;bot@gmail.com&gt;" toaddr@somewhere.com
</pre>
