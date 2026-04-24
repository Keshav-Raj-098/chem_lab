import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://chem-web.vercel.app' // Replace with your actual domain

  const routes = [
    '',
    '/publications',
    '/research',
    '/people/team',
    '/people/alumni',
    '/news/events',
    '/news/vaccancy',
    '/awards/group-leader',
    '/awards/group-members',
    '/gallery',
    '/contact',
    '/outreach',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return routes
}
