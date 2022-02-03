#!/usr/bin/env bash

export APP_PATH="$( d="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"; while [ ! -f "$d/package.json" ]; do d="$(dirname $d)"; done; echo $d )"
node "$APP_PATH"
