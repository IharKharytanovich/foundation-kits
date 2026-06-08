# deap

DEAP (Distributed Evolutionary Algorithms in Python) is a framework for
rapid prototyping of evolutionary computation: genetic algorithms, genetic
programming, evolution strategies, and multi-objective optimization
(NSGA-II, SPEA2). It provides a toolbox-based architecture where you
register creation, mutation, crossover, and selection operators, then run
them with built-in evolutionary algorithms. The Python import name is
`deap`. It depends on NumPy at runtime. Because evolutionary search is
inherently stochastic, results vary between runs — always set a random seed
for reproducibility.

## Limitations in this kit

moocore is an unconditional upstream dependency but is a native C extension
not available in this Pyodide environment. Hypervolume indicator
computation (`deap.tools.hypervolume`) is unavailable. Use Pareto front
extraction and dominance-based metrics directly instead.

## When to Use

- Genetic algorithm (GA) optimization with custom genomes and operators
- Genetic programming (GP) — evolving symbolic expressions or programs
- Multi-objective optimization with Pareto-based selection (NSGA-II,
  SPEA2, NSGA-III)
- Evolution strategies (CMA-ES via `deap.cma`)
- Custom evolutionary workflows: register your own crossover, mutation,
  and selection operators in the Toolbox
- Neuroevolution, co-evolution, and island-model parallel evolution
  patterns

## When NOT to Use

- Bayesian/surrogate-based black-box optimization (use **scikit-optimize**
  — uses Gaussian processes instead of evolutionary search)
- Deterministic gradient-free optimization (Nelder-Mead, Powell) or
  least-squares fitting (use **scipy** or **lmfit**)
- Bayesian posterior sampling or MCMC (use **emcee** or **dynesty**)
- Machine-learning model training, cross-validation, or hyperparameter
  tuning (use **scikit-learn**)
- Polynomial chaos or sensitivity analysis (use **chaospy** or **salib**)
- Symbolic algebra or calculus (use **sympy**)

## Capabilities

| Area | Key API |
|---|---|
| Toolbox | `deap.base.Toolbox()` — register operators (`register`, `unregister`) |
| Types | `deap.creator.create('FitnessMax', base.Fitness, weights=(1.0,))` |
| Algorithms | `deap.algorithms.eaSimple`, `eaMuPlusLambda`, `eaMuCommaLambda`, `eaGenerateUpdate` |
| Selection | `deap.tools.selTournament`, `selNSGA2`, `selSPEA2`, `selNSGA3`, `selBest`, `selRoulette` |
| Crossover | `deap.tools.cxOnePoint`, `cxTwoPoint`, `cxUniform`, `cxBlend`, `cxSimulatedBinary` |
| Mutation | `deap.tools.mutGaussian`, `mutFlipBit`, `mutPolynomialBounded`, `mutShuffleIndexes` |
| GP | `deap.gp.PrimitiveSet`, `PrimitiveTree`, `genHalfAndHalf`, `cxOnePointLeafBiased` |
| Statistics | `deap.tools.Statistics`, `Logbook`, `HallOfFame` |

## Worked Example

Verify DEAP is available and check its version (the golden test uses a
version smoke because evolutionary search output is stochastic and not
deterministically assertable):

```python
import deap

deap.__revision__
# → "1.4.4"
```

A typical GA workflow registers types, operators, and runs the algorithm:

```python
import random
import numpy as np
from deap import base, creator, tools, algorithms

creator.create("FitnessMax", base.Fitness, weights=(1.0,))
creator.create("Individual", list, fitness=creator.FitnessMax)

toolbox = base.Toolbox()
toolbox.register("attr_bool", random.randint, 0, 1)
toolbox.register("individual", tools.initRepeat, creator.Individual, toolbox.attr_bool, n=100)
toolbox.register("population", tools.initRepeat, list, toolbox.individual)
toolbox.register("evaluate", lambda ind: (sum(ind),))
toolbox.register("mate", tools.cxTwoPoint)
toolbox.register("mutate", tools.mutFlipBit, indpb=0.05)
toolbox.register("select", tools.selTournament, tournsize=3)

random.seed(42)
pop = toolbox.population(n=300)
result, log = algorithms.eaSimple(pop, toolbox, cxpb=0.5, mutpb=0.2, ngen=40, verbose=False)
best = tools.selBest(result, 1)[0]
# best.fitness.values → (100.0,) for OneMax
```

Always set `random.seed(42)` for reproducible evolutionary runs.
