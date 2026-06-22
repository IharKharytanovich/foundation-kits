# ──────────────────────────────────────────────────────────────────────────────
# Dockerfile — WASI cross-compile environment for samtools+htslib → samtools.wasm
#
# Produces a single multiplexed WASI binary containing 4 programs (samtools,
# tabix, bgzip, htsfile), dispatched on argv[1]. Both htslib and samtools are
# co-pinned to 1.21, built single-threaded (no pthreads).
#
# Usage:
#   docker build -f build/samtools/Dockerfile -t samtools-wasi-build .
#   docker run --rm -v $(pwd)/kit/samtools/artifacts:/out samtools-wasi-build
# ──────────────────────────────────────────────────────────────────────────────

FROM ubuntu:24.04

# Pin all external tool versions — no floating tags
ARG WASI_SDK_VERSION=25
ARG WASMTIME_VERSION=37.0.0
ARG BINARYEN_VERSION=121

# Target architecture — Docker sets TARGETARCH automatically (amd64 | arm64).
ARG TARGETARCH

# Install system dependencies
# hadolint ignore=DL3008
RUN apt-get update && apt-get install -y --no-install-recommends \
      curl \
      ca-certificates \
      make \
      tar \
      xz-utils \
      bzip2 \
      pkg-config \
      perl \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 22 (for gen-dispatch.mjs + smoke test JSON parsing)
# hadolint ignore=DL3008,DL4006
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y --no-install-recommends nodejs && \
    rm -rf /var/lib/apt/lists/*

# Install wasi-sdk (pinned). wasi-sdk uses arch token x86_64 | arm64.
RUN WASI_ARCH="$(case ${TARGETARCH} in arm64) echo arm64;; *) echo x86_64;; esac)" && \
    mkdir -p /opt/wasi-sdk && \
    curl -fSL "https://github.com/WebAssembly/wasi-sdk/releases/download/wasi-sdk-${WASI_SDK_VERSION}/wasi-sdk-${WASI_SDK_VERSION}.0-${WASI_ARCH}-linux.tar.gz" \
    | tar -xz --strip-components=1 -C /opt/wasi-sdk

# Install wasmtime (for smoke testing). wasmtime uses arch token x86_64 | aarch64.
RUN WT_ARCH="$(case ${TARGETARCH} in arm64) echo aarch64;; *) echo x86_64;; esac)" && \
    curl -fSL "https://github.com/bytecodealliance/wasmtime/releases/download/v${WASMTIME_VERSION}/wasmtime-v${WASMTIME_VERSION}-${WT_ARCH}-linux.tar.xz" \
    | tar -xJ --strip-components=1 -C /usr/local/bin \
      "wasmtime-v${WASMTIME_VERSION}-${WT_ARCH}-linux/wasmtime"

# Install binaryen (wasm-opt for -Oz optimization + stripping).
# binaryen uses arch token x86_64 | aarch64.
RUN BN_ARCH="$(case ${TARGETARCH} in arm64) echo aarch64;; *) echo x86_64;; esac)" && \
    curl -fSL "https://github.com/WebAssembly/binaryen/releases/download/version_${BINARYEN_VERSION}/binaryen-version_${BINARYEN_VERSION}-${BN_ARCH}-linux.tar.gz" \
    | tar -xz --strip-components=1 -C /usr/local

# Set wasi-sdk environment
ENV WASI_SDK=/opt/wasi-sdk

# Copy build toolchain
WORKDIR /work
COPY build/samtools/ /work/build/samtools/

# Output directory — mount a volume here to extract samtools.wasm
ENV OUT_DIR=/out
RUN mkdir -p /out

ENTRYPOINT ["/work/build/samtools/build.sh"]
