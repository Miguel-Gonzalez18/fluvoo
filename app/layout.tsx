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
  title: {
    default: "Fluvoo | Claridad financiera para cada Dominicano",
    template: "%s | Fluvoo"
  },
  description: "Fluvoo te ayuda a entender y gestionar tu dinero con claridad y control. La mejor herramienta financiera para dominicanos.",
  keywords: [
    "finanzas personales",
    "gestión de dinero", 
    "finanzas República Dominicana",
    "control de gastos",
    "ahorro",
    "inversión",
    "presupuesto",
    "app financiera"
  ],
  authors: [{ name: "Fluvoo Team" }],
  creator: "Fluvoo",
  publisher: "Fluvoo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://fluvoo.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_DO',
    url: 'https://fluvoo.com',
    title: 'Fluvoo | Claridad financiera para cada Dominicano',
    description: 'Fluvoo te ayuda a entender y gestionar tu dinero con claridad y control. La mejor herramienta financiera para dominicanos.',
    siteName: 'Fluvoo',
    images: [
      {
        url: '/logo.svg',
        width: 1200,
        height: 630,
        alt: 'Fluvoo - Claridad financiera para cada Dominicano',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fluvoo | Claridad financiera para cada Dominicano',
    description: 'Fluvoo te ayuda a entender y gestionar tu dinero con claridad y control. La mejor herramienta financiera para dominicanos.',
    images: ['/logo.svg'],
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
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/site.webmanifest',
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
