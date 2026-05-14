import type { Metadata } from "next";
import "@/styles/globals.css";
import { Providers } from "@/components/layout/providers";

export const metadata: Metadata = {
  title: {
    default: "AdPeriscope | AI Marketing Automation",
    template: "%s | AdPeriscope"
  },
  description:
    "AI-powered marketing automation for SEO research, competitor intelligence, audience pain points, and content strategy.",
  metadataBase: new URL("https://adperiscope.app"),
  openGraph: {
    title: "AdPeriscope",
    description: "Autonomous AI agents for startup-grade marketing intelligence.",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
