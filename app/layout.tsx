import type { Metadata } from "next";
import { Manrope, Space_Grotesk, Syne } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const syne = Syne({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-headline",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-label",
});

export const metadata: Metadata = {
  title: "Fluvoo | Claridad financiera para cada Dominicano",
  description: "Fluvoo te ayuda a entender y gestionar tu dinero con claridad y control.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${manrope.variable} ${syne.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="bg-neutral-50">{children}</body>
    </html>
  );
}
