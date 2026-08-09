// Run this locally, once, whenever you want to refresh the tracklist:
//
//   YOUTUBE_API_KEY=your_key_here npm run fetch:playlist
//
// It calls the YouTube Data API's playlistItems.list endpoint against
// both playlists below, merges the results, drops duplicate videos
// (a song that appears in both playlists, or twice in one), and
// overwrites src/data/playlist.js with the result.
//
// This is the ONE place that touches the YouTube Data API and its
// 10,000-unit/day quota. Because it runs on your machine at build
// time — not in visitors' browsers — the deployed site makes zero
// Data API calls, so there's no per-visitor limit. Playback in the
// browser goes through the separate, unmetered IFrame Player embed.
//
// Requires Node 18+ (for global fetch) and a YouTube Data API v3 key
// from https://console.cloud.google.com/apis/credentials.

import { writeFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

// Minimal .env loader — no `dotenv` dependency needed for one variable.
// Reads KEY=value lines from a .env file next to package.json, skips
// blank lines and #-comments, and only fills in variables that aren't
// already set in the real environment (so `YOUTUBE_API_KEY=x npm run
// fetch:playlist` still overrides whatever's in .env).
async function loadDotEnv() {
  const envPath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
    ".env"
  );
  let contents;
  try {
    contents = await readFile(envPath, "utf-8");
  } catch {
    return; // no .env file — that's fine, env vars might be set another way
  }
  for (const line of contents.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    // strip matching surrounding quotes, e.g. KEY="abc"
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

await loadDotEnv();

const PLAYLIST_IDS = [
  "PLW6ejC1izsTq2X2mV6fUGfS9dTNmGMKlO",
  "PLJYgDaDVEvWDIfLQZ-omdju5I9lGY1DVG",
];

// Cycled across tracks so the UI keeps getting varied accent colors
// without you having to assign one by hand for every song.
const ACCENT_PALETTE = [
  "#ff8c42",
  "#4fb3a9",
  "#e0576b",
  "#ffd166",
  "#b8391c",
  "#7c9cd4",
];

const API_KEY = process.env.YOUTUBE_API_KEY;
if (!API_KEY) {
  console.error(
    "Missing YOUTUBE_API_KEY.\n" +
      "Either put it in a .env file (copy .env.example to .env and fill it in),\n" +
      "or run: YOUTUBE_API_KEY=your_key npm run fetch:playlist"
  );
  process.exit(1);
}

async function fetchPlaylistItems(playlistId) {
  const items = [];
  let pageToken = "";

  do {
    const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
    url.searchParams.set("part", "snippet");
    url.searchParams.set("playlistId", playlistId);
    url.searchParams.set("maxResults", "50");
    url.searchParams.set("key", API_KEY);
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const res = await fetch(url);
    if (!res.ok) {
      const body = await res.text();
      throw new Error(
        `YouTube API error for playlist ${playlistId}: ${res.status} ${body}`
      );
    }
    const data = await res.json();
    items.push(...data.items);
    pageToken = data.nextPageToken || "";
  } while (pageToken);

  return items;
}

function toTrack(item, accent) {
  const videoId = item.snippet?.resourceId?.videoId;
  if (!videoId) return null;
  // Videos removed from YouTube still show up as playlist entries with
  // a placeholder title — skip those rather than embedding a dead ID.
  if (item.snippet?.title === "Private video" || item.snippet?.title === "Deleted video") {
    return null;
  }
  return {
    id: videoId,
    title: item.snippet.title,
    artist: item.snippet.videoOwnerChannelTitle || item.snippet.channelTitle || "Unknown",
    accent,
    youtubeId: videoId,
  };
}

async function main() {
  const allItems = [];
  for (const playlistId of PLAYLIST_IDS) {
    console.log(`Fetching ${playlistId}...`);
    const items = await fetchPlaylistItems(playlistId);
    console.log(`  ${items.length} items`);
    allItems.push(...items);
  }

  // Dedupe by videoId — a Map naturally keeps only the last (or you
  // could keep the first, see note below) entry per key.
  const byVideoId = new Map();
  allItems.forEach((item) => {
    const videoId = item.snippet?.resourceId?.videoId;
    if (videoId && !byVideoId.has(videoId)) {
      // keep the FIRST occurrence, so playlist order stays stable
      byVideoId.set(videoId, item);
    }
  });

  const tracks = [...byVideoId.values()]
    .map((item, i) => toTrack(item, ACCENT_PALETTE[i % ACCENT_PALETTE.length]))
    .filter(Boolean);

  console.log(`\n${allItems.length} total items -> ${tracks.length} unique, playable tracks`);

  const fileContents = `// AUTO-GENERATED by scripts/fetch-playlist.mjs — do not hand-edit.
// Re-run \`YOUTUBE_API_KEY=your_key npm run fetch:playlist\` to refresh.
export const playlist = ${JSON.stringify(tracks, null, 2)};
`;

  const outPath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
    "src",
    "data",
    "playlist.js"
  );
  await writeFile(outPath, fileContents, "utf-8");
  console.log(`Wrote ${tracks.length} tracks to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
