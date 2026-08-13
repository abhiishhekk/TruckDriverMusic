import { useEffect } from "react";

// Wires your player's state into the browser's Media Session API, so
// the OS can show a real "now playing" card (title, artist, artwork)
// on the lock screen / notification shade, and route hardware/earbud
// play-pause-next-prev buttons back into your player.
//
// Call this from MusicPlayer with the same state/handlers it already
// has — it doesn't own any state itself, just mirrors it outward.
//
//   useMediaSession({
//     title: track.title,
//     artist: track.artist,
//     artwork: track.artworkUrl, // optional — see note below
//     isPlaying,
//     onPlay: () => playerRef.current?.playVideo(),
//     onPause: () => playerRef.current?.pauseVideo(),
//     onNext: goNext,
//     onPrev: goPrev,
//   });
export function useMediaSession({
  title,
  artist,
  artwork,
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrev,
}) {
  // Metadata: updates whenever the track changes.
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    navigator.mediaSession.metadata = new window.MediaMetadata({
      title: title || "",
      artist: artist || "",
      // Artwork needs an actual image URL you control (a same-origin
      // or CORS-enabled image) — YouTube thumbnail URLs work fine as
      // a source (https://i.ytimg.com/vi/{videoId}/hqdefault.jpg) even
      // though the audio itself still comes from the iframe.
      artwork: artwork
        ? [
            { src: artwork, sizes: "96x96", type: "image/jpeg" },
            { src: artwork, sizes: "512x512", type: "image/jpeg" },
          ]
        : [],
    });
  }, [title, artist, artwork]);

  // Playback state: keeps the lock-screen play/pause icon in sync.
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
  }, [isPlaying]);

  // Action handlers: hardware buttons, earbud taps, lock-screen taps.
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    const handlers = {
      play: onPlay,
      pause: onPause,
      previoustrack: onPrev,
      nexttrack: onNext,
    };

    for (const [action, handler] of Object.entries(handlers)) {
      try {
        navigator.mediaSession.setActionHandler(action, handler || null);
      } catch {
        // Some browsers don't support every action (e.g. Firefox and
        // "nexttrack" historically) — just skip ones that throw.
      }
    }

    return () => {
      for (const action of Object.keys(handlers)) {
        try {
          navigator.mediaSession.setActionHandler(action, null);
        } catch {
          /* noop */
        }
      }
    };
  }, [onPlay, onPause, onNext, onPrev]);
}
