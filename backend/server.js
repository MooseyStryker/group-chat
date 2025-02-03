const express = require('express')
const swaggerUi = require('swagger-ui-express')
const fs = require('fs')


const swaggerDocument = JSON.parse(fs.readFileSync('./swagger.json', 'utf8'))

const app = express()

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.get('/users', (req, res) => {
    res.json({
        id: 1,
        name: "fake name"
    })
})

const port = 3333

app.listen(port, () => {
    console.log(`Server operational, running at ${port}`)
    console.log(`Swagger UI available at http://localhost:${port}/api-docs`)
})
