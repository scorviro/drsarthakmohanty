import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/drsarthakkumarmohantylogin',
        '/drsarthakkumarmohantylogin/',
        '/api/',
      ],
    },
    sitemap: 'https://drsarthakkumarmohanty.in/sitemap.xml',
  }
}
