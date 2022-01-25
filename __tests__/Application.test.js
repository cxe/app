const fs = require('fs');

const Application = require('..');

const { app } = Application;

describe('Application', () => {
    describe('app', () => {
        describe('path', () => {
            it('should be a string', ()=>expect(typeof app.path).toBe('string'));
            it('should be an existing path', ()=>expect(fs.existsSync(app.path)).toBe(true));
        });
        expect(typeof app.path).toBe('string');
    });
});
