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
      this.editedTitle = this.task.title;
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
