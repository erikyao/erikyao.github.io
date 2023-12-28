---
category: MySQL
description: ''
tags: []
title: How to import data to MySQL? / How to change MySQL data directory?
---

## Commands

```shell
# create database
mysqladmin -u root -p create hg19

# create table
mysql -u root -p hg19 < snp142.sql

# import table entries
mysqlimport -u root -p --local hg19 snp142.txt
```

If you have multiple tables to download and import, use:

```shell
DBNAMES="wgEncodeAwgSegmentationSegwayGm12878 wgEncodeAwgSegmentationSegwayH1hesc wgEncodeAwgSegmentationChromhmmK562"

for DBNAME in $DBNAMES ; do
	wget http://hgdownload.cse.ucsc.edu/goldenPath/hg19/database/${DBNAME}.sql
	wget http://hgdownload.cse.ucsc.edu/goldenPath/hg19/database/${DBNAME}.txt.gz
	gzip -d ${DBNAME}.txt.gz
	mysql -u root hg19 < ${DBNAME}.sql
	mysqlimport -u root --local hg19 ${DBNAME}.txt
done
```

## [Windows: How to handle "Error 1290"](http://stackoverflow.com/a/32737616)

Without `--local` option, you may encounter the following error:

> mysqlimport: Error: 1290, The MySQL server is running with the --secure-file-pri
v option so it cannot execute this statement, when using table: snp142

Your MySQL server has been started with `--secure-file-priv` option which basically limits from which directories you can load files.

You may use the following commands to see the directory that has been configured.

```
mysql -u root -p
SHOW VARIABLES LIKE "secure_file_priv";
```

You have two options:

- Move your file to the directory specified by `secure-file-priv`.
	- Then indicate the full paths of the txt files in the commands above.
- Disable `secure-file-priv`. This must be removed from startup and cannot be modified dynamically. To do this check your MySQL start up parameters (depending on platform) and `my.ini`.

## [Ubuntu: How to change MySQL data directory](http://stackoverflow.com/a/10209282)

My Ubuntu disk is partitioned as below:

- `/`: 32G
- `/home`: 112G

By default, MySQL use `/var/lib/mysql` as the data directory. However, table `snp142` would take about 15G and overburden `/`.

To solve this problem, you can change MySQL data directory. The following instructions are copied from the link in the header. Note that `sudo /etc/init.d/mysql stop` cannot stop `mysqld`; [use `sudo service mysql stop` instead](http://askubuntu.com/a/529307).

1. Stop MySQL using the following command:
	- `sudo service mysql stop`
1. Copy the existing data directory (default located in `/var/lib/mysql`) using the following command:
	- `sudo cp -R -p /var/lib/mysql /[New-Path]`
	- Note that the whole `mysql` folder would be copied to `/[New-Path]`, making it `/[New-Path]/mysql`
1. Edit the MySQL configuration file with the following command:
	- `sudo gedit /etc/mysql/my.cnf`
1. Look for the entry for `datadir`, and change the path (which should be `/var/lib/mysql`) to `/[New-Path]/mysql`.
1. In the terminal, enter the command:
	- `sudo gedit /etc/apparmor.d/usr.sbin.mysqld`
1. Look for lines beginning with `/var/lib/mysql`. Change `/var/lib/mysql` in the lines with `/[New-Path]/mysql`. Save and close the file.
1. Restart the AppArmor profiles with the command:
	- `sudo /etc/init.d/apparmor reload`
1. Restart MySQL with the command:
	- `sudo service mysql start`