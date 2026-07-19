import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ServiceWorkerProvider } from "@/components/providers/service-worker-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const googleSansCode = localFont({
  src: "./fonts/google-sans-code-latin.woff2",
  variable: "--font-google-sans-code",
  weight: "300 800",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "TypeScript Playground",
  description: "A TypeScript and JavaScript playground.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TS Playground",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${googleSansCode.variable} antialiased`}
      >
        <NuqsAdapter>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </NuqsAdapter>
        <ServiceWorkerProvider />
      </body>
    </html>
  );
}
