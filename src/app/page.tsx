'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center py-16 px-4">
      <h1 className="text-4xl font-bold mb-4">Graph Visualizations</h1>
      <p className="text-lg text-center text-gray-700 mb-8 max-w-3xl">
        Explore interactive graph visualization techniques built through rapid prototyping with Anthropic Claude 3.7.
        This collection showcases various approaches to representing complex data relationships across different domains,
        from force-directed layouts to domain-specific visualizations for life sciences and threat intelligence.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <Link href="/force-directed-graph"
              className="p-6 border rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition-all">
          <h2 className="text-2xl font-semibold">Force Directed Graph</h2>
          <p className="mt-2 text-gray-600">D3.js force-directed graph</p>
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
        <Link href="/gdelt-records-viewer"
              className="p-6 border rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition-all">
          <h2 className="text-2xl font-semibold">GDELT Records Viewer</h2>
          <p className="mt-2 text-gray-600">Interactive record viewer</p>
        </Link>
        <Link href="/proof-of-truth" 
              className="p-6 border rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition-all">
          <h2 className="text-2xl font-semibold">Proof of Truth</h2>
          <p className="mt-2 text-gray-600">D3.js graph visualization</p>
        </Link>
        <Link href="/airline-ai"
              className="p-6 border rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition-all">
          <h2 className="text-2xl font-semibold">Airline AI</h2>
          <p className="mt-2 text-gray-600">D3.js graph visualization</p>
        </Link>
        {/* <Link href="/temporal-graph-explorer" 
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
        </Link> */}
      </div>
    </main>
  )
}
