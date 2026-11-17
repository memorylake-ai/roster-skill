# 还没装 Roster 桌面端时

`rosterctl version --json` 报「命令不存在」时按这里引导用户。**由用户自己下载、安装、打开**；你不要替他下载安装包并执行。

## 1. 下载

- 国际：<https://memorylake.ai/roster>
- 中国大陆：<https://memorylake.cn/roster>

支持 macOS（Apple 芯片与 Intel）和 Windows。

## 2. 安装与第一次打开

- macOS：打开下载的 `.dmg`，把 Roster 拖进「应用程序」，再从「应用程序」里打开。
  如果系统提示无法验证开发者，请用户在「系统设置 → 隐私与安全性」里点「仍要打开」。**不要**建议用命令去掉隔离属性。
- Windows：运行安装程序；如果出现 SmartScreen 提示，由用户自己决定是否「仍要运行」。

第一次打开会有引导，用户跟着做完即可（登录 MemoryLake 账号、选择大脑等）。

## 3. 让命令行能用 `rosterctl`

在桌面端左侧导航里打开「在 AI 中使用 Roster」，点「全部安装」：装好命令行工具，并把本技能装进检测到的 AI 工具。
如果「命令行工具」一行提示命令行还找不到它，点「加入 PATH」。完成后请用户**新开一个终端**（或重启你所在的 AI 工具），
然后回到 SKILL.md 的「第一步」重新运行 `rosterctl version --json`。

在新终端生效之前，可以直接用完整路径：macOS / Linux `~/.local/bin/rosterctl`，Windows `%LOCALAPPDATA%\Roster\bin\rosterctl.cmd`。

如果用户的桌面端版本里还没有这一页（老版本在「系统 → 连接 AI 工具」），请他先在「系统 → 自动更新」里升级到最新版。

## 桌面端页面的英文名（用户用英文界面时照这个说）

| 中文界面 | 英文界面 |
|---|---|
| 在 AI 中使用 Roster | Use Roster in AI tools |
| 全部安装 | Install all |
| 团队协作 | Teamwork |
| 本机数字员工协作 | Employee collaboration on this computer |
| 群聊（员工设置里） | Group chats |
| IM 接入 | IM accounts |
| 系统 → 自动更新 | System → Auto update |
