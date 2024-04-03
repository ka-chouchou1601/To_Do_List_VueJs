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
        this.$emit('task-added', {
          id: Date.now(),
          title: this.newTask.trim(),
          completed: false,
        });
        this.newTask = "";
      }
    },
    clearCompleted() {
      this.$emit('clear-completed');
    },
    clearAll() {
      this.$emit('clear-all');
    },
    updateTask(index, updatedTask) {
      this.$emit('task-updated', { index, task: updatedTask });
    },
    removeTask(index) {
      this.$emit('task-removed', index);
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
/* Your specific CSS styles here */
</style>
