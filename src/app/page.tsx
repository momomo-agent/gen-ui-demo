"use client";

import { useState } from "react";
import { Renderer } from "@json-render/react";
import { registry } from "./registry";
import { resolveIntent } from "./engine";

type HandoffMode = "osHandles" | "osToUser" | "osAsksUser";

const modeLabels: Record<HandoffMode, { text: string; color: string }> = {
  osHandles: { text: "OS 直接处理", color: "bg-green-100 text-green-800" },
  osToUser: { text: "OS → 你来选", color: "bg-blue-100 text-blue-800" },
  osAsksUser: { text: "OS 问你", color: "bg-amber-100 text-amber-800" },
};

interface Message {
  role: "user" | "os";
  text?: string;
  mode?: HandoffMode;
  label?: string;
  spec?: any;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    const data = resolveIntent(userMsg);
    setMessages((prev) => [
      ...prev,
      { role: "os", mode: data.mode, label: data.label, spec: data.spec },
    ]);
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-lg font-semibold">IntentOS · Generative UI Demo</h1>
        <p className="text-sm text-zinc-500">说出你的意图，OS 生成界面</p>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {messages.map((msg, i) =>
            msg.role === "user" ? (
              <div key={i} className="self-end rounded-2xl bg-zinc-900 px-4 py-2 text-white dark:bg-zinc-100 dark:text-zinc-900">
                {msg.text}
              </div>
            ) : (
              <div key={i} className="flex flex-col gap-2">
                {msg.mode && (
                  <span className={`self-start rounded-full px-3 py-1 text-xs font-medium ${modeLabels[msg.mode].color}`}>
                    {modeLabels[msg.mode].text}
                  </span>
                )}
                {msg.spec ? (
                  <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <Renderer spec={msg.spec} registry={registry} />
                  </div>
                ) : (
                  <div className="text-zinc-600">{msg.text}</div>
                )}
              </div>
            )
          )}
          {loading && (
            <div className="text-sm text-zinc-400">OS 思考中...</div>
          )}
        </div>
      </main>

      <form onSubmit={handleSubmit} className="border-t border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-2xl gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="说出你的意图... 试试「点个拿铁」「点外卖」「天气」「订会议室」"
            className="flex-1 rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
          >
            发送
          </button>
        </div>
      </form>
    </div>
  );
}
