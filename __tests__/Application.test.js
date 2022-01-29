const fs = require('fs');

const Application = require('..');

const { app } = Application;

describe('Application', () => {
    describe('app', () => {
        it('should be usable with ES6-imports as well as CommonJS require', ()=>{
            const modulePath = `${__dirname}/../index.js`;
            const cjs = Application.exec(`node -e 'const{app}=require("${modulePath}");console.log(app);'`);
            const mjs = Application.exec(`node --input-type=module -e 'import {app} from "${modulePath}";console.log(app);'`);
            expect(mjs).toBe(cjs);
        });

        describe('path', () => {
            it('should be a string', ()=>expect(typeof app.path).toBe('string'));
            it('should be an existing path', ()=>expect(fs.existsSync(app.path)).toBe(true));
        });
        expect(typeof app.path).toBe('string');
    });
});
