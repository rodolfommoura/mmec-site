# Phase 7: Staging review

**Goal:** a full, independent review of the complete site on the preview URL, and the owner's final content sign-off.

## Prompt

```
Read CLAUDE.md and docs/phases/07-staging-review.md. Execute Phase 7 on branch docs/staging-review.
You are acting as the reviewer agent for the whole project, not the author. Do not change application code in this phase except to fix blocking findings, each in its own commit.
Stop when the pull request is open.
```

## Tasks

1. Run the `reviewer` agent against the full project (diff against the initial commit), then once more against the built `dist/` and the live preview URL.
2. Content audit: re-verify every sentence in the built HTML against `docs/content-sources.md`; list anything without a source. Extract all text from `dist/` to check this mechanically.
3. Compliance read: produce a checklist of every statement that touches lawyer advertising rules, with the rule cited; mark unresolved items for the owner or the firm's compliance lawyer.
4. Link and asset check on the preview; compare with the old site page by page to ensure no content was lost unintentionally (`docs/parity.md`).
5. Pre-launch checklist in `docs/launch-checklist.md`: robots and `noindex` removal plan, redirect tests, www behaviour, sitemap submission, analytics decision applied, security headers, 404, favicon, social previews, privacy text date, contact details, backups of the old site (tag and archive of `rodolfommoura/mmec-site-legacy`).

6. Carried over from Phase 6 (`docs/audit-06.md`, Q-32 and Q-33): ask the owner, at the gate, for a short screen-reader smoke test (NVDA on Windows or VoiceOver on an iPhone: skip link, headings list, landmarks, menu button state, one publication page, the PDF links) and a look at the preview in Safari on an iPhone and in Firefox. Record the results in `docs/audit-06.md`.

## Definition of done

- `docs/parity.md` and `docs/launch-checklist.md` complete.
- No unresolved blocking finding.

## Human gate

Final content sign-off by the owner (and the firm's compliance review if desired). Written go decision for Phase 8 in the PR comments.
