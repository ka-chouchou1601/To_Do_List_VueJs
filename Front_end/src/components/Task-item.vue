<template>
  <li>
    <div class="task-item">
      <input type="checkbox" v-model="isChecked" @click.stop>
      <span v-if="!editing" :class="{ 'completed': isChecked }" @click="startEditing">{{ task.title }}</span>
      <div v-else class="edit-form">
        <input type="text" v-model="editedTitle" @keyup.enter="saveEdit">
        <button @click="saveEdit"><i class="far fa-save"></i></button>
      </div>
    </div>
    <button class="remove-btn" @click="removeTask"><i class="far fa-trash-alt"></i></button>
  </li>
</template>

<script>
export default {
  name: "TaskItem", // Nom du composant
  
  props: ["task"], // Propriétés passées au composant
  data() {
    return {
      editing: false, // Indicateur d'édition du titre
      editedTitle: this.task.title, // Titre édité de la tâche
    };
  },
  computed: {
    isChecked: { // Propriété calculée pour vérifier si la tâche est cochée
      get() {
        return this.task.completed; // Renvoie l'état de complétion de la tâche
      },
      set(value) { // Setter pour mettre à jour l'état de complétion de la tâche
        this.$emit('update', { ...this.task, completed: value }); // Émet un événement avec la tâche mise à jour
      }
    }
  },
  methods: {
    startEditing() { // Méthode pour commencer l'édition du titre
      this.editing = true; // Active le mode édition
      this.editedTitle = this.task.title; // Initialise le titre édité avec le titre actuel de la tâche
    },
    saveEdit() { // Méthode pour sauvegarder le titre édité
      this.$emit('update', { ...this.task, title: this.editedTitle }); // Émet un événement avec le titre édité
      this.editing = false; // Désactive le mode édition
    },
    removeTask() { // Méthode pour supprimer la tâche
      this.$emit('remove'); // Émet un événement de suppression de la tâche
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
