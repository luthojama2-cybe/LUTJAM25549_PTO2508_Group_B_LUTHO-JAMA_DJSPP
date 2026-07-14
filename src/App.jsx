import { useState, useEffect } from "react";
import {
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import ShowDetails from "./pages/ShowDetails";
import Favourites from "./pages/Favourites";

import AudioPlayer from "./components/AudioPlayer";

/**
 * Main application component.
 *
 * Handles:
 * - Routing
 * - Global audio player
 * - Favourite episodes
 *
 * @returns {JSX.Element}
 */
function App() {
  /**
   * Currently playing episode.
   */
  const [
    currentEpisode,
    setCurrentEpisode,
  ] = useState(null);

  /**
   * Favourite episodes.
   *
   * Loaded from localStorage so they
   * persist across browser sessions.
   */
  const [
    favourites,
    setFavourites,
  ] = useState(() => {
    const saved =
      localStorage.getItem(
        "favourites"
      );

    return saved
      ? JSON.parse(saved)
      : [];
  });

  /**
   * Save favourites whenever they
   * change.
   */
  useEffect(() => {
    localStorage.setItem(
      "favourites",
      JSON.stringify(favourites)
    );
  }, [favourites]);

  return (
    <>
      <Routes>

        {/*HOME*/}

        <Route
          path="/"
          element={<Home />}
        />

        {/*SHOW DETAILS*/}

        <Route
          path="/show/:id"
          element={
            <ShowDetails
              setCurrentEpisode={
                setCurrentEpisode
              }
              favourites={
                favourites
              }
              setFavourites={
                setFavourites
              }
            />
          }
        />

        {/*FAVOURITES*/}

        <Route
          path="/favourites"
          element={
            <Favourites
              favourites={
                favourites
              }
              setFavourites={
                setFavourites
              }
              setCurrentEpisode={
                setCurrentEpisode
              }
            />
          }
        />

      </Routes>

      {/*GLOBAL AUDIO PLAYER*/}

      <AudioPlayer
        currentEpisode={
          currentEpisode
        }
      />

    </>
  );
}

export default App;