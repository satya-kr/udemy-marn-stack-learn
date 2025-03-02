const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require("../../models/tour.model")

mongoose.connect("mongodb+srv://root:0000@nestmongocluster.apbup.mongodb.net/express-graphql?retryWrites=true&w=majority&appName=NestMongoCluster").then((r) => {
  console.log(`MongoDb connected with DATABASE:${r.connection.name}`)
}).catch((err) => {
  console.log(err);
});

// read file

// Read the JSON file and parse it
const toursData = JSON.parse(fs.readFileSync('tours-simple.json', 'utf-8'));

// Remove 'id' from each tour
const tours = toursData.map(({ id, ...rest }) => rest);

const getAll = async () => {
    const all = await Tour.find()
    console.log(all)
} 

const importData = async () => {
    try {
        await Tour.create(tours);
        console.log("DATA SAVED")
    } catch(err) {
        console.log(err)
    }
}

const deleteAllData = async () => {
    try {
        await Tour.deleteMany()
        console.log("DATA DELETED")
    } catch(err) {
        console.log(err)
    }
}

// console.log(tours);

// deleteAllData();
// importData();
// getAll();