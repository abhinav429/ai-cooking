import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Header from "@/components/Header";
import { neobrutalism } from "@clerk/themes";
import Image from "next/image";
import { FOOTER_NOTE, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: `${SITE_NAME} — ${SITE_TAGLINE}`,
  description: SITE_DESCRIPTION,
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{ baseTheme: neobrutalism }}>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/logo-mark.svg" type="image/svg+xml" />
        </head>
        <body className={`${inter.className}`}>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Toaster richColors />

          <footer className="py-8 px-4 border-t border-stone-200 bg-stone-50">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo-mark.svg"
                  alt={`${SITE_NAME} logo`}
                  width={40}
                  height={40}
                  className="w-10 h-10"
                  unoptimized
                />
              </div>
              <p className="text-stone-500 text-sm text-center md:text-right max-w-md">
                {FOOTER_NOTE}
              </p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
