import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://graph-viz-next.vercel.app'
  
  // List of all routes in the application
  const routes = [
    '',
    '/force-directed-graph',
    '/mcp-graph-visualization',
    '/cytoscape-graph-viz3',
    '/life-sciences-graph-viz1',
    '/gdelt-records-viewer',
    '/temporal-graph-explorer',
    '/cytoscape-graph-viz1',
    '/cytoscape-graph-viz2',
    '/cytoscape-graph-explorer'
  ]
  
  // Generate sitemap entries for each route
  return routes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1.0 : 0.8,
  })) as MetadataRoute.Sitemap
}
