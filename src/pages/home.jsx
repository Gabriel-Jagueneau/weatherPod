import React from 'react';
// Assurez-vous d'importer le nouveau fichier CSS futuriste

export default function HomeFuturistic() {
    return (
        <div className="page home">
            <section className="hero">
                <div className="top-container">
                    <h1>WeatherPod</h1>
                    <p>L'objet connecté indispensable pour ses plantes</p>
                    <svg viewBox="0 50 900 400" stroke="currentColor">
                        <defs>
                            <pattern id="image-fill" patternUnits="userSpaceOnUse" width="100%" height="100%" >
                                <image href="https://raw.githubusercontent.com/Gabriel-Jagueneau/weatherPod/refs/heads/main/storage/images/background/13283017-fougere-et-fond-de-feuilles-vertes-croissance-des-plantes-ou-fond-d-ecran-nature-arbre-d-ornement-pour-la-decoration-dans-les-tons-vintage-ou-bleu-beau-concept-naturel-gratuit-photo.jpg" 
                                    x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
                            </pattern>
                        </defs>
                        <path d="M0 296L18.8 307.7C37.7 319.3 75.3 342.7 112.8 334.8C150.3 327 187.7 288 225.2 271.7C262.7 255.3 300.3 261.7 337.8 271.8C375.3 282 412.7 296 450.2 310.2C487.7 324.3 525.3 338.7 562.8 339.3C600.3 340 637.7 327 675.2 319C712.7 311 750.3 308 787.8 312.3C825.3 316.7 862.7 328.3 881.3 334.2L900 340L900 0L881.3 0C862.7 0 825.3 0 787.8 0C750.3 0 712.7 0 675.2 0C637.7 0 600.3 0 562.8 0C525.3 0 487.7 0 450.2 0C412.7 0 375.3 0 337.8 0C300.3 0 262.7 0 225.2 0C187.7 0 150.3 0 112.8 0C75.3 0 37.7 0 18.8 0L0 0Z"></path>
                    </svg>
                </div>
                
            </section>
            <section className="presentation">
                <p>Presentation</p>
            </section>
            <section className="features">
                <p>Features</p>
            </section>
            <section className="founders">
                <p>Foundres</p>
            </section>
            <section className="shop">
                <p>Shop</p>
            </section>
        </div>
    );
}