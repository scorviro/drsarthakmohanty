import type { Metadata } from "next";
import "./globals.css";
import SmoothScrolling from "@/components/SmoothScrolling";
import { LanguageProvider } from "@/lib/LanguageContext";
import { Lora, Inter } from "next/font/google";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://drsarthakmohanty.com'),
  title: {
    default: "Dr. Sarthak Kumar Mohanty | Premium Radiation Oncologist in Rajkot",
    template: "%s | Dr. Sarthak Kumar Mohanty"
  },
  description: "Specialized radiation oncology care at HCG Cancer Centre, Rajkot. 15+ years of experience in SBRT, IMRT, VMAT, and IGRT. Book your consultation today.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  keywords: ["Radiation Oncologist Rajkot", "Cancer Treatment Gujarat", "SBRT", "IMRT", "VMAT", "HCG Cancer Centre", "Dr. Sarthak Kumar Mohanty"],
  authors: [{ name: "Dr. Sarthak Kumar Mohanty" }],
  creator: "Dr. Sarthak Kumar Mohanty",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://drsarthakmohanty.com",
    title: "Dr. Sarthak Kumar Mohanty | Radiation Oncologist",
    description: "Specialized radiation oncology care at HCG Cancer Centre, Rajkot. 15+ years of experience.",
    siteName: "Dr. Sarthak Kumar Mohanty",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dr. Sarthak Kumar Mohanty - Premium Radiation Oncologist",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Dr. Sarthak Kumar Mohanty | Radiation Oncologist",
    description: "Specialized radiation oncology care at HCG Cancer Centre, Rajkot.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://drsarthakmohanty.com"
  }
};

const schemaData = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "name": "Dr. Sarthak Kumar Mohanty",
  "image": "https://drsarthakmohanty.com/og-image.jpg",
  "@id": "https://drsarthakmohanty.com",
  "url": "https://drsarthakmohanty.com",
  "telephone": "+919998290040",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Ayodhya Chowk, 150 Feet Ring Road",
    "addressLocality": "Rajkot",
    "addressRegion": "Gujarat",
    "postalCode": "360005",
    "addressCountry": "IN"
  },
  "medicalSpecialty": "Oncologic",
  "description": "Specialized radiation oncology care at HCG Cancer Centre, Rajkot. 15+ years of experience in SBRT, IMRT, VMAT, and IGRT."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="preconnect" href="https://maps.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://accounts.google.com" />
        <link rel="dns-prefetch" href="https://accounts.google.com" />
      </head>
      <body className={`${lora.variable} ${inter.variable} font-serif bg-[#FAFAFA] text-slate-900 antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
        <LanguageProvider>

          <SmoothScrolling>
            {children}
          </SmoothScrolling>
        </LanguageProvider>
      </body>
    </html>
  );
}
