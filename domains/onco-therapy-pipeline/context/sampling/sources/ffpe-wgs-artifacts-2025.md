---
topic: FFPE formalin-fixation artifacts in whole-genome and targeted sequencing — quantification, computational filtering (FilterByOrientationBias, FFPErase), and performance benchmarks 2020–2025
keywords: [FFPE, formalin fixation, deamination, C>T artifact, strand orientation bias, FilterByOrientationBias, FFPErase, Mutect2, GATK, DIN, DNA integrity, PCAWG, artifact filtering, oxoG]
related: [../ffpe-artifact-filtering.md]
source: "Nat Commun 2025 (DOI: 10.1038/s41467-025-65654-7); Benjamin 2019 bioRxiv (DOI: 10.1101/861054); PCAWG 2020 Nature 578:82 (DOI: 10.1038/s41586-020-1969-6); Costello 2013 NAR (DOI: 10.1093/nar/gks1443)"
source_type: paper
epistemics: empirical
asserted_at: "2026-07"
---

# FFPE Artifacts in NGS — Quantification and Filtering

## The Problem

Formalin fixation causes cytosine deamination (C>U → C>T/G>A after PCR). These artifacts appear as low-VAF C:G>T:A transitions mimicking real somatic mutations. Artifact rate correlates with DNA Integrity Number (DIN): DIN <3 blocks produce 10–100× higher artifact rates than DIN >7 blocks. FFPE blocks >4 years old have ~50% NGS failure rate and ~11% amplifiable DNA fraction (J Pers Med 2022, PMC9146170).

## Quantitative Benchmarks

- FFPE artifact enrichment vs fresh-frozen (WGS): median 20× across mutation classes (56 matched pairs, Nat Commun 2025).
- FFPE C>T artifact rate at DIN <3: 10–30 artifacts per Mb (vs <0.5/Mb in fresh-frozen) at WES ~200×.
- Consensus calling SV artifact reduction: 98% (WGS, FFPE; Nat Commun 2025).
- PCAWG pipeline FDR: 1.3 per Mb across 2,658 tumors including FFPE (multi-caller consensus + DKFZ filters; Nature 2020).

## FilterByOrientationBias (GATK/Mutect2)

Benjamin D, Sato T, Cibulskis K, et al. Calling Somatic SNVs and Indels with Mutect2. bioRxiv 2019. DOI: 10.1101/861054.

- Bayesian model learned from sample-specific read orientation data via `LearnReadOrientationModel`.
- Per-trinucleotide-context artifact prior probabilities applied in `FilterMutectCalls`.
- Handles both FFPE (C>T/G>A) and oxoG (G>T/C>A) artifacts in a unified framework.
- Performance: reduces false positive rate ~80–90% vs unfiltered Mutect2 on FFPE DIN 2–4 samples, with <2% loss of true somatic calls at VAF >5%.

## FFPErase (ML-based, 2025)

Nat Commun 2025. DOI: 10.1038/s41467-025-65654-7.

- Machine learning framework classifying each variant as real or FFPE artifact.
- Features: strand orientation bias, trinucleotide context, VAF, local sequencing quality, fragment size distribution, known FFPE signature patterns.
- On 56 matched FF/FFPE pairs at WGS scale: consensus calling alone was insufficient for SNV/indel artifacts; FFPErase brought FFPE WGS quality to within clinical-grade thresholds.

## DKFZ Artifact Filters (PCAWG/ICGC)

ICGC/TCGA Pan-Cancer Analysis of Whole Genomes Consortium. Nature. 2020;578:82-93. DOI: 10.1038/s41586-020-1969-6.

- Multi-caller consensus (Mutect, Strelka, DKFZ mpileup-based caller).
- Strand bias filter, PCR bias filter, panel-of-normals filter.
- Achieved 1.3/Mb FDR across 2,658 tumors including many FFPE samples.

## SOBDetector (Strand Orientation Bias)

Costello M, Pugh TJ, Fennell TJ, et al. Nucleic Acids Res. 2013;41(6):e67. DOI: 10.1093/nar/gks1443.

- Original characterization of strand orientation bias from DNA damage.
- Tests each variant for orientation bias (artifact on one strand only after PCR).
- Removes 70–90% of FFPE artifacts while retaining >95% of real variants at default thresholds.
