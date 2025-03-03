const mongoose = require('mongoose');
const slugify = require('slugify')
const validator = require('validator');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour must have a name'],
    unique: true,
    trim: true,
    maxlength: [200, 'max title limit is 200'],
    validate: [validator.isAlpha, 'tour onlu contains chars']
  },
  duration: {
    type: Number,
    // required: [true, 'Tour must have duration'],
    validate: {
      validator: function(val) {
        return val < this.price
      },
      message: "discount should be less then price"
    }
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'Tour must have a group size']
  },
  difficulty: {
    type: String,
    required: [true, 'tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: "select e m d"
    }, 
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [0, 'min rating is 0'],
    max: [5, 'min rating is 5'],
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'Tour must have price']
  },
  priceDiscount: {
    type: Number,
    validate: function(val) {
      return val < this.price // 100 < 200
    }
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'tour must have summary']
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    trim: true,
    required: [true, 'tour must have cover image']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    // exclude field
    select: false
  },
  startDates: [Date],
  slug: String,
  secretTour: {
    type: Boolean,
    default: false,
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// virtual properties
tourSchema.virtual('durationWeeks').get(function() {
  return Math.round(this.duration / 7);
})



// const testTour = new Tour({
//   name: "Hello chika chika",
//   rating: 5.0,
//   price: 500
// });

// testTour.save()
// .then(() => { console.log("Data Saved.") })
// .catch((err) => console.log(err));


/* 
Types of middleware in mongoose
  1. Document
  2. Query
  3. Aggregate
  4. Model
*/

// DOCUMENT MIDDLEWARE run before .save() AND .create()
tourSchema.pre('save', function(next) {
  // console.log(this);
  this.slug = slugify(this.name, { lower: true })
  next();
})

tourSchema.post('save', function(doc, next) {
  console.log("SAVED DOC --->> ", doc);
  next();
})

// QUERY Middleware
tourSchema.pre(/^find/, function(next) { //for all types of find like find(), findById(), findOne etc
// tourSchema.pre('find', function(next) {
  this.find({
    secretTour: {$ne: true}
  })
  next();
})

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;