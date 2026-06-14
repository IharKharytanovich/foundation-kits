/*
 * spglib_cli.c — multi-operation stdin→stdout CLI wrapper for spglib.
 *
 * The subcommand is argv[1] (default: "spacegroup"). Every subcommand reads the
 * SAME crystal-structure description on stdin and prints plain text to stdout.
 *
 * Stdin format (plain text, whitespace-delimited):
 *   Line 1:   a_x a_y a_z        basis vector a (Cartesian, Angstrom)
 *   Line 2:   b_x b_y b_z        basis vector b
 *   Line 3:   c_x c_y c_z        basis vector c
 *   Line 4:   N                  number of atoms
 *   Lines 5..4+N:  fx fy fz      fractional coordinates of each atom
 *   Line 5+N: t1 t2 ... tN       integer atom types (same int = same species)
 *   Line 6+N: symprec            symmetry tolerance (e.g. 1e-5)
 *
 * Lattice convention: basis vectors are read as ROWS (the natural / spglib
 * Python `cell` layout). spglib's C API expects basis vectors as COLUMNS, so the
 * wrapper transposes internally on the way in, and transposes back when it
 * prints a lattice (primitive/standardize) — so input and output use the same
 * row layout.
 *
 * Subcommands:
 *   spacegroup   "<symbol> (<number>)"
 *   dataset      labeled summary: international, number, hall_symbol,
 *                hall_number, pointgroup, n_operations, n_atoms, wyckoffs
 *   symmetry     "n_operations: N" then N lines of "R(9 ints)   t(3 floats)"
 *   primitive    primitive cell: "lattice:" + 3 rows, "atoms: M" + M coord/type
 *   standardize  standardized conventional cell, same layout as primitive
 *
 * Exit codes: 0 = success, 1 = parse/input error, 2 = spglib error.
 *
 * Foundation WASI contract: stdout-only, /tmp wiped, no cwd.
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "spglib.h"

#define MAX_ATOMS 1024

/* Read the crystal structure from stdin. `capacity_mult` over-allocates the
 * position/type buffers (standardize_cell may emit up to 4x the input atoms).
 * Lattice is stored row-wise (lat[i] = basis vector i). Returns 0 on success. */
static int read_structure(double lat[3][3], double (**pos_out)[3], int **typ_out,
                          int *num_atom_out, double *symprec_out, int capacity_mult) {
    for (int i = 0; i < 3; i++) {
        if (scanf("%lf %lf %lf", &lat[i][0], &lat[i][1], &lat[i][2]) != 3) {
            fprintf(stderr, "error: failed to read lattice vector %d\n", i + 1);
            return 1;
        }
    }

    int n;
    if (scanf("%d", &n) != 1 || n < 1 || n > MAX_ATOMS) {
        fprintf(stderr, "error: invalid number of atoms (must be 1..%d)\n", MAX_ATOMS);
        return 1;
    }

    int cap = n * capacity_mult;
    double (*pos)[3] = malloc((size_t)cap * sizeof(double[3]));
    int *typ = malloc((size_t)cap * sizeof(int));
    if (!pos || !typ) {
        fprintf(stderr, "error: allocation failed\n");
        free(pos);
        free(typ);
        return 1;
    }

    for (int i = 0; i < n; i++) {
        if (scanf("%lf %lf %lf", &pos[i][0], &pos[i][1], &pos[i][2]) != 3) {
            fprintf(stderr, "error: failed to read position for atom %d\n", i + 1);
            free(pos);
            free(typ);
            return 1;
        }
    }

    for (int i = 0; i < n; i++) {
        if (scanf("%d", &typ[i]) != 1) {
            fprintf(stderr, "error: failed to read type for atom %d\n", i + 1);
            free(pos);
            free(typ);
            return 1;
        }
    }

    double sp;
    if (scanf("%lf", &sp) != 1 || sp <= 0.0) {
        fprintf(stderr, "error: invalid symprec (must be positive)\n");
        free(pos);
        free(typ);
        return 1;
    }

    *pos_out = pos;
    *typ_out = typ;
    *num_atom_out = n;
    *symprec_out = sp;
    return 0;
}

/* Transpose a 3x3 matrix (row<->column basis-vector convention). */
static void transpose3(const double in[3][3], double out[3][3]) {
    for (int i = 0; i < 3; i++)
        for (int j = 0; j < 3; j++)
            out[i][j] = in[j][i];
}

