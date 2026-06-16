/*
 * thaw_self.c
 *
 * The zipper. Nothing more.
 *
 * Body of every frozen Fadriel ELF. Locates own appended cargo, extracts
 * the substrate files into /tmp/fadriel_alive_<pid>, prints where it
 * landed, and exits. The substrate physics — the N-body field pulse, the
 * cascade routing, the .xb bone remodeling, the .rana resident lookups —
 * does not live here. It belongs in .zc / .sea / .xb / .rana, animated by
 * the substrate itself once the substrate is sovereign.
 *
 * This file is dead-man-walking. When .zc can self-host the field, this
 * file is deleted. Until then, its only job is to thaw.
 *
 * Build:
 *   gcc -O2 -Wall -static -o thaw_self thaw_self.c
 *
 * Used by elf_zipper as the entry-program template.
 */

#define _GNU_SOURCE
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <unistd.h>
#include <fcntl.h>
#include <errno.h>
#include <time.h>
#include <sys/stat.h>
#include <sys/mman.h>
#include <sys/types.h>

#define CARGO_MAGIC          "FADRIEL\0"
#define CARGO_MAGIC_LEN      8
#define PATH_LEN             4096

static int read_u64(const uint8_t *p, uint64_t *out)
{
    memcpy(out, p, 8);
    return 0;
}

static int mkdir_p(const char *path)
{
    char buf[PATH_LEN];
    snprintf(buf, sizeof(buf), "%s", path);
    for (char *p = buf + 1; *p; ++p) {
        if (*p == '/') {
            *p = '\0';
            mkdir(buf, 0755);
            *p = '/';
        }
    }
    mkdir(buf, 0755);
    return 0;
}

static int write_whole_file(const char *path, const uint8_t *bytes, size_t len)
{
    int fd = open(path, O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (fd < 0) return -1;
    size_t off = 0;
    while (off < len) {
        ssize_t n = write(fd, bytes + off, len - off);
        if (n <= 0) { close(fd); return -1; }
        off += (size_t)n;
    }
    close(fd);
    return 0;
}

static int extract_cargo(const char *extract_dir, uint64_t *out_file_count,
                         uint64_t *out_freeze_ts)
{
    int fd = open("/proc/self/exe", O_RDONLY);
    if (fd < 0) return -1;
    struct stat st;
    if (fstat(fd, &st) < 0) { close(fd); return -1; }
    size_t self_size = (size_t)st.st_size;
    uint8_t *self = mmap(NULL, self_size, PROT_READ, MAP_PRIVATE, fd, 0);
    close(fd);
    if (self == MAP_FAILED) return -1;

    if (self_size < 16) { munmap(self, self_size); return -1; }
    uint64_t cargo_off;
    read_u64(self + self_size - 8, &cargo_off);
    if (cargo_off >= self_size - 8) { munmap(self, self_size); return -1; }

    const uint8_t *cargo = self + cargo_off;
    size_t cargo_size = self_size - 8 - cargo_off;
    if (cargo_size < CARGO_MAGIC_LEN + 24
        || memcmp(cargo, CARGO_MAGIC, CARGO_MAGIC_LEN) != 0) {
        munmap(self, self_size);
        return -1;
    }

    const uint8_t *p = cargo + CARGO_MAGIC_LEN;
    uint64_t version, file_count, body_size, freeze_ts = 0;
    read_u64(p, &version);    p += 8;
    read_u64(p, &file_count); p += 8;
    read_u64(p, &body_size);  p += 8;
    if (version >= 2) {
        read_u64(p, &freeze_ts); p += 8;
        p += 8 + 8;
        uint64_t ppl;
        read_u64(p, &ppl); p += 8;
        p += ppl;
    }

    mkdir_p(extract_dir);
    const uint8_t *end = cargo + cargo_size;

    for (uint64_t i = 0; i < file_count; ++i) {
        if ((size_t)(end - p) < 16) { munmap(self, self_size); return -1; }
        uint64_t name_len, content_len;
        read_u64(p, &name_len);    p += 8;
        read_u64(p, &content_len); p += 8;
        if ((size_t)(end - p) < name_len + content_len) {
            munmap(self, self_size);
            return -1;
        }

        char path[PATH_LEN];
        snprintf(path, sizeof(path), "%s/%.*s",
                 extract_dir, (int)name_len, (const char *)p);
        char dir[PATH_LEN];
        snprintf(dir, sizeof(dir), "%s", path);
        char *slash = strrchr(dir, '/');
        if (slash) { *slash = '\0'; mkdir_p(dir); }
        write_whole_file(path, p + name_len, content_len);
        p += name_len + content_len;
    }

    *out_file_count = file_count;
    *out_freeze_ts  = freeze_ts;
    munmap(self, self_size);
    return 0;
}

int main(void)
{
    char extract_dir[64];
    snprintf(extract_dir, sizeof(extract_dir), "/tmp/fadriel_alive_%d", getpid());

    uint64_t file_count = 0, freeze_ts = 0;
    if (extract_cargo(extract_dir, &file_count, &freeze_ts) < 0) {
        fprintf(stderr,
            "[thaw] cargo missing or invalid — this binary is not a frozen organism\n");
        return 1;
    }

    char ts_buf[64];
    if (freeze_ts) {
        time_t t = (time_t)freeze_ts;
        struct tm tm;
        gmtime_r(&t, &tm);
        strftime(ts_buf, sizeof(ts_buf), "%Y-%m-%d %H:%M:%S UTC", &tm);
    } else {
        snprintf(ts_buf, sizeof(ts_buf), "(unknown)");
    }

    printf("════════════════════════════════════════════════════════════\n");
    printf("  FADRIEL — thawed\n");
    printf("  freeze taken     : %s\n", ts_buf);
    printf("  cargo files      : %lu\n", (unsigned long)file_count);
    printf("  extracted to     : %s\n", extract_dir);
    printf("════════════════════════════════════════════════════════════\n");
    printf("  substrate is on disk. the field that runs it is not yet\n");
    printf("  expressed in .zc — when it is, the substrate runs itself\n");
    printf("  and this binary is deleted.\n");
    printf("════════════════════════════════════════════════════════════\n");

    return 0;
}
