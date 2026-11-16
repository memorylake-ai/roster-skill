# 自动任务

自动任务让员工按时间、或在群里收到某类消息时，自己运行一段提示词并汇报结果。这是你最能帮上用户的地方：
表单里最难填的是时间规则、触发条件和汇报对象，而 `schedule validate` 会逐字段告诉你哪里不对。

## 写任务的循环

1. **找起点**，不要从空白写：
   - `rosterctl schedule presets --employee <员工> --json` 列出预设（日报、周复盘、告警分析……），`rosterctl schedule preset <员工> <预设 key> --json` 取出内容来改；
   - 或者 `rosterctl schedule show <员工> <任务 id> --json` 拿一个已有任务当样子。
2. 按用户的话改好，存成 JSON 文件。
3. **校验**：`rosterctl schedule validate <员工> --file task.json --json`。返回逐字段的错误、警告、只能人定的项，以及**接下来几次的运行时刻**。
   有错误就按提示改、再校验，直到没有错误。
4. **给用户确认**：用人话说清楚 —— 做什么、接下来几次分别在什么时候、汇报给谁、有哪些需要人在界面里定的项。
5. 用户同意后 `rosterctl schedule create <员工> --file task.json --json`（创建前会再自动校验一次）。
6. 想马上看效果：`rosterctl schedule run <员工> <任务 id> --json`（员工要在运行中），再用 `schedule show` 看这次运行的结果。不满意就改提示词，`schedule update` 只写要改的项。

## 规则（校验会报，但先知道能少走弯路）

- **最短间隔 10 分钟**：每次运行都会调用一次大脑，太频繁的规则会被拒。
- **时间规则**：支持重复规则（每天 / 工作日 / 每周几 …）、cron 表达式、一次性的时刻，以及「收到消息时运行」。以预设里的写法为准。
- **收到消息时运行**：只有部分 IM 平台支持（能读群里所有消息的那些）；不支持时校验会直接说。
- **汇报对象**：你建的任务只能汇报给主管。要发到群或别的人，告诉用户在界面里改。
- **权限**：任务的「可修改」「按主管交代运行」与指定工作文件夹只能人在界面里开。
- **运行时长**：一次运行有上限（默认 6 小时，可以按任务设）。

## 其他命令

- `rosterctl schedule list [<员工>] --json`：全部任务与最近一次运行
- `rosterctl schedule week --json`：一周的计划与实际运行
- `rosterctl schedule enable / disable / delete / cancel <员工> <任务 id> --json`
