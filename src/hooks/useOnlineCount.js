import { useEffect, useState } from "react";
import {
  ref,
  onValue,
  onDisconnect,
  set,
  serverTimestamp,
  push,
} from "firebase/database";
import { db } from "../firebase.js";

// Tracks "how many browser tabs are on the site right now" using Firebase
// Realtime Database's connection state (`.info/connected`).
//
// How it works:
// - Each tab gets its own child under /presence, keyed by a random push id.
// - The moment a tab's socket connects, it writes `true` to its own key,
//   and registers an onDisconnect() write that removes that key the instant
//   the socket drops (tab closed, refreshed, phone locked, wifi died — all
//   of it, no polling, no heartbeat needed).
// - Every client listens to the whole /presence list and just counts keys.
//
// This needs zero backend code — it's a client-only pattern that Realtime
// Database is specifically built for.
export function useOnlineCount() {
  const [count, setCount] = useState(1); // assume "just me" until first snapshot arrives

  useEffect(() => {
    if (!db) return; // .env not filled in yet — stay at the default of 1

    const presenceListRef = ref(db, "presence");
    const myPresenceRef = push(presenceListRef); // unique ref for this tab

    const connectedRef = ref(db, ".info/connected");
    const unsubConnected = onValue(connectedRef, (snap) => {
      if (snap.val() === false) return;

      // As soon as this client is connected, remove itself on disconnect,
      // THEN mark itself present. Order matters: if onDisconnect is queued
      // after the set, a drop between the two calls could leave a ghost entry.
      onDisconnect(myPresenceRef)
        .remove()
        .then(() => {
          set(myPresenceRef, serverTimestamp());
        });
    });

    const unsubList = onValue(presenceListRef, (snap) => {
      setCount(snap.exists() ? snap.size : 0);
    });

    return () => {
      unsubConnected();
      unsubList();
      set(myPresenceRef, null); // best-effort cleanup on unmount/hot-reload
    };
  }, []);

  return count;
}
