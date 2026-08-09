import "./HighwaySign.css";

// The big diagonal-banner title. Kept as its own component (rather
// than inline in the page) so the two lines of copy are easy to find
// and edit without wading through layout code.
export default function HighwaySign() {
  return (
    <div className="highway-sign">
      <h1 className="highway-sign__title">शराब पीकर गाड़ी न चलाएँ</h1>
      <p className="highway-sign__subtitle">
        <span className="hs-panel">Use</span>
        <span className="hs-panel">Dipper</span>
        <span className="hs-panel">At</span>
        <span className="hs-panel">Night</span>
      </p>
    </div>
  );
}
