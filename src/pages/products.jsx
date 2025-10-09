export default function Products() {
    const products = [
      {
        name: "WeatherPod Home",
        prix: "3.99€/mois",
        description:
          "Ce pack vient avec: 1 Capteur et un pass Classic d'accès à l'application mobile WeatherPod sur android et iOS. Le meilleur pour découvrir nos services et l'application.",
      },
      {
        name: "WeatherPod Outdoor",
        prix: "11.99€/mois",
        description:
          "Ce pack vient avec: 4 Capteurs et un pass Pro d'accès à l'application mobile WeatherPod sur android et iOS. Idéal pour les jardins.",
      },
      {
        name: "WeatherPod Station Pro",
        prix: "27.99€/mois",
        description:
          "Ce pack vient avec: 8 Capteurs, 1 Station Pro et un pass Extreme d'accès à l'application mobile WeatherPod sur android et iOS. Idéal pour les jardins.",
      },
    ];
  
    return (
      <div className="page products">
        <h1>Nos Packs de Produits</h1>
        <p className="intro">
          Découvrez notre gamme de produits innovants conçus pour vous offrir les meilleures solutions pour entretenir votre jardin et/ou plantes à la Maison.
          <br /><br />
          Les produits ne sont pas achetables mais à Louer avec un abonnement mensuel. s'elevant à des charges personnalisées selon le package choisi.
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
          Chaque pack inclut la maintenance des capteurs et de la station météo, ainsi que les mises à jour logicielles régulières pour garantir une performance optimale.
          Rejoignez-nous dès aujourd'hui et profitez d'une expérience de jardinage intelligente et connectée avec WeatherPod!
        </p>
      </div>
    );
}