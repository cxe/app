import { run } from '../util/process.js';

describe('run', () => {
    it('should return output of valid command', () => {
        expect(run('pwd')).toBe(import.meta.url.slice(7, -26));
    });

    it('should fail for invalid commands', () => {
        expect(() => run('foobarbazqux')).toThrow();
    });
});
