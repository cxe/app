import { readFileSync, statSync } from 'node:fs';

export const { env, pid, ppid } = process;
export const app = {};

// ensure mode/NODE_ENV is defined
env.NODE_ENV ||= 'development';
const mode = env.NODE_ENV === 'production' ? 'prod' : env.NODE_ENV === 'test' ? 'test' : 'dev';

// load package.json manifest
const lts = '18.12.0';
const manifestFile = `${env.app_dir}/package.json`;
const date = new Date(statSync(manifestFile).birthtime)
    .toISOString()
    .split('T')
    .join('_')
    .slice(0, -5)
    .replaceAll(':', '-');
const { config = {}, ...manifest } = JSON.parse(readFileSync(manifestFile));
Object.assign(app, manifest, config, { date, mode, pid, ppid, lts });

// env variables starting with "app_" or "APP_" take precedence over manifest values
for (const vname in env) {
    const vname_lowercase = vname.toLowerCase();
    if (vname_lowercase.startsWith('app_')) {
        const path = (vname.toUpperCase() === vname ? vname_lowercase : vname).slice(4).split('_');
        const name = path.pop();
        let ref = app;
        while (path.length) {
            const key = path.shift();
            app[key] ||= {};
            ref = app[key];
        }
        ref[name] = env[vname];
    }
}
