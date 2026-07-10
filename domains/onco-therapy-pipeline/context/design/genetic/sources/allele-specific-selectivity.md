---
topic: Allele-specific targeting selectivity in oncology — which driver mutations can be targeted with a therapeutic index and which cannot
keywords: [allele-specific, selectivity, KRAS G12C, KRAS G12D, sotorasib, adagrasib, siRNA, ASO, therapeutic index, wild-type, fusion breakpoint]
related: [../genetic-targeting-design.md]
epistemics: empirical
source: "Janne PA et al. NEJM 2022 (adagrasib); Skoulidis F et al. NEJM 2021 (sotorasib); Hallin J et al. Cancer Discov 2022 (MRTX1133); Mian AA et al. Mol Cancer 2024; Revolution Medicines RMC-6236/RAS(ON)"
source_type: paper
asserted_at: "2026-07"
---

# Allele-Specific Targeting Selectivity in Oncology

## The Selectivity Envelope: What Can Be Targeted

Allele-specific targeting is real for a narrow set of driver mutations where the mutant protein or nucleic acid sequence is structurally distinguishable from wild-type. The key metric is the **therapeutic index**: the ratio of potency against the mutant versus wild-type allele.

### KRAS G12C — Covalent Inhibitors (Approved)

- **Sotorasib (Lumakras)**: first KRAS-targeted therapy approved (FDA 2021). Covalent inhibitor that locks KRAS G12C in the GDP-bound inactive state. Selectivity is absolute at the protein level: only KRAS G12C (cysteine-12) can form the covalent bond; wild-type glycine-12 is unreactive.
- **Adagrasib (Krazati)**: approved FDA 2022 for NSCLC. Same covalent mechanism. ORR 42.9% (Jänne et al., NEJM 2022).
- **Therapeutic index**: effectively infinite for the covalent mechanism (WT KRAS has no cysteine to react with). Clinical selectivity confirmed by lack of on-target WT toxicity.

### KRAS G12D — Non-Covalent Inhibitors (Emerging)

- **MRTX1133 (Mirati/BMS)**: non-covalent, selective inhibitor of KRAS G12D (the most common KRAS mutation in pancreatic cancer). Preclinical selectivity: IC50 ~0.2 nM for G12D vs ~100 nM for WT (selectivity ratio ~500×). Phase 1/2 initiated 2023.
- **RMC-6236 (Revolution Medicines)**: RAS(ON) multi-selective inhibitor targeting KRAS active state (G12X family). Phase 1 in pancreatic and NSCLC.
- **Challenge**: G12D lacks the covalent handle of G12C; selectivity relies on shape complementarity at the switch II pocket, which is less absolute.

### Fusion Breakpoint Targeting

- **BCR-ABL fusions**: imatinib (2001) was the prototype. The fusion junction creates a unique sequence not present in either parent gene. Selectivity is against the fusion protein.
- **ALK, ROS1, RET, NTRK fusions**: targeted by crizotinib, lorlatinib, selpercatinib, larotrectinib respectively. These are matched (to the fusion), not personalized (to the patient's unique breakpoint sequence).
- **Patient-unique breakpoints**: individual fusion breakpoint sequences could in principle be targeted by ASO/siRNA, but no clinical program does this — the approved drugs target the kinase domain downstream of the breakpoint.

### Viral Oncogenes (HPV E6/E7)

- **HPV-driven cancers** (cervical, oropharyngeal, anal): E6 and E7 are foreign proteins (viral, not human) — selectivity is inherent.
- **Therapeutic vaccines**: VGX-3100 (DNA vaccine targeting HPV16/18 E6/E7), Phase 3 for CIN2/3. ISA101 (synthetic long peptide vaccine) + nivolumab: ORR 33% in HPV16+ oropharyngeal cancer.
- **TCR-T**: engineered TCR targeting HPV E6 (NCT03912831) — exploiting the foreign-antigen advantage.
- **Therapeutic index**: effectively infinite (E6/E7 are absent from normal cells).

### ASO/siRNA Allele-Specific Approaches

- **KRAS G12D siRNA (siG12D-LODER/silenseed)**: Phase 2 in pancreatic cancer. Biodegradable polymer implanted intratumorally releasing siRNA against G12D. Selectivity ratio of siRNA: ~37.7–80.1× knockdown of G12D vs <1% knockdown of WT KRAS at therapeutic concentrations (in vitro; Zorde Khvalevsky et al., PNAS 2013).
- **General ASO selectivity**: single-nucleotide discrimination by ASO/siRNA is sequence-dependent. Mismatches at positions 10–12 of the guide strand provide best discrimination for single-nucleotide variants, but selectivity ratios vary (10×–100× typical; absolute discrimination rare).

## What Is NOT Allele-Specifically Targetable

- **Passenger mutations**: random, patient-unique, no shared structural feature to exploit. They are targets for the immune branch (neoantigen vaccines), not the genetic branch.
- **Most point mutations**: loss-of-function mutations in tumor suppressors (TP53, RB1, APC) cannot be "targeted" — there is nothing to inhibit. Gain-of-function mutations outside the small-molecule-druggable pocket are not allele-specifically reachable.
- **Copy number changes**: amplification of WT ERBB2/HER2 or WT MYC — the protein is normal, just overexpressed. Targeted by expression-level inhibitors (trastuzumab), not by allele-specific approaches.

## Significance for the Pipeline

The genetic branch's allele-specific targeting is real but narrow: KRAS G12C (covalent, infinite selectivity), KRAS G12D (non-covalent, ~500× selectivity), fusion breakpoints (unique junction), and viral oncogenes (foreign protein). For the majority of tumor mutations, the genetic branch cannot offer allele-specific therapy — those patients are routed to the immune branch (neoantigen vaccines, TIL). The design stage's branching decision depends on the mutation class identified in the diff stage.
