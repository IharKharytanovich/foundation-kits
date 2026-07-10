---
topic: In-vivo CAR-T via DARPin-targeted LNP achieving ~90% transfection of CD8+ T cells in blood
keywords: [in-vivo CAR-T, DARPin, LNP, CD8 T cell, transfection, blood targeting, Capstan, ex vivo bypass, T-cell engineering, targeted lipid nanoparticle]
related: [../bypass.md, ../delivery-wall.md]
epistemics: empirical
source: "Tam YK, Pardi N, et al. Targeted lipid nanoparticles enable in vivo CAR T cell generation with high efficiency and specificity. Nat Biotechnol. 2025;43(2):245-258. DOI:10.1038/s41587-024-02432-8"
source_type: paper
asserted_at: "2026-07"
---

# In-Vivo CAR-T via DARPin-Targeted LNP

Tam et al. 2025 demonstrated that LNPs surface-decorated with designed ankyrin repeat proteins (DARPins) targeting CD8 could selectively deliver CAR-encoding mRNA to CD8+ T cells in the bloodstream, generating functional CAR-T cells in vivo without the need for ex vivo manufacturing.

## Key Findings

**Transfection efficiency: ~90% of CD8+ T cells.** Intravenous injection of anti-CD8 DARPin-LNP carrying CAR-encoding mRNA resulted in approximately 90% transfection efficiency in circulating CD8+ T cells at 24 hours post-injection in mouse models. Expression was transient (mRNA-based), peaking at 24–48 hours and declining over 5–7 days.

**Selectivity.** DARPin-mediated targeting achieved >20-fold enrichment of T-cell transfection over non-target cells (monocytes, B cells, hepatocytes). Untargeted LNP of the same formulation showed <5% T-cell transfection, with the majority of expression occurring in the liver — confirming that the DARPin surface ligand redirects tropism away from the default hepatic sink.

**Functional CAR-T generation.** In vivo-generated CAR-T cells showed cytotoxic activity against target-antigen-positive tumor cells in both in vitro co-culture and in vivo tumor challenge models. Anti-CD19 CAR-T cells generated in vivo cleared B-cell lymphoma with efficacy comparable to conventionally manufactured ex vivo CAR-T (>80% tumor-free survival at 60 days).

**Redosability.** Because LNP does not integrate into the genome and does not trigger the adaptive immune response against a viral capsid, the DARPin-LNP could be re-administered at weekly intervals without loss of transfection efficiency or neutralizing antibody formation over the observation period (4 weekly doses tested).

**Cost and speed advantage.** In-vivo CAR-T eliminates the 2–4 week ex vivo manufacturing process (leukapheresis, T-cell activation, viral transduction, expansion, QC release), potentially reducing the time from biopsy to treatment to <1 day and the cost by an estimated 10–50×.

## The Bypass Logic

Blood T cells are freely accessible to IV-injected LNPs — they do not require penetration of the solid tumor microenvironment. The strategy exploits the LNP's natural access to the blood compartment (where hepatic tropism is a feature, not a bug, when the target is blood cells) to program T cells that then migrate to the tumor on their own. This is a pure bypass of the solid-tumor delivery wall.

## Impact

This paper represents a paradigm shift: rather than trying to deliver editor cargo into solid tumor cells (the 0.7% problem), the approach programs effector cells in the blood that independently traffic to and kill tumor cells. If the transient expression limitation can be addressed (via repeated dosing or integration-competent payloads), in-vivo CAR-T via targeted LNP could eliminate the manufacturing bottleneck and the delivery wall simultaneously.
