const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../../middleware/auth');
// User Model
const User = require('../../models/user');

//@route   POST api/auth
//@desc    Auth user
//@access  Public(for now)

router.post('/', (req, res, next) => {
    const { email, password } = req.body;

    //Simple validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' }); // 400 - bad request
    }

    //Check for existing user
    User.findOne({ email: email }).then((user) => {
        if (!user) {
            return res.status(400).json({ message: 'User does not exists' });
        }

        //Validate password

        bcrypt.compare(password, user.password).then((isMatch) => {
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid Credentials' });
            }

            jwt.sign(
                { id: user.id },
                config.get('JwtSecretKey'),
                { expiresIn: '1h' },
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

//@route   GET api/auth/USER
//@desc    Get user data
//@access  Private

router.get('/user', auth, (req, res, next) => {
    User.findById(req.user.id)
        .select('-password')
        .then((user) => {
            return res.json(user);
        })
        .catch((err) => {
            return res.json(err);
        });
});

module.exports = router;
