import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    section: z.enum(['web', 'games', 'mobile-apps', 'experiments', 'prototypes']),
    startDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    links: z
      .array(
        z.object({
          label: z.string(),
          href: z.string().url(),
          primary: z.boolean().optional(),
        })
      )
      .default([]),
    languages: z
      .array(
        z.object({
          name: z.string(),
          color: z.string(),
        })
      )
      .default([]),
    stack: z.array(z.string()).default([]),
    commits: z.number().optional(),
    image: z.string().optional(),
    // A different picture for the hero stage when the card image would not
    // suit a wide crop (the stage falls back to image when omitted).
    stageImage: z.string().optional(),
    // Where the hero stage crop should centre, as a CSS object-position pair
    // like "50% 40%". Defaults to the centre when omitted.
    imageFocus: z.string().regex(/^\d{1,3}% \d{1,3}%$/, 'Use two percentages, e.g. "50% 40%"').optional(),
    // How the stage holds the image: "cover" fills it with the crop centred on
    // imageFocus; "contain" shows the whole image letterboxed over a blurred
    // copy of itself, for artwork whose copy any crop would cut through.
    stageFit: z.enum(['cover', 'contain']).default('cover'),
    video: z.string().optional(),
    unpublished: z.boolean().default(false),
  }),
});

export const collections = { projects };
