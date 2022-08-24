const AppError = require('../utils/appError');
const Review = require('./../models/reviewModel')
const APIFeatures = require('./../utils/apiFeatures')
const catchAsync = require('./../utils/catchAsync')


exports.getAllReviews = catchAsync(async (req, res) => {
  const reviews = await Review.find().populate()

  //send response
  res.status(200).json({
    status:'Sucess',
    results: reviews.length,
    data: {
      reviews
    }
    });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const newReview = await Review.create(req.body);

  res.status(201).json({
    status:'Sucess',
    data: {
      review:newReview
    }
    });

  });
