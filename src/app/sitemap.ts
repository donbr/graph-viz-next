import { MetadataRoute } from 'next'
import { listedDemos } from '@/lib/demos'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://graph-viz-next.vercel.app'

  // Home plus every listed demo; unlisted demos stay out of the sitemap
  const routes = ['', ...listedDemos.map((demo) => `/${demo.slug}`)]

  return routes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  })) as MetadataRoute.Sitemap
}
