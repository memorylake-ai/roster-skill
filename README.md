# Roster Skill

让 Claude Code、Codex、OpenCode 等 AI 工具帮你搭建和管理 [Roster](https://memorylake.ai/roster) 数字员工。

The AI skill for [Roster](https://memorylake.ai/roster), the desktop app that runs AI digital employees on your own computer.
With it, your AI coding tool can check status, create and run employees, connect IM accounts, set group reply rules,
manage skills and memory, and write and validate scheduled tasks — all through the `rosterctl` command that ships with Roster.

## 它能做什么

- 看全貌与体检：哪些员工在线、哪里需要处理、怎么修
- 从零搭一名员工：选 IM 账号、大脑和模型，建好、启动、体检
- 写自动任务：日报、周复盘、定时巡检、群里收到告警时分析 —— 写完先校验，把接下来几次的运行时刻给你确认
- 设置群聊回应、开关技能、开通记忆

需要密钥、扫码授权、放开权限的事，AI 不会经手：它会让 Roster 桌面端打开对应页面，由你来完成。

## 前提

1. 安装 Roster 桌面端：[memorylake.ai/roster](https://memorylake.ai/roster)（中国大陆：[memorylake.cn/roster](https://memorylake.cn/roster)）。
2. 在桌面端「系统 → 连接 AI 工具」里把 `rosterctl` 加到命令行；终端里 `rosterctl version` 能运行即可。

## 安装

**Claude Code**

```
/plugin marketplace add memorylake-ai/roster-skill
/plugin install roster@roster
```

**Codex**

```bash
git clone https://github.com/memorylake-ai/roster-skill.git
mkdir -p ~/.codex/skills && cp -R roster-skill/skills/roster ~/.codex/skills/
```

**OpenCode**

```bash
git clone https://github.com/memorylake-ai/roster-skill.git
mkdir -p ~/.config/opencode/skills && cp -R roster-skill/skills/roster ~/.config/opencode/skills/
```

OpenCode 也会读 `~/.claude/skills/`，已经给 Claude Code 手动装过的可以不再装。

**其他支持 Agent Skills 的工具**：把 `skills/roster/` 整个目录放到该工具的技能目录里。

装好后，在 AI 工具里直接说「帮我建一个每个工作日 18 点写日报的数字员工」之类的话即可。

## 版本对齐

技能在 `SKILL.md` 里写明需要的 **rosterctl 接口版本**。`contracts/rosterctl-api-<N>.json` 是该版本的接口契约（来自 `rosterctl contract --json`）；
CI 用 `scripts/check-contract.mjs` 检查技能里写到的每条命令、每个参数都在契约里。

## License

Apache-2.0
