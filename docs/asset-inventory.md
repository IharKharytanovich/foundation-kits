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
| `bin/wasm` | — | `viennarna.wasm` (multiplexed, pending build) + `seqtk.wasm` (448К) + `LICENSE-ViennaRNA` |

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

## 4. Все киты (51) — единая таблица

> У каждого: `instruction.md` (проза) + `kit.json` (метаданные) + `manifest.json`
> (вызываемая поверхность: операции/params + golden).
> «Зависит от» = только **общие** киты (эксклюзивные deps вбэндлены в артефакты).

| Kit | tags | tier | runtime | артефакты | зависит от (общие киты) |
|---|---|---|---|---|---|
| **numpy** | math, core | **default** | pyodide | numpy (2.7М) | — |
| **scipy** | math, core | **default** | pyodide | scipy (16М) | numpy |
| **sympy** | math, symbolic | **default** | pyodide | sympy + mpmath + gmpy2 (4.7М) | — |
| **biopython** | biology, sequences | library | pyodide | biopython (2.6М) | numpy |
| **freesasa** | biology, structure | library | pyodide | freesasa (204К) | — |
| **pyrodigal** | biology, genomics | library | pyodide | pyrodigal (744К) | — |
| **dendropy** | biology, phylogenetics | library | pyodide | DendroPy (456К) | — |
| **viennarna** | biology, rna | library | wasi | viennarna.wasm (multiplexed, 25 tools, 19 ops, `verified:false`) | — |
| **seqtk** | biology, sequences | **default** | wasi | seqtk.wasm (448К) | — |
| **rdkit** | chemistry | library | **jswasm** | RDKit_minimal.cjs + .wasm (6.7М) | — |
| **molmass** | chemistry, biology | library | pyodide | molmass (76К) | — |
| **selfies** | chemistry, biology | library | pyodide | selfies (36К) | — |
| **astropy** | physics, astronomy | library | pyodide | astropy + pyerfa + astropy_iers_data (7.9М) | numpy, packaging, pyyaml |
| **iminuit** | physics, fitting | library | pyodide | iminuit (208К) | numpy |
| **lmfit** | physics, fitting | library | pyodide | lmfit + asteval (120К) | numpy, scipy, uncertainties |
| **pint** | physics, units | library | pyodide | pint + flexcache + flexparser + platformdirs + typing_extensions (412К) | — |
| **scikit-fem** | physics, pde | library | pyodide | scikit_fem (172К) | numpy, scipy |
| **findiff** | physics, math | library | pyodide | findiff (40К) | numpy, scipy |
| **chaospy** | physics, uncertainty | library | pyodide | chaospy + numpoly (400К) | numpy, scipy |
| **pywavelets** | physics, signal | library | pyodide | pywavelets (896К) | numpy |
| **uncertainties** | physics, statistics | library | pyodide | uncertainties (60К) | — |
| **pandas** | data-science, core | library | pyodide | pandas + python-dateutil (4.5М) | numpy, pytz |
| **scikit-learn** | data-science, ml | library | pyodide | scikit_learn + threadpoolctl (5.4М) | numpy, scipy, joblib |
| **networkx** | graphs, biology | library | pyodide | networkx (1.1М) | numpy, decorator, setuptools |
| **emcee** | statistics, sampling | library | pyodide | emcee (48К) | numpy |
| **dynesty** | statistics, sampling | library | pyodide | dynesty (104К) | numpy, scipy |
| **salib** | statistics, uncertainty | library | pyodide | salib (80К) | numpy, scipy, pandas |
| **deap** | statistics, optimization | library | pyodide | deap (92К) | numpy |
| **scikit-optimize** | statistics, optimization | library | pyodide | scikit_optimize + pyaml (220К) | numpy, scipy, scikit-learn, joblib, packaging, pyyaml |
| **pytz** | time | library | pyodide | pytz (500К) | — |
| **joblib** | parallel, caching | library | pyodide | joblib (172К) | — |
| **dill** | serialization | library | pyodide | dill (120К) | — |
| **packaging** | util | library | pyodide | packaging (100К) | — |
| **setuptools** | util | library | pyodide | setuptools (932К) | — |
| **pyyaml** | serialization, util | library | pyodide | pyyaml (112К) | — |
| **six** | compat | library | pyodide | six (12К) | — |
| **decorator** | util | library | pyodide | decorator (12К) | — |
| **gmp** | math | library | **jswasm** | gmp.cjs (~300К) | — |
| **eigen** | math | library | **jswasm** | eigen.cjs (~1М) | — |
| **geos** | math, graphs | library | **jswasm** | geos.mjs (~2.6М) | — |
| **geodesy** | units | library | **jswasm** | index.js + geodesy-wasm.js + geodesy-wasm_bg.wasm | — |
| **rapier2d** | physics | library | **jswasm** | rapier2d.cjs (~1.7М) | — |
| **rapier3d** | physics | library | **jswasm** | rapier3d.cjs (~2.2М) | — |
| **periodictable** | chemistry, physics | library | pyodide | periodictable + pyparsing (172К) | numpy |
| **sgp4** | astronomy, physics | library | pyodide | sgp4 (164К) | — |
| **earcut** | math, structure | library | pyodide | earcut (12К) | numpy |
| **autograd** | math, optimization | library | pyodide | autograd (48К) | numpy |
| **chempy** | chemistry | library | pyodide | chempy + pyparsing (216К) | numpy, scipy, sympy |
| **thermo** | chemistry, physics | library | pyodide | thermo + fluids + chemicals (3.6М) | numpy, scipy, pandas |
| **mendeleev** | chemistry | library | pyodide | mendeleev + sqlalchemy + typing_extensions (3.3М) | numpy, pandas |
| **highs-js** | optimization, math | library | **jswasm** | highs.js + highs.wasm (~3М) | — |

