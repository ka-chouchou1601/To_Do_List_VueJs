const express = require("express");
const app = express();
const PORT = 8080;
const cors = require("cors");

app.use(express.json());
app.use(cors());

let tasks = []; // Initialize tasks array as an empty array

app
  .route("/api/tasks")
  .get((req, res) => {
    res.json(tasks);
  })
  .post((req, res) => {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const newTask = {
      id: Date.now(),
      title,
      completed: false,
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
  })
  .delete((req, res) => {
    const completedTasks = tasks.filter((task) => task.completed);
    tasks = tasks.filter((task) => !task.completed);
    res.json(completedTasks);
  });

app.put("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  const taskIndex = tasks.findIndex((task) => task.id === parseInt(id));
  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  const updatedTask = { ...tasks[taskIndex], title, completed };
  tasks[taskIndex] = updatedTask;
  res.json(updatedTask);
});

app.delete("/api/tasks/:id", (req, res) => {
  const { id } = req.params;

  const taskIndex = tasks.findIndex((task) => task.id === parseInt(id));
  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  const deletedTask = tasks.splice(taskIndex, 1);
  res.json(deletedTask);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
