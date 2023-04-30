const User = require('../modals/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { secret } = require("../config/config");
const { validationResult } = require("express-validator");

const generateAccessToken = (user) => {
     const payload = { ...user };
     return jwt.sign(payload, secret, { expiresIn: "24h" });
};

exports.signUp = (req, res) => {
     const data = req.body;
     const { password } = data;
     const errors = validationResult(req.body);
     if (!errors.isEmpty()) {
          return res.status(400).json({ message: "Invalid data", errors });
     }
     User.findOne({ email: data.email })
          .then(async (user) => {
               if (user) {
                    return res.status(400).json({ message: "Email already exists" });
               } else {
                    const hashPassword = await bcrypt.hashSync(password, 5);
                    const user = new User({
                         ...data, password: hashPassword
                    });
                    user
                         .save()
                         .then((result) => {
                              res.status(201).json({ message: "User created." });
                         })
                         .catch((error) => {
                              console.log(error);
                              res.status(500).json({ message: "Error creating user" });
                         });
               }
          })
          .catch((error) => {
               console.log(error);
               res.status(500).json({ message: "Error finding user" });
          });
};


exports.signIn = async (req, res) => {
     const { email, password } = req.body;
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          return res.status(400).json({ message: 'Invalid data', errors });
     }
     const user = await User.findOne({ email })
          .then(async (user) => {
               if (!user) {
                    return res.status(401).json({ message: 'Invalid email or password' });
               }
               const validPassword = await bcrypt.compareSync(password, user.password);
               if (validPassword) {
                    const token = generateAccessToken(user);
                    return res.status(200).json({ user, token });
               }
          }).catch((error) => {
               return res.status(401).json({ message: 'Invalid email or password' });
          });

};

exports.getUser = async (req, res) => {
     try {
          const token = req.headers.authentication;
          const decodedData = jwt.verify(token, secret);
          const user = decodedData._doc;
          res.status(200).json(user);
     } catch (error) {
          console.log(error);
          return res.status(401).json({ message: 'Invalid email or password' });
     }
};

exports.getUsers = async (req, res) => {
     const users = User.find({});
     users
          .then((result) => {
               res.status(200).json({ result });
          })
          .catch((err) => {
               res.status(400).json({ message: "Posts not found" });
          });
};
