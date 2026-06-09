# ──────────────────────────────────────────────────────────────────────────────
# Dockerfile — WASI cross-compile environment for ViennaRNA → viennarna.wasm
#
# Produces a single multiplexed WASI binary containing all 25 ViennaRNA CLI
# programs, dispatched on argv[1] (seqtk-compatible contract).
#
# Usage:
#   docker build -f build/wasi/Dockerfile -t viennarna-wasi-build .
#   docker run --rm -v $(pwd)/kit/viennarna/artifacts:/out viennarna-wasi-build
# ──────────────────────────────────────────────────────────────────────────────

FROM ubuntu:24.04

# Pin all external tool versions — no floating tags
ARG WASI_SDK_VERSION=25
ARG WASMTIME_VERSION=30.0.2
ARG BINARYEN_VERSION=121

# Install system dependencies
# hadolint ignore=DL3008
RUN apt-get update && apt-get install -y --no-install-recommends \
      curl \
      ca-certificates \
      make \
      tar \
      xz-utils \
      pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 22 (for gen-dispatch.mjs + smoke test JSON parsing)
# hadolint ignore=DL3008,DL4006
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y --no-install-recommends nodejs && \
    rm -rf /var/lib/apt/lists/*

# Install wasi-sdk (pinned to WASI_SDK_VERSION)
RUN mkdir -p /opt/wasi-sdk && \
    curl -fSL "https://github.com/WebAssembly/wasi-sdk/releases/download/wasi-sdk-${WASI_SDK_VERSION}/wasi-sdk-${WASI_SDK_VERSION}.0-x86_64-linux.tar.gz" \
    | tar -xz --strip-components=1 -C /opt/wasi-sdk

# Install wasmtime (for smoke testing built binary against manifest goldens)
RUN curl -fSL "https://github.com/bytecodealliance/wasmtime/releases/download/v${WASMTIME_VERSION}/wasmtime-v${WASMTIME_VERSION}-x86_64-linux.tar.xz" \
    | tar -xJ --strip-components=1 -C /usr/local/bin \
      "wasmtime-v${WASMTIME_VERSION}-x86_64-linux/wasmtime"

# Install binaryen (wasm-opt for -Oz optimization + stripping)
RUN curl -fSL "https://github.com/WebAssembly/binaryen/releases/download/version_${BINARYEN_VERSION}/binaryen-version_${BINARYEN_VERSION}-x86_64-linux.tar.gz" \
    | tar -xz --strip-components=1 -C /usr/local

# Set wasi-sdk environment — CC/CXX/sysroot for the cross-compile
ENV WASI_SDK=/opt/wasi-sdk
ENV CC=/opt/wasi-sdk/bin/clang
ENV CXX=/opt/wasi-sdk/bin/clang++
ENV CFLAGS="--sysroot=/opt/wasi-sdk/share/wasi-sysroot"
ENV CXXFLAGS="--sysroot=/opt/wasi-sdk/share/wasi-sysroot"

# Copy build toolchain
WORKDIR /work
COPY build/wasi/ /work/build/wasi/

# Copy the kit manifest (needed for the smoke test)
COPY kit/viennarna/manifest.json /work/kit/viennarna/manifest.json

# Output directory — mount a volume here to extract viennarna.wasm
ENV OUT_DIR=/out
RUN mkdir -p /out

ENTRYPOINT ["/work/build/wasi/build.sh"]
