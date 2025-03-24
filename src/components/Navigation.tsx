'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import path from 'path'

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/force-directed-graph', label: 'Knowledge Network Explorer' },
  { path: '/mcp-graph-visualization', label: 'MCP Knowledge Graph' },
  { path: '/cytoscape-graph-viz3', label: 'Temporal Network Analysis' },
  { path: '/life-sciences-graph-viz1', label: 'Clinical Trials Network' },
  { path: '/gdelt-records-viewer', label: 'GDELT News Analysis' },
  { path: '/proof-of-truth', label: 'Truth Verification Network' },
  { path: '/airline-ai', label: 'Airline AI Ecosystem' },
  // { path: '/cytoscape-graph-viz2', label: 'Cytoscape Graph Viz 2' },
  // { path: '/cytoscape-graph-viz1', label: 'Cytoscape Graph Viz 1' },
  // { path: '/temporal-graph-explorer', label: 'Temporal Graph Explorer' },
]

export default function Navigation() {
  const pathname = usePathname()
  
  return (
    <nav className="bg-gray-800 text-white px-4 py-3 shadow-md sticky top-0 z-10">
      <div className="container mx-auto flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center space-x-2 mb-2 md:mb-0">
          <Link href="/" className="font-bold text-xl">
            Graph Visualizations
          </Link>
          <span className="text-gray-400">|</span>
          <a href="https://donbr.github.io/" className="text-blue-300 hover:text-blue-200 transition" target="_blank" rel="noopener noreferrer">
            <span className="hidden md:inline">Main Portfolio</span>
            <span className="md:hidden">Portfolio</span>
          </a>
        </div>
        <ul className="flex flex-col md:flex-row md:space-x-6">
          {navItems.map(item => (
            <li key={item.path} className="mb-1 md:mb-0">
              <Link
                href={item.path}
                className={`hover:text-gray-300 transition block py-1 ${
                  pathname === item.path ? 'text-blue-300 font-medium' : ''
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}