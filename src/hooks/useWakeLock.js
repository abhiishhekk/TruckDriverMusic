import { useEffect, useRef } from "react";

// Requests a screen wake lock exactly while `isPlaying` is true, and
// releases it the instant playback pauses — so it only costs battery
// when it's actually doing something useful.
//
// This is a small, honest assist: it stops the phone auto-locking
// from an idle timeout while a song is playing. It does NOT prevent
// someone manually locking their phone or switching apps, and it does
// not, by itself, keep audio playing once the screen does lock — see
// the note in useMediaSession.js about that being a separate, bigger
// limitation.
//
//   useWakeLock(isPlaying);
export function useWakeLock(isPlaying) {
  const wakeLockRef = useRef(null);

  useEffect(() => {
    if (!("wakeLock" in navigator)) return;

    let cancelled = false;

    async function acquire() {
      try {
        wakeLockRef.current = await navigator.wakeLock.request("screen");
      } catch {
        // Common, harmless failure cases: tab not visible, permission
        // denied, or the API just isn't available on this browser.
        wakeLockRef.current = null;
      }
    }

    async function release() {
      try {
        await wakeLockRef.current?.release();
      } catch {
        /* noop */
      }
      wakeLockRef.current = null;
    }

    if (isPlaying) {
      acquire();
    } else {
      release();
    }

    // A wake lock is automatically released by the browser when the
    // tab becomes hidden — re-request it when the tab comes back into
    // view, but only if we're still supposed to be playing.
    function handleVisibilityChange() {
      if (!cancelled && isPlaying && document.visibilityState === "visible") {
        acquire();
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      release();
    };
  }, [isPlaying]);
}
