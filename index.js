class Application {
    static get app(){
        const { config = {}, ...manifest } = Application.require(`${path}/package.json`);
        return new Application();
    }

    static check(target){
        return (p, defaultValue, ...flags) => {
            if (flags.includes('force') || !(p in target && typeof target[p] === typeof defaultValue)) {
                return target[p] = defaultValue;
            }
        }
    }

    static async main(input) {
        await (async()=>{
            const app = Application.app;
            const [cmd = 'start', ...args] = Array.isArray(input) ? input : String(input).split(' '); // todo parse not split
            //GIT_AVAILABLE="$([ "$(which git)" ] && echo 1 || echo)"
            // todo - grep 'docker\|lxc' /proc/1/cgroup

            let result;
            switch (typeof app[cmd]) {
                case 'function':
                    result = app[cmd].constructor.name === 'AsyncFunction'
                        ? await app[cmd](...args)
                        : app[cmd](...args);
                    break;
                case 'undefined':
                    console.error(`Error: "app.${cmd}" is undefined`);
                    break;
                default:
                    result = app[cmd];
            }
            if (typeof result !== 'undefined') console.log(result);
        })();
    }

    static request(...options) {
        const o = Object.assign({}, ...options.filter(objects));
        if (options[0] === 'string')  
        try { return require(module); } catch { return fallback; }
    }

    static require(module, fallback = {}) {
        try { return require(module); } catch { return fallback; }
    }

    static run(...command) {
        if (command.length === 0) return;
        const options = typeof command[command.length - 1] === 'object' ? command.pop() : {}; 
        if (command.length === 0) return;
        const { execSync, exec } = require('child_process');
        const o = {
            async: false,
            stdio: 'pipe',
            verbose: false,
            ...options
        };
        const cmd = command.join(' ');
        let name = String(cmd.match(/^([^\w])*([\w\-]+)/i)[1]).trim();
        const script = this?.scripts[name] || '';
        if (o.verbose) {
            console.info(`\x1b[0;34m${script ? `${name}: ${script}` : `${cmd}`}\x1b[0m`);
        }
        return o.async ? new Promise((resolve, reject) => {
            exec(cmd, (error, stdout, stderr) => {
                if (error) return reject(error);
                resolve(stdout.trim());
            });
        }) : String(execSync(cmd, options)).trim();
    }

    constructor(...options) {
        const o = Object.assign({}, ...options.filter(objects));
        const c = Application.check(o);
        const main = options.main || 'index.js';
        const mode = env.NODE_ENV === 'production' ? 'prod' : env.NODE_ENV === 'test' ? 'test' : 'dev';
        const FORCE = 'force';
        c('author', ''); // todo check for AUTHORS file
        c('bin', {});
        c('bugs', { url: '', email: '' });
        c('bundledDependencies', {});
        c('contributors', []); // todo check for AUTHORS file
        c('cpu', []);
        c('dependencies', {});
        c('description', '');
        c('devDependencies', {});
        c('directories', {});
        c('engines', { node: process.versions.node });
        c('files', ['*']);
        c('funding', []);
        c('homepage', '');
        c('keywords', []);
        c('license', 'UNLICENSED');
        c('main', main);
        c('man', []);
        c('mode', mode);
        c('name', __dirname.split('/').slice(0, -3).pop());
        c('optionalDependencies', {});
        c('os', []);
        c('path', path, FORCE);
        c('peerDependencies', {});
        c('peerDependenciesMeta', {});
        c('pid', process.pid, FORCE);
        c('port', 8080);
        c('private', true);
        c('publishConfig', {});
        c('repository', { url: '', type: 'git' });
        c('request', Application.request, FORCE);
        c('require', Application.require, FORCE);
        c('run', Application.run, FORCE);
        c('scripts', { start: `node ${main}` });
        c('stage', env.APP_STAGE || (env.JENKINS_URL || env?.USER === 'jenkins') ? 'ci' : env.KUBERNETES_SERVICE_HOST ? mode === 'prod' ? 'prod' : 'dev' : 'local', FORCE);
        c('type', 'module');
        c('version', '0.1.0');
        c('workspaces', []);

        this.set(o);
    }

    set(...props){
        Object.assign(this, ...props.filter(objects));
    }

    async start(mode = 'dev') {
        console.log(`started for ${this.stage} ${env.NODE_ENV} in ${mode}-mode`);
    }
}

const { env } = process;
'NODE_ENV' in env || (env.NODE_ENV = 'development');
const path = __dirname.split('/').slice(0, -3).join('/');
const objects = o => typeof o === 'object';

module.exports = Application;
exports.app = true;

if (module === require.main) Application.main(process.argv.slice(2));
