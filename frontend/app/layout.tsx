import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VedaAI – AI Assessment Creator',
  description: 'Generate high-quality academic question papers and answer keys in seconds using AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
