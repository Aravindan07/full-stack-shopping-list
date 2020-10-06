const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const config = require('config');

app.use(express.json()); // Replacement for bodyParser.json()

//DB config
const db = config.get('MongoURI');

//connect to mongo
mongoose
    .connect(db, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected...'))
    .catch((err) => console.log(err));

// Use Routes
app.use('/api/items', require('./routes/api/items'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started at port ${port}`));
