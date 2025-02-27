---
title: 如何发布版本
sidebar_position: 6
---

> 本文主要介绍了Release Manager如何按照Apache的流程发布版本，

Source Release是Apache关注的重点，也是发布的必须内容；
Binary Release是可选项，InLong可以选择是否发布二进制包到Apache仓库或者发布到Maven中央仓库。

注意，对于二进制发布包，需要检查新版本里是否包含了x类的第三方依赖包，包括直接引用和间接引用部分，如果包含了，需要去掉后再发布版本

请参考以下链接，找到更多关于ASF的发布指南:

[Apache Release Guide](https://incubator.apache.org/guides/releasemanagement.html)

[Apache incubator 官网](https://incubator.apache.org/)

## 添加GPG KEY
> 本章节主要参考：https://infra.apache.org/openpgp.html
**该章节仅仅对第一次当该项目的Release Manager需要。**

### 安装gpg
详细的安装文档可以参考[官网](https://www.gnupg.org/download/index.html), Mac OS环境配置如下
```shell
$ brew install gpg
$ gpg --version #检查版本，应该为2.x
```
### 生成gpg Key
#### 需要注意以下几点：
- 输入名字时最好与Apache中登记的Full name保持一致
- 使用的邮箱应该是apache邮箱
- 名字最好使用拼音或者英文，否则会出现乱码

#### 根据提示，生成key
```shell
➜  ~ gpg --full-gen-key
gpg (GnuPG) 2.2.20; Copyright (C) 2020 Free Software Foundation, Inc.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Please select what kind of key you want:
   (1) RSA and RSA (default)
   (2) DSA and Elgamal
   (3) DSA (sign only)
   (4) RSA (sign only)
  (14) Existing key from card
Your selection? 1 # 这里输入1
RSA keys may be between 1024 and 4096 bits long.
What keysize do you want? (2048) 4096 # 这里输入4096
Requested keysize is 4096 bits       
Please specify how long the key should be valid.
         0 = key does not expire
      <n>  = key expires in n days
      <n>w = key expires in n weeks
      <n>m = key expires in n months
      <n>y = key expires in n years
Key is valid for? (0) 0 # 这里输入0
Key does not expire at all
Is this correct? (y/N) y # 这里输入y

GnuPG needs to construct a user ID to identify your key.

Real name: Guangxu Cheng # 这里输入你的名字
Email address: gxcheng@apache.org # 这里输入你的邮箱
Comment:                          # 这里输入一些注释，可以为空
You selected this USER-ID:
    "Guangxu Cheng <gxcheng@apache.org>"

Change (N)ame, (C)omment, (E)mail or (O)kay/(Q)uit? O #这里输入O
We need to generate a lot of random bytes. It is a good idea to perform
some other action (type on the keyboard, move the mouse, utilize the
disks) during the prime generation; this gives the random number
generator a better chance to gain enough entropy.
We need to generate a lot of random bytes. It is a good idea to perform
some other action (type on the keyboard, move the mouse, utilize the
disks) during the prime generation; this gives the random number
generator a better chance to gain enough entropy.

# 此时会弹出对话框，要求你为这个gpg输入密钥。
┌──────────────────────────────────────────────────────┐
│ Please enter this passphrase                         │
│                                                      │
│ Passphrase: _______________________________          │
│                                                      │
│       <OK>                              <Cancel>     │
└──────────────────────────────────────────────────────┘
#输入秘钥完毕后就创建好了。并会输出以下信息
gpg: key 2DD587E7B10F3B1F marked as ultimately trusted
gpg: revocation certificate stored as '/Users/cheng/.gnupg/openpgp-revocs.d/41936314E25F402D5F7D73152DD587E7B10F3B1F.rev'
public and secret key created and signed.

pub   rsa4096 2020-05-19 [SC]
      41936314E25F402D5F7D73152DD587E7B10F3B1F
uid                      Guangxu Cheng <gxcheng@apache.org>
sub   rsa4096 2020-05-19 [E]
```

### 上传生成的key到公共服务器

```shell
➜  ~ gpg --list-keys                                                        
-------------------------------
pub   rsa4096 2020-05-18 [SC]
      5931F8CFD04B37A325E4465D8C0D31C4149B3A87
uid           [ultimate] Guangxu Cheng <gxcheng@apache.org>
sub   rsa4096 2020-05-18 [E]

# 通过key id发送public key到keyserver
$ gpg --keyserver pgpkeys.mit.edu --send-key <key id>
# 其中，pgpkeys.mit.edu为随意挑选的keyserver，keyserver列表为：https://sks-keyservers.net/status/，为相互之间是自动同步的，选任意一个都可以。
```

### 查看key是否创建成功
通过下面的网址，使用邮箱查询上传成功没，大概需要一分钟才能查到，查询时候把 advance 下边的 show full-key hashes 勾上
http://keys.gnupg.net

查询结果如下：



### 将你的gpg公钥加入KEYS文件

> 这个步骤需要使用SVN

DEV分支的svn库是 https://dist.apache.org/repos/dist/dev/incubator/inlong

Release分支的SVN库是 https://dist.apache.org/repos/dist/release/incubator/inlong

#### 在dev分支中添加公钥到KEYS，用于发布RC版本

```shell
➜  ~ svn co https://dist.apache.org/repos/dist/dev/incubator/inlong /tmp/inlong-dist-dev
# 这个步骤比较慢，会把所有版本都拷贝下来，如果网断了，用svn cleanup删掉锁，重新执行一下，会断点续传
➜  ~ cd inlong-dist-dev
➜  inlong-dist-dev ~ (gpg --list-sigs YOUR_NAME@apache.org && gpg --export --armor YOUR_NAME@apache.org) >> KEYS # 追加你生成的KEY到文件KEYS中, 追加后最好检查一下是否正确
➜  inlong-dist-dev ~ svn add .	# 如果之前存在KEYS文件，则不需要
➜  inlong-dist-dev ~ svn ci -m "add gpg key for YOUR_NAME" # 接下来会要求输入用户名和密码，就用你的apache的用户名和密码。
```

#### 在release分支中添加公钥到KEYS，用于发布正式版本

```shell
➜  ~ svn co https://dist.apache.org/repos/dist/release/incubator/inlong /tmp/inlong-dist-release
➜  ~ cd inlong-dist-release
➜  inlong-dist-release ~ (gpg --list-sigs YOUR_NAME@apache.org && gpg --export --armor YOUR_NAME@apache.org) >> KEYS # 追加你生成的KEY到文件KEYS中, 追加后最好检查一下是否正确
➜  inlong-dist-release ~ svn add .	# 如果之前存在KEYS文件，则不需要
➜  inlong-dist-release ~ svn ci -m "add gpg key for YOUR_NAME" # 接下来会要求输入用户名和密码，就用你的apache的用户名和密码。
```

### 上传GPG公钥到Github账户

1. 进入 https://github.com/settings/keys ，添加GPG KEYS。
2. 如果添加后你发现这个密钥后面写了“未经过验证” (unverified)，记得去将GPG key中用到的邮箱绑定到你的github账户上 (https://github.com/settings/emails)。

## 设置maven设置

**如果已经设置过则跳过**

在maven的配置文件~/.m2/settings.xml中，则添加下面的`<server>`项
```xml
<?xml version="1.0" encoding="UTF-8"?>
<settings xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.1.0 http://maven.apache.org/xsd/settings-1.1.0.xsd" xmlns="http://maven.apache.org/SETTINGS/1.1.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <servers>
    <!-- Apache Repo Settings -->
    <server>
        <id>apache.snapshots.https</id>
        <username>{user-id}</username>
        <password>{user-pass}</password>
    </server>
    <server>
        <id>apache.releases.https</id>
        <username>{user-id}</username>
        <password>{user-pass}</password>
    </server>
  </servers>
<profiles>
    <profile>
      <id>apache-release</id>
      <properties>
        <gpg.keyname>你的KEYID</gpg.keyname><!-- Your GPG Keyname here -->
        <!-- Use an agent: Prevents being asked for the password during the build -->
        <gpg.useagent>true</gpg.useagent>
        <gpg.passphrase>你的私钥的密码</gpg.passphrase>
      </properties>
    </profile>
</profiles>
</settings>
```

## 编译打包
### 准备分支
  - 从主干分支拉取新分支作为发布分支，release-${release_version}

  - 更新`CHANGES.md`

  - 检查代码是否正常，包括编译成功、单元测试全部成功，RAT检查成功等等

    ```shell
    # build检查
    $ mvn clean package -Dmaven.javadoc.skip=true
    # RAT检查
    $ mvn apache-rat:check
    ```

  - 更改版本号


### 创建tag
> 创建tag前，要确保代码已经检查无误，包括：编译成功、单元测试全部成功，RAT检查成功等

**创建一个带签名的tag**
```shell
$ git_tag=${release_version}-${rc_version}
$ git tag -s $git_tag -m "Tagging the ${release_version} first Releae Candidate (Candidates start at zero)"
# 如果遇到错误 gpg: signing failed: secret key not available，先配置下私钥
$ git config user.signingkey ${KEY_ID}
```
### 打包源码

> tag创建成功后，我需要将tag源码打包成一个tar包

```shell
mkdir /tmp/apache-inlong-${release_version}-${rc_version}
git archive --format=tar.gz --output="/tmp/apache-inlong-${release_version}-${rc_version}/apache-inlong-${release_version}-src.tar.gz" --prefix="apache-inlong-${release_version}/" $git_tag
```

### 打包二进制包
> 编译上一步打包的源码

```shell
cd /tmp/apache-inlong-${release_version}-${rc_version} # 进入源码包目录
tar xzvf apache-inlong-${release_version}-src.tar.gz #解压源码包
cd apache-inlong-${release_version} # 进入源码目录
mvn compile clean install package -DskipTests # 编译
cp ./inlong-distribution/target/apache-inlong-${release_version}-bin.tar.gz /tmp/apache-inlong-${release_version}-${rc_version}/  # 拷贝二进制包拷到源码包目录下，方便下一步对包进行签名
```

### 对源码包/二进制包进行签名/sha512
```shell
for i in *.tar.gz; do echo $i; gpg --print-md SHA512 $i > $i.sha512 ; done # 计算SHA512
for i in *.tar.gz; do echo $i; gpg --armor --output $i.asc --detach-sig $i ; done # 计算签名
```

### 检查生成的签名/sha512是否正确
具体可以参考：[验证候选版本](how-to-verify.md)
比如验证签名是否正确如下：
```shell
for i in *.tar.gz; do echo $i; gpg --verify $i.asc $i ; done
```
## 准备Apache发布
### 发布jar包到Apache Nexus仓库
```shell
cd /tmp/apache-inlong-${release_version}-${rc_version} # 进入源码包目录
tar xzvf apache-inlong-${release_version}-src.tar.gz #解压源码包
cd apache-inlong-${release_version}
mvn -DskipTests deploy -Papache-release -Dmaven.javadoc.skip=true  # 开始上传
```

### 上传tag到git仓库

```shell
git push origin ${release_version}-${rc_version}
```

### 上传编译好的文件到dist
> 这个步骤需要使用SVN, DEV分支的svn库是 https://dist.apache.org/repos/dist/dev/incubator/inlong

### 将InLong checkout到本地目录
```shell
# 这个步骤可能会比较慢，会把所有版本都考下来，如果网断了，用svn cleanup删掉锁，重新执行一下，会断点续传
svn co https://dist.apache.org/repos/dist/dev/incubator/inlong /tmp/inlong-dist-dev
```

### 添加public key到KEYS文件并提交到SVN仓库
```shell
cd /tmp/inlong-dist-dev
mkdir ${release_version}-${rc_version} #创建版本目录
# 将源码包和签名包拷贝到此处
cp /tmp/apache-inlong-${release_version}-${rc_version}/*tar.gz* ${release_version}-${rc_version}/
svn status # 检查svn状态
svn add ${release_version}-${rc_version} # 添加到svn版本
svn status # 检查svn状态
svn commit -m "prepare for ${release_version} ${rc_version}" # 提交至svn远程服务器
```
### 关闭Apache Staging仓库
> 请确保所有的artifact都是ok的
1. **先登录**http://repository.apache.org , 使用Apache账号登录
2. 点击左侧的Staging repositories，
3. 搜索InLong关键字，选择你最近上传的仓库
4. 点击上方的Close按钮，这个过程会进行一系列检查
5. 检查通过以后, 在下方的Summary标签页上出现一个连接，请保存好这个链接，需要放在接下来的投票邮件当中。
链接应该是类似这样的: `https://repository.apache.org/content/repositories/orgapacheinlong-xxxx`

WARN: 请注意点击Close可能会出现失败，请检查失败原因并处理

## 进入投票
> InLong仍旧在孵化中，需要进行两次投票，
- InLong社区投票，发邮件至：`dev@inlong.apache.org`
- incubator社区投票，发邮件至：`general@incubator.apache.org`
InLong毕业之后，只需要在InLong社区投票

### InLong社区投票

#### 投票模板

```html
标题：[VOTE] Release Apache InLong ${release_version} ${rc_version}

内容：

Hello Apache InLong PPMC and Community,

    This is a call for a vote to release Apache InLong version ${release_version}-${rc_version}.

    The tag to be voted on is ${release_version}-${rc_version}:

    https://github.com/apache/incubator-inlong/tree/${release_version}-${rc_version}

    The release tarball, signature, and checksums can be found at:

    https://dist.apache.org/repos/dist/dev/incubator/inlong/${release_version}-${rc_version}/

    Maven artifacts are available in a staging repository at:

    https://repository.apache.org/content/repositories/orgapacheinlong-{staging-id}

    Artifacts were signed with the {YOUR_PUB_KEY} key which can be found in:

    https://downloads.apache.org/incubator/inlong/KEYS

    ${release_version} includes ~ ${issue_count} bug fixes and improvements done since last versions which can be found at:

    https://github.com/apache/incubator-inlong/blob/${release_version}-${rc_version}/CHANGES.md

    Please download, verify, and test.

    The VOTE will remain open for at least 72 hours.

    [ ] +1 Release this package as Apache InLong ${release_version}
    [ ] +0
    [ ] -1 Do not release this package because...

    To learn more about apache inlong, please see
    http://inlong.apache.org/

    Checklist for reference:

      [ ] Download links are valid.
      [ ] Checksums and signatures.
      [ ] LICENSE/NOTICE/DISCLAIMER files exist
      [ ] No unexpected binary files
      [ ] All source files have ASF headers
      [ ] Can compile from source
      [ ] All Tests Passed

      More detailed checklist  please refer to:
      https://cwiki.apache.org/confluence/display/INCUBATOR/Incubator+Release+Checklist

Thanks,
Your InLong Release Manager
```

#### 宣布投票结果模板
```html
标题：[RESULT][VOTE] Release Apache InLong ${release_version} ${rc_version}

内容：

Hello Apache InLong PPMC and Community,

    The vote closes now as 72hr have passed. The vote PASSES with
    xx (+1 non-binding) votes from the PPMC,
    xx (+1 binding) vote from the IPMC,
    xx (+1 non-binding) vote from the rest of the developer community,
    and no further 0 or -1 votes.

    The vote thread: {vote_mail_address}

    I will now bring the vote to general@incubator.apache.org to get approval by the IPMC.
    If this vote passes also, the release is accepted and will be published.

Thank you for your support.
Your InLong Release Manager
```

### incubator社区投票

#### 投票模板

```html
标题：[VOTE] Release Apache InLong(Incubating) ${release_version} ${rc_version}

内容：

Hello Incubator Community,

    This is a call for a vote to release Apache InLong(Incubating) version
    ${release_version} ${rc_version}

    The Apache InLong community has voted on and approved a proposal to release
    Apache InLong(Incubating) version ${release_version} ${rc_version}

    We now kindly request the Incubator PMC members review and vote on this
    incubator release.

    InLong community vote thread:
    • [投票链接]

    Vote result thread:
    • [投票结果链接]

    The release candidate:
    • https://dist.apache.org/repos/dist/dev/incubator/inlong/${release_version}-${rc_version}/

    Git tag for the release:
    • https://github.com/apache/incubator-inlong/releases/tag/${release_version}-${rc_version}

    Release notes:
    • https://github.com/apache/incubator-inlong/blob/${release_version}-${rc_version}/CHANGES.md

    The artifacts signed with PGP key [填写你个人的KEY], corresponding to [填写你个人的邮箱], that can be found in keys file:
    • https://downloads.apache.org/incubator/inlong/KEYS

    The vote will be open for at least 72 hours or until necessary number of votes are reached.

    Please vote accordingly:

    [ ] +1 approve
    [ ] +0 no opinion
    [ ] -1 disapprove with the reason

Thanks,
On behalf of Apache InLong(Incubating) community

```

#### 宣布投票结果模板
```html
标题：[RESULT][VOTE] Release Apache InLong ${release_version} {rc_version}

内容：
Hi all

Thanks for reviewing and voting for Apache InLong(Incubating) ${release_version} {rc_version}
release, I am happy to announce the release voting has passed with [投票结果数]
binding votes, no +0 or -1 votes. Binding votes are from IPMC

   - xxx
   - xxx
   - xxx

The voting thread is:
[投票链接]

Many thanks for all our mentors helping us with the release procedure, and
all IPMC helped us to review and vote for Apache InLong(Incubating) release. I will
be working on publishing the artifacts soon.

Thanks
On behalf of Apache InLong(Incubating) community
```

## 正式发布

### 合并release-${release_version}分支的改动到master分支
### 将源码和二进制包从svn的dev目录移动到release目录
```shell
svn mv https://dist.apache.org/repos/dist/dev/incubator/inlong/${release_version}-${rc_version} https://dist.apache.org/repos/dist/release/incubator/inlong/${release_version} -m "Release ${release_version}"
```
### 确认dev和release下的包是否正确
1. 确认[dev](https://dist.apache.org/repos/dist/dev/incubator/inlong/)下的`${release_version}-${rc_version}`已被删除
2. 删除[release](https://dist.apache.org/repos/dist/release/incubator/inlong/)目录下上一个版本的发布包，这些包会被自动保存在[这里](https://archive.apache.org/dist/incubator/inlong/)
```shell
svn delete https://dist.apache.org/repos/dist/release/incubator/inlong/${last_release_version} -m "Delete ${last_release_version}"
```

### 在Apache Staging仓库发布版本
> 请确保所有的artifact都是ok的
1. 登录http://repository.apache.org , 使用Apache账号登录
2. 点击左侧的Staging repositories，
3. 搜索InLong关键字，选择你最近上传的仓库，投票邮件中指定的仓库
4. 点击上方的`Release`按钮，这个过程会进行一系列检查

**等仓库同步到其他数据源，一般需要24小时**

### 更新官网链接

### 发邮件到 `dev@inlong.apache.org` 和 `general@incubator.apache.org`
**请确保6.4中的仓库已发布成功，一般是在6.4后的24小时后发布邮件** 

宣布release邮件模板：
```html
标题： [ANNOUNCE] Release Apache InLong(incubating) ${release_version}
内容：
Hi all,

The Apache InLong(incubating) community is pleased to announce 
that Apache InLong(incubating) ${release_version} has been released!

Apache InLong is a one-stop integration framework for massive data that provides automatic, secure,
distributed, and efficient data publishing and subscription capabilities.
This platform helps you easily build stream-based data applications.

Download Links: https://inlong.apache.org/download/main

Release Notes: https://inlong.apache.org/download/release-${release_version}

Website: https://inlong.apache.org/

InLong Resources:
- Issue: https://github.com/apache/incubator-inlong/issues
- Mailing list: dev@inlong.apache.org

Thanks
On behalf of Apache InLong(Incubating) community
```
