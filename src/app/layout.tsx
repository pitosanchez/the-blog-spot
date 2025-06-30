import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import SessionWrapper from '@/components/SessionWrapper';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MediPublish - Professional Medical Knowledge Sharing Platform',
  description:
    'Share medical knowledge, earn from your expertise. The premier platform for medical professionals to publish content, earn CME credits, and build their practice.',
  keywords:
    'medical publishing, CME credits, medical education, healthcare content, physician platform',
  authors: [{ name: 'MediPublish' }],
  openGraph: {
    title: 'MediPublish - Professional Medical Knowledge Sharing',
    description: 'Share medical knowledge, earn from your expertise',
    type: 'website',
    url: 'https://medipublish.com',
    siteName: 'MediPublish',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MediPublish Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MediPublish - Medical Knowledge Platform',
    description: 'Share medical knowledge, earn from your expertise',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-verification-code',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionWrapper session={session}>{children}</SessionWrapper>
      </body>
    </html>
  );
}
