"use client";

import { defineCatalog } from "@json-render/core";
import { schema, defineRegistry } from "@json-render/react";
import { z } from "zod";

export const catalog = defineCatalog(schema, {
  components: {
    Card: {
      props: z.object({ title: z.string() }),
      description: "A card container",
    },
    Stack: {
      props: z.object({
        direction: z.enum(["vertical", "horizontal"]).default("vertical"),
        gap: z.enum(["sm", "md", "lg"]).default("md"),
      }),
      description: "Stack layout",
    },
    Grid: {
      props: z.object({ columns: z.number().default(2), gap: z.enum(["sm", "md"]).default("md") }),
      description: "Grid layout",
    },
    Heading: {
      props: z.object({ text: z.string(), level: z.number().default(2) }),
      description: "Heading text",
    },
    Text: {
      props: z.object({
        text: z.string(),
        size: z.enum(["sm", "md", "lg"]).default("md"),
        color: z.enum(["default", "muted"]).default("default"),
        weight: z.enum(["normal", "semibold"]).default("normal"),
      }),
      description: "Text block",
    },
    Badge: {
      props: z.object({ text: z.string() }),
      description: "Badge label",
    },
    Button: {
      props: z.object({ label: z.string(), action: z.string() }),
      description: "Clickable button",
    },
    Radio: {
      props: z.object({
        name: z.string(),
        options: z.array(z.object({ label: z.string(), value: z.string() })),
      }),
      description: "Radio group",
    },
    Separator: {
      props: z.object({}),
      description: "Horizontal separator",
    },
  },
  actions: {
    confirm: { description: "Confirm an action" },
    select_item: { description: "Select an item" },
    filter: { description: "Apply a filter" },
  },
});

const gapMap = { sm: "gap-1.5", md: "gap-3", lg: "gap-5" };
const sizeMap = { sm: "text-[13px] leading-5", md: "text-[15px] leading-6", lg: "text-lg leading-7" };

export const { registry } = defineRegistry(catalog, {
  components: {
    Card: ({ props, children }) => (
      <div className="space-y-3">
        <p className="text-[15px] font-semibold tracking-tight">{props.title}</p>
        {children}
      </div>
    ),
    Stack: ({ props, children }) => (
      <div className={`flex ${props.direction === "horizontal" ? "flex-row flex-wrap items-center" : "flex-col"} ${gapMap[props.gap || "md"]}`}>
        {children}
      </div>
    ),
    Grid: ({ props, children }) => (
      <div className={`grid grid-cols-${props.columns || 2} ${gapMap[props.gap || "md"]}`}>
        {children}
      </div>
    ),
    Heading: ({ props }) => (
      <p className="text-base font-semibold tracking-tight">{props.text}</p>
    ),
    Text: ({ props }) => (
      <p className={`${sizeMap[props.size || "md"]} ${props.color === "muted" ? "text-zinc-400" : "text-zinc-700 dark:text-zinc-300"} ${props.weight === "semibold" ? "font-medium" : ""}`}>
        {props.text}
      </p>
    ),
    Badge: ({ props }) => (
      <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 ring-1 ring-inset ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-700">
        {props.text}
      </span>
    ),
    Button: ({ props, emit }) => (
      <button
        onClick={() => emit("press")}
        className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-[13px] font-medium text-white shadow-sm transition-all hover:bg-zinc-700 active:scale-[0.97] dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {props.label}
      </button>
    ),
    Radio: ({ props }) => (
      <div className="flex flex-col gap-2">
        {props.options.map((opt: any) => (
          <label key={opt.value} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-[14px] text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50">
            <input type="radio" name={props.name} value={opt.value} className="h-4 w-4 accent-zinc-900 dark:accent-white" />
            {opt.label}
          </label>
        ))}
      </div>
    ),
    Separator: () => <hr className="border-zinc-100 dark:border-zinc-800" />,
  },
  actions: {
    confirm: async () => { alert("已确认！"); },
    select_item: async () => { alert("已选择！"); },
    filter: async () => { alert("已筛选！"); },
  },
});
