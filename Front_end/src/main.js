import { createApp } from "vue"; // Importation de la fonction createApp à partir de Vue
import App from "./App.vue"; // Importation du composant App.vue
import "./assets/css/main.css"; // Importation des styles CSS

const app = createApp(App); // Création de l'application Vue
app.mount("#app"); // Montage de l'application sur l'élément avec l'ID "app" dans le DOM
