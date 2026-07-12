---
topic: Tumor hypoxia — median tumor pO2 below 2% drives HIF-1α-mediated immunosuppression, adenosine, PD-L1, and radioresistance
keywords: [hypoxia, HIF-1alpha, pO2, oxygen, CD39, CD73, adenosine, A2A receptor, PD-L1, radioresistance, immune exclusion]
related: [solid-tumor-immune-response.md, metabolic-hostility.md, vascular-normalization-hev.md, sources/ohta-2020-hypoxia-immune.md]
defines:
  tumor-hypoxia: "Low tumor oxygenation (median pO2 below 2%, roughly ≤10 mmHg, versus 40–65 mmHg in normal tissue) from abnormal vasculature — stabilizing HIF-1α, upregulating CD39/CD73→adenosine and PD-L1, impairing T/NK function, and conferring ~3× radioresistance"
kinds:
  tumor-hypoxia: constraint
epistemics: empirical
source: "Matuszewska 2021 (median tumor O2 0.3–4.2%, most <2%, hypoxic cells ~3× radiation dose); Ohta 2020 J Transl Med (hypoxia→CD39/CD73→adenosine→A2AR suppression, HIF-1α→PD-L1)"
source_type: paper
asserted_at: "2026-07"
---

# Tumor Hypoxia

[[tumor-hypoxia]] is the upstream metabolic determinant that couples the abnormal tumor vasculature to immune suppression. Because tumor vessels are chaotic and poorly perfused, oxygen runs out — and the low-oxygen state is not neutral, it actively disables immunity.

## The Numbers

Median untreated tumor oxygenation is **0.3–4.2% O₂, with most tumors below 2%** (roughly ≤10 mmHg), against a normal-tissue physioxia of 8–100 mmHg (venous 30–40, arterial 75–100; normal breast ~65 mmHg versus breast tumor ~10 mmHg median). A tumor becomes hypoxic in its core once it grows beyond ~2 mm, the diffusion limit of oxygen from vessels. Hypoxic cells require about **3× the radiation dose** to kill (the oxygen enhancement ratio) — hypoxia is a direct cause of radioresistance.

## How Hypoxia Disables Immunity (Ohta 2020)

Low oxygen stabilizes **HIF-1α** (rapidly degraded in normoxia via prolyl-hydroxylase/VHL), which drives several immunosuppressive programs:

- **Adenosine axis.** Hypoxia upregulates the ectonucleotidases **CD39 and CD73**, generating extracellular adenosine that suppresses cytotoxic T and NK cells through the A2A receptor — the link to [[metabolic-hostility]].
- **Checkpoint upregulation.** HIF-1α upregulates **PD-L1** on tumor and myeloid cells.
- **Direct T-cell impairment.** Hypoxia downregulates the Kv1.3 potassium channel in T lymphocytes and, with lactate and acidosis, reduces T/NK activation and survival.
- **Suppressive recruitment.** Hypoxia recruits immunosuppressive myeloid cells and correlates with metastasis, recurrence, and shorter survival.

Hypoxia is thus a common upstream cause of immune exclusion, blocking [[solid-tumor-immune-response]] at the function gate. The countermeasure is not oxygen delivery per se but [[vascular-normalization]], which improves perfusion and oxygenation.

blocks:: [[solid-tumor-immune-response]]
