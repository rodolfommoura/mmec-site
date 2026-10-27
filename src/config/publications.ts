// Publications from the content collection (src/content/publications/), with the PDF facts
// read from the files themselves so the size shown always matches what is served.
import { statSync } from "node:fs";
import { join } from "node:path";
import { getCollection, type CollectionEntry } from "astro:content";

export type Publication = CollectionEntry<"publications">;

export const publicationsPath = "/publicacoes";
export const pdfBasePath = "/assets/docs/";

/** Newest edition year first, then the order within the year (Q-19). */
export async function getPublications(): Promise<Publication[]> {
  const entries = await getCollection("publications");
  return entries.sort((a, b) => b.data.year - a.data.year || a.data.order - b.data.order);
}

export const publicationHref = (publication: Publication) =>
  `${publicationsPath}/${publication.id}`;

export const pdfHref = (publication: Publication) => `${pdfBasePath}${publication.data.pdf}`;

/** "Cartilha jurídica · 2026": the year and type label of every card and page (Q-19). */
export const typeAndYear = (publication: Publication) =>
  `${publication.data.type} · ${publication.data.year}`;

/** Size in bytes of the PDF in public/; the build fails if the file is missing. */
export function pdfBytes(publication: Publication): number {
  return statSync(join(process.cwd(), "public", pdfBasePath, publication.data.pdf)).size;
}

const sizeFormat = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });

/** Decimal kilobytes, as file managers and browsers show them ("423 KB"). */
export const formatBytes = (bytes: number) => `${sizeFormat.format(bytes / 1000)} KB`;

export const formatPages = (pages: number) => (pages === 1 ? "1 página" : `${pages} páginas`);
