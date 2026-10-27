// Content collections. A new publication is one Markdown file in src/content/publications/
// plus its PDF in public/assets/docs/ (and, optionally, a cover in src/assets/publications/).
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const topic = z.object({ title: z.string(), text: z.string() });

const publications = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/publications" }),
  schema: ({ image }) =>
    z
      .object({
        /** Kind of document, shown with the year on cards and pages (Q-19). */
        type: z.string(),
        /** Edition year; the index lists the newest year first. */
        year: z.number().int().min(2000),
        /** Order among publications of the same year (lower first). */
        order: z.number().int().default(0),
        /** Edition as printed in the document, when the document states more than the year. */
        editionDate: z.string().optional(),
        /**
         * Period the edition refers to, set once that period has ended; completes the note
         * "Edição de <year>, referente ao período <period>." (for example "das Eleições 2026").
         */
        period: z.string().optional(),
        /** Short title for cards, the index and the breadcrumb. */
        title: z.string(),
        /** Page heading; defaults to the title. */
        heading: z.string().optional(),
        pageTitle: z.string(),
        description: z.string(),
        eyebrow: z.string(),
        lead: z.string(),
        cardSummary: z.string(),
        cardLinkLabel: z.string(),
        downloadLabel: z.string(),
        /** File name in public/assets/docs/; served unchanged at /assets/docs/<pdf>. */
        pdf: z.string().regex(/^[a-z0-9-]+\.pdf$/),
        /** Page count of the PDF; tests/publications.spec.ts checks it against the file. */
        pages: z.number().int().positive(),
        cover: image().optional(),
        coverAlt: z.string().optional(),
        summaryTitle: z.string(),
        keyFacts: z.array(z.string()).default([]),
        topicsEyebrow: z.string(),
        topicsTitle: z.string(),
        topics: z.array(topic).min(1),
        /** Legal notice paragraphs: the guidance is general and does not replace case analysis. */
        notice: z.array(z.string()).min(1),
      })
      .refine((data) => !data.cover || Boolean(data.coverAlt), {
        message: "A cover needs coverAlt.",
        path: ["coverAlt"],
      }),
});

export const collections = { publications };
