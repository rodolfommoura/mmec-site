# Open questions

Items waiting for the owner. Each question has a **proposed default**: if a question is still open when the phase that needs it starts, the default applies, and the item stays here so it can be revisited.

How to answer: write below the question (`Answer:`) or comment on the pull request. Answers in Portuguese are fine.

Evidence references (`H-22`, `P1 p. 28`) point to [`content-sources.md`](content-sources.md).

## Summary

| ID | Topic | Blocks | Decision in one line |
|---|---|---|---|
| Q-01 | Short name "MMC" vs "MMEC" | Phase 2 | Never "MMC". Full name in copy, "MMEC" only as a short form. |
| Q-02 | "Desde 2004" and "22+ anos" | Phase 3 | "Desde 2004" confirmed; no counter, no "22+". |
| Q-03 | Old email domain and the "Moura e Ribeiro" Maps listing | Phase 3, 8 | Keep the current email until the owner confirms the new one; Maps link to the listing if Phase 3 confirms it shows the current name, otherwise to the coordinates. |
| Q-04 | Decorative claims "360°", "DF", "01" | Phase 3 | Drop. |
| Q-05 | Phone numbers, WhatsApp and postcode | Phase 3 | Publish `(61) 3703-5558` and `(61) 3879-5003` (labelled and linked as WhatsApp); CEP `71.615-560`. |
| Q-06 | "Especializada" and OAB art. 3, III | Phase 3 | Never "especializada" or "especialização" (no certified title); say "atuação em direito da radiodifusão". |
| Q-07 | "Positioning" principles (self-praise) | Phase 3 | Drop. |
| Q-08 | Disclaimer pointing to "análise jurídica do escritório" | Phase 4 | Neutral wording, as on the election booklet page. |
| Q-09 | Privacy policy and analytics claims | Phase 4, 5 | Cloudflare Web Analytics plus Google Search Console; no GA4 or Clarity; ADR `0003-analytics` in Phase 5. |
| Q-10 | Embedded Google Map | Phase 3, 5 | No iframe; plain link. |
| Q-11 | Reuse licence: terms vs PDFs | Phase 4 | Follow the PDFs: reproduction only in full. |
| Q-12 | Calendar PDF shows the old address and firm name | Phase 4 | Keep in the preview; request a new export before Phase 7; if none arrives, serve unchanged and record a known issue. |
| Q-13 | Broader list of fields in the PDFs | Phase 3 | Do not list. |
| Q-14 | Rename "Inteligência setorial" to "Publicações" | Phase 3 | Rename. |
| Q-15 | "Desenvolvido por Henrique Moura." credit | Phase 2 | Drop from the new footer (decided). |
| Q-16 | Preview Worker name | Phase 1 | `mmec-site`, as in `CLAUDE.md`. |
| Q-17 | OAB registration number of the firm | Phase 7 (certificate check) | Resolved: the footer shows "OAB/DF 0100104RS"; Phase 7 compares it with the registration certificate. |
| Q-18 | Contact data printed inside the PDFs | none | Leave PDFs unchanged. |
| Q-19 | Publications whose period is over | Phase 4 | Keep all three, labelled with year and type; a new edition is a content-only change. |
| Q-20 | Pending update of Provimento 205/2021 | Phase 7 | Re-check the OAB site before launch. |

## Naming and identity

### Q-01. "MMC" vs "MMEC"

- Evidence: the legacy site shows "MMC" seven times as visible text or CSS-generated text (`index.html:88`, `:171`, `:201`, `:422`; `site.css:111`, `:283`, `:303`; inventory rows H-03, H-26, H-33, H-86, G-25). `docs/brand.md` says the short form is MMEC and "MMC" was a mistake. The domain is `mmec.adv.br`.
- Question: confirm that "MMEC" is the only short form, and say whether it may appear in visible copy at all, or only in the logo and technical names.
- **Default:** visible copy uses the full name "Machado Moura e Cardoso Advogados Associados" or "o escritório". "MMEC" appears only in the logo files and in technical names. "MMC" never appears.