Последние 8 — **общие** киты (нужны 2+ другим): `pytz`, `joblib`, `dill`,
`packaging`, `setuptools`, `pyyaml`, `six`, `decorator`. Полноценные: с
`instruction.md` (у `pytz`/`joblib`/`dill` — реальный агентский API: таймзоны,
параллелизм, сериализация) и манифестом; привязываются явно как любой другой.
`pyyaml` стал общим в этом батче (потребители: `astropy` + `scikit-optimize`).

### Статус сборки (на 2026-06-09)

**Собрано и проверено — 51 кит** (`npm test` + `npm run verify` зелёные):
- _Seed (4):_ numpy, scipy, sympy, seqtk.
- _Batch-1 (18):_ pytz, packaging, joblib, dill, pyyaml, decorator, setuptools
  (7 общих) · biopython, pyrodigal, dendropy, molmass, selfies, viennarna
  (6 bio/chem) · pandas, astropy, scikit-learn, networkx, emcee (5 sci/data).
- _Batch-2 (14):_ uncertainties, six, pint, findiff, pywavelets, iminuit,
  freesasa, scikit-fem, chaospy, dynesty, lmfit, salib, deap, scikit-optimize.
- _Batch-3 (7 pyodide):_ periodictable, sgp4, earcut, autograd, chempy, thermo,
  mendeleev. Turnkey (чистый Python / prebuilt whl); без in-house build.
- _jswasm (8):_ rdkit (нормализован), gmp, eigen, geos (Emscripten); geodesy,
  rapier2d, rapier3d (wasm-bindgen); highs-js (Emscripten, LP/MIP solver).
  Третий runtime-трек `jswasm` (callable WASM с JS-glue загрузчиком) реализован;
  все 8 китов publish-ready.

**viennarna — полная WASI-сборка (in progress):** `viennarna` расширен до
мультиплексированного `viennarna.wasm` (25 инструментов, 19 операций в
манифесте, 6 отложены; ранее — один инструмент). Первый `build/wasi/`
тулчейн (Dockerfile + build.sh + tools.json + gen-dispatch.mjs) создан — см.
[build/wasi/README.md](../build/wasi/README.md). Кит поставляется с
`verified:false`; финальная сборка (wasi-sdk/wasmtime → build → sha256 →
`verified:true` → publish) — ручной шаг мейнтейнера.

