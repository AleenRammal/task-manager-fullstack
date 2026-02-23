
const router = require("express").Router();
const prisma = require("../prisma");

console.log("✅ tasks routes loaded, time:", new Date().toISOString());

// GET all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch tasks." });
  }
});

// GET single task by ID
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    // ✅ handle invalid id
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid task id." });
    }

    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch task." });
  }
});

// CREATE a new task
router.post("/", async (req, res) => {
  try {
    const { taskName, description, assignedUser, dueDate, priority, status } =
      req.body;

    // ✅ Basic validation
    if (!taskName || !assignedUser || !dueDate) {
      return res.status(400).json({
        error: "taskName, assignedUser, and dueDate are required.",
      });
    }

    const task = await prisma.task.create({
      data: {
        taskName,
        description: description ?? null,
        assignedUser,
        dueDate: new Date(dueDate),
        priority,
        status,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create task." });
  }
});

// UPDATE task by ID
router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    // ✅ handle invalid id
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid task id." });
    }

    const { taskName, description, assignedUser, dueDate, priority, status } =
      req.body;

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        taskName,
        description,
        assignedUser,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        priority,
        status,
      },
    });

    res.json(updatedTask);
  } catch (error) {
    console.error(error);

    // ✅ if task doesn't exist, Prisma throws an error — handle it nicely
    res.status(500).json({ error: "Failed to update task." });
  }
});

// DELETE task by ID
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    // ✅ handle invalid id
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid task id." });
    }

    await prisma.task.delete({
      where: { id },
    });

    res.json({ message: "Task deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete task." });
  }
});

module.exports = router;