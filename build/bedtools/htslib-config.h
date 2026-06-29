/* htslib-config.h — WASI config.h for bedtools' bundled htslib 1.9.
 *
 * bedtools 2.31.1 vendors htslib 1.9 at src/utils/htslib WITHOUT a configure
 * script. htslib's Makefile auto-generates a default config.h that hard-enables
 * bz2 + lzma (HAVE_LIBBZ2 / HAVE_LIBLZMA), pulling in <bzlib.h> / <lzma.h> — neither
 * of which exists in the wasi-sysroot. build.sh copies THIS file to
 * src/utils/htslib/config.h BEFORE the build so the auto-gen rule is skipped and
 * those optional codecs compile out cleanly (CRAM still builds; only its bz2/lzma
 * sub-codecs are #ifdef'd away — bedtools' text BED/GFF/VCF surface never uses them).
 *
 * zlib is the only compression library linked (cross-compiled for WASI by build.sh).
 * Network hfile backends (libcurl/GCS/S3) are likewise left undefined — WASI has no
 * sockets. Only the POSIX feature probes wasi-libc genuinely provides are defined.
 */
#ifndef HTSLIB_WASI_CONFIG_H
#define HTSLIB_WASI_CONFIG_H

/* Compression: zlib only. bz2 + lzma intentionally NOT defined. */
/* #undef HAVE_LIBBZ2 */
/* #undef HAVE_LIBLZMA */

/* Network hfile backends unavailable under WASI (no sockets). */
/* #undef HAVE_LIBCURL */
/* #undef HAVE_GCS */
/* #undef HAVE_S3 */

/* POSIX facilities wasi-libc DOES provide. */
#define HAVE_DRAND48 1
#define HAVE_GMTIME_R 1

/* Threads: htslib references the pthread API; build.sh links the
 * wasi-emulated-pthread stubs. htslib runs single-threaded (no thread pool
 * created) so the stubs are compiled-but-unused. */

#endif /* HTSLIB_WASI_CONFIG_H */
