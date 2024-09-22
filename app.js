const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://127.0.0.1:27017/userAddressDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

const User = mongoose.model('User', new mongoose.Schema({ name: String }));
const Address = mongoose.model('Address', new mongoose.Schema({
    street: String,
    city: String,
    state: String,
    zip: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/register', async (req, res) => {
    try {
        const { name, street, city, state, zip } = req.body;

        const user = new User({ name });
        await user.save();

        const address = new Address({ street, city, state, zip, user: user._id });
        await address.save();

        res.status(201).json({ message: 'User and address created successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
