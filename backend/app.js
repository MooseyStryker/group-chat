const express = require('express')
require('express-async-errors')
const morgan = require('morgan')
const cors = require('cors')
const csurf = require('csurf')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')

const environment = require('./config')
const isProduction = environment === 'production'

const app = express()

app.use(morgan('dev'));

app.use(cookieParser())
app.use(express.json())

const routes = require('./routes')

// This prevents cross origin sharing attacks from occuring in development
// Production source with React and express server is hosted on Render.com
if (!isProduction){
    app.use(cors())
}

// Helmet allows set up of variety of headers to better secure this app
app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin"
    })
)

app.use(
    csurf({
        cookie:{
            secure: isProduction,
            sameSite: isProduction && "Lax", // strict, lax, none.
            httpOnly: true
        }
    })
)

app.use(routes);




// Error handling from sequelize error
const { ValidationError } = require('sequelize')

app.use((err, _req, _res,  next) => {
    if (err instanceof ValidationError){
        let errors = {}
        for (let error of err.errors){
            errors[error.path] = error.message
        }
        err.title = "Validation Error"
        err.errors = errors
    }
    next(err)
})




// General Error handlers in progress
// Placed at the end to prevent premature activation
app.use((_req,_res, next) => {
    const err = new Error("This resourse is not available")
    err.title = "Resource not found"
    err.errors = {
        message: "The requested resources couldn't be found"
    }
    err.status = 404
    next(err)
})



// Error formatted to response.body to JSON
app.use((err, _req, res, next) => {
    res.status(err.status || 500)
    console.error(err);
    res.json({
        title: err.title || "Server Error",
        message: err.message,
        errors: err.errors,
        stack: isProduction ? null : err.stack
    })
})


module.exports = app
