# ──────────────────────────────────────────────────────────────────────────────
# Dockerfile — WASI cross-compile environment for bedtools → bedtools.wasm
#
# Produces a single self-multiplexing WASI binary (bedtools dispatches on argv[1]),
# built single-threaded with the WASM exception-handling proposal (bedtools is
# exception-heavy C++ — same recipe as kit/z3).
#
# Usage:
#   docker build -f build/bedtools/Dockerfile -t bedtools-wasi-build .
#   docker run --rm -v "$(pwd)/kit/bedtools/artifacts:/out" bedtools-wasi-build
# ──────────────────────────────────────────────────────────────────────────────

FROM ubuntu:24.04

# Pin all external tool versions — no floating tags.
# wasi-sdk >= 33 is required for the C++ WASM exception-handling recipe (matches
# kit/z3); older SDKs (25) lack the `-wasm-use-legacy-eh` LLVM option.
ARG WASI_SDK_VERSION=33
ARG WASMTIME_VERSION=37.0.0
ARG BINARYEN_VERSION=121

# Target architecture — Docker sets TARGETARCH automatically (amd64 | arm64).
ARG TARGETARCH

# System dependencies. python3 + perl: bedtools build helpers. git: not required
# (build.sh pre-writes version_git.h) but harmless.
# hadolint ignore=DL3008
RUN apt-get update && apt-get install -y --no-install-recommends \
      curl \
      ca-certificates \
      make \
      tar \
      gzip \
      xz-utils \
      pkg-config \
      perl \
      python3 \
    && rm -rf /var/lib/apt/lists/*

# Node.js 22 (for JSON parsing in tooling; not strictly needed by build.sh).
# hadolint ignore=DL3008,DL4006
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y --no-install-recommends nodejs && \
    rm -rf /var/lib/apt/lists/*

# wasi-sdk (pinned). wasi-sdk uses arch token x86_64 | arm64.
RUN WASI_ARCH="$(case ${TARGETARCH} in arm64) echo arm64;; *) echo x86_64;; esac)" && \
    mkdir -p /opt/wasi-sdk && \
    curl -fSL "https://github.com/WebAssembly/wasi-sdk/releases/download/wasi-sdk-${WASI_SDK_VERSION}/wasi-sdk-${WASI_SDK_VERSION}.0-${WASI_ARCH}-linux.tar.gz" \
    | tar -xz --strip-components=1 -C /opt/wasi-sdk

# wasmtime (smoke testing; supports `-W exceptions=y`). arch token x86_64 | aarch64.
RUN WT_ARCH="$(case ${TARGETARCH} in arm64) echo aarch64;; *) echo x86_64;; esac)" && \
    curl -fSL "https://github.com/bytecodealliance/wasmtime/releases/download/v${WASMTIME_VERSION}/wasmtime-v${WASMTIME_VERSION}-${WT_ARCH}-linux.tar.xz" \
    | tar -xJ --strip-components=1 -C /usr/local/bin \
      "wasmtime-v${WASMTIME_VERSION}-${WT_ARCH}-linux/wasmtime"

# binaryen (wasm-opt -Oz + strip). arch token x86_64 | aarch64.
RUN BN_ARCH="$(case ${TARGETARCH} in arm64) echo aarch64;; *) echo x86_64;; esac)" && \
    curl -fSL "https://github.com/WebAssembly/binaryen/releases/download/version_${BINARYEN_VERSION}/binaryen-version_${BINARYEN_VERSION}-${BN_ARCH}-linux.tar.gz" \
    | tar -xz --strip-components=1 -C /usr/local

ENV WASI_SDK=/opt/wasi-sdk

WORKDIR /work
COPY build/bedtools/ /work/build/bedtools/

ENV OUT_DIR=/out
RUN mkdir -p /out

ENTRYPOINT ["/work/build/bedtools/build.sh"]
