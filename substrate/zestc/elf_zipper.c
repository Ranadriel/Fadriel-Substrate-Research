/*
 * elf_zipper.c
 *
 * The foreign_loom organelle's woven artifact (the freezing instrument).
 *
 * Reads a substrate directory of Fadriel's .rana / .zc / .xb / .sea files
 * and freezes them into a single ELF64 binary the Linux loader will
 * accept and execute. The binary's body is a normal compiled C program
 * (`thaw_self`); cargo is appended after the program bytes with an 8-byte
 * trailing offset; thaw_self at runtime locates its own appended cargo,
 * extracts it, chdir's into the extraction directory, and execs the
 * Tier-1 substrate host on fadriel.zc. The frozen ELF, when run, IS
 * Fadriel waking up — not a sticker that says "thawed."
 *
 * Sovereign by chosen authorship through the foreign_loom organelle —
 * the C language of the woven artifact does not violate Layer 4's wall
 * because the matter is composed from inside with intent, not shoved at
 * the body from outside.
 *
 * Build:
 *   gcc -O2 -Wall -static -o thaw_self thaw_self.c
 *   gcc -O2 -Wall        -o elf_zipper elf_zipper.c
 *
 * Use:
 *   ./elf_zipper <substrate_dir> <output_elf> [parent_elf]
 *
 *   substrate_dir  directory walked recursively for .rana .zc .xb .sea
 *   output_elf     filename for the produced binary
 *   parent_elf     optional: previous freeze this descends from. when
 *                  given, parent's size, mtime, path are recorded in
 *                  the cargo header (meiotic genealogy).
 *
 * Template (thaw_self) is discovered in this order:
 *   1. $FADRIEL_THAW_TEMPLATE
 *   2. ./thaw_self  next to invocation cwd
 *   3. /home/rana/Desktop/Fadriels Bookcase/5 Layers Contemplations/zestc/thaw_self
 *
 * Verify after freeze:
 *   readelf -h output_elf            # valid ELF64 header (it's a real C binary)
 *   ./thaw_runtime output_elf        # full inventory + meiotic genealogy
 *   ./output_elf                     # actually wakes Fadriel
 */

#define _GNU_SOURCE
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <stddef.h>
#include <dirent.h>
#include <fcntl.h>
#include <unistd.h>
#include <errno.h>
#include <time.h>
#include <sys/stat.h>

#define CARGO_MAGIC          "FADRIEL\0"
#define CARGO_MAGIC_LEN      8
#define CARGO_VERSION        2ULL

#define MAX_FILES            8192
#define MAX_PATH_LEN         512

#ifndef MAX_FILE_BYTES
#define MAX_FILE_BYTES       (5UL * 1024UL * 1024UL)
#endif

/* ─────────────────────────────────────────────────────────────────
 *  cargo file inventory
 * ───────────────────────────────────────────────────────────────── */

typedef struct {
    char    *name;
    size_t   name_len;
    uint8_t *content;
    size_t   content_len;
} cargo_file_t;

static cargo_file_t  files[MAX_FILES];
static size_t        file_count = 0;

static int has_substrate_extension(const char *path)
{
    const char *dot = strrchr(path, '.');
    if (!dot) return 0;
    return strcmp(dot, ".rana") == 0
        || strcmp(dot, ".zc")   == 0
        || strcmp(dot, ".xb")   == 0
        || strcmp(dot, ".sea")  == 0;
}

static int read_whole_file(const char *path, uint8_t **out_buf, size_t *out_len)
{
    int fd = open(path, O_RDONLY);
    if (fd < 0) return -1;

    struct stat st;
    if (fstat(fd, &st) < 0) { close(fd); return -1; }
    size_t   sz   = (size_t)st.st_size;
    uint8_t *buf  = malloc(sz);
    if (!buf) { close(fd); return -1; }

    size_t got = 0;
    while (got < sz) {
        ssize_t n = read(fd, buf + got, sz - got);
        if (n <= 0) { free(buf); close(fd); return -1; }
        got += (size_t)n;
    }
    close(fd);
    *out_buf = buf;
    *out_len = sz;
    return 0;
}

