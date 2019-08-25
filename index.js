const path = require('path')
const express = require('express')
const bodyparser = require('body-parser')
const swaggerJSDoc = require('swagger-jsdoc')

const app = express()
const API_PORT = process.env.API_PORT || 3000

const swaggerDefinition = {
  info: {
    title: 'Animals',
    version: '1.0.0',
    description: 'All things animlas',
  },
  host: 'localhost:3000',
  basePath: '/',
}

const swaggerSpec = swaggerJSDoc({
  swaggerDefinition,
  apis: [path.resolve(__dirname, 'index.js')]
})

app.use(bodyparser.json({
  strict: false,
}))

app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})

app.get('/docs', (req, res) => {
  res.sendFile(path.join(__dirname, 'redoc.html'));
})

const animals = [
  'panda', 'racoon', 'python',
]

/**
 * @swagger
 * /list:
 *   get:
 *     summary: List all the animals
 *     description: Returns a list of all the animals, optionally sorted
 *     tags:
 *       - animals
 *     parameters:
 *       - in: query
 *         name: sort
 *         type: string
 *         required: false
 *         enum:
 *           - yes
 *           - no
 *     responses:
 *       200:
 *         description: List of animals
 *         schema:
 *           type: object
 *           properties:
 *             animals:
 *               type: array
 *               description: all the animals
 *               items:
 *                 type: string
 */
app.get('/list', (req, res) => {
  return res.json(req.query.sort === 'yes' ? Array.from(animals).sort() : animals) // why is .sort inplace 😠
})

/**
 * @swagger
 * /add:
 *   post:
 *     summary: Add more animal
 *     description: Add animals to the list
 *     tags:
 *       - animals
  *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               animals:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Adds the animals in body
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               default: 'Added'
 */
app.post('/add', (req, res) => {
  animals.push(...req.body.animals)
  return res.json({
    message: 'Added',
  })
})

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`))

// Ref: https://dev.to/akshendra/generating-documentation-on-the-fly-in-express-2652
