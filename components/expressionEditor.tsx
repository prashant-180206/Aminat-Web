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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState(false);

  /* ---------------- syntax highlighting ---------------- */

  const highlighted = useMemo(() => {
    let html = value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    html = html.replace(
      /\[([^\]]+)\]/g,
      `<span class="text-blue-500">[$1]</span>`
    );
    html = html.replace(
      /\b\d+(\.\d+)?\b/g,
      `<span class="text-orange-500">$&</span>`
    );
    html = html.replace(
      /[+\-*/^=]/g,
      `<span class="text-purple-500">$&</span>`
    );
    html = html.replace(/[();]/g, `<span class="text-emerald-500">$&</span>`);

    return html + "&nbsp;";
  }, [value]);

  /* ---------------- input handling ---------------- */

  const handleChange = (v: string) => {
    onChange(v);

    const match = v
      .slice(0, textareaRef.current?.selectionStart ?? 0)
      .match(/\[([a-zA-Z0-9_]*)$/);

    if (match) {
      const q = match[1];
      const filtered = trackers.filter((t) => t.startsWith(q));
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

    const next = before + after;
    onChange(next);
    setOpen(false);

    requestAnimationFrame(() => {
      ta.selectionStart = ta.selectionEnd = before.length;
      ta.focus();
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i === 0 ? suggestions.length - 1 : i - 1));
    }
    if (e.key === "Enter") {
      e.preventDefault();
      applySuggestion(suggestions[activeIndex]);
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  /* ---------------- render ---------------- */

  return (
    <div className={cn("relative font-mono text-sm", className)}>
      {/* Highlight layer */}
      <pre
        className="pointer-events-none absolute inset-0 p-2 whitespace-pre-wrap wrap-break-word text-transparent"
        aria-hidden
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />

      {/* Input */}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="relative bg-transparent font-mono resize-none"
        rows={4}
        spellCheck={false}
      />

      {/* Intellisense */}
      {open && (
        <div className="absolute z-10 mt-1 w-48 rounded border bg-popover shadow">
          {suggestions.map((s, i) => (
            <div
              key={s}
              onMouseDown={() => applySuggestion(s)}
              className={cn(
                "px-2 py-1 cursor-pointer",
                i === activeIndex && "bg-accent"
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
