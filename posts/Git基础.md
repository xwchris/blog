---
title: "Git基础"
date: "2019-08-04"
tags: git
author: xwchris
desc: "GIT本质上是一个内容寻址文件系统。从核心来看就是简单的存储键值对"
---

## GIT基本原理
在GIT中有`远程仓库`、`本地仓库`、`暂存区`和`工作区`的概念。我们平时修改文件的地方就属于`工作区`，在文件修改完成后，我们使用`git add .`的命令将工作区内容放入缓存区。

在缓存区中，GIT会根据文件内容生成SHA-1值（校验和），作为文件的唯一ID，我们可以使用

```bash
git hash-object [filename]
```

来查看指定文件计算后的SHA-1值。GIT会使用校验和的前两个字符作为目录名称，用剩下的字符作为文件名，将文件以二进制的形式存储进当前GIT根目录的`.git/objects`文件夹，这里我们可以使用以下命令来查看所有保存的文件列表

```bash
find .git/objects -type f
```

注意这些文件里存储的只是文件内容，不包括文件的信息。查看二进制文件的内容可以使用

```bash
// 查看内容
git cat-file -p [sha-1]

// 查看类型
git cat-file -t [sha-1]
```

在使用`git commit`命令后，GIT会生成本次提交的快照，将其永久保存到本地仓库。那么GIT是如何表示快照和生成快照的？我们可以在提交后再次使用

```bash
find .git/objects -type f
```

来查看目录，会发现多了一些文件，其实除去我们的文件，剩下的都记录了我们的目录信息和提交信息。总的来说`.git/objects`里的文件分为三类

1. blob：这就是我们的文件类型
2. tree：tree有多条记录，每一条记录含有一个指向 blob 或子 tree 对象的 SHA-1 指针，并附有该对象的权限模式 (mode)、类型和文件名信息
3. commit: 用来记录我们的提交信息，包含了根目录SHA-1值，以及提交者信息和提交信息

通过上面的解释我们会发现一个commit指向根目录，根目录指向各个子目录和文件。因此我们完全可以用commit来表示本次提交，保存提交的快照。当然GIT就是这么做的。

分支就是执行某次提交的一个指针，所以我们创建分支，就只是创建了一个指针，所以GIT进行分支创建非常迅速。

## 分支合并
在GIT中，分支的合并有两种方式，分别是`git merge`和`git rebase`。无论哪种都可能产生冲突，有冲突就需要先解决冲突才能完成合并。

