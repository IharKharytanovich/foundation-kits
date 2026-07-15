---
topic: CRISPR allele-specific targeting constraints — PAM limitations, off-target risk, and loss of heterozygosity challenges
keywords: [CRISPR, Cas9, PAM, allele-specific, off-target, LOH, loss of heterozygosity, SpRY, base editing, prime editing, heterozygosity, driver mutation]
related: [../allele-specificity.md, ../../design/genetic/genetic-targeting-design.md]
source: "Walton et al. 2020 Science 368:290 doi:10.1126/science.aba8853 (SpRY); Kleinstiver et al. 2016 Nature 529:490 doi:10.1038/nature16526 (HiFi SpCas9); Anzalone et al. 2019 Nature 576:149 doi:10.1038/s41586-019-1711-4 (prime editing); McGranahan et al. 2015 Science 351:1463 doi:10.1126/science.aaf1490 (LOH in cancer)"
source_type: paper
epistemics: empirical
asserted_at: "2026-07"
---

# CRISPR Allele-Specific Targeting Constraints

Allele-specific gene editing — targeting a mutant allele while leaving the wild-type intact — is the theoretical ideal for heterozygous driver mutations. In practice, three constraints limit its applicability:

**PAM site availability:** SpCas9 requires an NGG PAM within ~20 bp of the target site. Only ~60% of known cancer driver mutations have a suitable NGG PAM within editing range. SpRY (Walton et al. 2020) relaxes the PAM requirement to NRN/NYN, theoretically covering >90% of the genome, but at the cost of reduced specificity (2-5× higher off-target rates compared to wild-type SpCas9). High-fidelity variants (eSpCas9, SpCas9-HF1; Kleinstiver et al. 2016) reduce off-targets but restrict the PAM window further. The net coverage of driver mutations with both PAM access and acceptable off-target profiles remains below 40%.

**Loss of heterozygosity (LOH):** McGranahan et al. 2015 showed that LOH affects 20-40% of the genome in many solid tumors, with tumor suppressors (TP53, RB1, CDKN2A) frequently losing the wild-type allele. When LOH converts a heterozygous driver to hemizygous, allele-specific targeting becomes impossible — there is only one allele, and editing it is equivalent to a knockout. LOH prevalence varies by cancer type (>60% in ovarian serous, ~25% in melanoma).

**Base and prime editing discrimination:** Base editors (CBE, ABE) can convert single nucleotides without double-strand breaks but require a specific editing window (positions 4-8 in the protospacer) and are limited to C→T or A→G transitions. Prime editing (Anzalone et al. 2019) can install any substitution but has lower efficiency (5-50% in cell lines, often <10% in primary cells) and requires a pegRNA design that may not discriminate between mutant and wild-type alleles when the distinguishing SNP falls outside the editing window.

**Net clinical reach:** The intersection of (1) heterozygous driver mutations, (2) PAM accessibility, (3) acceptable off-target profiles, and (4) sufficient editing efficiency covers a minority of targetable cancer mutations. This is why ex-vivo editing (where selection and expansion compensate for low efficiency) dominates clinical pipelines, and in-vivo allele-specific editing of solid tumors remains preclinical.
