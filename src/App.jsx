import {
  useState,
  useEffect,
} from "react";
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
 * - Light/Dark theme
 *
 * @returns {JSX.Element}
 */
function App() {

  /**
   * Currently playing episode.
   */
  const [currentEpisode, setCurrentEpisode] =
    useState(null);

  /**
   * Favourite episodes.
   */
  const [favourites, setFavourites] =
    useState(() => {
      const saved =
        localStorage.getItem(
          "favourites"
        );

      return saved
        ? JSON.parse(saved)
        : [];
    });

  /**
   * Current application theme.
   */
  const [theme, setTheme] =
    useState(() => {
      return (
        localStorage.getItem(
          "theme"
        ) || "light"
      );
    });

  /**
   * Save favourites.
   */
  useEffect(() => {
    localStorage.setItem(
      "favourites",
      JSON.stringify(favourites)
    );
  }, [favourites]);

  /**
   * Save selected theme.
   */
  useEffect(() => {
    localStorage.setItem(
      "theme",
      theme
    );

    document.body.setAttribute(
      "data-theme",
      theme
    );
  }, [theme]);

  /**
   * Warn users before refreshing
   * while audio is playing.
   */
  useEffect(() => {
    function handleBeforeUnload(
      event
    ) {
      if (!currentEpisode) return;

      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );

    return () =>
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );
  }, [currentEpisode]);

  /**
   * Toggle between
   * Light and Dark mode.
   */
  function toggleTheme() {
    setTheme((prev) =>
      prev === "light"
        ? "dark"
        : "light"
    );
  }

  return (
    <>
      <Routes>

        <Route
          path="/"
          element={
            <Home
              theme={theme}
              toggleTheme={toggleTheme}
            />
          }
        />

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
              theme={theme}
              toggleTheme={
                toggleTheme
              }
            />
          }
        />

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
              theme={theme}
              toggleTheme={
                toggleTheme
              }
            />
          }
        />

      </Routes>

      <AudioPlayer
        currentEpisode={
          currentEpisode
        }
      />
    </>
  );
}

export default App;