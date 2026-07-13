import { Link } from "react-router-dom";

/**
 * Displays a preview card for a podcast.
 *
 * @param {Object} props - Component props.
 * @param {string} props.id - Podcast ID.
 * @param {string} props.image - URL of the podcast cover image.
 * @param {string} props.title - Title of the podcast.
 * @param {number} props.seasons - Number of seasons available.
 * @param {string[]} props.genres - Array of genre names.
 * @param {string} props.updated - Human-readable last updated date.
 * @param {string} props.searchTerm - Current search value.
 * @param {string} props.selectedGenre - Current selected genre.
 * @param {string} props.sortOrder - Current sort order.
 * @param {number} props.currentPage - Current pagination page.
 *
 * @returns {JSX.Element}
 */
function PodcastPreviewCard({
  id,
  image,
  title,
  seasons,
  genres,
  updated,
  searchTerm,
  selectedGenre,
  sortOrder,
  currentPage,
}) {
  return (
    <Link
      to={`/show/${id}`}
      state={{
        searchTerm,
        selectedGenre,
        sortOrder,
        currentPage,
      }}
      className="podcast-link"
    >
      <article className="podcast-card">
        <img
          src={image}
          alt={title}
        />

        <div className="podcast-content">
          <h2>{title}</h2>

          <p>{seasons} Seasons</p>

          <p>{genres.join(", ")}</p>

          <p>Updated {updated}</p>
        </div>
      </article>
    </Link>
  );
}

export default PodcastPreviewCard;