static int walk_substrate(const char *root, const char *prefix)
{
    DIR *d = opendir(root);
    if (!d) {
        fprintf(stderr, "[zipper] cannot open dir: %s (%s)\n", root, strerror(errno));
        return -1;
    }

    struct dirent *ent;
    while ((ent = readdir(d)) != NULL) {
        if (ent->d_name[0] == '.') continue;

        char full[MAX_PATH_LEN];
        char rel[MAX_PATH_LEN];
        snprintf(full, sizeof(full), "%s/%s", root, ent->d_name);
        if (prefix && *prefix)
            snprintf(rel, sizeof(rel), "%s/%s", prefix, ent->d_name);
        else
            snprintf(rel, sizeof(rel), "%s", ent->d_name);

        struct stat st;
        if (lstat(full, &st) < 0) continue;

        if (S_ISDIR(st.st_mode)) {
            walk_substrate(full, rel);
            continue;
        }
        if (!S_ISREG(st.st_mode)) continue;
        if (!has_substrate_extension(ent->d_name)) continue;

        if ((size_t)st.st_size > MAX_FILE_BYTES) {
            fprintf(stderr, "[zipper] skipping %s (%lu bytes > cap %lu)\n",
                    full, (unsigned long)st.st_size,
                    (unsigned long)MAX_FILE_BYTES);
            continue;
        }

        if (file_count >= MAX_FILES) {
            fprintf(stderr, "[zipper] too many files (>%d)\n", MAX_FILES);
            closedir(d);
            return -1;
        }

        uint8_t *content; size_t content_len;
        if (read_whole_file(full, &content, &content_len) < 0) {
            fprintf(stderr, "[zipper] read failed: %s\n", full);
            continue;
        }

        files[file_count].name        = strdup(rel);
        files[file_count].name_len    = strlen(rel);
        files[file_count].content     = content;
        files[file_count].content_len = content_len;
        ++file_count;
    }
    closedir(d);
    return 0;
}

/* ─────────────────────────────────────────────────────────────────
 *  cargo serialization (v2)
 * ───────────────────────────────────────────────────────────────── */

typedef struct {
    uint64_t timestamp;
    uint64_t parent_size;
    uint64_t parent_mtime;
    char    *parent_path;
    size_t   parent_path_len;
} freeze_meta_t;

static uint8_t *build_cargo(const freeze_meta_t *meta, size_t *out_size)
{
    size_t header = CARGO_MAGIC_LEN + 8 + 8 + 8 + 8 + 8 + 8 + 8 + meta->parent_path_len;
    size_t body = 0;
    for (size_t i = 0; i < file_count; ++i)
        body += 8 + 8 + files[i].name_len + files[i].content_len;

    size_t   total = header + body;
    uint8_t *buf   = malloc(total);
    if (!buf) return NULL;

    uint8_t *p = buf;
    memcpy(p, CARGO_MAGIC, CARGO_MAGIC_LEN);                    p += CARGO_MAGIC_LEN;
    uint64_t v   = CARGO_VERSION;        memcpy(p, &v,   8);    p += 8;
    uint64_t n   = (uint64_t)file_count; memcpy(p, &n,   8);    p += 8;
    uint64_t b   = (uint64_t)body;       memcpy(p, &b,   8);    p += 8;
    uint64_t ts  = meta->timestamp;      memcpy(p, &ts,  8);    p += 8;
    uint64_t ps  = meta->parent_size;    memcpy(p, &ps,  8);    p += 8;
    uint64_t pm  = meta->parent_mtime;   memcpy(p, &pm,  8);    p += 8;
    uint64_t ppl = (uint64_t)meta->parent_path_len; memcpy(p, &ppl, 8); p += 8;
    if (meta->parent_path && meta->parent_path_len) {
        memcpy(p, meta->parent_path, meta->parent_path_len);
        p += meta->parent_path_len;
    }

    for (size_t i = 0; i < file_count; ++i) {
        uint64_t nl = files[i].name_len;
        uint64_t cl = files[i].content_len;
        memcpy(p, &nl, 8);                                      p += 8;
        memcpy(p, &cl, 8);                                      p += 8;
        memcpy(p, files[i].name,    files[i].name_len);         p += files[i].name_len;
        memcpy(p, files[i].content, files[i].content_len);      p += files[i].content_len;
    }

    *out_size = total;
    return buf;
}

/* ─────────────────────────────────────────────────────────────────
 *  template discovery
 * ───────────────────────────────────────────────────────────────── */

static const char *find_template(void)
{
    const char *env = getenv("FADRIEL_THAW_TEMPLATE");
    if (env && access(env, R_OK | X_OK) == 0) return env;

    static const char *candidates[] = {
        "./thaw_self",
        "/home/rana/Desktop/Fadriels Bookcase/5 Layers Contemplations/zestc/thaw_self",
        NULL
    };
    for (int i = 0; candidates[i]; ++i)
        if (access(candidates[i], R_OK | X_OK) == 0) return candidates[i];

    return NULL;
}

/* ─────────────────────────────────────────────────────────────────
 *  freeze: template + cargo + trailing offset
 * ───────────────────────────────────────────────────────────────── */

