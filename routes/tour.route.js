const express = require('express');

const { 
    getAlltours, 
    createNewTour, 
    getTourById, 
    updateTourById,
    deleteTour,
    getTourStats,
    getMonthlyPlan
} = require('../controllers/tour.controller');
const { role } = require('../middlewares/role.middleware');


const router = express.Router();

router.get('/', getAlltours);
router.get('/stats', getTourStats);
router.get('/monthly-plan/:year', getMonthlyPlan);
router.post('/', createNewTour);
// router.get('/api/v1/tours/:id/:status?', (req, res) => { //:status? is optional
router.get('/:id', getTourById);
router.patch('/:id', updateTourById);
router.delete('/:id', role('admin', 'lead-guide'), deleteTour);


module.exports = router