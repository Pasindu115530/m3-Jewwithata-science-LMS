import type { Metadata } from 'next';
import '../index.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://sciencepractical.edu'),
  title: {
    default: 'Science Practical LMS — Virtual Lab Simulations & Live Classes',
    template: '%s | Science Practical LMS',
  },
  description:
    'Learn science through virtual lab experiments, HD video demonstrations, automated practical quizzes, and interactive live Zoom practical classes for Grade 12 students.',
  keywords: [
    'Science LMS',
    'Virtual Lab Simulators',
    'Acid Base Titration Simulator',
    'Optics Experiment',
    'Physics Virtual Lab',
    'Chemistry Practical',
    'Zoom Science Class',
    'Science Learning Platform',
  ],
  authors: [{ name: 'Skyray Soft Tech' }],
  creator: 'Skyray Soft Tech',
  publisher: 'Science Practical LMS',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sciencepractical.edu/',
    siteName: 'Science Practical LMS',
    title: 'Science Practical LMS — Interactive Virtual Lab Simulators & Live Classes',
    description:
      'Master chemistry, physics, and biology practicals with virtual lab simulators, scheduled Zoom classes, and instant feedback quizzes.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=1200&h=630',
        width: 1200,
        height: 630,
        alt: 'Science Practical LMS Virtual Lab Simulator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Science Practical LMS — Interactive Virtual Lab Simulators',
    description:
      'Learn science with virtual lab experiments, HD live Zoom practical classes, and automated quizzes.',
    images: ['https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=1200&h=630'],
  },
  alternates: {
    canonical: 'https://sciencepractical.edu/',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Science Practical LMS',
  url: 'https://sciencepractical.edu',
  logo: 'https://sciencepractical.edu/logo.png',
  description:
    'Next-generation interactive learning management platform designed for hands-on chemistry, physics, and biology practical education.',
  sameAs: [
    'https://facebook.com',
    'https://twitter.com',
    'https://linkedin.com',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#F8F5FF] text-[#2E2842] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
