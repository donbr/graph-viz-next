import type { Metadata } from 'next'
import { siteImage, siteOpenGraph } from './site'

// Single source of truth for every demo route. The home grid, header active state,
// breadcrumb labels, sitemap and per-route metadata all read from this list, so a
// new demo only needs an entry here plus its src/app/(routes)/<slug>/page.tsx.
export interface Demo {
  slug: string
  name: string
  description: string
  tags: string[]
  // File name under src/components/pages/, linked as "View Source" in the demo header
  component: string
  // Unlisted demos still build and get metadata, but stay off the home grid and sitemap
  listed: boolean
}

export const demos: Demo[] = [
  {
    slug: 'force-directed-graph',
    name: 'Knowledge Network Explorer',
    description:
      'Core concepts and relationships of a decentralized, truth-anchored content framework as a force-directed graph.',
    tags: ['D3.js', 'Knowledge Graphs'],
    component: 'ForceDirectedGraph',
    listed: true,
  },
  {
    slug: 'mcp-graph-visualization',
    name: 'MCP Knowledge Graph',
    description:
      'The Model Context Protocol ecosystem and its components, with entity search, type filters and a legend.',
    tags: ['D3.js', 'Model Context Protocol'],
    component: 'McpGraphVisualization',
    listed: true,
  },
  {
    slug: 'cytoscape-graph-viz3',
    name: 'Temporal Network Analysis',
    description: 'A time-sliced network with timeline playback, node-type filters and graph metadata.',
    tags: ['Cytoscape.js', 'Network Analysis'],
    component: 'CytoscapeGraphViz3',
    listed: true,
  },
  {
    slug: 'life-sciences-graph-viz1',
    name: 'Clinical Trials Network',
    description:
      'Clinical trials, drugs, sponsors, conditions and regulatory approvals as a graph you can play forward in time.',
    tags: ['Cytoscape.js', 'Bioinformatics'],
    component: 'LifeSciencesGraphViz1',
    listed: true,
  },
  {
    slug: 'gdelt-records-viewer',
    name: 'GDELT News Analysis',
    description:
      'GDELT Global Knowledge Graph records on a clustered map and heatmap, with record search and inspection.',
    tags: ['Leaflet', 'Data Visualization'],
    component: 'GdeltRecordsViewer',
    listed: true,
  },
  {
    slug: 'proof-of-truth',
    name: 'Truth Verification Network',
    description: 'System components and relationships of the Proof of Truth framework as a knowledge graph.',
    tags: ['D3.js', 'Knowledge Graphs'],
    component: 'ProofOfTruthD3Graph',
    listed: true,
  },
  {
    slug: 'airline-ai',
    name: 'Airline AI Ecosystem',
    description: 'Generative AI and agentic solutions across the airline industry, as of 2025.',
    tags: ['D3.js', 'AI Agents'],
    component: 'AirlineAIGraph',
    listed: true,
  },
  // Earlier iterations of the temporal explorer, kept reachable by URL only
  {
    slug: 'temporal-graph-explorer',
    name: 'Temporal Graph Explorer',
    description: 'Early prototype of the time-sliced graph explorer.',
    tags: ['Network Analysis'],
    component: 'TemporalGraphExplorer',
    listed: false,
  },
  {
    slug: 'cytoscape-graph-viz1',
    name: 'Cytoscape Graph Viz 1',
    description: 'Early Cytoscape.js prototype of the temporal graph explorer.',
    tags: ['Cytoscape.js'],
    component: 'CytoscapeGraphViz1',
    listed: false,
  },
  {
    slug: 'cytoscape-graph-viz2',
    name: 'Cytoscape Graph Viz 2',
    description: 'Second Cytoscape.js prototype of the temporal graph explorer.',
    tags: ['Cytoscape.js'],
    component: 'CytoscapeGraphViz2',
    listed: false,
  },
  {
    slug: 'cytoscape-graph-explorer',
    name: 'Cytoscape Graph Explorer',
    description: 'Cytoscape.js prototype of the temporal graph explorer.',
    tags: ['Cytoscape.js'],
    component: 'CytoscapeGraphExplorer',
    listed: false,
  },
]

export const listedDemos = demos.filter((demo) => demo.listed)

export function getDemo(slug: string): Demo | undefined {
  return demos.find((demo) => demo.slug === slug)
}

export function requireDemo(slug: string): Demo {
  const demo = getDemo(slug)
  if (!demo) throw new Error(`No demo registered for slug "${slug}" in src/lib/demos.ts`)
  return demo
}

export function demoSourceUrl(demo: Demo): string {
  return `https://github.com/donbr/graph-viz-next/blob/main/src/components/pages/${demo.component}.tsx`
}

// Route page.tsx files export this as `metadata`. The root layout's title template
// turns `name` into "<name> | Don Branson", matching donbr.github.io.
export function demoMetadata(slug: string): Metadata {
  const demo = requireDemo(slug)
  // Share previews need their own title and url: openGraph and twitter set here replace
  // the layout's objects (which point at the home page) instead of merging with them
  const shareTitle = `${demo.name} | Don Branson`
  return {
    title: demo.name,
    description: demo.description,
    alternates: { canonical: `/${demo.slug}` },
    // Unlisted prototypes are reachable by URL only: keep them out of search results
    ...(demo.listed ? {} : { robots: { index: false, follow: true } }),
    openGraph: {
      ...siteOpenGraph,
      title: shareTitle,
      description: demo.description,
      url: `/${demo.slug}`,
      images: [siteImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: shareTitle,
      description: demo.description,
      images: [siteImage],
    },
  }
}

// Same 100/800 pairs as the tagColorMap in donbr.github.io's ProjectsPage, so a demo
// carries identical tags on both sites
const tagColors: Record<string, string> = {
  'D3.js': 'bg-blue-100 text-blue-800',
  'Cytoscape.js': 'bg-blue-100 text-blue-800',
  Leaflet: 'bg-purple-100 text-purple-800',
  'Knowledge Graphs': 'bg-yellow-100 text-yellow-800',
  'Data Visualization': 'bg-yellow-100 text-yellow-800',
  'Network Analysis': 'bg-green-100 text-green-800',
  'Model Context Protocol': 'bg-teal-100 text-teal-800',
  Bioinformatics: 'bg-purple-100 text-purple-800',
  'AI Agents': 'bg-violet-100 text-violet-800',
}

export function tagClassName(tag: string): string {
  return tagColors[tag] ?? 'bg-gray-100 text-gray-800'
}
