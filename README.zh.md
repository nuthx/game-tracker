<h1 align="center">ゲーム時計</h1>

<p align="center">
  <br />
  <p align="center">追踪并记录你的 PSN 游戏时间</p>
  <p align="center">
    <a href="./README.md">English</a>
    | 中文
  </p>
  <br />
</p>

## 📖 项目介绍

ゲーム時計用于追踪和记录你的 PSN 游戏时间。

借助第三方 API 支持，应用将自动获取当前游戏状态和游戏时长，并以图表形式呈现。

## ✨ 特色功能

- 自动记录 PSN 游戏时间
- 可视化展示游戏时间和统计信息（开发中）
- 支持导出 JSON 格式的游戏记录
- 快速部署到 Docker 或 Vercel

## 🚀 部署指南

（待补充）

## 🎮 使用教程

### 1. 获取 NPSSO

在浏览器中访问 [PlayStation](https://www.playstation.com/)，点击"登录"按钮，并使用 PSN 账户登录。

在新的选项卡中打开 [https://ca.account.sony.com/api/v1/ssocookie](https://ca.account.sony.com/api/v1/ssocookie)，浏览器将返回一个 JSON 相应，格式如下：

```
{ "npsso": "<64 character token>" }
```

此处 64 位字符即为你的 NPSSO。

### 2. 添加账号

使用默认账号 `admin` 与密码 `admin` 登录系统，登录状态将在本地 Cookie 中保存 30 天。

在设置中添加你的 NPSSO 并保存，系统会自动更新该用户资料，并在右侧显示头像与 ID 信息。

### 3. 追踪游戏记录

系统默认追踪登录用户自己的游戏时间。若要追踪其他用户的游戏时间，请在设置中的 PSN 账号处填入待追踪用户的 Account ID。

为降低资源消耗，你还可以调整更长的刷新间隔（默认为 1 分钟）。

## 📝 贡献与反馈

欢迎提交 Pull Request，请确保遵循项目的代码规范和提交规范。

想要添加更多功能，请在 Issues 中提出，将酌情添加。

如遇到程序错误，请在 Issues 中详细描述问题，以便重现和解决问题。

## 🙏 致谢

- [psn-api](https://github.com/achievements-app/psn-api) - 提供了第三方 PlayStation Network API 支持

## ⚠️ 免责声明

本项目代码仅供学习交流，不得用于商业用途。
