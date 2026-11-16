# 排查

先跑体检，**按返回里每一项的 `fix` 做**：

```bash
rosterctl doctor --json             # 整机：环境、引擎、IM 授权、模型服务
rosterctl doctor <员工> --json      # 再真查一次这名员工的大脑与授权（慢一些）
rosterctl employee logs <员工> --lines 200 --json
```

## 常见情况

| 现象 | 先看 | 怎么办 |
|---|---|---|
| `rosterctl` 退出码 4 | 桌面端没在跑 | `rosterctl up --json`，再重试 |
| 返回 `unauthorized` | 桌面端重启过，令牌换了 | 重新运行刚才的命令即可 |
| 员工不回消息 | `status` 里它的状态、`doctor <员工>` | 停止了就 `employee start`；IM 授权失效是需要人的事（`open` 打开重新登录）；大脑报错看下一行 |
| 大脑失败 / 模型连不上 | `doctor <员工>` 的大脑一项、`model test <模型>` | key 缺失或过期：需要人在界面里填；额度用完：告诉用户去充值或换模型 |
| 群里 @ 了不回 | `group list <员工>` 里这个群的规则 | 规则是忽略或没订阅：用 `group set` 改；平台不支持读该类消息时如实告诉用户 |
| 改了设置没生效 | 返回里的 `needRestart` | `employee restart <员工>` |
| 自动任务没跑 | `schedule show <员工> <任务 id>` 的最近运行 | 员工要在运行中、电脑不能睡眠；任务被停用就 `schedule enable` |
| 退出码 5 | 名字被占，或期间在别处改过 | 换个名字；或重新读一遍（`group list` / `schedule show`）再改 |

查不出来时，请用户在桌面端「系统」里导出诊断包，交给 Roster 的支持渠道。不要让用户把日志里的密钥发给你。
