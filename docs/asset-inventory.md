# Kit — инвентарь ассетов и разбивка по китам (v1)

> **Статус:** инвентарь текущих ассетов `packages/found-bundle/bin/` и их
> разбивка на Kit для v1. Дополняет [architecture.md](architecture.md).
> Данные сняты 2026-06 (`du -ah` + чтение `WASM_MANIFEST`, `compute/worker.ts`,
> `pyodide-lock.json`).

---

## 1. Что физически есть сегодня (~74 МБ)

| Каталог | Размер | Состав |
|---|---|---|
| `bin/pyodide` | **65 МБ** | движок Pyodide + **48 `.whl`** |
| `bin/rdkit` | 6.7 МБ | `RDKit_minimal.wasm` (6.6М) + `.cjs` (128К) |
| `bin/wasm` | 2.8 МБ | `RNAfold.wasm` (2.3М) + `seqtk.wasm` (448К) + `LICENSE-ViennaRNA` |

## 2. Инфраструктура — НЕ киты (всегда в бандле)

Из 65 МБ pyodide ~13.7 МБ — это сам **движок**, а не пакеты. Без него
`mathCompute` не работает вообще. Это рантайм, внутри которого крутятся
pyodide-киты — отдельная сущность, не Kit.

| Файл | Размер |
|---|---|
| `pyodide.asm.wasm` | 8.3М |
| `python_stdlib.zip` | 2.3М |
| `libopenblas.zip` | 2.0М |
| `pyodide.asm.js` | 1.0М |
| `pyodide-lock.json` / `pyodide.mjs` | 112К / 20К |
| WASI-рантайм (`node:wasi` + воркер) | код, 0 |

**Итого инфраструктура ≈ 13.7 МБ.** Это floor при любом раскладе.

---

## 3. Модель разбивки (из обсуждения)

1. **1 связная `instruction.md` = 1 Kit** — граница кита там, где кончается одна
   осмысленная инструкция. Обычно = один upstream-проект (ViennaRNA с RNAfold +
   RNAcofold = 1 Kit; biopython ≠ freesasa = 2 Kit).
2. **Бэндлинг:** Kit **вбэндливает свои ЭКСКЛЮЗИВНЫЕ зависимости** (несколько
   `.whl` в одном ките). **ОБЩИЕ зависимости (2+ потребителя) — отдельные киты**,
   потому что Pyodide-интерпретатор один: общий пакет нужен в одной версии без
   дублей. Это и даёт «джойны» (мультиартефактные киты).
3. **Все киты равны.** У каждого = `{1+ артефактов, instruction.md, kit.json
   (метаданные), manifest.json (вызываемая поверхность)}`. Второго сорта нет.
4. **Оси кита:** `tags[]` (таксономия) + `tier` (default/library). **Нет**
   `role` (это свойство ребра домен↔кит) и **нет** `category` (заменён `tags`).
5. **capability / dependency — свойство РЕБРА, не кита.** Привязан явно → его
   инструкция инжектится; приехал транзитивно → грузится в рантайм, инструкция
   не инжектится. Тот же кит в одном домене capability, в другом — транзитивная
   зависимость.

---

## 4. Все киты (36) — единая таблица

> У каждого: `instruction.md` (проза) + `kit.json` (метаданные) + `manifest.json`
> (вызываемая поверхность: операции/params + golden).
> «Зависит от» = только **общие** киты (эксклюзивные deps вбэндлены в артефакты).

| Kit | tags | tier | артефакты (whl/wasi в ките) | зависит от (общие киты) |
|---|---|---|---|---|
| **numpy** | math, core | **default** | numpy (2.7М) | — |
| **scipy** | math, core | **default** | scipy (16М) | numpy |
| **sympy** | math, symbolic | **default** | sympy + mpmath + gmpy2 (4.7М) | — |
| **biopython** | biology, sequences | library | biopython (2.6М) | numpy |
| **freesasa** | biology, structure | library | freesasa (204К) | — |
| **pyrodigal** | biology, genomics | library | pyrodigal (744К) | — |
| **dendropy** | biology, phylogenetics | library | DendroPy (456К) | — |
| **viennarna** | biology, rna | library | RNAfold.wasm (2.3М) | — |
| **seqtk** | biology, sequences | **default** | seqtk.wasm (448К) | — |
| **rdkit** | chemistry | library | RDKit_minimal.wasm + .cjs (6.7М) | — |
| **molmass** | chemistry, biology | library | molmass (76К) | — |
| **selfies** | chemistry, biology | library | selfies (36К) | — |
| **astropy** | physics, astronomy | library | astropy + pyerfa + astropy_iers_data (7.9М) | numpy, packaging, pytz |
| **iminuit** | physics, fitting | library | iminuit (208К) | numpy |
| **lmfit** | physics, fitting | library | lmfit + asteval (120К) | numpy, scipy, uncertainties |
| **pint** | physics, units | library | pint + flexcache + flexparser + platformdirs + typing_extensions (412К) | — |
| **scikit-fem** | physics, pde | library | scikit_fem (172К) | numpy, scipy |
| **findiff** | physics, math | library | findiff (40К) | numpy, scipy |
| **chaospy** | physics, uncertainty | library | chaospy + numpoly (400К) | numpy, scipy |
| **pywavelets** | physics, signal | library | pywavelets (896К) | numpy |
| **uncertainties** | physics, statistics | library | uncertainties (60К) | — |
| **pandas** | data-science, core | library | pandas + python-dateutil (4.5М) | numpy, pytz |
| **scikit-learn** | data-science, ml | library | scikit_learn + threadpoolctl (5.4М) | numpy, scipy, joblib |
| **networkx** | graphs, biology | library | networkx + pyparsing (1.1М) | — |
| **emcee** | statistics, sampling | library | emcee (48К) | numpy, dill |
| **dynesty** | statistics, sampling | library | dynesty (104К) | numpy, scipy |
| **salib** | statistics, sensitivity | library | salib + future (1.2М) | numpy, scipy, pandas |
| **deap** | statistics, optimization | library | deap (92К) | numpy, dill |
| **scikit-optimize** | statistics, optimization | library | scikit_optimize + pyyaml (220К) | numpy, scipy, scikit-learn, joblib, packaging |
| **pytz** | time | library | pytz (500К) | — |
| **joblib** | parallel, caching | library | joblib (172К) | — |
| **dill** | serialization | library | dill (120К) | — |
| **packaging** | util | library | packaging (100К) | — |
| **setuptools** | util | library | setuptools (932К) | — |
| **six** | compat | library | six (12К) | — |
| **decorator** | util | library | decorator (12К) | — |

