<template>
  <div class="container">
    <div class="task">
      <h1 class="task-title" @dblclick="startEditingTitle">
        <span v-if="!editingTitle">{{ listTitle }}</span>
        <span v-else>
          <input type="text" v-model="editedTitle" @keyup.enter="saveEditTitle" @blur="saveEditTitle">
        </span>
      </h1>
      <div class="form">
        <div class="task-input-group">
          <input class="add-task-input" type="text" placeholder="Ajouter une tâche" v-model="newTask" @keyup.enter="addTask" />
          <button class="add-task-button" @click="addTask"><i class="fas fa-plus"></i></button>
        </div>
        <input class="search-input" type="text" v-model="searchQuery" placeholder="Rechercher une tâche...">
      </div>
      <div class="taskItems">
        <ul>
          <li v-if="filteredTasks.length === 0" class="empty-task">Aucune tâche en cours.</li>
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
      <div class="clearBtns">
        <button @click="clearCompleted">Supprimer les tâches terminées</button>
        <button @click="clearAll">Supprimer toutes les tâches</button>
      </div>
      <div class="pendingTasks">
        <span v-if="incomplete === 0">Aucune tâche en attente.</span>
        <span v-else>Tâches en attente: {{ incomplete }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import TaskItem from "./Task-item.vue";

const apiUrl = 'http://localhost:8080/api/tasks'; // Base URL for server

export default {
  name: "TaskListComponent",
  props: ['tasks', 'listTitle'],
  components: {
    TaskItem,
  },
  data() {
    return {
      newTask: "",
      searchQuery: "",
      editingTitle: false,
      editedTitle: "",
    };
  },
  computed: {
    incomplete() {
      return this.tasks.filter(task => !task.completed).length;
    },
    filteredTasks() {
      return this.tasks.filter(task => task.title.toLowerCase().includes(this.searchQuery.toLowerCase()));
    },
  },
  methods: {
    addTask() {
      if (this.newTask.trim() !== "") {
        axios.post(apiUrl, { title: this.newTask.trim() })
          .then(response => {
            this.$emit('task-added', response.data);
            this.newTask = ""; // Clear input after successful addition
          })
          .catch(error => {
            console.error('Error adding task:', error);
          });
      }
    },
    clearCompleted() {
      axios.delete(apiUrl)
        .then(response => {
          this.$emit('clear-completed');
        })
        .catch(error => {
          console.error('Error clearing completed tasks:', error);
        });
    },
    clearAll() {
      axios.delete(apiUrl)
        .then(response => {
          this.$emit('clear-all');
        })
        .catch(error => {
          console.error('Error clearing all tasks:', error);
        });
    },
    updateTask(index, updatedTask) {
      axios.put(`${apiUrl}/${updatedTask.id}`, updatedTask)
        .then(response => {
          this.$emit('task-updated', { index, task: response.data });
        })
        .catch(error => {
          console.error('Error updating task:', error);
        });
    },
    removeTask(index) {
      const taskId = this.filteredTasks[index].id;
      axios.delete(`${apiUrl}/${taskId}`)
        .then(response => {
          this.$emit('task-removed', index);
        })
        .catch(error => {
          console.error('Error removing task:', error);
        });
    },
    startEditingTitle() {
      this.editingTitle = true;
      this.editedTitle = this.listTitle;
    },
    saveEditTitle() {
      this.$emit('title-edited', this.editedTitle);
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
  color: #BB9A87;
  margin-bottom: 30px;
  cursor: pointer; /* Ajoutez un curseur indiquant que le titre est éditable */
}

.task-title input {
  font-size: 36px;
  text-align: center;
  color: #BB9A87;
  background: transparent;
  border: none;
  outline: none;
  width: auto;
}
</style>
