/* eh_stubs.c — minimal C++ Itanium exception-ABI stubs for the WASI target.
 *
 * wasi-sdk's prebuilt libc++abi (clang 18, wasm32-wasi sysroot) is built WITHOUT
 * exception support, so it does not define __cxa_allocate_exception / __cxa_throw.
 * The wasm Exception-Handling proposal (-fwasm-exceptions) needs the same runtime
 * and fails to link identically — wasi-sdk 24 ships no C++ exception runtime.
 *
 * ripser.cpp throws exactly ONE exception — a std::overflow_error guard on line
 * 94 ("simplex index ... out of bounds"), a fatal condition — and has NO catch
 * handler anywhere. An uncaught C++ throw is, by the standard, equivalent to
 * std::terminate() -> abort(). These stubs:
 *   1. make __cxa_allocate_exception / __cxa_throw resolve IN-MODULE, so the
 *      produced .wasm has no undefined host imports and still instantiates under
 *      wasmtime / the Foundation runtime; and
 *   2. turn that single, unreachable-on-valid-input throw into abort() — exactly
 *      the behaviour an uncaught exception would have had.
 *
 * The original link error enumerated ONLY these two undefined symbols, so the
 * sysroot already resolves the personality routine, _Unwind_Resume and the
 * typeinfo objects; only the alloc + throw entry points are missing.
 *
 * Compiled as C (clang, not clang++) so the __cxa_* names keep C linkage and are
 * emitted unmangled, matching the Itanium ABI symbols the C++ codegen calls.
 */
#include <stdlib.h>
#include <stddef.h>

void* __cxa_allocate_exception(size_t size) { return malloc(size); }

void __cxa_free_exception(void* thrown_exception) { free(thrown_exception); }

__attribute__((noreturn)) void __cxa_throw(void* thrown_exception,
                                           void* tinfo,
                                           void* dest) {
	(void)thrown_exception;
	(void)tinfo;
	(void)dest;
	abort();
}
