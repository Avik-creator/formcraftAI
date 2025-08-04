import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import { CLERK_APPEARANCE_CONFIG } from "@/utils/clerk";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "FormCraft AI",
    template: "%s | FormCraft AI",
  },
  description: "Want to create a form? FormCraft AI is here to help you generate forms with AI.",
  abstract: "Want to create a form? FormCraft AI is here to help you generate forms with AI.",
  creator: "Avik Mukherjee",
  metadataBase: new URL("https://formcraftai.avikmukherjee.me"),

  verification: {
    google: process.env.GOOGLE_VERIFICATION_ID
  },
  openGraph:{
    title: "FormCraft AI",
    description: "Want to create a form? FormCraft AI is here to help you generate forms with AI.",
    type: "website",
    locale: "en_US",
    siteName: "FormCraft AI",
    images:"https://formcraftai.avikmukherjee.me/og-image.png",
    countryName:"India",
    url:"https://formcraftai.avikmukherjee.me"
  },
  twitter:{
    card: "summary",
    creator: "Avik Mukherjee",
    site: "FormCraft AI",
    title: "FormCraft AI",
     images:"https://formcraftai.avikmukherjee.me/og-image.png",
    description: "Want to create a form? FormCraft AI is here to help you generate forms with AI.",

  },
  icons:{
    icon: "/logo.webp",
    shortcut: "/logo.webp",
    apple: "/logo.webp",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={CLERK_APPEARANCE_CONFIG}>
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
