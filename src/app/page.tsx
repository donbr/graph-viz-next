import Link from 'next/link'
import { listedDemos, tagClassName } from '@/lib/demos'

// Hero and cards follow donbr.github.io's HomePage hero and ProjectsPage ProjectCard
export default function Home() {
  return (
    <>
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Graph Visualizations</h1>
          <p className="text-xl text-blue-700 font-semibold mb-4">Knowledge Graph &amp; Network Demos</p>
          <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
            Interactive network and graph visualizations of AI and knowledge graph applications, built with D3.js,
            Cytoscape.js and Leaflet. Every demo runs in the browser.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://donbr.github.io/"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-500 font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Main Portfolio
            </a>
            <a
              href="https://github.com/donbr/graph-viz-next"
              className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-700 font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Source on GitHub
            </a>
          </div>
        </div>
      </section>

      <section aria-labelledby="demos-heading" className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <h2 id="demos-heading" className="text-3xl font-bold text-gray-800 mb-2">Interactive Demos</h2>
            <p className="text-gray-600">
              Force-directed, temporal and geographic views of knowledge graphs across AI, life sciences and global news.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listedDemos.map((demo) => (
              <article
                key={demo.slug}
                className="group relative bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-t-2 border-gray-200 flex flex-col"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {/* Stretched link: the ::after overlay makes the whole card clickable */}
                  <Link
                    href={`/${demo.slug}`}
                    className="hover:text-blue-700 focus:outline-none after:absolute after:inset-0 after:rounded-lg focus-visible:after:ring-2 focus-visible:after:ring-blue-500"
                  >
                    {demo.name}
                  </Link>
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{demo.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {demo.tags.map((tag) => (
                    <span key={tag} className={`${tagClassName(tag)} text-xs px-2.5 py-1 rounded font-medium`}>
                      {tag}
                    </span>
                  ))}
                </div>
                {/* Visual cue only: the stretched title link already covers the card */}
                <div
                  aria-hidden="true"
                  className="mt-auto pt-3 border-t border-gray-100 text-sm font-semibold text-blue-600 group-hover:text-blue-800"
                >
                  Open Demo &rarr;
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
