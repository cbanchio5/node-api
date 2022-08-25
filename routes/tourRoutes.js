const express = require('express');
const tourController = require('./../controllers/tourController')
const router = express.Router();
const authController = require('./../controllers/authController')
const reviewRouter = require('./../routes/reviewRoutes')


// router.param('id', tourController.checkID);


router.use('/:tourId/reviews', reviewRouter)

router.route('/top-5-cheap').get(tourController.aliasTopTours,tourController.getALlTours)

router.route('/tour-stats').get(tourController.getTourStats)

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan)

router.route('/').get(authController.protect, tourController.getALlTours).post(tourController.createTour)

router.route('/:id').patch(tourController.updateTour).get(tourController.getTour).delete(authController.protect, authController.restricTo('admin', 'lead-guide'), tourController.deleteTour)



module.exports = router;
