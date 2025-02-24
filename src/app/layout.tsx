import "./globals.css";
import type { Metadata } from "next";
import { Lato } from "next/font/google";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ToneCraft",
  description: "Craft your email tone effortlessly",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={lato.className}>
        <main>{children}</main>
        <footer className="fixed bottom-0 w-full py-2 text-center text-xs text-gray-500 bg-white/80 backdrop-blur-sm border-t border-gray-100">
          <a
            href="https://github.com/akramsaouri"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-800 transition-colors"
          >
            Built by @akram
          </a>
        </footer>
      </body>
    </html>
  );
}
