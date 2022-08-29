const Tour = require('../models/tourModel')
const catchAsync = require('../utils/catchAsync')

exports.getOverview = catchAsync(async(req, res) => {

  //1 Get tour data
  const tours = await Tour.find()

  //2 Build Template

  //Render template
  res.status(200).render('overview', {
    title: 'All tours',
    tours
  })
})


exports.getTour = catchAsync(async (req, res) => {
  //1 Get data for the requested tour

  const tour = await Tour.findOne({ slug : req.params.slug }).populate({
    path:'reviews',
    fields: 'review rating user'
  })

  //2 Build template

  //3 Render template using data
  res.status(200).render('tour', {
    tour: tour
  })
})
