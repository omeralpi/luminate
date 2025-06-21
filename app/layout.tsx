
import { TRPCProvider } from '@/trpc/client';
import { DM_Sans, Geist_Mono } from 'next/font/google';
import "./globals.css";

const martian_mono = DM_Sans({
  subsets: ['latin'],
  variable: '--text-family',
});

const geist_mono = Geist_Mono({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--display-family',
});

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${martian_mono.variable} ${geist_mono.className}`}>
      <body>
        <TRPCProvider>
          {children}
        </TRPCProvider>
      </body>
    </html>
  );
}