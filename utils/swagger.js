const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Your API Title",
    description: "API documentation description",
  },
  host: "localhost:5000",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = [
    "../routes/userRoutes.js",
  "../routes/notesRoute.js",
  "../routes/projectRoute.js",
  "../routes/uploadRoutes.js"
];

// swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
//   require("../index");
// });