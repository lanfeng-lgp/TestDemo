# git 根目录
localGitPath="/e/GIT/hoss/"

# 测试环境发布目录
publishPath="/e/pro/hoss-v3/branch"

read -p "请输入环境名(sit1~4/13): " env

if [ $env ]; then
   echo "env ------>  $env"
else
   echo "输入不符合要求"
   exit
fi

echo "=============  BUILD START  ====================="
echo "-------------  enter hoss-web-v3   -------------"
# 进入你的git目录
cd $localGitPath

git branch
git pull
echo "------------------------------  pull hoss-web-v3 code SUCCESS ------------------------------"

yarn
yarn build
echo "------------------------------ build END ------------- "

# 进入发布目标目录
cd $publishPath/$env  
svn update
echo "------------------------------  update svn branch SUCCESS  -------------"

# 备份最新一次发布
mv $publishPath/$env/hoss-web-v3 $publishPath/$env/hoss-web-v3-$(date "+%Y-%m-%d-%H%M")
echo '------------------------------   bak hoss-web-v3 SUCCESS --------------------------------------------------------------'

# 打包文件迁移至发布目录
mv $localGitPath/dist/hoss-web-v3 $publishPath/$env
echo "----->   copy hoss-web-v3 to |  $env 环境 | -->  SUCCESS"

echo "===================== BUILD SUCCESS  ====================="

# 通过企业微信机器人发布打包完成通知
curl 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=3e25ae03-f8c1-44fd-9813-8fa561706a26' \
  -H 'Content-Type: application/json' \
  -d '{
    "msgtype": "markdown",
    "markdown": {
        "content": "git环境hoss-web已build结束，待发版。\n
         >环境:<font color=\"comment\"></font> \n"
        "mentioned_mobile_list":["15601691657"]
    }
}'

# 打开发布目录
start $publishPath/$env
echo "已打开发布目录"


