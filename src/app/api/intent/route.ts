import { NextRequest, NextResponse } from "next/server";

// HandoffEngine mock: intent → handoff mode → json-render spec
type HandoffMode = "osHandles" | "osToUser" | "osAsksUser";

interface IntentResult {
  mode: HandoffMode;
  label: string;
  spec: { root: string; elements: Record<string, any> };
}

function resolveIntent(input: string): IntentResult {
  const lower = input.toLowerCase();

  if (lower.includes("拿铁") || lower.includes("咖啡") || lower.includes("latte")) {
    return {
      mode: "osHandles",
      label: "OS 直接处理",
      spec: {
        root: "card",
        elements: {
          card: {
            type: "Card",
            props: { title: "确认下单" },
            children: ["stack"],
          },
          stack: {
            type: "Stack",
            props: { direction: "vertical", gap: "md" },
            children: ["item", "price", "sep", "btn"],
          },
          item: {
            type: "Text",
            props: { text: "☕ 拿铁 Grande", size: "lg", weight: "semibold" },
            children: [],
          },
          price: {
            type: "Text",
            props: { text: "¥32.00", size: "md", color: "muted" },
            children: [],
          },
          sep: { type: "Separator", props: {}, children: [] },
          btn: {
            type: "Button",
            props: { label: "确认下单", action: "confirm" },
            children: [],
          },
        },
      },
    };
  }

  if (lower.includes("外卖") || lower.includes("吃") || lower.includes("food")) {
    return {
      mode: "osToUser",
      label: "OS 带到门口，你来选",
      spec: {
        root: "card",
        elements: {
          card: {
            type: "Card",
            props: { title: "附近外卖" },
            children: ["filters", "list"],
          },
          filters: {
            type: "Stack",
            props: { direction: "horizontal", gap: "sm" },
            children: ["f1", "f2", "f3"],
          },
          f1: { type: "Badge", props: { text: "全部" }, children: [] },
          f2: { type: "Badge", props: { text: "中餐" }, children: [] },
          f3: { type: "Badge", props: { text: "日料" }, children: [] },
          list: {
            type: "Stack",
            props: { direction: "vertical", gap: "md" },
            children: ["r1", "r2", "r3"],
          },
          r1: {
            type: "Card",
            props: { title: "🍜 兰州拉面" },
            children: ["r1d", "r1b"],
          },
          r1d: { type: "Text", props: { text: "4.8⭐ · 25min · ¥18起", size: "sm", color: "muted" }, children: [] },
          r1b: { type: "Button", props: { label: "查看菜单", action: "select_item" }, children: [] },
          r2: {
            type: "Card",
            props: { title: "🍣 寿司之神" },
            children: ["r2d", "r2b"],
          },
          r2d: { type: "Text", props: { text: "4.9⭐ · 35min · ¥58起", size: "sm", color: "muted" }, children: [] },
          r2b: { type: "Button", props: { label: "查看菜单", action: "select_item" }, children: [] },
          r3: {
            type: "Card",
            props: { title: "🍔 Shake Shack" },
            children: ["r3d", "r3b"],
          },
          r3d: { type: "Text", props: { text: "4.6⭐ · 20min · ¥45起", size: "sm", color: "muted" }, children: [] },
          r3b: { type: "Button", props: { label: "查看菜单", action: "select_item" }, children: [] },
        },
      },
    };
  }

  if (lower.includes("天气") || lower.includes("weather")) {
    return {
      mode: "osHandles",
      label: "OS 直接处理",
      spec: {
        root: "card",
        elements: {
          card: {
            type: "Card",
            props: { title: "明天天气" },
            children: ["stack"],
          },
          stack: {
            type: "Stack",
            props: { direction: "vertical", gap: "md" },
            children: ["temp", "grid"],
          },
          temp: {
            type: "Heading",
            props: { text: "☀️ 26°C 晴", level: 2 },
            children: [],
          },
          grid: {
            type: "Grid",
            props: { columns: 3, gap: "sm" },
            children: ["g1", "g2", "g3"],
          },
          g1: { type: "Text", props: { text: "💧 湿度 45%", size: "sm" }, children: [] },
          g2: { type: "Text", props: { text: "💨 风速 12km/h", size: "sm" }, children: [] },
          g3: { type: "Text", props: { text: "🌡️ 体感 28°C", size: "sm" }, children: [] },
        },
      },
    };
  }

  if (lower.includes("会议") || lower.includes("meeting") || lower.includes("订")) {
    return {
      mode: "osAsksUser",
      label: "OS 需要你选择",
      spec: {
        root: "card",
        elements: {
          card: {
            type: "Card",
            props: { title: "预订会议室" },
            children: ["q", "options", "btn"],
          },
          q: {
            type: "Text",
            props: { text: "选一个时间段：", size: "md", weight: "semibold" },
            children: [],
          },
          options: {
            type: "Radio",
            props: {
              name: "time",
              options: [
                { label: "10:00 - 11:00（3楼 A）", value: "10-11-3a" },
                { label: "14:00 - 15:00（5楼 B）", value: "14-15-5b" },
                { label: "16:00 - 17:00（3楼 C）", value: "16-17-3c" },
              ],
            },
            children: [],
          },
          btn: {
            type: "Button",
            props: { label: "确认预订", action: "confirm" },
            children: [],
          },
        },
      },
    };
  }

  // Fallback
  return {
    mode: "osHandles",
    label: "OS 理解中...",
    spec: {
      root: "card",
      elements: {
        card: {
          type: "Card",
          props: { title: "🤔" },
          children: ["t"],
        },
        t: {
          type: "Text",
          props: { text: `我还不太理解「${input}」，试试说"点个拿铁"、"点外卖"、"天气"或"订会议室"`, size: "md" },
          children: [],
        },
      },
    },
  };
}

export async function POST(req: NextRequest) {
  const { input } = await req.json();
  const result = resolveIntent(input);
  return NextResponse.json(result);
}
