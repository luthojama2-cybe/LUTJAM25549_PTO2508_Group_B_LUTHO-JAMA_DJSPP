import {
  useRef,
  useState,
  useEffect,
} from "react";

/**
 * Global audio player.
 *
 * Displays the currently selected
 * episode and continues playing
 * across page navigation.
 *
 * @param {Object} props
 * @param {Object|null} props.currentEpisode
 *
 * @returns {JSX.Element}
 */
function AudioPlayer({
  currentEpisode,
}) {
  /**
   * Reference to the audio element.
   */
  const audioRef = useRef(null);

  /**
   * Player state.
   */
  const [isPlaying, setIsPlaying] =
    useState(false);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  /**
   * Load and automatically play a new
   * episode whenever one is selected.
   */
  useEffect(() => {
    if (
      currentEpisode &&
      audioRef.current
    ) {
      audioRef.current.load();

      audioRef.current
        .play()
        .catch(() => {});
    }
  }, [currentEpisode]);

  /**
   * Warn the user before leaving the
   * page while audio is playing.
   */
  useEffect(() => {
    function handleBeforeUnload(event) {
      if (
        audioRef.current &&
        !audioRef.current.paused
      ) {
        event.preventDefault();
        event.returnValue = "";
      }
    }

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );
    };
  }, []);

  /**
   * Play or pause the audio.
   */
  function togglePlayback() {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }

  /**
   * Seek to a different point
   * in the episode.
   */
  function handleSeek(event) {
    const value = Number(
      event.target.value
    );

    audioRef.current.currentTime =
      value;

    setCurrentTime(value);
  }

  /**
   * Converts seconds into mm:ss.
   */
  function formatTime(time) {
    if (!time) return "0:00";

    const minutes = Math.floor(
      time / 60
    );

    const seconds = Math.floor(
      time % 60
    );

    return `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  /**
   * No episode selected.
   */
  if (!currentEpisode) {
    return (
      <footer className="audio-player">
        <div className="player-info">
          <h3>No episode selected</h3>

          <p>
            Select an episode to begin
            listening.
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="audio-player">

      <audio
        ref={audioRef}
        onPlay={() =>
          setIsPlaying(true)
        }
        onPause={() =>
          setIsPlaying(false)
        }
        onEnded={() =>
          setIsPlaying(false)
        }
        onTimeUpdate={() =>
          setCurrentTime(
            audioRef.current.currentTime
          )
        }
        onLoadedMetadata={() =>
          setDuration(
            audioRef.current.duration
          )
        }
      >
        <source
          src={currentEpisode.file}
          type="audio/mpeg"
        />
      </audio>

      <div className="player-cover">

        <img
          src={
            currentEpisode.podcastImage
          }
          alt={
            currentEpisode.podcastTitle
          }
        />

      </div>

      <div className="player-details">

        <h3>
          {currentEpisode.title}
        </h3>

        <p>
          {currentEpisode.podcastTitle}
        </p>
      </div>
            <div className="player-controls">

        <button
          className="play-button"
          onClick={togglePlayback}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>

      </div>

      <div className="player-progress">

        <span className="time">
          {formatTime(currentTime)}
        </span>

        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="progress-bar"
        />

        <span className="time">
          {formatTime(duration)}
        </span>

      </div>

    </footer>
  );
}

export default AudioPlayer;