**Правка emcee (BR-005):** `emcee` зависит **только от numpy** — `dill` убран из
зависимостей. Wheel METADATA содержит лишь `Requires-Dist: numpy`; `scipy`, `h5py`
и `dill` — опциональные extras, не hard-deps. Поэтому в §4 строка emcee исправлена
с `numpy, dill` на `numpy`.

**Правки batch-2:** `salib` tags исправлены с `statistics, sensitivity` на
`statistics, uncertainty` (`sensitivity` нет в словаре `tags.mjs`). `deap` deps
исправлены с `numpy, dill` на `numpy` (`dill` — не hard-dep по METADATA; `moocore`
— нативный C-ext, недоступен в Pyodide, опущен с документированным ограничением).
`scikit-optimize` deps дополнены `pyyaml` (второй потребитель после `astropy`);
чистый Python-пакет `pyaml` вбэндлен в артефакты `scikit-optimize`.

---

## 5. Карта «исходный ассет → Kit» (трассировка всех 48 whl + 3 не-whl)

**Капабилити-whl (26) — каждый свой кит одноимённо:**
numpy, scipy, sympy, biopython, freesasa, pyrodigal, DendroPy, molmass, selfies,
astropy, iminuit, lmfit, pint, scikit_fem, findiff, chaospy, pywavelets,
uncertainties, pandas, scikit_learn, networkx, emcee, dynesty, salib, deap,
scikit_optimize.

**Эксклюзивные deps (13) — вбэндлены в потребителя:**

| whl | → бэндлится в Kit |
|---|---|
| mpmath, gmpy2 | sympy |
| pyerfa, astropy_iers_data | astropy |
| asteval | lmfit |
| flexcache, flexparser, platformdirs, typing_extensions | pint |
| numpoly | chaospy |
| python_dateutil | pandas |
| threadpoolctl | scikit-learn |
| pyaml | scikit-optimize |
| pyparsing | periodictable |
| pyparsing | chempy |
| fluids, chemicals | thermo |
| sqlalchemy, typing_extensions | mendeleev |

`pyparsing` больше не bundled в `networkx` (3.4.2 убрал зависимость), но
вбэндлен в `periodictable` и `chempy` (batch-3; каждый бэндлит свою копию,
т.к. потребители не пересекаются по единственной зависимости).
`future` больше не bundled: `salib` 1.5.2 убрал эту зависимость.
`pyyaml` повышен из эксклюзивных в **общие** (его делят `astropy` + `scikit-optimize`).

**Общие deps (8) — собственный кит:**
pytz, joblib, dill, packaging, setuptools, pyyaml, six, decorator.

**Не-whl (9 ассетов → 9 китов):**
`viennarna.wasm` → viennarna · `seqtk.wasm` → seqtk · `RDKit_minimal.wasm`+`.cjs` → rdkit ·
`gmp.cjs` → gmp · `eigen.cjs` → eigen · `geos.mjs` → geos ·
`index.js`+`geodesy-wasm.js`+`geodesy-wasm_bg.wasm` → geodesy ·
`rapier2d.cjs` → rapier2d · `rapier3d.cjs` → rapier3d.

Сверка: 26 + 13 + 8 = **47 whl** ✓ (было 48; `networkx` 3.4.2 убрал `pyparsing`)
+ 2 wasi + 7 jswasm.

---

## 6. Default vs Library + размеры

| | Состав | Размер |
|---|---|---|
| Инфраструктура (не кит) | движок Pyodide + WASI-рантайм | ~13.7М |
| **Default** (4 кита) | `numpy` + `scipy` + `sympy`(+mpmath+gmpy2) + `seqtk`(wasi) | ~23.8М → с движком **~37М** |
| **Library** | 26 капабилити + 7 общих + 7 jswasm, по требованию | **~45М** |

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

- **`WASM_MANIFEST`** (seqtk, viennarna, rdkit) → три кита: `seqtk`, `viennarna`,
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