Answer: Accepted as proposed.

### Q-02. Founding year and "22+ anos de atuação"

- Evidence: hero stamp "Desde 2004" (H-16); animated counter "22+ anos de atuação" (H-29). 2026 minus 2004 is 22, so "22+" (more than 22) is not supported by the stated year, and a hard-coded figure becomes wrong every year.
- Questions:
  1. Is 2004 the founding year of Machado Moura e Cardoso, or of a predecessor firm (for example Moura e Ribeiro, see Q-03)? If a predecessor, may the site say "desde 2004"?
  2. Does the site need a years figure at all?
- **Default:** show "Desde 2004" only, as a plain fact, no counter. If a years figure is ever wanted, it is computed at build time from 2004 and phrased as "há N anos", never "N+".

Answer: "Desde 2004" is confirmed as the founding reference. No counter, no "22+".

### Q-03. Old email domain and Google Maps listing

- Evidence: every contact link uses `contato@mouraeribeiro.adv.br` (G-15), also printed in all three PDFs. "Abrir no Google Maps" opens the listing "MOURA E RIBEIRO ADVOGADOS ASSOCIADOS" (H-98). The legacy README lists the email migration as pending.
- Questions:
  1. Is there a mailbox on `@mmec.adv.br`? Which address should the site show?
  2. Will the Google Business Profile be renamed to the current firm name? (This is done by the owner in Google, outside this project.)
- **Default:** keep `contato@mouraeribeiro.adv.br` in the single contact config file until a new mailbox is confirmed (`CLAUDE.md` rule 9). The maps link points to the coordinates (`-15.8521537,-47.8945894`), not to the listing, until the listing carries the current name. No DNS or email change in this project.

Answer: The owner has already renamed the Google Business Profile. A mailbox on `@mmec.adv.br` will exist later, not now: keep `contato@mouraeribeiro.adv.br` in the contact config until the owner confirms the new address. In Phase 3, check that the Maps listing shows the current firm name. If it does, the map link may point to the listing; otherwise it points to the coordinates.

### Q-16. Preview Worker name

- Evidence: `CLAUDE.md` names the preview Worker `mmec-site`; the legacy README's transition section names it `mmec-next` (TF-05). The legacy repository may not be edited.
- **Default:** `mmec-site`, as in `CLAUDE.md` and `docs/naming.md` (Worker name equals repository name). The legacy README mismatch is noted here and not fixed.

Answer: Accepted as proposed.

## Claims and wording (OAB advertising rules)

### Rules relied on

Verified on 2026-10-26 on the OAB website.

