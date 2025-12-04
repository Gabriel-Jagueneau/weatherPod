import React, { useEffect, useState, useRef } from "react";
import { initTheme, setTheme, THEMES } from "./themeSwitcher";

import Home from "./pages/home";
import Products from "./pages/products";
import Contact from "./pages/contact";
import Connect from "./userConnect";

export default function App() {
  const [theme, setLocalTheme] = useState(
    () => localStorage.getItem("theme") || "default"
  );
  const [page, setPage] = useState(() => {
    const hash = window.location.hash.replace("#", "");
    return hash && 
           (hash === "home" || hash === "products" || hash === "contact" || hash === "connect") 
           ? hash : "home"; 
  });

  const indicatorRef = useRef(null);
  const navRef = useRef(null);

  const buttonRefs = {
    home: useRef(null),
    products: useRef(null),
    contact: useRef(null),
  };

  const findActiveButton = () => {
    if (page === 'connect') {
      return null; 
    }
    
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

    if (!indicator || !element) {
        if (indicator) {
          indicator.style.width = '0px';
        }
        return;
    }

    const newLeft = element.offsetLeft;
    const newWidth = element.offsetWidth;

    indicator.style.left = `${newLeft}px`;
    indicator.style.width = `${newWidth}px`;
  };

  const updateIndicatorPosition = () => {
    window.requestAnimationFrame(() => {
        const activeButton = findActiveButton();
        moveIndicator(activeButton);
    });
  };

  useEffect(() => {
    updateIndicatorPosition();
  }, [page]); 

  useEffect(() => {
    initTheme();
    setLocalTheme(localStorage.getItem("theme") || "default");
    
    const onHashChange = () => {
      const h = window.location.hash.replace("#", "");
      if (h) setPage(h);
    };
    
    window.addEventListener("hashchange", onHashChange);
    updateIndicatorPosition();

    return () => {
      window.removeEventListener("hashchange", onHashChange);
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
    window.location.hash = p;
  };

  const isPageActive = (p) => page === p ? 'active' : '';

  const renderPage = () => {
    const pageProps = {
      goTo: goTo,
      isPageActive: isPageActive,
      buttonRefs: buttonRefs, 
    };

    switch (page) {
      case "connect":
        return <Connect goTo={goTo} />;
      case "products":
        return <Products {...pageProps} />;
      case "contact":
        return <Contact {...pageProps} />;
      case "home":
      default:
        return <Home {...pageProps} />; 
    }
  };

  return (
    <section id="app">
      <header>
        <div className="top">
          <div className="site-logo">
            <img src="https://raw.githubusercontent.com/Gabriel-Jagueneau/plintzy/refs/heads/main/storage/images/plintzy-logo-image.png" alt="plintzy" />
          </div>
          <div className="more">
            <div className="connexion blur-box logo blur-box-interactive"  onClick={() => goTo("connect")}>person<span>Profile</span></div>

            <div className="settings blur-box blur-box-interactive">
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
            <a 
              className={`button ${isPageActive("home")}`} 
              href="#home"
              onClick={() => goTo("home")}
              ref={buttonRefs.home}
            >Maison</a>
            <div className="space"></div>
            <a 
              className={`button ${isPageActive("products")}`} 
              href="#products"
              onClick={() => goTo("products")}
              ref={buttonRefs.products}
            >Produits</a>
            <div className="space"></div>
            <a 
              className={`button ${isPageActive("contact")}`} 
              href="#contact"
              onClick={() => goTo("contact")}
              ref={buttonRefs.contact}
            >Contact</a>
            
            <div id="indicator" ref={indicatorRef}></div>
          </nav>
        </div>
      </header>

      <main id="main">
        {renderPage()}
      </main>

      <footer>
        <p>Plintzy - 2025</p>
        <p>Gabriel, Ewenn, Jean & Zachari</p>
        <br />
        <div className="link" onClick={() => window.open("https://data.inpi.fr/search?advancedSearch=%257B%257D&filter=%257B%257D&nbResultsPerPage=20&order=asc&page=1&q=plintzy","_blank")}>
          <div className="logo">open_in_new</div>
          <div className="text">https://data.inpi.fr</div>
        </div>
      </footer>
    </section>
  );
}