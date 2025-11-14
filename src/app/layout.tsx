import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RH Helper - Sistema de Gerenciamento de RH',
  description:
    'Sistema completo para gerenciamento de associados e recursos humanos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='pt-BR'>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