- **Provimento 205/2021** (CFOAB, signed 15 July 2021, published in DEOAB no. 647 on 21 July 2021), [oab.org.br/leisnormas/legislacao/provimentos/205-2021](https://www.oab.org.br/leisnormas/legislacao/provimentos/205-2021):
  - Art. 1, § 1: the firm's managing partners are responsible for the information being objective and true; § 2: it must be provable when the OAB asks. This is why every claim needs a source.
  - Art. 2, VII: passive advertising reaches only people who sought the information. A firm website is treated here as passive advertising; art. 3 applies to it in full.
  - Art. 2, VIII: client solicitation (captação de clientela) is active marketing that induces hiring, regardless of the result.
  - Art. 3, caput and § 1: advertising must be merely informative, discreet and sober, and make the professional profile public "sem ostentação", without self-promotion.
  - Art. 3, III: no advertising of specialities without a certified title or recognised notable specialisation (Q-06).
  - Art. 3, IV: no persuasive, self-aggrandising or comparative phrases (Q-04, Q-07, H-21, H-65, H-87).
  - Art. 4, caput: legal content marketing (the publications) is allowed without commercialisation or solicitation. Anexo Único, "Criação de conteúdo, palestras, artigos": content must be technical and informative, without disclosing concrete results.
  - Art. 6: the caput bars, in active advertising, information on the office's size or structure, promises of results and concrete cases used to offer services. The parágrafo único extends the ban on promises of results and concrete cases to "qualquer publicidade", so it covers the website (H-65, H-68).
- **Código de Ética e Disciplina da OAB** (Resolução 02/2015), [oab.org.br](https://www.oab.org.br/arquivos/resolucao-n-022015-ced-2030601765.pdf):
  - Art. 39: advertising is informative, discreet and sober, and may not amount to solicitation or commercialisation.
  - Art. 40, V: no contact data (address, phone) in articles published in the press or on the internet; email is allowed (Q-18).
  - Art. 42, IV: no client lists. The rebuild adds no client names or logos.
  - Art. 44, caput: advertising must show the firm's name and its OAB registration number(s) (Q-17). § 1 lists what may be shown: titles, specialities the lawyer is dedicated to, address, email, site, logo, office photo, opening hours, languages.

### Q-04. Decorative claims "360°", "DF", "01"

- Evidence: H-30 "360° visão jurídica e regulatória", H-31 "DF presença estratégica em Brasília", H-32 "01 foco setorial: radiodifusão". They are styled as statistic tiles next to the one animated counter (H-29) but measure nothing.
- **Default:** drop all three. The facts behind them (Brasília, focus on broadcasting) are already stated in prose.

Answer: Accepted as proposed.

### Q-06. "Especializada" / "especialização"

- Evidence: "Advocacia especializada em radiodifusão" (H-02), "atua de forma especializada" (H-22), "Especialização setorial" (H-10), "atuação especializada" (PDF-01).
- Rule: Provimento 205/2021, art. 3, III bars advertising specialities without a certified title or notable specialisation. CED art. 44, § 1 allows naming "as especialidades a que se dedicar".
- Question: does any partner hold a certified specialist title, or should the site describe the practice as dedication rather than specialisation?
- **Default:** avoid "especializada" and "especialização" in site copy. Use "atuação em direito da radiodifusão", "dedicado ao setor de radiodifusão". The PDFs are not edited.

Answer: No partner holds a certified specialist title. Do not use "especializada" or "especialização" in site copy; use "atuação em direito da radiodifusão".

### Q-07. "Positioning" principles

- Evidence: H-65 "Antecipar movimentos. Reduzir riscos. Sustentar decisões.", H-66 "Profundidade técnica", H-67 "Proximidade", H-68 "Responsividade ... resposta ágil".
- Rule: art. 3, IV (self-aggrandising phrases) and art. 6, parágrafo único (promise of results, in any advertising).
- Question: does the owner want any of these kept? "Atendimento direto" (H-67) is the only factual part.
- **Default:** drop the whole section.

Answer: Accepted as proposed.

### Q-08. Disclaimer that points readers to the firm

- Evidence: PP-23 "Situações específicas devem ser submetidas à análise jurídica do escritório". The election page (E-27) says "à análise jurídica específica", but P1 p. 2 itself says "submetidos à análise jurídica específica do escritório". The PDF P2 (p. 2) says "devem ser dirimidas pelo escritório", which reads as addressed to existing clients (P2 p. 2: "orientação básica para os clientes do escritório").
- Rule: art. 2, VIII and art. 4, caput (content marketing without solicitation).
- **Default:** use the neutral wording of E-27 on all publication pages. The PDFs are not edited.

Answer: Accepted as proposed.

### Q-13. Broader list of fields

- Evidence: PDF-02 "Análise regulatória, técnica, cível, penal, eleitoral, fiscal, tributária e trabalhista" (P1 p. 28). The legacy site does not list these fields.
- Question: should the site name these fields, and under which practice area?
- **Default:** do not list them. The six practice areas of the legacy site stay as they are.

Answer: Accepted as proposed.

### Q-17. OAB registration number of the firm

- Evidence: no page of the legacy site shows the firm's OAB registration (sociedade de advogados) number.
- Rule: CED art. 44, caput requires the firm's name and OAB registration number(s) in its professional advertising. A firm website falls under art. 46.
- Question: what is the registration number of Machado Moura e Cardoso Advogados Associados at OAB/DF, exactly as it should appear?
- **Default:** the footer gets a line for it, filled only with the owner's number. No placeholder text ships. The Phase 7 content sign-off, and therefore the Phase 8 cutover, waits for this answer.

Answer: Resolved. The owner provided the registration number `0100104RS` and confirmed the seccional is OAB/DF. The number is final, including the "RS" suffix. The footer shows "OAB/DF 0100104RS" exactly. One check remains for Phase 7: compare the footer text with the owner's registration certificate.

### Q-18. Contact data printed inside the PDFs

- Evidence: every page of P1 and P2 except the final copyright page, and the P3 letterhead, print the address and phone numbers.
- Rule: CED art. 40, V bars contact data in articles published on the internet (email is allowed). Whether the firm's own booklets count as "artigos" in the sense of art. 40, V is a legal judgement.
- **Default:** no action in this project. The PDFs are the firm's documents and are served unchanged. Flagged for the owner's own review.

Answer: Accepted as proposed.

### Q-20. Pending update of Provimento 205/2021

- Evidence: in October 2025 the OAB presented proposals to update Provimento 205/2021 ([s.oab.org.br](https://s.oab.org.br/arquivos/2025/10/b0a81d83-3467-41bf-8eed-083a117267cb.pdf)). The text checked on 2026-10-26 showed no new wording of arts. 1 to 6.
- **Default:** Phase 7 re-checks the OAB page and updates this list before the content sign-off.

Answer: Accepted as proposed.

## Contact

### Q-05. Phone numbers, WhatsApp and postcode

- Evidence:
  - Site: `(61) 3703-5558` (H-93).
  - P1, every page except the last: "Telefone / WhatsApp (61) 3879-5003".
  - P2, every page except the last: "(61) 3703-5558 / 3879-5003".
  - P3: "(61) 3703.5558" next to an old address, and "Telefone / Whatsapp: (61) 3879.5003" next to the current address, with "CEP 71.615-560".
  - The privacy policy mentions contact "via e-mail ou WhatsApp" (PR-09), but the site offers no WhatsApp channel.
- Questions:
  1. Which number(s) should the site show, and is `(61) 3879-5003` a WhatsApp number the firm wants published?
  2. Is `CEP 71.615-560` correct for SHIS QI 05, Bloco F, Sala 332?
- **Default:** show only `(61) 3703-5558`, as the legacy site does. No WhatsApp link. No postcode until confirmed. The privacy policy does not mention WhatsApp.

Answer: Publish both numbers: `(61) 3703-5558` and `(61) 3879-5003`, the second labelled as WhatsApp. Only that number gets a WhatsApp link. Postcode `71.615-560` is confirmed for SHIS QI 05, Bloco F, Sala 332. The privacy policy may therefore mention WhatsApp as a contact channel.

### Q-10. Embedded Google Map

- Evidence: H-96, an iframe from `maps.google.com` loaded on every home page view.
- Problems: a third-party request before consent (LGPD, `CLAUDE.md` rule 6), a CSP exception (`frame-src`), extra weight, and it shows the old listing name nearby.
- **Default:** no iframe. The address is shown as text with a plain "Abrir no Google Maps" link to the coordinates (see Q-03). A static map image is possible later only if made from a source with a compatible licence.

Answer: Accepted as proposed.

## Privacy and terms

### Q-09. Privacy policy and analytics

- Evidence:
  - GA4 and Clarity load on almost every page before any consent (TF-01, PR-23).
  - "Os dados são anonimizados pelo Google" (PR-12) and "sob rigorosos termos de confidencialidade" (PR-16) are unverified.
  - Clarity session replay and heatmaps (PR-13) on a site with no forms.
  - WhatsApp contact mentioned but not offered (PR-09).
  - The policy names no controller and no data protection officer (encarregado) contact.
- Questions for Phase 5:
  1. Does the firm need visit statistics? If so, is a cookieless option acceptable (no banner needed)?
  2. Who is the encarregado (LGPD art. 41), or should the policy point to the contact email?
- **Default:** Phase 5 proposes a cookieless analytics option or none (decision record `0003-analytics`). GA4 and Clarity are not carried over. The policy is rewritten in Phase 4 from verified facts only, naming the firm as controller and the contact email for requests; unverified claims and WhatsApp are dropped.

Answer: The owner wants a tool to analyse site data and delegated the choice. Chosen: Cloudflare Web Analytics (cookieless, no banner) plus Google Search Console (search queries, no visitor tracking). GA4 and Clarity are not carried over. Phase 5 must verify what the Cloudflare dashboard shows for PDF requests, write decision record `0003-analytics`, and keep the owner's gate. Before the cutover, the owner exports the GA4 and Search Console history. The privacy policy names the firm as controller and gives the contact email for requests.

### Q-11. Reuse licence: terms vs PDFs

- Evidence: the terms allow reading and downloading "para uso pessoal e operacional" and ban commercial reproduction or modification (T-12, T-13). The PDFs say "Autorizada apenas a reprodução integral" (PDF-04).
- Question: which rule applies to the publications?
- **Default:** the terms follow the PDFs: reading and downloading are allowed, and reproduction is allowed only in full. The terms also note that P3 reproduces an official act, which is not the firm's property (T-11).

Answer: Accepted as proposed.

## Publications

### Q-12. Calendar PDF letterhead

- Evidence: P3's letterhead shows the old address "SHIS QI 21 Conjunto 07 Casa 17, Lago Sul, CEP 71.655-270", the current address, two phone numbers and a "MOURA E ..." text fragment (likely the former firm name). The cover image (IMG-06) is a preview of that page.
- Question: can the firm provide a new export of the clipping with the current letterhead?
- **Default:** serve the existing PDF unchanged at the same URL. If a new export arrives, it replaces the file at the same path, and the cover is regenerated from it.

Answer: The owner delegated the decision: keep the calendar PDF in the preview. Ask for a new export with the current letterhead before Phase 7. If it does not arrive, serve the existing file unchanged at the same URL (existing links must not break) and record it as a known issue.

### Q-14. Section name "Inteligência setorial"

- Evidence: G-07, H-69. The section only lists the firm's three publications.
- **Default:** rename the section and the index page to "Publicações" (URL `/publicacoes`, as in `docs/naming.md`). Keep the anchor `#inteligencia` on the home section so old links still land there (see [`url-map.md`](url-map.md)).

Answer: Accepted as proposed.

### Q-19. Publications whose period is over

- Evidence: P1 covers the 2026 elections; its key-dates page (p. 4) ends with the second-round free airtime of 9 to 23 October, and both polling days (4 and 25 October 2026) are past by 2026-10-26. P2 covers the first half of 2026. P3 is valid until the 2027 calendar is published.
- Question: keep all three online? Are new editions expected (for example a 2027 calendar) that should replace them?
- **Default:** keep all three, each labelled with its year and type, worded in the past or neutral tense, with no "current" language. The index lists them newest first by edition year, then in legacy order.

Answer: Keep all three publications online, each labelled with its year and type. New editions are expected (for example a 2027 calendar), so adding an edition must be a content-only change.

## Site

### Q-15. "Desenvolvido por Henrique Moura."

- Evidence: G-21, footer of the legacy home page. The credit refers to the legacy site.
- **Default:** drop it from the new footer. The owner may ask for a credit line; its wording comes from the owner.

Answer: Drop "Desenvolvido por Henrique Moura." from the new footer.
