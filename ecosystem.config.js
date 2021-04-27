module.exports = {
  apps: [{
    name: "tts-api",
    script: "index.js",
    instances: "max",
    exec_mode: "cluster"
  }]
}
