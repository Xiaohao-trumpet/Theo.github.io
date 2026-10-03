import { defineCollection, z } from "astro:content";

const sharedSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  category: z.string().default("Notes"),
  summary: z.string().default(""),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(true),
  nextSteps: z.array(z.string()).default([])
});

const blog = defineCollection({ type: "content", schema: sharedSchema });
const notes = defineCollection({ type: "content", schema: sharedSchema });
const research = defineCollection({ type: "content", schema: sharedSchema });

export const collections = { blog, notes, research };
