import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Regret Simulator — Model your decisions before you make them",
  description:
    "Simulate 3 diverging life trajectories 5 years into the future for any major decision. Powered by Claude.",
  openGraph: {
    title: "Regret Simulator",
    description: "What does each path actually look like in 5 years?",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
