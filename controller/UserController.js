const User = require('../modals/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator')

exports.signUp = (req, res) => {

     const data = req.body;
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() })
     }


     User.findOne({ email: data.email })
          .then(async (user) => {
               if (user) {
                    return res.status(400).json({ message: 'Email already exists' })
               } else {
                    const encryptedPassword = await bcrypt.hash(data.password, 10)
                    const userData = {
                         ...data,
                         password: encryptedPassword,
                         image: `/images/${req.file.filename}`
                    }
                    const user = new User(userData);
                    user.save()
                         .then((result) => {
                              console.log(result);
                              res.status(201).json(result)
                         })
                         .catch((error) => {
                              console.log(error);
                              res.status(500).json({ messege: 'Error creating user' })
                         });
               }
          })
}

exports.signIn = async (req, res) => {
     const errors = validationResult(req.body);
     if (!errors.isEmpty()) {
          return res.status(400).json({ message: "Invalid data", errors });
     }
     const data = req.body;
     const { password } = data;

     User.findOne({ email: data.email })
          .then(async (user) => {
               if (!user) {
                    return res.status(400).json({ message: "Email already exists" });
               }
               const isPasswordCorrect = await bcrypt.compare(password, user.password)
               if (isPasswordCorrect) {
                    const token = jwt.sign(
                         {
                              id: user._id,
                              email: user.email
                         },
                         process.env.TOKEN_KEY,
                         { expiresIn: '2h' },
                    );

                    return res.status(200).json({ user, token })
               }
          })
          .catch((error) => {
               console.log(error);
               res.status(500).json({ message: "Error finding user" });
          });
};

exports.me = async (req, res) => {
     try {
          User.findOne({ email: req.user.email })
               .then((user) => {
                    res.status(200).json({ user })
               })
               .catch(() => {
                    res.status(500).json({ message: 'Error finding user' })
               })
     } catch (err) {
          return res.status(401).send('Invalid Token')
     }

}
exports.getUsers = async (req, res) => {
     try {
          User.find()
               .then((users) => {
                    res.status(200).json({ users })
                    console.log(users);
               })
               .catch(() => {
                    res.status(500).json({ message: 'Error finding user' })
               })
     } catch (err) {
          return res.status(401).send('Invalid Token')
     }

}

exports.DeletePosts = async (req, res) => {
     console.log(req.body.id);
     User.deleteOne({ _id: req.body.id })
          .then((user) =>
               res.status(200).json({ user })
          )
          .catch(() => {
               res.status(500).json({ message: 'Error Delete post' })
          })

}
