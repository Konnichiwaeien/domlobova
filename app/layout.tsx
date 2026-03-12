import type { Metadata } from "next";
import { Manrope, Sofia_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Metrika } from "./components/metrika";
import { Suspense } from "react";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
});

const sofia = Sofia_Sans({
  variable: "--font-sofia",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Дом милосердия кузнеца Лобова",
  description: "Официальный сайт Дома милосердия кузнеца Лобова",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${sofia.variable} antialiased`}
      >
        <Script
          src="https://widget.cloudpayments.ru/bundles/cloudpayments.js"
          strategy="beforeInteractive"
        />
        {children}
        <Suspense fallback={null}>
          <Metrika />
        </Suspense>
      </body>
    </html>
  );
}
