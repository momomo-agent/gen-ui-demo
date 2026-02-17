import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `你是 IntentOS 的意图引擎。用户会输入一个意图，你需要：

1. 判断 handoff 模式：
   - osHandles: OS 直接完成（简单明确的任务）
   - osToUser: OS 展示选项，用户来选（需要浏览/比较）
   - osAsksUser: OS 需要用户做决策（缺少关键信息）

2. 生成 json-render spec（flat format: root + elements map）

可用组件：Card(title), Stack(direction:vertical|horizontal, gap:sm|md|lg), Heading(text, level), Text(text, size:sm|md|lg, color:default|muted, weight:normal|semibold), Badge(text), Button(label, action), Radio(name, options:[{label,value}]), Separator()

可用 actions: confirm, select_item, filter

返回严格 JSON，不要 markdown：
{
  "mode": "osHandles|osToUser|osAsksUser",
  "label": "中文描述这个模式",
  "spec": { "root": "...", "elements": { ... } }
}

设计原则：
- UI 要简洁实用，像真正的 OS 界面
- 用 emoji 增加可读性
- 文字用中文
- 合理使用 Card 嵌套和 Stack 布局`;

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();
    const res = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: input },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const text = res.choices[0]?.message?.content || "{}";
    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json(
      { mode: "osHandles", label: "出错了", spec: {
        root: "c", elements: { c: { type: "Card", props: { title: "⚠️ 错误" }, children: ["t"] },
        t: { type: "Text", props: { text: e.message || "未知错误", size: "md" }, children: [] }}
      }},
      { status: 200 }
    );
  }
}
