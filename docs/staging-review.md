# Phase 7: staging review

Independent review of the complete site before the cutover, done on 2026-10-27 on branch `docs/staging-review` (`docs/phases/07-staging-review.md`). Scope: the whole project from the initial commit `81dc878`, the built `dist/`, and the preview Worker `https://mmec-site.rodolfo-e70.workers.dev` (deployed from `main` at `f3a3733`).

Related documents: [`parity.md`](parity.md) (content compared with the legacy site), [`launch-checklist.md`](launch-checklist.md) (Phase 8 steps), [`audit-06.md`](audit-06.md) (accessibility and performance, manual checks of the gate in section 8).

## 1. Checks run

| Check | Command or method | Result |
|---|---|---|
| Full check suite | `npm run check` | Pass: lint, typecheck, build, html-validate 0 errors, 102 links 0 broken, 41 legacy URLs 0 failed, headers on 7 paths 0 failed, 165 Playwright tests passed (axe 0 violations) |
| Lighthouse budgets | `npm run test:lighthouse` | See section 6 |
| Content audit of `dist/` | `node scripts/audit-content-text.mjs` (new) | 51 segments not quoted verbatim after this phase's inventory additions (60 before them), all traced by hand (section 2) |
| Legacy `keep` rows present | throwaway script over `dist/` | 2 rows missing without a decision (H-04, E-03; `parity.md`) |
| Preview pages and redirects | `curl` on the preview | Every page `200`; every legacy URL one `301` to the final URL; unknown path `404` |
| Preview links | `linkinator` on the preview, internal only | 58 links and assets, all `200` |
| External links | `curl -L` | `wa.me/556138795003` and the Google Maps listing answer `200` |
| Legacy files | download from the preview, `cmp` with the legacy clone | Three PDFs and three covers byte-identical; removed files answer `404` as planned |
| Response headers on the preview | `curl -sI` | CSP, HSTS (one day), `nosniff`, `X-Frame-Options`, referrer, permissions and COOP policies, `X-Robots-Tag: noindex, nofollow` |
| Current production (`mmec.adv.br`, legacy) | `curl` | Apex `200`; `www` and `http` redirect with `301` (see the `www` item in `launch-checklist.md`) |
| Dependencies | `npm audit --omit=dev`; `npm audit` | 0 production vulnerabilities; 19 dev-only (via `wrangler` and `@lhci/cli`), already recorded in `docs/security.md`, "Supply chain", and Q-31 |
| Provimento 205/2021 (Q-20) | OAB page read on 2026-10-27, plus a web search | No new wording of arts. 1 to 6 and no replacing provimento found |

## 2. Content audit

`scripts/audit-content-text.mjs` extracts every text segment of the built pages (block by block) and the text attributes (`alt`, `aria-label`, `title`, page title and meta descriptions), and lists the segments that are not quoted verbatim in `content-sources.md`. Every listed segment was then traced by hand.

| Segment (page) | Source | Result |
|---|---|---|
| "…, página inicial" (home link name, every page) | G-01, G-02 (rewrite per component) | Sourced |
| "© 2026 Machado Moura e Cardoso Advogados Associados." | G-20 | Sourced |
| "(61) 3703-5558", "(61) 3879-5003 · Abrir no WhatsApp" (home) | H-93, Q-05, Q-25 (non-breaking hyphen only) | Sourced |
| Privacy policy paragraphs and list items (24 segments) | PR-04, PR-05, PR-09, PR-15 and the Phase 4 privacy rewrite log (summaries), LAW-01, EXT-01, OWN-02, OWN-03 | Sourced. LGPD art. 18, I to IX and § 1 compared with the law text: the list paraphrases each item and adds none. |
| Terms paragraph "Todo o conteúdo … relação advogado-cliente." | T-07 rewrite, T-08, T-09 | Sourced |
| "O material organiza exibição, … programação normal." | PP-10 rewrite | Sourced |
| "PDF · 29 páginas · 423 KB" and equivalents | Phase 4 log, read from the files | Sourced |
| "Arquivo" (publication metadata label), "Trilha de navegação" (breadcrumb name), "PDF: https://…" (print-only line) | Interface labels with no factual content | Not in the inventory. Labels, not claims; listed here as their record. |
| "Publicações \| Machado Moura e Cardoso" (title) | G-07 and the title pattern of E-01 | Sourced |
| Meta description of `/privacidade`: "Como o site de Machado Moura e Cardoso Advogados Associados trata dados pessoais, em conformidade com a LGPD." | Phase 5 (SEO), from PR-05 | Not logged in `content-sources.md`; no new fact. Non-blocking. |
| Meta description of `/termos`: "Condições de uso do site e das publicações de Machado Moura e Cardoso Advogados Associados." | Phase 5 (SEO), from T-05 | Same as above. |

