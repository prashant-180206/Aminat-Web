import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProviders } from "../hooks/providers";

export const metadata: Metadata = {
  title: "Animat - Math",
  description: "Animation Framework for mathematical animations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      > */}
      <body className={`dark`}>
        <AuthProviders>
          <Toaster duration={2000} />
          {children}
        </AuthProviders>
      </body>
    </html>
  );
}
