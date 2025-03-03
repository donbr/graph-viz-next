'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import path from 'path'

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/temporal-graph-explorer', label: 'Temporal Graph Explorer' },
  { path: '/cytoscape-graph-viz1', label: 'Cytoscape Graph Viz 1' },
  { path: '/cytoscape-graph-viz2', label: 'Cytoscape Graph Viz 2' },
  { path: '/cytoscape-graph-viz3', label: 'Cytoscape Graph Viz 3' },
  { path: '/life-sciences-graph-viz1', label: 'Life Sciences Graph Viz' },
  { path: '/mcp-graph-visualization', label: 'MCP Graph Visualization' },
  { path: '/force-directed-graph', label: 'Force Directed Graph' },

]

export default function Navigation() {
  const pathname = usePathname()
  
  return (
    <nav className="bg-gray-800 text-white px-4 py-3 shadow-md sticky top-0 z-10">
      <div className="container mx-auto flex flex-col md:flex-row md:items-center md:justify-between">
        <Link href="/" className="font-bold text-xl mb-2 md:mb-0">
          Graph Visualizations
        </Link>
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