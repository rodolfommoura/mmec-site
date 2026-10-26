// Card data for the firm's publications (H-72 to H-84). Phase 4 builds their pages.
import type { ImageMetadata } from "astro";
import electionsCover from "../assets/publications/cartilha-eleicoes-2026-cover.png";
import partyBroadcastCover from "../assets/publications/cartilha-propaganda-partidaria-2026-cover.png";
import vozDoBrasilCover from "../assets/publications/calendario-voz-do-brasil-2026-cover.png";

export interface Publication {
  category: string;
  title: string;
  summary: string;
  linkLabel: string;
  href: string;
  cover: ImageMetadata;
  coverAlt: string;
}

export const publications: readonly Publication[] = [
  {
    category: "Direito eleitoral · 2026",
    title: "Eleições 2026: implicações no rádio e na televisão",
    summary:
      "Cartilha operacional sobre calendário eleitoral, pesquisas, programação, debates, horário gratuito e direito de resposta.",
    linkLabel: "Acessar a cartilha",
    href: "/publicacoes/cartilha-eleicoes-2026",
    cover: electionsCover,
    coverAlt: "Capa da cartilha Eleições 2026: implicações no rádio e na televisão",
  },
  {
    category: "Direito eleitoral · 2026",
    title: "Propaganda Partidária 2026 no rádio e na televisão",
    summary:
      "Orientações para emissoras sobre exibição, distribuição horária, dias de veiculação, reserva, entrega de mídia e programação normal.",
    linkLabel: "Acessar a cartilha",
    href: "/publicacoes/cartilha-propaganda-partidaria-2026",
    cover: partyBroadcastCover,
    coverAlt: "Capa da cartilha Propaganda Partidária 2026 no rádio e na televisão",
  },
  {
    category: "Regulação · 2026",
    title: "Calendário A Voz do Brasil 2026",
    summary:
      "Portaria MCOM nº 22.129/2026 com hipóteses de flexibilização, dispensa e calendário anual de eventos.",
    linkLabel: "Acessar o documento",
    href: "/publicacoes/calendario-voz-do-brasil-2026",
    cover: vozDoBrasilCover,
    coverAlt: "Prévia do calendário A Voz do Brasil 2026",
  },
];
