import { useEffect, useState } from "react";
import { useOnlineCount } from "../../hooks/useOnlineCount.js";
import "./StatusBar.css";

// Small presentational component: live clock on the left, a real
// "listeners online" count (via Firebase presence) in the middle,
// quick links on the right.
// No props — it's self-contained, so it's easy to drop anywhere.
export default function StatusBar() {
  const [time, setTime] = useState(() => formatTime(new Date()));
  const onlineCount = useOnlineCount();

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 1000 * 30);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="status-bar">
      <span className="status-bar__time">{time}</span>

      <span className="status-bar__online">
        <span className="status-bar__indicator">
          <span className="status-bar__dot" aria-hidden="true" />
          {/* <span className="status-bar__bar" aria-hidden="true" /> */}
        </span>
        <span className="status-bar__label">
          {onlineCount} People Driving Now
        </span>
      </span>

      <nav className="status-bar__links">
        <p>
          दुर्घटना से देरी भली
        </p>
        {/* <a href="#" onClick={(e) => e.preventDefault()}>
          दुर्घटना से देरी भली
        </a> */}
      </nav>
    </header>
  );
}

function formatTime(date) {
  return date
    .toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })
    .toLowerCase();
}
