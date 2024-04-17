<template>
  <div class="container">
    <div class="task">
      <div class="form">
        <h2 @dblclick="startEditingTitle">
          <span v-if="!editingTitle">{{ listTitle }}</span>
          <span v-else>
            <input type="text" v-model="editedTitle" @keyup.enter="saveEditTitle" @blur="saveEditTitle">
          </span>
        </h2>
        <input v-if="!editingTitle" type="text" placeholder="Ajouter une tâche" v-model="newTask" @keyup.enter="addTask" />
        <button v-if="!editingTitle" @click="addTask"><i class="fas fa-plus"></i></button>
      </div>
      <input type="text" v-model="searchQuery" placeholder="Rechercher une tâche...">
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
import axios from 'axios'; // Import Axios for HTTP requests
import TaskItem from "./Task-item.vue";

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
        axios.post('/api/tasks', { title: this.newTask.trim() })
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
      axios.delete('/api/tasks/completed')
        .then(response => {
          this.$emit('clear-completed');
        })
        .catch(error => {
          console.error('Error clearing completed tasks:', error);
        });
    },
    clearAll() {
      axios.delete('/api/tasks/all')
        .then(response => {
          this.$emit('clear-all');
        })
        .catch(error => {
          console.error('Error clearing all tasks:', error);
        });
    },
    updateTask(index, updatedTask) {
      axios.put(`/api/tasks/${updatedTask.id}`, updatedTask)
        .then(response => {
          this.$emit('task-updated', { index, task: response.data });
        })
        .catch(error => {
          console.error('Error updating task:', error);
        });
    },
    removeTask(index) {
      const taskId = this.filteredTasks[index].id;
      axios.delete(`/api/tasks/${taskId}`)
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



<style scoped>
.container {
  position: relative;
}

.task {
  background-color: #fff; /* White background color for the task area */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Box shadow for a subtle elevation effect */
}

.form {
  margin-bottom: 20px;
}

.form input[type="text"], .form button {
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  margin-right: 10px;
}

.form button {
  background-color: #3498db; /* Blue color for the add task button */
  color: white;
  cursor: pointer;
}

.form button:hover {
  background-color: #2980b9; /* Darker blue color on hover */
}

input[type="text"] {
  width: 200px;
}

/* Additional CSS styles for the search input */
input[type="text"][placeholder="Rechercher une tâche..."] {
  margin-top: 10px;
  padding: 10px;
  width: 100%;
  border-radius: 5px;
  border: 1px solid #ccc;
}

/* Additional CSS styles for the pending tasks section */
.pendingTasks {
  margin-top: 20px;
  font-weight: bold;
}
</style>
