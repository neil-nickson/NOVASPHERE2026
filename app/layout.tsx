import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";
import { SiteFooter } from "@/components/site-footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://novasphere-2026.vercel.app"),
  title: "Novasphere 2026 | Official Tech Event Website",
  description:
    "NovaSphere 2026 is an inter-college event at Sathyabama Institute of Science and Technology featuring Ideathon, Tech X Debate, Quantum Canvas, Tech Escape, Debug Dominion, and hands-on workshops.",
  keywords: [
    "NovaSphere 2026",
    "inter-college event",
    "Sathyabama",
    "Ideathon",
    "Tech X Debate",
    "Quantum Canvas",
    "Tech Escape",
    "Debug Dominion",
    "AI tools workshop",
    "web development workshop"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Novasphere 2026 | Official Tech Event Website",
    description:
      "Register for NovaSphere 2026 events and workshops at Sathyabama Institute of Science and Technology.",
    url: "https://novasphere-2026.vercel.app",
    siteName: "NovaSphere 2026",
    type: "website"
  },
  robots: {
    index: true,
    follow: true
  },
  verification: {
    google: "google7f6ada3c00a467d9"
  },
  icons: {
    icon: "/nova%20sphere%20logo.jpeg",
    shortcut: "/nova%20sphere%20logo.jpeg",
    apple: "/nova%20sphere%20logo.jpeg"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-dvh">
            <Navbar />
            <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}

