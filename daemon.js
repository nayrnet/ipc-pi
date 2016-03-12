#!/usr/bin/nodejs
// Starts and Stops the IPC-PI server in the background, creates a pid file for systemd watchdog.

var daemon = require("daemonize2").setup({
	main: "server.js",
	name: "ipc-pi",
	pidfile: "ipc-pi.pid"
});

switch (process.argv[2]) {

    case "start":
        daemon.start();
        break;

    case "stop":
        daemon.stop();
        break;

    default:
        console.log("Usage: [start|stop]");
}
