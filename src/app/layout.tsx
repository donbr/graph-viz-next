import './globals.css'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import type { Metadata, Viewport } from 'next'
import { siteOpenGraph } from '@/lib/site'

// Separate viewport export
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  // Demo routes set their own title via demoMetadata() in src/lib/demos.ts
  title: {
    default: 'Graph Visualizations | Don Branson',
    template: '%s | Don Branson',
  },
  description: 'Interactive network and graph visualization demonstrations showcasing AI and knowledge graph applications by Don Branson',
  keywords: ['Graph Visualization', 'Knowledge Graphs', 'Network Analysis', 'D3.js', 'Cytoscape.js', 'GDELT', 'Neo4j', 'AI Engineer'],
  authors: [{ name: 'Don Branson' }],
  creator: 'Don Branson',
  metadataBase: new URL('https://graph-viz-next.vercel.app'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/',
    },
  },
  openGraph: {
    title: 'Graph Visualizations & AI Demos | Don Branson',
    description: 'Interactive knowledge graph and network visualization demonstrations for AI applications',
    url: 'https://graph-viz-next.vercel.app/',
    ...siteOpenGraph,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Graph Visualizations | Don Branson',
    description: 'Interactive knowledge graph and network visualization demonstrations',
  },
  verification: {
    google: 'google-site-verification-code', // Add your verification code if you have one
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
  category: 'technology',
  other: {
    'link-relation': 'https://donbr.github.io/'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              'name': 'Graph Visualization Showcase',
              'url': 'https://graph-viz-next.vercel.app/',
              'potentialAction': {
                '@type': 'SearchAction',
                'target': 'https://graph-viz-next.vercel.app/search?q={search_term_string}',
                'query-input': 'required name=search_term_string'
              },
              'author': {
                '@type': 'Person',
                'name': 'Don Branson',
                'url': 'https://donbr.github.io/'
              }
            })
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-gray-50">
        <SiteHeader />
        <main className="flex-grow">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  )
}
