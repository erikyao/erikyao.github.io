`git log` 命令显示从最近到最远的提交日志，我们可以看到 3 次提交，最近的一次是 "append GPL"，上一次是 "add distributed"，最早的一次是 "wrote a readme file"。

如果嫌输出信息太多，看得眼花缭乱的，可以试试加上 `--pretty=oneline` 参数：

```bash
$ git log --pretty=oneline
3628164fb26d48395383f8f31179f24e0882e1e0 append GPL
ea34578d5496d7dd233c827ed32a8cd576c5ee85 add distributed
cb926e7ea50ad11b8f9e909c05226233bf755030 wrote a readme file
```

需要友情提示的是，你看到的一大串类似 `3628164...882e1e0` 的是 commit id（版本号），和 SVN 不一样，Git 的 commit id 不是 1,2,3... 递增的数字，而是一个 SHA1 计算出来的一个非常大的数字，用十六进制表示。

好了，现在我们启动时光穿梭机，准备把 readme.txt 回退到上一个版本，也就是 "add distributed" 的那个版本，怎么做呢？

首先，Git 必须知道当前版本是哪个版本，在 Git 中，用 `HEAD` 表示当前版本，也就是最新的提交 3628164...882e1e0，上一个版本就是 `HEAD^`，上上一个版本就是 `HEAD^^`，当然往上 100 个版本写 100 个 `^` 比较容易数不过来，所以写成 `HEAD~100`。

现在，我们要把当前版本 "append GPL" 回退到上一个版本 "add distributed"，就可以使用 `git reset` 命令：

```bash
$ git reset --hard HEAD^
HEAD is now at ea34578 add distributed
```

注意此时你 `git log` 就已经看不到 "append GPL" 这个版本了。如果你又想 reset 回去，就必须要 "append GPL" 的 commit id，但此时 `git log` 已经查不到了，怎么办？Git提供了一个命令 `git reflog` 用来记录你的每一次命令：

```bash
$ git reflog
ea34578 HEAD@{0}: reset: moving to HEAD^
3628164 HEAD@{1}: commit: append GPL
ea34578 HEAD@{2}: commit: add distributed
cb926e7 HEAD@{3}: commit (initial): wrote a readme file
```

然后通过 commit id 来 reset 回去：

```bash
$ git reset --hard 3628164
HEAD is now at 3628164 append GPL
```

-----

- Working Directory: 你的本地目录 except `.git`
- Repository: `.git`，包括：
    - stage area (or index): 暂存区
    - Git 为我们自动创建的第一个分支 `master`，以及指向 `master` 的一个指针叫 `HEAD`

- `git add`: 添加到 stage area
- `git commit`: 把 stage area 的内容提交到当前 branch
    - 所以你 Modification-1 -> `git add` -> Modification-2 -> `git commit` 只会提交 Modification-1 因为只有 Modification-1 在 stage area 里

-----

## 撤销修改

### 1. 撤销你在 Working Directory 内的修改 (by 读取 branch 的版本到 Working Directory)

```bash
git checkout -- readme.txt  # 读取当前 branch 的版本到本地
```

注意这里 `--` 的作用：in general it separates options from parameters，但是要具体的 command 具体分析。

这里 `git checkout` 会遇到一种歧义的命令：比如你有个文件叫 master……这时就需要 `--` 来区分一下：

```bash
git checkout master  # checkout the branch
git checkout -- master  # checkout the file
```

### 2. 撤销你添加到 stage area 的内容 (Unstaging)

假设你已经 `git add readme.txt`，这时想 "unadd"，可以用：

```bash
git reset HEAD readme.txt
```

更专业的叫法是 "unstage"。

这个操作完了之后，你可以选择进一步 `git checkout -- readme.txt` 或者再自己修改 readme.txt

-----

## 删除文件

```bash
git add test.txt
git commit -m "add test.txt"

rm test.txt
git rm test.txt  # remove from stage area
git commit -m "remove test.txt"
```

-----

## Remote (远程 Repository)

### 1. 关联本地 repo 到 remote 

假定你本地 `git init` 了一个 repo 叫 learngit，然后 GitHub 上也创建了一个 learngit (这个是 remote)，我们可以把本地的 repo 和 remote 关联起来：

```bash
git remote add origin git@github.com:johndoe/learngit.git
```

remote 的名字就是 `origin`，这是 Git 默认的叫法，也可以改成别的，但是 `origin` 这个名字一看就知道是 remote。

下一步，就可以把本地 repo 的所有内容 push 到 remote 上：

