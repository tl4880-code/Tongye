# Book Library

A simple English book list built with Node.js and Express for the Week 6 routes assignment.

## Run locally

1. Install Node.js if it is not installed.
2. In this folder, run `npm install`.
3. Start the app with `node index.js` or `npm start`.
4. Open http://localhost:3000.

If port 3000 is already in use, run `PORT=3001 node index.js` and open http://localhost:3001.

## Routes

- `GET /` serves the static page in `index.html`.
- `GET /data` returns 12 book objects as JSON.
- `GET /data/:slug` returns one book, for example `/data/piranesi`.
- `GET /data?genre=Fantasy` returns books in the selected genre.

The browser uses `fetch()` to load the JSON, filter the list, and request details for one book. The first line of `.gitignore` is `node_modules`, so dependencies are not uploaded. GitHub Pages cannot run this server-side app; submit this repository link instead.
