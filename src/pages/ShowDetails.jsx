import { useState, useEffect } from "react";
import {
  Link,
  useParams,
  useLocation,
} from "react-router-dom";
import { getPodcast } from "../services/api";
import { genres } from "../data/data";

/**
 * Creates a lookup object for genre names.
 */
const genreMap = Object.fromEntries(
  genres.map((genre) => [genre.id, genre.title])
);

/**
 * Show Details page.
 *
 * Displays detailed information
 * about a selected podcast.
 *
 * @returns {JSX.Element}
 */
function ShowDetails() {
  /**
   * Podcast ID from the URL.
   */
  const { id } = useParams();

  /**
   * Preserve Home page state.
   */
  const location = useLocation();

  const [podcast, setPodcast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Currently selected season.
   */
  const [selectedSeason, setSelectedSeason] =
    useState(0);

  /**
   * Fetch podcast data.
   */
  useEffect(() => {
    async function loadPodcast() {
      try {
        const data = await getPodcast(id);

        setPodcast(data);

        /**
         * Display the first season
         * by default.
         */
        setSelectedSeason(0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadPodcast();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-message">
        Loading podcast...
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-message error">
        Error: {error}
      </div>
    );
  }

  if (!podcast) {
    return (
      <div className="empty-state">
        Podcast not found.
      </div>
    );
  }

  /**
   * Convert genre IDs into names.
   */
  const genreNames = (podcast.genres || []).map(
    (genreId) =>
      genreMap[genreId] || "Unknown"
  );

  /**
   * Currently selected season.
   */
  const season =
    podcast.seasons[selectedSeason];

  return (
    <main className="show-details">

      {/*BACK BUTTON*/}

      <Link
        to="/"
        state={location.state}
        className="back-button"
      >
        ← Back to Podcasts
      </Link>

      {/*SHOW DETAILS*/}

      <section className="show-header">

        <img
          src={podcast.image}
          alt={podcast.title}
          className="show-image"
        />

        <div className="show-info">

          <h1>{podcast.title}</h1>

          <p>
            <strong>Genres:</strong>{" "}
            {genreNames.join(", ")}
          </p>

          <p>
            <strong>Last Updated:</strong>{" "}
            {new Date(
              podcast.updated
            ).toLocaleDateString()}
          </p>

          <p>
            <strong>Seasons:</strong>{" "}
            {podcast.seasons?.length || 0}
          </p>

          <p className="show-description">
            {podcast.description}
          </p>

        </div>

      </section>

      {/*SEASON NAVIGATION*/}

      <section className="season-selector">

        <h2>Select a Season</h2>

        <div className="season-buttons">

          {podcast.seasons?.map(
            (season, index) => (
              <button
                key={`${podcast.id}-${season.season}`}
                className={
                  selectedSeason === index
                    ? "season-btn active"
                    : "season-btn"
                }
                onClick={() =>
                  setSelectedSeason(index)
                }
              >
                Season {season.season}
              </button>
            )
          )}

        </div>
      </section>
            {/*SELECTED SEASON*/}

      <section className="season-details">

        <img
          src={season.image}
          alt={season.title}
          className="season-image"
        />

        <div className="season-info">

          <h2>{season.title}</h2>

          <p>
            <strong>Episodes:</strong>{" "}
            {season.episodes.length}
          </p>

        </div>

      </section>

      {/*EPISODE LIST*/}

      <section className="episode-list">

        <h2>Episodes</h2>

        {season.episodes.map(
          (episode, index) => (
            <article
              key={episode.title}
              className="episode-card"
            >

              <div className="episode-content">

                <h3>
                  Episode {index + 1}:{" "}
                  {episode.title}
                </h3>

            <p>
              {episode.description
                ? episode.description.length > 180
                  ? `${episode.description.substring(0, 180)}...`
                  : episode.description
                : "No description available."}
            </p>

              </div>

            </article>
          )
        )}

      </section>

    </main>
  );
}

export default ShowDetails;