```bash
git push origin master  # Updates remote refs (origin) using local refs (master)
```

实际上是把当前 branch `master` 推送到 remote

### 2. `git clone` remote 到本地

略

-----

## branch 管理

### 1. Create, merge & delete a branch

简单来说，一个 branch 就是一条 timeline (每个 commit 就是其上的一个 node)，而 `HEAD` 是一个 branch 的指针。

创建并切换到 branch `dev` (`HEAD` 指向 `dev`):

```bash
$ git branch dev
$ git checkout dev
Switched to branch 'dev'

# OR

$ git checkout -b dev
Switched to a new branch 'dev'
```

commit something 到 `dev` 之后，我们切回 `master` (`HEAD` 指向 `master`) 并 merge：

```bash
$ git checkout master
Switched to branch 'master'

$ git merge dev  # 合并指定 branch 到当前 branch
Updating d17efd8..fec145a
Fast-forward
 readme.txt |    1 +
 1 file changed, 1 insertion(+)
```

注意到上面的 `Fast-forward` 信息，Git 告诉我们，这次合并是 "快进模式"，也就是直接把 `master` 指向 `dev` 的当前 commit，所以合并速度非常快。

合并完成后，就可以放心地删除 branch `dev` 了：

```bash
$ git branch -d dev
Deleted branch dev (was fec145a).
```

### 2. Resolve conflicts

略

### 3. `git merge --no-ff`: 强制禁用 `Fast-forward` 模式

通常，合并分支时，如果可能，Git 会用 `Fast forward` 模式，但这种模式下，删除分支后，会丢掉分支信息。

如果要强制禁用 `Fast forward` 模式，Git 就会在 merge 时生成一个新的 commit，这样，从分支历史上就可以看出分支信息。

```bash
$ git merge --no-ff -m "merge with no-ff" dev
Merge made by the 'recursive' strategy.
 readme.txt |    1 +
 1 file changed, 1 insertion(+)
```

因为本次合并要创建一个新的 commit，所以加上 `-m` 参数，把 commit 描述写进去。

### 4. branch 策略

首先，`master` 分支应该是非常稳定的，也就是仅用来发布新版本，平时不能在上面干活。

那在哪干活呢？干活都在 `dev` 分支上，也就是说，`dev` 分支是不稳定的，到某个时候，比如 1.0 版本发布时，再把 `dev` 分支合并到 `master` 上，在 `master` 分支发布 1.0 版本。

### 5. `git stash` & bug branch

当你接到一个修复一个代号 101 的 bug 的任务时，很自然地，你想创建一个分支 `issue-101` 来修复它，但是，等等，当前正在 `dev` 上进行的工作还没有提交。并不是你不想提交，而是工作只进行到一半，还没法提交，预计完成还需 1 天时间。但是，必须在两个小时内修复该 bug，怎么办？

幸好，Git 还提供了一个 `git stash` 功能，可以把当前工作现场 "储藏" 起来，等以后恢复现场后继续工作：

```bash
$ git stash
Saved working directory and index state WIP on dev: 6224937 add merge
HEAD is now at 6224937 add merge
```

现在，用 `git status` 查看工作区，就是干净的（除非有没有被 Git 管理的文件），因此可以放心地创建分支来修复bug。

首先确定要在哪个分支上修复 bug，假定需要在 `master` 分支上修复，就从 `master` 创建临时分支：

```bash
$ git checkout master
Switched to branch 'master'
Your branch is ahead of 'origin/master' by 6 commits.
$ git checkout -b issue-101
Switched to a new branch 'issue-101'
```

修复完成后，切换到 `master` 分支，并完成合并，最后删除 `issue-101` 分支：

```bash
$ git checkout master
Switched to branch 'master'
Your branch is ahead of 'origin/master' by 2 commits.
$ git merge --no-ff -m "merged bug fix 101" issue-101
Merge made by the 'recursive' strategy.
 readme.txt |    2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
$ git branch -d issue-101
Deleted branch issue-101 (was cc17032).
```

现在，是时候接着回到 `dev` 分支干活了！

```bash
$ git checkout dev
Switched to branch 'dev'
$ git status
# On branch dev
nothing to commit (working directory clean)
```

工作区是干净的，刚才的工作现场存到哪去了？用 `git stash list` 命令看看：

```bash
$ git stash list
stash@{0}: WIP on dev: 6224937 add merge
```

工作现场还在，Git把 stash 内容存在某个地方了，但是需要恢复一下，有两个办法：

