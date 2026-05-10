import "./globals.css";

const siteUrl = "https://hanta.bandors.org";
const title = "HANTA.BANDORS.ORG | Live Virus Tracker";
const description =
  "Live Hantavirus tracker for MV Hondius and Andes virus reporting, with WHO status, mainstream news, world signals, timeline updates, and Polymarket odds.";

export const metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "HANTA.BANDORS.ORG",
  title,
  description,
  keywords: [
    "Hantavirus tracker",
    "Andes virus",
    "MV Hondius",
    "Hantavirus cruise ship",
    "WHO Hantavirus",
    "virus tracker",
    "Bandors"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "HANTA.BANDORS.ORG",
    title,
    description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "HANTA.BANDORS.ORG live virus tracker preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico"
  }
};

export const viewport = {
  width: 1240,
  initialScale: 0.31,
  maximumScale: 3,
  userScalable: true
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
