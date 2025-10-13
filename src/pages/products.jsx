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
        {products.map((p, index) => (
          <div key={index} className="product-card">
            <h2>{p.name}</h2>
            <br />
            <p>{p.description}</p>
            <div className="product-divider">
              {Object.entries(p.package || {}).map(([key, value]) => {
                if (key === "capteurs" && value != 0) return <li key={key}>{value} Capteur{value > 1 ? "s" : ""}</li>;
                if (key === "station" && value != 0) return <li key={key}>{value} Station{value > 1 ? "s" : ""}</li>;
                if (key === "pass") return <li key={key}>{value} App Pass</li>;
                return null;
              })}
            </div>
            <br />
            <br />
            <br />
            <span className="product-price">
              <div className="text">Price may change</div>
              <div className="price">{p.prix}</div>
            </span>
            <br />
            <div className="product-btn">
              <button className="product-btn-louer">Louer</button>
              
            </div>
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