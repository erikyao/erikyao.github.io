---
layout: post
title: "Scripting Life"
description: ""
category: Linux
tags: [Shell]
---
{% include JB/setup %}

# Backup My Ubuntu

参考：

- [How to mount Mac OS X Lion fileshare?](http://askubuntu.com/questions/63046/how-to-mount-mac-os-x-lion-fileshare)
- [mount.cifs - man](https://www.samba.org/samba/docs/man/manpages-3/mount.cifs.8.html)
- [How to Send Email via SMTP Server from Linux Command Line (with SSMTP)](http://tecadmin.net/send-email-smtp-server-linux-command-line-ssmtp)
- [Configuring send emails using GMail Account in CentOS 6 with SSMTP](https://voidtech.wordpress.com/2014/03/11/configuring-send-emails-using-gmail-account-in-centos-6-with-ssmtp/)
- [Shell script to send email](http://stackoverflow.com/questions/4658283/shell-script-to-send-email)
- [does linux shell support list data structure?](http://stackoverflow.com/questions/12316167/does-linux-shell-support-list-data-structure)
- [How set the From email address for mailx command?](http://stackoverflow.com/questions/1296979/how-set-the-from-email-address-for-mailx-command)
- [How to mount remote Windows shares](https://wiki.centos.org/TipsAndTricks/WindowsShares)
- [weird cron job issue](http://forums.fedoraforum.org/showthread.php?t=198661)
- [How to append a string to each element of a Bash array?](http://stackoverflow.com/a/13216833)
- [Stop cron sending mail for backup script?](http://unix.stackexchange.com/a/84340)

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

### 1.4 mount & /etc/fstab

If you `mount.cifs` without `sudo`, you'll probably get the error log like:

<pre class="prettyprint linenums">
mount.cifs: permission denied: no match for /mnt found in /etc/fstab
</pre>

You need to add an entry in `/etc/fstab` like:

<pre class="prettyprint linenums">
# //2.2.22.223/foo /mnt cifs user,uid=1000,rw,suid,username=xxx,password=xxx,noauto 0 0
</pre>

in which, `uid=1000` is fixed and can be obtained by command `id <usename>`, and `noauto` option means you wish to manually mount it instead of getting mounted by boot automatically. For more details, see [How to mount remote Windows shares](https://wiki.centos.org/TipsAndTricks/WindowsShares).

However, if put the script under `sudo crontab -e`, you don't have to bother with `/etc/fstab`.

### 1.5 mount error(127): Key has expired

If you run `mount.cifs` inside a cron task, you will probably get this weird error. Actually it has nothing to do with the key nor the expiration.

According to [weird cron job issue](http://forums.fedoraforum.org/showthread.php?t=198661), `crontab` could not locate your commands in PATH under some conditions, so a easy solution is to use the full path of the command, like `/sbin/mount.cifs` for `mount.cifs`, in you script.

You can obtain the full paths by `whereis <command>`.

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

-> _~~~~~~~~~~ 2016/01/04 P.S. Start ~~~~~~~~~~_ <-

Today I met a problem when testing `echo "BODY" | mail -s "SUBJECT" toaddr@somewhere.com`:

<pre class="prettyprint linenums">
mail: cannot send message: Process exited with a non-zero status
</pre>

I checked the log, commanding `tail /var/log/mail.err`:

<pre class="prettyprint linenums">
Jan  4 16:38:12 &lt;hostname&gt; sSMTP[23511]: Authorization failed (534 5.7.14  https://support.google.com/mail/answer/78754 blahblahblah - gsmtp)
</pre>

As [how to fix “send-mail: Authorization failed 534 5.7.14”](http://serverfault.com/a/672182) suggested, the solution is:

> Log into your google email account and then go to this link: [https://www.google.com/settings/security/lesssecureapps](https://www.google.com/settings/security/lesssecureapps) and set "Access for less secure apps" to ON.

-> _~~~~~~~~~~ 2016/01/04 P.S. End ~~~~~~~~~~_ <-

## 3. Encrytion

Easy. Use `openssl`.

<pre class="prettyprint linenums">
# encrypt
openssl enc -aes-256-cbc -salt -in file.txt -out file.txt.enc -k PASS

# decrypt
openssl enc -aes-256-cbc -d -in file.txt.enc -out file.txt -k PASS
</pre>

Use `-k` option if you don't want to input password interactively.

For more ciphers, just `openssl --help`.

## 4. Disable cron's email notification

> When executing commands, any output is mailed to the owner of the crontab (or to the user specified in the MAILTO environment variable in the crontab, if such exists).

So, we need to 'silent' our cron task. One way is to use the "quite mode" if there is an option for the command; the second one is to redirect the output, e.g. to a log file.

A typical configuration would look like:

<pre class="prettyprint linenums">
* * * * * myjob.sh >> /var/log/myjob.log 2>&1
</pre>

`2>&1` means to combine `stdout` and `stderr` into the `stdout` stream, so you'll see both `stdout` and `stderr` in your log file.

## 5. Shell Techniques

### 5.1 Exit code of the last command

exit code 我们可以用 `echo $?` 获取，为 0 时表示 last command 执行成功；非 0 表示出了问题。

<pre class="prettyprint linenums">
my_command

if [ $? -eq 0 ]
then
    echo "it worked"
else
    echo "it failed"
fi
</pre>

或者直接一点：

<pre class="prettyprint linenums">
if my_command
then
    echo "it worked"
else
    echo "it failed"
fi
</pre>

### 5.2 A command that always fails

`false` 命令必定会失败，所以可以用来测试命令出错的情况。

### 5.3 For every element in array

<pre class="prettyprint linenums">
mail_to_addr=('johndoe@foo.bar' 'janedoe@baz.qux')

for addr in "${mail_to_addr[@]}"; do
	echo ${addr}
done
</pre>

### 5.4 You can output an array as is

E.g. If you want to make up a command like `tar -cpzf test.tar.gz --one-file-system /foo /bar`, you can write:

<pre class="prettyprint linenums">
tar_targets=('/foo' '/bar')

tar -cpzf test.tar.gz --one-file-system ${tar_targets[@]}
</pre>

### 5.5 Add prefix or suffix to every element of an array

<pre class="prettyprint linenums">
array=( "${array[@]/%/_suffix}" )

array=( "${array[@]/#/prefix_}" )
</pre>

A typical use is to generate multiple `--exclude` parameters for `tar`:

<pre class="prettyprint linenums">
tar_exclude=('/foo' '/bar')
tar_exclude=( "${tar_exclude[@]/#/--exclude=}" )

tar -cpzf test.tar.gz --one-file-system ${tar_targets[@]} ${tar_exclude[@]}
</pre>

The script above would generate `--exclude=/foo --exclude=/bar`.

-----

# MySQL Query

References:

- [How do I parse command line arguments in bash?](http://stackoverflow.com/a/14203146)
- [in bash, how do you break an array in groups of n](http://stackoverflow.com/a/23747768)
- [Calling functions with xargs within a bash script](http://stackoverflow.com/a/11003457)
- [what is diff bentween xargs with braces and without in linux](http://superuser.com/a/526354)
- [Defining a variable with or without export](http://stackoverflow.com/a/1158231)
- [What does “export” do in shell programming?](http://stackoverflow.com/questions/7411455/what-does-export-do-in-shell-programming)
- [Replace a Space with a Period in Bash](http://stackoverflow.com/a/5928254)
- [How can I suppress column header output for a single SQL statement?](http://stackoverflow.com/a/20887040)

## 1. `mysql -A`

From "The MySQL Bible" by Steve Suehring:

> **Speeding startup of the CLI**  
> <!-- -->  
> When the CLI starts, it reads in table information to allow for completion, which can sometimes slow the startup. To turn off this default and get a quicker CLI startup, use the `-A` or `--no-auto-rehash` switch. `Adding --no-auto-rehash` to the MySQL configuration file under the [mysql] section makes this quicker startup permanent.
