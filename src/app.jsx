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
        <div className="pages">
          <div href="#home">Home</div>
          <div href="#products">Products</div>
          <div href="#history">History</div>
          <div href="#contact">Contact</div>
        </div>
        <div className="more">
          <div className="connexions">
            <div href="#login">login</div>
            <div href="#signup">how_to_reg</div>
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

      <div id="main">
        <h1>Welcome to WeatherPod</h1>
        <p>More informations are comming soon</p>
      </div>

      <footer>
        <p>2025 - WeatherPod</p>
        <p>Gabriel & Ewenn & Jean & Zachari</p>
      </footer>
    </section>
  );
}