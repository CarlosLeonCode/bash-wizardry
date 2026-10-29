#!/usr/bin/env bats
# catalog/commands.es.tsv: Spanish descriptions for the website, one row per
# command in catalog/commands.tsv, in the same order. bwiz stays English-only.

setup() {
    load test_helper
    common_setup
    CATALOG="$REPO/catalog/commands.tsv"
    CATALOG_ES="$REPO/catalog/commands.es.tsv"
    export CATALOG CATALOG_ES
}

@test "Spanish catalog has the expected header and a valid shape" {
    run awk -F '\t' '
        NR == 1 {
            if ($0 != "name\tdescription") print "line 1: bad header: " $0
            next
        }
        NF != 2 { print "line " NR ": " NF " fields, expected 2"; next }
        $1 == "" || $2 == "" { print "line " NR ": empty name or description" }
        index($0, "\"") || index($0, "\\") { print "line " NR ": double quote or backslash" }
        index($2, "Asks first") { print "line " NR ": the confirm flag comes from commands.tsv, drop \"Asks first.\"" }
        seen[$1]++ { print "line " NR ": duplicate name " $1 }
    ' "$CATALOG_ES"
    [ "$status" -eq 0 ]
    [ -z "$output" ] || { echo "$output"; false; }
}

@test "Spanish catalog has exactly the English names, in the same order" {
    awk -F '\t' 'NR > 1 && $0 != "" { print $2 }' "$CATALOG" > "$BATS_TEST_TMPDIR/en"
    awk -F '\t' 'NR > 1 && $0 != "" { print $1 }' "$CATALOG_ES" > "$BATS_TEST_TMPDIR/es"
    run diff "$BATS_TEST_TMPDIR/en" "$BATS_TEST_TMPDIR/es"
    [ "$status" -eq 0 ] || { echo "< commands.tsv, > commands.es.tsv:"; echo "$output"; false; }
}

@test "the generator fails when a Spanish row is missing or unknown" {
    mkdir -p "$BATS_TEST_TMPDIR/repo/catalog" "$BATS_TEST_TMPDIR/repo/tools"
    cp "$REPO/tools/gen-catalog.sh" "$BATS_TEST_TMPDIR/repo/tools/"
    cp "$CATALOG" "$BATS_TEST_TMPDIR/repo/catalog/commands.tsv"
    # Drop the last Spanish row and add one for a command that does not exist.
    sed '$d' "$CATALOG_ES" > "$BATS_TEST_TMPDIR/repo/catalog/commands.es.tsv"
    printf 'no-such-spell\tNo existe.\n' >> "$BATS_TEST_TMPDIR/repo/catalog/commands.es.tsv"

    run bash "$BATS_TEST_TMPDIR/repo/tools/gen-catalog.sh" "$BATS_TEST_TMPDIR/out.ts"
    [ "$status" -ne 0 ]
    [[ "$output" == *"no Spanish description for"* ]]
    [[ "$output" == *"unknown name no-such-spell"* ]]
    [ ! -e "$BATS_TEST_TMPDIR/out.ts" ]
}
