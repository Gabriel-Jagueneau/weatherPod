const jsonResponse = await fetch(`https://raw.githubusercontent.com/Gabriel-Jagueneau/weatherPod/refs/heads/main/storage/data/products.json`);
const products = await jsonResponse.json();

export default function Products() {
    return (
      <div className="page products">
        <h1>Nos Produits</h1>
        <p className="intro">
          La page produits servira à présenter nos différents packs de location de Capteurs & Station.
        </p>
  
        <div className="product-grid">
          {products.map((p, index) => (
            <div key={index} className="product-card">
              <h2>{p.name}</h2>
              <br />
              <p>{p.description}</p>
              <br />
              <div className="product-btn">
              <button className="product-btn-louer">Louer</button>
                <span className="product-btn-price">{p.prix}</span>
              </div>
            </div>
          ))}
        </div>
  
        <p className="closing">
          Rejoignez-nous dès aujourd'hui et profitez d'une expérience de jardinage intelligente et connectée avec WeatherPod!
        </p>
      </div>
    );
}