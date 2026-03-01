import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  metadataBase: new URL("https://www.geta2papproved.com"),
  title: "GetA2PApproved - AI Tool That Generates Your A2P 10DLC Compliance Documents",
  description:
    "Stop getting rejected. GetA2PApproved generates the exact privacy policy, terms & conditions, and submission language you need to get your A2P 10DLC campaign approved by carriers.",
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "GetA2PApproved - AI Tool That Generates Your A2P 10DLC Compliance Documents",
    description:
      "Stop getting rejected. GetA2PApproved generates the exact privacy policy, terms & conditions, and submission language you need to get your A2P 10DLC campaign approved by carriers.",
    url: "https://www.geta2papproved.com",
    siteName: "GetA2PApproved",
    images: [{ url: "https://www.geta2papproved.com/og-image.png", width: 1200, height: 630, alt: "GetA2PApproved" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GetA2PApproved - AI Tool That Generates Your A2P 10DLC Compliance Documents",
    description:
      "Stop getting rejected. GetA2PApproved generates the exact privacy policy, terms & conditions, and submission language you need to get your A2P 10DLC campaign approved by carriers.",
    images: ["https://www.geta2papproved.com/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script id="gtm-head" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WKLVV8MW');`}</Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WKLVV8MW"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
