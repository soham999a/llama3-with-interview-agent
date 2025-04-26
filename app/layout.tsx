import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./modern-styles.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LLAMA3 Interview Agent",
  description: "An AI-powered platform for preparing for mock interviews with LLAMA3",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
