<template>
  <!-- Conteneur principal de l'application -->
  <div id="app">
    <!-- Utilisation du composant TaskListComponent pour afficher la liste des tâches -->
    <task-list-component
      :tasks="tasks"
      listTitle="My To do list"
      @task-added="addTask"
      @task-removed="removeTask"
      @task-updated="updateTask"
      @clear-completed="clearCompleted"
      @clear-all="clearAll"
    ></task-list-component>
  </div>
</template>

<script>
import TaskListComponent from "./components/Task_Component.vue";

export default {
  // Nom du composant principal
  name: "App",
  components: {
    // Import du composant TaskListComponent
    TaskListComponent,
  },
  data() {
    return {
      // Initialisation des tâches en tant que tableau vide
      tasks: [],
    };
  },
  methods: {
    // Méthode pour ajouter une tâche à la liste
    addTask(task) {
      this.tasks.push(task);
    },
    // Méthode pour supprimer une tâche de la liste
    removeTask(index) {
      this.tasks.splice(index, 1);
    },
    // Méthode pour mettre à jour une tâche dans la liste
    updateTask({ index, task }) {
      this.tasks[index] = task;
    },
    // Méthode pour effacer les tâches complétées de la liste
    clearCompleted() {
      this.tasks = this.tasks.filter(task => !task.completed);
    },
    // Méthode pour effacer toutes les tâches de la liste
    clearAll() {
      this.tasks = [];
    },
  },
};
</script>
