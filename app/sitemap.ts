import { MetadataRoute } from 'next'
import { educationArticles } from '@/lib/educationData'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const articlesSitemap = educationArticles.map((article) => ({
    url: `https://drsarthakkumarmohanty.in/blog/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: 'https://drsarthakkumarmohanty.in',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: 'https://drsarthakkumarmohanty.in/contact',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...articlesSitemap
  ]
}
