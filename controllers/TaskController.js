const Task = require("../modals/task");
const { validationResult } = require("express-validator");

exports.creatTaskUser = (req, res) => {
  const data = req.body;
  console.log(data);
  const userId = req.user._doc._id;
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Invalid data", errors });
  }
  const taks = new Task({
    ...data,
    userId,
  });
  taks
    .save()
    .then((result) => {
      return res.status(201).json({ message: "Task created" });
    })
    .catch((err) => {
      return res.status(400).json({ message: "Something goes wrong" });
    });
};

exports.getAdminTasks = (req, res) => {
  const { userId } = req.params;
  const task = Task.find({ userId });
  task
    .then((result) => {
      res.status(200).json({ result });
    })
    .catch((err) => {
      res.status(400).json({ message: "Tasks not found" });
    });
};

exports.getUserTasks = (req, res) => {
  const { assignedUserId } = req.params;
  const task = Task.find({ assignedUserId });
  task
    .then((result) => {
      res.status(200).json({ result });
    })
    .catch((err) => {
      res.status(400).json({ message: "Tasks not found" });
    });
};
exports.deleteTask = async (req, res) => {
  const taskId = req.params.taskId;
  Task.deleteOne({ _id: taskId })
    .then((deletedPost) => {
      return res.status(200).json({ message: "Task deleted successfully" });
    })
    .catch((error) => {
      return res.status(400).json({ message: "Failed to delete post" });
    });
};
exports.updateTask = (req, res) => {
  Task.findOne({ _id: req.body._id })
    .then((task) => {
      task.status = req.body.status;
      task.description = req.body.description;
      task.title = req.body.title;
      task.assignedUserId = req.body.assignedUserId;
      task
        .save()
        .then((result) => {
          res.status(200).json({ result });
        })
        .catch((err) => {
          res.status(400).json({ message: "Task update error" });
        });
    })
    .catch((err) => {
      res.status(400).json({ message: "Task not found" });
    });
};