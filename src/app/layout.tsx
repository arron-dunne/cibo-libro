import './globals.css';
import type { Metadata } from 'next';
import { Inter, Poppins, Space_Grotesk, Playfair_Display, Caveat } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-poppins' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const caveat = Caveat({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-caveat' });

export const metadata: Metadata = {
  title: 'Cookbook Hub',
  description: 'A beautiful digital cookbook.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={[
        inter.variable,
        poppins.variable,
        spaceGrotesk.variable,
        playfair.variable,
        caveat.variable,
      ].join(' ')}
    >
      <body className="min-h-dvh bg-white text-slate-900 antialiased">{children}</body>
    </html>
  );
}
