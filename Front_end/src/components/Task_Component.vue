<template>
  <div class="container">
    <div class="task">
      <div class="title">
        <h1> To Do List</h1>
      </div>
      <div class="form">
        <input
          type="text"
          placeholder="New Task"
          v-model="newTask"
          @keyup.enter="addTask"
        />
        <button @click="addTask"><i class="fas fa-plus"></i></button>
      </div>
      <div class="taskItems">
        <ul>
          <li v-if="tasks.length === 0" class="empty-task">No tasks yet.</li>
          <task-item
            v-for="(task, index) in tasks"
            :key="task.id"
            :task="task"
            @remove="removeTask(index)"
            @complete="completeTask(task)"
          ></task-item>
        </ul>
      </div>
      <div class="clearBtns">
        <button @click="clearCompleted">Clear completed</button>
        <button @click="clearAll">Clear all</button>
      </div>
      <div class="pendingTasks">
        <span v-if="incomplete === 0">No pending tasks.</span>
        <span v-else>Pending Tasks: {{ incomplete }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import TaskItem from "./Task-item.vue";

export default {
  name: "TaskListComponent",
  props: ['tasks'],
  components: {
    TaskItem,
  },
  data() {
    return {
      newTask: "",
    };
  },
  computed: {
    incomplete() {
      return this.tasks.filter(this.inProgress).length;
    },
  },
  methods: {
    addTask() {
      if (this.newTask) {
        this.$emit('task-added', {
          id: Date.now(),
          title: this.newTask,
          completed: false,
        });
        this.newTask = "";
      }
    },
    inProgress(task) {
      return !this.isCompleted(task);
    },
    isCompleted(task) {
      return task.completed;
    },
    clearCompleted() {
      this.$emit('clear-completed');
    },
    clearAll() {
      this.$emit('clear-all');
    },
    completeTask(task) {
      this.$emit('task-completed', task);
    },
    removeTask(index) {
      this.$emit('task-removed', index);
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
}

.task {
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
}

.title h1 {
  margin: 0;
  font-size: 24px;
}

.form {
  margin-top: 20px;
}

.form input[type="text"] {
  padding: 8px;
  width: calc(100% - 40px);
  border-radius: 5px;
  border: 1px solid #ccc;
}

.form button {
  padding: 8px;
  margin-left: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.taskItems ul {
  list-style: none;
  padding: 0;
}

.clearBtns button {
  padding: 8px 20px;
  margin-right: 10px;
  background-color: #dc3545;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.pendingTasks span {
  font-weight: bold;
}

.empty-task {
  color: #999;
  font-style: italic;
}
</style>
