const express = require('express');
const tourController = require('./../controllers/tourController')
const router = express.Router();
const authController = require('./../controllers/authController')
const reviewRouter = require('./../routes/reviewRoutes')


// router.param('id', tourController.checkID);


router.use('/:tourId/reviews', reviewRouter)

router.route('/top-5-cheap')
.get(tourController.aliasTopTours,tourController.getALlTours)

router.route('/tour-stats')
.get(tourController.getTourStats)

router.route('/monthly-plan/:year')
.get(authController.protect, authController.restricTo('admin', 'lead-guide', 'guide'), tourController.getMonthlyPlan)

router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getToursWithin)

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances)

router.route('/')
.get(tourController.getALlTours)
.post(authController.protect, authController.restricTo('admin', 'lead-guide'),tourController.createTour)

router.route('/:id')
.patch(authController.protect, authController.restricTo('admin', 'lead-guide'), tourController.updateTour)
.get(tourController.getTour)
.delete(authController.protect, authController.restricTo('admin', 'lead-guide'), tourController.deleteTour)



module.exports = router;
