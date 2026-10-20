import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

export async function getPublishedProjects(): Promise<Project[]> {
  const projects = await getCollection('projects', ({ data }) => !data.draft);
  return projects.sort((a, b) => {
    if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
    return b.data.date.getTime() - a.data.date.getTime();
  });
}
