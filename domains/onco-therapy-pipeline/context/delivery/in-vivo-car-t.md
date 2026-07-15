---
topic: In-vivo CAR-T generation via targeted LNP — programming blood T cells to bypass the solid-tumor delivery wall
keywords: [in-vivo CAR-T, targeted LNP, DARPin, CD8, blood T cell, transfection, ex vivo bypass, Capstan Therapeutics, programmable immunity, manufacturing bypass]
related: [bypass.md, delivery-wall.md, sources/tam-2025-in-vivo-car-t.md]
defines:
  in-vivo-car-t: "In-vivo CAR-T cell generation by delivering CAR-encoding mRNA to circulating T cells via targeted LNP (DARPin-anti-CD8), achieving ~90% CD8+ transfection — bypasses both the solid-tumor delivery wall and the 2–4 week ex vivo manufacturing bottleneck"
kinds:
  in-vivo-car-t: modality
epistemics: empirical
source: "Tam 2025 Nat Biotechnol (DARPin-LNP ~90% CD8+ transfection); Capstan Therapeutics pipeline; Rurik 2022 Science (anti-CD5 LNP CAR-T for cardiac fibrosis)"
source_type: paper
asserted_at: "2026-07"
---

# In-Vivo CAR-T via Targeted LNP

[[in-vivo-car-t]] is the most radical of the three bypass strategies: rather than delivering editor cargo to the tumor, it programs effector cells in the blood that independently traffic to and kill tumor cells. It simultaneously bypasses the [[solid-tumor-delivery]] wall and the ex vivo manufacturing bottleneck.

bypasses:: [[solid-tumor-delivery]]

Blood T cells are freely accessible to IV-injected LNPs — they circulate through the hepatic sinusoids and splenic red pulp where LNP concentration is highest. The strategy exploits the LNP's natural access to the blood compartment and redirects cell-specific uptake via surface ligands.

## The Technology

**DARPin-targeted LNP** decorates the lipid nanoparticle surface with designed ankyrin repeat proteins (DARPins) that bind CD8 (or CD3/CD5) on T cells. This redirects tropism from the default hepatic sink to circulating T cells, achieving ~90% transfection efficiency in CD8+ T cells with >20-fold selectivity over non-target cells (Tam 2025).

**mRNA payload.** The LNP carries mRNA encoding a chimeric antigen receptor (CAR). Expression is transient (24–48 hour peak, 5–7 day decline) because mRNA does not integrate. Repeated dosing at weekly intervals is feasible without immune-mediated loss of efficacy — the LNP provokes no anti-capsid neutralizing antibodies.

**Functional validation.** In vivo-generated anti-CD19 CAR-T cells cleared B-cell lymphoma in mouse models with efficacy comparable to conventionally manufactured ex vivo CAR-T (>80% tumor-free survival at 60 days, Tam 2025).

## Two Walls Bypassed Simultaneously

**Delivery wall bypass.** T cells are blood-phase targets, not solid-tumor targets. No extravasation through tumor vasculature, no interstitial transport, no endosomal escape in tumor cells is required. The programmed CAR-T cells handle tumor infiltration through their own biology (chemokine-guided migration, diapedesis).

**Manufacturing wall bypass.** Conventional ex vivo CAR-T manufacturing takes 2–4 weeks (leukapheresis → T-cell isolation → viral transduction → expansion → QC → infusion) and costs $300,000–$500,000. In-vivo CAR-T reduces the manufacturing timeline to hours and the cost estimate by 10–50×. For a personalized pipeline where the antigen target evolves (tumor escape, neoantigen drift), the ability to reprogram T cells in vivo on a weekly cadence is transformative.

## Open Questions

**Transient expression.** mRNA-based CAR expression lasts days, not months. For chronic anti-tumor surveillance, this requires either repeated dosing (feasible with LNP) or a switch to integration-competent payloads (e.g., transposon-based, which raises insertional mutagenesis concerns).

**Off-target programming.** While DARPin targeting achieves high selectivity, even low-level CAR expression in non-T cells (monocytes, B cells) could cause off-target cytokine release or unexpected effector activity.

**Solid-tumor efficacy.** In-vivo CAR-T has been validated primarily in hematological malignancies (CD19+ B-cell lymphoma). Solid tumor CAR-T faces additional barriers (immunosuppressive TME, antigen heterogeneity, T-cell exhaustion) that are orthogonal to the delivery platform.

## Position in the Pipeline

In-vivo CAR-T via targeted LNP links delivery to manufacturing: it eliminates the delivery wall by choosing an accessible target (blood T cells) and eliminates the manufacturing delay by performing cell engineering in the body. If the transient-expression limitation is solved, it collapses two of the pipeline's slowest stages into a single IV infusion.
