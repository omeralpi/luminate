import { SiteHeader } from '@/components/site-header';
import { TRPCProvider } from '@/trpc/client';
import { Geist_Mono, Martian_Mono } from 'next/font/google';
import "./globals.css";

const martian_mono = Martian_Mono({
  subsets: ['latin'],
  weight: ['200'],
  variable: '--display-family',
});

const geist_mono = Geist_Mono({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--text-family',
});

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${martian_mono.variable} ${geist_mono.variable}`}>
      <body>
        <TRPCProvider>
          <SiteHeader />
          {children}
        </TRPCProvider>
      </body>
    </html>
  );
}