Defect found and fixed: on `/privacidade` the built text read "é o e-mailcontato@…" and "Brasília/DF,CEP 71.615-560". Astro drops the whitespace at a line break between text and an element or expression. Fixed in its own commit (`fix(privacy): …`). A scan of `dist/` for a word or punctuation mark touching an inline element, or a comma touching the next word, finds no other case.

No invented claim, statistic, client, testimonial, team member, award or placeholder text was found. "MMC" does not appear in any built page.

## 3. Compliance checklist (lawyer advertising)

Rules as summarised in [`open-questions.md`](open-questions.md), "Rules relied on" (Provimento 205/2021 and the Código de Ética e Disciplina, CED). Status: **ok** (no issue found by this review), **owner** (needs a decision or proof only the firm has), **lawyer** (legal judgement for the firm's compliance lawyer). This review is not legal advice; every row is open to the lawyer.

| # | Statement or element (where) | Rule | Status | Note |
|---|---|---|---|---|
| C-01 | Firm name and "OAB/DF 0100104RS" (footer, every page) | CED art. 44, caput | owner | Compare with the registration certificate (Q-17). |
| C-02 | "Atuação em direito da radiodifusão, em Brasília, desde 2004." (home `h1`) | Prov. art. 3, § 1 and III | ok | No "especializada" (Q-06). "Desde 2004" must be provable on request (art. 1, § 2). |
| C-03 | "Assessoria e consultoria jurídica dedicada a emissoras, entidades e empresas do setor, com atuação regulatória, institucional, legislativa e preventiva." (home) | CED art. 44, § 1 (specialities the lawyer is dedicated to) | ok | |
| C-04 | Buttons "Fale com o escritório" and "Conheça nossa atuação" (home hero) | Prov. art. 3, § 1 (no direct incitement to hire), art. 2, VIII | lawyer | Neutral navigation to the contact and practice sections; the lawyer may prefer "Contato". |
| C-05 | "Sediado em Brasília, dedicado ao setor de radiodifusão" (home `h2`) | Prov. art. 3, § 1 | ok | |
| C-06 | "… com experiência jurídica, legislativa e regulatória no setor." (home) | Prov. art. 3, IV (self-aggrandising) | lawyer | Factual, from the PDFs (PDF-01); low risk. |
| C-07 | "… acompanha de perto o ambiente normativo, regulatório e institucional …" (home) | Prov. art. 3, IV | lawyer | "de perto" is mild emphasis; low risk. |
| C-08 | "A atuação é orientada por segurança jurídica e prevenção de riscos." (home) | Prov. art. 6, parágrafo único (promise of results) | ok | Describes a method, not an outcome; "continuidade operacional" already dropped; read by the owner at the Phase 3 gate. |
| C-09 | Six practice areas, headings and lists (home) | Prov. art. 3, § 1 and IV | ok | Owner rewrote four phrases at the Phase 3 gate. "Revisão de riscos" and "análise preventiva" describe services. |
| C-10 | "… comunicação de impactos aos clientes." (home, area 6) | CED art. 42, IV (no client lists) | ok | No client is named anywhere. |
| C-11 | "Atendimento jurídico e institucional a empresas e entidades do setor de radiodifusão." (contact) | Prov. art. 3, § 1 | ok | |
| C-12 | Telephone numbers, WhatsApp number and "Abrir no WhatsApp" link (contact) | CED art. 44, § 1 (contact data that may be shown); Prov. art. 3, § 1 | lawyer | Address and e-mail are listed in art. 44, § 1; confirm telephone and WhatsApp on the website. Owner decision Q-05. |
| C-13 | No testimonials, client logos, case results, counters, statistics, office size or photos (whole site) | CED art. 42, IV; Prov. art. 6 | ok | Checked in `dist/`. |
| C-14 | Publications pages and cards (three pages, home, `/publicacoes`) | Prov. art. 4, caput and Anexo Único (content marketing) | ok | Technical and informative, no results disclosed. |
| C-15 | Legal notices on the publication pages ("… devem ser submetidas à análise jurídica específica …") | Prov. art. 2, VIII; art. 4 | ok | Neutral wording, no pointer to the firm (Q-08). |
| C-16 | Contact data printed inside the PDFs | CED art. 40, V | lawyer | PDFs served unchanged (Q-18). |
| C-17 | "atuação especializada" on p. 28 of P1 and p. 7 of P2 | Prov. art. 3, III | lawyer | The site avoids the word; the PDFs still use it and are not edited (Q-06). New exports would fix it. |
| C-18 | P2 p. 2 "orientação básica para os clientes do escritório" and "dirimidas pelo escritório" | Prov. art. 2, VIII; art. 4 | lawyer | Inside the PDF only (Q-08). |
| C-19 | Terms: "A leitura dos materiais não cria uma relação advogado-cliente." | Prov. art. 4 (no solicitation) | ok | Supports the informative nature. |
| C-20 | Meta descriptions, Open Graph text and `LegalService` structured data | Prov. art. 3, § 1 | ok | Same wording as the visible copy; no rating, review or price fields. |
| C-21 | Privacy policy and terms as a whole | LGPD; CED | lawyer | Line-by-line review pending (Q-26, Q-28): legal bases, international transfer, "sem aviso prévio". |
| C-22 | Provimento 205/2021 still the rule in force | Q-20 | ok | Re-checked on 2026-10-27; re-check on the day of the cutover. |

## 4. Brand, accessibility, security and SEO spot checks

- Brand: logo files only from `public/brand/`, unaltered (Phase 2 verification); no gradients, glows, counters, marquees, radar motifs, stock images or emoji in `dist/`; the favicon is variant F, approved 2026-10-26 (`docs/brand.md`).
- Accessibility: one `h1` per page, `lang="pt-BR"`, skip link, keyboard and focus tests, reduced motion and forced colours are covered by `npm run check`. Screen reader and Safari or Firefox remain manual (section 5).
- Security: no secrets in the repository; the only third-party script is the Cloudflare beacon, decided in `0003-analytics` and loaded only on `mmec.adv.br`; the CSP has no `'unsafe-inline'`; the two external links (WhatsApp, Google Maps) carry `rel="noopener noreferrer"`, checked in `tests/home.spec.ts`.
- SEO: canonical and Open Graph URLs point to `https://mmec.adv.br`. The Open Graph image `https://mmec.adv.br/og/mmec-og-default.png` does not exist on the legacy production site yet, so social previews can only be checked after the cutover (`launch-checklist.md`).

## 5. Manual checks for the owner at the gate

From Phase 6 (Q-32, Q-33). Results go to `docs/audit-06.md`, section 8.

1. Screen reader (NVDA on Windows, or VoiceOver on an iPhone), about ten minutes on the preview: the skip link is announced first and jumps to the content; the headings list shows one `h1` and a logical order; landmarks (banner, navigation, main, contentinfo) are listed; the "Menu" button announces expanded or collapsed; one publication page reads in order; the "Abrir PDF completo" and "Baixar" links announce what they do.
2. Safari on an iPhone and Firefox on a computer: open every page of the preview and report anything that looks different from Chrome (layout, fonts, menu, PDF links).
3. Read every page for the content sign-off, with this review's compliance table (section 3) at hand.

## 6. Lighthouse

`npm run test:lighthouse` on the build of this branch, 2026-10-27: every budget passes for the seven pages with both presets (three runs each). Desktop scores 100 / 100 / 100 / 100 (performance, accessibility, best practices, SEO) on every page. Mobile numbers match the Phase 6 reference (`audit-06.md`, section 6: performance 98 to 99, the other categories 100).

## 7. Reviewer agent

The reviewer agent ran twice, as the phase asks.

| Run | Scope | Verdict | Blocking findings |
|---|---|---|---|
| 1 | Full project, `git diff 81dc878...HEAD`, and the Phase 7 commits | APPROVE WITH NOTES | None |
| 2 | Built `dist/` and the live preview (pages, every legacy URL, headers, byte comparison of preview HTML with `dist/`) | APPROVE WITH NOTES | None |

Notes handled on this branch: the audit counts in sections 1 and 2 corrected (51 after the inventory additions); the dev-only `npm audit` findings referenced (section 1); the launch checklist gained a check that `3402fce` is the deployed commit before tagging, a one-hop `http` to `https` check on the apex, an explicit warning on the `noindex` step, and dates for any page changed after the lawyer review. Run 2 found the preview HTML identical to `dist/` except the two privacy-page spaces fixed here. Run 2's `test:a11y` clashed with a concurrent Lighthouse server on port 4323; `npm run check` was then re-run alone and passed (165 tests).

Notes left for the owner: the old-domain e-mail at sign-off (Q-03); Q-34; the rows marked "lawyer" in section 3.
