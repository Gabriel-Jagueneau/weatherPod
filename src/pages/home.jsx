import React from 'react';

export default function Home({ isPageActive, goTo }) {

    return (
        <div className="page home">

            <div className="scroll-bubbles">
                <div className="bubble bubble1">
                    <div className="logo">calendar_month</div>
                    <div className="text">Un outil qui vous suit au quotidien</div>
                </div>
                <div className="bubble bubble2">
                    <div className="logo">design_services</div>
                    <div className="text">Un design épuré qui se fond dans votre decors</div>
                </div>
                <div className="bubble bubble3">
                    <div className="logo">settings_applications</div>
                    <div className="text">Une application fluide et simple d'utilisation</div>
                </div>
                <div className="bubble bubble4">
                    <div className="logo">lightbulb_2</div>
                    <div className="text">Un produit innovant breveté</div>
                </div>
            </div>

            <section className="hero">
                <div className="top-container">
                    <div className="title">WeatherPod</div>
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
                <div className="call-to-action">
                    <p>L'objet connecté indispensable pour vos plantes.</p>
                    <a className={`button ${isPageActive("products")}`} href="#products" onClick={() => goTo("products")}>
                        Decouvrir Maintenant
                    </a>
                </div>
            </section>
            <section className="presentation">

                <div className="present-in-macbook">
                    <img className="device" src="https://raw.githubusercontent.com/Gabriel-Jagueneau/weatherPod/refs/heads/main/storage/images/macbook.png" alt="macbook-image"/>
                    <img className="image" src="https://raw.githubusercontent.com/Gabriel-Jagueneau/weatherPod/refs/heads/main/storage/images/background/28efb1394876b5ab7708a986a93292d5_upscayl_4x_upscayl-standard-4x.png" alt="" />
                </div>
                
            </section>
            <section className="features">
                <div className="present-in-iPhone">
                    <img className="device" src="https://raw.githubusercontent.com/Gabriel-Jagueneau/weatherPod/refs/heads/main/storage/images/iPhone.png" alt="iPhone-image"/>
                    <img className="image" src="https://raw.githubusercontent.com/Gabriel-Jagueneau/weatherPod/refs/heads/main/storage/images/background/28efb1394876b5ab7708a986a93292d5.jpeg" alt="" />
                </div>
            </section>
            <section className="founders">
                <p>Founders</p>
            </section>
            <section className="shop">
                <p>Shop</p>
            </section>
        </div>
    );
}