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
  keywords: [
    "Radiation Oncologist Rajkot",
    "Cancer Treatment Gujarat",
    "SBRT",
    "IMRT",
    "VMAT",
    "HCG Cancer Centre",
    "Sarthak Mohanty",
    "Dr. Sarthak Kumar Mohanty",
    "Dr. Sarthak Mohanty",
    "Dr Sarthak Mohanty",
    "Dr. Sarthak Kumar Mohanty oncologist",
    "drsarthakkumarmohanty",
    "drsarthakmohanty"
  ],
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
      "alternateName": [
        "Dr. Sarthak Mohanty",
        "Dr Sarthak Mohanty",
        "Dr. Sarthak Kumar Mohanty",
        "Sarthak Mohanty"
      ],
      "image": "https://drsarthakkumarmohanty.in/dr-sarthak-hero.jpg",
      "url": "https://drsarthakkumarmohanty.in",
      "telephone": "+918238286706",
      "medicalSpecialty": "Oncologic",
      "description": "Dr. Sarthak Kumar Mohanty is a highly accomplished Senior Radiation Oncologist in Rajkot, specializing in precision cancer care, advanced radiotherapy technologies (SBRT, IMRT, VMAT, and IGRT).",
      "sameAs": [
        "https://www.linkedin.com/in/dr-sarthak-kumar-mohanty",
        "https://www.practo.com/rajkot/doctor/dr-sarthak-kumar-mohanty",
        "https://www.justdial.com/Rajkot/Dr-Sarthak-Kumar-Mohanty-Gandhigram/0281PX281-X281-220716172605-B9E4_BZDET",
        "https://www.facebook.com/sarthak.mohanty"
      ],
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
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "34",
        "bestRating": "5"
      },
      "review": [
        {
          "@type": "Review",
          "author": { "@type": "Person", "name": "haresh talatia" },
          "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
          "reviewBody": "For my father's cancer treatment by the grace of God we reached to Dr.Mohanty Sir, were he treated my father very patiently, kindly, thoroughly, and accurately and made my father cancer free."
        },
        {
          "@type": "Review",
          "author": { "@type": "Person", "name": "Bhavesh Soni" },
          "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
          "reviewBody": "My relative rameshbhai barbhaya need treatment so we reached at dr sarthakji who is very good doctor with have pure heart toward patients and the way dr help us its feel like we are blessed."
        },
        {
          "@type": "Review",
          "author": { "@type": "Person", "name": "Ashish Jobanputra" },
          "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
          "reviewBody": "Dr. Sarthak has treated my 12 year old daughter. He made her comfortable during radiation. Very supportive and helpful in nature with great knowledge."
        }
      ],
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
