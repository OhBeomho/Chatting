const ne = require("webpack-node-externals")

module.exports = {
    target: "node",
    externals: [ ne() ],
    entry: "./app.js"
}