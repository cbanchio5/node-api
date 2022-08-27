const AppError = require('../utils/appError');
const Tour = require('./../models/tourModel')
const APIFeatures = require('./../utils/apiFeatures')
const catchAsync = require('./../utils/catchAsync')
const factory = require('./handlerFactory')


exports.getALlTours = factory.getAll(Tour)
exports.getTour = factory.getOne(Tour, { path:'reviews' })
exports.updateTour = factory.updateOne(Tour)
exports.deleteTour = factory.deleteOne(Tour)
exports.createTour = factory.createOne(Tour)


// exports.deleteTour = catchAsync(async (req, res, next) => {
//     const tour = await Tour.findByIdAndDelete(req.params.id)

//     if(!tour) {
//       return next(new AppError('No tour found with that ID', 404));
//     }
//     res.status(204).json({
//       status: 'success',
//       data: null
//     })
//       });

exports.aliasTopTours =  (req, res, next) => {


  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();

}

exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
      {
        $match: {ratingAverage: {$gte: 4}}
      },
      {
        $group: {
          _id: {$toUpper:'$difficulty'},
          numRatings: {$sum: '$ratingQuantity'},
          numTours: {$sum:1},
          avgRating : {$avg: '$ratingAverage'},
          avgPrice: {$avg: '$price'},
          minPrice : {$min: '$price'},
          maxPrice : {$max: '$price'}

        }
      },
      {
        $sort: {
          avgPrice:1
        }
      }
    ])
    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    })
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year *1;

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
           _id: {$month: '$startDates'},
           numTourStarts :{$sum:1},
           tours: { $push: '$name'}
        }
      },
      {
        $addFields: {month: '$_id'}
      },
      {
        $project: {
          _id:0
        }
      },
      {
        $sort: {numTourStarts: -1}
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan
      }
    })

});

exports.getToursWithin = catchAsync(async(req, res, next) => {
  const {distance, latlng, unit} = req.params
  const [lat, lng] = latlng.split(',')
  const radious = unit === 'mi' ? distance / 3963.2 : distance / 6378.1

  if(!lat || !lng) {
    next(new AppError('Please provide latitude and longitude in the lat,lng', 400))
  }

  const tour = await Tour.find({
      startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radious]} }
  })

  res.status(200).json({
    status: 'Success',
    results: tour.length,
    data: {
      data: tour
    }
  })
})