- 用 `git stash apply` 恢复，但是恢复后，stash 内容并不删除，你需要用 `git stash drop` 来删除；
- 另一种方式是用 `git stash pop`，恢复的同时把 stash 内容也删了

```bash
$ git stash pop
# On branch dev
# Changes to be committed:
#   (use "git reset HEAD <file>..." to unstage)
#
#       new file:   hello.py
#
# Changes not staged for commit:
#   (use "git add <file>..." to update what will be committed)
#   (use "git checkout -- <file>..." to discard changes in working directory)
#
#       modified:   readme.txt
#
Dropped refs/stash@{0} (f624f8e5f082f2df2bed8a4e09c12fd2943bdd40)
```

你可以多次 stash，恢复的时候，先用 `git stash list` 查看，然后恢复指定的 stash:

```bash
$ git stash apply stash@{0}
```

### 6. 强行删除未 merge 的 feature branch

假定你接到了一个新任务：开发代号为 Vulcan 的新功能，该功能计划用于下一代星际飞船。于是准备：

```bash
$ git checkout -b feature-vulcan
Switched to a new branch 'feature-vulcan'
```

开发完毕后切回 `dev`，准备合并:

```bash
$ git checkout dev
```

一切顺利的话，feature brach 和 bug branch 是类似的：合并，然后删除。但是，就在此时，接到上级命令，因经费不足，新功能必须取消！虽然白干了，但是这个分支还是必须就地销毁：

```bash
$ git branch -d feature-vulcan
error: The branch 'feature-vulcan' is not fully merged.
If you are sure you want to delete it, run 'git branch -D feature-vulcan'.
```

Git 友情提醒：`feature-vulcan` 分支还没有被合并，如果删除，将丢失掉修改，如果要强行删除，需要使用命令 `git branch -D feature-vulcan`:

```bash
$ git branch -D feature-vulcan
Deleted branch feature-vulcan (was 756d4af).
```

终于删除成功！

### 7. `git remote` / `git pull` / `git fetch` / `git push`

http://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000/0013760174128707b935b0be6fc4fc6ace66c4f15618f8d000#0

https://stackoverflow.com/questions/292357/what-is-the-difference-between-git-pull-and-git-fetch

-----

## Lab

ramseylab:cerenkov-private$ git ls-remote origin
Password:
46d52c735a5c3d7fc1c7abe6e2990e4a6fd98b25        HEAD
ada74bfff4aa0ca7111c35e0bb4d7293cb9faa3b        refs/heads/NIH-20170305
46d52c735a5c3d7fc1c7abe6e2990e4a6fd98b25        refs/heads/master
95fbde6a3736c5bee79e80fbffc014f5ea9a67fd        refs/tags/recomb-20161101


ramseylab:cerenkov-private$ git reflog
9f3dbbb HEAD@{0}: merge NIH-20170305: Merge made by the 'recursive' strategy.
46d52c7 HEAD@{1}: checkout: moving from NIH-20170305 to master
ada74bf HEAD@{2}: pull origin NIH-20170305: Fast-forward
e4608d1 HEAD@{3}: checkout: moving from master to NIH-20170305
46d52c7 HEAD@{4}: checkout: moving from master to master
46d52c7 HEAD@{5}: checkout: moving from NIH-20170305 to master
e4608d1 HEAD@{6}: checkout: moving from master to NIH-20170305
46d52c7 HEAD@{7}: checkout: moving from master to master
46d52c7 HEAD@{8}: commit: refactoring
9af27f3 HEAD@{9}: merge origin/NIH-20170305: Merge made by the 'recursive' strategy.5a98d45 HEAD@{10}: checkout: moving from master to master
5a98d45 HEAD@{11}: commit: refactor
df4ad8a HEAD@{12}: commit: add rsid-generating code
13afab2 HEAD@{13}: commit: verify that python/SKL can reach the same performance with R's on AVGRANK and AUPVR with the same features and the same fold partitions
2393779 HEAD@{14}: initial pull


ramseylab:cerenkov-private$ git reset --hard 9f3dbbb
HEAD is now at 9f3dbbb Merge branch 'NIH-20170305'


ramseylab:cerenkov-private$ git push origin master
Password:
Counting objects: 2, done.
Delta compression using up to 8 threads.
Compressing objects: 100% (2/2), done.
Writing objects: 100% (2/2), 288 bytes | 0 bytes/s, done.
Total 2 (delta 1), reused 0 (delta 0)
To git@10.214.70.62:cerenkov-private.git
   46d52c7..9f3dbbb  master -> master
