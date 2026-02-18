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

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();
    const baseUrl = process.env.LLM_BASE_URL || "https://www.packyapi.com/v1";
    const apiKey = process.env.LLM_API_KEY!;
    const model = process.env.LLM_MODEL || "claude-opus-4-6";

    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        max_tokens: 2048,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: input },
        ],
      }),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(`API ${res.status}: ${json.error?.message || JSON.stringify(json).slice(0, 200)}`);
    }
    let text = (json.choices?.[0]?.message?.content || "").trim();
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
