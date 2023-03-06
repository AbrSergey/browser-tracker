# Browser tracker

Service for tracking the activity of site visitors in the browser. Something remotely reminiscent of Google Analytics. The visitor walks around the site and clicks on the buttons, and the logs of his activity respond to the server.

Stack - `Node.js`, `TypeScript` and `mongodb`.

## How to run

1. Set environment variable for MONGO_DB_URL

   - `export MONGO_DB_URL="mongodb://host:port"`

2. Install dependencies

   - `npm i`

3. Run locally
   - `npm run build; npm run start`
