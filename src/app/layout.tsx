import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Security Cameras',
  description: 'Private security camera dashboard.',
  robots: { index: false, follow: false },
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
