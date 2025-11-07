import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { validateEnv } from "@/lib/env";

const inter = Inter({ subsets: ["latin"] });

// Validate environment variables on server startup (development only)
if (process.env.NODE_ENV === "development") {
  validateEnv();
}

export const metadata: Metadata = {
  title: "TerraTraks",
  description: "TerraTraks application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

