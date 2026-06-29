/* wasi_posix_shim.h — declare the POSIX functions wasi-sdk omits for wasm32-wasi.
 *
 * bedtools (and its bundled htslib 1.9 + BamTools) reference a handful of POSIX
 * facilities that wasi-libc does not declare for the wasm32-wasi target, which
 * clang rejects as implicit (undeclared) function calls. This header is
 * force-included (-include) into every translation unit so the declarations are
 * always visible; the matching no-op (weak) definitions live in wasi_posix_shim.c
 * and are linked into the final binary.
 *
 *   pthread_kill — bridges pthreads and signals; the emulated <pthread.h> declares
 *                  the thread-pool surface EXCEPT this one. Only invoked on worker-
 *                  pool teardown, which single-threaded bedtools/htslib never does.
 *   popen / pclose — subprocess primitives wasm/WASI has no implementation for.
 *                  Referenced by bedtools' gzip fallback path and htslib's external
 *                  filter hooks; the merge/sort text surface this kit exposes never
 *                  reaches them.
 *
 * The stubs fail cleanly (NULL / -1, errno=ENOSYS), so an unsupported code path
 * degrades gracefully instead of mis-linking. Weak linkage means a real wasi-libc
 * symbol, if ever present, transparently wins over the stub.
 */
#ifndef WASI_POSIX_SHIM_H
#define WASI_POSIX_SHIM_H

#include <pthread.h>
#include <stdio.h>

#ifdef __cplusplus
extern "C" {
#endif

int pthread_kill(pthread_t thread, int sig);

FILE *popen(const char *command, const char *type);
int pclose(FILE *stream);

#ifdef __cplusplus
}
#endif

#endif /* WASI_POSIX_SHIM_H */
