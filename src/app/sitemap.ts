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
    '/proof-of-truth',
    '/airline-ai'
  ]
  
  // Generate sitemap entries for each route
  return routes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  })) as MetadataRoute.Sitemap
}
