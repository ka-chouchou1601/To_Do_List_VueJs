<!-- App.vue -->
<template>
  <div id="app">
    <task-list-component
      :tasks="tasks"
      listTitle="My Task List"
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
      tasks: [
        { id: 1, title: "Task 1", completed: false },
        { id: 2, title: "Task 2", completed: true },
        { id: 3, title: "Task 3", completed: false },
      ],
    };
  },
  methods: {
    addTask(task) {
      this.tasks.push(task);
    },
    removeTask(index) {
      this.tasks.splice(index, 1);
    },
    updateTask({ index, task }) {
      this.tasks[index] = task;
    },
    clearCompleted() {
      this.tasks = this.tasks.filter(task => !task.completed);
    },
    clearAll() {
      this.tasks = [];
    },
  },
};
</script>


