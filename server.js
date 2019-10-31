const express = require("express");
const mongoose = require("mongoose");
const morgan = require('morgan');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// app
const app = express();

// Middlewares
// Allow the app to accept JSON on req.body || replaces body-parser package
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(expressValidator());

// DATABASE CONFIG
// Connect to Mongo
const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}
mongoose
    .connect(process.env.MONGO_KEY, options)
    .then(() => console.log(`MongoDB Connected...`))
    .catch(err => console.log(err));
// END DATABASE CONFIG

// Use Routes middleware
app.use('/api/auth', require("./routes/auth"));
app.use('/api/user', require("./routes/user"));
app.use('/api/category', require("./routes/category"));
app.use('/api/product', require("./routes/product"));

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
