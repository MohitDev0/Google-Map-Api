const express = require("express");
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require("cors");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Distance and Time API',
            version: '1.0.0',
            description: 'API for calculating distance and Time using Google Maps API',
        },
    },
    apis: ['index.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
// app.use('/distance', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/distance', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));


/**
 * @swagger
 * /find:
 *   get:
 *     summary: Get distance and time between two locations
 *     parameters:
 *       - in: query
 *         name: origin
 *         description: origin location
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: destination
 *         description: Destination location
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               distance: '100 km'
 *               time: '38 mins'
 */

app.get("/find", async (req, res) => {
    const origin = req.query.origin;
    const destination = req.query.destination;
    const apiKey = process.env.apikey;

    try {
        const fetchDistance = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}`);
        const data = await fetchDistance.json();
        const distance = data.rows[0].elements[0].distance.text;
        const time = data.rows[0].elements[0].duration.text;
        res.send({
            distance,
            time
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
