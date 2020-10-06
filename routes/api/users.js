const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

// User Model
const User = require('../../models/user');

//@route   POST api/users
//@desc    Register new user
//@access  Public(for now)

router.post('/', (req, res, next) => {
    const { name, email, password } = req.body;

    //Simple validation
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' }); // 400 - bad request
    }

    //Check for existing user
    User.findOne({ email: email }).then((user) => {
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({
            name,
            email,
            password,
        });

        //Create salt and hash

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) {
                    throw new Error(err);
                }
                newUser.password = hash;
                newUser.save().then((user) => {
                    jwt.sign(
                        { id: user.id },
                        config.get('JwtSecretKey'),
                        { expiresIn: 3600 },
                        (err, token) => {
                            if (err) {
                                throw err;
                            }
                            res.json({
                                token,
                                user: {
                                    id: user.id,
                                    name: user.name,
                                    email: user.email,
                                },
                            });
                        }
                    );
                });
            });
        });
    });
});

module.exports = router;
