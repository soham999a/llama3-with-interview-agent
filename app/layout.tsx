import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InterviewHUB",
  description:
    "An AI-powered platform for preparing for mock interviews with LLAMA3",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ backgroundColor: "#e6f7fa" }}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <script src="/custom-colors.js" defer></script>
      </head>
      <body className={inter.className} style={{ backgroundColor: "#e6f7fa" }}>
        {children}
      </body>
    </html>
  );
}
