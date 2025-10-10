import React, { useEffect, useState } from "react";
import { initTheme, setTheme, THEMES } from "./themeSwitcher";

import Home from "./pages/home";
import Products from "./pages/products";
import History from "./pages/history";
import Contact from "./pages/contact";

import Connect from "./userConnect";

export default function App() {
  const [theme, setLocalTheme] = useState(
    () => localStorage.getItem("theme") || "default"
  );
  const [page, setPage] = useState(() => {
    const hash = window.location.hash.replace("#", "");
    return hash || "home";
  });

  useEffect(() => {
    initTheme();
    setLocalTheme(localStorage.getItem("theme") || "default");
    const onHashChange = () => {
      const h = window.location.hash.replace("#", "");
      if (h) setPage(h);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
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

  const goTo = (p) => {
    setPage(p);
    window.location.hash = p;
  };

  const renderPage = () => {
    switch (page) {
      case "connect":
        return <Connect/>;

      case "products":
        return <Products/>;

      case "history":
        return <History/>;

      case "contact":
        return <Contact/>;

      case "home":
      default:
        return <Home/>;
    }
  };

  return (
    <section id="app">
      <header>
        <div className="logo">
          <img src="" alt="weatherPod" />
        </div>

        <nav className="pages" aria-label="Main navigation">
          <div onClick={() => goTo("home")}>Maison</div>
          <div onClick={() => goTo("products")}>Produits</div>
          <div onClick={() => goTo("history")}>Competitions</div>
          <div onClick={() => goTo("contact")}>Contact</div>
        </nav>

        <div className="more">
          <div className="connexions">
            <div aria-label="login" className="logo"  onClick={() => goTo("connect")}>person</div>
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
        {renderPage()}
      </main>

      <footer>
        <p>WeatherPod - 2025</p>
        <p>Gabriel, Ewenn, Jean & Zachari</p>
        <br />
        <div className="link" onClick={() => window.open("https://data.inpi.fr/search?advancedSearch=%257B%257D&filter=%257B%257D&nbResultsPerPage=20&order=asc&page=1&q=weatherPod&sort=relevance&type=brands","_blank")}>
          <div className="logo">open_in_new</div>
          <div className="text">https://data.inpi.fr</div>
        </div>
      </footer>
    </section>
  );
}