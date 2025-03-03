const express = require('express')
const morgan = require('morgan')
const app = express()

const tourRouter = require('./routes/tour.route');
const userRouter = require('./routes/user.route');

app.use(express.json());
app.use(morgan('dev'))
app.use(express.static(`${__dirname}/public`))
app.use((req, res,next) => {
    console.log("Pass via middleware ... :D");
    next();
})

app.get('/', (req, res) => res.status(200).send("Hello world"))


app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

app.all('*', (req, res, next) => {
    res.status(404).json({
        status: "FAIL",
        message: `Can't find ${req.originalUrl} on the server`
    });
})


module.exports = app;