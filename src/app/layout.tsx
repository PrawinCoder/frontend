// app/layout.tsx
import "./globals.css";

 import type React from "react"
import { MantineProvider } from "@mantine/core";
import { ReactNode } from "react";
import "./globals.css"
import "@mantine/core/styles.css"
import "@mantine/dates/styles.css"
import { ColorSchemeScript } from "@mantine/core";
import { Metadata } from "next";
import { Footer } from "./footer";

export const metadata: Metadata = {
  title: "Job Portal",
  description: "Job portal built with Next.js, Mantine, and Supabase",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <head>
        <ColorSchemeScript />
        {/* Fontshare Satoshi */}
        
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-satoshi">
        <MantineProvider>
          {children}
           <Footer />
        </MantineProvider>
      </body>
    </html>
  );
}

