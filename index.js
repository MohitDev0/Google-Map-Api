const readline = require("readline-sync");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
require('dotenv').config();
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require("cors");
const { log } = require("console");

app.use(express.json());
app.use(cors());

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Distance and Time API',
            version: '1.0.0',
            description: 'API for calculating distance using Google Maps API',
        },
        servers: [
            {
                url: 'http://localhost:5000/'
            }
        ]
    },
    apis: ['index.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/distance', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


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
 *                  example:
 *                        distance: '100 km'
 *                        time: '38 mins'
 */

app.get("/find", async (req, res) => {
    // access the location from body or use default location which in this case hansi and hisar
    const origin = req.query.origin;
    const destination = req.query.destination;
    const apikey = process.env.apikey;
    // fetch google map api
    const fetchDistance = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apikey}`)
    // convert data into json format
    const data = await fetchDistance.json();
    // get location and time
    const distance = data.rows[0].elements[0].distance.text;
    const time = data.rows[0].elements[0].duration.text;
    res.send({
        distance,
        time
    });
})


app.listen(PORT, () => {
    console.log("connected");
})