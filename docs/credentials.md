# Public Credly credentials

The user supplied their Credly profile and requested adding their credentials to the portfolio. The public profile is https://www.credly.com/users/dayer-aniog/badges; its public JSON response returned three accepted, public badges issued to Dayer Aniog, across one page with no additional results.

| Credential | Issuer | Issued | Expires | Portfolio category |
| --- | --- | --- | --- | --- |
| JavaScript Essentials 1 | Cisco | 2026-08-07 | No expiry listed | Badge |
| JavaScript Essentials 2 | Cisco | 2026-08-07 | No expiry listed | Badge |
| IT Specialist - Databases | Certiport, a Pearson VUE business | 2026-05-06 | 2031-05-06 | Certification |

The database credential is categorized as a certification because Credly's template identifies its type as `Certification`; its displayed image is the official digital badge, not a fabricated certificate document. The JavaScript credentials are learning badges. Descriptions summarize the issuer's credential descriptions without adding examination scores, course hours, or other unconfirmed claims.

`credential-sources.json` records source URLs, badge IDs, dates, visibility/state, image URLs, file hashes, and the UTC check time. Each individual public verification URL returned HTTP 200 and included the matching credential title. Official PNG badge images are stored locally under `public/assets/credentials/` without alteration, so the gallery does not depend on third-party image requests. Credential data is a checked snapshot, not a live validity-status service.

Update confirmed metadata in `src/data/portfolioData.ts` when new credentials are earned or their records change. The page includes a public profile link, type filters, issue/expiry dates, and per-credential verification links. The profile's account-edit URL is never published in the portfolio.