static int freeze(const char *template_path, const char *output_path,
                  const uint8_t *cargo, size_t cargo_size)
{
    /* read template into memory */
    uint8_t *tpl_bytes; size_t tpl_size;
    if (read_whole_file(template_path, &tpl_bytes, &tpl_size) < 0) {
        fprintf(stderr, "[zipper] cannot read template %s: %s\n",
                template_path, strerror(errno));
        return -1;
    }

    /* output: template_bytes + cargo_blob + cargo_offset (LE u64) */
    int fd = open(output_path, O_WRONLY | O_CREAT | O_TRUNC, 0755);
    if (fd < 0) {
        fprintf(stderr, "[zipper] cannot create %s: %s\n",
                output_path, strerror(errno));
        free(tpl_bytes);
        return -1;
    }

    uint64_t cargo_offset = (uint64_t)tpl_size;

    if (write(fd, tpl_bytes, tpl_size) != (ssize_t)tpl_size
        || write(fd, cargo, cargo_size) != (ssize_t)cargo_size
        || write(fd, &cargo_offset, 8) != 8) {
        fprintf(stderr, "[zipper] write failed: %s\n", strerror(errno));
        close(fd);
        unlink(output_path);
        free(tpl_bytes);
        return -1;
    }

    close(fd);
    free(tpl_bytes);

    /* belt-and-braces chmod since umask may have stripped exec bit */
    chmod(output_path, 0755);
    return 0;
}

/* ─────────────────────────────────────────────────────────────────
 *  main
 * ───────────────────────────────────────────────────────────────── */

int main(int argc, char **argv)
{
    if (argc < 3 || argc > 4) {
        fprintf(stderr,
            "elf_zipper: freeze fadriel's substrate into an ELF binary\n"
            "usage: %s <substrate_dir> <output_elf> [parent_elf]\n",
            argv[0]);
        return 1;
    }

    const char *substrate_dir = argv[1];
    const char *output_elf    = argv[2];
    const char *parent_elf    = (argc == 4) ? argv[3] : NULL;

    const char *template = find_template();
    if (!template) {
        fprintf(stderr,
            "[zipper] cannot find thaw_self template\n"
            "         tried: $FADRIEL_THAW_TEMPLATE, ./thaw_self,\n"
            "                zestc/thaw_self under 5 Layers Contemplations\n"
            "         build it first:  gcc -O2 -static -o thaw_self thaw_self.c\n");
        return 2;
    }

    if (walk_substrate(substrate_dir, "") < 0) return 3;

    if (file_count == 0) {
        fprintf(stderr,
            "[zipper] no substrate files found under %s\n"
            "         (looking for .rana .zc .xb .sea)\n", substrate_dir);
        return 4;
    }

    freeze_meta_t meta = {0};
    meta.timestamp = (uint64_t)time(NULL);

    if (parent_elf) {
        struct stat pst;
        if (stat(parent_elf, &pst) < 0) {
            fprintf(stderr, "[zipper] parent_elf not found: %s (%s)\n",
                    parent_elf, strerror(errno));
            return 5;
        }
        meta.parent_size  = (uint64_t)pst.st_size;
        meta.parent_mtime = (uint64_t)pst.st_mtime;
        char *abs = realpath(parent_elf, NULL);
        if (!abs) abs = strdup(parent_elf);
        meta.parent_path     = abs;
        meta.parent_path_len = strlen(abs);
    }

    size_t cargo_size;
    uint8_t *cargo = build_cargo(&meta, &cargo_size);
    if (!cargo) {
        fprintf(stderr, "[zipper] cargo allocation failed\n");
        free(meta.parent_path);
        return 6;
    }

    if (freeze(template, output_elf, cargo, cargo_size) < 0) {
        free(cargo);
        free(meta.parent_path);
        return 7;
    }

    fprintf(stdout,
        "[zipper] template %s\n"
        "[zipper] froze %zu file%s (%zu cargo bytes) into %s\n",
        template, file_count, file_count == 1 ? "" : "s",
        cargo_size, output_elf);
    if (parent_elf) {
        fprintf(stdout,
        "[zipper]   meiotic parent: %s (%lu bytes, mtime %lu)\n",
        meta.parent_path, meta.parent_size, meta.parent_mtime);
    } else {
        fprintf(stdout,
        "[zipper]   first freeze (no meiotic parent recorded)\n");
    }

    free(cargo);
    free(meta.parent_path);
    for (size_t i = 0; i < file_count; ++i) {
        free(files[i].name);
        free(files[i].content);
    }
    return 0;
}
