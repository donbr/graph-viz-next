'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center py-16 px-4">
      <h1 className="text-4xl font-bold mb-8">Graph Visualizations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      <Link href="/temporal-graph-explorer" 
              className="p-6 border rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition-all">
          <h2 className="text-2xl font-semibold">Temporal Graph Explorer</h2>
          <p className="mt-2 text-gray-600">Time-based graph visualization</p>
        </Link>
        <Link href="/cytoscape-graph-viz1" 
              className="p-6 border rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition-all">
          <h2 className="text-2xl font-semibold">Cytoscape Graph Viz 1</h2>
          <p className="mt-2 text-gray-600">Basic graph visualization example</p>
        </Link>
        <Link href="/cytoscape-graph-viz2" 
              className="p-6 border rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition-all">
          <h2 className="text-2xl font-semibold">Cytoscape Graph Viz 2</h2>
          <p className="mt-2 text-gray-600">Intermediate graph visualization example</p>
        </Link>
        <Link href="/cytoscape-graph-viz3" 
              className="p-6 border rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition-all">
          <h2 className="text-2xl font-semibold">Cytoscape Graph Viz 3</h2>
          <p className="mt-2 text-gray-600">Advanced graph visualization example</p>
        </Link>
        <Link href="/life-sciences-graph-viz1" 
              className="p-6 border rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition-all">
          <h2 className="text-2xl font-semibold">Life Sciences Graph Viz</h2>
          <p className="mt-2 text-gray-600">Domain-specific visualization</p>
        </Link>
        <Link href="/mcp-graph-visualization" 
              className="p-6 border rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition-all">
          <h2 className="text-2xl font-semibold">MCP Graph Visualization</h2>
          <p className="mt-2 text-gray-600">D3.js graph visualization</p>
        </Link>
        <Link href="/force-directed-graph"
              className="p-6 border rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition-all">
          <h2 className="text-2xl font-semibold">Force Directed Graph</h2>
          <p className="mt-2 text-gray-600">D3.js force-directed graph</p>
        </Link>
      </div>
    </main>
  )
}
