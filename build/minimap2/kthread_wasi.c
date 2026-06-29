/* kthread_wasi.c — single-threaded, pthread-free replacement for minimap2's
 * kthread.c, for the wasm32-wasi target.
 *
 * Why: upstream kthread.c calls pthread_create / pthread_join / pthread_mutex /
 * pthread_cond UNCONDITIONALLY inside kt_pipeline() — even when n_threads == 1.
 * The map loop (mm_map_file_frag → kt_pipeline) therefore always spins up a
 * worker thread. The wasm32-wasi target is single-threaded (the Foundation
 * runtime contract; SharedArrayBuffer/pthreads are not available), so we replace
 * kthread.c with a synchronous implementation that preserves the exact semantics
 * for a single worker.
 *
 * kt_for():    n_threads<=1 path already exists upstream — we keep only that
 *              (sequential for-loop over [0,n)).
 *
 * kt_pipeline(): with a single worker the pipeline degenerates to a sequential
 *              state machine. A lone worker never blocks on the "another worker
 *              is doing this step" condition (there is no other worker), so each
 *              iteration is exactly:
 *                  w.data = func(shared, w.step, w.step ? w.data : NULL);
 *                  w.step = (w.step == n_steps-1 || w.data)
 *                              ? (w.step + 1) % n_steps : n_steps;
 *              looped while w.step < n_steps. This reproduces upstream
 *              ktp_worker() for n_workers == 1, byte-for-byte in behaviour:
 *              step 0 reads input, step 1 processes, step 2 writes output, and
 *              the ring continues for as long as step 0 keeps returning data.
 *
 * The minimap2 -t flag is forced to 1 by the kit manifest argsTemplate, so the
 * n_threads>1 branch of kt_for is never exercised at runtime regardless.
 */
#include <stdlib.h>
#include <limits.h>
#include <stdint.h>
#include "kthread.h"

/************
 * kt_for() *
 ************/

void kt_for(int n_threads, void (*func)(void*, long, int), void *data, long n)
{
	(void)n_threads; /* single-threaded build: always run sequentially */
	long j;
	for (j = 0; j < n; ++j) func(data, j, 0);
}

/*****************
 * kt_pipeline() *
 *****************/

void kt_pipeline(int n_threads, void *(*func)(void*, int, void*), void *shared_data, int n_steps)
{
	(void)n_threads; /* single worker only */
	int step = 0;
	void *data = 0;

	while (step < n_steps) {
		/* For the first step the input is NULL; later steps carry data. */
		data = func(shared_data, step, step ? data : 0);
		step = (step == n_steps - 1 || data) ? (step + 1) % n_steps : n_steps;
	}
}
