# HowToGo | 问道 —— 官方网站与 Wiki

本仓库是 [HowToGo | 问道](https://howtogo.dongsz.top) 官方网站与 Wiki 的**源仓库**。站点为纯静态页面（HTML + CSS + 原生 JavaScript），没有构建步骤；线上服务器直接从本仓库拉取内容对外提供访问。

## 目录结构

```
.
├── index.html          # 站点首页
├── features.html       # 功能介绍页
├── wiki/               # Wiki 文档（安装、道路、导航、显示、交通、创作、配置等）
│   ├── index.html      # Wiki 首页 / 目录
│   ├── install.html    # 安装与版本
│   ├── roads.html      # 道路系统
│   ├── navigate.html   # 导航
│   ├── display.html    # 显示与信息
│   ├── webmap.html     # 浏览器地图（/howtogo webmap）
│   ├── transit.html    # 公共交通
│   ├── create.html     # 内容创作（机械动力铁路）
│   ├── roadweaver.html # 阡陌交通只读图层
│   ├── mtr.html        # MTR 集成
│   ├── config.html     # 配置项
│   ├── migrate.html    # 迁移地图数据（改名 / 换地址 / 换电脑）
│   ├── faq.html        # 常见问题
│   └── changelog.html  # 更新日志
├── assets/             # 静态资源
│   ├── css/site.css    # 全站样式
│   ├── js/site.js      # 全站脚本
│   └── img/            # logo 等图片资源
└── README.md           # 本文件
```

> `wiki/` 下的页面会随模组版本迭代增补，以仓库当前内容为准。

## 服务器部署：改仓库即改网页

线上 `https://howtogo.dongsz.top` 由一台 nginx 服务器提供（宝塔面板，站点根目录 `/www/wwwroot/howtogo`），它**以本仓库 `main` 分支为唯一内容来源**：

- 克隆放在 `/www/wwwroot/howtogo-src`（保留 `.git`，不对外）；
- 同步脚本 `/www/server/howtogo-sync.sh` 执行 `git fetch` + `git reset --hard origin/main`，再用 `rsync --delete` 把工作区同步到网站根目录（排除 `.git`，保留面板生成的 `.user.ini`/`.htaccess`/`404.html`）；
- 宝塔计划任务 `howtogo-site-sync` 每 **5 分钟**执行一次该脚本，所以往 `main` 推送后最多 5 分钟线上就会更新；
- 静态站点，无需重启任何服务，也无需构建。

手动立即更新（服务器上执行）：

```bash
bash /www/server/howtogo-sync.sh
```

同步记录写在 `/www/wwwroot/howtogo-sync.log`（只在确实有提交更新时追加一行）。

## 本地预览

不依赖任何工具，直接用浏览器打开 `index.html` 即可浏览。若想要更接近线上的行为（相对路径、缓存等），可用任意静态服务器：

```bash
python -m http.server 8000
# 浏览器访问 http://localhost:8000/
```

## 内容归属与许可

- 站点文案、文档与代码：© HowToGo | 问道 项目组。
- 除另有说明外，本仓库内容采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh)（署名—非商业性使用—相同方式共享）许可；转载请注明出处并以相同方式共享。
- 站内提及的第三方模组、软件与商标（如 Minecraft、MTR 等）归各自权利人所有。

## 贡献

欢迎通过 Issue 反馈问题，或提交 Pull Request 修正文档。提交前请确认页面仍是可直接打开的纯静态页面，并检查站内链接有效。
