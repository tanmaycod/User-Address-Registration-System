const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Address = require('../models/Address');

router.post('/register', async (req, res) => {
    const { name, street, city, state, zip } = req.body;

    try {
        const user = new User({ name });
        await user.save();

        const address = new Address({
            user: user._id,
            street,
            city,
            state,
            zip
        });
        await address.save();

        res.status(201).json({ message: 'User and address created successfully', user, address });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user or address', error });
    }
});

module.exports = router;
