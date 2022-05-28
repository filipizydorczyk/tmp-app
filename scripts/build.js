const { name, version } = require("../package.json");
const { spawn } = require("child_process");

const proc = spawn("docker", [
    "build",
    "-f",
    "Dockerfile",
    "-t",
    `${name}:${version}`,
    ".",
]);

proc.stdout.on("data", (data) => {
    console.log(`${data}`);
});

proc.stderr.on("data", (data) => {
    console.log(`${data}`);
});

proc.on("error", (error) => {
    console.log(`${error.message}`);
});

proc.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
});
