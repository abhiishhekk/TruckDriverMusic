// Horn sound effects for the three horn buttons on the highway scene.
//
// HOW TO ADD YOUR OWN HORN SOUNDS
// --------------------------------
// Drop your audio files into `public/sounds/` using these exact file
// names (mp3 is the safest bet for browser support; wav/ogg also work
// — just update the `src` below to match whichever filename/extension
// you actually use):
//
//   public/sounds/horn-1.mp3
//   public/sounds/horn-2.mp3
//   public/sounds/horn-3.mp3
//
// `src` is a path relative to the site root — Vite serves everything
// inside `public/` from `/`, so `/sounds/horn-1.mp3` resolves to the
// file at `public/sounds/horn-1.mp3`. Nothing else in the app needs to
// change; HornButtons.jsx just reads this list.
//
// Want a 4th horn, or to rename one? Add/edit an entry here — the UI
// renders however many horns are in this array.
export const horns = [
  { id: "horn-1", label: "Horn 1", src: "/sounds/horn-1.mp3" },
  { id: "horn-2", label: "Horn 2", src: "/sounds/horn-2.mp3" },
  { id: "horn-3", label: "Horn 3", src: "/sounds/horn-3.mp3" },
];
