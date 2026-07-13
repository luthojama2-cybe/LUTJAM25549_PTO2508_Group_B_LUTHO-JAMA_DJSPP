/**
 * Fetches all podcast preview data from the Podcast API.
 *
 * @async
 * @function getPodcasts
 * @returns {Promise<Object[]>} A promise that resolves to an array of podcast objects.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function getPodcasts() {
  const response = await fetch(
    "https://podcast-api.netlify.app"
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch podcasts. Status: ${response.status}`
    );
  }

  return response.json();
}

/**
 * Fetches a single podcast by ID.
 *
 * @async
 * @function getPodcast
 * @param {string} id - The podcast ID.
 * @returns {Promise<Object>} A promise that resolves to a podcast object.
 * @throws {Error} Throws an error if the API request fails.
 */
export async function getPodcast(id) {
  const response = await fetch(
    `https://podcast-api.netlify.app/id/${id}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch podcast. Status: ${response.status}`
    );
  }

  return response.json();
}