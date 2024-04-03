<template>
  <li>
    <div class="task-item" @click="startEditing">
      <input type="checkbox" v-model="isChecked" @click.stop>
      <span v-if="!editing" :class="{ 'completed': isChecked }">{{ task.title }}</span>
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
  name: "TaskItem",
  props: ["task"],
  data() {
    return {
      editing: false,
      editedTitle: this.task.title,
    };
  },
  computed: {
    isChecked: {
      get() {
        return this.task.completed;
      },
      set(value) {
        this.$emit('update', { ...this.task, completed: value });
      }
    }
  },
  methods: {
    startEditing() {
      this.editing = true;
    },
    saveEdit() {
      this.$emit('update', { ...this.task, title: this.editedTitle });
      this.editing = false;
    },
    removeTask() {
      this.$emit('remove');
    }
  }
};
</script>

<style scoped>
.task-item {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.task-item span {
  margin-left: 5px;
}

.edit-form input[type="text"] {
  flex: 1;
  padding: 5px;
}

.edit-form button {
  margin-left: 5px;
  background-color: transparent;
  border: none;
}

.remove-btn {
  background-color: transparent;
  border: none;
  color: #999;
  cursor: pointer;
}

.completed {
  text-decoration: line-through;
  color: #999;
}
</style>
