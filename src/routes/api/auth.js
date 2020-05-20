const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../models/User');

router.post('/signup', async (req, res) => {
    const {
        displayName,
        nickname,
        age,
        password,
        passwordConf
    } = req.body;

    console.log(req.body);
    if (password !== passwordConf) {
        //bunu duzelt
    }
    try {
        let user = User.find({
            nickname
        });
        if (user.nickname) {
            console.log("nereye gidiyon oc");
            res.status(401).send('Mnaaa');
        } else {
            let user = new User();
            user.nickname = nickname;
            user.displayName = displayName;
            user.age = age;
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user._id
                }
            }

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                (err, token) => {
                    if (err) throw err;
                    res.json({
                        token
                    });
                }
            );
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/login', async (req, res) => {
    const {
        nickname,
        password,
    } = req.body;

    try {
        let user = await User.findOne({
            nickname
        });
        if (!user) {
            return res
                .status(400)
                .json({
                    errors: [{
                        msg: 'Invalid Credentials'
                    }]
                });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res
                .status(400)
                .json({
                    errors: [{
                        msg: 'Invalid Credentials'
                    }]
                });
        }

        const payload = {
            user: {
                id: user._id
            }
        };

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            (err, token) => {
                if (err) throw err;
                res.json({
                    token
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }



})

module.exports = router;
