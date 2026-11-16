#!/usr/bin/env node
// 契约测试：技能里写到的每条 rosterctl 命令与参数，在它声明的接口版本的契约里都要存在。
// 契约文件 contracts/rosterctl-api-<N>.json 来自 Roster 桌面端的 `rosterctl contract --json`。
// 用法：node scripts/check-contract.mjs [技能目录] [--contract <契约文件>] [--warn-only]
//   --contract：换一份契约（CI 用已发布版本的那份）；它的接口版本与技能要求的不同时只提示、不判失败
//   --warn-only：不符时只出 GitHub 警告、退出码 0（对照已发布版本：技能可以先于桌面端发版准备好）
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const flag = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv.splice(i, 2)[1] : undefined; };
const contractArg = flag("--contract");
const warnOnly = argv.includes("--warn-only") && argv.splice(argv.indexOf("--warn-only"), 1);
const skillDir = path.resolve(argv[0] || path.join(root, "skills", "roster"));

const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".md")) files.push(p);
  }
})(skillDir);

const skillMd = fs.readFileSync(path.join(skillDir, "SKILL.md"), "utf8");
const m = skillMd.match(/rosterctl 接口版本 (\d+)/);
if (!m) {
  console.error("SKILL.md 里要写明「需要 rosterctl 接口版本 N」");
  process.exit(1);
}
const api = Number(m[1]);
const contractFile = contractArg ? path.resolve(contractArg) : path.join(root, "contracts", `rosterctl-api-${api}.json`);
if (!fs.existsSync(contractFile)) {
  console.error(`缺少契约文件 ${path.relative(root, contractFile)}`);
  process.exit(1);
}
const contract = JSON.parse(fs.readFileSync(contractFile, "utf8"));
if (contract.api !== api) {
  const msg = `${path.relative(root, contractFile)} 里的接口版本是 ${contract.api}，技能要求 ${api}`;
  if (contractArg) {
    console.log(`::notice::${msg}：${contract.api > api ? "桌面端已有更新的接口，该更新技能了" : "技能领先于已发布的桌面端"}，不逐条对照`);
    process.exit(0);
  }
  console.error(msg);
  process.exit(1);
}
const commands = contract.commands;
const globalFlags = new Set(contract.globalFlags);

/** 从 Markdown 里取出所有 rosterctl 调用：代码块的每一行 + 行内代码 */
function invocations(text) {
  const out = [];
  const lines = text.split("\n");
  let inBlock = false;
  lines.forEach((line, i) => {
    if (/^\s*```/.test(line)) { inBlock = !inBlock; return; }
    const pieces = inBlock ? [line.replace(/#.*$/, "")] : [...line.matchAll(/`([^`]+)`/g)].map((x) => x[1]);
    for (const p of pieces) {
      const at = p.indexOf("rosterctl ");
      if (at >= 0) out.push({ line: i + 1, text: p.slice(at).trim() });
    }
  });
  return out;
}

/** 去掉占位符（<员工>、[<员工>]）后切词 */
function words(cmdline) {
  return cmdline.replace(/\[[^\]]*\]/g, " ").replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).slice(1);
}

let errors = 0, checked = 0;
for (const f of files) {
  for (const inv of invocations(fs.readFileSync(f, "utf8"))) {
    const w = words(inv.text);
    if (w.length === 0 || w[0].startsWith("-")) {
      for (const flag of w.filter((x) => x.startsWith("--")).map((x) => x.split("=")[0])) {
        if (!globalFlags.has(flag)) { console.error(`${path.relative(root, f)}:${inv.line} 不认识的全局参数 ${flag}：${inv.text}`); errors++; }
      }
      checked++;
      continue;
    }
    const pos = w.filter((x) => !x.startsWith("-"));
    let key = null;
    for (let n = Math.min(3, pos.length); n >= 1; n--) {
      const k = pos.slice(0, n).join(" ");
      if (commands[k]) { key = k; break; }
    }
    // 只写了组名（如 `schedule enable / disable / delete`）：每个都要存在
    if (!key && inv.text.includes(" / ")) {
      const head = pos[0];
      const subs = inv.text.split(/\s+/).filter((x) => /^[a-z]+$/.test(x) && x !== "rosterctl" && x !== head);
      const missing = subs.filter((s) => !commands[`${head} ${s}`]);
      if (subs.length && !missing.length) { checked++; continue; }
    }
    if (!key) { console.error(`${path.relative(root, f)}:${inv.line} 契约里没有这条命令：${inv.text}`); errors++; continue; }
    const allowed = new Set([...commands[key].flags, ...globalFlags]);
    for (const flag of w.filter((x) => x.startsWith("--")).map((x) => x.split("=")[0])) {
      if (!allowed.has(flag)) { console.error(`${path.relative(root, f)}:${inv.line} 「${key}」没有参数 ${flag}：${inv.text}`); errors++; }
    }
    checked++;
  }
}

if (errors) {
  const msg = `${errors} 处与契约（${path.relative(root, contractFile)}，接口版本 ${api}）不符`;
  if (warnOnly) {
    console.log(`::warning::${msg}：已发布的桌面端里还没有这些命令或参数，用户升级前用不了`);
    process.exit(0);
  }
  console.error(`\n${msg}`);
  process.exit(1);
}
console.log(`契约检查通过：${files.length} 个文件、${checked} 处 rosterctl 调用，对照接口版本 ${api}`);
