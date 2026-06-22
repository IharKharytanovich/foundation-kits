# Reproducible build of the POT (Python Optimal Transport) pyodide wheel.
#
# Produces: pot-<ver>-cp313-cp313-pyemscripten_2025_0_wasm32.whl
# matching the repo's pyodide 0.28.0 cohort (numpy/scipy/casadi).
#
# POT ships a C++ EMD network-simplex extension (ot/lp/emd_wrap) + a Cython
# extension (ot/partial/partial_cython). OpenMP is auto-disabled: POT's
# ot/helpers/openmp_helpers.check_openmp_support() test-compiles an OpenMP probe
# which fails under emcc (single-threaded), so no -fopenmp flags are emitted.
#
# Usage:
#   docker build -t pot-pyodide-build build/pot
#   docker run --rm -v "$PWD/kit/pot/artifacts:/out" pot-pyodide-build
# The built wheel is copied to /out.

FROM pyodide/pyodide-env:20250728-chrome140-firefox140-py313

ARG POT_VERSION=0.9.6.post1
ARG PYODIDE_VERSION=0.28.0
ARG EMSCRIPTEN_VERSION=4.0.9

# pyodide-build + the 0.28.0 cross-build environment (pins numpy/scipy headers,
# python 3.13.2, ABI 2025_0).
RUN pip install --no-cache-dir pyodide-build==0.35.1 \
 && pyodide xbuildenv install ${PYODIDE_VERSION}

# emscripten 4.0.9 (the version pinned by xbuildenv 0.28.0).
RUN cd /opt && git clone --depth 1 https://github.com/emscripten-core/emsdk.git \
 && cd /opt/emsdk && ./emsdk install ${EMSCRIPTEN_VERSION} \
 && ./emsdk activate ${EMSCRIPTEN_VERSION}

COPY build.sh /build.sh
RUN chmod +x /build.sh
ENV POT_VERSION=${POT_VERSION}
ENTRYPOINT ["/build.sh"]
