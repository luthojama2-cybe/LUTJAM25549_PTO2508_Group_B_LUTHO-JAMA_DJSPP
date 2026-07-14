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
 * @param {Object} props
 * @param {Function} props.setCurrentEpisode
 * @param {Array} props.favourites
 * @param {Function} props.setFavourites
 * @param {string} props.theme
 * @param {Function} props.toggleTheme
 *
 * @returns {JSX.Element}
 */
function ShowDetails({
  setCurrentEpisode,
  favourites,
  setFavourites,
  theme,
  toggleTheme,
}) {

  /**
   * Podcast ID from URL.
   */
  const { id } = useParams();

  /**
   * Preserve Home state.
   */
  const location = useLocation();

  const [podcast, setPodcast] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

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
        const data =
          await getPodcast(id);

        setPodcast(data);

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
  const genreNames =
    (podcast.genres || []).map(
      (genreId) =>
        genreMap[genreId] ||
        "Unknown"
    );

  /**
   * Current season.
   */
  const season =
    podcast.seasons[selectedSeason];

  /**
   * Check whether an episode
   * is already favourited.
   */
  function isFavourite(episode) {
    return favourites.some(
      (fav) =>
        fav.podcastId === podcast.id &&
        fav.season === season.season &&
        fav.episode === episode.episode
    );
  }

  /**
   * Toggle favourite.
   */
  function toggleFavourite(episode) {
    if (isFavourite(episode)) {
      setFavourites(
        favourites.filter(
          (fav) =>
            !(
              fav.podcastId ===
                podcast.id &&
              fav.season ===
                season.season &&
              fav.episode ===
                episode.episode
            )
        )
      );

      return;
    }

    setFavourites([
      ...favourites,
      {
        podcastId: podcast.id,
        podcastTitle: podcast.title,
        podcastImage: podcast.image,

        season: season.season,

        addedAt:
          new Date().toISOString(),

        ...episode,
      },
    ]);
  }

  return (
    <main className="show-details">

      {/*PAGE ACTIONS*/}

      <div className="page-actions">

        <Link
          to="/"
          state={location.state}
          className="back-button"
        >
          ← Back to Podcasts
        </Link>

        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "light"
            ? "🌙"
            : "☀️"}
        </button>

      </div>

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
            {podcast.seasons.length}
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

          {podcast.seasons.map(
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

      {season && (
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
      )}
            {/*EPISODE LIST*/}

      {season && (
        <section className="episode-list">

          <h2>Episodes</h2>

          {season.episodes.map(
            (episode) => (

              <article
                key={`${season.season}-${episode.episode}`}
                className="episode-card"
              >

                <div className="episode-content">

                  {/*EPISODE HEADER*/}

                  <div className="episode-header">

                    <h3>
                      Episode {episode.episode}:{" "}
                      {episode.title}
                    </h3>

                    <div className="episode-actions">

                      {/*FAVOURITE BUTTON*/}

                      <button
                        className="favourite-btn"
                        onClick={() =>
                          toggleFavourite(
                            episode
                          )
                        }
                      >
                        {isFavourite(
                          episode
                        )
                          ? "❤️"
                          : "🤍"}
                      </button>

                      {/*PLAY BUTTON*/}

                      <button
                        className="episode-play-btn"
                        onClick={() =>
                          setCurrentEpisode({
                            ...episode,
                            podcastId:
                              podcast.id,
                            podcastTitle:
                              podcast.title,
                            podcastImage:
                              podcast.image,
                            season:
                              season.season,
                          })
                        }
                      >
                        ▶ Play
                      </button>

                    </div>

                  </div>

                  {/*DESCRIPTION*/}

                  <p>

                    {episode.description
                      ? episode
                          .description
                          .length > 180
                        ? `${episode.description.substring(
                            0,
                            180
                          )}...`
                        : episode.description
                      : "No description available."}

                  </p>

                </div>

              </article>

            )
          )}

        </section>
      )}

    </main>
  );
}

export default ShowDetails;