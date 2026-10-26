# Content sources

Inventory of every piece of visible copy, metadata, URL, document and image on the legacy site, with its source and its fate in the rebuild. Any sentence on the new site must trace to a row here, to a PDF listed in [PDF publications](#pdf-publications), or to text the owner provides later (added here as a new row).

- Legacy source: `rodolfommoura/mmec-site-legacy`, commit `3402fce` (v1.5.0), read from the sibling clone `../mmec-site-legacy/public/`. Paths below are relative to that `public/` folder.
- Line numbers point to the line where the text starts.
- Copy is quoted verbatim in Portuguese. Notes are in English.
- Open problems are cross-referenced as `Q-NN` (see [`open-questions.md`](open-questions.md)).

## Status values

| Status | Meaning |
|---|---|
| `keep` | Reuse as is (typography and punctuation may be normalised). |
| `rewrite` | Facts are usable, but wording must change: tone, OAB rules, accuracy, or a new UI context. Rewrites may not add facts. |
| `drop` | Not carried over. |
| `needs-owner` | Cannot be used until the owner answers the linked question. The default in the question applies if there is no answer. |

## Global elements (repeated on several pages)

| ID | Source | Text | Type | Status | Note |
|---|---|---|---|---|---|
| G-01 | `index.html:39`, `:481`; all pages, header and footer | `Machado Moura e Cardoso Advogados Associados` | logo alt text | keep | Full legal name. New logo comes from the brand folder (`docs/brand.md`). |
| G-02 | `index.html:38` | `Machado Moura e Cardoso — início` | link label | rewrite | Accessible name of the home link; keep the idea, word it per component in Phase 2. |
| G-03 | `index.html:40`; `404.html:29`; `cartilha-propaganda-partidaria-2026.html:38`; `calendario-voz-do-brasil-2026.html:40` | `Direito da radiodifusão` | header descriptor | keep | Sober and accurate. |
| G-04 | `index.html:33`; all pages except legal pages | `Ir para o conteúdo` | skip link | keep | Add it to every page (missing on `privacidade.html` and `termos.html`). |
| G-05 | `index.html:44`, `:486` | `O escritório` | nav item | keep | |
| G-06 | `index.html:45`, `:487` | `Atuação` | nav item | keep | |
| G-07 | `index.html:46`, `:488` | `Inteligência setorial` | nav item | rewrite | Rename to `Publicações`: the section only lists the firm's publications, and "inteligência" overstates it. See Q-14. |
| G-08 | `index.html:47`, `:492` | `Contato` | nav item | keep | |
| G-09 | `cartilha-eleicoes-2026.html:53` and other publication pages | `Início` | nav item | keep | |
| G-10 | `index.html:51` | `Alternar alto contraste` / `Alto contraste` / `◐` | toggle button | drop | The new palette meets WCAG AA by design; a theme toggle is out of scope (`CLAUDE.md` rule 5). |
| G-11 | `index.html:55` | `Menu` | button label | keep | Mobile menu button. |
| G-12 | `index.html:63` | `Navegação` | menu heading | keep | Also the footer column title (`index.html:485`). |
| G-13 | `index.html:64` to `:67` | `01` to `04` next to menu items | decoration | drop | Decorative numbering. |
| G-14 | `index.html:69`, `:452`, `:482` | `Brasília · Distrito Federal` | location line | keep | |
| G-15 | `index.html:70`, `:438`, `:465`; `404.html:53`; `privacidade.html:81` | `contato@mouraeribeiro.adv.br` | email | keep | Old domain, kept in the single contact config file until the owner confirms the new `@mmec.adv.br` address (Q-03). |
| G-16 | `index.html:482` | `Direito da radiodifusão.` / `Brasília · Distrito Federal.` | footer tagline | keep | |
| G-17 | `index.html:491` | `Informações` | footer column title | keep | |
| G-18 | `index.html:493` | `Política de privacidade` | footer link | keep | |
| G-19 | `index.html:494` | `Termos de uso` | footer link | keep | |
| G-20 | `index.html:499`; all pages | `© <year> Machado Moura e Cardoso Advogados Associados.` | copyright | keep | Year is filled by JavaScript on most pages; the new site renders it at build time. |
| G-21 | `index.html:500` | `Desenvolvido por Henrique Moura.` | credit | drop | Credit for the legacy site; not on the new footer (Q-15). |
| G-22 | `index.html:501`; publication pages | `Voltar ao topo ↑` | link | drop | Not needed on short pages; no arrow glyphs. |
| G-23 | `privacidade.html:88`; `termos.html:56`; `404.html:46` | `Voltar à página inicial` | link | keep | |
| G-24 | `cartilha-eleicoes-2026.html:127` and other publication pages | `Material` / `Abrir PDF` / `Baixar PDF` | footer column | drop | Duplicates the page's own PDF buttons. |
| G-25 | `assets/css/site.css:111`, `:283`, `:303` | `MMC`, `MMC · BRASÍLIA` | CSS pseudo-element text | drop | Wrong short name (Q-01). Also decorative watermark text. |
| G-26 | `assets/js/site.js:62` | `Página reservada para a versão final do site.` | toast | drop | Placeholder message; no element triggers it. |
| G-27 | `index.html:7` | `theme-color` `#0d110f` | metadata | drop | Replaced by a brand token. |
| G-28 | `index.html:43`; all pages except the legal pages | `Navegação principal` | nav accessible name | keep | Add it to the legal pages too. |

## Home (`index.html`)

### Metadata

| ID | Source | Text | Type | Status | Note |
|---|---|---|---|---|---|
| H-01 | `index.html:8` | `Machado Moura e Cardoso Advogados Associados` | `<title>` | keep | |
| H-02 | `index.html:6` | `Machado Moura e Cardoso Advogados Associados. Advocacia especializada em radiodifusão, regulação e acompanhamento institucional em Brasília.` | meta description | rewrite | "especializada" may conflict with Provimento 205/2021, art. 3, III (Q-06). Suggested: "atuação em direito da radiodifusão". |

### Hero

| ID | Source | Text | Type | Status | Note |
|---|---|---|---|---|---|
| H-03 | `index.html:88` | `MMC` | monogram | drop | Wrong short name (Q-01). |
| H-04 | `index.html:89` | `Advocacia setorial · Brasília/DF` | eyebrow | keep | |
| H-05 | `index.html:91` | `Direito que compreende a radiodifusão.` | `h1` | rewrite | Slogan-like. A plain statement of what the firm does is more sober (OAB art. 3, § 1). |
| H-06 | `index.html:93` | `Assessoria e consultoria jurídica dedicada a emissoras, entidades e empresas do setor, com atuação regulatória, institucional, legislativa e preventiva.` | lead | keep | Factual. Consistent with, but broader than, the "Sobre o escritório" page of the PDFs (P1 p. 28, P2 p. 7). |
| H-07 | `index.html:99` | `Fale com o escritório` | button | keep | Neutral call to the contact section. |
| H-08 | `index.html:102` | `Conheça nossa atuação` | button | keep | |
| H-09 | `index.html:106` | `Principais atributos` | aside label | drop | Section dropped (H-10 to H-15). |
| H-10 | `index.html:109` | `Especialização setorial` | attribute | rewrite | Self-description; art. 3, III and IV (Q-06). Can be merged into the office text. |
| H-11 | `index.html:110` | `Conhecimento jurídico dedicado à radiodifusão.` | attribute text | rewrite | Same as H-10. |
| H-12 | `index.html:114` | `Presença institucional` | attribute | drop | Decorative claim. |
| H-13 | `index.html:115` | `Atuação estratégica em Brasília.` | attribute text | rewrite | Keep only the fact "em Brasília" (already in H-23). |
| H-14 | `index.html:118` | `Visão preventiva` | attribute | drop | Decorative claim. |
| H-15 | `index.html:119` | `Antecipação de riscos e gestão de prazos.` | attribute text | rewrite | Deadline management is a real service (H-50); state it there, not as a claim. |
| H-16 | `index.html:128` | `Desde 2004` | stamp | keep | Confirmed as the founding reference (Q-02). |
| H-17 | `index.html:131` | `Conheça o escritório` | scroll cue | drop | Animated scroll cue; not in the allowed vocabulary. |

### Ticker

| ID | Source | Text | Type | Status | Note |
|---|---|---|---|---|---|
| H-18 | `index.html:137` | `Frentes de atuação` | section label | drop | Marquee ticker is banned (`CLAUDE.md` rule 5). |
| H-19 | `index.html:139` to `:148` | `Radiodifusão`, `Regulação`, `Outorgas`, `Processos administrativos`, `Monitoramento normativo`, `Pareceres jurídicos` (repeated) | ticker items | drop | Component dropped. The terms are all covered by the practice areas (H-39 to H-62). |

### The office (`#escritorio`)

| ID | Source | Text | Type | Status | Note |
|---|---|---|---|---|---|
| H-20 | `index.html:155` | `O escritório` | eyebrow | keep | |
| H-21 | `index.html:156` | `Complexidade regulatória exige profundidade jurídica.` | `h2` | rewrite | Persuasive phrasing (art. 3, IV). |
| H-22 | `index.html:161` | `Machado Moura e Cardoso Advogados Associados atua de forma especializada no setor de radiodifusão, integrando experiência jurídica, legislativa e regulatória.` | lead | rewrite | Facts confirmed by the PDFs (P1 p. 28, P2 p. 7). Replace "de forma especializada" (Q-06). |
| H-23 | `index.html:165` | `Sediado em Brasília, o escritório acompanha de perto o ambiente normativo, regulatório e institucional que afeta emissoras, entidades e empresas do setor.` | paragraph | keep | |
| H-24 | `index.html:166` | `A atuação é orientada por segurança jurídica, prevenção de riscos e continuidade operacional.` | paragraph | rewrite | Acceptable as a description of method, but "continuidade operacional" reads as a promised result. Owner to read in Phase 3. |
| H-25 | `index.html:170` | `Posicionamento institucional` | block label | drop | Block dropped (H-26, H-27). |
| H-26 | `index.html:171` | `MMC` | mark | drop | Wrong short name (Q-01). |
| H-27 | `index.html:172` | `Profundidade jurídica, presença institucional e compreensão operacional do setor.` | statement | drop | Self-praise (art. 3, IV). |
| H-28 | `index.html:174` | `Explore nossa atuação` | link | rewrite | Duplicates H-08. |

### Metrics

| ID | Source | Text | Type | Status | Note |
|---|---|---|---|---|---|
| H-29 | `index.html:180` | `22+` / `anos de atuação` | animated counter | drop | No counter and no "22+"; "Desde 2004" (H-16) is the only time reference (Q-02). |
| H-30 | `index.html:184` | `360°` / `visão jurídica e regulatória` | metric | drop | Decorative, unverifiable (Q-04). |
| H-31 | `index.html:188` | `DF` / `presença estratégica em Brasília` | metric | drop | Not a metric; location already stated (Q-04). |
| H-32 | `index.html:192` | `01` / `foco setorial: radiodifusão` | metric | drop | Decorative (Q-04). |

### Practice areas (`#atuacao`)

| ID | Source | Text | Type | Status | Note |
|---|---|---|---|---|---|
| H-33 | `index.html:201` | `Atuação MMC` | eyebrow | rewrite | Wrong short name. Use `Atuação`. |
| H-34 | `index.html:202` | `Assessoria jurídica integrada à operação do setor.` | `h2` | rewrite | Plain heading preferred. |
| H-35 | `index.html:205` | `Selecione uma área para conhecer o escopo de trabalho e os principais pontos de atenção.` | instruction | drop | Tab interface instruction; the new page shows all areas without tabs (readable without JavaScript). |
| H-36 | `index.html:210` | `Áreas de atuação` | tablist label | keep | Use as the accessible name of the list. |
| H-37 | `index.html:212` to `:227` | `01` to `06` + tab titles `Assessoria permanente`, `Regulação e legislação`, `Outorgas e renovações`, `Órgãos públicos`, `Pareceres e estudos`, `Monitoramento normativo` | tabs | rewrite | Titles are reused as `h3` labels (see panel labels). Numbering may stay as small caps if the design uses numbered sections. |
| H-38 | `index.html:233`, `:248`, `:263`, `:278`, `:293`, `:308` | `A`, `R`, `O`, `P`, `E`, `M` | panel letters | drop | Decoration. |
| H-39 | `index.html:234` | `Assessoria jurídica permanente` | area label | keep | Matches P1 p. 28 and P2 p. 7. |
| H-40 | `index.html:235` | `Suporte contínuo para decisões jurídicas e regulatórias.` | area heading | keep | |
| H-41 | `index.html:237` | `Acompanhamento recorrente das demandas do cliente, com análise preventiva, orientação estratégica e resposta a questões operacionais do setor.` | area text | keep | |
| H-42 | `index.html:241` to `:243` | `Consultoria jurídica recorrente` / `Revisão de riscos regulatórios` / `Apoio a decisões administrativas` | list | keep | |
| H-43 | `index.html:249` | `Regulação e legislação` | area label | keep | |
| H-44 | `index.html:250` | `Leitura técnica das normas que estruturam o setor.` | area heading | keep | |
| H-45 | `index.html:252` | `Interpretação de alterações normativas, atos administrativos e projetos legislativos, com avaliação de impactos e definição de medidas de adequação.` | area text | keep | |
| H-46 | `index.html:256` to `:258` | `Análise de normas e atos` / `Avaliação de impacto regulatório` / `Orientação de conformidade` | list | keep | |
| H-47 | `index.html:264` | `Outorgas e renovações` | area label | keep | Matches "Assessoria em prazos e renovação de outorga" (P1 p. 28). |
| H-48 | `index.html:265` | `Gestão jurídica de etapas críticas da operação.` | area heading | keep | |
| H-49 | `index.html:267` | `Assessoria em processos relacionados a outorgas, renovações, transferências e regularidade documental, com atenção a prazos e exigências formais.` | area text | keep | |
| H-50 | `index.html:271` to `:273` | `Renovação de outorgas` / `Regularidade documental` / `Gestão de prazos críticos` | list | keep | |
| H-51 | `index.html:279` | `Órgãos públicos` | area label | keep | |
| H-52 | `index.html:280` | `Acompanhamento técnico de processos administrativos.` | area heading | keep | |
| H-53 | `index.html:282` | `Gestão jurídica de procedimentos, protocolos, diligências e acompanhamento institucional perante órgãos públicos sediados em Brasília.` | area text | keep | |
| H-54 | `index.html:286` to `:288` | `Processos administrativos` / `Protocolos e diligências` / `Acompanhamento institucional` | list | keep | |
| H-55 | `index.html:294` | `Pareceres e estudos` | area label | keep | |
| H-56 | `index.html:295` | `Fundamentação jurídica para decisões complexas.` | area heading | keep | |
| H-57 | `index.html:297` | `Elaboração de pareceres, estudos técnicos e informativos destinados a subsidiar decisões internas, operações e posicionamentos institucionais.` | area text | keep | |
| H-58 | `index.html:301` to `:303` | `Pareceres jurídicos` / `Estudos setoriais` / `Informativos técnicos` | list | keep | |
| H-59 | `index.html:309` | `Monitoramento normativo` | area label | keep | |
| H-60 | `index.html:310` | `Informação relevante no momento adequado.` | area heading | rewrite | Slogan; replace with a plain description. |
| H-61 | `index.html:312` | `Acompanhamento de publicações oficiais, mudanças legislativas e atos regulatórios, com triagem e comunicação de impactos aos clientes.` | area text | keep | |
| H-62 | `index.html:316` to `:318` | `Diário Oficial da União` / `Atos normativos` / `Alertas regulatórios` | list | keep | |

### Positioning (no anchor)

| ID | Source | Text | Type | Status | Note |
|---|---|---|---|---|---|
| H-63 | `index.html:328` | radar rings and beam around the symbol | animation | drop | Banned radar motif; the symbol is not a radio wave (`docs/brand.md`). |
| H-64 | `index.html:338` | `Nosso posicionamento` | eyebrow | drop | Section dropped. |
| H-65 | `index.html:339` | `Antecipar movimentos. Reduzir riscos. Sustentar decisões.` | `h2` | drop | Slogan that implies outcomes (art. 3, IV; art. 6). |
| H-66 | `index.html:345` | `Profundidade técnica` / `Análise detalhada, fundamentação consistente e conhecimento setorial.` | principle | drop | Self-praise (art. 3, IV) (Q-07). |
| H-67 | `index.html:352` | `Proximidade` / `Atendimento direto e compreensão da realidade operacional do cliente.` | principle | drop | Self-praise (art. 3, IV) (Q-07). |
| H-68 | `index.html:359` | `Responsividade` / `Organização de prazos e resposta ágil às mudanças do ambiente regulatório.` | principle | drop | "resposta ágil" reads as a service-level promise (Q-07). |

### Publications (`#inteligencia`)

| ID | Source | Text | Type | Status | Note |
|---|---|---|---|---|---|
| H-69 | `index.html:371` | `Inteligência setorial` | eyebrow | rewrite | Becomes `Publicações` (Q-14). |
| H-70 | `index.html:372` | `Conteúdo para decisões mais informadas.` | `h2` | rewrite | Marketing phrasing. |
| H-71 | `index.html:374` to `:377` | `Filtrar conteúdos` / `Todos` / `Regulação` / `Outorgas` | filter | drop | Three items do not need filters; the `Outorgas` filter matches no item. |
| H-72 | `index.html:387`, `:399` | `Direito eleitoral · 2026` | category | keep | |
| H-73 | `index.html:388` | `Eleições 2026: implicações no rádio e na televisão` | card title | keep | Matches the PDF title (P1). |
| H-74 | `index.html:389` | `Cartilha operacional sobre calendário eleitoral, pesquisas, programação, debates, horário gratuito e direito de resposta.` | card text | keep | Matches P1 sections. |
| H-75 | `index.html:390` | `Acessar a cartilha` | link | keep | |
| H-76 | `index.html:400` | `Propaganda Partidária 2026 no rádio e na televisão` | card title | keep | Matches P2. |
| H-77 | `index.html:401` | `Orientações para emissoras sobre exibição, distribuição horária, dias de veiculação, reserva, entrega de mídia e programação normal.` | card text | keep | |
| H-78 | `index.html:411` | `Regulação · 2026` | category | keep | |
| H-79 | `index.html:412` | `Calendário A Voz do Brasil 2026` | card title | keep | |
| H-80 | `index.html:413` | `Portaria MCOM nº 22.129/2026 com hipóteses de flexibilização, dispensa e calendário anual de eventos.` | card text | keep | Matches P3. |
| H-81 | `index.html:414` | `Acessar o documento` | link | keep | |
| H-82 | `index.html:384` | `Capa da cartilha Eleições 2026 - implicações no rádio e na televisão` | image alt | keep | Use an en dash or colon. |
| H-83 | `index.html:396` | `Capa da cartilha Propaganda Partidária 2026 no rádio e na televisão` | image alt | keep | |
| H-84 | `index.html:408` | `Prévia do calendário A Voz do Brasil 2026` | image alt | keep | |

### Brand band

| ID | Source | Text | Type | Status | Note |
|---|---|---|---|---|---|
| H-85 | `index.html:420` | `Posicionamento da marca` | section label | drop | Section dropped. |
| H-86 | `index.html:422` | `MMC` | mark | drop | Wrong short name (Q-01). |
| H-87 | `index.html:423` | `Advocacia setorial para quem comunica, opera e transforma a radiodifusão brasileira.` | statement | drop | Marketing slogan aimed at prospective clients (art. 3, IV; art. 2, VIII). |
| H-88 | `index.html:424` | `Converse com o escritório` | link | drop | Duplicate call to contact. |

### Contact (`#contato`)

| ID | Source | Text | Type | Status | Note |
|---|---|---|---|---|---|
| H-89 | `index.html:431` | `Contato` | eyebrow | keep | |
| H-90 | `index.html:432` | `Converse com o escritório.` | `h2` | keep | Neutral. |
| H-91 | `index.html:434` | `Atendimento jurídico e institucional a empresas e entidades do setor de radiodifusão.` | paragraph | keep | |
| H-92 | `index.html:439` | `E-mail` | label | keep | |
| H-93 | `index.html:443` | `Telefone` / `(61) 3703-5558` / `tel:+556137035558` | phone | keep | Publish both numbers: `(61) 3703-5558` and `(61) 3879-5003` (source: P1, P2). The second is labelled as WhatsApp and is the only one with a WhatsApp link (Q-05). |
| H-94 | `index.html:453` | `SHIS QI 05, Bloco F, Sala 332` | address | keep | Matches P1 and P2. P3 adds the postcode `CEP 71.615-560` (Q-05). |
| H-95 | `index.html:454` | `Lago Sul · Brasília/DF` | address | keep | |
| H-96 | `index.html:457` | `Mapa do escritório em Brasília` (embedded Google Maps iframe) | map | drop | No iframe; the address is shown as text with a plain map link (Q-10). |
| H-97 | `index.html:466` | `Enviar mensagem` | button | keep | `mailto:` link. |
| H-98 | `index.html:470` | `Abrir no Google Maps` (link to the "MOURA E RIBEIRO ADVOGADOS ASSOCIADOS" listing) | link | rewrite | The owner has renamed the listing. Phase 3 checks it shows the current firm name: if so, link to the listing; otherwise to the coordinates `-15.8521537,-47.8945894` (Q-03). |

## Publication: Eleições 2026 (`cartilha-eleicoes-2026.html`)

| ID | Source | Text | Type | Status | Note |
|---|---|---|---|---|---|
| E-01 | `:7` | `Eleições 2026 \| Machado Moura e Cardoso` | `<title>` | keep | |
| E-02 | `:6` | `Cartilha Eleições 2026: implicações no rádio e na televisão, produzida por Machado Moura e Cardoso Advogados Associados.` | meta description | keep | |
| E-03 | `:36` | `Voltar ao início` | link label | keep | |
| E-04 | `:65` | `Cartilha jurídica · Eleições 2026` | eyebrow | keep | |
| E-05 | `:66` | `Eleições 2026: implicações no rádio e na televisão.` | `h1` | keep | |
| E-06 | `:67` | `Guia operacional para emissoras sobre prazos, restrições, procedimentos e controles aplicáveis ao período eleitoral.` | lead | keep | Matches P1 p. 2 ("Objetivo da cartilha"). |
| E-07 | `:70` | `Abrir PDF completo` | button | keep | |
| E-08 | `:73` | `Baixar cartilha` | button | keep | |
| E-09 | `:77` | `Capa da cartilha Eleições 2026` | image alt | keep | |
| E-10 | `:85`; `cartilha-propaganda-partidaria-2026.html:86`; `calendario-voz-do-brasil-2026.html:88` | `Resumo executivo` | eyebrow | keep | Same label in the PDFs. |
| E-11 | `:86` | `Orientação prática para prevenção de risco jurídico e operacional.` | `h2` | keep | Paraphrases P1 p. 2. |
| E-12 | `:89` | `O material organiza as principais obrigações eleitorais das emissoras em seis frentes operacionais.` | lead | keep | |
| E-13 | `:90` | `Cada seção apresenta o que observar, quando agir, quais evidências manter e quais riscos evitar.` | paragraph | keep | Matches P1 p. 2 ("Estrutura de uso"). |
| E-14 | `:90` | `As orientações são gerais e não substituem a análise jurídica de casos concretos.` | paragraph | keep | |
| E-15 | `:92` | `6` / `seções operacionais` | metric | rewrite | Facts match P1 p. 2. Present as text, not as big-number tiles. |
| E-16 | `:93` | `48h` / `prazo do direito de resposta` | metric | rewrite | P1 p. 2 is more precise: "Prazo do direito de resposta na programação normal". Use the PDF wording. |
| E-17 | `:94` | `24h` / `suspensão possível da programação` | metric | rewrite | P1 p. 2: "suspensão possível da programação por infrações específicas". Use the PDF wording. |
| E-18 | `:102`; `cartilha-propaganda-partidaria-2026.html:103` | `Conteúdo da cartilha` | eyebrow | keep | |
| E-19 | `:103` | `Seis áreas críticas para a operação das emissoras.` | `h2` | keep | |
| E-20 | `:105` | `01` `Calendário eleitoral` / `Prazos críticos, marcos operacionais e controles internos.` | topic | keep | |
| E-21 | `:106` | `02` `Pesquisas` / `Registro, divulgação, checagem documental e riscos.` | topic | keep | |
| E-22 | `:107` | `03` `Programação normal` / `Condutas vedadas, jornalismo e critérios de isonomia.` | topic | keep | |
| E-23 | `:108` | `04` `Debates` / `Regras, convites, acessibilidade e arquivamento de evidências.` | topic | keep | |
| E-24 | `:109` | `05` `Horário gratuito` / `Plano de mídia, entrega de materiais e tratamento de ocorrências.` | topic | keep | |
| E-25 | `:110` | `06` `Direito de resposta` / `Prazos, rito operacional e obrigações de veiculação.` | topic | keep | |
| E-26 | `:117` | `Aviso jurídico` | box title | keep | |
| E-27 | `:118` | `Este material apresenta orientações gerais para as Eleições de 2026. Casos concretos devem ser submetidos à análise jurídica específica, considerando eventuais alterações normativas e decisões da Justiça Eleitoral.` | disclaimer | keep | |

## Publication: Propaganda Partidária 2026 (`cartilha-propaganda-partidaria-2026.html`)

| ID | Source | Text | Type | Status | Note |
|---|---|---|---|---|---|
| PP-01 | `:7` | `Propaganda Partidária 2026 \| Machado Moura e Cardoso` | `<title>` | keep | |
| PP-02 | `:6` | `Cartilha Propaganda Partidária 2026 no rádio e na televisão, produzida por Machado Moura e Cardoso Advogados Associados.` | meta description | keep | |
| PP-03 | `:66` | `Cartilha jurídica · 2026` | eyebrow | keep | |
| PP-04 | `:67` | `Propaganda Partidária 2026 no rádio e na televisão.` | `h1` | keep | |
| PP-05 | `:68` | `Orientações básicas para emissoras sobre veiculação, horários, reservas de espaço, entrega de mídia e providências operacionais.` | lead | keep | |
| PP-06 | `:71`, `:74` | `Abrir PDF completo` / `Baixar cartilha` | buttons | keep | |
| PP-07 | `:78` | `Capa da cartilha Propaganda Partidária 2026` | image alt | keep | |
| PP-08 | `:87` | `Informação prática para a rotina das emissoras.` | `h2` | keep | |
| PP-09 | `:90` | `O material reúne as principais orientações aplicáveis à propaganda partidária no rádio e na televisão durante o primeiro semestre de 2026.` | lead | keep | Matches P2 p. 2. |
| PP-10 | `:91` | `A nova edição organiza exibição, distribuição horária, dias de veiculação, reserva do espaço, entrega de mídia e hipóteses de manutenção da programação normal.` | paragraph | rewrite | "A nova edição" is relative to the replaced edition; drop that phrase. |
| PP-11 | `:93` | `1º sem.` / `período de exibição em 2026` | metric | rewrite | As text, not a tile. |
| PP-12 | `:94` | `19h30–22h30` / `faixa da programação normal` | metric | rewrite | Inaccurate paraphrase: P2 p. 2 says the insertions run in the **intervals** of normal programming between 19h30 and 22h30. Use the PDF wording. |
| PP-13 | `:95` | `10` / `inserções de 30 segundos por dia` | metric | rewrite | P2 p. 5: "máximo de inserções por dia". Say "até 10". |
| PP-14 | `:104` | `Seis pontos centrais para a operação.` | `h2` | keep | |
| PP-15 | `:106` | `01` `Exibição` / `Período, faixa de horário, duração e limite diário das inserções.` | topic | keep | |
| PP-16 | `:107` | `02` `Distribuição horária` / `Quantidade de inserções por faixa e intervalo mínimo entre veiculações.` | topic | keep | |
| PP-17 | `:108` | `03` `Dias de veiculação` / `Distribuição semanal das inserções nacionais e estaduais.` | topic | keep | |
| PP-18 | `:109` | `04` `Reserva do espaço` / `Comunicação prévia, decisão ou certidão e apresentação do mapa de mídia.` | topic | keep | |
| PP-19 | `:110` | `05` `Entrega de mídia` / `Prazos, tecnologia compatível, especificações técnicas e forma de recebimento.` | topic | keep | |
| PP-20 | `:111` | `06` `Programação normal` / `Hipóteses em que a emissora pode manter sua grade regular.` | topic | keep | |
| PP-21 | `:118` | `Aviso jurídico` | box title | keep | |
| PP-22 | `:119` | `O material possui caráter informativo e geral.` | disclaimer | keep | |
| PP-23 | `:119` | `Situações específicas devem ser submetidas à análise jurídica do escritório, considerando as circunstâncias concretas e eventuais alterações normativas.` | disclaimer | rewrite | "do escritório" points readers to hire the firm (possible solicitation, art. 2, VIII). Align with E-27: "à análise jurídica específica". Q-08. |

## Publication: Calendário A Voz do Brasil 2026 (`calendario-voz-do-brasil-2026.html`)

| ID | Source | Text | Type | Status | Note |
|---|---|---|---|---|---|
| VB-01 | `:7` | `Calendário A Voz do Brasil 2026 \| Machado Moura e Cardoso` | `<title>` | keep | |
| VB-02 | `:6` | `Portaria MCOM nº 22.129/2026 e calendário de flexibilização ou dispensa de A Voz do Brasil em 2026.` | meta description | keep | |
| VB-03 | `:68` | `Clipping regulatório · 2026` | eyebrow | keep | |
| VB-04 | `:69` | `Calendário de flexibilização ou dispensa de A Voz do Brasil.` | `h1` | keep | |
| VB-05 | `:70` | `Portaria MCOM nº 22.129, de 23 de março de 2026, com as hipóteses gerais e o calendário anual aplicável às emissoras de radiodifusão sonora.` | lead | keep | Matches P3. |
| VB-06 | `:73`, `:76` | `Abrir PDF completo` / `Baixar documento` | buttons | keep | |
| VB-07 | `:80` | `Prévia do calendário A Voz do Brasil 2026` | image alt | keep | |
| VB-08 | `:89` | `Flexibilização e dispensa durante o ano de 2026.` | `h2` | keep | |
| VB-09 | `:92` | `A Portaria aprova o calendário de flexibilização ou dispensa do horário de retransmissão do programa A Voz do Brasil para 2026.` | lead | keep | Matches P3, art. 1. |
| VB-10 | `:93` | `O documento também disciplina hipóteses gerais relacionadas a datas comemorativas, coberturas jornalísticas excepcionais, eventos esportivos, manifestações culturais e reuniões de Casas Legislativas.` | paragraph | keep | Matches P3, arts. 2, 3, 6 and 7. |
| VB-11 | `:95` | `2026` / `ano de referência` | metric | rewrite | As text. |
| VB-12 | `:96` | `19h` / `inserção sobre horário alternativo` | metric | rewrite | P3, art. 5, II: daily at 19h local time, except Saturdays, Sundays and holidays. Add that qualifier. |
| VB-13 | `:97` | `2027` / `vigência até novo calendário` | metric | rewrite | P3, art. 8: valid until the 2027 calendar is published. Say that in full. |
| VB-14 | `:105` | `Pontos centrais` | eyebrow | keep | |
| VB-15 | `:106` | `Regras gerais e calendário de eventos.` | `h2` | keep | |
| VB-16 | `:108` | `01` `Datas comemorativas` / `Dispensa para ações, eventos ou informações ligados a aniversários de municípios, estados e respectivos padroeiros.` | topic | keep | P3, art. 2. |
| VB-17 | `:109` | `02` `Coberturas excepcionais` / `Possibilidade de flexibilização ou dispensa em acontecimentos de grande apelo ou repercussão pública noticiados ao vivo.` | topic | keep | P3, art. 3. |
| VB-18 | `:110` | `03` `Eventos específicos` / `Hipóteses relacionadas a partidas de futebol, manifestações culturais e artísticas e eventos esportivos de pessoas com deficiência.` | topic | keep | P3, art. 6. |
| VB-19 | `:111` | `04` `Calendário anual` / `Anexo com eventos, datas, modalidade, abrangência, município e unidade da Federação.` | topic | keep | P3, annex. |
| VB-20 | `:118` | `Aviso jurídico` | box title | keep | |
| VB-21 | `:119` | `Este conteúdo possui caráter informativo. A aplicação das hipóteses de flexibilização ou dispensa deve considerar a modalidade, a abrangência territorial e as condições previstas na Portaria e em seu Anexo.` | disclaimer | keep | |

## Privacy policy (`privacidade.html`)

The policy must be rewritten after the analytics decision in Phase 5 (`0003-analytics`). Rows record what the current text says so the rewrite starts from verified facts.

| ID | Source | Text | Type | Status | Note |
|---|---|---|---|---|---|
| PR-01 | `:6` | `Política de Privacidade \| Machado Moura e Cardoso` | `<title>` | keep | |
| PR-02 | `:54` | `Política de Privacidade` | `h1` | keep | |
| PR-03 | `:55` | `Última atualização: Junho de 2026` | date | rewrite | Set to the date the new text is approved. |
| PR-04 | `:57` | `O escritório Machado Moura e Cardoso Advogados Associados está comprometido com a proteção dos seus dados pessoais e com a sua privacidade.` | paragraph | keep | |
| PR-05 | `:57` | `Esta Política de Privacidade explica como coletamos, usamos e protegemos as informações de quem visita nosso site (mmec.adv.br), em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).` | paragraph | keep | |
| PR-06 | `:59` | `1. Dados que coletamos` | `h2` | keep | |
| PR-07 | `:60` | `Durante a navegação em nosso site, podemos coletar os seguintes tipos de dados:` | paragraph | keep | |
| PR-08 | `:62` | `Dados de navegação (Cookies): Coletamos informações automáticas sobre como você interage com o nosso site, como endereço IP, tipo de navegador, páginas visitadas, tempo de permanência e cliques.` | list item | rewrite | Describe Cloudflare Web Analytics (cookieless) instead; Phase 5 verifies what it collects (Q-09). |
| PR-09 | `:63` | `Dados fornecidos voluntariamente: Caso você entre em contato conosco via e-mail ou WhatsApp, coletaremos os dados necessários para o atendimento (como nome, e-mail, telefone e o conteúdo da mensagem).` | list item | keep | WhatsApp is now a published contact channel (Q-05, Q-09). |
| PR-10 | `:66` | `2. Como usamos as ferramentas de rastreamento` | `h2` | rewrite | No tracking tools remain; retitle for the analytics actually used (Q-09). |
| PR-11 | `:67` | `Utilizamos ferramentas de terceiros para melhorar a experiência do usuário e analisar o tráfego do nosso site:` | paragraph | rewrite | Describe Cloudflare Web Analytics and Google Search Console (Q-09). |
| PR-12 | `:69` | `Google Analytics 4: Utilizado para entender o volume de acessos, a região geográfica dos visitantes e quais materiais (como nossas cartilhas) são mais acessados. Os dados são anonimizados pelo Google.` | list item | drop | GA4 is not carried over (Q-09). |
| PR-13 | `:70` | `Microsoft Clarity: Utilizado para entender a usabilidade do site por meio de métricas comportamentais, mapas de calor e repetição de sessões. O Clarity oculta automaticamente dados sensíveis digitados no site.` | list item | drop | Clarity is not carried over (Q-09). |
| PR-14 | `:73` | `3. Compartilhamento de Dados` | `h2` | keep | |
| PR-15 | `:74` | `O escritório não vende, aluga ou compartilha seus dados pessoais com terceiros para fins de marketing.` | paragraph | keep | |
| PR-16 | `:74` | `Os dados de navegação são compartilhados apenas com os provedores das ferramentas de análise (Google e Microsoft) sob rigorosos termos de confidencialidade.` | paragraph | drop | Unverifiable, and Google Analytics and Clarity are dropped. Phase 4 describes the actual processors from verified facts (Q-09). |
| PR-17 | `:76` | `4. Seus Direitos (LGPD)` | `h2` | keep | |
| PR-18 | `:77` | `Você tem o direito de confirmar a existência de tratamento, acessar seus dados, solicitar a correção de dados incompletos ou a exclusão de dados desnecessários.` | paragraph | rewrite | Partial list of LGPD art. 18 rights. Phase 4 to complete it from the law text. |
| PR-19 | `:77` | `Para exercer seus direitos, entre em contato através do e-mail oficial listado abaixo.` | paragraph | keep | |
| PR-20 | `:79` | `5. Contato` | `h2` | keep | |
| PR-21 | `:80` | `Se você tiver qualquer dúvida sobre esta Política de Privacidade, entre em contato conosco:` | paragraph | keep | |
| PR-22 | `:81`, `:82` | `E-mail: contato@mouraeribeiro.adv.br` / `Endereço: SHIS QI 05, Bloco F, Sala 332 - Lago Sul, Brasília/DF` | contact | keep | Email from the config file (G-15). |
| PR-23 | `:12` to `:28` | Microsoft Clarity `xbqs6gzxzi` and Google Analytics `G-F8TPY82JGN` loaded without consent | scripts | drop | Not copy, recorded for the analytics decision. The policy names neither the controller nor an encarregado (Q-09). |

## Terms of use (`termos.html`)

| ID | Source | Text | Type | Status | Note |
|---|---|---|---|---|---|
| T-01 | `:6` | `Termos de Uso \| Machado Moura e Cardoso` | `<title>` | keep | |
| T-02 | `:35` | `Termos de Uso` | `h1` | keep | |
| T-03 | `:36` | `Última atualização: Junho de 2026` | date | rewrite | Approval date of the new text. |
| T-04 | `:38` | `Bem-vindo ao site do escritório Machado Moura e Cardoso Advogados Associados.` | paragraph | keep | |
| T-05 | `:38` | `Ao acessar e utilizar este site (mmec.adv.br), você concorda com os seguintes Termos de Uso.` | paragraph | keep | |
| T-06 | `:40` | `1. Natureza Informativa` | `h2` | keep | |
| T-07 | `:41` | `Todo o conteúdo disponibilizado neste site, incluindo artigos, cartilhas, calendários regulatórios e informativos, possui caráter estritamente informativo e institucional.` | paragraph | rewrite | The site has no articles; list only what exists. |
| T-08 | `:41` | `Nenhum conteúdo deste site deve ser interpretado como aconselhamento jurídico, parecer ou recomendação legal.` | paragraph | keep | |
| T-09 | `:41` | `A leitura dos materiais não cria uma relação advogado-cliente.` | paragraph | keep | |
| T-10 | `:43` | `2. Propriedade Intelectual` | `h2` | keep | |
| T-11 | `:44` | `Todos os textos, imagens, cartilhas em PDF, logotipos e design apresentados neste site são de propriedade exclusiva do escritório Machado Moura e Cardoso Advogados Associados, estando protegidos pela Lei de Direitos Autorais (Lei nº 9.610/1998).` | paragraph | keep | P3 reproduces an official act (Portaria MCOM), which is not the firm's property; Phase 4 should qualify "todos". |
| T-12 | `:44` | `É permitida a leitura e o download dos materiais (como cartilhas eleitorais) para uso pessoal e operacional.` | paragraph | rewrite | Align with the PDFs: reading and downloading allowed, reproduction only in full (Q-11). |
| T-13 | `:44` | `A reprodução comercial ou modificação sem autorização prévia é estritamente proibida.` | paragraph | rewrite | Same alignment as T-12 (Q-11). |
| T-14 | `:46` | `3. Links de Terceiros` | `h2` | keep | |
| T-15 | `:47` | `Nosso site pode conter links para sites de terceiros (como sistemas do Governo Federal, Anatel ou Ministério das Comunicações).` | paragraph | rewrite | The site has no such links today; keep the general clause without examples. |
| T-16 | `:47` | `Não nos responsabilizamos pelo conteúdo, políticas de privacidade ou práticas desses sites externos.` | paragraph | keep | |
| T-17 | `:49` | `4. Alterações nos Termos` | `h2` | keep | |
| T-18 | `:50` | `O escritório reserva-se o direito de atualizar ou modificar estes Termos de Uso a qualquer momento, sem aviso prévio.` | paragraph | keep | |
| T-19 | `:50` | `Recomendamos que os usuários visitem esta página periodicamente.` | paragraph | keep | |

## Not-found page (`404.html`)

| ID | Source | Text | Type | Status | Note |
|---|---|---|---|---|---|
| NF-01 | `:8` | `Página não encontrada \| Machado Moura e Cardoso` | `<title>` | keep | |
| NF-02 | `:7` | `Página não encontrada no site Machado Moura e Cardoso Advogados Associados.` | meta description | keep | Page stays `noindex` (`:6`). |
| NF-03 | `:27` | `Voltar à página inicial` | link label | keep | |
| NF-04 | `:42` | `404` | display code | keep | |
| NF-05 | `:43` | `Página não encontrada` | eyebrow | keep | |
| NF-06 | `:44` | `O endereço acessado não está disponível.` | `h1` | keep | |
| NF-07 | `:45` | `A página pode ter sido removida, atualizada ou digitada incorretamente.` | paragraph | keep | |
| NF-08 | `:45` | `Retorne ao início para acessar o conteúdo institucional e as publicações do escritório.` | paragraph | keep | |

## PDF publications

Text extracted with `pdftotext` for inventory only. The PDFs are served unchanged; the full text is not copied here.

| ID | File | Title (from the document) | Pages | Description | Facts reusable as a source |
|---|---|---|---|---|---|
| P1 | `assets/docs/cartilha-eleicoes-2026.pdf` (423 KB) | Eleições 2026: Implicações no rádio e na televisão | 29 (landscape, PowerPoint export) | Operational guide for radio and TV stations on the 2026 election: calendar, polls, normal programming, debates, free airtime, right of reply, case-law risk map and an internal action plan. | p. 2 summary and metrics; p. 3 section map; p. 28 "Sobre o escritório" (description and six service lines); p. 29 copyright notice. Contact footer on every page except p. 29: address, `Telefone / WhatsApp (61) 3879-5003`, old email. |
| P2 | `assets/docs/cartilha-propaganda-partidaria-2026.pdf` (155 KB) | Cartilha Propaganda Partidária 2026 no rádio e na televisão | 8 (landscape, PowerPoint export) | Basic guidance for stations on party political broadcasts in the first half of 2026: time bands, distribution, days, reservation, media delivery and normal programming. | p. 2 summary and metrics; p. 5 time-band grid; p. 6 operational chain; p. 7 "Sobre o escritório" (same six service lines as P1); p. 8 copyright notice. Contact footer on every page except p. 8: address, `(61) 3703-5558 / 3879-5003`, old email. |
| P3 | `assets/docs/calendario-voz-do-brasil-2026.pdf` (209 KB) | Clipping do Diário Oficial da União, 10.04.2026: Portaria MCOM nº 22.129, de 23 de março de 2026 | 4 (portrait) | Reproduction of the ministerial order approving the 2026 calendar for waiving or rescheduling the mandatory "A Voz do Brasil" broadcast, with general rules and an annex of events. | Arts. 1 to 8 and the annex. The letterhead mixes an **old address** (`SHIS QI 21 Conjunto 07 Casa 17, Lago Sul, CEP 71.655-270`, `(61) 3703.5558`), the current address with `CEP 71.615-560` and `Telefone / Whatsapp (61) 3879.5003`, and a "MOURA E ..." text fragment, likely the former firm name (Q-12). |

### Facts from the PDFs not on the legacy site

| ID | Source | Text | Status | Note |
|---|---|---|---|---|
| PDF-01 | P1 p. 28; P2 p. 7 | `Escritório sediado em Brasília/DF, com atuação especializada em radiodifusão e experiência jurídica, legislativa e regulatória no setor.` | rewrite | Same fact as H-22; same "especializada" issue (Q-06). |
| PDF-02 | P1 p. 28 | `Análise regulatória, técnica, cível, penal, eleitoral, fiscal, tributária e trabalhista` | drop | Not listed on the site (Q-13). |
| PDF-03 | P1 p. 28 | `Acompanhamento de procedimentos perante órgãos públicos em Brasília` / `Monitoramento de atos no Diário Oficial da União` / `Estudos técnicos, pareceres e informativos jurídicos setoriais` / `Assessoria em prazos e renovação de outorga` / `Assessoria jurídica permanente em radiodifusão` | keep | Confirms the six practice areas (H-39 to H-62). |
| PDF-04 | P1 p. 29; P2 p. 8 | `Esta obra intelectual é protegida pela Lei nº 9.610/1998. Autorizada apenas a reprodução integral.` | keep | The terms follow this rule (Q-11). |
| PDF-05 | P3 | `CEP 71.615-560` | keep | Confirmed postcode of SHIS QI 05, Bloco F, Sala 332 (Q-05). |

## Facts provided by the owner

| ID | Source | Text | Type | Status | Note |
|---|---|---|---|---|---|
| OWN-01 | Owner answer to Q-17 | `OAB/DF 0100104RS` | OAB registration of the firm | keep | Footer, exactly as written. Number final including the "RS" suffix; seccional OAB/DF confirmed. Phase 7 compares the footer with the registration certificate. |

## Images and icons

| ID | File | Size | Status | Note |
|---|---|---|---|---|
| IMG-01 | `assets/images/brand/logo-horizontal.png` | 1050×600, 43 KB | drop | Replaced by `mmec-logo-horizontal-*.svg` from the brand folder. |
| IMG-02 | `assets/images/brand/logo-vertical.png` | 2000×2000, 204 KB | drop | Unused on the legacy site; replaced by the stacked logo. |
| IMG-03 | `assets/images/brand/simbolo.png` | 2000×2000, 180 KB | drop | Replaced by `mmec-symbol-*.svg`. Used inside the radar animation. |
| IMG-04 | `assets/images/publicacoes/capa-cartilha-eleicoes-2026.png` | 1920×1080, 100 KB | keep | Cover of P1. Convert to AVIF/WebP in Phase 4. |
| IMG-05 | `assets/images/publicacoes/capa-propaganda-partidaria-2026.png` | 1920×1080, 101 KB | keep | Cover of P2. |
| IMG-06 | `assets/images/publicacoes/capa-calendario-voz-do-brasil-2026.png` | 1600×900, 274 KB | keep | Kept in the preview. If a new export with the current letterhead arrives before Phase 7, regenerate the cover from it; otherwise serve as is and record a known issue (Q-12). |
| IMG-07 | `assets/icons/favicon-32x32.png`, `favicon-192x192.png`, `apple-touch-icon.png` | 32, 192, 180 px | drop | Replaced per `docs/brand.md` (provisional favicon needs owner approval). |

## Technical facts from the legacy site

Not copy, but they constrain later phases.

| ID | Source | Fact | Phase |
|---|---|---|---|
| TF-01 | all pages except `termos.html` and `404.html` | Google Analytics 4 (`G-F8TPY82JGN`) and Microsoft Clarity (`xbqs6gzxzi`) load before any consent. | 5 |
| TF-02 | `_headers` | Headers set: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`. No CSP, no HSTS. Confirmed on the live site on 2026-10-26. | 5 |
| TF-03 | `wrangler.jsonc` | Worker `mmec`, assets from `./public`, `not_found_handling: 404-page`, default `html_handling` (extensionless URLs; `.html` paths answer `307` to the extensionless path). | 1, 8 |
| TF-04 | `sitemap.xml` | Lists only the home and the three publications, with `.html` URLs. Privacy and terms are missing. | 5 |
| TF-05 | legacy `README.md` | Names the preview Worker `mmec-next`; `CLAUDE.md` names it `mmec-site` (Q-16). | 1 |
