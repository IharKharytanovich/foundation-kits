# Design — Two Branches

Turning the diff into a therapeutic via a cycle over two branches with different evaluability and economics. Immune ([immune/index.md](immune/index.md)) is the fastest personalized loop (<4 weeks for mRNA vaccines, broadest mutation coverage, gated by neoantigen immunogenicity); genetic ([genetic/index.md](genetic/index.md)) works for specific drivers with exploitable structural features (KRAS G12C/G12D, fusions, viral oncogenes) and is mostly ex vivo or liver-reachable, gated by the delivery wall for solid tumors. See [design-branches.md](design-branches.md) for the branching logic and delegation model. The genetic guide oracle is delegated to the onco-target-design domain; the mRNA construct oracle to mrna-design.

<!-- BEGIN GENERATED — DO NOT EDIT below this line -->

> ⚠️ **AUTO-GENERATED** — DO NOT EDIT. Changes will be overwritten on next write.

### Subfolders

- [genetic/](genetic/index.md): Oncolytic virus (T-VEC approved, RP1/RP2 Phase 2–3, CG0070 Phase 3), CRISPR/base/prime (CTX110/BEAM-201 allogeneic CAR-T, >90% editing efficiency ex vivo), ASO/siRNA (siG12D-LODER 37.7–80.1× selectivity). Allele-specific targeting is real for *specific* drivers — KRAS G12C (covalent, infinite selectivity; sotorasib/adagrasib approved), KRAS G12D (~500× selectivity, Phase 1/2), fusion breakpoints, HPV E6/E7 — not "any mutation." Mostly ex vivo or organs you can reach (liver, NTLA-2001 >90% knockdown); direct in-vivo editing of solid-tumor cells is not clinically achieved (blocked by the delivery wall). The sequence-level guide/off-target oracle lives in the paired **onco-target-design** domain — point there for guide design. (1 files)
- [immune/](immune/index.md): The fastest personalized loop today (<4 weeks for mRNA vaccines): neoantigen mRNA/peptide vaccines (mRNA-4157/V940 up to 34 neoepitopes, −44% recurrence HR 0.561; autogene cevumeran up to 20), adoptive cell therapy (Amtagvi/TIL ORR 31.4%, Tecelra/TCR-T ORR 36.4% — both FDA 2024), and off-the-shelf engagers (Imdelltra/BiTE ORR 40%). Computable: somatic variants, HLA, binding/presentation, mRNA construct design (delegated to mrna-design). Empirical: immunogenicity (<60% validate), off-tumor toxicity, persistence/trafficking, response of "cold" tumors. Rate-limited by neoantigen immunogenicity (see [walls/index.md](../../walls/index.md)). (1 files)

### Files

- [design-branches.md](design-branches.md) — The two-branch design cycle — immune vs genetic, different evaluability, different economics, converging on manufacture

<!-- END GENERATED -->
