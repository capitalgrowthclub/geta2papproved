import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GetA2PApproved - Fast-Track Your A2P 10DLC Registration",
  description:
    "Get your A2P 10DLC campaign approved quickly. AI-powered privacy policy and terms & conditions generator built for A2P compliance.",
  openGraph: {
    title: "GetA2PApproved - Fast-Track Your A2P 10DLC Registration",
    description:
      "Get your A2P 10DLC campaign approved quickly. AI-powered privacy policy and terms & conditions generator built for A2P compliance.",
    url: "https://www.geta2papproved.com",
    siteName: "GetA2PApproved",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "GetA2PApproved" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GetA2PApproved - Fast-Track Your A2P 10DLC Registration",
    description:
      "Get your A2P 10DLC campaign approved quickly. AI-powered privacy policy and terms & conditions generator built for A2P compliance.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
