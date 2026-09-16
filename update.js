module.exports = {
  run: [
    {
      method: "shell.run",
      params: {
        message: "git pull"
      }
    },
    {
      method: "shell.run",
      params: {
        path: "app",
        message: "npm install"
      }
    },
    {
      method: "shell.run",
      params: {
        path: "app/frontend",
        message: [
          "npm install",
          "npm run build"
        ]
      }
    },
    {
      method: "notify",
      params: {
        html: "AI Harness atualizado. Suas conversas e memórias em app/app/data/ não foram tocadas."
      }
    }
  ]
}
