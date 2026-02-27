import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import Script from "next/script";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/shared/lib/auth-context";
import { SWRProvider } from "@/shared/lib/swr-config";
import { StoreShell } from "@/shared/components/store-shell";
import { CookieBanner } from "@/features/legal/components/cookie-banner";
import { NewsletterModal } from "@/features/newsletter/components/newsletter-modal";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteTitle = "Ocaso — Iluminación de Autor";
const siteDescription =
  "Descubre lámparas diseñadas en 3D e impresas en PLA. Iluminación artesanal que transforma cada espacio en una declaración de elegancia moderna.";

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    siteName: "Ocaso",
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JJF66CEEMV"
          strategy="afterInteractive"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-JJF66CEEMV');`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""}>
          <SWRProvider>
            <AuthProvider>
              <Suspense>
                <StoreShell>{children}</StoreShell>
              </Suspense>
            </AuthProvider>
          </SWRProvider>
          <NewsletterModal />
          <CookieBanner />
          <Toaster position="bottom-right" richColors />
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
