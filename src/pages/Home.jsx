import { useState } from "react";
import HighwayScene from "../components/HighwayScene/HighwayScene.jsx";
import StatusBar from "../components/StatusBar/StatusBar.jsx";
import HighwaySign from "../components/HighwaySign/HighwaySign.jsx";
import TruckArtBorder from "../components/TruckArtBorder/TruckArtBorder.jsx";
import MusicPlayer from "../components/MusicPlayer/MusicPlayer.jsx";
import TrackList from "../components/TrackList/TrackList.jsx";
import { playlist } from "../data/playlist.js";
import "./Home.css";

// This is the only place that knows "which track is selected" — both
// MusicPlayer (the player controls) and TrackList (the up-next list)
// receive it as props, so picking a song in the list also plays it.
export default function Home() {
  // Start on a random track each time the page loads
  const [trackIndex, setTrackIndex] = useState(
    () => Math.floor(Math.random() * playlist.length)
  );

  return (
    <div className="home">
      <HighwayScene />

      <div className="home__content">
        <StatusBar />
        <TruckArtBorder>
          <HighwaySign />
        </TruckArtBorder>

        <div className="home__spacer" />

        <TrackList
          tracks={playlist}
          trackIndex={trackIndex}
          setTrackIndex={setTrackIndex}
        />

        <MusicPlayer
          tracks={playlist}
          trackIndex={trackIndex}
          setTrackIndex={setTrackIndex}
        />
      </div>
    </div>
  );
}
