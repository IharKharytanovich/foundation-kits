---
topic: Clinical manufacturing turnaround benchmarks for personalized mRNA cancer vaccines (BNT122, mRNA-4157/V940) from biopsy to first patient dose
keywords: [mRNA vaccine, manufacturing turnaround, BNT122, autogene cevumeran, mRNA-4157, V940, iNeST, personalized neoantigen, biopsy-to-dose, six weeks, four weeks, IVT, LNP formulation]
related: [../manufacturing-time-floor.md]
epistemics: empirical
source: "Rojas et al. Nature 2023 618:144 (BNT122 pancreatic adjuvant, ~6 wk turnaround); Weber et al. Lancet 2024 (KEYNOTE-942, ~6-8 wk); Sahin et al. Nature 2017 547:222 (first iNeST proof-of-concept melanoma); BioNTech iNeST platform technical disclosures AACR 2024"
source_type: clinical-trial
asserted_at: "2026-07"
---

# Personalized mRNA Cancer Vaccine Manufacturing Turnaround Benchmarks

## BNT122 / Autogene Cevumeran (BioNTech iNeST Platform)

Rojas LA, Sethna Z, Soares KC, et al. Personalized RNA neoantigen vaccines stimulate T cells in pancreatic cancer. Nature. 2023;618:144-150.

- Phase 1 adjuvant trial in surgically resected pancreatic ductal adenocarcinoma (PDAC).
- Each vaccine encodes up to **20 patient-specific neoantigens** selected by the iNeST (individualized Neoantigen Specific immunoTherapy) pipeline.
- Manufacturing turnaround from surgical resection to first vaccine dose: approximately **6 weeks** (range 5–8 weeks across 16 treated patients).
- Process: tumor/normal WGS + RNA-seq → computational neoantigen selection → mRNA construct design → GMP IVT synthesis → LNP encapsulation → QC/release → shipping.
- 8 of 16 patients (50%) showed de novo neoantigen-specific T cell responses; responders had significantly longer recurrence-free survival (median not reached vs 13.4 months, HR 0.08, p = 0.003).
- Atezolizumab (anti-PD-L1) given concurrently; the combination was well tolerated.

## mRNA-4157/V940 (Moderna/Merck)

Weber JS, Carlino MS, Lao CD, et al. Individualized neoantigen therapy mRNA-4157 (V940) plus pembrolizumab versus pembrolizumab monotherapy in resected melanoma (KEYNOTE-942): a randomised, phase 2b study. Lancet. 2024;403(10427):632-644.

- Each vaccine encodes up to **34 neoantigens** per patient (highest capacity in clinical development).
- Manufacturing turnaround: approximately **6–8 weeks** from tumor biopsy to first dose.
- The mRNA-1273/Spikevax LNP platform is reused, leveraging Moderna's established manufacturing infrastructure.
- Phase 3 trial V940-001 (KEYNOTE-D18, NCT05933577) initiated late 2023, enrolling ~1,089 patients across melanoma, NSCLC, renal cell carcinoma, and bladder cancer.

## Process Step Breakdown (Composite from Published Data)

| Step | Duration | Source |
|------|----------|--------|
| Tumor/normal sequencing (WGS/WES + RNA-seq) | 3–7 days | Sahin 2017, Rojas 2023 |
| Bioinformatic neoantigen prediction + selection | 1–3 days | Sahin 2017 (TRON pipeline) |
| mRNA construct design + synthesis (IVT) | 1–2 days | BioNTech AACR 2024 disclosures |
| LNP encapsulation + formulation | 1 day | Moderna platform specifications |
| GMP fill/finish | 1–2 days | Industry standard |
| QC/release testing | 14–21 days | USP sterility + potency assays |
| Logistics/shipping | 1–3 days | Cold-chain distribution |
| **Total** | **~4–8 weeks** | Composite |

The front-end computational steps (sequencing + prediction) are already fast (< 2 weeks). The binding floor is QC/release testing (14 days minimum for sterility per USP <71>) plus GMP manufacturing overheads.

## Historical Trajectory

- Sahin et al. 2017 (first iNeST melanoma): manufacturing turnaround was **~9 weeks** per patient.
- By 2023 (Rojas pancreatic adjuvant): reduced to **~6 weeks**.
- BioNTech's stated goal (AACR 2024): further compress to **~4 weeks** by process parallelization and rapid-release QC methods.
- The compression from 9→6→4 weeks was achieved primarily by parallelizing sequencing with clinical recovery and by streamlining the IVT/LNP process, NOT by compressing QC.
