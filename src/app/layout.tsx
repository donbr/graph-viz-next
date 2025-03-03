import './globals.css'
import Navigation from '../components/Navigation'
import Breadcrumb from '../components/Breadcrumb'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Graph Visualizations',
  description: 'Interactive network and graph visualization demonstrations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}>
        <Navigation />
        <Breadcrumb />
        <div className="flex-grow">
          {children}
        </div>
      </body>
    </html>
  )
}
