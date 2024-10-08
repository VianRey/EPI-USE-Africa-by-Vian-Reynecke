import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "../app/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EPI-USE - Vian Reynecke",
  description:
    "Technical Assessment by Vian Reynecke, built with cutting-edge technologies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className} suppressHydrationWarning={true}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
