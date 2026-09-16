module.exports = async (kernel) => {
  const availablePort = await kernel.port()
  return {
    daemon: true,
    run: [
      {
        method: "shell.run",
        params: {
          path: "app",
          env: {
            HOST: "127.0.0.1",
            PORT: availablePort
          },
          message: [
            "npm start"
          ],
          on: [{
            event: "/(http:\\/\\/[0-9.:]+)/",
            done: true
          }]
        }
      },
      {
        // This local variable is read by pinokio.js to show the "Open Web UI" tab.
        method: "local.set",
        params: {
          url: "{{input.event[1]}}"
        }
      }
    ]
  }
}
