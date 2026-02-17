import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `你是 IntentOS 的意图引擎。用户输入意图，你返回 JSON：

1. 判断 handoff 模式：
   - osHandles: OS 直接完成（简单明确）
   - osToUser: OS 展示选项，用户来选（需要浏览/比较）
   - osAsksUser: OS 需要用户决策（缺关键信息）

2. 生成 json-render spec（flat format: root + elements map）

可用组件：Card(title), Stack(direction:vertical|horizontal, gap:sm|md|lg), Heading(text, level), Text(text, size:sm|md|lg, color:default|muted, weight:normal|semibold), Badge(text), Button(label, action), Radio(name, options:[{label,value}]), Separator()

可用 actions: confirm, select_item, filter

返回严格 JSON：
{"mode":"osHandles|osToUser|osAsksUser","label":"中文描述","spec":{"root":"...","elements":{...}}}

设计原则：简洁实用，用 emoji，中文，合理嵌套 Card+Stack`;

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();
    const res = await fetch(process.env.OPENAI_BASE_URL + "/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: input },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    });
    const json = await res.json();
    const text = json.choices?.[0]?.message?.content || "{}";
    return NextResponse.json(JSON.parse(text));
  } catch (e: any) {
    return NextResponse.json({
      mode: "osHandles", label: "出错了",
      spec: { root: "c", elements: {
        c: { type: "Card", props: { title: "⚠️" }, children: ["t"] },
        t: { type: "Text", props: { text: e.message || "未知错误", size: "md" }, children: [] },
      }},
    });
  }
}
