/* wasm-stubs.c — link-time stubs for the wasi-sdk z3 cross-compile.
 *
 * z3's src/util/scoped_timer.cpp registers a finalizer with pthread_atfork()
 * so a timer thread is torn down across fork(). WebAssembly/WASI has neither
 * fork() nor pthread_atfork(), and single-threaded wasi-libc does not provide
 * the symbol — so the link fails with "undefined symbol: pthread_atfork".
 *
 * Since WASI can never fork, the registered handlers can never fire; a no-op
 * that returns success (0, "registered") is the semantically correct stub. It
 * is compiled to a single object and added to the final link line by build.sh.
 */

/* extern "C" by virtue of being a .c file — matches <pthread.h>'s declaration. */
int pthread_atfork(void (*prepare)(void), void (*parent)(void), void (*child)(void)) {
    (void)prepare;
    (void)parent;
    (void)child;
    return 0;
}
