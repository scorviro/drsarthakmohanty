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
  metadataBase: new URL('https://drsarthakkumarmohanty.in'),
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
    url: "https://drsarthakkumarmohanty.in",
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
    canonical: "https://drsarthakkumarmohanty.in"
  }
};

const schemaData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Physician",
      "@id": "https://drsarthakkumarmohanty.in/#physician",
      "name": "Dr. Sarthak Kumar Mohanty",
      "image": "https://drsarthakkumarmohanty.in/dr-sarthak-hero.jpg",
      "url": "https://drsarthakkumarmohanty.in",
      "telephone": "+918238286706",
      "medicalSpecialty": "Oncologic",
      "description": "Dr. Sarthak Kumar Mohanty is a highly accomplished Senior Radiation Oncologist in Rajkot, specializing in precision cancer care, advanced radiotherapy technologies (SBRT, IMRT, VMAT, and IGRT).",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "HCG Cancer Centre, Ayodhya Chowk, 150 Feet Ring Road",
        "addressLocality": "Rajkot",
        "addressRegion": "Gujarat",
        "postalCode": "360005",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "22.3168",
        "longitude": "70.7749"
      },
      "alumniOf": {
        "@type": "EducationalOrganization",
        "name": "Acharya Harihar Regional Cancer Centre (AHRCC)"
      },
      "knowsAbout": [
        "Radiation Oncology",
        "Cancer Treatment",
        "Stereotactic Body Radiotherapy (SBRT)",
        "Intensity-Modulated Radiation Therapy (IMRT)",
        "Volumetric Modulated Arc Therapy (VMAT)",
        "Image-Guided Radiation Therapy (IGRT)",
        "Brachytherapy"
      ],
      "hospitalAffiliation": {
        "@type": "Hospital",
        "name": "HCG Cancer Centre, Rajkot",
        "url": "https://drsarthakkumarmohanty.in"
      },
      "priceRange": "$$",
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
          ],
          "opens": "09:00",
          "closes": "18:00"
        }
      ]
    },
    {
      "@type": "MedicalBusiness",
      "@id": "https://drsarthakkumarmohanty.in/#clinic",
      "name": "Dr. Sarthak Kumar Mohanty - Cancer Care",
      "image": "https://drsarthakkumarmohanty.in/og-image.jpg",
      "url": "https://drsarthakkumarmohanty.in",
      "telephone": "+918238286706",
      "logo": "https://drsarthakkumarmohanty.in/favicon.svg",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Ayodhya Chowk, 150 Feet Ring Road",
        "addressLocality": "Rajkot",
        "addressRegion": "Gujarat",
        "postalCode": "360005",
        "addressCountry": "IN"
      },
      "priceRange": "$$",
      "parentOrganization": {
        "@type": "MedicalOrganization",
        "name": "HCG Cancer Centre, Rajkot"
      }
    }
  ]
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
