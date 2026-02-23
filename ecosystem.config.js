module.exports = {
  apps: [{
    name: "domlobova",
    script: "npm",
    args: "start",
    cwd: "/home/apps/domlobova",
    interpreter: "none",
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    env: {
      NODE_ENV: "production",
      PORT: 3002,
    },
    env_dev: {
      NODE_ENV: "development",
    }
  }]
};