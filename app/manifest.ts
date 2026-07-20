import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Dr. Sarthak Kumar Mohanty - Cancer Care Rajkot',
    short_name: 'Dr. Sarthak Cancer Care',
    description: 'Senior Consultant Radiation Oncologist at HCG Cancer Centre, Rajkot. Precision cancer therapy and radiation oncology services.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAFAFA',
    theme_color: '#019E88',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
