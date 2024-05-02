<template>
  <!-- Conteneur principal de la liste de tâches -->
  <div class="container">
    <div class="task">
      <!-- Titre de la liste -->
      <h1 class="task-title" @dblclick="startEditingTitle">
        <span v-if="!editingTitle">{{ displayTitle }}</span>
        <span v-else>
          <!-- Champ d'édition du titre -->
          <input
            type="text"
            v-model="editedTitle"
            @keyup.enter="saveEditTitle"
            @blur="saveEditTitle"
          />
        </span>
      </h1>

      <!-- Formulaire d'ajout de tâches -->
      <div class="form">
        <div class="task-input-group">
          <div class="add-task-container">
            <!-- Champ d'ajout de tâche -->
            <input
              class="add-task-input"
              type="text"
              placeholder="Ajouter une tâche"
              v-model="newTask"
              @keyup.enter="addTask"
            />
            <!-- Bouton d'ajout de tâche -->
            <button class="add-task-button" @click="addTask">
              <i class="fas fa-plus"></i>
            </button>
          </div>
          <!-- Champ de recherche de tâches -->
          <div class="search-container">
            <div class="search-wrapper">
              <input
                class="search-input"
                type="text"
                v-model="searchQuery"
                placeholder="Rechercher une tâche..."
              />
              <button class="search-button">
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Liste des tâches -->
      <div class="taskItems">
        <ul>
          <!-- Message si aucune tâche n'est présente -->
          <li v-if="filteredTasks.length === 0" class="empty-task">
            Ajoute une tâche à ta liste
          </li>
          <!-- Transition d'apparition des tâches -->
          <transition-group name="fade" tag="div">
            <!-- Affichage des tâches -->
            <task-item
              v-for="(task, index) in filteredTasks"
              :key="task.id"
              :task="task"
              @update="updateTask(index, $event)"
              @remove="removeTask(index)"
            ></task-item>
          </transition-group>
        </ul>
      </div>

      <!-- Boutons de suppression de tâches -->
      <div class="clearBtns">
        <button @click="clearCompleted">Supprimer les tâches terminées</button>
        <button @click="clearAll">Supprimer toutes les tâches</button>
      </div>

      <!-- Compteur de tâches en attente -->
      <div class="pendingTasks">
        <span v-if="incomplete === 0">Aucune tâche en attente.</span>
        <span v-else>Tâches en attente: {{ incomplete }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import TaskItem from "./Task-item.vue";

const apiUrl = "http://localhost:8000/api/tasks"; // URL de base du serveur

export default {
  name: "TaskListComponent",
  props: ["tasks", "listTitle"], // Propriétés de la liste
  components: {
    TaskItem,
  },
  data() {
    return {
      newTask: "", // Nouvelle tâche
      searchQuery: "", // Requête de recherche
      editingTitle: false, // Indicateur d'édition du titre
      editedTitle: "", // Titre édité
      displayTitle: this.listTitle, // Titre affiché
    };
  },
  computed: {
    // Méthode calculée pour déterminer le nombre de tâches incomplètes
    incomplete() {
      // Filtrer les tâches qui ne sont pas complétées et retourner la longueur du tableau résultant
      return this.tasks.filter((task) => !task.completed).length;
    },
    // Méthode calculée pour filtrer les tâches en fonction de la requête de recherche
    filteredTasks() {
      // Convertir la requête de recherche et les titres des tâches en minuscules pour une recherche insensible à la casse
      return this.tasks.filter((task) =>
        task.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
 methods: {
    // Méthode pour récupérer les tâches depuis le serveur
    fetchTasks() {
      // Appel à l'API pour récupérer les tâches
      axios
        .get(apiUrl)
        // Traitement de la réponse
        .then((response) => {
          // Assignation des données de la réponse aux tâches de l'application
          this.tasks = response.data;
        })
        // Gestion des erreurs
        .catch((error) => {
          // Affichage de l'erreur dans la console
          console.error("Erreur lors de la récupération des tâches :", error);
        });
    },
    // Méthode pour ajouter une nouvelle tâche
    addTask() {
      // Vérification si le champ d'ajout de tâche n'est pas vide
      if (this.newTask.trim() !== "") {
        // Appel à l'API pour ajouter une nouvelle tâche
        axios
          .post(apiUrl, { title: this.newTask.trim() })
          // Traitement de la réponse
          .then((response) => {
            // Émission de l'événement indiquant l'ajout de la tâche
            this.$emit("tâche ajoutée", response.data);
            // Réinitialisation du champ d'ajout de tâche
            this.newTask = "";
          })
          // Gestion des erreurs
          .catch((error) => {
            // Affichage de l'erreur dans la console
            console.error("Erreur lors de l'ajout de la tâche :", error);
          });
      }
    },
    // Méthode pour supprimer les tâches terminées
    clearCompleted() {
      // Appel à l'API pour supprimer les tâches terminées
      axios
        .delete(apiUrl)
        // Traitement de la réponse
        .then((response) => {
          // Émission de l'événement indiquant la suppression des tâches terminées
          this.$emit("effacer terminé");
        })
        // Gestion des erreurs
        .catch((error) => {
          // Affichage de l'erreur dans la console
          console.error("Erreur lors de la suppression des tâches terminées :", error);
        });
    },
    // Méthode pour supprimer toutes les tâches
    clearAll() {
      // Appel à l'API pour supprimer toutes les tâches
      axios
        .delete(apiUrl)
        // Traitement de la réponse
        .then((response) => {
          // Émission de l'événement indiquant la suppression de toutes les tâches
          this.$emit("effacer tout");
        })
        // Gestion des erreurs
        .catch((error) => {
          // Affichage de l'erreur dans la console
          console.error("Erreur lors de la suppression de toutes les tâches :", error);
        });
    },
    // Méthode pour mettre à jour une tâche
    updateTask(index, updatedTask) {
      // Appel à l'API pour mettre à jour une tâche
      axios
        .put(`${apiUrl}/${updatedTask.id}`, updatedTask)
        // Traitement de la réponse
        .then((response) => {
          // Émission de l'événement indiquant la mise à jour de la tâche
          this.$emit("tâche mise à jour", { index, task: response.data });
        })
        // Gestion des erreurs
        .catch((error) => {
          // Affichage de l'erreur dans la console
          console.error("Erreur lors de la mise à jour de la tâche :", error);
        });
    },
    // Méthode pour supprimer une tâche
    removeTask(index) {
      // Récupération de l'identifiant de la tâche à supprimer
      const taskId = this.filteredTasks[index].id;
      // Appel à l'API pour supprimer la tâche
      axios
        .delete(`${apiUrl}/${taskId}`)
        // Traitement de la réponse
        .then((response) => {
          // Émission de l'événement indiquant la suppression de la tâche
          this.$emit("tâche supprimée", index);
        })
        // Gestion des erreurs
        .catch((error) => {
          // Affichage de l'erreur dans la console
          console.error("Erreur lors de la suppression de la tâche :", error);
        });
    },
    // Méthode pour commencer l'édition du titre
    startEditingTitle() {
      // Activation du mode édition du titre
      this.editingTitle = true;
      // Initialisation du titre édité avec le titre actuel
      this.editedTitle = this.listTitle;
    },
    // Méthode pour sauvegarder le titre édité
    saveEditTitle() {
      // Vérification si le titre édité n'est pas vide
      if (this.editedTitle.trim() !== "") {
        // Émission de l'événement indiquant le titre édité
        this.$emit("titre modifié", this.editedTitle);
        // Mise à jour du titre affiché avec le titre édité
        this.displayTitle = this.editedTitle;
      }
      // Désactivation du mode édition du titre
      this.editingTitle = false;
    },
  },
  // Méthode exécutée lors du montage du composant
  mounted() {
    // Récupération des tâches depuis le serveur
    this.fetchTasks();
  },
};
</script>


<style>
/* Styles CSS personnalisés */
.task-title {
  font-size: 36px;
  text-align: center;
  color: #bb9a87;
  margin-bottom: 30px;
  cursor: pointer; /* Curseur indiquant que le titre est éditable */
}

.task-title input {
  font-size: 36px;
  text-align: center;
  color: #bb9a87;
  background: transparent;
  border: none;
  outline: none;
  width: auto;
}
</style>
