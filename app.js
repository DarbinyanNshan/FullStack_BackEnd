require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const bodyParser = require("body-parser");
const { signUp, signIn, getUser, getUsers } = require("./controllers/AuthController");
const { deleteTask, getUserTasks, updateTask } = require("./controllers/TaskController");
const DB = process.env.DB;
const PORT = process.env.PORT || 3001;
const { getAdminTasks } = require("./controllers/TaskController");
const { authMiddleware } = require("./middleware/auth");
const { checkUserRoleAdmin } = require("./middleware/admin");
const { creatTaskUser } = require("./controllers/TaskController");
const { createTask } = require("./validations/taskvalidation");
const { createUser } = require("./validations/uservalidation");
const app = express();
const server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin: "*" }));

mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to DB"))
  .catch((error) => console.log(error));

app.post("/sign-up-user",
        createUser,
        authMiddleware,
        checkUserRoleAdmin,
        signUp
    );
app.post("/sign-in", 
        signIn
);
app.get("/users",
        getUsers
);
app.get("/me", 
        authMiddleware,
        getUser
);
app.put("/update-task", 
         authMiddleware, 
         updateTask
);
app.post("/add-task",
         createTask,
         authMiddleware,
         creatTaskUser
);
app.delete("/delete-task/:taskId", 
        authMiddleware,
        deleteTask
);
app.get("/tasks/admin/:userId",
        authMiddleware,
        getAdminTasks
);
app.get("/tasks/user/:assignedUserId",
        authMiddleware,
        getUserTasks);

server.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log(`${PORT} Server started`);
});