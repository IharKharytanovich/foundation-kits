---
topic: The hard manufacturing-time floor — QC/release and biology set a 3–4 week minimum that the aspirational sub-hour target does not account for
keywords: [manufacturing floor, QC floor, sterility testing, release testing, compressible, hard floor, turnaround, mRNA vaccine, neoantigen, tumor evolution, stale target]
related: [timeline.md, targets.md, sources/mrna-vaccine-turnaround-benchmarks.md, sources/gmp-release-testing-floors.md, sources/tumor-clonal-evolution-dynamics.md, ../manufacturing/bioreactor.md]
anchors:
  the-floor: [QC, sterility, USP 71, 14 days, fill-finish, release]
  stale-target-tension: [tumor evolution, neoantigen drift, clonal evolution, manufacturing interval]
defines:
  manufacturing-time-floor: "The hard lower bound on personalized therapy manufacturing time (~3–4 weeks), set by compendial QC/release testing (14-day sterility) and GMP overheads — not by the computational or synthetic steps the sub-hour aspiration targets"
kinds:
  manufacturing-time-floor: constraint
epistemics: empirical
source: "Rojas et al. Nature 2023 618:144 (BNT122 ~6 wk); Weber et al. Lancet 2024 (mRNA-4157 ~6–8 wk); USP <71> (14-day sterility); McGranahan et al. Cell 2017 171:1259 (neoantigen depletion)"
source_type: paper
asserted_at: "2026-07"
---

# The Manufacturing-Time Floor

<!-- @anchor: the-floor -->
## The Floor

The [[manufacturing-time-floor]] is the incompressible lower bound on personalized therapy manufacturing: **~3–4 weeks** from tumor biopsy to patient dose. It is set by two hard constraints that no computational speedup can bypass:

1. **Compendial sterility testing (USP <71>)**: 14-day incubation, required for GMP release of aseptically produced injectables. No rapid alternative has achieved regulatory equivalence for final product release as of 2025. This single test accounts for half the total manufacturing time.

2. **GMP manufacturing overheads**: fill/finish (1–2 days), potency assays (3–7 days), stability-indicating tests (3–7 days), identity confirmation (1–2 days). These run partly in parallel with sterility but add a net ~1 week beyond the 14-day sterility incubation.

The front-end computational pipeline (sequencing, neoantigen prediction, mRNA design) has already been compressed to **< 2 weeks** and is no longer rate-limiting. The BNT122 iNeST platform achieves ~6 weeks end-to-end (Rojas 2023); Moderna's mRNA-4157 runs ~6–8 weeks (Weber 2024). The compression from 9→6→4 weeks over 2017–2025 was achieved entirely by parallelizing the front-end with clinical recovery, not by compressing QC. The floor is the back-end.

This floor directly refutes the [[thirty-minute-target]] as a description of the full diff-to-dose loop — the sub-hour aspiration addresses sequencing-to-design, which was never the bottleneck:

contradicts:: [[thirty-minute-target]]

The floor is measured from the real-world data that constitute the [[end-to-end-timeline]]:

derived-from:: [[end-to-end-timeline]]

<!-- @anchor: stale-target-tension -->
## The Stale-Target Tension

The manufacturing-time floor creates a fundamental biological tension: the tumor evolves during the manufacturing interval. McGranahan et al. (Cell 2017) showed systematic neoantigen depletion under immune pressure; Rosenthal et al. (Cancer Cell 2019) found HLA loss of heterozygosity in 40% of NSCLC tumors. Over a 4–8 week window, subclonal neoantigen targets have a >50% probability of measurable drift (for a 20-neoantigen panel with any subclonal components).

This means the manufacturing-time floor is not just a logistical inconvenience — it is a biological constraint on efficacy. Every week of delay increases the probability that the neoantigen snapshot used to design the therapy no longer matches the tumor at dosing. The optimal manufacturing time is the shortest interval that does not compromise safety: currently ~4 weeks at the frontier, bounded below by the 14-day sterility test.

Honest speed work attacks QC method validation (rapid sterility acceptance) or changes the manufacturing modality (cell-free synthesis, continuous processing) — not the sequencing step, which is already fast.
