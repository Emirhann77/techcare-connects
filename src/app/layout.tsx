import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TechCare Connects",
  description: "Peer-support platform for sharing company-specific experience.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased text-slate-800">{children}</body>
    </html>
  );
}
