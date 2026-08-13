// Runs automatically before `npm run dev` (npm's "pre<script>" hook —
// see the "predev" entry in package.json, no extra tooling needed).
//
// Refreshing the tracklist is a nice-to-have on every dev start, not
// something that should ever block you from actually running the app —
// no internet, an expired API key, or YouTube being slow shouldn't stop
// `npm run dev` from working. So failures here are logged as a warning
// and dev starts anyway, with whichever src/data/playlist.js was already
// on disk (either from a previous successful refresh, or the committed
// placeholder).
import { run } from "./fetch-youtube-playlist.mjs";

try {
  await run();
} catch (err) {
  console.warn(
    "\n[predev] Could not refresh the playlist from YouTube — starting dev with the existing src/data/playlist.js instead."
  );
  console.warn(`[predev] ${err.message || err}\n`);
}
