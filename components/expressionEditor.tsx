"use client";

import React, { useMemo, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (v: string) => void;
  trackers: string[];
  className?: string;
};

export const ExpressionEditor: React.FC<Props> = ({
  value,
  onChange,
  trackers,
  className,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState(false);

  /* ---------------- Syntax Highlighting ---------------- */

  const highlighted = useMemo(() => {
    const escaped = value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Updated Regex:
    // 1. (\[[^\]]*\]?) -> Matches '[' followed by anything that isn't ']', and an optional closing ']'
    // This ensures '[' is visible and colored even while you are typing it.
    const tokenRegex = /(\[[^\]]*\]?)|(\b\d+(?:\.\d+)?\b)|([+\-*/^=])|([();])/g;

    const html = escaped.replace(tokenRegex, (match, g1, g2, g3, g4) => {
      // NOTE: Removed 'font-bold' because it breaks character width alignment
      if (g1) return `<span class="text-blue-500">${g1}</span>`;
      if (g2) return `<span class="text-orange-500">${g2}</span>`;
      if (g3) return `<span class="text-purple-500">${g3}</span>`;
      if (g4) return `<span class="text-emerald-500">${g4}</span>`;
      return match;
    });

    return html + (value.endsWith("\n") ? " " : "");
  }, [value]);

  /* ---------------- Handlers ---------------- */

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (preRef.current) {
      preRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  const handleChange = (v: string) => {
    onChange(v);
    const cursor = textareaRef.current?.selectionStart ?? 0;
    const match = v.slice(0, cursor).match(/\[([a-zA-Z0-9_]*)$/);

    if (match) {
      const q = match[1];
      const filtered = trackers.filter((t) =>
        t.toLowerCase().startsWith(q.toLowerCase()),
      );
      setSuggestions(filtered);
      setActiveIndex(0);
      setOpen(filtered.length > 0);
    } else {
      setOpen(false);
    }
  };

  const applySuggestion = (name: string) => {
    const ta = textareaRef.current;
    if (!ta) return;

    const pos = ta.selectionStart;
    const before = value.slice(0, pos).replace(/\[[^\[]*$/, `[${name}]`);
    const after = value.slice(pos);

    onChange(before + after);
    setOpen(false);

    setTimeout(() => {
      ta.selectionStart = ta.selectionEnd = before.length;
      ta.focus();
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i === 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      applySuggestion(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  // Shared geometric styles for perfect cursor alignment
  const sharedStyles: React.CSSProperties = {
    fontFamily:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontSize: "14px",
    lineHeight: "20px",
    padding: "12px",
    borderWidth: "1px",
    letterSpacing: "normal",
    tabSize: 4,
  };

  return (
    <div className={cn("relative rounded-md border bg-background", className)}>
      {/* Background Highlight Layer */}
      <pre
        ref={preRef}
        className="absolute inset-0 m-0 overflow-hidden whitespace-pre-wrap wrap-break-word border-transparent pointer-events-none text-foreground"
        style={sharedStyles} // REMOVED color: transparent
        aria-hidden
      >
        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>

      {/* Foreground Input Layer */}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onScroll={handleScroll}
        spellCheck={false}
        className={cn(
          "relative z-10 bg-transparent resize-none min-h-[120px]",
          "text-transparent caret-foreground focus-visible:ring-1 focus-visible:ring-ring border-none shadow-none",
        )}
        style={sharedStyles}
      />

      {/* Intellisense Dropdown */}
      {open && (
        <div
          className="absolute left-0 right-0 z-50 mt-1 max-h-48 overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-xl p-1"
          style={{ top: "100%" }}
        >
          {suggestions.map((s, i) => (
            <div
              key={s}
              onMouseDown={(e) => {
                e.preventDefault();
                applySuggestion(s);
              }}
              className={cn(
                "px-2 py-1.5 cursor-pointer text-xs rounded-sm",
                i === activeIndex
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-muted",
              )}
            >
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
