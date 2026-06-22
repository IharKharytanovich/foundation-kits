# nmrglue

nmrglue is a Python library for working with Nuclear Magnetic Resonance (NMR)
spectroscopy data. It reads and writes data from Bruker, Varian/Agilent, NMRPipe,
Sparky, and other common NMR formats. nmrglue provides processing functions
(apodization, Fourier transform, phase correction, baseline correction, linear
prediction) and analysis tools (peak picking, integration, lineshape fitting).
All processing operates on NumPy arrays; SciPy is used internally for signal
processing and optimization. Optional plotting backends (matplotlib) are not
available in this kit.

## When to Use

- Reading and converting NMR data between formats (Bruker, Varian/Agilent,
  NMRPipe, Sparky, RNMRTK, Simpson)
- Applying apodization window functions (exponential, Gaussian, sine-bell,
  shifted sine-bell) to FID data
- Computing forward and inverse Fourier transforms of NMR time-domain data
- Phase correction (zero-order and first-order) of frequency-domain spectra
- Baseline correction and solvent suppression on 1D/2D spectra
- Peak picking, integration, and lineshape fitting on processed spectra
- Linear prediction to extend or back-predict FID data points
- Constructing reproducible NMR processing pipelines in code

## When NOT to Use

- General-purpose digital signal processing unrelated to NMR (use **scipy** with
  `scipy.signal` or **pywavelets**)
- Audio or vibration signal analysis (use **scipy**)
- Plotting or visualization of spectra (nmrglue processes data; use a plotting kit
  or matplotlib in the runtime if available)
- Mass spectrometry data (use **pyteomics**)
- Molecular structure determination or docking (use **rdkit** or **ase**)

## Capabilities

| Area | Key API |
|---|---|
| Read/write Bruker | `nmrglue.bruker.read()`, `nmrglue.bruker.write()` |
| Read/write Varian | `nmrglue.varian.read()`, `nmrglue.varian.write()` |
| Read/write NMRPipe | `nmrglue.pipe.read()`, `nmrglue.pipe.write()` |
| Read/write Sparky | `nmrglue.sparky.read()`, `nmrglue.sparky.write()` |
| Format conversion | `nmrglue.convert.converter()` — chain read → convert → write |
| Apodization | `nmrglue.proc_base.em()`, `.gm()`, `.sine()`, `.sp()` |
| Fourier transform | `nmrglue.proc_base.fft()`, `.ifft()`, `.rft()`, `.irft()` |
| Phase correction | `nmrglue.proc_base.ps()` — zero/first order phase |
| Baseline | `nmrglue.proc_bl.baseline_corrector()`, `.cbf()` |
| Zero-fill | `nmrglue.proc_base.zf()`, `.zf_auto()`, `.zf_double()` |
| Peak picking | `nmrglue.peakpick.pick()` |
| Linear prediction | `nmrglue.proc_lp.lp()`, `.lp_svd()` |
| Helpers | `nmrglue.proc_base.di()` (discard imaginaries), `.rev()`, `.ls()` |

## Worked Example

Apply an FFT to a fixed complex array and inspect the real part (rounded to
4 decimal places):

```python
import numpy as np, nmrglue
a = np.array([1+0j, 0.5+0.5j, 0+1j, -0.5+0.5j,
              -1+0j, -0.5-0.5j, 0-1j, 0.5-0.5j])
print(str(np.round(nmrglue.proc_base.fft(a).real, 4).tolist()))
# -> "[0.0, 1.1716, 0.0, 0.0, 0.0, 6.8284, 0.0, 0.0]"
```
