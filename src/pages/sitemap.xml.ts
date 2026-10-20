import type { APIRoute } from 'astro';
import { site } from '@/config/site';
import { getPublishedProjects } from '@/lib/projects';

const escapeXml = (value: string) =>
  value.replace(/[<>&'"]/g, (char) => `&#${char.charCodeAt(0)};`);

export const GET: APIRoute = async () => {
  const projects = await getPublishedProjects();

  const entries = [
    { path: '/', lastmod: undefined as Date | undefined },
    ...projects.map((project) => ({
      path: `/projekty/${project.id}/`,
      lastmod: project.data.date,
    })),
  ];

  const urls = entries
    .map(({ path, lastmod }) => {
      const loc = `<loc>${escapeXml(new URL(path, site.url).href)}</loc>`;
      const date = lastmod ? `<lastmod>${lastmod.toISOString().slice(0, 10)}</lastmod>` : '';
      return `  <url>${loc}${date}</url>`;
    })
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
