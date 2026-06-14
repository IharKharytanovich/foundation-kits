/*
 * edlib_cli.c — single-operation stdin->stdout CLI wrapper for edlib.
 *
 * The task is argv[1] (default: "distance"). Reads a single payload on stdin
 * and prints the result to stdout.
 *
 * Stdin format (three lines):
 *   Line 1: mode       one of NW, HW, SHW (maps to EDLIB_MODE_*)
 *   Line 2: query      query sequence (ASCII, no whitespace)
 *   Line 3: target     target sequence (ASCII, no whitespace)
 *
 * Tasks:
 *   distance   Levenshtein edit distance only.
 *              Output: "<editDistance>\n"
 *   align      Edit distance + extended CIGAR alignment path.
 *              Output: "<editDistance>\t<cigar>\n"
 *
 * Exit codes: 0 = success, 1 = parse/input error, 2 = edlib error.
 *
 * Foundation WASI contract: stdout-only, /tmp wiped, no cwd.
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "edlib.h"

#define MAX_SEQ_LEN (64 * 1024 * 1024)  /* 64 MiB per sequence (wasm32 ceiling) */

/* Read all of stdin into a malloc'd buffer. Returns length (excl. NUL). */
static char *read_all_stdin(size_t *out_len) {
    size_t cap = 4096;
    size_t len = 0;
    char *buf = (char *)malloc(cap);
    if (!buf) return NULL;

    size_t n;
    while ((n = fread(buf + len, 1, cap - len, stdin)) > 0) {
        len += n;
        if (len == cap) {
            cap *= 2;
            char *tmp = (char *)realloc(buf, cap);
            if (!tmp) { free(buf); return NULL; }
            buf = tmp;
        }
    }
    buf[len] = '\0';
    *out_len = len;
    return buf;
}

int main(int argc, char **argv) {
    const char *task = (argc > 1) ? argv[1] : "distance";

    int do_align = 0;
    if (strcmp(task, "distance") == 0) {
        do_align = 0;
    } else if (strcmp(task, "align") == 0) {
        do_align = 1;
    } else {
        fprintf(stderr, "error: unknown task '%s' (use distance|align)\n", task);
        return 1;
    }

    /* Read all of stdin */
    size_t input_len;
    char *input = read_all_stdin(&input_len);
    if (!input) {
        fprintf(stderr, "error: failed to read stdin\n");
        return 1;
    }

    /* Strip single trailing newline if present */
    if (input_len > 0 && input[input_len - 1] == '\n') {
        input[input_len - 1] = '\0';
        input_len--;
    }

    /* Split into exactly three lines: mode, query, target */
    char *line1 = input;
    char *nl1 = strchr(line1, '\n');
    if (!nl1) {
        fprintf(stderr, "error: expected 3 lines on stdin (mode\\nquery\\ntarget)\n");
        free(input);
        return 1;
    }
    *nl1 = '\0';

    char *line2 = nl1 + 1;
    char *nl2 = strchr(line2, '\n');
    if (!nl2) {
        fprintf(stderr, "error: expected 3 lines on stdin (mode\\nquery\\ntarget)\n");
        free(input);
        return 1;
    }
    *nl2 = '\0';

    char *line3 = nl2 + 1;
    /* line3 runs to end of input (no further newline expected after stripping) */

    /* Parse mode */
    EdlibAlignMode mode;
    if (strcmp(line1, "NW") == 0) {
        mode = EDLIB_MODE_NW;
    } else if (strcmp(line1, "HW") == 0) {
        mode = EDLIB_MODE_HW;
    } else if (strcmp(line1, "SHW") == 0) {
        mode = EDLIB_MODE_SHW;
    } else {
        fprintf(stderr, "error: unknown mode '%s' (use NW|HW|SHW)\n", line1);
        free(input);
        return 1;
    }

    const char *query = line2;
    const char *target = line3;
    int qlen = (int)strlen(query);
    int tlen = (int)strlen(target);

    if (qlen == 0 || tlen == 0) {
        fprintf(stderr, "error: query and target must be non-empty\n");
        free(input);
        return 1;
    }
    if (qlen > MAX_SEQ_LEN || tlen > MAX_SEQ_LEN) {
        fprintf(stderr, "error: sequence exceeds %d byte limit\n", MAX_SEQ_LEN);
        free(input);
        return 1;
    }

    /* Configure and run edlib */
    EdlibAlignTask etask = do_align ? EDLIB_TASK_PATH : EDLIB_TASK_DISTANCE;
    EdlibAlignConfig config = edlibNewAlignConfig(-1, mode, etask, NULL, 0);
    EdlibAlignResult result = edlibAlign(query, qlen, target, tlen, config);

    if (result.status != EDLIB_STATUS_OK) {
        fprintf(stderr, "error: edlibAlign failed (status %d)\n", result.status);
        free(input);
        return 2;
    }

    if (do_align) {
        char *cigar = edlibAlignmentToCigar(
            result.alignment, result.alignmentLength, EDLIB_CIGAR_EXTENDED);
        if (!cigar) {
            fprintf(stderr, "error: edlibAlignmentToCigar returned NULL\n");
            edlibFreeAlignResult(result);
            free(input);
            return 2;
        }
        printf("%d\t%s\n", result.editDistance, cigar);
        free(cigar);
    } else {
        printf("%d\n", result.editDistance);
    }

    edlibFreeAlignResult(result);
    free(input);
    return 0;
}
