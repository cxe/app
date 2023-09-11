#!/usr/bin/env bash

[ "$app_bin" ] || {
    export app_dir="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
    export app_mod="$app_dir"
    export app_bin="$app_dir/app"

    if [ -h "$app_bin" ]; then
        if [[ $app_dir = */node_modules/.bin ]]; then
            app_dir="${app_dir:0:-18}"
            app_mod="$app_dir/node_modules/@cxe/app"
        else
            app_dir="$( dirname "$( readlink -f "$app_bin" )" )"
        fi
    fi

    app_eval(){
        node --input-type=module -e "
            import {app} from '$app_mod/util/app.js';
            try { if( typeof app.$1 !== 'undefined' ) console.log(app.$1); } catch { }
        "   
    }

    envvar(){
        [[ "$1" =~ "^[a-zA-Z0-9][a-zA-Z0-9_]$" ]] || return 1
        local vname="app_$1";
        [ "${!vname}" ] && { echo "${!vname}"; return 0; }
        vname="APP_${1^^}";
        [ "${!vname}" ] && { echo "${!vname}"; return 0; }
        vname="${1^^}";
        [ "${!vname}" ] && { echo "${!vname}"; return 0; }
        return 2
    }

    envvar "$1" && return 0

    output="$( app_eval "$@" )"
    [ "$output" ] && { echo "$output"; return 0; }

    output="$( app_eval "scripts.$1" )"
    [ "$output" ] && $output "${@:2}"
}
