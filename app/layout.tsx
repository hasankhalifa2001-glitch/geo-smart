import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/session-provider";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteDescription =
  "Professional land measurement and survey calculations for real estate — map plotting, geometric surveys, and localized units. | منصة قياس الأراضي والمساحات للعقارات والمسح الميداني — رسم الخرائط، الحسابات الهندسية، والوحدات المحلية.";

export const metadata: Metadata = {
  title: "GeoSmart — Land Measurement Platform",
  description: siteDescription,
  openGraph: {
    title: "GeoSmart — Land Measurement Platform",
    description: siteDescription,
    type: "website",
    locale: "en_US",
    alternateLocale: "ar_SA",
    siteName: "GeoSmart",
  },
  twitter: {
    card: "summary_large_image",
    title: "GeoSmart — Land Measurement Platform",
    description: siteDescription,
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "dark h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        montserrat.variable
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
