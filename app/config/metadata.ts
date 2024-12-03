import type { Metadata } from 'next'

const siteMetadata = {
  // Basic SEO
  title: 'Pokemon Card Scanner - Catalog Your Collection',
  description: 'Search, organize, and export your Pokemon card collection with ease. A modern tool for Pokemon card collectors and enthusiasts.',
  
  // Open Graph / Social
  openGraph: {
    title: 'Pokemon Card Scanner - Catalog Your Collection',
    description: 'Search, organize, and export your Pokemon card collection with ease. A modern tool for Pokemon card collectors and enthusiasts.',
    type: 'website',
    locale: 'en_US',
    url: 'https://cg-sub-creator-a13twkiod-ajnieves-projects.vercel.app',
    siteName: 'Pokemon Card Scanner',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Pokemon Card Scanner',
    }],
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Pokemon Card Scanner - Catalog Your Collection',
    description: 'Search, organize, and export your Pokemon card collection with ease. A modern tool for Pokemon card collectors and enthusiasts.',
    images: [{
      url: '/og-image.png',
      alt: 'Pokemon Card Scanner',
    }],
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  },

  // Canonical URL
  canonical: 'https://cg-sub-creator-a13twkiod-ajnieves-projects.vercel.app',

  // Verification
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    bing: 'your-bing-verification-code',
  },

  // Additional Metadata
  keywords: ['pokemon cards', 'card scanner', 'pokemon collection', 'card catalog', 'trading cards', 'TCG'],
  author: 'Pokemon Card Scanner',
  generator: 'Next.js',
  applicationName: 'Pokemon Card Scanner',
  referrer: 'origin-when-cross-origin' as const,
  creator: 'Pokemon Card Scanner Team',
  publisher: 'Pokemon Card Scanner',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

// Helper function to generate metadata for Next.js
export function generateMetadata(): Metadata {
  return {
    metadataBase: new URL(siteMetadata.canonical),
    title: {
      default: siteMetadata.title,
      template: `%s | ${siteMetadata.title}`,
    },
    description: siteMetadata.description,
    keywords: siteMetadata.keywords,
    authors: [{ name: siteMetadata.author }],
    creator: siteMetadata.creator,
    publisher: siteMetadata.publisher,
    formatDetection: siteMetadata.formatDetection,
    referrer: siteMetadata.referrer,
    generator: siteMetadata.generator,
    applicationName: siteMetadata.applicationName,
    robots: siteMetadata.robots,
    openGraph: siteMetadata.openGraph,
    twitter: siteMetadata.twitter,
    verification: siteMetadata.verification,
    alternates: {
      canonical: siteMetadata.canonical,
    },
  }
}

export { siteMetadata }
