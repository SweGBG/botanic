import type { Metadata, Viewport } from "next";
import "@fontsource/cormorant-garamond/300.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/300-italic.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/dm-sans/300.css";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "./globals.css";
import { LangProvider } from "@/components/Lang";
import Motion from "@/components/Motion";
import Nav from "@/components/Nav";
import { CartProvider } from "@/components/Cart";
import { Footer } from "@/components/Sections";

export const metadata: Metadata = {
  title: "Botanicatural — Botanisk & naturlig hudvård",
  description: "Ren hudvård formulerad med certifierat ekologiska växtextrakt. Noll kompromisser.",
};

export const viewport: Viewport = { themeColor: "#0b0e0a" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv" className="crintro-wait" suppressHydrationWarning>
      <body>
        <noscript>
          <style>{`.crintro-loader{display:none!important}html.crintro-wait{overflow:auto}html.crintro-wait [data-crintro-hold],html.crintro-wait [data-crintro-hold] *{animation-play-state:running!important}`}</style>
        </noscript>
        <LangProvider>
          <CartProvider>
            <Nav />
            {children}
            <Footer />
            <Motion />
          </CartProvider>
        </LangProvider>
      </body>
    </html>
  );
}
