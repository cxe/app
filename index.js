class Application {
    static get app() {
        return new Application();
    }

    path = require.main.path;
}

module.exports = Application;
