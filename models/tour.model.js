const mongoose = require('mongoose');


const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour must have a name'],
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'Tour must have price']
  }
});

const Tour = mongoose.model('Tour', tourSchema);

// const testTour = new Tour({
//   name: "Hello chika chika",
//   rating: 5.0,
//   price: 500
// });

// testTour.save()
// .then(() => { console.log("Data Saved.") })
// .catch((err) => console.log(err));


module.exports = Tour;