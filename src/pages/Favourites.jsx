import { Link } from "react-router-dom";

/**
 * Favourites page.
 *
 * Displays all favourited episodes
 * and allows users to play or remove
 * them from their favourites.
 *
 * @param {Object} props
 * @param {Array} props.favourites
 * @param {Function} props.setFavourites
 * @param {Function} props.setCurrentEpisode
 *
 * @returns {JSX.Element}
 */
function Favourites({
  favourites,
  setFavourites,
  setCurrentEpisode,
}) {
  /**
   * Remove an episode from favourites.
   *
   * @param {Object} episode
   */
  function removeFavourite(episode) {
    setFavourites(
      favourites.filter(
        (fav) =>
          !(
            fav.podcastId ===
              episode.podcastId &&
            fav.season ===
              episode.season &&
            fav.episode ===
              episode.episode
          )
      )
    );
  }

  /**
   * Display an empty state when
   * no favourites exist.
   */
  if (favourites.length === 0) {
    return (
      <main className="favourites-page">

        {/*BACK BUTTON*/}

        <Link
          to="/"
          className="back-button"
        >
          ← Back to Podcasts
        </Link>

        {/*EMPTY STATE*/}

        <div className="empty-state">

          <h2>
            No favourite episodes yet.
          </h2>

          <p>
            Tap the ❤️ icon on an
            episode to save it here.
          </p>

        </div>

      </main>
    );
  }

  return (
    <main className="favourites-page">

      {/*BACK BUTTON*/}

      <Link
        to="/"
        className="back-button"
      >
        ← Back to Podcasts
      </Link>

      {/*PAGE TITLE*/}

      <section className="favourites-header">

        <h1>
          ❤️ Favourite Episodes
        </h1>

        <p>
          {favourites.length} saved
          episode
          {favourites.length !== 1
            ? "s"
            : ""}
        </p>

      </section>

      {/*FAVOURITES LIST*/}

      <section className="favourites-list">

        {favourites.map((episode) => (
          <article
            key={`${episode.podcastId}-${episode.season}-${episode.episode}`}
            className="favourite-card"
          >

            <img
              src={episode.podcastImage}
              alt={episode.podcastTitle}
              className="favourite-image"
            />

            <div className="favourite-content">

              <h2>
                {episode.podcastTitle}
              </h2>

              <h3>
                Season {episode.season}
                {" • "}
                Episode {episode.episode}
              </h3>

              <h4>
                {episode.title}
              </h4>

              <p>
                {episode.description
                  ? episode.description
                      .length > 180
                    ? `${episode.description.substring(
                        0,
                        180
                      )}...`
                    : episode.description
                  : "No description available."}
              </p>
                            {/*ACTIONS*/}

              <div className="favourite-actions">

                <button
                  className="episode-play-btn"
                  onClick={() =>
                    setCurrentEpisode({
                      ...episode,
                    })
                  }
                >
                  ▶ Play
                </button>

                <button
                  className="remove-favourite-btn"
                  onClick={() =>
                    removeFavourite(episode)
                  }
                >
                  ❤️ Remove
                </button>

              </div>

            </div>

          </article>
        ))}

      </section>

    </main>
  );
}

export default Favourites;