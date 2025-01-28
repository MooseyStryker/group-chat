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






module.exports = app
