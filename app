#!/usr/bin/env bash

export APP_PATH="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

app(){
    local NODE_BINARY=node
    local output="$($NODE_BINARY -e "require('$APP_PATH').main('$*')")"
    # todo vet returned command for execution or stdout
}

app $@
