---
topic: LNP vs AAV as delivery platforms for gene-editing cargo — LNP leads on payload, redosability, and immunity but defaults to the liver
keywords: [LNP, AAV, delivery platform, gene editing, payload capacity, redosability, pre-existing immunity, liver tropism, ApoE, LDLR, comparison]
related: [delivery-wall.md, barriers.md, bypass.md, sources/chhabra-2024-aav-nab-prevalence.md, sources/ntla-2001-clinical-results.md]
defines:
  lnp-vs-aav-tradeoffs: "Head-to-head comparison of LNP and AAV as editor-cargo delivery platforms: LNP wins on payload size (unlimited vs 4.7 kb), redosability, and lack of pre-existing immunity, but defaults to the liver via ApoE→LDLR"
kinds:
  lnp-vs-aav-tradeoffs: claim
epistemics: empirical
source: "Chhabra 2024 (AAV NAb 55–95%); Gillmore 2021 / Intellia 2023–2025 (NTLA-2001 liver editing); Hou 2021 Nat Rev Mater (LNP review)"
source_type: paper
asserted_at: "2026-07"
---

# LNP vs AAV for Gene-Editing Cargo

[[lnp-vs-aav-tradeoffs]] captures the central delivery-platform decision as of 2025: lipid nanoparticles (LNP) and adeno-associated viruses (AAV) are the only two clinically validated in-vivo delivery modalities for gene-editing payloads, and LNP is pulling ahead on every axis except tissue tropism breadth.

## LNP Advantages

**Payload capacity.** LNP can encapsulate mRNA of essentially unlimited length — Cas9 mRNA (~4.5 kb) plus guide RNA fits easily in a single particle, with room for additional cargo (base editors at ~6 kb, prime editors at ~8 kb). AAV's packaging limit is ~4.7 kb, forcing dual-vector strategies for editors larger than SpCas9, which reduces transduction efficiency quadratically.

**Redosability.** LNP does not elicit a capsid-specific adaptive immune response. NTLA-2001 Phase 1/2 data show no neutralizing antibody formation against the LNP after IV dosing. In contrast, AAV triggers a robust anti-capsid humoral and cellular response after the first dose, effectively precluding repeat administration.

**No pre-existing immunity.** Unlike AAV, where 55–95% of adults carry neutralizing antibodies (Chhabra 2024), LNP faces no pre-existing immunological barrier. Every patient is eligible for LNP-based therapy without pre-screening or immunodepletion.

**Manufacturing.** LNP production is a chemical process (rapid mixing of lipid/ethanol and mRNA/aqueous phases) scalable to millions of doses per year — demonstrated during COVID-19 mRNA vaccine manufacturing. AAV manufacturing requires mammalian cell culture, with yields of 10^14–10^15 vg per batch and costs of $50,000–$500,000 per patient dose.

## LNP's Defining Limitation

LNP's default biodistribution targets the liver via the ApoE adsorption → LDLR-mediated uptake pathway. Without active retargeting, >80% of an IV-injected LNP dose accumulates in hepatocytes. This makes LNP ideal for liver targets (NTLA-2001 achieved >90% TTR knockdown) but unsuitable for direct delivery to solid tumors, lung, brain, or muscle without formulation changes that remain pre-clinical.

gated-by:: [[solid-tumor-delivery]]

The LNP liver default is why the 2024–26 wins are all bypass strategies: the liver is reachable (NTLA-2001), blood T-cells are reachable (in-vivo CAR-T), and accessible tumors are reachable (intratumoral injection) — but systemic delivery to a solid tumor is not.

## AAV's Residual Niche

AAV retains advantages in tissue tropism breadth (AAV9 crosses the blood-brain barrier; AAV8 targets hepatocytes and muscle with high efficiency) and in achieving stable, potentially permanent transgene expression from the episomal vector genome. For single-dose, non-cancer gene therapy (e.g., hemophilia, SMA, inherited retinal dystrophy), AAV remains clinically preferred despite its immunological constraints.