/* Print a lattice (3 basis vectors as rows) + the atom list. Shared by the
 * primitive and standardize subcommands. `lat_col` is in spglib column form. */
static void print_cell(const double lat_col[3][3], double (*pos)[3], int *typ, int n) {
    double lat_row[3][3];
    transpose3(lat_col, lat_row);
    printf("lattice:\n");
    for (int i = 0; i < 3; i++)
        printf("%.6f %.6f %.6f\n", lat_row[i][0], lat_row[i][1], lat_row[i][2]);
    printf("atoms: %d\n", n);
    for (int i = 0; i < n; i++)
        printf("%.6f %.6f %.6f  %d\n", pos[i][0], pos[i][1], pos[i][2], typ[i]);
}

int main(int argc, char **argv) {
    const char *cmd = (argc > 1) ? argv[1] : "spacegroup";

    int is_std = !strcmp(cmd, "standardize");
    int is_prim = !strcmp(cmd, "primitive");
    int is_dataset_cmd = !strcmp(cmd, "spacegroup") ||
                         !strcmp(cmd, "dataset") ||
                         !strcmp(cmd, "symmetry");

    if (!is_std && !is_prim && !is_dataset_cmd) {
        fprintf(stderr, "error: unknown subcommand '%s' "
                "(use spacegroup|dataset|symmetry|primitive|standardize)\n", cmd);
        return 1;
    }

    double lat_row[3][3];
    double (*pos)[3];
    int *typ;
    int n;
    double symprec;

    /* standardize_cell can grow the atom list up to 4x; everything else keeps
     * or reduces the count. */
    int mult = is_std ? 4 : 1;
    if (read_structure(lat_row, &pos, &typ, &n, &symprec, mult))
        return 1;

    double lat_col[3][3];
    transpose3(lat_row, lat_col);

    if (is_dataset_cmd) {
        SpglibDataset *ds = spg_get_dataset(
            (const double(*)[3])lat_col,
            (const double(*)[3])pos,
            typ, n, symprec);
        free(pos);
        free(typ);
        if (!ds) {
            fprintf(stderr, "error: spg_get_dataset failed (spglib error %d)\n",
                    spg_get_error_code());
            return 2;
        }

        if (!strcmp(cmd, "spacegroup")) {
            printf("%s (%d)\n", ds->international_symbol, ds->spacegroup_number);
        } else if (!strcmp(cmd, "dataset")) {
            printf("international: %s\n", ds->international_symbol);
            printf("number: %d\n", ds->spacegroup_number);
            printf("hall_symbol: %s\n", ds->hall_symbol);
            printf("hall_number: %d\n", ds->hall_number);
            printf("pointgroup: %s\n", ds->pointgroup_symbol);
            printf("n_operations: %d\n", ds->n_operations);
            printf("n_atoms: %d\n", ds->n_atoms);
            printf("wyckoffs:");
            for (int i = 0; i < ds->n_atoms; i++)
                printf(" %c", (char)('a' + ds->wyckoffs[i]));
            printf("\n");
        } else { /* symmetry */
            printf("n_operations: %d\n", ds->n_operations);
            for (int k = 0; k < ds->n_operations; k++) {
                int (*R)[3] = ds->rotations[k];
                double *t = ds->translations[k];
                printf("%2d %2d %2d  %2d %2d %2d  %2d %2d %2d   %.6f %.6f %.6f\n",
                       R[0][0], R[0][1], R[0][2],
                       R[1][0], R[1][1], R[1][2],
                       R[2][0], R[2][1], R[2][2],
                       t[0], t[1], t[2]);
            }
        }

        spg_free_dataset(ds);
        return 0;
    }

    /* primitive / standardize: both mutate lat_col + pos + typ in place. */
    int new_n;
    if (is_prim)
        new_n = spg_find_primitive(lat_col, pos, typ, n, symprec);
    else
        new_n = spg_standardize_cell(lat_col, pos, typ, n,
                                     /*to_primitive=*/0, /*no_idealize=*/0, symprec);

    if (new_n == 0) {
        fprintf(stderr, "error: %s failed (spglib error %d)\n",
                cmd, spg_get_error_code());
        free(pos);
        free(typ);
        return 2;
    }

    print_cell(lat_col, pos, typ, new_n);
    free(pos);
    free(typ);
    return 0;
}
