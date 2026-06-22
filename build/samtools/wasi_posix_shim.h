/* wasi_posix_shim.h — declare the POSIX functions wasi-sdk omits for wasm32-wasi.
 *
 * htslib + samtools reference a handful of POSIX facilities that wasi-libc does
 * not declare for the wasm32-wasi target, which clang 18 rejects as implicit
 * (undeclared) function calls. This header is force-included (-include) into every
 * htslib/samtools translation unit so the declarations are always visible; the
 * matching no-op (weak) definitions live in wasi_posix_shim.c and are linked into
 * the final binary.
 *
 *   pthread_kill — bridges pthreads and signals; the emulated <pthread.h> declares
 *                  the whole thread-pool surface EXCEPT this one. Only invoked on
 *                  worker-pool teardown, which single-threaded samtools never does.
 *   dup / mkstemp / popen / pclose — subprocess, fd-duplication and temp-file
 *                  primitives wasm/WASI has no implementation for. Referenced only
 *                  by subcommands like `reheader` and `sort`; the view/count/tabix/
 *                  bgzip/htsfile surface this kit exposes never calls them.
 *
 * The stubs fail cleanly (NULL / -1, errno=ENOSYS), so an unsupported subcommand
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

int dup(int fd);
int mkstemp(char *tmpl);
FILE *popen(const char *command, const char *type);
int pclose(FILE *stream);

#ifdef __cplusplus
}
#endif

#endif /* WASI_POSIX_SHIM_H */
