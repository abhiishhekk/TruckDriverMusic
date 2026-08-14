import "./HighwayScene.css";

// The scene is now a real illustrated image (public/Images/scene-background.svg)
// rather than a hand-drawn inline SVG — CSS applies it as a full-bleed
// cover background so it behaves like a photo backdrop. A dark gradient
// overlay sits on top purely for text legibility (StatusBar/HighwaySign/
// MusicPlayer text needs contrast regardless of what the image looks like).
//
// Swap the image any time by replacing public/Images/scene-background.svg
// (or point BACKGROUND_IMAGE at a different file) — nothing else here
// needs to change.
const BACKGROUND_IMAGE = "/Images/background-1.png";

export default function HighwayScene() {
  return (
    <div className="highway-scene" aria-hidden="true">
      <div
        className="highway-scene__image"
        style={{ backgroundImage: `url(${BACKGROUND_IMAGE})` }}
      />
      <div className="highway-scene__overlay" />
    </div>
  );
}
