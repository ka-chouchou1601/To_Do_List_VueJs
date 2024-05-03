<template>
  <div id="app">
    <!-- Composant TaskListComponent pour afficher la liste des tâches -->
    <task-list-component
      :tasks="tasks"
      listTitle="My To do"
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
  name: "App",
  components: {
    TaskListComponent,
  },
  data() {
    return {
      tasks: [], // Liste des tâches
    };
  },
  methods: {
    addTask(task) {
      // Ajoute une nouvelle tâche à la liste
      this.tasks.push(task);
    },
    removeTask(index) {
      // Supprime une tâche de la liste
      this.tasks.splice(index, 1);
    },
    updateTask({ index, task }) {
      // Met à jour une tâche dans la liste
      this.tasks[index] = task;
    },
    clearCompleted() {
      // Supprime toutes les tâches complétées de la liste
      this.tasks = this.tasks.filter(task => !task.completed);
    },
    clearAll() {
      // Supprime toutes les tâches de la liste
      this.tasks = [];
    },
  },
};
</script>
