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

const gapMap = { sm: "gap-1", md: "gap-3", lg: "gap-5" };
const sizeMap = { sm: "text-sm", md: "text-base", lg: "text-lg" };

export const { registry } = defineRegistry(catalog, {
  components: {
    Card: ({ props, children }) => (
      <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-700">
        <h3 className="mb-2 font-semibold">{props.title}</h3>
        {children}
      </div>
    ),
    Stack: ({ props, children }) => (
      <div className={`flex ${props.direction === "horizontal" ? "flex-row flex-wrap" : "flex-col"} ${gapMap[props.gap || "md"]}`}>
        {children}
      </div>
    ),
    Grid: ({ props, children }) => (
      <div className={`grid grid-cols-${props.columns || 2} ${gapMap[props.gap || "md"]}`}>
        {children}
      </div>
    ),
    Heading: ({ props }) => (
      <h2 className="text-2xl font-bold">{props.text}</h2>
    ),
    Text: ({ props }) => (
      <p className={`${sizeMap[props.size || "md"]} ${props.color === "muted" ? "text-zinc-500" : ""} ${props.weight === "semibold" ? "font-semibold" : ""}`}>
        {props.text}
      </p>
    ),
    Badge: ({ props }) => (
      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium dark:bg-zinc-800">
        {props.text}
      </span>
    ),
    Button: ({ props, emit }) => (
      <button
        onClick={() => emit("press")}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {props.label}
      </button>
    ),
    Radio: ({ props }) => (
      <div className="flex flex-col gap-2">
        {props.options.map((opt: any) => (
          <label key={opt.value} className="flex items-center gap-2 text-sm">
            <input type="radio" name={props.name} value={opt.value} className="accent-zinc-900" />
            {opt.label}
          </label>
        ))}
      </div>
    ),
    Separator: () => <hr className="border-zinc-200 dark:border-zinc-700" />,
  },
  actions: {
    confirm: async () => { alert("已确认！"); },
    select_item: async () => { alert("已选择！"); },
    filter: async () => { alert("已筛选！"); },
  },
});
