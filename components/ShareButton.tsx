"use client";

import React, { useState } from "react";
import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  shareToken: string;
}

export function ShareButton({ shareToken }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? window.location.origin;
    const url = `${base}/s/${shareToken}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for browsers without clipboard API
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleShare}
      aria-label="Copy shareable link to clipboard"
      className="gap-2"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-emerald-400" />
          <span className="text-emerald-400">Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          Share
        </>
      )}
    </Button>
  );
}
