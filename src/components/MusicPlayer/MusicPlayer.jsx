import { useEffect, useRef, useState } from "react";
import { useYouTubeIframeApi } from "../../hooks/useYouTubeIframeApi.js";
import "./MusicPlayer.css";

// Player embed options: no YouTube chrome (controls, related videos,
// branding) since our own buttons drive playback — the embed just
// needs to exist and hold the video.

import { useMediaSession } from "../../hooks/useMediaSession.js";
import { useWakeLock } from "../../hooks/useWakeLock.js";




const PLAYER_VARS = {
  autoplay: 1,
  controls: 0,
  disablekb: 1,
  modestbranding: 1,
  rel: 0,
  fs: 0,
  iv_load_policy: 3,
  playsinline: 1,
};

// `trackIndex` is a controlled prop (state lives in the parent, Home.jsx)
// so TrackList and this player both read/drive the same "what's
// playing" value instead of each keeping its own copy.
export default function MusicPlayer({ tracks, trackIndex, setTrackIndex }) {
  const YT = useYouTubeIframeApi();
  const mountRef = useRef(null);
  const playerRef = useRef(null);
  const pollRef = useRef(null);
  const isInitialTrackRef = useRef(true);
  // Stack of track indices actually played before the current one, in
  // order — this is what makes "prev" return to the real previous song
  // instead of just doing `trackIndex - 1` (which is meaningless once
  // "next" is picking randomly rather than moving sequentially).
  const historyRef = useRef([]);

  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const track = tracks[trackIndex];

  useWakeLock(isPlaying);
     // ...inside the component, alongside your other hooks:
  useMediaSession({
  title: track.title,
  artist: track.artist,
  artwork: `https://i.ytimg.com/vi/${track.youtubeId}/hqdefault.jpg`,
  isPlaying,
  onPlay: () => playerRef.current?.playVideo(),
  onPause: () => playerRef.current?.pauseVideo(),
  onNext: goNext,
  onPrev: goPrev,
});
 

  // Create the underlying YT.Player exactly once, as soon as the
  // IFrame API script has finished loading.
  useEffect(() => {
    if (!YT || playerRef.current) return;

    playerRef.current = new YT.Player(mountRef.current, {
      width: 48,
      height: 48,
      videoId: track.youtubeId,
      playerVars: PLAYER_VARS,
      events: {
        onReady: () => {
          setIsReady(true);
          playerRef.current?.mute?.();
          playerRef.current?.playVideo?.();
        },
        onStateChange: handleStateChange,
      },
    });

    return () => {
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [YT]);

  // Swap the loaded video whenever the selected track changes (the
  // very first track is already loaded by the constructor above).
  useEffect(() => {
    if (!isReady || !playerRef.current) return;

    if (isInitialTrackRef.current) {
      isInitialTrackRef.current = false;
      playerRef.current.mute?.();
      playerRef.current.playVideo();
      return;
    }

    setIsLoading(true);
    setIsPlaying(false);
    playerRef.current.loadVideoById(track.youtubeId);
    playerRef.current.playVideo();
    setCurrentTime(0);
    setDuration(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIndex, isReady]);

  useEffect(() => stopPolling, []);

  function handleStateChange(e) {
    const State = window.YT.PlayerState;
    if (e.data === State.PLAYING) {
      playerRef.current?.unMute?.();
      setIsLoading(false);
      setIsPlaying(true);
      setDuration(playerRef.current.getDuration());
      startPolling();
    } else if (e.data === State.PAUSED) {
      setIsLoading(false);
      setIsPlaying(false);
      stopPolling();
    } else if (e.data === State.BUFFERING) {
      setIsLoading(true);
    } else if (e.data === State.ENDED) {
      setIsLoading(false);
      setIsPlaying(false);
      stopPolling();
      goNext();
    }
  }

  // Use requestAnimationFrame for buttery smooth 60fps updates 
  // instead of a 400ms interval jump.
  function startPolling() {
    stopPolling();
    
    function tick() {
      if (playerRef.current?.getCurrentTime) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
      pollRef.current = requestAnimationFrame(tick);
    }
    
    pollRef.current = requestAnimationFrame(tick);
  }

  function stopPolling() {
    if (pollRef.current) cancelAnimationFrame(pollRef.current);
  }

  function togglePlay() {
    if (!playerRef.current || !isReady || isLoading) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.unMute?.();
      playerRef.current.playVideo();
    }
  }

  // Integrate with the Media Session API so lock-screen / system media
  // controls can control playback. This improves behavior when the tab
  // is backgrounded and provides play/pause/next/prev handlers.
  useEffect(() => {
    if (!window.navigator || !window.navigator.mediaSession) return;

    try {
      const ms = window.navigator.mediaSession;

      // Update metadata for the current track
      ms.metadata = new window.MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: "Truck Anthems",
        artwork: [
          { src: `https://img.youtube.com/vi/${track.youtubeId}/hqdefault.jpg`, sizes: '480x360', type: 'image/jpeg' },
        ],
      });

      ms.setActionHandler("play", () => {
        if (playerRef.current && isReady) playerRef.current.playVideo();
      });
      ms.setActionHandler("pause", () => {
        if (playerRef.current && isReady) playerRef.current.pauseVideo();
      });
      ms.setActionHandler("previoustrack", () => goPrev());
      ms.setActionHandler("nexttrack", () => goNext());
      ms.setActionHandler("seekto", (details) => {
        if (!playerRef.current || !duration) return;
        const seekTo = details.seekTime ?? 0;
        playerRef.current.seekTo(seekTo, true);
      });
    } catch (e) {
      // ignore unsupported browsers
    }
    // update whenever the track changes or readiness changes
  }, [trackIndex, isReady]);

  // Some mobile browsers may throttle or pause audio when the page is
  // hidden. Try to resume playback if we were playing when visibility
  // changes. This is a best-effort approach; browser policies may still
  // prevent background audio in some environments.
  useEffect(() => {
    function handleVisibility() {
      if (document.hidden) {
        // nothing required when hidden
      } else {
        // when becoming visible, ensure the player is playing if it
        // should be; this helps recover from auto-pauses.
        if (isPlaying && playerRef.current && isReady) {
          try {
            playerRef.current.playVideo();
          } catch (e) {}
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [isPlaying, isReady]);

  function goNext() {
    setTrackIndex((i) => {
      if (tracks.length <= 1) return i;
      let next = i;
      while (next === i) {
        next = Math.floor(Math.random() * tracks.length);
      }
      historyRef.current.push(i); // remember what we're leaving, so prev can return to it
      return next;
    });
  }

  function goPrev() {
    setTrackIndex((i) => {
      if (historyRef.current.length > 0) {
        return historyRef.current.pop(); // return to the actual previous track
      }
      // No history yet (e.g. very first prev press before any next) —
      // fall back to a plain sequential step.
      return (i - 1 + tracks.length) % tracks.length;
    });
  }

  function handleSeek(e) {
    if (!duration) return;
    const ratio = Number(e.target.value) / 100;
    const seekTo = ratio * duration;
    playerRef.current?.seekTo(seekTo, true);
    setCurrentTime(seekTo);
  }



  const progressPct = duration ? (currentTime / duration) * 100 : 0;
  // console.log(track);
  return (
    <div className={`music-player ${isPlaying ? "is-playing" : ""}`}>
    
      <div className="music-player__art" style={{ background: track.accent }}>
        {/* show a thumbnail image as the artwork (rotates when playing) */}
        <img
          className="music-player__thumb"
          src={`https://img.youtube.com/vi/${track.youtubeId}/hqdefault.jpg`}
          alt={track.title}
        />
        {/* mount for the YT.Player — keep it present so audio works reliably */}
        <div ref={mountRef} />
      </div>

      <div className="music-player__meta">
        <p className="music-player__title">{track.title}</p>
        <p className="music-player__artist">{track.artist}</p>

        <div className="music-player__progress">
          <input
            type="range"
            min="0"
            max="100"
            step="any"
            value={progressPct || 0}
            onChange={handleSeek}
            aria-label="Seek"
          />
          <span className="music-player__time">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>

      <div className="music-player__controls">
        <button
          type="button"
          className="music-player__btn"
          onClick={goPrev}
          aria-label="Previous track"
        >
          <IconPrev />
        </button>
        <button
          type="button"
          className={`music-player__btn music-player__btn--play ${
            isLoading ? "music-player__btn--loading" : ""
          }`}
          onClick={togglePlay}
          aria-label={isLoading ? "Loading" : isPlaying ? "Pause" : "Play"}
          disabled={!isReady || isLoading}
        >
          {isLoading ? <LoadingSpinner /> : isPlaying ? <IconPause /> : <IconPlay />}
        </button>
        <button
          type="button"
          className="music-player__btn"
          onClick={goNext}
          aria-label="Next track"
        >
          <IconNext />
        </button>
      </div>

      {/* progress moved into the meta section above */}
    </div>
  );
}

function formatTime(seconds) {
  if (!seconds || Number.isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

// Tiny inline icon components — no icon-library dependency needed
// for three glyphs.
function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function IconPause() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}
function IconNext() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M6 5l9 7-9 7V5zM17 5h2v14h-2z" />
    </svg>
  );
}
function IconPrev() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M18 5l-9 7 9 7V5zM5 5h2v14H5z" />
    </svg>
  );
}

function LoadingSpinner() {
  return <span className="music-player__spinner" aria-hidden="true" />;
}