const fs = require('fs')
const Tour = require('../models/tour.model');

const tourFilePath = `${__dirname}/../dev-data/data/tours-simple.json`;
const tours = JSON.parse(fs.readFileSync(tourFilePath));


const getAlltours = async (req, res) => {

    const toursList = await Tour.find({})

    res.status(200).json({
        status: 'SUCCESS',
        result: toursList.length,
        data: {
            tours: toursList
        }
    })
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

module.exports = {
    getAlltours,
    getTourById,
    createNewTour,
    updateTourById,
    deleteTour
}