/**
 * Launcher so the server is always run from the backend directory.
 * Fixes Render deploy when cwd is not backend (e.g. dist/server.js not found).
 */
const path = require("path");
const serverPath = path.join(__dirname, "dist", "server.js");
require(serverPath);
