import './globals.css';
import type { Metadata, Viewport } from 'next';
import { AppFrame } from '@/components/layout/AppFrame';

export const metadata: Metadata = {
  title: 'NetGlance',
  description: 'Local-first NetAlertX tablet dashboard',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, title: 'NetGlance' },
};
export const viewport: Viewport = {
  themeColor: '#07111f',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-[100dvh]">
        <AppFrame>{children}</AppFrame>
      </body>
    </html>
  );
}
