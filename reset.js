module.exports = {
  run: [
    // Removes only reinstallable dependencies/build output.
    // app/app/data/ (the SQLite database with your conversations and memories) is never touched here.
    {
      method: "fs.rm",
      params: {
        path: "app/node_modules"
      }
    },
    {
      method: "fs.rm",
      params: {
        path: "app/frontend/node_modules"
      }
    },
    {
      method: "fs.rm",
      params: {
        path: "app/frontend/dist"
      }
    },
    {
      method: "notify",
      params: {
        html: "Dependências removidas. Clique em 'install' para reinstalar. Suas conversas e memórias foram preservadas."
      }
    }
  ]
}
