import { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/Gabriel-Jagueneau/weatherPod/refs/heads/main/storage/data/products.json"
        );
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Erreur lors du chargement des produits :", error);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="page products">
      <h1>Nos Produits WeatherPod</h1>
      <p className="intro">
        La page produits servira à présenter nos différents packs de location de
        Capteurs & Station.
      </p>

      <div className="product-grid">
        {products.map((produit, index) => (
          <div key={index} className="product-card">
            <img src="" alt="" />
            <h2>{produit.name}</h2>
            <p>{produit.description}</p>
            <div className="product-divider">
              {Object.entries(produit.package || {}).map(([key, value]) => {
                if (key === "capteurs" && value != 0) {
                  return <div key={key}>{value} Capteur{value > 1 ? "s" : ""}</div>;
                }
                if (key === "station" && value != 0) {
                  return <div key={key}>{value} Station{value > 1 ? "s" : ""}</div>;
                }
                if (key === "pass") {
                  return <div key={key}>{value} App Pass</div>;
                }
                return null;
              })}
            </div>
            <div className="product-price">
              <div className="text">Prix fluctuables</div>
              <div className="price">{produit.prix}</div>
            </div>
            <button className="product-btn-louer blur-box">Louer</button>
          </div>
        ))}
      </div>

      <p className="closing">
        Rejoignez-nous dès aujourd'hui et profitez d'une expérience de jardinage
        intelligente et connectée avec WeatherPod!
      </p>
    </div>
  );
}