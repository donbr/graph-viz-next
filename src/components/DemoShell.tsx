import Link from 'next/link'
import { demoSourceUrl, requireDemo, tagClassName } from '@/lib/demos'

// Shared frame for every demo route: a white header (breadcrumb, title, description,
// tags, source link) from the registry, then the demo itself on gray-50. Demo components
// render only their own controls and visualization, never a page title.
export default function DemoShell({ slug, children }: { slug: string; children: React.ReactNode }) {
  const demo = requireDemo(slug)

  return (
    <>
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <nav aria-label="Breadcrumb" className="mb-3 text-sm">
            <ol className="flex flex-wrap items-center gap-2 text-gray-500">
              <li>
                <Link href="/" className="text-blue-600 hover:underline">
                  Demos
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-gray-700">
                {demo.name}
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{demo.name}</h1>
          <p className="text-gray-600 leading-relaxed max-w-3xl mb-4">{demo.description}</p>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {demo.tags.map((tag) => (
                <span key={tag} className={`${tagClassName(tag)} text-xs px-2.5 py-1 rounded font-medium`}>
                  {tag}
                </span>
              ))}
            </div>
            <a
              href={demoSourceUrl(demo)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-gray-700 hover:text-black"
            >
              View Source &#8599;<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </section>
      <div className="max-w-6xl mx-auto px-4 py-8">{children}</div>
    </>
  )
}