![分支合并](https://dn-coding-net-production-pp.qbox.me/b39e3a39-0091-4265-ba6d-73ef0fd457b2.png)


冲突是以两个分支的分歧点（merge base）进行定义的，如上图所示两个分支的分歧点为1。如果对比1来说两个分支相同的文件都与1不同，这时候就产生了冲突，其他情况有一个相同或者都相同，可以自动进行合并。

使用`git merge`的方式进行分支合并，在解决冲突后，会形成一次新的提交到目标分支上。这种方式不会修改历史提交记录。

还可以使用`git rebase`进行分支合并，与`git merge`方式不同，该方式会改变提交历史。该方式合并时GIT会把merge base以来的所有提交，一个个以补丁的形式打到目标分支上，在这里有冲突需要解决冲突。最终所有的提交会形成一条线。这种方式可以让分支更加干净整洁。

## 版本回退
如果我们某次提交完后，发现这次提交有问题，想要回到某次提交，有这么几种方式

可以使用

```bash
git revert [sha-1]
```

命令来反转某次提交，相当于取消这一次提交所提交的代码。这种方式是用一个新的提交来进行代码还原的，并不会改变分支提交的历史。

除了`git revert`，还可以使用`git reset`配合`--soft`，`--mixed`和`--hard`参数来进行回退，这三个参数的作用域依次增大，`--soft`会将HEAD指针指向某次提交，`--mixed`与`--soft`相比就是多了个缓存区，`--hard`会完全将代码还原到当次提交，慎重使用。不过真的不小心用错了，可以使用

```bash
git reset --hard ORIG_HEAD
```

进行还原，或者使用

```bash
git reflog
```

命令找到当时HEAD的SHA-1值，将HEAD重置到该节点就可以了

## BUG查找
如果某次我们发现有问题，又找不到bug在那次引入的，这时就可以使用`git bisect`命令帮助我们进行查找。

使用的命令如下

```bash
git bisect start

git bisect bad HEAD
git bisect good v4.1
```
我们只需要使用`git bisect good`和`git bisect bad`进行标记，`git bisect`会使用二分法帮助我们定位直到找到bug引入的源头。如果操作很简单，可以是使用来执行脚本进行操作

```bash
git bisect run test/run.sh
```

> 本文参考[廖雪峰的git教程](http://www.liaoxuefeng.com/)，整理学习，尊重原创

## 配置git
`git config`用来配置`git`
```git
git config --global user.name 'xxxxx'
git config --global user.email 'xxxxxx@gmail.com'
```
生成密钥使用
```shell
// 使用rsa方式生成密钥
ssh-keygen -t rsa
```
在linux中密钥默认存在用户的`.ssh`文件里。可以使用`ssh-copy-id`命令来讲公钥拷贝到远程的`.ssh/authorized_keys`文件中
```shell
// -i 用来指定认证文件（公钥）
ssh-copy-id -i ~/.ssh/id_ras.pub root@192.0.0.1
```

## 创建版本库
`git init`用来把一个目录变成git仓库，该文件夹可以不是空的
```git
git init
```
`git add`添加文件，可以使用通配符`.`添加所有文件。`git add`是添加到缓存区，缓存区(stage)是`git`与`svn`不同的地方，可以简单理解为将修改完的通通放到缓存区，最后可以一次性提交

```git
git add .
```
`git commit` 一次性的把所有缓存区的内容提交到分支，`-m` 后面跟提交信息

```git
git commit -m "fix: fixed some bugs"
```

## 版本文件管理

`git status`可以查看仓库当前状态

```git
git status
```
`git diff`查看工作区和版本库最新版的不同（目前还不太会用）
```git
git diff
```

### 版本回退
`git log`可以显示从最近到最远的提交，如果想要精简输出可以在后面加上`--pretty=oneline`参数
```git
git log --pretty=oneline
```
结果显示的`3628164...882e1e0`等一大串数字字母组合是`commit id`（版本号），是SHA1计算出来的，可以避免冲突

`git reset`可以用来回退版本，在`git`中`HEAD`表示最新版，`HEAD^`表示上一版本，`HEAD^^`表示上上版本，当然往上100个版本，数不过来可以写成`HEAD~100`，同时`git reset --hard commitId`可以回到指定的版本
```git
git reset --hard HEAD^
git reset --hard 3628164
```
`git reflog` 查看commit id
```git
git reflog
```

### 撤销修改
`git checkout -- file `会丢弃工作区的修改，让文件回到最后一次`git commit`或`git add`的状态
```git
git checkout -- readme.txt
```
这个命令里面的`--`很重要，没有`--`就变成了切换到另一个分支的命令
`git reset HEAD file`将缓存区回退到工作区
```git
git reset HEAD readme.txt
```

### 删除文件
`git rm`可以用来删除文件，相当于先在工作区删除，再添加到缓存区，最后再使用`git commit`就可以删除分支的文件了
```git
git rm
```

## 远程仓库

### 关联远程库
`git remote add origin url`关联远程的仓库
```git
git remote add origin git@github.com:用户名/仓库名称.git
```
`git push`把本地库的内容推送到远程，第一次推送时加上`-u`，`git`不但会把本地的`master`分支内容推送到远程的master分支，还会把本地的`master`分支和远程的`master`分支关联起来，在以后推送和拉取的时候就可以简化命令，直接使用`git push origin master`
```git
git push -u origin master
```

### 从远程库克隆
`git clone`从远程克隆库到本地
```git
git clone git@github.com:用户名/仓库名.git
```

## 分支管理
### 创建和合并分支
`git branch`查看当前的所有分支和当前分支，
后面跟名字可以创建新的分支，`git checkout <branch>`用来切换分支
```git
git branch dev
git checkout dev
```
这两个命令可以简写为`git checkout -b <branch>`
```git
git checkout -b dev
```
表示创建并切换到新的分支

`git merge <branch>`将某分支与当前分支合并
```git
git merge dev
```
`git merge -d <branch>`合并并删除某分支
```git
git merge -d dev
```

### 解决冲突
`git merge`合并文件发生冲突的时候，我们可以用`git status`查看文件，然后手动解决冲突后再添加-提交-合并
`git log --graph`可以看到分支合并图
```git
git log --graph`
```

### 分支管理策略
在`git`中，如果可以的话，`git`会默认使用`Fast forward`模式，但在这种模式下，删除分支后，会丢掉分支信息，强制禁止'Fast forward'就可以在`merge`时，生成一个新的`commit`，从分支历史上就可以看出分支信息，禁止`Fast forward`使用`--no-ff`
```git
git merge --no-ff -m 'merge with --no-ff' dev
```
这样使用`git log`就可以看到曾经做过合并，否则使用`Fast forward`是看不到曾经做过合并的
在实际开发中，应该按照以下几个基本原则进行分支管理：
1. `master`是非常稳定的，仅仅用来发布新版本
2. 平时大家都在`dev`上干活，也就是说，`dev`是不稳定的，到版本发布的时候，再把`dev`合并到`master`上
3. 每个人都有自己的分支，时不时的往`dev`上合并就可以了

### bug分支
`git stash`可以把当前工作现场储存起来
```git
git stash
```
`git stash list`列出所有存储的现场
```git
git stash list
```
`git stash apply`可以恢复现场，而且可以恢复指定的现场
```git
git stash apply
git stash apply stash@{0}
```
现场恢复后，`stash`并不删除，需要用`git stash drop`来删除
```git
git stash apply
git stash drop
```
也可以用`git stash pop`代替那两个命令，直接恢复并删除
```git
git stash pop
```

### Feature分支
开发新的功能最好建立一个新的分支，然后合并，删除分支。如果现在新功能取消，只能删除掉该分支，但由于该分支还没有合并，会导致删除失败，只能强行删除，这时就要用`git branch -D <name>`强行删除
```git
git branch -D new-fearture
```

### 多人协作
当从远程仓库克隆到本地之后，远程的`master`分支就和本地的`master`分支对应起来了，并且远程仓库的默认名称是origin。要查看远程仓库可以用`git remote`
```git
git remote
```
查看更详细的信息，后面加`-v`参数
```git
git remote -v
```
会显示可以抓取和推送的地址，如果没有推送权限就看不到push地址。
并不一定所有的分支都需要推送
- `master`是主分支，因此要时刻与远程保持同步
- `dev`是开发分支，团队所有成员都在上面工作，因此也需要与远程同步
- `bug`分支只用于在本地修复bug没必要推送
- `feature`是否推送，取决于是否与他人合作开发

当从远程克隆到本地时只能看到`master`分支，由于要在`dev`分支上开发，所以可以创建与远程`dev`分支对应的分支，使用`git checkout -b branch-name origin/branch-name`，本地分支与远程分支名称最好一致
```git
git checkout -b dev origin/dev
```
从本地推送到远程时最后先`git pull`，避免冲突，如果`pull`的时候出现no tracking information说明本地分支与远程分支没有建立关系，这时可以使用`git branch --set-upstream branch-name origin/branch-name`命令
```git
git branch --set-upstream dev origin/dev
```

## 标签管理
标签就是指向某个`commit`的指针，跟分支很像，不过分支可以移动而标签`tag`不能，为了快速找到版本，而`commit id`又不好记，这时就可以用tag取一个有意义的名字

### 创建分支
`git tag <tagname>`用来创建分支
```git
git tag v1.0
```
默认是打在最新的`commit`上面的，如果要给以前的`commit`打标签，就可以用`git log`找到当时的`commit id`然后用`git tag <tagname> <commitid>`来就可以了
```git
git tag v0.9 622494
```
`git tag`可以查看所有标签，它们是按字母排序的
```git
git tag
```
`git show <tagname>`可以查看标签的详细信息
```git
git show v0.1
```
还可以创建带有说明的标签，用`-a`指定标签名，`-m`指定说明文字
```git
git tag -a v1.0 -m "version 1.0 release"
```
还可以通过`-s`用私钥签名一个标签
```git
$ git tag -s v0.2 -m "signed version 0.2 released" fec145a
```

### 操作标签
标签只会存在本地，因此可以在本地安全的删除，使用`git tag -d <tagname>`
```git
git tag -d v1.0
```
要推送标签到远程使用`git push origin <tagname>`
```git
git push origin v1.0
```
或者一次性推送所有未推送的本地标签
`git push origin --tags`
```git
git push origin --tags
```
推送到远程再删除就要两步，先用`git tag -d <tagname>`删除本地的，在用`git push origin :refs/tags/<tagname>`
```git
git push origin :ref/tags/v1.0
```

## 自定义git
### 忽略特殊文件
如果不想提交`git`中的某些文件可以，在根目录下添加一个`.gitignore`文件，把要忽略的文件填进去，git就会自动忽略这些文件。github准备了各种[配置文件](https://github.com/github/gitignore)

### 设置别名
有时候为了方便可以设置一些别名使用`alias`
```git
git config --global alias.st status
```
这样`git status`就可以直接用`git st`调用，在配置`git`的时候`--global`是对当前用户起作用的，如果不加只能对当前仓库起作用。配置文件都放在`.git/config`中
另一个别名例子
```git
git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
```
