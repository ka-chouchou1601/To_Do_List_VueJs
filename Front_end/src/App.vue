<template>
  <div id="app">
    <task-list-component
      :tasks="tasks"
      @task-added="addTask"
      @task-removed="removeTask"
      @task-completed="completeTask"
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
      tasks: [
        {
          id: 1,
          title: "Learn Vue JS",
          completed: true,
        },
        {
          id: 2,
          title: "Watch Netflix",
          completed: true,
        },
        {
          id: 3,
          title: "Go shopping",
          completed: false,
        },
        {
          id: 4,
          title: "Learn guitar",
          completed: false,
        },
        {
          id: 5,
          title: "Send email",
          completed: false,
        },
      ],
    };
  },
  methods: {
    addTask(task) {
      this.tasks.push(task); // Ajoute la nouvelle tâche à la liste des tâches
    },
    removeTask(index) {
      this.tasks.splice(index, 1); // Supprime la tâche de la liste des tâches
    },
    completeTask(task) {
      task.completed = !task.completed; // Marque la tâche comme complétée ou non
    },
    clearCompleted() {
      this.tasks = this.tasks.filter(task => !task.completed); // Efface les tâches complétées
    },
    clearAll() {
      this.tasks = []; // Efface toutes les tâches
    },
  },
};
</script>

<style>
/* Vos styles CSS globaux ici */
</style>
