import { HashRouter, BrowserRouter, Routes, Route } from "react-router-dom";
import { DEFAULT_CHARACTER, USE_BROWSER_ROUTER } from "./common/constants";
import GlobalHeader from "./components/global-header";
import DashboardPage from "./pages/dashboard/dashboard-page";
import NotFound from "./pages/not-found";
import "./styles/app.scss";
import { useState } from "react";
import { Character } from "./common/types";

export default function App() {
  const Router = USE_BROWSER_ROUTER ? BrowserRouter : HashRouter;

  const [character, setCharacter] = useState<Character>(DEFAULT_CHARACTER);

  return (
    <div style={{ height: "100%" }}>
      <Router>
        <GlobalHeader />
        <div style={{ height: "56px", backgroundColor: "#000716" }}>&nbsp;</div>
        <div>
          <Routes>
            <Route
              index
              path="*"
              element={
                <DashboardPage
                  character={character}
                  setCharacter={setCharacter}
                />
              }
            />
            <Route path="test" element={<NotFound character={character} />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}
