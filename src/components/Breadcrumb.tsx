'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Breadcrumb() {
  const pathname = usePathname()
  
  // Skip rendering breadcrumbs on home page
  if (pathname === '/') return null
  
  // Format path segments
  const segments = pathname.split('/').filter(Boolean)
  
  return (
    <div className="bg-gray-100 py-2 px-4">
      <div className="container mx-auto">
        <ul className="flex flex-wrap items-center text-sm">
          <li>
            <Link href="/" className="text-blue-600 hover:underline">
              Home
            </Link>
          </li>
          {segments.map((segment, index) => {
            const path = `/${segments.slice(0, index + 1).join('/')}`
            const isLast = index === segments.length - 1
            
            // Format segment for display
            const formattedSegment = segment
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')
            
            return (
              <li key={path} className="flex items-center">
                <span className="mx-2 text-gray-500">/</span>
                {isLast ? (
                  <span className="text-gray-700">{formattedSegment}</span>
                ) : (
                  <Link href={path} className="text-blue-600 hover:underline">
                    {formattedSegment}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}