import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { validateEnv } from "@/lib/env";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

// Validate environment variables on server startup (development only)
if (process.env.NODE_ENV === "development") {
  validateEnv();
}

export const metadata: Metadata = {
  title: "TerraTraks - AI-Powered Trip Planning",
  description: "Plan your perfect trip with AI-powered itinerary generation and expense tracking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        {children}
      </body>
    </html>
  );
}

