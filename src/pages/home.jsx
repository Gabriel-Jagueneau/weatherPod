import React from 'react';

export default function Home({ isPageActive, goTo }) {

    return (
        <div className="page home">

            <div className="scroll-bubbles">
                <div className="bubble bubble1">
                    <div className="logo">calendar_month</div>
                    <div className="text">Un outil qui vous accompagne au quotidien</div>
                </div>
                <div className="bubble bubble2">
                    <div className="logo">design_services</div>
                    <div className="text">Un design épuré qui se fond dans votre décor</div>
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
                    <div className="title">Plintzy</div>
                    <p>Les plantes c'est EAZY !</p>
                    <svg viewBox="0 50 900 400" stroke="currentColor">
                        <defs>
                            <pattern id="image-fill" patternUnits="userSpaceOnUse" width="100%" height="100%" >
                                <image href="https://raw.githubusercontent.com/Gabriel-Jagueneau/plintzy/refs/heads/main/storage/images/background/background-top.png" 
                                    x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
                            </pattern>
                        </defs>
                        <path d="M0 296L18.8 307.7C37.7 319.3 75.3 342.7 112.8 334.8C150.3 327 187.7 288 225.2 271.7C262.7 255.3 300.3 261.7 337.8 271.8C375.3 282 412.7 296 450.2 310.2C487.7 324.3 525.3 338.7 562.8 339.3C600.3 340 637.7 327 675.2 319C712.7 311 750.3 308 787.8 312.3C825.3 316.7 862.7 328.3 881.3 334.2L900 340L900 0L881.3 0C862.7 0 825.3 0 787.8 0C750.3 0 712.7 0 675.2 0C637.7 0 600.3 0 562.8 0C525.3 0 487.7 0 450.2 0C412.7 0 375.3 0 337.8 0C300.3 0 262.7 0 225.2 0C187.7 0 150.3 0 112.8 0C75.3 0 37.7 0 18.8 0L0 0Z"></path>
                    </svg>
                </div>
                <div className="call-to-action">
                    <a className={`button ${isPageActive("products")}`} href="#products" onClick={() => goTo("products")}>
                        Decouvrir Maintenant
                    </a>
                </div>
                <div className="auto-carousel remove-scrollbar">
                    <div aria-hidden className="group-card">
                        <div className="card">
                            <img src="https://raw.githubusercontent.com/Gabriel-Jagueneau/plintzy/refs/heads/main/storage/images/logo/ubee-lab.png" alt=""/>
                        </div>
                        <div className="card">
                            <img src="https://raw.githubusercontent.com/Gabriel-Jagueneau/plintzy/refs/heads/main/storage/images/logo/logo-pepite-eca.png" alt=""/>
                        </div>
                        <div className="card">
                            <img src="https://raw.githubusercontent.com/Gabriel-Jagueneau/plintzy/refs/heads/main/storage/images/logo/logo-chaire-agrotic.png" alt=""/>
                        </div>
                        <div className="card">
                            <img src="https://raw.githubusercontent.com/Gabriel-Jagueneau/plintzy/refs/heads/main/storage/images/logo/logo_bsa.png" alt=""/>
                        </div>
                    </div>
                    <div aria-hidden className="group-card">
                        <div className="card">
                            <img src="https://raw.githubusercontent.com/Gabriel-Jagueneau/plintzy/refs/heads/main/storage/images/logo/ubee-lab.png" alt=""/>
                        </div>
                        <div className="card">
                            <img src="https://raw.githubusercontent.com/Gabriel-Jagueneau/plintzy/refs/heads/main/storage/images/logo/logo-pepite-eca.png" alt=""/>
                        </div>
                        <div className="card">
                            <img src="https://raw.githubusercontent.com/Gabriel-Jagueneau/plintzy/refs/heads/main/storage/images/logo/logo-chaire-agrotic.png" alt=""/>
                        </div>
                        <div className="card">
                            <img src="https://raw.githubusercontent.com/Gabriel-Jagueneau/plintzy/refs/heads/main/storage/images/logo/logo_bsa.png" alt=""/>
                        </div>
                    </div>
                </div>
            </section>

            <div className="transition-1">
                <h1>Un produit révolutionnaire</h1>
                <svg className="wave-fade" viewBox="0 0 900 600">
                    <defs>
                        <pattern id="image-fill-trans-1" patternUnits="userSpaceOnUse" width="100%" height="100%" >
                            <image href="https://raw.githubusercontent.com/Gabriel-Jagueneau/plintzy/refs/heads/main/storage/images/background/prop.jpeg" 
                                x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
                        </pattern>
                    </defs>
                    <path className="a" d="M0 55L12.5 58C25 61 50 67 75 68C100 69 125 65 150 65C175 65 200 69 225 68C250 67 275 61 300 54C325 47 350 39 375 41C400 43 425 55 450 58C475 61 500 55 525 49C550 43 575 37 600 34C625 31 650 31 675 34C700 37 725 43 750 47C775 51 800 53 825 56C850 59 875 63 887.5 65L900 67L900 0L887.5 0C875 0 850 0 825 0C800 0 775 0 750 0C725 0 700 0 675 0C650 0 625 0 600 0C575 0 550 0 525 0C500 0 475 0 450 0C425 0 400 0 375 0C350 0 325 0 300 0C275 0 250 0 225 0C200 0 175 0 150 0C125 0 100 0 75 0C50 0 25 0 12.5 0L0 0Z" fill="currentColor"/>
                    <path className="b" d="M0 199L12.5 203C25 207 50 215 75 207C100 199 125 175 150 169C175 163 200 175 225 186C250 197 275 207 300 205C325 203 350 189 375 186C400 183 425 191 450 203C475 215 500 231 525 216C550 201 575 155 600 149C625 143 650 177 675 189C700 201 725 191 750 180C775 169 800 157 825 160C850 163 875 181 887.5 190L900 199L900 65L887.5 63C875 61 850 57 825 54C800 51 775 49 750 45C725 41 700 35 675 32C650 29 625 29 600 32C575 35 550 41 525 47C500 53 475 59 450 56C425 53 400 41 375 39C350 37 325 45 300 52C275 59 250 65 225 66C200 67 175 63 150 63C125 63 100 67 75 66C50 65 25 59 12.5 56L0 53Z" fill="currentColor"/>
                    <path className="c" d="M0 247L12.5 252C25 257 50 267 75 257C100 247 125 217 150 207C175 197 200 207 225 221C250 235 275 253 300 252C325 251 350 231 375 223C400 215 425 219 450 231C475 243 500 263 525 252C550 241 575 199 600 194C625 189 650 221 675 231C700 241 725 229 750 215C775 201 800 185 825 189C850 193 875 217 887.5 229L900 241L900 197L887.5 188C875 179 850 161 825 158C800 155 775 167 750 178C725 189 700 199 675 187C650 175 625 141 600 147C575 153 550 199 525 214C500 229 475 213 450 201C425 189 400 181 375 184C350 187 325 201 300 203C275 205 250 195 225 184C200 173 175 161 150 167C125 173 100 197 75 205C50 213 25 205 12.5 201L0 197Z" fill="currentColor"/>
                    <path className="d" d="M0 295L12.5 303C25 311 50 327 75 320C100 313 125 283 150 277C175 271 200 289 225 309C250 329 275 351 300 357C325 363 350 353 375 338C400 323 425 303 450 303C475 303 500 323 525 323C550 323 575 303 600 303C625 303 650 323 675 326C700 329 725 315 750 299C775 283 800 265 825 266C850 267 875 287 887.5 297L900 307L900 239L887.5 227C875 215 850 191 825 187C800 183 775 199 750 213C725 227 700 239 675 229C650 219 625 187 600 192C575 197 550 239 525 250C500 261 475 241 450 229C425 217 400 213 375 221C350 229 325 249 300 250C275 251 250 233 225 219C200 205 175 195 150 205C125 215 100 245 75 255C50 265 25 255 12.5 250L0 245Z" fill="currentColor"/>
                    <path className="e" d="M0 373L12.5 375C25 377 50 381 75 373C100 365 125 345 150 343C175 341 200 357 225 374C250 391 275 409 300 412C325 415 350 403 375 389C400 375 425 359 450 357C475 355 500 367 525 366C550 365 575 351 600 357C625 363 650 389 675 390C700 391 725 367 750 349C775 331 800 319 825 320C850 321 875 335 887.5 342L900 349L900 305L887.5 295C875 285 850 265 825 264C800 263 775 281 750 297C725 313 700 327 675 324C650 321 625 301 600 301C575 301 550 321 525 321C500 321 475 301 450 301C425 301 400 321 375 336C350 351 325 361 300 355C275 349 250 327 225 307C200 287 175 269 150 275C125 281 100 311 75 318C50 325 25 309 12.5 301L0 293Z" fill="currentColor"/>
                    <path className="f" d="M0 427L12.5 428C25 429 50 431 75 425C100 419 125 405 150 405C175 405 200 419 225 431C250 443 275 453 300 454C325 455 350 447 375 438C400 429 425 419 450 418C475 417 500 425 525 422C550 419 575 405 600 411C625 417 650 443 675 445C700 447 725 425 750 403C775 381 800 359 825 360C850 361 875 385 887.5 397L900 409L900 347L887.5 340C875 333 850 319 825 318C800 317 775 329 750 347C725 365 700 389 675 388C650 387 625 361 600 355C575 349 550 363 525 364C500 365 475 353 450 355C425 357 400 373 375 387C350 401 325 413 300 410C275 407 250 389 225 372C200 355 175 339 150 341C125 343 100 363 75 371C50 379 25 375 12.5 373L0 371Z" fill="currentColor"/>
                    <path className="g" d="M0 553L12.5 556C25 559 50 565 75 566C100 567 125 563 150 563C175 563 200 567 225 566C250 565 275 559 300 557C325 555 350 557 375 556C400 555 425 551 450 551C475 551 500 555 525 559C550 563 575 567 600 569C625 571 650 571 675 567C700 563 725 555 750 553C775 551 800 555 825 556C850 557 875 555 887.5 554L900 553L900 407L887.5 395C875 383 850 359 825 358C800 357 775 379 750 401C725 423 700 445 675 443C650 441 625 415 600 409C575 403 550 417 525 420C500 423 475 415 450 416C425 417 400 427 375 436C350 445 325 453 300 452C275 451 250 441 225 429C200 417 175 403 150 403C125 403 100 417 75 423C50 429 25 427 12.5 426L0 425Z" fill="currentColor"/>
                    <path className="h" d="M0 601L12.5 601C25 601 50 601 75 601C100 601 125 601 150 601C175 601 200 601 225 601C250 601 275 601 300 601C325 601 350 601 375 601C400 601 425 601 450 601C475 601 500 601 525 601C550 601 575 601 600 601C625 601 650 601 675 601C700 601 725 601 750 601C775 601 800 601 825 601C850 601 875 601 887.5 601L900 601L900 551L887.5 552C875 553 850 555 825 554C800 553 775 549 750 551C725 553 700 561 675 565C650 569 625 569 600 567C575 565 550 561 525 557C500 553 475 549 450 549C425 549 400 553 375 554C350 555 325 553 300 555C275 557 250 563 225 564C200 565 175 561 150 561C125 561 100 565 75 564C50 563 25 557 12.5 554L0 551Z" fill="currentColor"/>
                </svg>
            </div>

            <section className="presentation">

                <div className="present-in-macbook">
                    <img className="device" src="https://raw.githubusercontent.com/Gabriel-Jagueneau/plintzy/refs/heads/main/storage/images/macbook.png" alt="macbook-image"/>
                    <img className="image" src="https://raw.githubusercontent.com/Gabriel-Jagueneau/plintzy/refs/heads/main/storage/images/background/Low-q_background.jpeg" alt="" />
                </div>
                
            </section>
            <section className="features">

                <div className="present-in-iPhone">
                    <img className="device" src="https://raw.githubusercontent.com/Gabriel-Jagueneau/plintzy/refs/heads/main/storage/images/iPhone.png" alt="iPhone-image"/>
                    <img className="image" src="https://raw.githubusercontent.com/Gabriel-Jagueneau/plintzy/refs/heads/main/storage/images/background/Low-q_background.jpeg" alt="" />
                </div>

            </section>
            <section className="founders">
                
                <div className="present-in-iPhone">
                    <img className="device" src="https://raw.githubusercontent.com/Gabriel-Jagueneau/plintzy/refs/heads/main/storage/images/iPhone.png" alt="iPhone-image"/>
                    <img className="image" src="https://raw.githubusercontent.com/Gabriel-Jagueneau/plintzy/refs/heads/main/storage/images/background/Low-q_background.jpeg" alt="" />
                </div>
                
            </section>
            <section className="shop">
                <p>Shop</p>
            </section>
        </div>
    );
}