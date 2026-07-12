---
topic: Turajlic 2017 — indel/frameshift neoantigens are disproportionately immunogenic across cancers
keywords: [indel neoantigen, frameshift, neoantigen, mutant-specific binding, renal cell carcinoma, checkpoint inhibitor, immunogenic, pan-cancer, TCGA, CD8 T cell]
related: [../rna-and-noncanonical-neoantigens.md, ../neoantigen-prediction-pipeline.md]
epistemics: empirical
source: "Turajlic S, Litchfield K, Xu H, … Quezada SA, Swanton C. Insertion-and-deletion-derived tumour-specific neoantigens and the immunogenic phenotype: a pan-cancer analysis. Lancet Oncol 2017;18(8):1009-1021. DOI:10.1016/S1470-2045(17)30516-8 (verified)"
source_type: paper
asserted_at: "2026-07"
---

# Indel/Frameshift Neoantigens

The canonical mechanistic argument for why frameshift/indel (and, by extension, fusion and out-of-frame splice) antigens outperform point neoepitopes per event: a novel ORF produces many highly non-self peptides with minimal wild-type cross-reactivity.

## Design & Cohort

WES from **5,777 solid tumours across 19 TCGA cancer types**; replication in two independent datasets; RNA-seq immune profiling in **392 clear-cell RCC (ccRCC)** cases; indel-burden vs checkpoint-inhibitor response across **four ICB datasets**.

## Results (fully verified from abstract)

- RCC had the **highest pan-cancer proportion (0.12) and number of indels** (p < 2.2×10⁻¹⁶) — **>2× the median** of all other cancer types.
- Indel mutations were **3× enriched for high-affinity MHC binders** vs nonsynonymous SNVs.
- Indel-derived neoantigens were **9× enriched for mutant-specific binding** (novel, non-self frameshifted ORFs).
- In ccRCC, mutant-specific neoantigens correlated with antigen-presentation-gene upregulation and **CD8 T-cell activation (r = 0.78).**
- **Frameshift-indel count was significantly associated with checkpoint-inhibitor response across three melanoma cohorts (p = 4.7×10⁻⁴).**

Verbatim: *"indels are a highly immunogenic mutational class, which can trigger an increased abundance of neoantigens and greater mutant-binding specificity."*

## Limitations

In-silico predictions (binding, not confirmed presentation/immunogenicity for most peptides); response association is correlative. The mechanism generalizes: shifted/novel reading frames are the reason non-canonical antigen classes carry more immunogenic potential per event than SNVs.
