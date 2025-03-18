const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
dotenv.config();

const app = require('./app');

if (process.env.NODE_ENV === "development") {
  console.log("Application is running in development mode");
  app.use(morgan("dev"));
}


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

