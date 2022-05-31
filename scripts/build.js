const { name, version } = require("../package.json");
const { spawn } = require("child_process");

const frontendProc = spawn("docker", [
    "build",
    "-f",
    "Dockerfile.frontend",
    "-t",
    `${name}-frontend:${version}`,
    "-t",
    `${name}-frontend:latest`,
    ".",
]);

const backendProc = spawn("docker", [
    "build",
    "-f",
    "Dockerfile.backend",
    "-t",
    `${name}-backend:${version}`,
    "-t",
    `${name}-backend:latest`,
    ".",
]);

frontendProc.stdout.on("data", (data) => {
    console.log(`[FRONT] ${data}`);
});

frontendProc.stderr.on("data", (data) => {
    console.log(`[FRONT] ${data}`);
});

frontendProc.on("error", (error) => {
    console.log(`[FRONT] ${error.message}`);
});

frontendProc.on("close", (code) => {
    console.log(`[FRONT] child process exited with code ${code}`);
});

backendProc.stdout.on("data", (data) => {
    console.log(`[BACK] ${data}`);
});

backendProc.stderr.on("data", (data) => {
    console.log(`[BACK] ${data}`);
});

backendProc.on("error", (error) => {
    console.log(`[BACK] ${error.message}`);
});

backendProc.on("close", (code) => {
    console.log(`[BACK] child process exited with code ${code}`);
});
