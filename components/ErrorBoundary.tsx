"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-xl border border-red-500/20 bg-red-500/5 p-8">
          <AlertCircle className="h-10 w-10 text-red-400" aria-hidden="true" />
          <div className="text-center">
            <h2 className="text-lg font-semibold text-text-primary">Something went wrong</h2>
            <p className="mt-1 text-sm text-text-secondary">
              {this.state.error?.message ?? "An unexpected error occurred."}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => this.setState({ hasError: false, error: null })}
            aria-label="Retry"
          >
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
