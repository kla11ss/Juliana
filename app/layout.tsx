import type { Metadata } from "next";
import { Manrope, Oswald, Prata } from "next/font/google";

import "@/app/globals.css";

const serifFont = Prata({
  subsets: ["cyrillic", "latin"],
  variable: "--font-serif",
  weight: ["400"]
});

const condensedFont = Oswald({
  subsets: ["cyrillic", "latin"],
  variable: "--font-condensed",
  weight: ["400", "500", "600", "700"]
});

const bodyFont = Manrope({
  subsets: ["cyrillic", "latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800"]
});

export const metadata: Metadata = {
  title: "Ulyana Goykhman — персональный менторинг",
  description:
    "Премиальный лендинг для заявок на персональный менторинг и консультацию Ульяны Гойхман.",
  metadataBase: new URL("http://localhost:3000")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={`${serifFont.variable} ${condensedFont.variable} ${bodyFont.variable}`}>
        {children}
      </body>
    </html>
  );
}
