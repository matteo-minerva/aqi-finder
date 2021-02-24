const path = require("path");
const Dotenv = require("dotenv-webpack");

module.exports = {
    entry: {
        main: path.resolve(__dirname, "./src/js/index.js"),
    },
    output: {
        path: path.resolve(__dirname, "./assets/js"),
        filename: "[name].bundle.js",
    },
    plugins: [new Dotenv()],
    optimization: {
        minimize: false,
    },
    watch: true,
};
