import {
  useState,
  useEffect,
  useRef,
} from "react";
import {
  Link,
  useLocation,
} from "react-router-dom";

import { getPodcasts } from "../services/api";
import PodcastPreviewCard from "../components/PodcastPreviewCard";
import RecommendedCarousel from "../components/RecommendedCarousel";
import { genres } from "../data/data";

/**
 * Creates a lookup object
 * for genre names.
 */
const genreMap = Object.fromEntries(
  genres.map((genre) => [
    genre.id,
    genre.title,
  ])
);

/**
 * Genres displayed
 * in the filter.
 */
const featuredGenres =
  genres.filter((genre) =>
    [
      "History",
      "Comedy",
      "Business",
      "News",
      "Personal Growth",
      "Investigative Journalism",
    ].includes(genre.title)
  );

/**
 * Converts an ISO date
 * into a readable format.
 *
 * @param {string} updated
 * @returns {string}
 */
function formatLastUpdated(updated) {
  const days = Math.floor(
    (Date.now() -
      new Date(updated)) /
      86400000
  );

  if (days < 1) return "Today";

  const units = [
    [365, "year"],
    [30, "month"],
    [7, "week"],
    [1, "day"],
  ];

  for (const [
    size,
    label,
  ] of units) {
    const value = Math.floor(
      days / size
    );

    if (value >= 1) {
      return `${value} ${label}${
        value > 1 ? "s" : ""
      } ago`;
    }
  }

  return "Unknown";
}

/**
 * Home page.
 *
 * @returns {JSX.Element}
 */
function Home() {
  const location =
    useLocation();

  /**
   * Prevent page reset
   * on initial render.
   */
  const firstRender =
    useRef(true);

  const [
    podcasts,
    setPodcasts,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState(null);

  /**
   * Restore Home state.
   */
  const [
    searchTerm,
    setSearchTerm,
  ] = useState(
    location.state
      ?.searchTerm || ""
  );

  const [
    selectedGenre,
    setSelectedGenre,
  ] = useState(
    location.state
      ?.selectedGenre ||
      "all"
  );

  const [
    sortOrder,
    setSortOrder,
  ] = useState(
    location.state
      ?.sortOrder || "az"
  );

  const [
    currentPage,
    setCurrentPage,
  ] = useState(
    location.state
      ?.currentPage || 1
  );

  const podcastsPerPage = 12;

  /**
   * Fetch podcasts.
   */
  useEffect(() => {
    async function loadPodcasts() {
      try {
        const data =
          await getPodcasts();

        setPodcasts(data);
      } catch (err) {
        setError(
          err.message
        );
      } finally {
        setLoading(false);
      }
    }

    loadPodcasts();
  }, []);

  /**
   * Reset pagination.
   */
  useEffect(() => {
    if (
      firstRender.current
    ) {
      firstRender.current =
        false;

      return;
    }

    setCurrentPage(1);
  }, [
    searchTerm,
    selectedGenre,
    sortOrder,
  ]);

  /**
   * Working podcast list.
   */
  let results = [
    ...podcasts,
  ];

  /**
   * Search.
   */
  results = results.filter(
    (podcast) =>
      podcast.title
        .toLowerCase()
        .includes(
          searchTerm
            .trim()
            .toLowerCase()
        )
  );

  /**
   * Genre filter.
   */
  if (
    selectedGenre !== "all"
  ) {
    results = results.filter(
      (podcast) =>
        (
          podcast.genres ||
          []
        ).includes(
          Number(
            selectedGenre
          )
        )
    );
  }

  /**
   * Sort.
   */
  results.sort((a, b) => {
    if (
      sortOrder === "az"
    ) {
      return a.title.localeCompare(
        b.title
      );
    }

    return b.title.localeCompare(
      a.title
    );
  });

  /**
   * Recommended shows.
   */
  const recommendedShows =
    podcasts.slice(0, 10);

  /**
   * Pagination.
   */
  const totalPages =
    Math.ceil(
      results.length /
        podcastsPerPage
    );

  const startIndex =
    (currentPage - 1) *
    podcastsPerPage;

  const paginatedResults =
    results.slice(
      startIndex,
      startIndex +
        podcastsPerPage
    );

  if (loading) {
    return (
      <div className="loading-message">
        Loading podcasts...
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

  return (
    <>

      {/*NAVBAR*/}

      <header className="navbar">

        <div className="logo">
          <span>🎙️</span>
          <h1>
            PodcastApp
          </h1>
        </div>

        <div className="navbar-actions">

          <input
            type="text"
            placeholder="Search podcasts..."
            value={
              searchTerm
            }
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
            className="navbar-search"
          />

          <Link
            to="/favourites"
            className="favourites-link"
          >
            ❤️ Favourites
          </Link>

        </div>

      </header>

      {/*FILTERS*/}

      <section className="controls">

        <select
          value={
            selectedGenre
          }
          onChange={(e) =>
            setSelectedGenre(
              e.target.value
            )
          }
        >

          <option value="all">
            All Genres
          </option>

          {featuredGenres.map(
            (genre) => (
              <option
                key={
                  genre.id
                }
                value={
                  genre.id
                }
              >
                {genre.title}
              </option>
            )
          )}

        </select>

        <select
          value={sortOrder}
          onChange={(e) =>
            setSortOrder(
              e.target.value
            )
          }
        >

          <option value="az">
            Title A-Z
          </option>

          <option value="za">
            Title Z-A
          </option>

        </select>

      </section>

      {/*RECOMMENDED SHOWS*/}

      <RecommendedCarousel
        podcasts={
          recommendedShows
        }
        searchTerm={
          searchTerm
        }
        selectedGenre={
          selectedGenre
        }
        sortOrder={
          sortOrder
        }
        currentPage={
          currentPage
        }
      />
            {/*RESULTS*/}

      {paginatedResults.length === 0 ? (
        <h2 className="empty-state">
          No podcasts found.
        </h2>
      ) : (
        <>
          <main className="podcast-grid">

            {paginatedResults.map(
              (podcast) => {

                /**
                 * Convert genre IDs
                 * into names.
                 */
                const genreNames = (
                  podcast.genres || []
                ).map(
                  (genreId) =>
                    genreMap[
                      genreId
                    ] || "Unknown"
                );

                return (
                  <PodcastPreviewCard
                    key={podcast.id}
                    id={podcast.id}
                    image={podcast.image}
                    title={podcast.title}
                    seasons={
                      podcast.seasons
                    }
                    genres={
                      genreNames
                    }
                    updated={formatLastUpdated(
                      podcast.updated
                    )}

                    /* Preserve Home state */
                    searchTerm={
                      searchTerm
                    }
                    selectedGenre={
                      selectedGenre
                    }
                    sortOrder={
                      sortOrder
                    }
                    currentPage={
                      currentPage
                    }
                  />
                );
              }
            )}

          </main>

          {/*PAGINATION*/}

          <div className="pagination">

            <button
              onClick={() =>
                setCurrentPage(
                  (prev) =>
                    Math.max(
                      prev - 1,
                      1
                    )
                )
              }
              disabled={
                currentPage === 1
              }
            >
              Previous
            </button>

            <span>
              Page {currentPage} of{" "}
              {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage(
                  (prev) =>
                    Math.min(
                      prev + 1,
                      totalPages
                    )
                )
              }
              disabled={
                currentPage ===
                totalPages
              }
            >
              Next
            </button>

          </div>
        </>
      )}

    </>
  );
}

export default Home;