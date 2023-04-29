require('dotenv').config()
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const cors = require('cors');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const file = require('./middleware/file');
const {
  HOST,
  PORT,
  DB
} = require('./constants');
const { 
  signIn,
  signUp, 
  me,
  getUsers,
  DeletePosts, 
} = require('./controller/UserController');



app.use(express.static('public'))
const verifyToken = require('./middleware/auth');
const { 
  creatTask, getTasks 
} = require('./controller/TaskController');
const { createUserSignIn } = require('./validations/signin');
const { createUserSignUp } = require('./validations/signup');


console.log(DB);
mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connetcted to DB'))
  .catch((error) => console.log(error))

app.use(express.json())
app.use(cors({
  origin: '*'
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))




app.get('/', (req, res) => {
  res.end('Hello World')
})

app.post('/signin',
          createUserSignIn,
          signIn
)
app.post('/add-user',
          createUserSignUp,
          file.single("file"),
          signUp
)
app.get('/me',
          me
)
app.post('/creat-task',
          creatTask
)
app.get('/users/:userId/tasks',
          verifyToken,
          getTasks
)
app.get('/get-users',
          getUsers
)
app.put('/delete-users',
            DeletePosts
)



server.listen(PORT, () => {
  console.log(`App listening on port http://${HOST}:${PORT}`)
})