const Tour = require("../models/tour.model");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const getAlltours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sorting()
    .limitFields()
    .paginate();

  const toursList = await features.query;

  res.status(200).json({
    status: "SUCCESS",
    result: toursList.length,
    data: {
      tours: toursList,
    },
  });
});

const createNewTour = catchAsync(async (req, res, next) => {
  const newtour = await Tour.create(req.body);

  res.status(201).json({
    status: "SUCCESS",
    message: "toure created successfully!",
    data: {
      tour: newtour,
    },
  });
});

const getTourById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findById(id);

  if (!tour) {
    return next(new AppError("No tour found with id:" + id, 404));
  }

  res.status(200).json({
    status: "SUCCESS",
    result: tour.length,
    data: {
      tour: tour,
    },
  });
});

const updateTourById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const tour = await Tour.findByIdAndUpdate(id, req.body, {
    new: true, // its return the new updated document ,
    runValidators: true, // it will run the model validations again
  });

  if (!tour) {
    return next(new AppError("No tour found with id:" + id, 404));
  }

  res.status(200).json({
    status: "SUCCESS",
    message: "updated",
    data: {
      tour: tour,
    },
  });
});

const deleteTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const tour = await Tour.findByIdAndDelete(id);

  if (!tour) {
    return next(new AppError("No tour found with id:" + id, 404));
  }

  res.status(200).json({
    status: "SUCCESS",
    message: "deleted",
  });
});

const getTourStats = catchAsync(async (req, res, next) => {
  const allStats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: null,
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
  ]);

  const difficultyStats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        // _id: '$difficulty',
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  if (!allStats || allStats.length === 0) {
    return res.status(404).json({
      status: "FAIL",
      message: "No stats found for the given criteria.",
    });
  }

  res.status(200).json({
    status: "SUCCESS",
    data: {
      stats: allStats[0],
      difficultyStats: difficultyStats,
    },
  });
});

const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // parsing to number
  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numOfTours: { $sum: 1 },
        tours: {
          $push: {
            _id: "$_id",
            name: "$name",
            price: "$price",
          },
        },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numOfTours: -1 },
    },
    { $limit: 2 },
  ]);
  res.status(200).json({
    status: "SUCCESS",
    data: {
      plan,
    },
  });
});

module.exports = {
  getAlltours,
  getTourById,
  createNewTour,
  updateTourById,
  deleteTour,
  getTourStats,
  getMonthlyPlan,
};
