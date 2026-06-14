# ──────────────────────────────────────────────────────────────────────────────
# Dockerfile — WASI cross-compile environment for Z3 → z3.wasm
#
# Produces a single-threaded WASI binary of the Z3 SMT solver, built with
# CMake + wasi-sdk ≥ 33 (C++ exceptions enabled).
#
# Usage:
#   docker build -f build/z3/Dockerfile -t z3-wasi-build .
#   docker run --rm -v $(pwd)/kit/z3/artifacts:/out z3-wasi-build
# ──────────────────────────────────────────────────────────────────────────────

FROM ubuntu:24.04

# Pin all external tool versions — no floating tags
ARG WASI_SDK_VERSION=33
ARG WASMTIME_VERSION=37.0.0
ARG BINARYEN_VERSION=121

# Target architecture — Docker sets TARGETARCH automatically (amd64 | arm64).
# All three toolchain binaries are fetched arch-native, so the image runs without
# emulation on both x86_64 CI runners and Apple-Silicon/arm64 hosts. (An x86_64
# wasi-sdk clang under arm64 Rosetta crashes: "failed to open elf ld-linux".)
ARG TARGETARCH

# Install system dependencies (cmake required for z3's CMake build system)
# hadolint ignore=DL3008
RUN apt-get update && apt-get install -y --no-install-recommends \
      curl \
      ca-certificates \
      cmake \
      make \
      tar \
      xz-utils \
      pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 22 (for smoke test JSON parsing)
# hadolint ignore=DL3008,DL4006
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y --no-install-recommends nodejs && \
    rm -rf /var/lib/apt/lists/*

# Install wasi-sdk (pinned to WASI_SDK_VERSION ≥ 33 for C++ exception support).
# wasi-sdk uses arch token x86_64 | arm64.
RUN WASI_ARCH="$(case ${TARGETARCH} in arm64) echo arm64;; *) echo x86_64;; esac)" && \
    mkdir -p /opt/wasi-sdk && \
    curl -fSL "https://github.com/WebAssembly/wasi-sdk/releases/download/wasi-sdk-${WASI_SDK_VERSION}/wasi-sdk-${WASI_SDK_VERSION}.0-${WASI_ARCH}-linux.tar.gz" \
    | tar -xz --strip-components=1 -C /opt/wasi-sdk

# Install wasmtime (≥ 37 for -W exceptions=y support in smoke tests).
# wasmtime uses arch token x86_64 | aarch64.
RUN WT_ARCH="$(case ${TARGETARCH} in arm64) echo aarch64;; *) echo x86_64;; esac)" && \
    curl -fSL "https://github.com/bytecodealliance/wasmtime/releases/download/v${WASMTIME_VERSION}/wasmtime-v${WASMTIME_VERSION}-${WT_ARCH}-linux.tar.xz" \
    | tar -xJ --strip-components=1 -C /usr/local/bin \
      "wasmtime-v${WASMTIME_VERSION}-${WT_ARCH}-linux/wasmtime"

# Install binaryen (wasm-opt for -Oz optimization + stripping).
# binaryen uses arch token x86_64 | aarch64.
RUN BN_ARCH="$(case ${TARGETARCH} in arm64) echo aarch64;; *) echo x86_64;; esac)" && \
    curl -fSL "https://github.com/WebAssembly/binaryen/releases/download/version_${BINARYEN_VERSION}/binaryen-version_${BINARYEN_VERSION}-${BN_ARCH}-linux.tar.gz" \
    | tar -xz --strip-components=1 -C /usr/local

# Set wasi-sdk environment — the CMake toolchain file handles sysroot/CC/CXX
# selection, but WASI_SDK must be set so build.sh can reference it.
ENV WASI_SDK=/opt/wasi-sdk

# Copy build toolchain
WORKDIR /work
COPY build/z3/ /work/build/z3/

# Copy the kit manifest (needed for the smoke test)
COPY kit/z3/manifest.json /work/kit/z3/manifest.json

# Output directory — mount a volume here to extract z3.wasm
ENV OUT_DIR=/out
RUN mkdir -p /out

ENTRYPOINT ["/work/build/z3/build.sh"]
