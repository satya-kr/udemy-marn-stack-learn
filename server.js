const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './.env' });

const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI).then((r) => {
  console.log(`MongoDb connected with DATABASE:${r.connection.name}`)
}).catch((err) => {
  console.log(err);
});

// try {
//   await mongoose.connect(process.env.MONGO_URI)
// } catch(err) {
//   console.log(err);
// }

app.listen(port, () => {
  console.log(`App running on port ${port}... ${process.env.MONGO_URI}`);
});