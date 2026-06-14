/* wasm-fenv-compat.h — force-included shim for the wasi-sdk z3 cross-compile.
 *
 * WebAssembly has no dynamic FPU rounding-mode control: wasm only ever rounds
 * to nearest-even. Accordingly wasi-libc's <fenv.h> (bits/fenv.h) defines only
 * FE_TONEAREST (0) and FE_ALL_EXCEPT (0); it omits FE_UPWARD / FE_DOWNWARD /
 * FE_TOWARDZERO.
 *
 * z3's src/util/hwf.cpp (the *hardware* float path) references those three
 * macros in set_rounding_mode() via SETRM(...) = fesetround(...). On WASI that
 * is a compile error ("use of undeclared identifier 'FE_UPWARD'").
 *
 * This shim provides the missing tokens so hwf.cpp compiles. The values are
 * distinct dummies (mirroring x86 bit patterns for readability); fesetround()
 * on wasi-libc only honours FE_TONEAREST and ignores the rest, which is exactly
 * correct for wasm's round-to-nearest-only semantics. z3 ignores the
 * fesetround return value, so no behaviour changes for the theories this kit
 * exposes (Int / Real / BitVec / arrays / quantifiers / optimization). The
 * hardware-float FPA path is not used by this kit (z3 defaults to the software
 * mpf implementation).
 *
 * Force-included via build.sh:  -include <this file>.
 */
#ifndef Z3_WASM_FENV_COMPAT_H
#define Z3_WASM_FENV_COMPAT_H

#include <fenv.h>

#ifndef FE_UPWARD
#define FE_UPWARD 0x0800
#endif
#ifndef FE_DOWNWARD
#define FE_DOWNWARD 0x0400
#endif
#ifndef FE_TOWARDZERO
#define FE_TOWARDZERO 0x0c00
#endif

#endif /* Z3_WASM_FENV_COMPAT_H */
