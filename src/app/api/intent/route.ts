import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `你是 IntentOS 的意图引擎。用户输入意图，你返回严格 JSON（不要 markdown）：

1. 判断 handoff 模式：
   - osHandles: OS 直接完成（简单明确）
   - osToUser: OS 展示选项，用户来选（需要浏览/比较）
   - osAsksUser: OS 需要用户决策（缺关键信息）

2. 生成 json-render spec（flat format: root + elements map）

可用组件：Card(title), Stack(direction:vertical|horizontal, gap:sm|md|lg), Heading(text, level), Text(text, size:sm|md|lg, color:default|muted, weight:normal|semibold), Badge(text), Button(label, action), Radio(name, options:[{label,value}]), Separator()
可用 actions: confirm, select_item, filter

每个 element 必须有 type, props, children 三个字段！props 是对象。

示例：
{"mode":"osHandles","label":"OS 直接处理","spec":{"root":"c1","elements":{"c1":{"type":"Card","props":{"title":"☕ 确认"},"children":["t1","b1"]},"t1":{"type":"Text","props":{"text":"拿铁 ¥32","size":"md"},"children":[]},"b1":{"type":"Button","props":{"label":"确认","action":"confirm"},"children":[]}}}}

设计原则：简洁实用，用 emoji，中文`;

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();
    const res = await fetch(process.env.ANTHROPIC_BASE_URL + "/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-opus-4-6",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: input }],
      }),
    });
    const json = await res.json();
    let text = (json.content?.[0]?.text || "").trim();
    // Strip markdown code fences if present
    text = text.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
    return NextResponse.json(JSON.parse(text));
  } catch (e: any) {
    return NextResponse.json({
      mode: "osHandles", label: "出错了",
      spec: { root: "c", elements: {
        c: { type: "Card", props: { title: "⚠️" }, children: ["t"] },
        t: { type: "Text", props: { text: e.message || String(e), size: "md" }, children: [] },
      }},
    });
  }
}
