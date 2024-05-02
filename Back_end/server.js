const express = require("express"); // Importation du framework Express
const app = express(); // Création d'une instance d'Express
const PORT = 8000; // Port sur lequel le serveur va écouter
const cors = require("cors"); // Middleware pour gérer les requêtes CORS

app.use(express.json()); // Middleware pour parser les requêtes au format JSON
app.use(cors()); // Utilisation du middleware CORS pour permettre les requêtes depuis différents domaines

let tasks = []; // Initialisation du tableau des tâches comme un tableau vide

app
  .route("/api/tasks") // Définition de la route pour les opérations CRUD sur les tâches
  .get((req, res) => {
    // Gestion de la requête GET pour récupérer toutes les tâches
    res.json(tasks); // Réponse avec le tableau des tâches au format JSON
  })
  .post((req, res) => {
    // Gestion de la requête POST pour ajouter une nouvelle tâche
    const { title } = req.body; // Extraction du titre de la tâche depuis le corps de la requête
    if (!title) {
      // Vérification si le titre est fourni
      return res.status(400).json({ error: "Oops, Le titre est obligattoire" }); // Réponse avec un code d'erreur 400 si le titre est manquant
    }

    const newTask = {
      // Création d'un nouvel objet représentant la tâche
      id: Date.now(), // Identifiant unique basé sur le timestamp actuel
      title, // Titre de la tâche
      completed: false, // État de complétion initial à faux
    };
    tasks.push(newTask); // Ajout de la nouvelle tâche au tableau des tâches
    res.status(201).json(newTask); // Réponse avec un code de succès 201 et les détails de la nouvelle tâche ajoutée
  })
  .delete((req, res) => {
    // Gestion de la requête DELETE pour supprimer les tâches complétées
    const completedTasks = tasks.filter((task) => task.completed); // Filtrage des tâches complétées
    tasks = tasks.filter((task) => !task.completed); // Filtrage des tâches non complétées
    res.json(completedTasks); // Réponse avec les tâches complétées supprimées au format JSON
  });

app.put("/api/tasks/:id", (req, res) => {
  // Gestion de la requête PUT pour mettre à jour une tâche spécifique
  const { id } = req.params; // Récupération de l'identifiant de la tâche à mettre à jour depuis les paramètres de la requête
  const { title, completed } = req.body; // Extraction des nouveaux détails de la tâche depuis le corps de la requête

  const taskIndex = tasks.findIndex((task) => task.id === parseInt(id)); // Recherche de l'index de la tâche à mettre à jour dans le tableau des tâches
  if (taskIndex === -1) {
    // Vérification si la tâche n'est pas trouvée
    return res.status(404).json({ error: "Tâche non trouvée!!!" }); // Réponse avec un code d'erreur 404 si la tâche n'est pas trouvée
  }

  const updatedTask = { ...tasks[taskIndex], title, completed }; // Création d'un nouvel objet représentant la tâche mise à jour
  tasks[taskIndex] = updatedTask; // Mise à jour de la tâche dans le tableau des tâches
  res.json(updatedTask); // Réponse avec les détails de la tâche mise à jour au format JSON
});

app.delete("/api/tasks/:id", (req, res) => {
  // Gestion de la requête DELETE pour supprimer une tâche spécifique
  const { id } = req.params; // Récupération de l'identifiant de la tâche à supprimer depuis les paramètres de la requête

  const taskIndex = tasks.findIndex((task) => task.id === parseInt(id)); // Recherche de l'index de la tâche à supprimer dans le tableau des tâches
  if (taskIndex === -1) {
    // Vérification si la tâche n'est pas trouvée
    return res.status(404).json({ error: "Tâche non trouvée!!!" }); // Réponse avec un code d'erreur 404 si la tâche n'est pas trouvée
  }

  const deletedTask = tasks.splice(taskIndex, 1); // Suppression de la tâche du tableau des tâches
  res.json(deletedTask); // Réponse avec les détails de la tâche supprimée au format JSON
});

app.listen(PORT, () => {
  // Démarrage du serveur et écoute des connexions sur le port spécifié
  console.log(`Le serveur fonctionne sur le port" ${PORT}`); // Affichage d'un message pour indiquer que le serveur est en cours d'exécution
});
