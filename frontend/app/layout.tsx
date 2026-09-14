import type { Metadata } from "next";
import { Battambang, Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { LanguageTranslator } from "@/components/layout/language-translator";
import { AuthProvider } from "@/context/auth-context";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-serif",
  display: "swap",
});

const battambang = Battambang({
  subsets: ["khmer"],
  weight: ["400", "700", "900"],
  variable: "--font-battambang",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Aurelia Motors — Exceptional Performance & Luxury Vehicles",
    template: "%s | Aurelia Motors",
  },
  description: "A curated marketplace for exceptional performance and luxury vehicles. Inspected, verified, and prepared for the road ahead.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${plusJakarta.variable} ${playfair.variable} ${battambang.variable}`}
    >
      <body className="min-h-screen bg-[#fafaf9] text-[#111214] antialiased selection:bg-[#ef3f32] selection:text-white">
        <AuthProvider>
          <Navbar />
          <LanguageTranslator />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
