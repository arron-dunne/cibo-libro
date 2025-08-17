import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recipe Hub',
  description: 'A beautiful digital cookbook.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-white text-slate-900">{children}</body>
    </html>
  );
}
