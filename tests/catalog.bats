#!/usr/bin/env bats
# catalog/commands.tsv: the single source of truth for every public spell.
# It feeds bwiz/bw-help, AI agents (bwiz help --json) and the website.

setup() {
    load test_helper
    common_setup
    CATALOG="$W/catalog/commands.tsv"
    export CATALOG
}

@test "catalog has the expected header and a valid shape" {
    run awk -F '\t' '
        NR == 1 {
            if ($0 != "module\tname\tkind\tusage\tdescription") print "line 1: bad header: " $0
            next
        }
        NF != 5 { print "line " NR ": " NF " fields, expected 5"; next }
        $1 == "" || $2 == "" || $5 == "" { print "line " NR ": empty module, name or description" }
        $3 != "alias" && $3 != "function" && $3 != "script" { print "line " NR ": bad kind " $3 }
        index($0, "\"") || index($0, "\\") { print "line " NR ": double quote or backslash" }
        $4 != "" && $4 != $2 && index($4, $2 " ") != 1 { print "line " NR ": usage must start with the name: " $4 }
        seen[$2]++ { print "line " NR ": duplicate name " $2 }
    ' "$CATALOG"
    [ "$status" -eq 0 ]
    [ -z "$output" ] || { echo "$output"; false; }
}

@test "catalog matches the aliases and functions a full load defines (both ways)" {
    allow=$(awk -F '\t' 'NR > 1 { printf "%s ", $2 }' "$CATALOG")
    # Snapshot alias/function names before and after a full load; the public
    # ones added by the load must be exactly the catalog's alias/function rows.
    run bash -c '
        snap() { compgen -a | sed "s/^/alias /"; compgen -A function | sed "s/^/function /"; }
        snap | sort > "$BATS_TEST_TMPDIR/before"
        BW_AGENT_MODE=0 BW_ALLOW_OVERRIDE="$1"
        source "$W/init.sh"
        snap | sort > "$BATS_TEST_TMPDIR/after"
        comm -13 "$BATS_TEST_TMPDIR/before" "$BATS_TEST_TMPDIR/after" | grep -v "^[a-z]* _"
    ' _ "$allow"
    [ "$status" -eq 0 ]
    printf '%s\n' "$output" | sort > "$BATS_TEST_TMPDIR/defined"
    awk -F '\t' 'NR > 1 && $3 != "script" { print $3, $2 }' "$CATALOG" | sort > "$BATS_TEST_TMPDIR/cataloged"
    run diff "$BATS_TEST_TMPDIR/cataloged" "$BATS_TEST_TMPDIR/defined"
    [ "$status" -eq 0 ] || { echo "< in catalog only, > defined but not in catalog:"; echo "$output"; false; }
}

@test "every script row is an executable in scripts/" {
    while IFS= read -r name; do
        [ -x "$W/scripts/$name" ] || { echo "not executable: scripts/$name"; false; }
    done < <(awk -F '\t' 'NR > 1 && $3 == "script" { print $2 }' "$CATALOG")
}

@test "functions that call _bw_confirm say 'Asks first.' in the catalog" {
    run bash -c '
        BW_AGENT_MODE=0 BW_ALLOW_OVERRIDE="$(awk -F "\t" "NR > 1 { printf \"%s \", \$2 }" "$CATALOG")"
        source "$W/init.sh"
        while IFS="	" read -r name desc; do
            declare -f "$name" | grep -q _bw_confirm || continue
            case "$desc" in *" Asks first.") ;; *) echo "$name" ;; esac
        done < <(awk -F "\t" "NR > 1 && \$3 == \"function\" { print \$2 \"\t\" \$5 }" "$CATALOG")
    '
    [ "$status" -eq 0 ]
    [ -z "$output" ] || { echo "missing 'Asks first.': $output"; false; }
}

@test "the website lists every catalog module" {
    # The spellbook tab layout (locale-independent) lives in web/src/lib/site.ts.
    while IFS= read -r module; do
        grep -q "module: \"$module\"" "$REPO/web/src/lib/site.ts" \
            || { echo "module '$module' has no tab group in web/src/lib/site.ts"; false; }
    done < <(awk -F '\t' 'NR > 1 { print $1 }' "$CATALOG" | uniq)
}

@test "the generated website catalog is up to date" {
    run bash "$REPO/tools/gen-catalog.sh" "$BATS_TEST_TMPDIR/catalog.generated.ts"
    [ "$status" -eq 0 ]
    run cmp "$REPO/web/src/lib/catalog.generated.ts" "$BATS_TEST_TMPDIR/catalog.generated.ts"
    [ "$status" -eq 0 ] || { echo "Run: bash tools/gen-catalog.sh"; false; }
}
