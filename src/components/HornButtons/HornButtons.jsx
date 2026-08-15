import { useEffect, useRef, useState } from "react";
import { horns } from "../../data/horns.js";
import "./HornButtons.css";

// Three "horn" buttons stacked where the reference mock shows the
// "Horn ok pleaseeee" pill. Each press toggles:
//   - Not playing -> pauses the music, plays the horn from the start,
//     shakes while it plays, and auto-resumes the music when the
//     sound finishes on its own.
//   - Already playing (same button) -> stops the horn immediately and
//     resumes the music right away. The next press starts that horn
//     from the beginning again (currentTime is reset every start).
//
// Sounds themselves live in src/data/horns.js — swap files there, not
// here — this component just plays whatever it's given.
export default function HornButtons({ onHornStart, onHornEnd }) {
  const audioElsRef = useRef({});
  const [activeId, setActiveId] = useState(null);

  // Stop any in-flight horn sound if this component unmounts mid-honk,
  // so it doesn't keep playing after the page it belongs to is gone.
  useEffect(() => {
    return () => {
      Object.values(audioElsRef.current).forEach((audio) => {
        audio.pause();
      });
    };
  }, []);

  function getAudio(horn) {
    let audio = audioElsRef.current[horn.id];
    if (!audio) {
      audio = new Audio(horn.src);
      audio.preload = "auto";
      audioElsRef.current[horn.id] = audio;
    }
    return audio;
  }

  function stopHorn(audio) {
    audio.onended = null;
    audio.onerror = null;
    audio.pause();
    audio.currentTime = 0; // so the *next* press starts from the beginning
    setActiveId(null);
    onHornEnd?.();
  }

  function toggleHorn(horn) {
    const audio = getAudio(horn);

    // Same button pressed again while it's honking -> stop it now.
    if (activeId === horn.id) {
      stopHorn(audio);
      return;
    }

    // A different horn is already honking -> ignore until it's done.
    if (activeId) return;

    setActiveId(horn.id);
    onHornStart?.();

    audio.currentTime = 0;
    audio.onended = () => stopHorn(audio);
    audio.onerror = () => stopHorn(audio);

    audio.play().catch(() => {
      // Sound file missing / blocked by the browser — don't leave the
      // music paused forever, just resume right away.
      stopHorn(audio);
    });
  }

  return (
    <div className="horn-buttons" aria-label="Horns">
      {horns.map((horn) => (
        <button
          key={horn.id}
          type="button"
          className={`horn-buttons__btn ${
            activeId === horn.id ? "is-honking" : ""
          }`}
          onClick={() => toggleHorn(horn)}
          aria-pressed={activeId === horn.id}
          aria-label={`${activeId === horn.id ? "Stop" : "Play"} ${horn.label}`}
        >
          <IconHorn />
          <span className="horn-buttons__text">
            <span className="horn-buttons__title">हॉर्न प्लीज़</span>
            <span className="horn-buttons__subtitle">{horn.label}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

function IconHorn() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M3 10v4a1 1 0 0 0 1 1h2l4.4 3.4a1 1 0 0 0 1.6-.8V6.4a1 1 0 0 0-1.6-.8L6 9H4a1 1 0 0 0-1 1z" />
      <path d="M16.5 8.5a5 5 0 0 1 0 7" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M19 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}