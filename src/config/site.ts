// Single source for the firm's identity and contact data. Sources: docs/content-sources.md.

export const site = {
  // G-01
  name: "Machado Moura e Cardoso Advogados Associados",
  // H-02, owner wording for Phase 3; "regulação" and "acompanhamento institucional" are in the legacy text.
  description:
    "Escritório de advocacia em Brasília com atuação em direito da radiodifusão, incluindo regulação e acompanhamento institucional.",
  // G-03, G-16
  descriptor: "Direito da radiodifusão",
  // G-14
  location: "Brasília · Distrito Federal",
  // OWN-01, exactly as provided by the owner (Q-17).
  oabRegistration: "OAB/DF 0100104RS",
  // Until Phase 8 every page is served with noindex (docs/phases/01-foundation.md).
  indexable: false,
} as const;

// Default Open Graph image, built by src/pages/og/mmec-og-default.png.ts.
export const ogImage = {
  path: "/og/mmec-og-default.png",
  width: 1200,
  height: 630,
  // G-01
  alt: "Machado Moura e Cardoso Advogados Associados",
} as const;

// Target of the skip link; every page's <main> carries this id.
export const mainContentId = "conteudo-principal";

export const contact = {
  // G-15: old domain kept until the owner confirms a mailbox on @mmec.adv.br (Q-03).
  email: "contato@mouraeribeiro.adv.br",
  // H-93 and Q-05: both numbers are published; only the second is a WhatsApp number.
  phone: { label: "(61) 3703-5558", href: "tel:+556137035558" },
  whatsapp: {
    label: "(61) 3879-5003",
    tel: "tel:+556138795003",
    href: "https://wa.me/556138795003",
  },
  // H-94, H-95, PDF-05
  address: {
    street: "SHIS QI 05, Bloco F, Sala 332",
    district: "Lago Sul · Brasília/DF",
    postcode: "CEP 71.615-560",
  },
  // H-98 and Q-03: coordinates until Phase 3 confirms the Maps listing shows the current name.
  mapUrl: "https://www.google.com/maps/search/?api=1&query=-15.8521537,-47.8945894",
} as const;

export interface NavItem {
  label: string;
  href: string;
}

// G-05 to G-08, Q-14; structure from docs/decisions/0002-site-structure.md.
export const mainNavigation: readonly NavItem[] = [
  { label: "O escritório", href: "/#escritorio" },
  { label: "Atuação", href: "/#atuacao" },
  { label: "Publicações", href: "/publicacoes" },
  { label: "Contato", href: "/#contato" },
];

// G-18, G-19
export const legalNavigation: readonly NavItem[] = [
  { label: "Política de privacidade", href: "/privacidade" },
  { label: "Termos de uso", href: "/termos" },
];
