// Importation de la fonction createApp depuis Vue pour créer une application Vue
import { createApp } from "vue";

// Importation du composant principal App.vue
import App from "./App.vue";

// Importation des styles CSS principaux de l'application
import "./assets/css/main.css";

// Création de l'application Vue en utilisant le composant principal App.vue
const app = createApp(App);

// Montage de l'application Vue sur l'élément avec l'id "app" dans le DOM
app.mount("#app");
