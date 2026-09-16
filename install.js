module.exports = {
  run: [
    // Backend dependencies (better-sqlite3 ships a prebuilt binary, no compiler needed)
    {
      method: "shell.run",
      params: {
        path: "app",
        message: [
          "npm install"
        ]
      }
    },
    // Frontend dependencies + production build (the backend serves frontend/dist)
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
        html: "Instalado. Antes de clicar em 'start', confirme que o <b>Codex CLI</b> está instalado e autenticado (o comando <code>codex</code> precisa estar no PATH) — é ele quem responde ao chat e extrai as memórias."
      }
    }
  ]
}
