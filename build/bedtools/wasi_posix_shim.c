/* wasi_posix_shim.c — no-op definitions of the POSIX functions wasi-libc omits.
 *
 * Provides the symbols declared in wasi_posix_shim.h so the final bedtools.wasm
 * link resolves. All are reachable only from code paths the exposed merge/sort
 * text surface never executes (worker-pool teardown; subprocess gzip filters).
 * Each fails cleanly (NULL / -1, errno=ENOSYS) so an unsupported path errors out
 * instead of mis-behaving. Weak linkage lets any real wasi-libc symbol override.
 */
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <errno.h>

__attribute__((weak)) int pthread_kill(pthread_t thread, int sig) {
	(void)thread;
	(void)sig;
	return 0; /* no real threads single-threaded; nothing to signal */
}

__attribute__((weak)) FILE *popen(const char *command, const char *type) {
	(void)command;
	(void)type;
	errno = ENOSYS;
	return NULL;
}

__attribute__((weak)) int pclose(FILE *stream) {
	(void)stream;
	errno = ENOSYS;
	return -1;
}

/* system() — subprocess execution, unavailable under WASI. Declared by
 * <stdlib.h> (so compiles), but undefined at link. Reached only by the
 * `regresstest` developer subcommand, which the kit does not expose. */
__attribute__((weak)) int system(const char *command) {
	(void)command;
	errno = ENOSYS;
	return -1;
}
