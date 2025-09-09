import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Import the ConnectKitProvider configuration (exported as ParticleConnectKit)
import { ParticleConnectkit } from "./components/connectkit";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ultimate chain agnostic dApp",
  description: "open source dApp built with Particle Network",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ParticleConnectkit>{children}</ParticleConnectkit>
      </body>
    </html>
  );
}
