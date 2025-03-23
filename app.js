const express = require('express')
const morgan = require('morgan')

const app = express()

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/error.controller');
const tourRouter = require('./routes/tour.route');
const userRouter = require('./routes/user.route');
const { jwtGuard } = require("./middlewares/jwtguard.middleware");

app.use(express.json());
app.use(morgan('dev'))
app.use(express.static(`${__dirname}/public`));

app.use((req, res,next) => {
    
    console.log(
        "Pass via middleware ... :D", 
        // req.headers.authorization
    );
    next();
})

app.get('/', (req, res) => res.status(200).send("Hello world"))


app.use('/api/v1/tours', jwtGuard, tourRouter)
app.use('/api/v1/users', userRouter)

app.all('*', (req, res, next) => {
    // const err = new Error(`Can't find ${req.originalUrl} on the server`)
    // err.status = "FAIL";
    // err.statusCode = 404;

    // next(err);

    next(new AppError(`Can't find ${req.originalUrl} on the server`, 404))
})

//  global error handler middleware
app.use(globalErrorHandler)

module.exports = app;