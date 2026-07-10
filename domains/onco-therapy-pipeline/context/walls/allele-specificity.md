---
topic: The allele-specificity wall — single-base discrimination and heterozygosity constraints that limit targetable mutations
keywords: [allele specificity, PAM, CRISPR, Cas9, LOH, loss of heterozygosity, base editing, prime editing, heterozygous, driver mutation, off-target, SpRY, editing window]
related: [sources/crispr-allele-specificity.md, ../design/genetic/genetic-targeting-design.md, ../delivery/barriers.md]
defines:
  allele-specificity-wall: "The constraint that allele-specific gene editing (targeting mutant while sparing wild-type) is achievable for fewer than 40% of heterozygous cancer driver mutations due to PAM site availability, off-target profiles, LOH prevalence, and editing window limitations — the reason in-vivo genetic correction of solid tumors remains preclinical"
kinds:
  allele-specificity-wall: constraint
epistemics: empirical
source: "Walton 2020 Science (SpRY); Kleinstiver 2016 Nature (HiFi Cas9); McGranahan 2015 Science (LOH); Anzalone 2019 Nature (prime editing)"
source_type: paper
asserted_at: "2026-07"
---

# The Allele-Specificity Wall

[[allele-specificity-wall]] gates the genetic branch of the design stage: for a heterozygous driver mutation, the editor must discriminate between the mutant and wild-type allele with single-base resolution. Three constraints compound to limit the fraction of targetable mutations.

**PAM access:** Only ~60% of cancer driver mutations have an NGG PAM within editing range for SpCas9. PAM-relaxed variants like SpRY (Walton et al. 2020) expand coverage to >90% of the genome but at 2-5× higher off-target rates. The net coverage with both PAM access and acceptable specificity is below 40% of driver mutations.

**Loss of heterozygosity:** LOH affects 20-40% of the genome in solid tumors (McGranahan et al. 2015), with tumor suppressors (TP53, RB1) frequently losing the wild-type allele. When a heterozygous driver becomes hemizygous through LOH, allele-specific targeting is impossible — there is only one allele.

**Editing efficiency:** Base editors are limited to C→T or A→G transitions within a narrow window (positions 4-8). Prime editing can install any substitution but achieves <10% efficiency in primary cells for many targets. The intersection of accessible, discriminable, and efficiently editable mutations is small.

The allele-specificity wall constrains [[genetic-targeting-design]] and contributes to the reason [[in-vivo-genetic-editing]] of solid tumors is not clinically achieved:

blocks:: [[genetic-targeting-design]]
gated-by:: [[solid-tumor-delivery]]

The wall does not apply to the immune branch (neoantigen vaccines target the immune system, not the tumor genome) and is partially bypassed by ex-vivo editing (where selection and expansion compensate for low efficiency) and by gene knockout strategies (where allele discrimination is not required). The domain `onco-target-design` holds the sequence-level detail.

discusses:: [[neoantigen-immunogenicity]]
