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


exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour'
  })
}
