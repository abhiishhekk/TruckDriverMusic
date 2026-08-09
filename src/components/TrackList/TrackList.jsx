import "./TrackList.css";

// Shows only the next track (one item) relative to `trackIndex`.
// Clicking it will set playback to that next track.
export default function TrackList({ tracks, trackIndex, setTrackIndex }) {
  const nextIndex = trackIndex + 1;
  const hasNext = nextIndex < tracks.length;
  const nextTrack = hasNext ? tracks[nextIndex] : null;

  return (
    <ol className="track-list">
      {hasNext ? (
        <li key={nextTrack.id}>
          <button
            type="button"
            className={`track-list__row`}
            onClick={() => setTrackIndex(nextIndex)}
            aria-current={false}
          >
            <span
              className="track-list__swatch"
              style={{ background: nextTrack.accent }}
              aria-hidden="true"
            />
            <span className="track-list__text">
              <span className="track-list__title">{nextTrack.title}</span>
              <span className="track-list__artist">{nextTrack.artist}</span>
            </span>
          </button>
        </li>
      ) : null}
    </ol>
  );
}
