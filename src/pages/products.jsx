import React, { useEffect, useState } from "react";

const STAR_PATHS = {
  FULL: "m221.04-103.5 68.35-294.63L60.63-596.46l301.87-25.95L480-900.33l117.5 277.92 301.87 25.95-228.76 198.33 68.35 294.63L480-259.91 221.04-103.5Z",
  HALF: "m601.46-292.46-32.05-138.5 107.18-92.65-140.74-12.52L480-667.11v300.52l121.46 74.13ZM221.04-103.5l68.35-294.63L60.63-596.46l301.87-25.95L480-900.33l117.5 277.92 301.87 25.95-228.76 198.33 68.35 294.63L480-259.91 221.04-103.5Z",
  EMPTY: "M358.54-293.46 480-366.59l121.46 74.13-32.05-138.5 107.18-92.65-140.74-12.52L480-667.11l-55.85 130.22-140.74 12.28 107.18 93.41-32.05 137.74ZM221.04-103.5l68.35-294.63L60.63-596.46l301.87-25.95L480-900.33l117.5 277.92 301.87 25.95-228.76 198.33 68.35 294.63L480-259.91 221.04-103.5ZM480-469.28Z"
};

const genererEtoiles = (stars) => {
  const rating = parseFloat(stars);
  const etoilesRemplies = Math.floor(rating);
  const demiEtoile = rating % 1 >= 0.25 && rating % 1 < 0.75;

  const etoilesJSX = Array(5).fill('').map((_, index) => {
    let path = STAR_PATHS.EMPTY;
    if (index < etoilesRemplies) {
      path = STAR_PATHS.FULL;
    } else if (index === etoilesRemplies && demiEtoile) {
      path = STAR_PATHS.HALF;
    }

    return (
      <svg key={index} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="star-icon">
        <path fill="currentColor" d={path} />
      </svg>
    );
  });

  return etoilesJSX;
};

export default function App() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/Gabriel-Jagueneau/weatherPod/refs/heads/main/storage/data/products.json"
        );
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();
        
        // Ajout d'une note de test si non présente (pour démontrer la fonction genererEtoiles)
        const productsWithRatings = data.map((p, i) => ({
            ...p,
            rating: p.rating || (i % 3 === 0 ? 4.8 : i % 3 === 1 ? 3.5 : 2.1)
        }));
        
        setProducts(productsWithRatings);
        setError(null);
      } catch (e) {
        console.error("Erreur lors du chargement des produits :", e);
        setError("Impossible de charger les données des produits.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="info-container loader">
        <p className="text">Chargement des produits...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="info-container error">
        <p className="error-text">{error}</p>
      </div>
    );
  }


  return (
    <div className="page products">
      <h1 className="title">Nos Packs WeatherPod</h1>
      <p className="text">
        Découvrez nos différentes options de location de Capteurs & Station, adaptées à tous vos besoins.
      </p>

      <div className="product-list">
        {products.map((produit, index) => (
          <div key={index} className="product-card">
            <div className="image-container">
              {
                produit.image ? (
                  <img
                    src={produit.image}
                    alt={produit.name}
                    className="product-image"
                  />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="placeholder">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                  </svg>
                )
              }
            </div>

            <div className="description">
                <div className="title">{produit.name}</div>
                <div className="text">{produit.description}</div>
            </div>

            <div className="contents">
              <div className="title">Inclus dans le package :</div>
              {Object.entries(produit.package || {}).map(([key, value]) => {
                if (value === 0 || value === "" || value === null) return null;
                
                let text = '';
                if (key === "capteurs") {
                  text = `${value} Capteur${value > 1 ? "s" : ""}`;
                } else if (key === "station") {
                  text = `${value} Station${value > 1 ? "s" : ""}`;
                } else if (key === "pass") {
                  text = `${value} App Pass`;
                }

                if (text) {
                  return <div key={key} className="item">
                    <svg fill="currentColor" viewBox="0 0 20 20" className="item-icon">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" fillRule="evenodd"></path>
                    </svg>
                    {text}
                  </div>;
                }
                return null;
              })}
            </div>
            
            <div className="avis">
              <div className="stars">
                <div className="note">
                  {genererEtoiles(produit.rating)}
                </div>
                <div className="text">
                    {produit.rating ? `${produit.rating} / 5 étoiles` : 'Pas encore noté'}
                </div>
              </div>
              <div className="price">
                <div className="text">Prix mensuel</div>
                <div className="main">{produit.prix || 'N/A'}</div>
              </div>
            </div>
            
            <button className="product-btn">
              Louer ce Pack
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}