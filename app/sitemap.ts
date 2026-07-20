import { MetadataRoute } from 'next'
import { educationArticles } from '@/lib/educationData'
import { treatmentsData } from '@/lib/treatmentData'
import { cancerTypesData } from '@/lib/cancerData'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const articlesSitemap = educationArticles.map((article) => ({
    url: `https://drsarthakkumarmohanty.in/blog/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const treatmentsSitemap = treatmentsData.map((t) => ({
    url: `https://drsarthakkumarmohanty.in/treatments/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const cancersSitemap = cancerTypesData.map((c) => ({
    url: `https://drsarthakkumarmohanty.in/cancer-types/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: 'https://drsarthakkumarmohanty.in',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: 'https://drsarthakkumarmohanty.in/dr-sarthak-kumar-mohanty',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://drsarthakkumarmohanty.in/treatments',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://drsarthakkumarmohanty.in/cancer-types',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://drsarthakkumarmohanty.in/contact',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...treatmentsSitemap,
    ...cancersSitemap,
    ...articlesSitemap
  ]
}
