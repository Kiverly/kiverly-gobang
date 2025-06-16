# 五子棋游戏

一个简单的网页版五子棋游戏，使用HTML、CSS和JavaScript开发。

## 游戏说明
- 黑白双方轮流落子，先在横向、纵向或斜向形成五子连线者获胜
- 点击棋盘格子放置棋子
- 点击"重新开始"按钮可以重置游戏

## 如何运行
1. 克隆本仓库到本地
2. 直接打开index.html文件即可在浏览器中运行
3. 或使用本地服务器运行（推荐）：
   ```
   cd 五子棋
   python -m http.server 8000
   ```
4. 在浏览器中访问 http://localhost:8000

## 部署到GitHub Pages
1. 将代码推送到GitHub仓库
2. 在仓库设置中开启GitHub Pages
3. 选择main分支和根目录
4. 访问 https://<你的用户名>.github.io/<仓库名> 即可在线玩游戏

## 项目结构
- index.html: 游戏页面结构
- style.css: 游戏样式
- game.js: 游戏逻辑实现