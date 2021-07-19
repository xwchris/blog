---
title: "Linux常用命令记录"
date: "2020-11-12"
tags: linux
author: xwchris
desc: "记录平时常用到的命令，方式使用的时候可以更快查询"
---

命令查询 http://linux.51yip.com/

### 查看指定端口程序
```bash
lsof -i:端口号
netstat -tunlp | grep 端口号
```

### 文件传输
```bash
// 本地复制到远程
scp -r ./files root@xxxxx:~/data
```