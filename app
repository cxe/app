#!/usr/bin/env bash

COLOR_BLACK="\033[0;30m"
COLOR_BLACK_BOLD="\033[30;1m"
COLOR_RED="\033[0;31m"
COLOR_RED_BOLD="\033[31;1m"
COLOR_GREEN="\033[0;32m"
COLOR_GREEN_BOLD="\033[32;1m"
COLOR_BROWN="\033[0;33m"
COLOR_BROWN_BOLD="\033[33;1m"
COLOR_BLUE="\033[0;34m"
COLOR_BLUE_BOLD="\033[34;1m"
COLOR_PURPLE="\033[0;35m"
COLOR_PURPLE_BOLD="\033[35;1m"
COLOR_CYAN="\033[0;36m"
COLOR_CYAN_BOLD="\033[36;1m"
COLOR_CYAN="\033[0;37m"
COLOR_CYAN_BOLD="\033[37;1m"
COLOR_RESET="\033[0m"

detect_ci(){
    if [ "$JENKINS_URL" ] || [ "$USER" == jenkins ]; then
        echo "jenkins"
    fi
}

detect_live(){
    if [ "$KUBERNETES_SERVICE_HOST" ]; then
        echo "kubernetes"
    fi
}

check_repo_var() {
    if [ -z "${!1}" ]; then
        echo -e "${COLOR_RED_BOLD}Error:${COLOR_RED} $1 is not defined${COLOR_RESET}"
        exit 1
    fi
}

initialize_dev(){
    export NODE_ENV=development
    export APP_STAGE=local
    if [[ "$PATH" != *"./node_modules/.bin:"* ]]; then
        profile=~/.bash_profile
        if [ ! -f "$profile" ]; then
            profile=~/.bashrc
            if [ ! -f "$profile" ]; then
                profile="<your bash profile file>"
            fi
        fi
        colored green bold "\nplease run:"
        colored cyan "    sudo echo \"export PATH=./node_modules/.bin:\$PATH\" >> \"$profile\"\n"
    fi
}

initialize_test() {
    export NODE_ENV=test
    export APP_STAGE="$( [ "$(detect_ci)" ] && echo ci || echo local )"
}

initialize_prod() {
    export NODE_ENV=production
    export APP_STAGE="$( [ "$(detect_ci)" ] && echo ci || ( [ "$(detect_live)" ] && echo live || echo local ) )"
}



GIT_AVAILABLE="$([ "$(which git)" ] && echo 1 || echo)"
export APP_PATH="$( d="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"; while [ ! -f "$d/package.json" ]; do d="$(dirname $d)"; done; echo $d )"
export APP_REPOSITORY_URL="${APP_REPOSITORY_URL:-"$( [ "$GIT_AVAILABLE" ] && v="$(git config --get remote.origin.url )"; echo "${v::${#v}-4}")"}"
export APP_REPOSITORY_BRANCH="${APP_REPOSITORY_BRANCH:-"$( [ "$GIT_AVAILABLE" ] && git rev-parse --abbrev-ref HEAD)"}"
export APP_REPOSITORY_COMMIT="${APP_REPOSITORY_COMMIT:-"$( [ "$GIT_AVAILABLE" ] && git rev-parse --short HEAD)"}"
export APP_REPOSITORY_USER="${APP_REPOSITORY_USER:-"$( [ "$GIT_AVAILABLE" ] && echo "$( git config user.name ) <$( git config user.email )>" )"}"
export APP_MODE=${APP_MODE:-"$( [ "$NODE_ENV" == production ] && echo prod || ( [ "$NODE_ENV" == test ] && echo test || ( echo dev )))"}
export APP_BRANCH="${APP_BRANCH:-"$( [ "$(which git)" ] && git rev-parse --abbrev-ref HEAD || echo )"}"
export APP_SAFEGUARDS=1

"initialize_${APP_MODE}"

check_repo_var APP_REPOSITORY_URL
check_repo_var APP_REPOSITORY_BRANCH
check_repo_var APP_REPOSITORY_COMMIT
check_repo_var APP_REPOSITORY_USER

echo "started for ${APP_STAGE} ${NODE_ENV} in ${APP_MODE}-mode"


#KUBERNETES_SERVICE_HOST
# grep 'docker\|lxc' /proc/1/cgroup

#app(){
#    local NODE_BINARY=node
#    local output="$($NODE_BINARY -e "require('@cxe/app').main('$*')")"
#    # todo vet returned command for execution or stdout
#}
#app $@
