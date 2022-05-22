const path = require("path");
module.exports = {
    webpack: {
        alias: {
            "@tmp/front": path.resolve(__dirname, "frontend/"),
        },
        configure: function (webpackConfig, { paths, env }) {
            paths.appIndexJs = path.resolve(__dirname, "frontend/index.tsx");
            paths.appSrc = path.resolve(__dirname, "frontend");
            webpackConfig.entry = paths.appIndexJs;

            webpackConfig.module.rules.push({
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: require.resolve("babel-loader"),
                        options: {
                            presets: [
                                require("@babel/preset-typescript").default,
                                [
                                    require("@babel/preset-react").default,
                                    { runtime: "automatic" },
                                ],
                                require("@babel/preset-env").default,
                            ],
                        },
                    },
                ],
            });

            return webpackConfig;
        },
    },
};
