# DealSnap / REI Elite Deal Room canonical templates

This file documents the canonical copy and structures represented in `src/dealsnap_templates.ts`.

Seller portal: Under Review → Property + terms review. Show Chris Colton's contact block, review factors, possible Cash Offer, Lease Option, Subject-To, Seller Finance, and Owner-Finance Buyer Placement structures, documents needed, property facts, seller goals, next steps, and legal disclaimer.

Buyer / tenant-buyer portal: Intake / Qualification → Confirm criteria and readiness. Collect name, contact, market, property type, payment, down/option fee, credit range, and move-in timeline. Route against 2.5–3x income, 500–680+ credit, 3–10% option fee, stable employment, and an 8–12 month financing plan.

Internal portal: deal snapshot, key numbers, strategy review, deal score 1–10, Pursue/Nurture/Pass, deal killers, missing fields, and next-action owner. Statuses are Active, Waiting, Dead, Nurture, Hot, Warm, and Cold.

The intake contract is the Creative Finance Deal Intake Form with submitter, property, seller/contact, price/terms, condition, and deal-fit sections. The field mapper targets `deal_intakes` and `properties`; unmapped fields belong in source_payload. Buyer records from the three supplied Notion sources map to `buyers` through source_page_id/source_payload plus buy-box arrays, numeric criteria, strategy fields, and notes.

Buyer-facing teaser and seller follow-up copy should use the DealSnap contact block and the creative-finance positioning supplied by the product owner; legal disclaimers remain visible on external portals.
