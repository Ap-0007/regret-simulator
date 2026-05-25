"use client";

import React, { useState, useRef, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

interface TagInputProps {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  error?: string;
  id?: string;
}

export function TagInput({
  values,
  onChange,
  placeholder = "Type and press Enter",
  maxTags = 8,
  error,
  id,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function addTag(raw: string) {
    const tag = raw.trim().slice(0, 50);
    if (!tag || values.includes(tag) || values.length >= maxTags) return;
    onChange([...values, tag]);
    setInputValue("");
  }

  function removeTag(tag: string) {
    onChange(values.filter((v) => v !== tag));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && values.length > 0) {
      removeTag(values[values.length - 1]);
    }
  }

  return (
    <div>
      <div
        className={cn(
          "flex min-h-[44px] w-full flex-wrap gap-1.5 rounded-md border bg-surface-2 px-3 py-2",
          "cursor-text focus-within:ring-2 focus-within:ring-amber-500 focus-within:ring-offset-2 focus-within:ring-offset-background",
          error ? "border-red-500" : "border-border"
        )}
        onClick={() => inputRef.current?.focus()}
        role="group"
        aria-label="Values tag input"
      >
        {values.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-300 border border-amber-500/30"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              className="ml-0.5 rounded-full p-0.5 hover:bg-amber-500/20 focus:outline-none focus:ring-1 focus:ring-amber-500"
              aria-label={`Remove ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => { if (inputValue.trim()) addTag(inputValue); }}
          placeholder={values.length === 0 ? placeholder : values.length < maxTags ? "Add another…" : ""}
          disabled={values.length >= maxTags}
          className="min-w-[120px] flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none disabled:cursor-not-allowed"
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </div>
      <p className="mt-1 text-xs text-text-muted">
        Press Enter or comma to add · {values.length}/{maxTags} values
      </p>
    </div>
  );
}
