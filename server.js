const express = require("express");
const mongoose = require("mongoose");
const { mongoKey } = require('./config/keys');

// app
const app = express();

// DATABASE CONFIG
// Connect to Mongo
const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}
mongoose
    .connect(mongoKey, options)
    .then(() => console.log(`MongoDB Connected...`))
    .catch(err => console.log(err));
// END DATABASE CONFIG

// Use Routes middleware
app.use('/api/user', require('./routes/user'));

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
