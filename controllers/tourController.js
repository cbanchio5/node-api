

const AppError = require('../utils/appError');
const Tour = require('./../models/tourModel')
const APIFeatures = require('./../utils/apiFeatures')
const catchAsync = require('./../utils/catchAsync')


exports.getALlTours = catchAsync(async (req, res) => {
    const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    const tours = await features.query;
    //send response
    res.status(200).json({
      status:'Sucess',
      results: tours.length,
      data: {
        tours
      }
      });
  });



exports.createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status:'Sucess',
      data: {
        tour:newTour
      }
      });

    });

exports.getTour = catchAsync(async (req, res, next) => {
        const tour = await Tour.findById(req.params.id)

        if(!tour) {
          return next(new AppError('No tour found with that ID', 404));
        }

        res.status(200).json({
          status:'success',
          data: {
            tour
          }
        })
      });

exports.updateTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new:true,
      runValidators: true
    })

    if(!tour) {
      return next(new AppError('No tour found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    })
      });

exports.deleteTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id)

    if(!tour) {
      return next(new AppError('No tour found with that ID', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null
    })
      });

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