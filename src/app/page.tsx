"use client";

import { useState } from "react";
import { Renderer } from "@json-render/react";
import { JSONUIProvider } from "@json-render/react";
import { registry } from "./registry";
import { resolveIntent } from "./engine";

type HandoffMode = "osHandles" | "osToUser" | "osAsksUser";

const modeLabels: Record<HandoffMode, { text: string; color: string }> = {
  osHandles: { text: "OS 直接处理", color: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  osToUser: { text: "OS → 你来选", color: "bg-sky-50 text-sky-700 ring-sky-200" },
  osAsksUser: { text: "OS 问你", color: "bg-amber-50 text-amber-700 ring-amber-200" },
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);
    try {
      const res = await fetch("/api/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: userMsg }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "os", mode: data.mode, label: data.label, spec: data.spec }]);
    } catch {
      const data = resolveIntent(userMsg);
      setMessages((prev) => [...prev, { role: "os", mode: data.mode, label: data.label, spec: data.spec }]);
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa] dark:bg-zinc-950">
      <header className="sticky top-0 z-10 border-b border-zinc-200/80 bg-white/80 px-6 py-4 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/80">
        <h1 className="text-[17px] font-semibold tracking-tight">IntentOS</h1>
        <p className="text-[13px] text-zinc-400">说出你的意图，OS 生成界面</p>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-8">
        <div className="mx-auto flex max-w-xl flex-col gap-5">
          {messages.map((msg, i) =>
            msg.role === "user" ? (
              <div key={i} className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-br-md bg-zinc-900 px-4 py-2.5 text-[15px] text-white dark:bg-zinc-100 dark:text-zinc-900">
                  {msg.text}
                </div>
              </div>
            ) : (
              <div key={i} className="flex flex-col gap-2">
                {msg.mode && (
                  <span className={`self-start rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${modeLabels[msg.mode].color}`}>
                    {msg.label || modeLabels[msg.mode].text}
                  </span>
                )}
                {msg.spec && (
                  <div className="rounded-2xl rounded-tl-md border border-zinc-200/60 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:border-zinc-700/60 dark:bg-zinc-900 dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
                    <JSONUIProvider registry={registry}>
                      <Renderer spec={msg.spec} registry={registry} />
                    </JSONUIProvider>
                  </div>
                )}
              </div>
            )
          )}
          {loading && (
            <div className="flex items-center gap-2 text-[13px] text-zinc-400">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-300" />
              OS 思考中...
            </div>
          )}
        </div>
      </main>

      <form onSubmit={handleSubmit} className="sticky bottom-0 border-t border-zinc-200/80 bg-white/80 px-4 py-4 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/80">
        <div className="mx-auto flex max-w-xl gap-2.5">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="说出你的意图..."
            className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-[15px] outline-none transition-colors placeholder:text-zinc-300 focus:border-zinc-400 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:bg-zinc-800"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-zinc-900 px-5 py-3 text-[14px] font-medium text-white shadow-sm transition-all hover:bg-zinc-700 active:scale-[0.97] disabled:opacity-40 dark:bg-white dark:text-zinc-900"
          >
            发送
          </button>
        </div>
      </form>
    </div>
  );
}
