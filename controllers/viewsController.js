const Tour = require('../models/tourModel')
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const MAPBOX_API = process.env.APIKEY_MAPBOX
const AppError = require('./../utils/appError')

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


exports.getTour = catchAsync(async (req, res, next) => {
  //1 Get data for the requested tour

  const tour = await Tour.findOne({ slug : req.params.slug }).populate({
    path:'reviews',
    fields: 'review rating user'
  })

  //2 Build template

  //3 Render template using data

  if(!tour) {
    return next(new AppError('There is no tour with that name', 404))

  }


res.status(200).set(

  'Content-Security-Policy',

  "default-src 'self' https://*.mapbox.com; base-uri 'self'; block-all-mixed-content; font-src 'self' https:; frame-ancestors 'self'; img-src 'self' blob: data:; object-src 'none'; script-src 'unsafe-inline' https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob:; style-src 'self' https: 'unsafe-inline'; upgrade-insecure-requests;"

).render('tour', {

    title: `${tour.name} Tour`,

    tour: tour,

    mapbox_api: MAPBOX_API,


});
})


exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your Account'
  })
}

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  })
}

exports.updateUserData = catchAsync(async(req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(req.user.id, {
    name:req.body.name,
    email: req.body.email
  }, {
    new:true,
    runValidators: true
  })

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  })
})
