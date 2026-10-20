import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { projectStatusKeys } from './lib/project-status';

const projects = defineCollection({
  loader: glob({ pattern: '[^_]*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(80),
      description: z.string().max(220),
      category: z.string(),
      technologies: z.array(z.string()).default([]),
      status: z.enum(projectStatusKeys),
      date: z.coerce.date(),
      cover: image(),
      coverAlt: z.string().min(1),
      gallery: z.array(z.object({ src: image(), alt: z.string().min(1) })).default([]),
      liveUrl: z.url().optional(),
      repoUrl: z.url().optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

export const collections = { projects };
