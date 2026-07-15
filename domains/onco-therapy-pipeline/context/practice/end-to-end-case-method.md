---
topic: Worked end-to-end cases — tracing real 2024-2026 personalized therapy arcs through the pipeline to identify where the binding constraint appears
keywords: [end-to-end case, worked case, pipeline trace, binding constraint, mRNA-4157, autogene cevumeran, NTLA-2001, neoantigen vaccine, gene editing, practice, immune branch, genetic branch]
related: [../map.md, sources/mrna4157-keynote942.md, sources/autogene-cevumeran-pdac.md, sources/ntla2001-liver-editing.md]
defines:
  end-to-end-case-method: "The practice of tracing a real personalized therapy arc through every pipeline stage (sampling, diff, design, manufacture, delivery, efficacy) to identify where the binding constraint appears — demonstrated by mRNA-4157 (melanoma, immune branch, gated by immunogenicity), autogene cevumeran (PDAC, immune branch, gated by cold-tumor immunogenicity), and NTLA-2001 (ATTR, genetic branch, bypasses delivery wall via liver tropism)"
kinds:
  end-to-end-case-method: method
epistemics: empirical
source: "Weber JS et al. Lancet 2024; Rojas LA et al. Nature 2023; Gillmore JD et al. NEJM 2021"
source_type: clinical-trial
asserted_at: "2026-07"
---

# Worked End-to-End Cases

The [[end-to-end-case-method]] traces a real therapy arc through every pipeline stage and names where the binding constraint appeared. Three 2024-2026 cases span both design branches and different constraint profiles.

## Case 1: mRNA-4157 (Immune Branch, Melanoma)

The KEYNOTE-942 trial (mRNA-4157/V940, Moderna + Merck) is the most advanced personalized neoantigen mRNA vaccine program. The pipeline trace: tumor biopsy → WES tumor-normal → somatic calling + HLA typing + neoantigen prediction (up to 34 neoepitopes) → mRNA construct design → LNP encapsulation → IM injection → RFS monitoring. Result: 44% reduction in recurrence or death (HR 0.561), sustained at 3-year follow-up (ASCO 2024, HR 0.59).

The binding constraint was [[neoantigen-immunogenicity]] — not delivery (IM vaccine targets peripheral APCs, not solid tumor) and not manufacturing (Moderna's platform runs ~6 weeks biopsy-to-dose). Of the up to 34 predicted neoepitopes, only a fraction elicit measurable T-cell responses; the immunogenicity prediction PPV (~6% for top candidates) sets the potency ceiling. The [[neoantigen-prediction-pipeline]] is computable through MHC binding (AUC >0.9) but empirical for immunogenicity.

citesAsEvidence:: [[neoantigen-immunogenicity]]

Phase 3 INTerpath-001 (NCT06077760, ~1,089 patients) is the confirmatory step.

## Case 2: Autogene Cevumeran (Immune Branch, PDAC — Cold Tumor)

The BNT122 trial (Rojas et al., Nature 2023) tests the immune branch in its hardest setting: pancreatic cancer, a cold tumor with median ~1 mut/Mb. The pipeline trace is the same — but the diff stage yields far fewer candidates (median 7 somatic mutations vs 34 neoepitopes in melanoma), compounding the immunogenicity wall. Result: 50% of patients mounted T-cell responses; responders had dramatically longer RFS (HR 0.08) vs non-responders.

The binding constraint was [[neoantigen-immunogenicity]] in a cold-tumor context — the small neoantigen pool (limited by low TMB) compounds the immunogenicity wall. Each candidate matters more when there are fewer to choose from. The immunosuppressive PDAC microenvironment adds a second empirical layer that the prediction pipeline does not model. The [[design-branch-cycle]] determines which patients enter this branch based on their mutation class.

discusses:: [[design-branch-cycle]]

## Case 3: NTLA-2001 (Genetic Branch, Liver Editing Bypass)

The NTLA-2001 trial (Gillmore et al., NEJM 2021; updated 2024) demonstrates the genetic branch at its strongest: in-vivo CRISPR/Cas9 editing of TTR in hepatocytes via LNP, achieving 87-93% serum TTR reduction, durable at >2 years. The pipeline is compressed: a known germline target (no somatic calling needed), a fixed construct (not patient-specific, no N-of-1 manufacturing), and default LNP liver tropism (ApoE→LDLR).

This case bypasses the [[solid-tumor-delivery]] wall because the target organ is the liver — the same tropism that blocks solid-tumor delivery enables liver editing. The case proves in-vivo gene editing works clinically, but only where LNP naturally accumulates. The 0.7% median tumor accumulation (Wilhelm 2016) means this approach does not extend to solid tumors.

citesAsEvidence:: [[solid-tumor-delivery]]

## What the Cases Show Together

The three cases reveal the constraint structure of the pipeline:

- **Immune branch** (mRNA-4157, BNT122): the binding constraint is neoantigen immunogenicity, not delivery (vaccines target APCs, not tumor cells) and not manufacturing (mRNA platforms are industrialized). The [[personalized-therapy-throughput]] is gated by immunogenicity prediction quality, not by manufacturing speed.
- **Genetic branch** (NTLA-2001): the binding constraint is the delivery wall — but only for solid tumors. When the target is the liver, the constraint disappears and editing achieves >90% knockdown. The [[end-to-end-timeline]] is short because the construct is fixed (not patient-specific).
- **The pipeline map's claim holds**: throughput is set by the slowest stage, and the slowest stage depends on the modality and target organ. The binding constraint is not a universal — it is modality-specific.
