const mongoose = require('mongoose');
const dotenv = require('dotenv');
const process = require('node:process');
const app = require('./app');

dotenv.config({ path: './.env' });

process.on('uncaughtException', err => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down ...");
  console.log(err);
  process.exit(1);
})

const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI).then((r) => {
  console.log(`MongoDb connected with DATABASE:${r.connection.name}`)
});


const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log("UNHANDLED EXCEPTION! 💥 Shutting down ...");
  console.log(err.name, "=>", err.message);
  server.close(() => {
    process.exit(1);
  });
});

// console.log(x)