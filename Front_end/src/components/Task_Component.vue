<template>
  <div class="container">
    <div class="task">
      <!-- Titre de la tâche -->
      <h1 class="task-title" @dblclick="startEditingTitle">
        <span v-if="!editingTitle">{{ displayTitle }}</span>
        <span v-else>
          <!-- Ici on a Champ d'édition du titre -->
          <input
            type="text"
            v-model="editedTitle"
            @keyup.enter="saveEditTitle"
            @blur="saveEditTitle"
          />
        </span>
      </h1>

      <div class="form">
        <div class="task-input-group">
          <div class="add-task-container">
            <!-- Ici on a Champ pour ajouter une nouvelle tâche -->
            <input
              class="add-task-input"
              type="text"
              placeholder="Ajouter une tâche"
              v-model="newTask"
              @keyup.enter="addTask"
            />
            <button class="add-task-button" @click="addTask">
              <i class="fas fa-plus"></i>
            </button>
          </div>
          <div class="search-container">
            <div class="search-wrapper">
              <!-- Ici c'est la partie du Champ de recherche -->
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

      <!--La  Liste des tâches -->
      <div class="taskItems">
        <ul>
          <!--Le  Message qui est aficher si aucune tâche n'est présente -->
          <li v-if="filteredTasks.length === 0" class="empty-task">
            Ajoute une tâche à ta liste
          </li>
          <!-- La Boucle à travers les tâches -->
          <transition-group name="fade" tag="div">
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

      <!-- Boutons pour effacer les tâches -->
      <div class="clearBtns">
        <button @click="clearCompleted">Supprimer les tâches terminées</button>
        <button @click="clearAll">Supprimer toutes les tâches</button>
      </div>

      <!-- Affichage du nombre de tâches en attente -->
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

const apiUrl = "http://localhost:8000/api/tasks"; // URL de base pour le serveur

export default {
  name: "TaskListComponent",
  props: ["tasks", "listTitle"], // ce sont Propriétés reçues par le composant
  components: {
    TaskItem,
  },
  data() {
    return {
      newTask: "", // Nouvelle tâche à ajouter
      searchQuery: "", // Terme de recherche pour filtrer les tâches
      editingTitle: false, // Indique si le titre est en cours d'édition
      editedTitle: "", // Titre édité
      displayTitle: this.listTitle, // Titre à afficher
    };
  },
  computed: {
    incomplete() {
      return this.tasks.filter((task) => !task.completed).length; // Nombre de tâches incomplètes
    },
    filteredTasks() {
      return this.tasks.filter((task) =>
        task.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      ); // Tâches filtrées en fonction du terme de recherche
    },
  },
  methods: {
    addTask() {
      // Ajoute une nouvelle tâche
      if (this.newTask.trim() !== "") {
        axios
          .post(apiUrl, { title: this.newTask.trim() })
          .then((response) => {
            this.$emit("task-added", response.data);
            this.newTask = ""; // Efface l'entrée après l'ajout réussi
          })
          .catch((error) => {
            console.error("Error adding task:", error);
          });
      }
    },
    clearCompleted() {
      // Efface les tâches terminées
      axios
        .delete(apiUrl)
        .then((response) => {
          this.$emit("clear-completed");
        })
        .catch((error) => {
          console.error("Error clearing completed tasks:", error);
        });
    },
    clearAll() {
      // Efface toutes les tâches
      axios
        .delete(apiUrl)
        .then((response) => {
          this.$emit("clear-all");
        })
        .catch((error) => {
          console.error("Error clearing all tasks:", error);
        });
    },
    updateTask(index, updatedTask) {
      // Mettre à jour une tâche existante
      axios
        .put(`${apiUrl}/${updatedTask.id}`, updatedTask)
        .then((response) => {
          this.$emit("task-updated", { index, task: response.data });
        })
        .catch((error) => {
          console.error("Error updating task:", error);
        });
    },
    removeTask(index) {
      // Supprime une tâche
      const taskId = this.filteredTasks[index].id;
      axios
        .delete(`${apiUrl}/${taskId}`)
        .then((response) => {
          this.$emit("task-removed", index);
        })
        .catch((error) => {
          console.error("Error removing task:", error);
        });
    },
    startEditingTitle() {
      // Démarre l'édition du titre
      this.editingTitle = true;
      this.editedTitle = this.listTitle; // Met editedTitle à listTitle quand l'édition commence
    },
    saveEditTitle() {
      // Sauvegarde le titre édité
      if (this.editedTitle.trim() !== "") {
        this.$emit("title-edited", this.editedTitle); // Émet le titre édité
        this.displayTitle = this.editedTitle; // Met à jour displayTitle avec le titre édité
      }
      this.editingTitle = false;
    },
  },
};
</script>

<style>
/* Ajoutez votre style CSS personnalisé ici */
.task-title {
  font-size: 36px;
  text-align: center;
  color: #bb9a87;
  margin-bottom: 30px;
  cursor: pointer; /* Indique que le titre est éditable */
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
