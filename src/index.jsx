import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app.jsx";

// On cible la div #root dans index.html
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);