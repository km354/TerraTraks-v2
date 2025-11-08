import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { validateEnv } from "@/lib/env";
import Navigation from "@/components/Navigation";
import { app } from "@/lib/env";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

// Optimize font loading
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap', // Optimize font loading
  preload: true,
  variable: '--font-inter',
});

// Validate environment variables on server startup (development only)
if (process.env.NODE_ENV === "development") {
  validateEnv();
}

// Get app URL safely
function getAppUrl(): string {
  if (app.url && app.url !== 'http://localhost:3000') {
    return app.url.replace(/\/$/, '');
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/$/, '');
  }
  return 'https://terratraks.com';
}

const appUrl = getAppUrl();

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "TerraTraks - Plan Your National Park Adventure with AI",
    template: "%s | TerraTraks",
  },
  description: "Create personalized travel itineraries, predict crowd levels, generate packing lists, and track expenses. AI-powered trip planning for national parks and outdoor adventures.",
  keywords: ["travel planning", "AI itinerary", "national parks", "trip planner", "travel app", "adventure planning", "itinerary generator", "packing list", "crowd prediction"],
  authors: [{ name: "TerraTraks" }],
  creator: "TerraTraks",
  publisher: "TerraTraks",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: appUrl,
    siteName: "TerraTraks",
    title: "TerraTraks - AI-Powered Trip Planning",
    description: "Plan your perfect national park adventure with AI-powered itineraries, crowd predictions, and smart packing lists.",
    images: [
      {
        url: `${appUrl}/og-image.jpg`, // You'll need to create this
        width: 1200,
        height: 630,
        alt: "TerraTraks - AI-Powered Trip Planning",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TerraTraks - AI-Powered Trip Planning",
    description: "Plan your perfect national park adventure with AI-powered itineraries.",
    creator: "@terratraks",
    images: [`${appUrl}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add verification codes when you set up Google Search Console, etc.
    // google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <Navigation />
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  );
}

