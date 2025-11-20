import React, { useEffect, useState, useRef } from "react";
import { initTheme, setTheme, THEMES } from "./themeSwitcher";

import Home from "./pages/home";
import Products from "./pages/products";
//import History from "./pages/history";
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

  const indicatorRef = useRef(null);
  const navRef = useRef(null);

  const buttonRefs = {
    home: useRef(null),
    products: useRef(null),
    contact: useRef(null),
  };

  const findActiveButton = () => {
    if (buttonRefs.hasOwnProperty(page)) {
        const buttonRef = buttonRefs[page]?.current;
        if (buttonRef && indicatorRef.current && navRef.current) {
            return buttonRef;
        }
    }
    return null;
  };

  const moveIndicator = (element) => {
    const indicator = indicatorRef.current;
    const navContainer = navRef.current;

    if (!indicator || !navContainer || !element) {
        indicator.style.width = '0px';
        return;
    }

    const navRect = navContainer.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    const newLeft = elementRect.left - navRect.left;
    const newWidth = elementRect.width;

    indicator.style.left = `${newLeft - 1}px`;
    indicator.style.width = `${newWidth}px`;
  };

  useEffect(() => {
    const activeButton = findActiveButton();
    if (activeButton) {
      moveIndicator(activeButton);
    } else {
      moveIndicator(null); 
    }
  }, [page]);

  useEffect(() => {
    initTheme();
    setLocalTheme(localStorage.getItem("theme") || "default");
    const onHashChange = () => {
      const h = window.location.hash.replace("#", "");
      if (h) setPage(h);
    };
    window.addEventListener("hashchange", onHashChange);
    const handleResize = () => {
        const activeButton = findActiveButton();
        if (activeButton) {
            moveIndicator(activeButton);
        } else {
          moveIndicator(null);
        }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  const handleThemeChange = (e) => {
    const value = e.target.value;
    if (value === "toggle") {
      const currentThemeIndex = THEMES.indexOf(theme);
      const nextThemeIndex = (currentThemeIndex + 1) % THEMES.length;
      const nextTheme = THEMES[nextThemeIndex];
      setTheme(nextTheme);
      setLocalTheme(nextTheme);
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
      /*case "history":
        return <History/>;*/
      //<div onClick={() => goTo("history")}>Competitions</div>
      case "contact":
        return <Contact/>;
      case "home":
      default:
        return <Home/>;
    }
  };

  const isPageActive = (p) => page === p ? 'active' : '';

  return (
    <section id="app">
      <header>
        <div className="top">
          <div className="site-logo">
            <img src="https://raw.githubusercontent.com/Gabriel-Jagueneau/weatherPod/refs/heads/main/storage/images/green-leaf.png" alt="weatherPod" />
          </div>
          <div className="more">
            <div aria-label="login" className="connexion blur-box logo"  onClick={() => goTo("connect")}>person</div>

            <div className="settings blur-box">
              <div className="theme">
                <select id="theme-select" value={theme} onChange={handleThemeChange}>
                  {THEMES.map((t) => (
                    <option value={t} key={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          </div>
        </div>
        <div className="bottom">
          <nav className="pages blur-box" aria-label="Main navigation" ref={navRef}>
            <div 
              className={`button ${isPageActive("home")}`} 
              onClick={() => goTo("home")} 
              ref={buttonRefs.home}
            >Maison</div>
            <div className="space"></div>
            <div 
              className={`button ${isPageActive("products")}`} 
              onClick={() => goTo("products")} 
              ref={buttonRefs.products}
            >Produits</div>
            <div className="space"></div>
            <div 
              className={`button ${isPageActive("contact")}`} 
              onClick={() => goTo("contact")} 
              ref={buttonRefs.contact}
            >Contact</div>
            <div id="indicator" ref={indicatorRef}></div>
          </nav>
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