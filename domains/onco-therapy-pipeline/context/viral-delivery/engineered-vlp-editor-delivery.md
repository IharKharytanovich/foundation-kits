---
topic: Engineered virus-like particles (eVLPs) for transient in-vivo delivery of gene-editor ribonucleoprotein — therapeutic editing without DNA and with minimal off-target
keywords: [eVLP, virus-like particle, ribonucleoprotein, RNP, base editor, prime editor, NanoMEDIC, nanoblade, gesicle, transient delivery, Banskota, Liu]
related: [transient-vs-persistent-editing.md, retargeted-viral-vectors.md, ../delivery/barriers.md, sources/banskota-2022-evlp.md, sources/an-2024-pe-evlp.md]
defines:
  engineered-vlp-delivery: "Delivery of a gene editor (base/prime editor or Cas9) as transient protein–RNA ribonucleoprotein packaged inside an engineered virus-like particle — DNA-free, therapeutically efficient in vivo (up to 63% liver base editing from one dose), with off-target editing near-eliminated versus DNA-encoded vectors"
kinds:
  engineered-vlp-delivery: method
epistemics: empirical
source: "Banskota & Liu 2022 Cell (v4 eVLP, 63% liver base editing, PCSK9 −78%, 26× over 1st-gen); An 2024 Nat Biotechnol (PE-eVLP, 65–170× over base-editor-derived); Gee 2020 NanoMEDIC (>90% DMD exon skipping)"
source_type: paper
asserted_at: "2026-07"
---

# Engineered VLPs for Transient Editor Delivery

[[engineered-vlp-delivery]] solves a problem the [[delivery-bypass]] strategies do not: how to deliver a **gene editor** into cells transiently, avoiding the prolonged nuclease expression that DNA-encoded vectors (AAV, lentivirus, plasmid) impose. An eVLP packages the editor as protein–RNA ribonucleoprotein — no DNA — so it acts within hours and is gone, the direct enabler of the [[transient-editor-advantage]].

## Fourth-Generation eVLPs (Banskota & Liu 2022)

Engineering across cargo packaging, protease-cleavage release, and cargo localization produced v4 eVLPs that were ~26× more efficient than a first-generation design (5–40× across targets). A single systemic injection achieved **63% base editing in mouse liver** with serum PCSK9 reduced 78%, and therapeutic editing in retina (partial rescue of a genetic-blindness model) and brain — at doses of ~4–7 × 10¹¹ particles. Off-target editing was "virtually undetected" at CIRCLE-seq loci versus AAV and plasmid.

## Prime Editors, the Hardest Cargo (An 2024)

Prime-editor machinery (~6–8 kb-scale) exceeds a single AAV's capacity outright. PE-eVLPs packaging the prime editor protein + pegRNA + nicking sgRNA reached 65–170× higher prime-editing efficiency in human cells than an earlier base-editor-derived design, with therapeutic in-vivo prime editing in the retina — extending transient RNP delivery to the largest editor class.

## The Retroviral-Gag Lineage

NanoMEDIC (MMLV/lentivirus-derived RNP nanovesicles) achieved >90% exon-skipping in DMD-patient iPSC muscle and permanent exon skipping in mdx mice from a single intramuscular injection — explicitly built to avoid the off-target and immunogenicity of prolonged Cas9 expression. Nanoblades (MLV Cas9-RNP) and VSV-G gesicles are the same "package the RNP, not the gene" idea.

## Where It Fits the Pipeline

eVLPs are a delivery vector for the genetic branch, not a modality in themselves. Their present limits are short follow-up, sub-clinical-scale particle yield, and mostly liver/retina/muscle demonstrations — direct in-tumor editing remains the unmet [[in-vivo-genetic-editing]] goal. Their value is safety: transient exposure is the cleanest way to cut off-target editing.

supports:: [[transient-editor-advantage]]
