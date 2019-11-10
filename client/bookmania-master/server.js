const express = require("express");
const mongoose = require("mongoose");
const morgan = require('morgan');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

// init app
const app = express();

// DATABASE
const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true, // comment this out when this error occurs: MongoTimeoutError: Server selection timed out after 30000 ms || But be aware that things can not work properly
    useFindAndModify: false
}
mongoose
    .connect(process.env.MONGO_KEY, options)
    .then(() => console.log(`MongoDB Connected...`))
    .catch(err => console.log(err));
// END DATABASE

// MIDDLEWARES
app.use(express.json()); //n1
app.use(morgan('dev'));
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());
// routes
app.use('/api/auth', require("./routes/auth"));
app.use('/api/user', require("./routes/user"));
app.use('/api/category', require("./routes/category"));
app.use('/api/product', require("./routes/product"));
app.use('/api/braintree', require("./routes/braintree"));
app.use('/api/order', require("./routes/order"));
// END MIDDLEWARES

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// NOTES
//n1 Allow the app to accept JSON on req.body || replaces body-parser package