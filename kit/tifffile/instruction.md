# Tifffile

Tifffile reads and writes TIFF, BigTIFF, OME-TIFF, and related scientific image
file formats as numpy arrays. It supports uncompressed and zlib/deflate-compressed
images across a wide range of data types and dimensions. Tifffile is a pure-Python
library; it depends on numpy for array I/O.

## When to Use

- Reading scientific TIFF images into numpy arrays
- Writing numpy arrays to TIFF files (including BigTIFF for >4 GB images)
- Working with OME-TIFF metadata (channels, z-slices, time points)
- In-memory TIFF round-trips via `io.BytesIO` (no filesystem needed)
- Inspecting TIFF metadata (tags, resolution, photometric interpretation)
- Reading multi-page / multi-series TIFF stacks

## When NOT to Use

- General image display or format conversion (PNG, JPEG) (not available in sandbox)
- TIFF files requiring exotic compression codecs (LZW, JPEG-in-TIFF) without the
  matching codec library (scoped to uncompressed and zlib/deflate)
- Numerical computation beyond I/O (use **numpy** or **scipy**)
- DNA/RNA/protein sequence data (use **biopython**)
- Mass spectrometry data formats (use **pyteomics**)

## Capabilities

| Area | Key API |
|---|---|
| Read TIFF → array | `tifffile.imread('image.tif')` — returns numpy ndarray |
| Write array → TIFF | `tifffile.imwrite('out.tif', array)` |
| In-memory I/O | `tifffile.imwrite(bytesio, array)` / `tifffile.imread(bytesio)` |
| BigTIFF | `tifffile.imwrite('big.tif', array, bigtiff=True)` |
| OME-TIFF | `tifffile.imwrite('ome.tif', array, ome=True, ...)` |
| Metadata | `tifffile.TiffFile('img.tif').pages[0].tags` |
| Multi-page read | `tifffile.imread('stack.tif')` — returns 3-D+ array |

## Worked Example

Round-trip a small numpy array through a TIFF in memory:

```python
import numpy as np, tifffile, io

a = np.arange(6, dtype=np.uint8).reshape(2, 3)
b = io.BytesIO()
tifffile.imwrite(b, a)
b.seek(0)
str(tifffile.imread(b).shape)
# → "(2, 3)"
```

The array is written as an uncompressed grayscale TIFF and read back with the
same shape and dtype. Use `bigtiff=True` for arrays larger than 4 GB, or
`compression='zlib'` for deflate compression.
