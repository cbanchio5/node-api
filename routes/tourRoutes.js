const express = require('express');
const tourController = require('./../controllers/tourController')
const router = express.Router();
const authController = require('./../controllers/authController')


// router.param('id', tourController.checkID);



router.route('/top-5-cheap').get(tourController.aliasTopTours,tourController.getALlTours)

router.route('/tour-stats').get(tourController.getTourStats)

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan)

router.route('/').get(authController.protect, tourController.getALlTours).post(tourController.createTour)

router.route('/:id').patch(tourController.updateTour).get(tourController.getTour).delete(tourController.deleteTour)



module.exports = router;
