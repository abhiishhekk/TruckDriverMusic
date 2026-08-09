import { useEffect, useState } from "react";

// Module-scoped (outside the hook) so every component that calls
// useYouTubeIframeApi() shares one script tag and one loading promise,
// instead of each MusicPlayer instance injecting its own <script>.
let apiPromise;

function loadYouTubeApi() {
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve(window.YT);
      return;
    }

    // The YouTube script calls this global when it's finished loading.
    // We chain onto any callback that was already registered rather
    // than clobbering it, in case something else on the page needs it.
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(window.YT);
    };

    const alreadyInjected = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]'
    );
    if (!alreadyInjected) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
  });

  return apiPromise;
}

// Returns `window.YT` once the IFrame Player API has finished loading,
// or `null` while it's still on its way.
export function useYouTubeIframeApi() {
  const [YT, setYT] = useState(
    window.YT && window.YT.Player ? window.YT : null
  );

  useEffect(() => {
    let cancelled = false;
    loadYouTubeApi().then((yt) => {
      if (!cancelled) setYT(yt);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return YT;
}
