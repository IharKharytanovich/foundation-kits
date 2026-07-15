---
topic: Personalized immunotherapy design — the immune branch's design loop from diff to therapeutic candidate
keywords: [personalized immunotherapy, neoantigen selection, mRNA vaccine, peptide vaccine, TIL, CAR-T, TCR-T, design loop, immune branch, computable, empirical]
related: [sources/keynote-942-mrna4157.md, sources/til-therapy-solid-tumors.md, sources/bispecific-immunotherapy-advances.md, ../../walls/immunogenicity.md, ../../landscape/modalities.md]
defines:
  personalized-immunotherapy-design: "The design loop that turns a patient's somatic variant catalog into an immune therapeutic candidate — neoepitope selection, construct design, and modality routing; fastest personalized loop (<4 weeks for mRNA vaccines), gated by neoantigen immunogenicity prediction"
kinds:
  personalized-immunotherapy-design: stage
epistemics: hybrid
source: "KEYNOTE-942 (Weber 2024 Lancet); Amtagvi FDA 2024; Tecelra FDA 2024; autogene cevumeran (Rojas 2023 Nature)"
source_type: paper
asserted_at: "2026-07"
---

# Personalized Immunotherapy Design

[[personalized-immunotherapy-design]] is the immune branch of the design stage: given a [[somatic-variant-calling]] catalog from the diff stage, select neoepitopes, design the therapeutic construct, and route to the appropriate modality. It is the fastest personalized loop in the pipeline — mRNA neoantigen vaccines can go from biopsy to ready-to-inject in <4 weeks — but its output quality is gated by [[neoantigen-immunogenicity]], the empirical ceiling on which predicted neoantigens actually trigger T-cell responses.

## The Design Loop

1. **Neoepitope selection** (computable): HLA typing → peptide-HLA binding prediction (NetMHCpan, MHCflurry) → clonality filtering → immunogenicity ranking. This step is computationally tractable; the tools exist and achieve AUC >0.85 for peptide-MHC binding. The gap is that binding ≠ immunogenicity: <60% of predicted binders are immunogenic, and only ~6% of top-ranked predictions validate experimentally.
2. **Construct design** (computable, delegated): for mRNA vaccines, sequence optimization (codon usage, UTR engineering, modified nucleosides) is delegated to the **mrna-design** domain. For peptide vaccines, synthesis is direct. For adoptive cell therapies, TCR/CAR construct design is a separate engineering step.
3. **Modality routing** (empirical judgment): neoantigen mRNA/peptide vaccine (fastest, N-of-1), TIL expansion (patient-specific but slower), allogeneic CAR-T (off-the-shelf but not mutation-specific), or matched engagers (bispecifics).

## Modality Envelope (2024–2026 Data)

**Neoantigen mRNA vaccines** — the leading personalized modality:
- mRNA-4157/V940 (Moderna/Merck): up to 34 neoepitopes per patient; KEYNOTE-942 showed 44% recurrence risk reduction (HR 0.561) with pembrolizumab in melanoma; manufacturing ~6–8 weeks, accelerating toward <4 weeks.
- Autogene cevumeran (BNT122, BioNTech/Genentech): up to 20 neoepitopes; Phase 1 in pancreatic cancer showed 50% immunologic response rate and ctDNA clearance correlation; mRNA generated in ~3 days (construct only; end-to-end including manufacture longer).

**Adoptive cell therapy** — patient-specific but slower:
- Amtagvi (lifileucel/TIL): FDA 2024 for melanoma, ORR 31.4%, manufacturing ~22 days. Not mutation-designed — expands whatever T cells are in the tumor.
- Tecelra (afamitresgene/TCR-T): FDA 2024 for synovial sarcoma, ORR 36.4%, targets shared MAGE-A4 antigen (HLA-A*02:01 restricted). Manufacturing ~4–6 weeks.

**Off-the-shelf engagers** — matched, not personalized:
- Imdelltra (tarlatamab/BiTE): FDA 2024 for SCLC, ORR 40%. Targets DLL3 (lineage marker). No patient-specific design required.

## Computable vs Empirical Split

| Step | Status | Rate limiter |
|---|---|---|
| Peptide-HLA binding prediction | Computable (AUC >0.85) | Algorithm, not biology |
| TCR recognition / immunogenicity | Empirical (<60% validate) | [[neoantigen-immunogenicity]] |
| mRNA construct optimization | Computable (delegated to mrna-design) | Codon/UTR design space |
| In vivo immune response | Empirical | Patient immune status, TME |

The design loop's computable layer is mature; its empirical ceiling is [[neoantigen-immunogenicity]]. Improving the prediction of which neoantigens will actually be immunogenic is the single highest-leverage research target for the immune branch.

gated-by:: [[neoantigen-immunogenicity]]
