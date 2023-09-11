import { execSync, exec } from 'node:child_process';

export const run = (...command) => {
    if (command.length === 0) return;
    const options = typeof command[command.length - 1] === 'object' ? command.pop() : {};
    if (command.length === 0) return;
    const o = {
        async: false,
        stdio: 'pipe',
        verbose: false,
        ...options,
    };
    const cmd = command.join(' ');
    let name = String(cmd.match(/^([^\w])*([\w\-]+)/i)[1]).trim();
    const script = this?.scripts[name] || '';
    if (o.verbose) {
        console.info(`\x1b[0;34m${script ? `${name}: ${script}` : `${cmd}`}\x1b[0m`);
    }
    return o.async
        ? new Promise((resolve, reject) => {
              exec(cmd, (error, stdout, stderr) => {
                  if (error) return reject(error);
                  resolve(stdout.trim());
              });
          })
        : String(execSync(cmd, options)).trim();
};

Object.assign(process, { run });

export default process;
