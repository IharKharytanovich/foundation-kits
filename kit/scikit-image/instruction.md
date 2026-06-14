# scikit-image

scikit-image is an image-processing library built on NumPy arrays. It provides
algorithms for filtering, morphology, segmentation, feature detection, geometric
transforms, colour-space conversion, and measurement — all operating on standard
NumPy ndarrays. It includes bundled test images (`skimage.data`) for quick
experimentation.

## When to Use

- Image filtering (Gaussian blur, median, Sobel/Canny edge detection, unsharp
  masking)
- Image restoration (total-variation / wavelet denoising, Richardson-Lucy
  deconvolution) and quality metrics (SSIM, PSNR)
- Thresholding and segmentation (Otsu, watershed, SLIC superpixels, active
  contours, random walker, Chan-Vese)
- Morphological operations (erosion, dilation, opening, closing, skeletonise,
  remove small objects)
- Feature detection (corner Harris/Shi-Tomasi, blob detection LoG/DoG/DoH,
  ORB descriptors, template matching)
- Geometric transforms (resize, rotate, rescale, warp, affine/projective,
  Hough line/circle detection)
- Colour-space conversion (RGB ↔ HSV ↔ Lab ↔ grayscale)
- Region measurement (label, regionprops — area, perimeter, centroid,
  eccentricity, moments)
- Exposure adjustment (histogram equalisation, contrast stretching, gamma
  correction)

## When NOT to Use

- Reading/writing TIFF files without processing — use **tifffile** (scikit-image
  depends on it internally for TIFF I/O, but tifffile is the specialised tool)
- Pure numerical array math (dot products, FFTs, linear algebra) — use **numpy**
  or **scipy**
- Statistical modelling or regression on tabular data — use **statsmodels** or
  **scikit-learn**
- Graph algorithms on non-image data — use **networkx**
- Deep-learning-based image classification or object detection — out of scope
  (no GPU / neural-network runtime available)

## Capabilities

| Area | Key API |
|---|---|
| Filtering | `skimage.filters.gaussian`, `median`, `sobel`, `threshold_otsu` |
| Segmentation | `skimage.segmentation.watershed`, `slic`, `chan_vese` |
| Morphology | `skimage.morphology.erosion`, `dilation`, `skeletonize`, `remove_small_objects` |
| Feature detection | `skimage.feature.corner_harris`, `blob_log`, `match_template` |
| Transforms | `skimage.transform.resize`, `rotate`, `warp`, `hough_line` |
| Colour | `skimage.color.rgb2gray`, `rgb2hsv`, `label2rgb` |
| Measure | `skimage.measure.label`, `regionprops`, `find_contours` |
| Exposure | `skimage.exposure.equalize_hist`, `adjust_gamma` |
| Restoration | `skimage.restoration.denoise_tv_chambolle`, `denoise_wavelet`, `richardson_lucy` (deconvolution) |
| Metrics | `skimage.metrics.structural_similarity` (SSIM), `peak_signal_noise_ratio` (PSNR) |
| Data | `skimage.data.camera()`, `coins()`, `astronaut()` (bundled test images) |

## Worked Example

Compute the Otsu threshold on the bundled camera image (a classic 512 x 512
grayscale photograph):

```python
from skimage.data import camera
from skimage.filters import threshold_otsu
str(int(threshold_otsu(camera())))
# -> "102"
```
