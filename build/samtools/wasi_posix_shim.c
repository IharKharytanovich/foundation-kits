/* wasi_posix_shim.c — no-op definitions of the POSIX functions wasi-libc omits.
 *
 * Provides the symbols declared in wasi_posix_shim.h so the final samtools.wasm
 * link resolves. All are reachable only from samtools subcommands that need real
 * subprocesses / fd duplication / temp files (reheader, sort, …) — never from the
 * view/count/tabix/bgzip/htsfile operations this kit exposes. Each fails cleanly
 * (NULL / -1, errno=ENOSYS) so an unsupported subcommand errors out instead of
 * mis-behaving. Weak linkage lets any real wasi-libc symbol override the stub.
 */
#include <pthread.h>
#include <stdio.h>
#include <errno.h>

__attribute__((weak)) int pthread_kill(pthread_t thread, int sig) {
	(void)thread;
	(void)sig;
	return 0; /* no real threads single-threaded; nothing to signal */
}

__attribute__((weak)) int dup(int fd) {
	(void)fd;
	errno = ENOSYS;
	return -1;
}

__attribute__((weak)) int mkstemp(char *tmpl) {
	(void)tmpl;
	errno = ENOSYS;
	return -1;
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
