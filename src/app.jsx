import React, { useEffect, useState } from "react";
import {initTheme, setTheme, THEMES} from "./themeSwitcher";

export default function App() {
  const [theme, setLocalTheme] = useState(
    () => localStorage.getItem("theme") || "default"
  );

  useEffect(() => {
    initTheme();
    setLocalTheme(localStorage.getItem("theme") || "default");
  }, []);

  const handleThemeChange = (e) => {
    const value = e.target.value;
    if (value === "toggle") {
      toggleTheme();
      setLocalTheme(localStorage.getItem("theme") || "default");
    } else {
      setTheme(value);
      setLocalTheme(value);
    }
  };

  return (
    <section id="app">
      <header>
        <div className="logo">
          <img src="" alt="weatherPod" />
        </div>

        <nav className="pages" aria-label="Main navigation">
          <div href="#home">Home</div>
          <div href="#products">Products</div>
          <div href="#history">History</div>
          <div href="#contact">Contact</div>
        </nav>

        <div className="more">
          <div className="connexions">
            <div href="#login" className="logo">person</div>
          </div>

          <div className="settings">
            <div className="theme">
              <select id="theme-select" value={theme} onChange={handleThemeChange}>
                {THEMES.map((t) => (
                  <option value={t} key={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      <main id="main">
        <h1>Welcome to WeatherPod</h1>
        <p>More information is coming soon.</p>

        <br/>

        <div className="link" onClick={() => window.open("https://data.inpi.fr/search?advancedSearch=%257B%257D&filter=%257B%257D&nbResultsPerPage=20&order=asc&page=1&q=weatherPod&sort=relevance&type=brands", "_blank")}>
          <div className="logo">open_in_new</div>
          <div className="text">https://data.inpi.fr</div>
        </div>
      </main>

      <footer>
        <p>2025 - WeatherPod</p>
        <p>Gabriel & Ewenn & Jean & Zachari</p>
      </footer>
    </section>
  );
}