class Application {
    static get app() {
        return new Application();
    }

    static main(input) {
        const args = Array.isArray(input) ? input : String(input).split(' '); // todo parse not split
        console.log({envPath: env.APP_PATH, appPath:require.main.path, args });
    }

    path = require.main.path;
}

module.exports = Application;
