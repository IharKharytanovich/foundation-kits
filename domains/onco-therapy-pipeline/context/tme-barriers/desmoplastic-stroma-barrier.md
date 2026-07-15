---
topic: The desmoplastic stroma barrier — dense CAF-driven collagen/hyaluronan matrix that physically excludes T cells and nanoparticles, occupying >80% of pancreatic tumor volume
keywords: [desmoplasia, stroma, extracellular matrix, cancer-associated fibroblast, CAF, collagen, hyaluronan, FAP, physical exclusion, pancreatic cancer, ECM stiffness]
related: [solid-tumor-immune-response.md, interstitial-fluid-pressure.md, stroma-modification.md, ../delivery/delivery-wall.md, sources/masugi-2022-desmoplasia.md, ../viral-delivery/bite-arming.md]
defines:
  desmoplastic-stroma-barrier: "The dense desmoplastic stroma — cancer-associated fibroblasts, fibrillar collagen, and hyaluronan occupying >80% of tumor volume in pancreatic cancer — that physically excludes T cells and nanoparticles from the tumor parenchyma and generates the solid stress and interstitial hypertension underlying the delivery wall"
kinds:
  desmoplastic-stroma-barrier: constraint
epistemics: empirical
source: "Masugi 2022 Cancers (stroma >80%, ~90% ECM is collagen, CD8 tumor-center <half of margin); Ohta 2020 (breast stroma up to 10× stiffer, collagen density ↓CD8); CAF-subset literature (myCAF/iCAF/apCAF)"
source_type: paper
asserted_at: "2026-07"
---

# The Desmoplastic Stroma Barrier

[[desmoplastic-stroma-barrier]] is the physical wall around the tumor cell nest — a dense fibroblast-and-matrix shell that both stops T cells from reaching cancer cells and generates the pressure gradients that block drug delivery. It is the clearest link between the immune-exclusion problem and the delivery problem.

## The Scale of the Stroma

In pancreatic ductal adenocarcinoma the carcinoma cells are often less than 20% of the tumor bed — the desmoplastic stroma occupies **more than 80%** of the tissue volume ("up to ~90% stroma"). About 90% of the extracellular-matrix protein is collagen, and about 90% of that is type I/III fibrillar collagen. In a 215-tumor cohort, mean collagen occupancy was 38.4% and fibroblast occupancy 33.3%.

## Physical T-Cell Exclusion

The matrix physically excludes T cells: the mean CD8 T-cell density in the tumor center is less than half that at the tumor margin — T cells accumulate at the edge and cannot penetrate. Breast tumor stroma can be up to 10× stiffer than normal tissue, and high collagen density correlates with reduced CD8 infiltration; T cells on high-density matrix downregulate activation and migration programs. This is the physical arm of the block on [[solid-tumor-immune-response]].

## Cancer-Associated Fibroblast Heterogeneity

The stroma is built and maintained by cancer-associated fibroblasts (CAFs), which are heterogeneous: myofibroblastic myCAF (contractile, TGF-β-driven), inflammatory iCAF (IL-6/CXCL12/LIF-secreting), and antigen-presenting apCAF (MHC-II⁺), among others — a multiplex marker panel is needed to capture them. FAP⁺ CAFs are the leading depletion target and the antigen for FAP-directed [[bite-arming]] and [[retargeted-viral-vector]] approaches, though systemic FAP-CAR-T caused lethal toxicity in mice (FAP⁺ cells exist in bone marrow), forcing local delivery.

## The Link to the Delivery Wall

Because the same collagen and hyaluronan generate solid stress and drive interstitial hypertension, the desmoplastic stroma is a primary physical cause of the [[solid-tumor-delivery]] wall — it excludes nanoparticles as effectively as it excludes T cells. Attempts to dismantle it are covered in [[stroma-modification]], where the phase-3 results have been sobering.

blocks:: [[solid-tumor-immune-response]]
blocks:: [[solid-tumor-delivery]]
