import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import AffiliateTracker from "../components/AffiliateTracker";
import DynamicThemeInjector from "../components/DynamicThemeInjector";
import VisitorAnalyticsTracker from "../components/VisitorAnalyticsTracker";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"] });

export const metadata: Metadata = {
  title: "KidsGenLab™ – Future Leaders Mastery Program",
  description: "A premium financial mastery bundle teaching strategic wealth, innovation, and leadership.",
  icons: {
    icon: [
      { url: '/kidsgenlab9.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    shortcut: '/kidsgenlab9.png',
    apple: '/kidsgenlab9.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.getRegistrations().then(function(regs) {
                    regs.forEach(function(r) { r.unregister(); });
                  });
                }
                if ('caches' in window) {
                  caches.keys().then(function(names) {
                    names.forEach(function(name) { caches.delete(name); });
                  });
                }
              }
            `,
          }}
        />
        <DynamicThemeInjector />
        <Suspense fallback={null}>
          <AffiliateTracker />
          <VisitorAnalyticsTracker />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
