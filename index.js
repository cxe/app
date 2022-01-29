class Application {
    static get app(){
        return new Application();
    }

    static exec(command, options={}) {
        const verbose = options?.verbose;
        const cmd = Array.isArray(command) ? command.join(' \\\n\t') : command;
        if (verbose) console.info(cmd);
        return String(require('child_process').execSync(cmd, { stdio: 'pipe' }));
    }    

    static main(input) {
        const args = Array.isArray(input) ? input : String(input).split(' '); // todo parse not split
    }

    static require(module, fallback = {}) {
        try { return require(module); } catch { return fallback; }
    }

    constructor() {
        const temp =  __dirname.split('/');
        const path = temp.slice(0, -3).join('/')
        const name = temp.slice(0, -3).pop();
        const main = 'index.js';
        const { config = {}, ...manifest } = Application.require(`${path}/package.json`);
        const props = {
            author: '', // todo check for AUTHORS file
            bin: {},
            bugs: {
                url: '',
                email: ''
            },
            bundledDependencies: {},
            config: {}, 
            contributors: [], // todo check for AUTHORS file
            cpu: [],
            dependencies: {},
            description: '',
            devDependencies: {},
            directories: {},
            engines: {
                node: process.versions.node
            },
            files: ['*'],
            funding: [],
            homepage: '',
            keywords: '',
            license: 'UNLICENSED',
            man: [],
            main,
            name,
            optionalDependencies: {},
            os: [],
            path,
            peerDependencies: {},
            peerDependenciesMeta: {},
            port: 8080,
            private: true,
            publishConfig: {},
            scripts: {
                start: `node ${main}`
            },
            type: 'module',
            repository: {
                url: '',
                type: 'git'
            },
            version: '0.1.0',
            workspaces: []
        };
        this.set(props);
    }

    set(...props){
        Object.assign(this, ...props);
    }
}

module.exports = Application;
exports.app = true;
