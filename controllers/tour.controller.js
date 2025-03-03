// const fs = require('fs')
const Tour = require('../models/tour.model');
const APIFeatures = require('../utils/apiFeatures');

// const tourFilePath = `${__dirname}/../dev-data/data/tours-simple.json`;
// const tours = JSON.parse(fs.readFileSync(tourFilePath));



const getAlltours = async (req, res) => {

    try {
        // const {
        //     difficulty, duration
        // } = req.query;
        // const toursList = await Tour.find()
        // .where('duration').equals(duration)
        // .where('difficulty').equals(difficulty.toString())



        // const queryObj = {...req.query}
        // const excludedFields = ['page', 'sort', 'limit', 'fields']
        // excludedFields.forEach(el => delete queryObj[el])

        // let queryStr = JSON.stringify(queryObj);
        // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        
        // // console.log(req.query, queryObj, JSON.parse(queryStr));

        // let query = Tour.find(JSON.parse(queryStr))

        // // sorting
        // if(req.query.sort) {
        //     const sortQuery = req.query.sort.split(',').join(' ')
        //     query = query.sort(sortQuery)
        // } else {
        //     query = query.sort('_id')
        // }

        // // fields limiting
        // if(req.query.fields) {
        //     const fields = req.query.fields.split(',').join(' ');
        //     // query = query.select('name duration price');
        //     query = query.select(fields)
        // } else {
        //     query = query.select('-__v')
        // }

        // pagination
        // query = query.skip(2).limit(5);
        // const page = req.query.page * 1 || 1;
        // const limit = req.query.limit * 1 || 100;
        // const skip = (page - 1) * limit;
        // query = query.skip(skip).limit(limit);


        // const totalDocs = await Tour.countDocuments() // Count total documents
        // // const totalPages = Math.ceil(totalDocs / limit)
        // if (skip >= totalDocs) {
        //     throw new Error("This page does not exist") // Skip exceeds the total documents, page is out of range
        // }

        // const toursList = await query;
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sorting()
            .limitFields()
            .paginate();

        const toursList = await features.query;

        // console.log(toursList)

        res.status(200).json({
            status: 'SUCCESS',
            result: toursList.length,
            data: {
                tours: toursList
            }
        })
    } catch(err) {
        // console.log(err.message)
        res.status(404).json({
            status: "FAIL",
            message: err.stack
        })
    }
};

const createNewTour = async (req, res) => {
    // console.log(req.body);

    // const newTour1 = new TourModel({});
    // newTour1.save()

    try {
        const newtour = await Tour.create(req.body);
    
        res.status(201).json({
            status: 'SUCCESS',
            message: "toure created successfully!",
            data: {
                tour: newtour
            }
        });
    } catch(err) {
        console.log(err)
        res.status(400).json({
            status: "FAIL",
            message: err
        })
    }

    // const newId = tours[tours.length - 1].id + 1;
    // const newTour = Object.assign({ id: newId }, req.body);

    // tours.push(newTour);

    // fs.writeFile(tourFilePath, JSON.stringify(tours), err => {
    //     res.status(201).json({
    //         status: 'SUCCESS',
    //         message: "toure created successfully!"
    //     });
    // })
};

const getTourById = async (req, res) => {
    // console.log(req.params);
    const { id } = req.params;
    const tour = await Tour.findById(id);
    // or Tour.findOne({ _id: id})
    try {
        res.status(200).json({
            status: 'SUCCESS',
            result: tour.length,
            data: {
                tour: tour
            }
        })
    } catch(err) {
        res.status(404).json({
            status: 'FAIL',
            message: "Invalid id"
        })
    }

    // const tour = tours.find((item) => item.id === parseInt(id));

    // if (parseInt(id) > tours.length || !tour) {
    //     res.status(404).json({
    //         status: 'FAIL',
    //         message: "Invalid id"
    //     })
    //     return
    // }

    // res.status(200).json({
    //     status: 'SUCCESS',
    //     result: tour.length,
    //     data: {
    //         tour: tour
    //     }
    // })
};

const updateTourById = async (req, res) => {
    const { id } = req.params;

    try {

        const tour = await Tour.findByIdAndUpdate(id, req.body, {
            new : true, // its return the new updated document ,
            runValidators: true, // it will run the model validations again
        });

        res.status(200).json({
            status: 'SUCCESS',
            message: "updated",
            data: {
                tour: tour
            }
        })
    } catch(err) {
        res.status(400).json({
            status: 'FAIL',
            message: "Failed to update >>>"+ err
        })
    }

    // const tour = tours.find((item) => item.id === parseInt(id));

    // if (parseInt(id) > tours.length || !tour) {
    //     res.status(404).json({
    //         status: 'FAIL',
    //         message: "Invalid id"
    //     })
    //     return
    // }

    // res.status(200).json({
    //     status: 'SUCCESS',
    //     message: "updated"
    // })
};

const deleteTour = async (req, res) => {

    try {
        const {id} = req.params;
    
        await Tour.findByIdAndDelete(id);

        res.status(200).json({
            status: 'SUCCESS',
            message: "deleted",
        })

    } catch(err) {
        res.status(400).json({
            status: 'FAIL',
            message: "Failed to delete >>> "+ err
        })
    }

}

const getTourStats = async (req, res) => {
    try {

        const allStats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id: null,
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                }
            }
        ]);

        const difficultyStats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id: { $toUpper: '$difficulty'},
                    // _id: '$difficulty',
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                }
            },
            {
                $sort: { avgPrice: 1 }
            }
        ]);


        if (!allStats || allStats.length === 0) {
            return res.status(404).json({
                status: 'FAIL',
                message: 'No stats found for the given criteria.'
            });
        }
        
        res.status(200).json({
            status: 'SUCCESS',
            data: {
                stats: allStats[0],
                difficultyStats: difficultyStats
            }
        })

    } catch(err) {
        res.status(400).json({
            status: 'FAIL',
            message: err.message
        })
    }
}

const getMonthlyPlan = async (req, res) => {
    try {
        const year = req.params.year * 1; // parsing to number
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: { 
                        $gte: new Date(`${year}-01-01`), 
                        $lte: new Date(`${year}-12-31`) 
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates' },
                    numOfTours: { $sum: 1 },
                    tours: {
                        $push: {
                            _id: '$_id',
                            name: '$name', 
                            price: '$price'
                        }
                    }
                }
            },
            {
                $addFields: { month: '$_id' }
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: { numOfTours: -1 }
            },
            { $limit: 2 }
        ])
        res.status(200).json({
            status: 'SUCCESS',
            data: {
                plan
            }
        })

    } catch(err) {
        res.status(400).json({
            status: 'FAIL',
            message: err.message
        })
    }
}

module.exports = {
    getAlltours,
    getTourById,
    createNewTour,
    updateTourById,
    deleteTour,
    getTourStats,
    getMonthlyPlan
}