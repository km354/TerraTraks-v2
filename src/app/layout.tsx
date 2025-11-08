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
  title: "TerraTraks - Plan Your National Park Adventure with AI",
  description: "Create personalized travel itineraries, predict crowd levels, generate packing lists, and track expenses. AI-powered trip planning for national parks and outdoor adventures.",
  keywords: ["travel planning", "AI itinerary", "national parks", "trip planner", "travel app", "adventure planning"],
  openGraph: {
    title: "TerraTraks - AI-Powered Trip Planning",
    description: "Plan your perfect national park adventure with AI-powered itineraries",
    type: "website",
  },
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

