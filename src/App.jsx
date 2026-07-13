import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ShowDetails from "./pages/ShowDetails";
import AudioPlayer from "./components/AudioPlayer";

/**
 * Main application component.
 * Handles routing and global audio playback.
 */
function App() {
  const [currentEpisode, setCurrentEpisode] =
    useState(null);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/show/:id"
          element={
            <ShowDetails
              setCurrentEpisode={
                setCurrentEpisode
              }
            />
          }
        />
      </Routes>

      <AudioPlayer
        currentEpisode={currentEpisode}
      />
    </>
  );
}

export default App;