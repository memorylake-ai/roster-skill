# 现成的做法

下面的员工、群、公司都是示例。每一步的命令都加 `--json`。

## 一名「运营助理」：在群里被 @ 时回答问题

1. 照 SKILL.md「新建员工」建好并启动。
2. `rosterctl group list <员工> --refresh --json` 找到目标群，确认规则是「被 @ 时回复」（默认就是）。
3. 给它开通记忆：`rosterctl memory enable <员工> --json`，让它记得以前聊过的事。
4. 告诉用户：去群里 @ 它问一句试试。

## 工作日日报

1. `rosterctl schedule presets --employee <员工> --json`，找 `jobs/daily-report`。
2. `rosterctl schedule preset <员工> jobs/daily-report --json` 取出内容，按用户要求改时间（比如工作日 18:00）和要写的内容。
3. 按 [schedules.md](schedules.md) 的循环校验、确认、创建；`schedule run` 试跑一次给用户看。

## 每周复盘

同上，预设是 `jobs/weekly-review`。复盘要对照的目标（OKR 等）写进提示词里；校验会提示周复盘对时间规则的要求。

## 群里收到告警时分析原因

1. 确认员工的平台支持「收到消息时运行」（`schedule validate` 会说）。
2. 预设 `jobs/alert-analysis`：触发条件写清楚是哪个群、什么样的消息（比如包含「告警」）。
3. 它要在业务代码里分析，需要指定工作文件夹 —— 这一项只能人在界面里选，告诉用户。

## 定时巡检（例如每天看一遍未合并的 PR）

1. 从一个已有任务或日报预设起步，把提示词改成巡检要做的事、写清楚要汇报的格式。
2. 时间规则别太密：最短 10 分钟，巡检一般每天一两次就够。
3. 校验、确认、创建、试跑。
