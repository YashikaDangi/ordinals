import "./globals.css";
import type { Metadata } from "next";
import { Lato, Space_Grotesk } from "next/font/google";
import NextAuthSessionProvider from "./provider/sessionProvider";
import CustomProvider from "@/database/CustomProvider";

// Configure fonts
const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space",
  display: "swap",
});

// Metadata configuration
export const metadata: Metadata = {
  title: {
    template: "%s | Ordinsta",
    default: "Ordinsta - Explore & Trade Digital Artifacts",
  },
  description:
    "Discover, collect, and trade unique digital artifacts on Ordinsta. Join our community of collectors and creators.",
  keywords: [
    "digital artifacts",
    "NFT",
    "blockchain",
    "digital collectibles",
    "trading platform",
    "Ordinsta",
  ],
  authors: [{ name: "Ordinsta Team" }],
  creator: "Ordinsta",
  publisher: "Ordinsta",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

// Viewport configuration
export const viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  colorScheme: "dark",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${lato.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body
        className={`
          font-sans bg-[#0A0A0A] text-[#F0F0F0]
          min-h-screen antialiased
          selection:bg-purple-500/30 selection:text-purple-50
        `}
      >
        <NextAuthSessionProvider>
          <CustomProvider>
            {/* Skip to main content link for accessibility */}
            <a
              href="#main-content"
              className="
                sr-only focus:not-sr-only
                focus:fixed focus:top-4 focus:left-4
                px-4 py-2 bg-purple-500 text-white
                rounded-lg focus:outline-none focus:ring-2
                focus:ring-purple-500 focus:ring-offset-2
                focus:ring-offset-[#0A0A0A]
                z-50
              "
            >
              Skip to main content
            </a>

            <main id="main-content">{children}</main>
          </CustomProvider>
        </NextAuthSessionProvider>

        {/* Fallback for external scripts or widgets */}
        <div id="portal-root" />
      </body>
    </html>
  );
}
