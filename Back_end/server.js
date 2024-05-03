const express = require("express"); // Importation du framework Express
const app = express(); // Création de l'application Express
const PORT = 8000; // Port sur lequel le serveur écoute
const cors = require("cors"); // Middleware pour gérer les requêtes CORS

app.use(express.json()); // Middleware pour parser les requêtes JSON
app.use(cors()); // Utilisation du middleware CORS pour permettre les requêtes cross-origin

let tasks = []; // Initialisation de la variable tasks comme un tableau vide pour stocker les tâches

// Route pour gérer les requêtes concernant les tâches
app
  .route("/api/tasks")
  // GET request pour récupérer toutes les tâches
  .get((req, res) => {
    res.json(tasks); // Renvoie toutes les tâches sous forme de JSON
  })
  // POST request pour ajouter une nouvelle tâche
  .post((req, res) => {
    const { title } = req.body; // Récupère le titre de la tâche à partir du corps de la requête
    if (!title) {
      return res.status(400).json({ error: "Title is required" }); // Renvoie une erreur si le titre est manquant
    }

    const newTask = {
      // Crée un nouvel objet représentant la tâche
      id: Date.now(), // ID généré à partir du timestamp actuel
      title, // Titre de la tâche
      completed: false, // Indique si la tâche est complétée ou non
    };
    tasks.push(newTask); // Ajoute la nouvelle tâche au tableau des tâches
    res.status(201).json(newTask); // Renvoie la nouvelle tâche avec le code de statut 201 (Created)
  })
  // DELETE request pour supprimer les tâches complétées
  .delete((req, res) => {
    const completedTasks = tasks.filter((task) => task.completed); // Filtre les tâches complétées
    tasks = tasks.filter((task) => !task.completed); // Supprime les tâches complétées du tableau des tâches
    res.json(completedTasks); // Renvoie les tâches complétées qui ont été supprimées
  });

// PUT request pour mettre à jour une tâche spécifique
app.put("/api/tasks/:id", (req, res) => {
  const { id } = req.params; // Récupère l'ID de la tâche à mettre à jour à partir des paramètres de la requête
  const { title, completed } = req.body; // Récupère les nouvelles valeurs du titre et de l'état de complétion à partir du corps de la requête

  const taskIndex = tasks.findIndex((task) => task.id === parseInt(id)); // Trouve l'index de la tâche dans le tableau des tâches
  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" }); // Renvoie une erreur si la tâche n'est pas trouvée
  }

  const updatedTask = { ...tasks[taskIndex], title, completed }; // Crée un nouvel objet représentant la tâche mise à jour
  tasks[taskIndex] = updatedTask; // Remplace l'ancienne tâche par la nouvelle dans le tableau des tâches
  res.json(updatedTask); // Renvoie la tâche mise à jour
});

// DELETE request pour supprimer une tâche spécifique
app.delete("/api/tasks/:id", (req, res) => {
  const { id } = req.params; // Récupère l'ID de la tâche à supprimer à partir des paramètres de la requête

  const taskIndex = tasks.findIndex((task) => task.id === parseInt(id)); // Trouve l'index de la tâche dans le tableau des tâches
  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" }); // Renvoie une erreur si la tâche n'est pas trouvée
  }

  const deletedTask = tasks.splice(taskIndex, 1); // Supprime la tâche du tableau des tâches
  res.json(deletedTask); // Renvoie la tâche supprimée
});

// Écoute du serveur sur le port spécifié
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Affiche un message lorsque le serveur démarre
});
