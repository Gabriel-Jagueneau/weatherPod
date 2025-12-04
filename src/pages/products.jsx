import React, { useEffect, useState } from "react";

const STAR_PATHS = {
  FULL: "m221.04-103.5 68.35-294.63L60.63-596.46l301.87-25.95L480-900.33l117.5 277.92 301.87 25.95-228.76 198.33 68.35 294.63L480-259.91 221.04-103.5Z",
  HALF: "m601.46-292.46-32.05-138.5 107.18-92.65-140.74-12.52L480-667.11v300.52l121.46 74.13ZM221.04-103.5l68.35-294.63L60.63-596.46l301.87-25.95L480-900.33l117.5 277.92 301.87 25.95-228.76 198.33 68.35 294.63L480-259.91 221.04-103.5Z",
  EMPTY: "M358.54-293.46 480-366.59l121.46 74.13-32.05-138.5 107.18-92.65-140.74-12.52L480-667.11l-55.85 130.22-140.74 12.28 107.18 93.41-32.05 137.74ZM221.04-103.5l68.35-294.63L60.63-596.46l301.87-25.95L480-900.33l117.5 277.92 301.87 25.95-228.76 198.33 68.35 294.63L480-259.91 221.04-103.5ZM480-469.28Z"
};

const genererEtoiles = (stars) => {
  const rating = parseFloat(stars);
  const etoilesRemplies = Math.floor(rating);
  const demiEtoile = rating % 1 >= 0.2 && rating % 1 < 0.8;

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
          "https://raw.githubusercontent.com/Gabriel-Jagueneau/plintzy/refs/heads/main/storage/data/products.json"
        );
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
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
      <div className="loader"></div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 12v4"/><path d="M12 20h.01"/><path d="M17 18h.5a1 1 0 0 0 0-9h-1.79A7 7 0 1 0 7 17.708"/>
        </svg>
        <p className="error-text">{error}</p>
      </div>
    );
  }

  return (
    <div className="page products">
      <h1 className="title">Nos Packs plintzy</h1>
      <p className="text">
        Découvrez nos différentes options de location de Capteurs & Station, adaptées à tous vos besoins.
      </p>

      <div className="product-list">
        {products.map((produit, index) => (
          <div key={index} className="product-card">
            <div className="favorite">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" className="placeholder">
                <path d="m856.78-211.28-125.5-125.5 63.89-63.89 125.5 125.5-63.89 63.89Zm-146.39-475.7-63.89-63.89L772-876.37l63.89 63.89-125.5 125.5Zm-460.78 0-125.5-125.5L188-876.37l125.5 125.5-63.89 63.89Zm-146.15 475.7-63.9-63.89 125.51-125.5 63.89 63.89-125.5 125.5Zm124.52 99.41 66.67-286.98-222.78-193.3 293.74-25.24L480-888.13l114.39 270.74 293.74 25.24-222.54 193.3 66.43 286.98L480-264.46 227.98-111.87Z"/>
              </svg>
              Meilleure Offre
            </div>
            
            <div className="image-container">
              {produit.image ? (<img src={produit.image} alt={produit.name} className="product-image"/>) : (<div className="placeholder loader-small"></div>)}
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