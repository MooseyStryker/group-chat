const express = require('express')
require('express-async-errors')
const morgan = require('morgan')
const cors = require('cors')
const csurf = require('csurf')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const swaggerUi = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')

const environment = require('./config')
const isProduction = environment === 'production'

const app = express()
/*
    We want to switch morgan to combined before deploying
    Test the logging features, if not detailed enought, install winston along with morgan
    Add logging function to be used with every handler
*/
app.use(morgan('dev'));

app.use(cookieParser())
app.use(express.json())




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

// app.use(
//     csurf({
//         cookie:{
//             secure: isProduction,
//             sameSite: isProduction && "Lax", // strict, lax, none.
//             httpOnly: true
//         }
//     })
// )

const routes = require('./routes')
app.use(routes);

const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: "Community Site Coder's Corner",
        version: '1.0.0',
        description: 'Your API Documentation'
      },
      servers: [
        {
          url: 'http://localhost:8000',
          description: 'Development server'
        }
    ]
    },
    apis: ['./routes/**/**/*.js']  // Path to your route files
};

const swaggerDocs = swaggerJsDoc(swaggerOptions)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))



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
