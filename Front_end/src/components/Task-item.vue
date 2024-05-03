<template>
  <li>
    <div class="task-item">
      <!-- Checkbox pour marquer la tâche comme terminée -->
      <input type="checkbox" v-model="isChecked" @click.stop>
      <!-- Titre de la tâche -->
      <span v-if="!editing" :class="{ 'completed': isChecked }" @click="startEditing">{{ task.title }}</span>
      <!-- Formulaire d'édition du titre -->
      <div v-else class="edit-form">
        <input type="text" v-model="editedTitle" @keyup.enter="saveEdit">
        <button @click="saveEdit"><i class="far fa-save"></i></button>
      </div>
    </div>
    <!-- Bouton pour supprimer la tâche -->
    <button class="remove-btn" @click="removeTask"><i class="far fa-trash-alt"></i></button>
  </li>
</template>

<script>
export default {
  name: "TaskItem",
  props: ["task"], // Propriété de la tâche
  data() {
    return {
      editing: false, // Indique si la tâche est en cours d'édition
      editedTitle: this.task.title, // Titre édité
    };
  },
  computed: {
    isChecked: {
      get() {
        return this.task.completed; // Obtient l'état de complétion de la tâche
      },
      set(value) {
        this.$emit('update', { ...this.task, completed: value }); // Émet un événement pour mettre à jour l'état de complétion de la tâche
      }
    }
  },
  methods: {
    startEditing() {
      this.editing = true; // Démarre l'édition de la tâche
      this.editedTitle = this.task.title; // Initialise le titre édité avec le titre actuel de la tâche
    },
    saveEdit() {
      this.$emit('update', { ...this.task, title: this.editedTitle }); // Émet un événement pour sauvegarder les modifications du titre
      this.editing = false; // Arrête l'édition de la tâche
    },
    removeTask() {
      this.$emit('remove'); // Émet un événement pour supprimer la tâche
    }
  }
};
</script>

<style scoped>
.task-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.completed {
  text-decoration: line-through; 
  color: #888; 
}

.edit-form {
  display: flex;
  align-items: center;
}

.edit-form input {
  flex: 1;
  margin-right: 10px;
}

.remove-btn {
  margin-left: 10px;
  padding: 5px;
  cursor: pointer;
}
</style>
