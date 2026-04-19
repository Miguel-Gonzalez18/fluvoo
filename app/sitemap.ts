import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://fluvoo.com'

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]
}
