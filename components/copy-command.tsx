"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const COPIED_LABEL_MS = 2000;

export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  function selectCommand() {
    if (!codeRef.current) {
      return;
    }
    const selection = window.getSelection();
    selection?.removeAllRanges();
    const range = document.createRange();
    range.selectNodeContents(codeRef.current);
    selection?.addRange(range);
    if (typeof document.execCommand === "function") {
      document.execCommand("copy");
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      selectCommand();
    }
    setCopied(true);
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied(false), COPIED_LABEL_MS);
  }

  return (
    <div className="flex w-full items-center gap-3 rounded-xl border border-border bg-card/70 py-2.5 pr-2.5 pl-5 text-left font-mono text-base shadow-sm backdrop-blur sm:text-lg">
      <code ref={codeRef} className="min-w-0 flex-1 overflow-x-auto py-1 whitespace-nowrap">
        {command}
      </code>
      <button
        type="button"
        aria-label={copied ? "Copied" : "Copy install command"}
        onClick={copy}
        className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        {copied ? <Check className="size-5 text-accent" /> : <Copy className="size-5" />}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Copied" : ""}
      </span>
    </div>
  );
}
