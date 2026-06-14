# particle

particle provides programmatic access to the Particle Data Group (PDG) particle
database. It exposes every known particle's properties (mass, width, charge,
spin, lifetime, PDGID, Monte Carlo identification codes) and translates between
naming schemes (PDG name, LaTeX, HTML, programmatic). The bundled data tables
update with each PDG review cycle. particle depends on hepunits (unit
definitions) and attrs (data classes), both bundled with this kit.

## When to Use

- Looking up particle properties (mass, width, lifetime, charge, spin, isospin)
  by PDG ID, name, or search criteria
- Converting between particle identification schemes (PDGID, Geant3, EvtGen,
  Pythia) for Monte Carlo generators
- Filtering particles by quantum numbers or properties (e.g. all mesons with
  mass > 1 GeV, all charged leptons)
- Displaying particle names in LaTeX or HTML notation for reports
- Programmatic access to the PDG data tables without manual lookups

## When NOT to Use

- Simulating particle interactions or decays (use a Monte Carlo generator or
  dedicated HEP simulation framework)
- Unit conversions between energy, length, and time in HEP (use **pint** for
  general unit handling)
- Fitting experimental data or statistical analysis (use **scipy**, **iminuit**,
  or **lmfit**)
- Symbolic physics calculations (use **sympy**)
- Astronomical/astrophysical calculations (use **astropy**)

## Capabilities

| Area | Key API |
|---|---|
| Lookup by PDGID | `Particle.from_pdgid(211)` |
| Lookup by name | `Particle.from_string('pi+')`, `Particle.findall(name=...)` |
| Search/filter | `Particle.findall(lambda p: p.mass > 1000 and p.charge != 0)` |
| Properties | `.mass`, `.width`, `.charge`, `.spin_type`, `.lifetime`, `.pdgid` |
| Anti-particle | `.anti()`, `.invert()` |
| Name formats | `.name`, `.latex_name`, `.html_name`, `.programmatic_name` |
| ID translation | `.pdgid`, `PDGID(211)`, converters to Geant3/EvtGen/Pythia |
| Literals | `from particle import literals` (e.g. `literals.pi_plus`) |

## Worked Example

Look up the charged pion by its PDG ID and retrieve its name, mass (MeV), and
charge:

```python
from particle import Particle
p = Particle.from_pdgid(211)
str((p.name, round(p.mass, 5), p.charge))
# -> "('pi+', 139.57039, 1.0)"
```
