const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "File Upload API",
            version: "1.0.0",
            description: "API for uploading and downloading files",
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
    },

    apis: ["./server/server.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
