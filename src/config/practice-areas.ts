// The six practice areas of the legacy home page (H-37 to H-62, confirmed by PDF-03).
// Order matters: each area keeps its legacy anchor, #area-1 to #area-6 (docs/url-map.md).

export interface PracticeArea {
  title: string;
  summary: string;
  description: string;
  topics: readonly string[];
}

export const practiceAreas: readonly PracticeArea[] = [
  {
    // H-39 to H-42 (H-41 reworded at the Phase 3 gate)
    title: "Assessoria jurídica permanente",
    summary: "Suporte contínuo para decisões jurídicas e regulatórias.",
    description:
      "Acompanhamento recorrente das demandas do cliente, com análise preventiva, orientação jurídica e resposta a questões operacionais do setor.",
    topics: [
      "Consultoria jurídica recorrente",
      "Revisão de riscos regulatórios",
      "Apoio a decisões administrativas",
    ],
  },
  {
    // H-43 to H-46
    title: "Regulação e legislação",
    summary: "Leitura técnica das normas que estruturam o setor.",
    description:
      "Interpretação de alterações normativas, atos administrativos e projetos legislativos, com avaliação de impactos e definição de medidas de adequação.",
    topics: [
      "Análise de normas e atos",
      "Avaliação de impacto regulatório",
      "Orientação de conformidade",
    ],
  },
  {
    // H-47 to H-50 (H-48 and H-50 reworded at the Phase 3 gate)
    title: "Outorgas e renovações",
    summary: "Gestão jurídica dos processos de outorga e renovação.",
    description:
      "Assessoria em processos relacionados a outorgas, renovações, transferências e regularidade documental, com atenção a prazos e exigências formais.",
    topics: ["Renovação de outorgas", "Regularidade documental", "Controle de prazos"],
  },
  {
    // H-51 to H-54
    title: "Órgãos públicos",
    summary: "Acompanhamento técnico de processos administrativos.",
    description:
      "Gestão jurídica de procedimentos, protocolos, diligências e acompanhamento institucional perante órgãos públicos sediados em Brasília.",
    topics: [
      "Processos administrativos",
      "Protocolos e diligências",
      "Acompanhamento institucional",
    ],
  },
  {
    // H-55 to H-58 (H-56 reworded at the Phase 3 gate)
    title: "Pareceres e estudos",
    summary: "Fundamentação jurídica para decisões internas.",
    description:
      "Elaboração de pareceres, estudos técnicos e informativos destinados a subsidiar decisões internas, operações e posicionamentos institucionais.",
    topics: ["Pareceres jurídicos", "Estudos setoriais", "Informativos técnicos"],
  },
  {
    // H-59, H-60 (rewritten: the legacy slogan is replaced by a plain description), H-61, H-62
    title: "Monitoramento normativo",
    summary: "Acompanhamento das publicações oficiais que afetam o setor.",
    description:
      "Acompanhamento de publicações oficiais, mudanças legislativas e atos regulatórios, com triagem e comunicação de impactos aos clientes.",
    topics: ["Diário Oficial da União", "Atos normativos", "Alertas regulatórios"],
  },
];
