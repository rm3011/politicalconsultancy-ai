import type { Metadata, Viewport } from 'next';
import Script from "next/script";
import { Inter, Playfair_Display, Anton } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-anton',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://theedgewithjohn.com'),
  title: {
    template: '%s | The Edge With John - Political Consultancy',
    default: 'Political Consulting, Campaign Management & AI',
  },
  description:
    'AI-powered political intelligence firm delivering predictive analytics, real-time sentiment tracking & data-driven strategy for winning campaigns.',
  keywords: [
    'political consultancy',
    'political strategy',
    'AI politics',
    'election strategy',
    'political campaign',
    'data-driven politics',
    'political intelligence',
    'The Edge With John',
  ],
  authors: [{ name: 'John', url: 'https://theedgewithjohn.com' }],
  creator: 'The Edge With John',
  publisher: 'The Edge With John',
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
    url: 'https://theedgewithjohn.com',
    siteName: 'The Edge With John',
    title: 'Political Consulting, Campaign Management & AI',
    description:
      'AI-powered political intelligence firm delivering predictive analytics, real-time sentiment tracking & data-driven strategy for winning campaigns.',
    images: [
      {
        url: '/logo-final.png',
        width: 1200,
        height: 630,
        alt: 'The Edge With John - Political Consultancy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@theedgewithjohn',
    creator: '@theedgewithjohn',
    title: 'Political Consulting, Campaign Management & AI',
    description:
      'AI-powered political intelligence firm delivering predictive analytics, real-time sentiment tracking & data-driven strategy for winning campaigns.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://theedgewithjohn.com',
  },
  category: 'Politics',
  icons: {
    icon: [{ url: '/favicon.ico' }, { url: '/icon.png', type: 'image/png' }],
    apple: [{ url: '/apple-touch-icon.png' }],
    shortcut: ['/favicon.ico'],
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'your-google-verification-code',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#b89168',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${anton.variable}`}
    >
      <head>
        <meta name="msapplication-TileColor" content="#b89168" />
        {/* <meta
          name="google-site-verification"
          content="your-google-verification-code"
        /> */}
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content="India" />
        <meta name="geo.position" content="20.5937;78.9629" />
        <meta name="ICBM" content="20.5937, 78.9629" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'The Edge With John',
              description: 'AI-powered political consultancy',
              url: 'https://theedgewithjohn.com',
              logo: 'https://theedgewithjohn.com/logo.png',
              sameAs: [
                'https://twitter.com/theedgewithjohn',
                'https://linkedin.com/company/the-edge-with-john',
                'https://youtube.com/@theedgewithjohn',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+91-XXXXXXXXXX',
                contactType: 'Sales',
              },
            }),
          }}
        />
        <Script id="gtm-script" strategy="afterInteractive">
  {`
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;
    f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-59XN2T84');
  `}
</Script>
      </head>

      <body className={`${inter.className} bg-[#050505] text-white antialiased`}>
  <Script id="gtm-script" strategy="afterInteractive">
    {`
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;
      f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-59XN2T84');
    `}
  </Script>

  <noscript>
    <iframe
      src="https://www.googletagmanager.com/ns.html?id=GTM-59XN2T84"
      height="0"
      width="0"
      style={{ display: "none", visibility: "hidden" }}
    />
  </noscript>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-red-600 focus:text-white focus:rounded-lg"
        >
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
