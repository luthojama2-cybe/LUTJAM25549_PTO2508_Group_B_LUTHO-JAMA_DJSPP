import { useState } from "react";
import { Link } from "react-router-dom";

/**
 * Formats the date an episode
 * was added to favourites.
 *
 * @param {string} date
 * @returns {string}
 */
function formatAddedDate(date) {
  return new Date(date).toLocaleString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

/**
 * Favourites page.
 *
 * Displays all favourited episodes
 * grouped by podcast title.
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
   * Current sorting option.
   */
  const [sortOrder, setSortOrder] =
    useState("newest");

  /**
   * Remove an episode
   * from favourites.
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
   * Sort favourites.
   */
  const sortedFavourites = [
    ...favourites,
  ].sort((a, b) => {
    switch (sortOrder) {
      case "az":
        return a.title.localeCompare(
          b.title
        );

      case "za":
        return b.title.localeCompare(
          a.title
        );

      case "oldest":
        return (
          new Date(a.addedAt) -
          new Date(b.addedAt)
        );

      case "newest":
      default:
        return (
          new Date(b.addedAt) -
          new Date(a.addedAt)
        );
    }
  });

  /**
   * Group favourite episodes
   * by podcast title.
   */
  const groupedFavourites =
    sortedFavourites.reduce(
      (groups, episode) => {
        if (
          !groups[
            episode.podcastTitle
          ]
        ) {
          groups[
            episode.podcastTitle
          ] = [];
        }

        groups[
          episode.podcastTitle
        ].push(episode);

        return groups;
      },
      {}
    );

  /**
   * Empty state.
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
            Tap the ❤️ icon on any
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

      {/*PAGE HEADER*/}

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

      {/*SORT CONTROLS*/}

      <section className="favourites-controls">

        <label htmlFor="sort">
          Sort By
        </label>

        <select
          id="sort"
          value={sortOrder}
          onChange={(e) =>
            setSortOrder(
              e.target.value
            )
          }
        >
          <option value="newest">
            Newest Added
          </option>

          <option value="oldest">
            Oldest Added
          </option>

          <option value="az">
            A–Z Title
          </option>

          <option value="za">
            Z–A Title
          </option>
        </select>

      </section>

      {/*GROUPED FAVOURITES*/}

      {Object.entries(
        groupedFavourites
      ).map(
        ([
          podcastTitle,
          episodes,
        ]) => (

          <section
            key={podcastTitle}
            className="podcast-group"
          >

            <h2 className="podcast-group-title">
              {podcastTitle}
            </h2>

            <div className="favourites-list">

              {episodes.map(
                (episode) => (

                  <article
                    key={`${episode.podcastId}-${episode.season}-${episode.episode}`}
                    className="favourite-card"
                  >

                    <img
                      src={
                        episode.podcastImage
                      }
                      alt={
                        episode.podcastTitle
                      }
                      className="favourite-image"
                    />

                    <div className="favourite-content">

                      <h3>
                        Season{" "}
                        {episode.season}
                        {" • "}
                        Episode{" "}
                        {episode.episode}
                      </h3>

                      <h4>
                        {episode.title}
                      </h4>

                      <p className="added-date">

                        <strong>
                          Added:
                        </strong>{" "}

                        {formatAddedDate(
                          episode.addedAt
                        )}

                      </p>

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
                            removeFavourite(
                              episode
                            )
                          }
                        >
                          ❤️ Remove
                        </button>

                      </div>

                    </div>

                  </article>

                )
              )}

            </div>

          </section>

        )
      )}

    </main>
  );
}

export default Favourites;