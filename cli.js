const colorCodes = [
    'black',
    'red',
    'green',
    'brown',
    'blue',
    'purple',
    'cyan',
    'gray'
];

export default class CLI
{
    static parse(input) {
        
    }

    write(...args){
        const reset = false;
        const formatted = [];
        for (const arg of args) {
            colorCodes.indexOf('red')
            if (arg && typeof arg === 'object') {
                if (arg.color) {
                    const color = 30 + colorCodes.indexOf(arg.color);
                    if (color > 29) formatted.push(`\\033[${color};${arg.bold ? '1' : '0'}m`);
                    else if ('bold' in arg) formatted.push(`\\033[0;${arg.bold ? '1' : '0'}m`);
                }
                reset = true;
            } else {
                formatted.push(arg);
            }
        }
        if (reset) formatted.push(`\\033[${color};${arg.bold ? '1' : '0'}m`);
        process.stdout.write(formatted.join(''));
    }
}
COLOR_BLACK="\033[0;30m"
COLOR_BLACK_BOLD="\033[30;1m"

module.exports = CLI;
