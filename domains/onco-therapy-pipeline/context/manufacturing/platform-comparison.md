---
topic: Manufacturing platform scalability — mRNA/LNP vs viral vector vs cell product for N-of-1 personalized therapy
keywords: [mRNA, LNP, viral vector, AAV, lentivirus, CAR-T, cell therapy, scalability, N-of-1, autologous, cell-free, platform, manufacturing comparison]
related: [bioreactor.md, models.md, sources/sahin-2023-individualized-mrna-vaccine.md, sources/levine-2017-car-t-manufacturing.md, sources/lopes-2024-automated-cell-manufacturing.md]
defines:
  platform-scalability: "The comparative manufacturing scalability of therapeutic platforms for N-of-1 personalized production — mRNA/LNP is cell-free and the only platform where throughput does not scale linearly with bioreactor occupancy"
kinds:
  platform-scalability: claim
epistemics: empirical
source: "Levine 2017 (CAR-T ~50 steps/~80h); Rojas/Sahin 2023 (mRNA 6-9 weeks, 100% success); Lopes 2020 (cost comparison); AAV titre data 2024-2025"
source_type: paper
asserted_at: "2026-07"
---

# Manufacturing Platform Scalability

[[platform-scalability]] compares the three main therapeutic manufacturing platforms for personalized cancer therapy — each with fundamentally different scalability characteristics.

## mRNA/LNP (Cell-Free)

The only truly N-of-1-scalable platform. Manufacturing is cell-free: in-vitro transcription (IVT) is an enzymatic bench-scale reaction (~hours), followed by purification and LNP formulation via microfluidics. No bioreactor, no cell culture, no producer cell line. Turnaround: ~6–9 weeks biopsy-to-dose (BioNTech autogene cevumeran, 2023), with a target of <4 weeks. Manufacturing cost: ~$15,000–$30,000/patient. Manufacturing success rate: 100% in clinical trials (no patient excluded for manufacturing failure). The cell-free process means sequential patient batches can be produced on the same equipment line without the occupancy constraint of bioreactors.

## Viral Vector (AAV/Lentiviral)

Requires cell culture in bioreactors. AAV production via transient transfection of HEK293 cells yields ~10^10–10^11 vg/mL crude harvest. Lentiviral vectors: ~10^7–10^8 TU/mL crude (concentrated to ~10^8–10^9 TU/mL). Stable producer cell line establishment: 6–12 months per construct. Bioreactor occupancy is the limiting factor — each batch occupies a bioreactor for 3–7 days of cell culture plus harvest and downstream processing. Viral vector manufacturing is shared across patients (one vector lot can serve multiple patients if the construct is not patient-specific), but for personalized constructs it becomes an N-of-1 bottleneck.

## Cell Product (CAR-T/TCR-T/TIL)

The most constrained platform. ~50 manual process steps, ~80 hours hands-on, 9–12 day culture per patient batch. Vein-to-vein time: 3–5 weeks. Manufacturing cost: $50,000–$100,000/patient. Manufacturing failure rate: 1–5% (up to >10% for heavily pretreated patients). Automated systems (CliniMACS Prodigy, Lonza Cocoon) reduce manual steps and cost by 30–50% but do not eliminate the per-patient bioreactor occupancy constraint. Allogeneic approaches (off-the-shelf, iPSC-derived) aim to decouple manufacturing from individual patients but face immunological challenges (graft-vs-host, rejection).

## The Scalability Hierarchy

mRNA/LNP >> viral vector (non-personalized construct) > viral vector (personalized) >> cell product (automated) > cell product (manual). Only mRNA/LNP breaks the linear relationship between patient volume and manufacturing capacity. This claim supports the domain's position that [[manufacturing-throughput]] is a contributing floor but not the binding constraint — because mRNA bypasses the manufacturing bottleneck for the fastest personalized loop (immune branch):

derived-from:: [[manufacturing-throughput]]
