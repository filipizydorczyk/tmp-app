const path = require("path");
module.exports = {
    webpack: {
        alias: {
            "@tmp/front": path.resolve(__dirname, "src/"),
        },
    },
};
