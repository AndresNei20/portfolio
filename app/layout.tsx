import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "./provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Andres Neira | Frontend Developer - Portfolio",
  keywords: [
    "Frontend Developer",
    "Portfolio",
    "React Developer",
    "JavaScript",
    "Next.js",
    "Web Development",
    "UI/UX",
    "Tech Stack",
    "Frontend Engineer",
    "Web Design",
    "Responsive Design",
    "JavaScript Mastery",
    "Modern Web",
    "Minimalist Portfolio",
    "Colombia Developer",
    "Andres Neira",
    "Web Portfolio",
    "Frontend Projects",
    "Web Applications",
    "Frontend Technologies",
    "Web Development Portfolio",
    "Frontend Skills",
    "Web Developer",
    "JavaScript Portfolio",
    "React Portfolio",
    "Next.js Portfolio",
    "Frontend Showcase",
    "Web Design Portfolio",
    "Frontend Expertise",
    "Web Development Showcase",
    "Frontend Development",
    "Web Development Skills",
    "Frontend Projects Showcase",
    "Web Development Colombia",
    "Andres Neira Portfolio",
  ],
  authors: [{ name: "Andres Neira" }],
  creator: "Andres Neira",
  description: "Modern & Minimal JS Mastery Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/jsm-logo.png" sizes="any" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
