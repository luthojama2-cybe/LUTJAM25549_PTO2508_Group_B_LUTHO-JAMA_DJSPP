import { useRef } from "react";
import { Link } from "react-router-dom";
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
 * Recommended Shows carousel.
 *
 * Displays a horizontally
 * scrollable list of
 * recommended podcasts.
 *
 * @param {Object} props
 * @param {Array} props.podcasts
 * @param {string} props.searchTerm
 * @param {string} props.selectedGenre
 * @param {string} props.sortOrder
 * @param {number} props.currentPage
 *
 * @returns {JSX.Element}
 */
function RecommendedCarousel({
  podcasts,
  searchTerm,
  selectedGenre,
  sortOrder,
  currentPage,
}) {

  /**
   * Carousel reference.
   */
  const carouselRef = useRef(null);

  /**
   * Scroll carousel left.
   */
  function scrollLeft() {
    carouselRef.current?.scrollBy({
      left: -350,
      behavior: "smooth",
    });
  }

  /**
   * Scroll carousel right.
   */
  function scrollRight() {
    carouselRef.current?.scrollBy({
      left: 350,
      behavior: "smooth",
    });
  }

  return (
    <section className="recommended-section">

      {/*SECTION HEADER*/}

      <div className="recommended-header">

        <h2>
           Recommended Shows
        </h2>

        <div className="carousel-buttons">

          <button
            className="carousel-btn"
            onClick={scrollLeft}
          >
            ←
          </button>

          <button
            className="carousel-btn"
            onClick={scrollRight}
          >
            →
          </button>

        </div>

      </div>

      {/*CAROUSEL*/}

      <div
        className="recommended-carousel"
        ref={carouselRef}
      >

        {podcasts.map((podcast) => {

          /**
           * Convert genre IDs
           * into genre names.
           */
          const genreNames =
            (podcast.genres || []).map(
              (genreId) =>
                genreMap[genreId] ||
                "Unknown"
            );

          return (

            <Link
              key={podcast.id}
              to={`/show/${podcast.id}`}
              state={{
                searchTerm,
                selectedGenre,
                sortOrder,
                currentPage,
              }}
              className="recommended-card"
            >

              <img
                src={podcast.image}
                alt={podcast.title}
              />

              <div className="recommended-content">

                <h3>
                  {podcast.title}
                </h3>

                <p>
                  {podcast.seasons} Seasons
                </p>
                                {/*GENRE TAGS*/}

                <div className="recommended-genres">

                  {genreNames
                    .slice(0, 3)
                    .map((genre) => (

                      <span
                        key={genre}
                        className="genre-tag"
                      >
                        {genre}
                      </span>

                    ))}

                </div>

              </div>

            </Link>

          );
        })}

      </div>

    </section>
  );
}

export default RecommendedCarousel;