Последние 7 — **общие** киты (нужны 2+ другим). Полноценные: с `instruction.md`
(у `pytz`/`joblib`/`dill` — реальный агентский API: таймзоны, параллелизм,
сериализация) и манифестом; привязываются явно как любой другой.

---

## 5. Карта «исходный ассет → Kit» (трассировка всех 48 whl + 3 не-whl)

**Капабилити-whl (26) — каждый свой кит одноимённо:**
numpy, scipy, sympy, biopython, freesasa, pyrodigal, DendroPy, molmass, selfies,
astropy, iminuit, lmfit, pint, scikit_fem, findiff, chaospy, pywavelets,
uncertainties, pandas, scikit_learn, networkx, emcee, dynesty, salib, deap,
scikit_optimize.

**Эксклюзивные deps (15) — вбэндлены в потребителя:**

| whl | → бэндлится в Kit |
|---|---|
| mpmath, gmpy2 | sympy |
| pyerfa, astropy_iers_data | astropy |
| asteval | lmfit |
| flexcache, flexparser, platformdirs, typing_extensions | pint |
| numpoly | chaospy |
| python_dateutil | pandas |
| threadpoolctl | scikit-learn |
| pyparsing | networkx |
| future | salib |
| pyyaml | scikit-optimize |

**Общие deps (7) — собственный кит:**
pytz, joblib, dill, packaging, setuptools, six, decorator.

**Не-whl (3 ассета → 3 кита):**
`RNAfold.wasm` → viennarna · `seqtk.wasm` → seqtk · `RDKit_minimal.wasm`+`.cjs` → rdkit.

Сверка: 26 + 15 + 7 = **48 whl** ✓ + 2 wasi + rdkit.

---

## 6. Default vs Library + размеры

| | Состав | Размер |
|---|---|---|
| Инфраструктура (не кит) | движок Pyodide + WASI-рантайм | ~13.7М |
| **Default** (4 кита) | `numpy` + `scipy` + `sympy`(+mpmath+gmpy2) + `seqtk`(wasi) | ~23.8М → с движком **~37М** |
| **Library** | 26 капабилити + 7 общих, по требованию | **~37М** |

**Было ~74 МБ в npm → default ~37 МБ**, остальное приезжает китами через Library.

**Развилка (зафиксировано):** `scipy` (16М) остаётся в default — реальная
математика из коробки важнее экономии. Это самый тяжёлый default-айтем; если
понадобится резать default, он первый кандидат на демоут в Library.

---

## 7. Словарь `tags` (контролируемый, закрытый — как `DOMAIN_TAG_OPTIONS`)

`math`, `core`, `symbolic`, `biology`, `sequences`, `genomics`,
`phylogenetics`, `rna`, `structure`, `chemistry`, `physics`, `astronomy`,
`units`, `pde`, `signal`, `statistics`, `fitting`, `sampling`, `optimization`,
`uncertainty`, `ml`, `data-science`, `graphs`, `time`, `parallel`, `caching`,
`serialization`, `compat`, `util`.

Мультизначные (1-3 на кит). Расширяется правкой enum в `@found/types`.
Library фильтрует/группирует по `tags`.

---

## 8. Заметки по миграции с текущего состояния

- **`WASM_MANIFEST`** (seqtk, RNAfold, rdkit) → три кита: `seqtk`, `viennarna`,
  `rdkit`. Поля `sha256` / `wasiTools` / `multiplexed` / `stdinAsFile`
  переезжают в `kit.json`.
- **`compute/worker.ts`**: трёхуровневая загрузка (preload `numpy/scipy/sympy` →
  lock-пакеты по импортам → `NON_LOCK_WHEELS` через emfs) заменяется на
  «загрузить артефакты привязанных китов + их транзитивное замыкание». Preload
  `numpy/scipy/sympy` = default-киты.
- **`pyodide-lock.json`** остаётся источником интегрити/версий для whl, что были
  в lock; для эксклюзивно-вбэндленных и не-lock колёс `sha256` берётся в `kit.json`.
- **`ChemBioPolicySection` / `PhysicsPolicySection` / `MathPolicySection`**:
  прозовые списки пакетов заменяются авто-рендером инструкций **явно привязанных**
  китов. Сквозная методология остаётся в скиллах
  (`found-compute-biology/-physics/-chemistry/-math`).
- **Тоггл `math`** (сегодня = 11 тулзов разом) раскладывается: math-киты
  (numpy/scipy/sympy) + тулзы; chem/wasi приходят привязкой своих китов.
