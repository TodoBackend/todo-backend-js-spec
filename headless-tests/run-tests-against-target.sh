#!/bin/bash
set -e -u

die () {
    echo >&2 "$@"
    exit 1
}

[ "$#" -eq 1 ] || die "1 argument required, $# provided"

TARGET=$1

mkdir -p tmp
echo "window.TARGET_API_ROOT = '$1';" > tmp/test-run-config.js
yarn run mocha-puppeteer tmp/test-run-config.js headless.js
