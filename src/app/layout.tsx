import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "@/shared/lib/auth-context";
import { SWRProvider } from "@/shared/lib/swr-config";
import { StoreShell } from "@/shared/components/store-shell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ocaso — Iluminación de Autor",
  description:
    "Descubre lámparas diseñadas en 3D e impresas en PLA. Iluminación artesanal que transforma cada espacio en una declaración de elegancia moderna.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SWRProvider>
          <AuthProvider>
            <Suspense>
              <StoreShell>{children}</StoreShell>
            </Suspense>
          </AuthProvider>
        </SWRProvider>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
